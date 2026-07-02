# Skills — Valorant Team Builder

Ce projet expose deux skills exécutables : un skill **métier** lié aux règles de Valorant, un skill **transverse** réutilisable dans n'importe quelle application CRUD.

---

## Skill 1 — audit:compositions (métier)

### Ce que fait ce skill

Vérifie l'intégrité de toutes les compositions sauvegardées en base de données en les passant à travers la même logique de validation que l'interface utilisateur.

**Commande :**
```bash
npm run audit:compositions
```

**Résultat attendu :**
```
=== Valorant Team Builder — Composition Audit ===

Checking 2 composition(s)...

✓ [cmr26363] "Lotus 1" — map: lotus
✓ [cmr1rft5] "team 1" — map: ascent

─────────────────────────────────────────
Total : 2 | Valid : 2 | Invalid : 0

Audit PASSED — all compositions respect game rules.
```

Exit code `0` si tout est valide, `1` si au moins une composition est en erreur.

### Pourquoi c'est un skill métier

Les règles vérifiées sont spécifiques à Valorant :
- Exactement 5 agents par équipe (`TEAM_SIZE`)
- Pas de doublon d'agent
- Maximum 2 Duelists (`MAX_DUELISTS`)
- Minimum 1 Controller (`MIN_CONTROLLERS`)
- Tous les IDs d'agents existent dans `src/data/agents.ts`

Ces constantes viennent de `src/config/game-rules.ts`. Si Riot Games modifie les règles, ce fichier change — et l'audit se met à jour automatiquement.

### Pourquoi c'est déterministe

Le script réutilise `validateTeam` — une fonction pure sans effet de bord. Pour un même état de base de données, il produit toujours le même résultat.

```
DB (Neon)
   └─ compositions.agentIds: ["jett", "omen", ...]
               │
               ▼
        agents.ts (données statiques)
               │
               ▼
        validateTeam(agents[]) → { valid, errors }
               │
               ▼
        Rapport console + exit code
```

### Fichier source

[`scripts/audit-compositions.ts`](scripts/audit-compositions.ts)

### Ce que vérifie le script

| Règle | Constante source |
|---|---|
| Exactement 5 agents | `TEAM_SIZE` dans `src/config/game-rules.ts` |
| Pas de doublon | détection via `Set` sur les IDs |
| Maximum 2 Duelists | `MAX_DUELISTS` dans `src/config/game-rules.ts` |
| Au minimum 1 Controller | `MIN_CONTROLLERS` dans `src/config/game-rules.ts` |
| Aucun ID d'agent inconnu | comparaison avec `src/data/agents.ts` |

### Intégration CI

```yaml
# .github/workflows/audit.yml
- name: Audit compositions
  run: npm run audit:compositions
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

Si une composition est invalide, le workflow échoue (`exit 1`) et bloque le déploiement.

---

## Skill 2 — export:data (transverse)

### Ce que fait ce skill

Exporte l'ensemble des données utilisateur (compositions et smoke layouts) depuis la base de données vers un fichier JSON structuré.

**Commande :**
```bash
npm run export:data
```

**Résultat attendu :**
```
=== Valorant Team Builder — Data Export ===

Users          : 2
Compositions   : 2
Smoke layouts  : 1

Exported to    : exports/data-export.json

Export DONE.
```

Le fichier `exports/data-export.json` est créé (ou écrasé) à chaque exécution.

### Pourquoi c'est un skill transverse

Le pattern `lire la base → sérialiser → écrire un fichier` est indépendant du domaine Valorant. La même structure de script fonctionne pour n'importe quelle application qui stocke des données utilisateur : e-commerce (commandes), blog (articles), SaaS (abonnements). Seul le `select` Prisma change.

Usages concrets :
- **Backup** avant une migration de base de données
- **Portabilité** : l'utilisateur peut récupérer ses données
- **Debug** : inspecter l'état réel de la base sans passer par l'UI
- **Reporting** : base pour générer des statistiques

### Structure du fichier produit

```json
{
  "exportedAt": "2026-07-02T08:00:00.000Z",
  "stats": {
    "users": 2,
    "compositions": 2,
    "smokeLayouts": 1
  },
  "users": [
    {
      "id": "...",
      "email": "...",
      "username": null,
      "createdAt": "...",
      "compositions": [...],
      "smokeLayouts": [...]
    }
  ]
}
```

### Pourquoi c'est déterministe

Pour un même état de base de données, le script produit toujours le même fichier JSON (même contenu, même structure). Aucun LLM, aucun aléatoire, aucun appel réseau externe.

```
DB (Neon)
   ├─ users
   ├─ compositions  (triées par createdAt desc)
   └─ smokeLayouts  (triées par createdAt desc)
               │
               ▼
        JSON.stringify(payload, null, 2)
               │
               ▼
        exports/data-export.json
```

### Fichier source

[`scripts/export-data.ts`](scripts/export-data.ts)

### Ce que contient l'export

| Champ | Type | Description |
|---|---|---|
| `exportedAt` | ISO 8601 string | Horodatage de l'export |
| `stats.users` | number | Nombre d'utilisateurs |
| `stats.compositions` | number | Total de compositions |
| `stats.smokeLayouts` | number | Total de smoke layouts |
| `users[].compositions` | array | Compositions de l'utilisateur |
| `users[].smokeLayouts` | array | Smoke layouts de l'utilisateur |

> Le mot de passe haché (`password`) est exclu de l'export via le `select` Prisma.
