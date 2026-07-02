# Skill — audit:compositions

## Ce que fait ce skill

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

---

## Pourquoi ce skill existe

L'UI valide les compositions avant de les sauvegarder, mais elle ne peut pas détecter :
- un agent dont l'ID aurait changé dans `src/data/agents.ts` après sauvegarde
- une composition insérée directement en DB sans passer par l'interface
- une régression sur les règles métier après un refactoring de `validateTeam`

Ce script permet de détecter ces cas sans avoir à ouvrir le navigateur.

---

## Pourquoi c'est déterministe

Le script ne fait appel à aucun LLM. Pour un même état de la base de données, il produit toujours le même résultat. La logique de validation (`validateTeam`) est une fonction pure : pas d'aléatoire, pas d'effet de bord, pas de réseau.

```
DB (Neon)
   └─ compositions
         └─ agentIds: ["jett", "omen", ...]
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

---

## Fichier source

[`scripts/audit-compositions.ts`](scripts/audit-compositions.ts)

---

## Ce que vérifie le script

| Règle | Source |
|---|---|
| Exactement 5 agents | `TEAM_SIZE` dans `src/config/game-rules.ts` |
| Pas de doublon | détection via `Set` sur les IDs |
| Maximum 2 Duelists | `MAX_DUELISTS` dans `src/config/game-rules.ts` |
| Au minimum 1 Controller | `MIN_CONTROLLERS` dans `src/config/game-rules.ts` |
| Aucun ID d'agent inconnu | comparaison avec `src/data/agents.ts` |

---

## Comment brancher ça en CI (Vercel / GitHub Actions)

```yaml
# .github/workflows/audit.yml
- name: Audit compositions
  run: npm run audit:compositions
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

Si une composition est invalide, le workflow échoue (`exit 1`) et bloque le déploiement.
