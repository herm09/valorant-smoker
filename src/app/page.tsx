import Link from "next/link";
import Image from "next/image";
import { maps } from "../data/maps";

export default function Home() {
    return (
        <main className="min-h-screen p-8">
            <h1 className="mb-8 text-4xl font-bold">Valorant Team Builder</h1>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {maps.map((map) => (
                    <Link
                        key={map.id}
                        href={`/maps/${map.id}`}
                        className="group overflow-hidden rounded-xl border border-gray-200 transition-colors hover:border-cyan-400 dark:border-gray-700"
                    >
                        <div className="relative aspect-video bg-gray-900">
                            <Image
                                src={map.image}
                                alt={map.name}
                                fill
                                sizes="(max-width: 768px) 50vw, 33vw"
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                        </div>
                        <div className="p-3">
                            <h2 className="font-semibold">{map.name}</h2>
                            <p className="text-xs text-gray-500">
                                {map.smokes.length} smoke{map.smokes.length > 1 ? "s" : ""}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}
