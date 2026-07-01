import Link from "next/link";
import type { Agent } from "../types/valorant";
import { deleteComposition } from "../lib/actions/compositions";
import { ROLE_BG } from "../lib/role-colors";

type Props = {
    id: string;
    name: string;
    mapName: string;
    agents: Agent[];
    createdAt: Date;
};

export default function CompositionCard({ id, name, mapName, agents, createdAt }: Props) {
    return (
        <div className="group relative rounded-xl border border-gray-700 bg-gray-900 p-4 transition-colors hover:border-gray-500 light:border-gray-200 light:bg-white light:hover:border-gray-300">
            {/* Clickable overlay — above content but below delete button */}
            <Link href={`/compositions/${id}`} className="absolute inset-0 z-10 rounded-xl" />

            {/* Content */}
            <div className="relative">
                <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                        <h3 className="font-semibold text-white light:text-gray-900">{name}</h3>
                        <p className="text-xs text-gray-400 light:text-gray-500">{mapName}</p>
                    </div>
                    <form action={deleteComposition} className="relative z-20">
                        <input type="hidden" name="id" value={id} />
                        <button
                            type="submit"
                            className="rounded px-2 py-1 text-xs text-red-400 transition-colors hover:bg-red-900/40 hover:text-red-300 light:hover:bg-red-50"
                        >
                            Delete
                        </button>
                    </form>
                </div>

                <div className="flex gap-2">
                    {agents.map((agent) => (
                        <div
                            key={agent.id}
                            title={`${agent.name} — ${agent.role}`}
                            className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ${ROLE_BG[agent.role]}`}
                        >
                            <span className="text-sm font-bold text-white select-none">{agent.name[0]}</span>
                            <img src={agent.image} alt={agent.name} className="absolute inset-0 h-full w-full object-cover" />
                        </div>
                    ))}
                </div>

                <p className="mt-3 text-xs text-gray-500">
                    {createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
            </div>
        </div>
    );
}
