import { notFound } from "next/navigation";
import Link from "next/link";
import { maps } from "../../../data/maps";
import { agents } from "../../../data/agents";
import MapTabs from "../../../components/map-tabs";

export default async function MapPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const map = maps.find((m) => m.id === id);

    if (!map) notFound();

    return (
        <main className="flex min-h-screen flex-col">
            <div className="border-b border-gray-800 px-6 py-4 light:border-gray-200">
                <Link
                    href="/"
                    className="mb-1 inline-flex items-center gap-1 text-xs text-gray-600 transition-colors hover:text-gray-300 light:text-gray-400 light:hover:text-gray-700"
                >
                    ← Maps
                </Link>
                <h1 className="text-2xl font-bold text-white light:text-gray-900">{map.name}</h1>
            </div>
            <MapTabs agents={agents} map={map} />
        </main>
    );
}
