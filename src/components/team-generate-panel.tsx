"use client";

import type { Agent, ValorantMap } from "../types/valorant";
import { ROLE_BG } from "../lib/role-colors";

type Props = {
    agents: Agent[];
    map: ValorantMap;
    mainAgent: Agent | null;
    onPickMain: (agent: Agent) => void;
    onGenerate: () => void;
};

export default function TeamGeneratePanel({ agents, map, mainAgent, onPickMain, onGenerate }: Props) {
    return (
        <div className="flex flex-col gap-4">
            <p className="text-xs text-gray-500 light:text-gray-500">
                Pick your main agent — we&apos;ll fill the best team for{" "}
                <span className="font-semibold text-gray-300 light:text-gray-700">{map.name}</span>.
            </p>

            <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-7 lg:grid-cols-5 xl:grid-cols-7">
                {agents.map((agent) => (
                    <button
                        key={agent.id}
                        type="button"
                        onClick={() => onPickMain(agent)}
                        title={agent.name}
                        className={[
                            "flex flex-col items-center gap-1 rounded-lg p-1.5 transition-all",
                            mainAgent?.id === agent.id
                                ? "bg-violet-700/40 ring-1 ring-violet-400"
                                : "bg-gray-900 hover:bg-gray-800 light:bg-gray-50 light:hover:bg-gray-100",
                        ].join(" ")}
                    >
                        <div className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ${ROLE_BG[agent.role]}`}>
                            <span className="text-base font-bold text-white select-none">{agent.name[0]}</span>
                            <img
                                src={agent.image}
                                alt={agent.name}
                                className="absolute inset-0 h-full w-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                        </div>
                        <p className="w-full truncate text-center text-[9px] text-gray-400 light:text-gray-500">{agent.name}</p>
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/60 px-4 py-3 light:border-gray-200 light:bg-gray-50">
                {mainAgent ? (
                    <div className="flex items-center gap-2">
                        <div className={`relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full ${ROLE_BG[mainAgent.role]}`}>
                            <span className="text-xs font-bold text-white">{mainAgent.name[0]}</span>
                            <img
                                src={mainAgent.image}
                                alt={mainAgent.name}
                                className="absolute inset-0 h-full w-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                        </div>
                        <span className="text-sm font-semibold text-white light:text-gray-900">{mainAgent.name}</span>
                        <button
                            type="button"
                            onClick={() => onPickMain(mainAgent)}
                            className="text-xs text-gray-600 hover:text-gray-300 light:text-gray-400 light:hover:text-gray-600"
                        >
                            ×
                        </button>
                    </div>
                ) : (
                    <span className="text-xs text-gray-600 light:text-gray-400">No main selected</span>
                )}
                <button
                    type="button"
                    onClick={onGenerate}
                    disabled={!mainAgent}
                    className="ml-auto shrink-0 rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Generate team →
                </button>
            </div>
        </div>
    );
}
