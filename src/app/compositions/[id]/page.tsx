import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/db";
import { agents as allAgents } from "../../../data/agents";
import { maps } from "../../../data/maps";
import { ROLE_BG } from "../../../lib/role-colors";

export default async function CompositionDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const { id } = await params;

    const composition = await prisma.composition.findUnique({ where: { id } });
    if (!composition || composition.userId !== session.user.id) notFound();

    const map = maps.find((m) => m.id === composition.mapId);
    const compAgents = composition.agentIds
        .map((agentId) => allAgents.find((a) => a.id === agentId))
        .filter((a): a is (typeof allAgents)[number] => a !== undefined);

    return (
        <main className="min-h-screen p-8">
            <Link
                href="/compositions"
                className="mb-6 inline-flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-gray-300 light:hover:text-gray-700"
            >
                ← Compositions
            </Link>

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white light:text-gray-900">{composition.name}</h1>
                <p className="mt-1 text-sm text-gray-500">
                    {map?.name ?? composition.mapId} ·{" "}
                    {composition.createdAt.toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                    })}
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
                {/* Agents */}
                <div>
                    <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
                        Team composition
                    </p>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                        {compAgents.map((agent) => (
                            <div
                                key={agent.id}
                                className="flex flex-col items-center gap-2 rounded-xl border border-gray-800 bg-gray-900/60 p-4 light:border-gray-200 light:bg-gray-50"
                            >
                                <div className={`relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full ${ROLE_BG[agent.role]}`}>
                                    <span className="text-2xl font-bold text-white select-none">{agent.name[0]}</span>
                                    <img
                                        src={agent.image}
                                        alt={agent.name}
                                        className="absolute inset-0 h-full w-full object-cover"
                                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    />
                                </div>
                                <p className="text-sm font-semibold text-white light:text-gray-900">{agent.name}</p>
                                <span className={`rounded px-2 py-0.5 text-[10px] font-medium text-white ${ROLE_BG[agent.role]}`}>
                                    {agent.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Map */}
                {map && (
                    <div className="lg:w-72">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Map</p>
                        <div className="overflow-hidden rounded-xl border border-gray-800 light:border-gray-200">
                            <Image
                                src={map.image}
                                alt={map.name}
                                width={288}
                                height={180}
                                className="h-44 w-full object-cover"
                            />
                            <div className="bg-gray-900/60 px-4 py-2 light:bg-gray-50">
                                <p className="text-sm font-semibold text-white light:text-gray-900">{map.name}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
