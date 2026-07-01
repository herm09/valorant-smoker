import Link from "next/link";
import { prisma } from "../../lib/db";
import { maps } from "../../data/maps";
import SmokeLayoutCard from "../../components/smoke-layout-card";
import type { StoredSmoke } from "../../types/valorant";

export default async function CommunityPage() {
    const layouts = await prisma.smokeLayout.findMany({
        where:   { isPublic: true },
        include: { user: { select: { email: true } } },
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="min-h-screen p-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-4xl font-bold">Community Smoke Layouts</h1>
            </div>

            {layouts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <p className="text-gray-400">No public layouts yet.</p>
                    <p className="mt-2 text-sm text-gray-600">
                        Save a smoke layout and check "Make public" to share it here.
                    </p>
                    <Link
                        href="/"
                        className="mt-4 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
                    >
                        Browse Maps
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {layouts.map((layout) => {
                        const map = maps.find((m) => m.id === layout.mapId);
                        const smokeCount = Array.isArray(layout.smokes)
                            ? (layout.smokes as unknown as StoredSmoke[]).length
                            : 0;

                        return (
                            <SmokeLayoutCard
                                key={layout.id}
                                id={layout.id}
                                name={layout.name}
                                mapName={map?.name ?? layout.mapId}
                                mapImage={map?.image ?? ""}
                                smokeCount={smokeCount}
                                authorEmail={layout.user.email}
                                createdAt={layout.createdAt}
                            />
                        );
                    })}
                </div>
            )}
        </main>
    );
}
