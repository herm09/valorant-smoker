import { notFound } from "next/navigation";
import Link from "next/link";
import { maps } from "../../../data/maps";
import MapImage from "../../../components/map-image";

export default async function MapPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const map = maps.find((m) => m.id === id);

    if (!map) notFound();

    return (
        <main className="min-h-screen p-8">
            <Link
                href="/"
                className="mb-6 inline-block text-sm text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-gray-100"
            >
                ← Back
            </Link>

            <h1 className="mb-8 text-4xl font-bold">{map.name}</h1>

            <MapImage map={map} />

            <div className="mt-4 flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-gray-600 dark:text-gray-400">Attackers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">Defenders</span>
                </div>
                <span className="text-sm text-gray-400">
                    {map.smokes.length} smoke position{map.smokes.length > 1 ? "s" : ""}
                </span>
            </div>
        </main>
    );
}
