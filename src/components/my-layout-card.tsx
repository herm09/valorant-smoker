import Link from "next/link";
import { deleteSmokeLayout, togglePublic } from "../lib/actions/smoke-layouts";

type Props = {
    id: string;
    name: string;
    mapName: string;
    mapImage: string;
    smokeCount: number;
    isPublic: boolean;
    createdAt: Date;
};

export default function MyLayoutCard({
    id, name, mapName, mapImage, smokeCount, isPublic, createdAt,
}: Props) {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-900 transition-colors hover:border-gray-500 light:border-gray-200 light:bg-white light:hover:border-gray-300">
            {/* Clickable overlay */}
            <Link href={`/layouts/${id}`} className="absolute inset-0 z-10 rounded-xl" />

            {/* Map image */}
            <div className="relative h-32 w-full overflow-hidden bg-gray-800 light:bg-gray-100">
                <img src={mapImage} alt={mapName} className="h-full w-full object-cover opacity-80" />
                <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
                    {mapName}
                </span>
                <span
                    className={`absolute right-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        isPublic
                            ? "bg-cyan-900/70 text-cyan-300"
                            : "bg-gray-900/70 text-gray-400"
                    }`}
                >
                    {isPublic ? "Public" : "Private"}
                </span>
            </div>

            {/* Content */}
            <div className="relative p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white light:text-gray-900">{name}</h3>
                    <form action={deleteSmokeLayout} className="relative z-20">
                        <input type="hidden" name="id" value={id} />
                        <button
                            type="submit"
                            className="rounded px-2 py-1 text-xs text-red-400 transition-colors hover:bg-red-900/40 hover:text-red-300 light:hover:bg-red-50"
                        >
                            Delete
                        </button>
                    </form>
                </div>

                <p className="text-xs text-gray-500">
                    {smokeCount} smoke{smokeCount !== 1 ? "s" : ""}
                </p>

                <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                        {createdAt.toLocaleDateString("en-GB", {
                            day: "2-digit", month: "short", year: "numeric",
                        })}
                    </p>
                    <form action={togglePublic} className="relative z-20">
                        <input type="hidden" name="id" value={id} />
                        <button
                            type="submit"
                            className="rounded px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-300 light:hover:bg-gray-100 light:hover:text-gray-600"
                        >
                            {isPublic ? "Make private" : "Make public"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
