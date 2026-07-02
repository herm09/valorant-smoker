# Décisions techniques — Valorant Team Builder

Ce document enregistre les décisions architecturales significatives prises pendant le projet : ce qui a été choisi, pourquoi, et ce qui a été écarté.

---

## D-01 — Next.js App Router plutôt que Pages Router

**Contexte**
Next.js propose deux systèmes de routage : l'ancien Pages Router (`pages/`) et le nouvel App Router (`app/`), stable depuis Next.js 13.

**Décision**
App Router avec Server Components par défaut.

**Pourquoi**
- Les pages qui ne nécessitent pas d'interactivité (liste des maps, compositions sauvegardées) sont rendues côté serveur sans envoyer de JavaScript au client. La page `/community` affiche des données en base sans une seule ligne de JS côté navigateur.
- Les Server Actions remplacent les routes API pour les mutations (save, delete). Un formulaire HTML `<form action={saveComposition}>` fonctionne même sans JavaScript activé.
- La séparation Client/Serveur est explicite : `"use client"` est une déclaration d'intention, pas implicite.

**Ce qui a été écarté**
Pages Router : toujours viable, mais oblige à créer des routes API (`/api/compositions`) pour chaque mutation, ce qui double la surface de code à maintenir.

**Contrepartie acceptée**
La frontière Client/Serveur crée des règles à connaître : pas d'event handlers dans un Server Component (erreur apprise en production quand `onError` sur une `<img>` a crashé silencieusement une page), pas de `useState` côté serveur.

---

## D-02 — Server Actions plutôt qu'une API REST

**Contexte**
Pour sauvegarder une composition ou supprimer un layout, il faut un mécanisme pour déclencher une écriture en base depuis le navigateur.

**Décision**
Server Actions (`"use server"`) directement importées dans les composants.

**Pourquoi**
- Pas d'endpoint à déclarer, pas de `fetch` manuel, pas de gestion de `Content-Type`.
- L'authentification est vérifiée dans la même fonction, au même endroit que la logique métier.
- CSRF est géré automatiquement par Next.js via un token opaque dans la requête.
- Le typage TypeScript est bout-en-bout : si la signature de `saveComposition` change, le compilateur l'indique partout où elle est appelée.

**Ce qui a été écarté**
API REST (`/api/compositions` avec `POST`/`DELETE`) : plus portable (utilisable par une app mobile future), mais plus verbeux pour ce projet qui n'a qu'un seul client.

**Contrepartie acceptée**
Les Server Actions sont couplées à Next.js — ce code ne fonctionnerait pas dans une autre stack. C'est un compromis assumé pour un projet qui n'a pas vocation à avoir plusieurs clients.

---

## D-03 — Données agents et maps en TypeScript statique plutôt qu'en base

**Contexte**
L'app a besoin des 25 agents et 11 maps Valorant avec leurs métadonnées (rôle, image, smoke spots).

**Décision**
Fichiers TypeScript dans `src/data/agents.ts` et `src/data/maps.ts`, versionnés avec le code.

**Pourquoi**
- Ces données ne changent qu'à chaque patch Valorant (toutes les 2-3 semaines). Une table en base apporterait une requête réseau supplémentaire à chaque chargement de page pour des données quasi-immuables.
- Le typage est total : `Agent`, `ValorantMap`, `SmokeSpot` sont définis dans `src/types/valorant.ts` et le compilateur vérifie chaque entrée.
- Pas de phase de seed à gérer en déploiement.

**Ce qui a été écarté**
Table `Agent` et table `Map` en base : nécessiterait une migration à chaque nouveau patch, une logique de synchronisation, et des jointures dans chaque requête de composition.

**Contrepartie acceptée (dette identifiée)**
Les `agentIds` stockés en base (`["jett", "omen", ...]`) ne sont liés à rien en SQL — aucune foreign key. Si un ID d'agent change dans `agents.ts`, les compositions existantes perdent silencieusement cet agent. C'est détectable via le script `npm run audit:compositions`.

---

## D-04 — JWT plutôt que sessions base de données

**Contexte**
NextAuth propose deux stratégies : `"jwt"` (token signé dans un cookie) et `"database"` (session stockée en base, cookie = identifiant).

**Décision**
Stratégie `"jwt"`.

**Pourquoi**
- Pas de table `Session` à gérer en base, pas de cleanup des sessions expirées.
- Chaque requête est auto-suffisante : le serveur vérifie la signature du cookie sans aller en base.
- Pour un projet avec un seul type d'utilisateur et pas de besoin de révocation immédiate, c'est suffisant.

**Ce qui a été écarté**
Stratégie `"database"` : permet d'invalider une session immédiatement (utile si un compte est compromis), mais ajoute une requête DB à chaque requête HTTP.

**Contrepartie acceptée (dette identifiée)**
Le JWT est créé au moment du `signIn` et contient l'email à cet instant. Si l'utilisateur change son email sur la page profil, le JWT garde l'ancien email jusqu'à la prochaine connexion. La nav affiche donc temporairement l'ancien email. Le fix serait de forcer un `signOut` après un changement d'email, ou de passer à la stratégie `"database"`.

---

## D-05 — Colonne `Json` pour les smokes plutôt qu'une table `Smoke`

**Contexte**
Un smoke layout contient un tableau de positions (`x`, `y`, `label`, `team`). Il faut stocker ces données en base.

**Décision**
Colonne `smokes Json` dans la table `SmokeLayout`.

**Pourquoi**
- Un layout et ses smokes sont toujours lus ensemble — une seule requête suffit, pas de jointure.
- Le nombre de smokes par layout est variable (0 à ~20) et n'a pas besoin d'être interrogé indépendamment.
- Simple à écrire, simple à lire.

**Ce qui a été écarté**
Table `Smoke` séparée avec `layoutId` en foreign key : permettrait des requêtes sur les smokes individuels (ex: "tous les smokes sur le site A"), mais surcharge le schema pour un usage qui ne le justifie pas.

**Contrepartie acceptée (dette identifiée)**
Aucune validation au niveau SQL — la base accepte n'importe quoi. À la lecture, `parseStoredSmokes()` filtre les entrées invalides via un type guard, mais une entrée corrompue disparaît silencieusement. Le double `JSON.parse(JSON.stringify(...))` lors de l'écriture est un contournement de la sérialisation Prisma.

---

## D-06 — Tailwind CSS v4 dark-first avec variant `light:` custom

**Contexte**
Tailwind CSS v4 a changé la gestion du mode sombre. L'approche conventionnelle utilise `dark:` pour les thèmes sombres.

**Décision**
Dark mode par défaut (pas de classe nécessaire), variant `light:` custom activé par la classe `.light` sur `<html>`.

```css
/* globals.css */
@custom-variant light (&:is(.light *));
```

**Pourquoi**
- Le design cible est sombre (Valorant est un jeu à interface sombre). Le dark mode est l'état de base, pas l'exception.
- `next-themes` applique la classe `light` ou rien — plus cohérent avec cette logique.

**Ce qui a été écarté**
Convention Tailwind standard (`dark:` pour le sombre, rien pour le clair) : aurait requis d'ajouter `dark:` à chaque classe sombre, soit la majorité des classes du projet.

**Contrepartie acceptée**
Ce pattern est inverse de la convention Tailwind. Un développeur qui arrive sur le projet et écrit `dark:bg-gray-900` ne comprendra pas pourquoi ça ne fonctionne pas — il faut lire `globals.css` pour comprendre la logique.

---

## D-07 — Logique métier séparée de l'UI dans `src/lib/composition/`

**Contexte**
Les règles de composition (5 agents, max 2 Duelists, min 1 Controller, génération automatique) pouvaient vivre dans le composant `TeamBuilder`.

**Décision**
Deux fonctions pures dans `src/lib/composition/` : `validateTeam` et `generateTeam`. Les constantes dans `src/config/game-rules.ts`.

**Pourquoi**
- Les fonctions pures sont testables unitairement sans navigateur.
- Si les règles du jeu changent (Riot a déjà modifié le nombre d'agents par rôle), un seul fichier change.
- La même logique de validation est utilisée par l'UI ET par le script d'audit (`npm run audit:compositions`) — si elle était dans le composant, elle ne serait pas réutilisable.

**Ce qui a été écarté**
Logique inline dans `TeamBuilder` : plus rapide à écrire, mais impossible à tester, impossible à réutiliser, et impossible à maintenir quand le composant dépasse 250 lignes.

**Contrepartie acceptée**
Néant — c'est la décision sans vrai compromis. La seule contrepartie est le coût d'organisation initial.

---

## D-08 — Prisma + Neon (PostgreSQL serverless) plutôt que SQLite ou Supabase

**Contexte**
Le projet nécessite une base de données persistante avec authentification utilisateur.

**Décision**
PostgreSQL hébergé sur Neon, accédé via Prisma ORM.

**Pourquoi**
- Neon est gratuit pour les petits projets, compatible Vercel (même région), et propose des connexions poolées adaptées aux fonctions serverless.
- Prisma génère un client TypeScript typé depuis le schema — `prisma.composition.create({ data: { name: 123 } })` est une erreur de compilation, pas une erreur runtime.
- PostgreSQL supporte les tableaux natifs (`String[]` pour `agentIds`) sans contournement.

**Ce qui a été écarté**
- SQLite : pas adapté à un déploiement serverless (fichier local, pas de concurrence).
- Supabase : surcharge pour ce projet, introduit une dépendance à un SDK supplémentaire.
- MongoDB : pas adapté à des données relationnelles avec foreign keys et CASCADE delete.

**Contrepartie acceptée**
Prisma 6.19.3 est en conflit de version avec l'extension VS Code Prisma (qui a migré vers v7). L'extension affiche une erreur sur `url = env("DATABASE_URL")` dans `schema.prisma`. Le fix complet nécessite une mise à jour de Node.js (22.11 → 22.12+) puis de Prisma vers v7. En attendant, l'app compile et fonctionne correctement malgré l'indicateur rouge dans l'éditeur.
