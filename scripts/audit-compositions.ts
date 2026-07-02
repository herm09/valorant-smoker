/**
 * Audit script — composition integrity checker
 *
 * Reads every composition from the database, resolves agent IDs against the
 * static agents data, and runs validateTeam on each one.
 *
 * Exit code 0 → all compositions are valid
 * Exit code 1 → at least one composition violates a game rule
 *
 * Usage: npm run audit
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { agents as allAgents } from "../src/data/agents";
import { validateTeam } from "../src/lib/composition/validate-team";
import type { Agent } from "../src/types/valorant";

const prisma = new PrismaClient();

async function main(): Promise<void> {
    console.log("=== Valorant Team Builder — Composition Audit ===\n");

    const compositions = await prisma.composition.findMany({
        orderBy: { createdAt: "desc" },
    });

    if (compositions.length === 0) {
        console.log("No compositions found in database.");
        return;
    }

    console.log(`Checking ${compositions.length} composition(s)...\n`);

    let invalidCount = 0;

    for (const comp of compositions) {
        const resolved: Agent[] = comp.agentIds
            .map((id) => allAgents.find((a) => a.id === id))
            .filter((a): a is Agent => a !== undefined);

        const missingIds = comp.agentIds.filter(
            (id) => !allAgents.find((a) => a.id === id)
        );

        const { valid, errors } = validateTeam(resolved);

        const statusIcon = valid && missingIds.length === 0 ? "✓" : "✗";
        console.log(`${statusIcon} [${comp.id.slice(0, 8)}] "${comp.name}" — map: ${comp.mapId}`);

        if (missingIds.length > 0) {
            console.log(`    ⚠ Unknown agent IDs: ${missingIds.join(", ")}`);
            invalidCount++;
        }

        if (!valid) {
            for (const error of errors) {
                console.log(`    ✗ ${error}`);
            }
            invalidCount++;
        }
    }

    console.log(`\n─────────────────────────────────────────`);
    console.log(`Total : ${compositions.length} | Valid : ${compositions.length - invalidCount} | Invalid : ${invalidCount}`);

    if (invalidCount > 0) {
        console.log("\nAudit FAILED — see errors above.");
        process.exit(1);
    } else {
        console.log("\nAudit PASSED — all compositions respect game rules.");
    }
}

main()
    .catch((err) => {
        console.error("Audit error:", err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
