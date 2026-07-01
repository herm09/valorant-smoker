import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { prisma } from "../../lib/db";
import { agents as allAgents } from "../../data/agents";
import { maps } from "../../data/maps";
import CompositionCard from "../../components/composition-card";

export default async function CompositionsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const compositions = await prisma.composition.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="min-h-screen p-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-4xl font-bold">My Compositions</h1>
                <Link
                    href="/"
                    className="text-sm text-gray-500 transition-colors hover:text-gray-100"
                >
                    ← Maps
                </Link>
            </div>

            {compositions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <p className="text-gray-400">No compositions saved yet.</p>
                    <Link
                        href="/"
                        className="mt-4 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
                    >
                        Browse Maps
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {compositions.map((comp) => {
                        const compAgents = comp.agentIds
                            .map((id) => allAgents.find((a) => a.id === id))
                            .filter((a): a is (typeof allAgents)[number] => a !== undefined);

                        const map = maps.find((m) => m.id === comp.mapId);

                        return (
                            <CompositionCard
                                key={comp.id}
                                id={comp.id}
                                name={comp.name}
                                mapName={map?.name ?? comp.mapId}
                                agents={compAgents}
                                createdAt={comp.createdAt}
                            />
                        );
                    })}
                </div>
            )}
        </main>
    );
}
