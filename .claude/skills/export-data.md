---
name: export-data
description: Export all user data (compositions and smoke layouts) from the database to exports/data-export.json. Use when the user asks to export, backup, or dump the database content.
---

Run the data export script and report the results.

## Steps

1. Run the script:
   ```bash
   npm run export:data
   ```

2. Read the console output to get the counts (users, compositions, smoke layouts).

3. The file `exports/data-export.json` now contains the full export.

4. Report back to the user:
   - How many users, compositions, and smoke layouts were exported
   - The path to the generated file
   - Offer to show a sample of the file if the user wants to inspect it

## Do NOT

- Do not read the full `exports/data-export.json` file into your context unless the user specifically asks — it can be large
- Do not modify the export file
- Do not run the script more than once per request
