import Link from "next/link";

type Props = {
    id: string;
    name: string;
    mapName: string;
    mapImage: string;
    smokeCount: number;
    authorEmail: string;
    createdAt: Date;
};

export default function SmokeLayoutCard({
    id, name, mapName, mapImage, smokeCount, authorEmail, createdAt,
}: Props) {
    const authorHandle = authorEmail.split("@")[0];

    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-900 light:border-gray-200 light:bg-white">
            <div className="relative h-32 w-full overflow-hidden bg-gray-800 light:bg-gray-100">
                <img src={mapImage} alt={mapName} className="h-full w-full object-cover opacity-80" />
                <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
                    {mapName}
                </span>
            </div>

            <div className="flex flex-1 flex-col p-4">
                <h3 className="font-semibold text-white light:text-gray-900">{name}</h3>

                <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    <span>{smokeCount} smoke{smokeCount !== 1 ? "s" : ""}</span>
                    <span>by {authorHandle}</span>
                    <span className="ml-auto">
                        {createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                </div>

                <Link
                    href={`/layouts/${id}`}
                    className="mt-4 rounded-lg bg-gray-700 px-3 py-1.5 text-center text-xs font-semibold text-white transition-colors hover:bg-gray-600 light:bg-gray-100 light:text-gray-700 light:hover:bg-gray-200"
                >
                    View →
                </Link>
            </div>
        </div>
    );
}
