"use client";

import { useRef, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { SMOKE_POPOVER_MAX_X, SMOKE_POPOVER_MAX_Y } from "../config/game-rules";
import Image from "next/image";
import type { ValorantMap, SmokeTeam, StoredSmoke } from "../types/valorant";
import { SMOKE_STYLES } from "../lib/smoke-styles";
import { saveSmokeLayout } from "../lib/actions/smoke-layouts";
import AuthPrompt from "./auth-prompt";

type PendingPos = { x: number; y: number };

export default function SmokeEditor({ map }: { map: ValorantMap }) {
    const { status } = useSession();
    const isAuthenticated = status === "authenticated";

    const containerRef  = useRef<HTMLDivElement>(null);
    const idCounterRef  = useRef(0);
    function nextId() { return `s-${++idCounterRef.current}`; }

    const [smokes, setSmokes]          = useState<StoredSmoke[]>([]);
    const [pending, setPending]        = useState<PendingPos | null>(null);
    const [mousePos, setMousePos]      = useState<PendingPos | null>(null);
    const [formLabel, setFormLabel]    = useState("");
    const [formTeam, setFormTeam]      = useState<SmokeTeam>("attacker");
    const [layoutName, setLayoutName]  = useState("");
    const [isPublic, setIsPublic]      = useState(false);
    const [savedOk, setSavedOk]        = useState(false);
    const [isPending, startTransition] = useTransition();

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    }

    function handleMapClick(e: React.MouseEvent<HTMLDivElement>) {
        if ((e.target as HTMLElement).closest("[data-smoke]")) return;
        if ((e.target as HTMLElement).closest("[data-popover]")) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setPending({ x, y });
        setFormLabel("");
        setFormTeam("attacker");
    }

    function confirmSmoke() {
        if (!pending) return;
        setSmokes((prev) => [
            ...prev,
            { id: nextId(), x: pending.x, y: pending.y, label: formLabel || "Smoke", team: formTeam },
        ]);
        setPending(null);
    }

    function removeSmoke(id: string) {
        setSmokes((prev) => prev.filter((s) => s.id !== id));
    }

    function handleSave() {
        if (smokes.length === 0 || !layoutName.trim()) return;
        startTransition(async () => {
            await saveSmokeLayout({
                name:     layoutName.trim(),
                mapId:    map.id,
                smokes,
                isPublic,
            });
            setSavedOk(true);
            setSmokes([]);
            setLayoutName("");
            setIsPublic(false);
        });
    }

    return (
        <section>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
                Click map to place · Click smoke to remove
            </p>

            {/* ── Map interactive ─────────────────────────────── */}
            <div
                ref={containerRef}
                className="relative mx-auto w-fit cursor-none overflow-hidden rounded-xl select-none ring-1 ring-gray-800 light:ring-gray-200"
                onClick={handleMapClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setMousePos(null)}
            >
                <Image
                    src={map.image}
                    alt={map.name}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="block h-auto max-h-[80vh] w-auto max-w-full"
                    draggable={false}
                    priority
                />

                {/* Smokes placées */}
                {smokes.map((smoke) => {
                    const style = SMOKE_STYLES[smoke.team];
                    return (
                        <div
                            key={smoke.id}
                            data-smoke
                            className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-none"
                            style={{ left: `${smoke.x}%`, top: `${smoke.y}%` }}
                            onClick={(e) => { e.stopPropagation(); removeSmoke(smoke.id); }}
                            title="Click to remove"
                        >
                            <div
                                className="h-10 w-10 rounded-full transition-transform duration-150 group-hover:scale-110 group-hover:opacity-60"
                                style={{ background: style.gradient, boxShadow: style.shadow, border: style.border }}
                            />
                            <p className={`mt-1 text-center text-xs font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,1)] ${style.label}`}>
                                {smoke.label}
                            </p>
                        </div>
                    );
                })}

                {/* Custom crosshair cursor */}
                {mousePos && !pending && (
                    <div
                        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
                    >
                        <div className="relative h-7 w-7 drop-shadow-[0_0_2px_rgba(255,255,255,0.9)]">
                            <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-px bg-gray-900" />
                            <div className="absolute bottom-0 left-1/2 top-0 w-0.5 -translate-x-px bg-gray-900" />
                            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-900" />
                        </div>
                    </div>
                )}

                {/* Preview du pending smoke */}
                {pending && (
                    <div
                        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 opacity-50"
                        style={{ left: `${pending.x}%`, top: `${pending.y}%` }}
                    >
                        <div className="h-10 w-10 animate-pulse rounded-full border-2 border-dashed border-white" />
                    </div>
                )}

                {/* Popover */}
                {pending && (
                    <div
                        data-popover
                        className="absolute z-20 w-52 rounded-xl border border-gray-600 bg-gray-900 p-3 shadow-2xl light:border-gray-200 light:bg-white"
                        style={{ left: `${Math.min(pending.x, SMOKE_POPOVER_MAX_X)}%`, top: `${Math.min(pending.y + 6, SMOKE_POPOVER_MAX_Y)}%` }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <input
                            autoFocus
                            type="text"
                            value={formLabel}
                            onChange={(e) => setFormLabel(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") confirmSmoke(); if (e.key === "Escape") setPending(null); }}
                            placeholder="Label (ex: A Main)"
                            maxLength={30}
                            className="w-full rounded-lg border border-gray-600 bg-gray-800 px-2 py-1.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none light:border-gray-300 light:bg-gray-50 light:text-gray-900 light:placeholder-gray-400"
                        />
                        <div className="mt-2 flex gap-2">
                            <button type="button" onClick={() => setFormTeam("attacker")} className={["flex-1 rounded-lg py-1 text-xs font-semibold transition-colors", formTeam === "attacker" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-400 hover:bg-gray-600 light:bg-gray-100 light:text-gray-600 light:hover:bg-gray-200"].join(" ")}>Attacker</button>
                            <button type="button" onClick={() => setFormTeam("defender")} className={["flex-1 rounded-lg py-1 text-xs font-semibold transition-colors", formTeam === "defender" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-400 hover:bg-gray-600 light:bg-gray-100 light:text-gray-600 light:hover:bg-gray-200"].join(" ")}>Defender</button>
                        </div>
                        <div className="mt-2 flex gap-2">
                            <button type="button" onClick={confirmSmoke} className="flex-1 rounded-lg bg-cyan-600 py-1 text-xs font-semibold text-white hover:bg-cyan-500">Add</button>
                            <button type="button" onClick={() => setPending(null)} className="flex-1 rounded-lg bg-gray-700 py-1 text-xs font-semibold text-gray-300 hover:bg-gray-600 light:bg-gray-100 light:text-gray-700 light:hover:bg-gray-200">Cancel</button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Legend + clear ──────────────────────────────── */}
            <div className="mt-4 flex flex-wrap items-center gap-5 text-sm">
                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-gray-400 light:text-gray-600">Attackers</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-gray-400 light:text-gray-600">Defenders</span>
                </div>
                <span className="text-gray-600 light:text-gray-400">{smokes.length} smoke{smokes.length !== 1 ? "s" : ""} placed</span>
                {smokes.length > 0 && (
                    <button type="button" onClick={() => setSmokes([])} className="ml-auto text-xs text-gray-600 transition-colors hover:text-red-400 light:text-gray-400">
                        Clear all
                    </button>
                )}
            </div>

            {/* ── Save panel ──────────────────────────────────── */}
            <div className="mt-5">
                {isAuthenticated ? (
                    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/60 p-4 light:border-gray-200 light:bg-gray-50">
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
                            <input
                                type="text"
                                value={layoutName}
                                onChange={(e) => { setLayoutName(e.target.value); setSavedOk(false); }}
                                placeholder="Layout name…"
                                maxLength={60}
                                className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-cyan-400 focus:outline-none light:border-gray-300 light:bg-white light:text-gray-900 light:placeholder-gray-400"
                            />
                            <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm text-gray-400 select-none light:text-gray-600">
                                <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="h-4 w-4 rounded accent-cyan-500" />
                                Make public
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={smokes.length === 0 || !layoutName.trim() || isPending}
                                className="shrink-0 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isPending ? "Saving…" : "Save layout"}
                            </button>
                            {savedOk && <span className="text-sm text-green-400">✓ Saved!</span>}
                        </div>
                    </div>
                ) : (
                    <AuthPrompt message="Sign in to save your smoke layout" />
                )}
            </div>
        </section>
    );
}
