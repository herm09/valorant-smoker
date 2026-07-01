import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "../../../lib/db";
import { maps } from "../../../data/maps";
import { SMOKE_STYLES } from "../../../lib/smoke-styles";
import type { StoredSmoke } from "../../../types/valorant";

export default async function LayoutPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const layout = await prisma.smokeLayout.findUnique({
        where:   { id },
        include: { user: { select: { email: true } } },
    });

    if (!layout || !layout.isPublic) notFound();

    const map = maps.find((m) => m.id === layout.mapId);
    if (!map) notFound();

    const smokes = layout.smokes as unknown as StoredSmoke[];
    const authorHandle = layout.user.email.split("@")[0];

    return (
        <main className="min-h-screen p-8">
            <Link
                href="/community"
                className="mb-6 inline-block text-sm text-gray-500 transition-colors hover:text-gray-100"
            >
                ← Community
            </Link>

            <div className="mb-6">
                <h1 className="text-3xl font-bold">{layout.name}</h1>
                <p className="mt-1 text-sm text-gray-500">
                    {map.name} · by {authorHandle} ·{" "}
                    {layout.createdAt.toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                    })}
                </p>
            </div>

            {/* Map with smokes */}
            <div className="relative mx-auto w-fit overflow-hidden rounded-xl">
                <Image
                    src={map.image}
                    alt={map.name}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="block h-auto max-h-[80vh] w-auto max-w-full"
                    priority
                />
                {smokes.map((smoke) => {
                    const style = SMOKE_STYLES[smoke.team];
                    return (
                        <div
                            key={smoke.id}
                            className="group absolute -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${smoke.x}%`, top: `${smoke.y}%` }}
                        >
                            <div
                                className="h-10 w-10 rounded-full transition-transform duration-200 group-hover:scale-110"
                                style={{
                                    background: style.gradient,
                                    boxShadow:  style.shadow,
                                    border:     style.border,
                                }}
                            />
                            <p className={`mt-1 text-center text-xs font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,1)] ${style.label}`}>
                                {smoke.label}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-gray-400">Attackers</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-gray-400">Defenders</span>
                </div>
                <span className="text-gray-500">{smokes.length} smoke{smokes.length !== 1 ? "s" : ""}</span>
            </div>
        </main>
    );
}
