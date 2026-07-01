"use client";

import { useState } from "react";
import MapImage from "./map-image";
import TeamBuilder from "./team-builder";
import SmokeEditor from "./smoke-editor";
import type { Agent, ValorantMap } from "../types/valorant";

type Tab = "team" | "smokes";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "team",   label: "Team Builder", icon: "⚔" },
  { id: "smokes", label: "Smoke Editor", icon: "💨" },
];

type Props = { agents: Agent[]; map: ValorantMap };

export default function MapTabs({ agents, map }: Props) {
  const [active, setActive] = useState<Tab>("team");

  return (
    <div className="flex flex-col">

      {/* Tab bar */}
      <div className="flex border-b border-gray-800 bg-gray-950 px-6 light:border-gray-200 light:bg-white">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={[
              "flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-colors",
              active === tab.id
                ? "border-b-2 border-cyan-400 text-white light:text-gray-900"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-300 light:text-gray-400 light:hover:text-gray-700",
            ].join(" ")}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Team Builder tab — two-column on desktop */}
      {active === "team" && (
        <div className="grid min-h-0 lg:grid-cols-[55fr_45fr]">

          {/* Left: static map */}
          <div className="flex flex-col border-r border-gray-800/60 bg-gray-950 p-6 light:border-gray-200 light:bg-gray-50">
            <MapImage map={map} />
            <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-gray-500 light:text-gray-400">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                Attackers
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-green-500" />
                Defenders
              </div>
              <span>{map.smokes.length} smoke position{map.smokes.length !== 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* Right: team builder panel */}
          <div className="bg-gray-950 p-6 light:bg-white">
            <TeamBuilder agents={agents} mapId={map.id} map={map} />
          </div>

        </div>
      )}

      {/* Smoke Editor tab — full width */}
      {active === "smokes" && (
        <div className="bg-gray-950 p-6 light:bg-white">
          <SmokeEditor map={map} />
        </div>
      )}

    </div>
  );
}
