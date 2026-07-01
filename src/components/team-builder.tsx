"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import type { Agent, AgentRole, ValorantMap } from "../types/valorant";
import { AGENT_ROLES, TEAM_SIZE } from "../config/game-rules";
import { ROLE_BG } from "../lib/role-colors";
import { validateTeam } from "../lib/composition/validate-team";
import { generateTeam } from "../lib/composition/generate-team";
import { saveComposition } from "../lib/actions/compositions";
import TeamGeneratePanel from "./team-generate-panel";
import TeamManualPanel from "./team-manual-panel";
import AuthPrompt from "./auth-prompt";

type Mode       = "generate" | "manual";
type RoleFilter = AgentRole | "All";

const FILTERS: RoleFilter[] = ["All", ...AGENT_ROLES];

const FILTER_COLORS: Record<RoleFilter, string> = {
    All:        "bg-gray-700 text-gray-200 light:bg-gray-200 light:text-gray-700",
    Duelist:    "bg-red-700/80 text-red-100",
    Controller: "bg-blue-700/80 text-blue-100",
    Initiator:  "bg-yellow-600/80 text-yellow-100",
    Sentinel:   "bg-green-700/80 text-green-100",
};

const FILTER_ACTIVE: Record<RoleFilter, string> = {
    All:        "ring-2 ring-white/40 light:ring-gray-400",
    Duelist:    "ring-2 ring-red-400",
    Controller: "ring-2 ring-blue-400",
    Initiator:  "ring-2 ring-yellow-400",
    Sentinel:   "ring-2 ring-green-400",
};

const SLOT_PLACEHOLDER = Array.from({ length: TEAM_SIZE });

type Props = { agents: Agent[]; mapId: string; map: ValorantMap };

export default function TeamBuilder({ agents, mapId, map }: Props) {
    const { status } = useSession();
    const isAuthenticated = status === "authenticated";

    const [mode, setMode]              = useState<Mode>("generate");
    const [mainAgent, setMainAgent]    = useState<Agent | null>(null);
    const [selected, setSelected]      = useState<Agent[]>([]);
    const [filter, setFilter]          = useState<RoleFilter>("All");
    const [nameInput, setNameInput]    = useState("");
    const [savedOk, setSavedOk]        = useState(false);
    const [isPending, startTransition] = useTransition();

    const filtered = filter === "All" ? agents : agents.filter((a) => a.role === filter);

    const { valid, errors } = validateTeam(selected);
    const canSave = valid && nameInput.trim().length > 0 && !isPending;

    function switchMode(next: Mode) {
        setMode(next);
        setMainAgent(null);
        setSelected([]);
        setSavedOk(false);
        setFilter("All");
    }

    function pickMain(agent: Agent) {
        setSavedOk(false);
        setMainAgent((prev) => (prev?.id === agent.id ? null : agent));
    }

    function handleGenerate() {
        if (!mainAgent) return;
        const team = generateTeam(mainAgent, map, agents);
        setSelected(team);
        setSavedOk(false);
    }

    function toggle(agent: Agent) {
        setSavedOk(false);
        setSelected((prev) => {
            if (prev.some((a) => a.id === agent.id)) return prev.filter((a) => a.id !== agent.id);
            if (prev.length >= TEAM_SIZE) return prev;
            return [...prev, agent];
        });
    }

    function handleSave() {
        if (!canSave) return;
        startTransition(async () => {
            await saveComposition({
                name:     nameInput.trim(),
                mapId,
                agentIds: selected.map((a) => a.id),
            });
            setSavedOk(true);
            setSelected([]);
            setNameInput("");
        });
    }

    return (
        <div className="flex flex-col gap-5">

            {/* ── Mode toggle ──────────────────────────────────────────── */}
            <div className="flex gap-1 rounded-xl border border-gray-800 bg-gray-900/60 p-1 light:border-gray-200 light:bg-gray-100/60">
                <button
                    type="button"
                    onClick={() => switchMode("generate")}
                    className={[
                        "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
                        mode === "generate"
                            ? "bg-violet-600 text-white shadow"
                            : "text-gray-500 hover:text-gray-300 light:hover:text-gray-700",
                    ].join(" ")}
                >
                    <span>✦</span> Auto-generate
                </button>
                <button
                    type="button"
                    onClick={() => switchMode("manual")}
                    className={[
                        "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
                        mode === "manual"
                            ? "bg-cyan-600 text-white shadow"
                            : "text-gray-500 hover:text-gray-300 light:hover:text-gray-700",
                    ].join(" ")}
                >
                    <span>⊞</span> Manual
                </button>
            </div>

            {/* ── Team slots ───────────────────────────────────────────── */}
            <div>
                <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                        Your team ({selected.length}/{TEAM_SIZE})
                    </p>
                    {selected.length > 0 && (
                        <button
                            type="button"
                            onClick={() => { setSelected([]); setMainAgent(null); setSavedOk(false); }}
                            className="text-xs text-gray-600 transition-colors hover:text-red-400 light:text-gray-400"
                        >
                            Cancel selection
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-5 gap-2">
                    {SLOT_PLACEHOLDER.map((_, i) => {
                        const agent = selected[i];
                        if (agent) {
                            const isMain = mainAgent?.id === agent.id;
                            return (
                                <button
                                    key={agent.id}
                                    type="button"
                                    onClick={() => mode === "manual" ? toggle(agent) : undefined}
                                    title={mode === "manual" ? "Click to remove" : undefined}
                                    className={[
                                        "group relative flex flex-col items-center rounded-xl border border-gray-700 bg-gray-900 p-2 transition-all light:border-gray-200 light:bg-gray-50",
                                        mode === "manual" ? "cursor-pointer hover:border-red-500/60 hover:bg-gray-800 light:hover:bg-gray-100" : "cursor-default",
                                    ].join(" ")}
                                >
                                    {isMain && (
                                        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-1.5 py-px text-[9px] font-bold text-black">
                                            MAIN
                                        </span>
                                    )}
                                    <div className={`relative mb-1 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ${ROLE_BG[agent.role]}`}>
                                        <span className="text-lg font-bold text-white select-none">{agent.name[0]}</span>
                                        <img src={agent.image} alt={agent.name} className="absolute inset-0 h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                                    </div>
                                    <p className="w-full truncate text-center text-[11px] font-semibold text-white light:text-gray-900">{agent.name}</p>
                                    {mode === "manual" && (
                                        <span className="mt-0.5 text-[9px] text-gray-500 opacity-0 transition-opacity group-hover:opacity-100">remove</span>
                                    )}
                                </button>
                            );
                        }
                        return (
                            <div key={i} className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-700/60 p-2 py-4 text-gray-700 light:border-gray-300 light:text-gray-300">
                                <span className="text-xl">+</span>
                            </div>
                        );
                    })}
                </div>

                {errors.length > 0 && selected.length > 0 && (
                    <ul className="mt-2 space-y-0.5">
                        {errors.map((err) => (
                            <li key={err} className="text-xs text-red-400">{err}</li>
                        ))}
                    </ul>
                )}
            </div>

            {/* ── Role filter ───────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-1.5">
                {FILTERS.map((role) => (
                    <button
                        key={role}
                        type="button"
                        onClick={() => setFilter(role)}
                        className={[
                            "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                            FILTER_COLORS[role],
                            filter === role ? FILTER_ACTIVE[role] : "opacity-60 hover:opacity-90",
                        ].join(" ")}
                    >
                        {role}
                    </button>
                ))}
            </div>

            {/* ── Mode panels ──────────────────────────────────────────── */}
            {mode === "generate" && (
                <TeamGeneratePanel
                    agents={filtered}
                    map={map}
                    mainAgent={mainAgent}
                    onPickMain={pickMain}
                    onGenerate={handleGenerate}
                />
            )}
            {mode === "manual" && (
                <TeamManualPanel
                    agents={filtered}
                    selected={selected}
                    onToggle={toggle}
                />
            )}

            {/* ── Save form ─────────────────────────────────────────────── */}
            {valid && (
                isAuthenticated ? (
                    <div className="flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900/60 p-3 light:border-gray-200 light:bg-gray-50">
                        <input
                            type="text"
                            value={nameInput}
                            onChange={(e) => { setNameInput(e.target.value); setSavedOk(false); }}
                            placeholder="Composition name…"
                            maxLength={60}
                            className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-cyan-400 focus:outline-none light:border-gray-300 light:bg-white light:text-gray-900 light:placeholder-gray-400"
                        />
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={!canSave}
                            className="shrink-0 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isPending ? "Saving…" : "Save"}
                        </button>
                        {savedOk && <span className="text-sm text-green-400">✓</span>}
                    </div>
                ) : (
                    <AuthPrompt message="Sign in to save your composition" />
                )
            )}

        </div>
    );
}
