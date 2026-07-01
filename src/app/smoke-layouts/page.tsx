import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { prisma } from "../../lib/db";
import { maps } from "../../data/maps";
import { parseStoredSmokes } from "../../lib/smoke-json";
import MyLayoutCard from "../../components/my-layout-card";

export default async function SmokeLayoutsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const layouts = await prisma.smokeLayout.findMany({
        where:   { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="min-h-screen p-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-4xl font-bold text-white light:text-gray-900">My Smoke Layouts</h1>
                <Link
                    href="/"
                    className="text-sm text-gray-500 transition-colors hover:text-gray-100 light:hover:text-gray-700"
                >
                    ← Maps
                </Link>
            </div>

            {layouts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <p className="text-gray-400 light:text-gray-500">No smoke layouts yet.</p>
                    <p className="mt-2 text-sm text-gray-600 light:text-gray-400">
                        Browse a map, place smokes, and save your layout.
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
                        const smokeCount = parseStoredSmokes(layout.smokes).length;
                        return (
                            <MyLayoutCard
                                key={layout.id}
                                id={layout.id}
                                name={layout.name}
                                mapName={map?.name ?? layout.mapId}
                                mapImage={map?.image ?? ""}
                                smokeCount={smokeCount}
                                isPublic={layout.isPublic}
                                createdAt={layout.createdAt}
                            />
                        );
                    })}
                </div>
            )}
        </main>
    );
}
