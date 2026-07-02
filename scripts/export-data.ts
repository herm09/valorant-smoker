/**
 * Export script — full data export to JSON
 *
 * Reads all users, compositions and smoke layouts from the database
 * and writes a structured JSON file to exports/data-export.json.
 *
 * Transverse skill: this pattern (read DB → serialize → write file) is
 * reusable in any data-driven application regardless of domain.
 *
 * Exit code 0 → export successful
 * Exit code 1 → database or file system error
 *
 * Usage: npm run export:data
 */

import "dotenv/config";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const OUTPUT_DIR  = join(process.cwd(), "exports");
const OUTPUT_FILE = join(OUTPUT_DIR, "data-export.json");

async function main(): Promise<void> {
    console.log("=== Valorant Team Builder — Data Export ===\n");

    const users = await prisma.user.findMany({
        select: {
            id:       true,
            email:    true,
            username: true,
            createdAt: true,
            compositions: {
                select: {
                    id:       true,
                    name:     true,
                    mapId:    true,
                    agentIds: true,
                    createdAt: true,
                },
                orderBy: { createdAt: "desc" },
            },
            smokeLayouts: {
                select: {
                    id:       true,
                    name:     true,
                    mapId:    true,
                    isPublic: true,
                    smokes:   true,
                    createdAt: true,
                },
                orderBy: { createdAt: "desc" },
            },
        },
        orderBy: { createdAt: "asc" },
    });

    const totalCompositions  = users.reduce((n, u) => n + u.compositions.length,  0);
    const totalSmokeLayouts  = users.reduce((n, u) => n + u.smokeLayouts.length,  0);

    const payload = {
        exportedAt:        new Date().toISOString(),
        stats: {
            users:         users.length,
            compositions:  totalCompositions,
            smokeLayouts:  totalSmokeLayouts,
        },
        users,
    };

    mkdirSync(OUTPUT_DIR, { recursive: true });
    writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), "utf-8");

    console.log(`Users          : ${users.length}`);
    console.log(`Compositions   : ${totalCompositions}`);
    console.log(`Smoke layouts  : ${totalSmokeLayouts}`);
    console.log(`\nExported to    : exports/data-export.json`);
    console.log("\nExport DONE.");
}

main()
    .catch((err) => {
        console.error("Export error:", err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
