@AGENTS.md
# Valorant Team Builder — Notes pour Claude

## Pitch (1 phrase)

Application permettant aux joueurs de sélectionner une map Valorant, générer ou construire une composition d'équipe optimale, visualiser les positions stratégiques (smokes, contrôles de zones) et sauvegarder leurs compositions favorites.

## Stack technique

- **Langage** : TypeScript 5 (strict mode, pas de `any`)
- **Framework** : Next.js 16.2.9 — App Router, Server Components par défaut
- **Styling** : Tailwind CSS 4
- **DB** : aucune pour l'instant — persistance via `localStorage`
- **Auth** : aucune
- **Tests** : aucun configuré pour l'instant

## Structure du projet

```
src/
├── app/              ← App Router Next.js (routes, layouts, pages)
│   └── maps/[id]/    ← page détail d'une map
├── components/       ← composants React réutilisables (à créer)
├── data/
│   ├── agents.ts     ← liste des agents avec rôles (source de vérité)
│   └── maps.ts       ← liste des maps avec smoke spots (source de vérité)
├── lib/
│   └── composition/  ← logique métier de composition (à créer)
├── config/           ← constantes business (à créer)
└── types/
    └── valorant.ts   ← types TypeScript du domaine
app/                  ← ⚠️ LEGACY — à migrer dans src/app/ (voir ci-dessous)
```

> ⚠️ **Double répertoire app/** : `app/page.tsx` (racine) coexiste avec `src/app/`. À unifier dans `src/app/` avant d'ajouter des features.

**Alias TypeScript** : `@/*` pointe sur la racine du projet (`./*`), pas sur `src/`.

## Règles métier critiques (à NE JAMAIS casser)

1. Une composition doit toujours contenir exactement 5 agents.
2. Un agent ne peut apparaître qu'une seule fois dans une composition.
3. Une composition est toujours associée à une map.
4. Les smokes affichés doivent toujours appartenir à la map sélectionnée.
5. Une composition générée doit contenir au moins un Controller.
6. Une composition générée doit contenir au maximum deux Duelists.
7. Les coordonnées des smokes sont dans `src/data/maps.ts` — jamais hardcodées dans un composant.

## Données de référence

Ces fichiers sont la **source de vérité** — lire, JAMAIS inventer ni dupliquer :

- `src/data/agents.ts` → liste complète des agents (id, name, role, image)
- `src/data/maps.ts` → liste des maps avec smoke spots et coordonnées

Ces fichiers (à créer au fil des besoins) contiennent la logique métier :

- `src/lib/composition/validate-team.ts` → validation des règles de composition
- `src/lib/composition/generate-team.ts` → génération d'une composition optimale
- `src/config/game-rules.ts` → constantes (nb agents par rôle, max Duelists, etc.)

## Conventions de code

- **Nommage fichiers** : kebab-case (`agent-card.tsx`)
- **Nommage variables/fonctions** : camelCase
- **Pas de `any` TypeScript** — si le type est flou, demande
- **Toute erreur doit être loggée ou re-throw** — pas de `catch` vide
- **Un fichier = une responsabilité** — >250 lignes → découper

## Anti-patterns SPÉCIFIQUES au projet

- ❌ Ne JAMAIS inventer les données d'un agent ou d'une map — toujours lire `src/data/`
- ❌ Ne JAMAIS mettre la logique de composition dans un composant React — toujours dans `src/lib/composition/`
- ❌ Ne JAMAIS hardcoder les règles du jeu (nb rôles, limites) — toujours dans `src/config/game-rules.ts`
- ❌ Ne JAMAIS positionner un smoke spot avec des pixels fixes — utiliser des coordonnées `x/y` en `%` relatives à la taille de l'image

## Anti-patterns d'INGÉNIERIE (les 7 commandements transverses)

1. ❌ **Big bang refacto** : pas de feature flag, pas de coexistence. Remplace, nettoie, commit.
2. ❌ **No stub / no TODO** : pas de `return null; // TODO`. Si commité, ça MARCHE.
3. ❌ **No silent fail** : pas de `try/catch` qui avale. Log ou re-throw.
4. ❌ **No revert** : corrige forward, jamais backward.
5. ❌ **No god file** : >250 lignes = découpe.
6. ❌ **No magic number** : valeurs business → `src/config/game-rules.ts`.
7. ❌ **No vibe-prompt** : prompt précis ou pas de prompt.

## Commandes utiles

- `npm run dev` → lance le serveur de dev (port 3000)
- `npm run build` → compile le projet
- `npm run lint` → vérifie les règles ESLint

## Fichiers de référence

- `src/types/valorant.ts` → types TypeScript du domaine (`Agent`, `SmokeSpot`, `ValorantMap`, `TeamComposition`)
- `src/data/agents.ts` → données agents
- `src/data/maps.ts` → données maps avec smoke spots