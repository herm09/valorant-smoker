---
name: audit-compositions
description: Audit all saved compositions against game rules. Runs a deterministic TypeScript script — no LLM involved. Use when the user asks to check, validate, or audit compositions in the database.
---

Run the composition audit script and report the results.

## Steps

1. Run the script:
   ```bash
   npm run audit:compositions
   ```

2. Read the output:
   - Lines starting with `✓` = composition passes all game rules
   - Lines starting with `✗` = composition violates at least one rule
   - Lines starting with `⚠` = composition contains unknown agent IDs

3. Report back to the user:
   - How many compositions were checked
   - Which ones failed and why (copy the exact error lines)
   - The final PASSED / FAILED verdict

## What the script checks

- Exactly 5 agents per composition
- No duplicate agents
- At most 2 Duelists
- At least 1 Controller
- All agent IDs exist in `src/data/agents.ts`

## Exit codes

- `0` → all compositions valid
- `1` → at least one composition is invalid or the script itself errored

## Do NOT

- Do not modify the database to fix invalid compositions without asking the user first
- Do not re-run the script in a loop — one run is sufficient
