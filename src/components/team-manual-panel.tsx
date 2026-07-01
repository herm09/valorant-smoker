"use client";

import type { Agent } from "../types/valorant";
import { TEAM_SIZE } from "../config/game-rules";
import AgentCard from "./agent-card";

type Props = {
    agents: Agent[];
    selected: Agent[];
    onToggle: (agent: Agent) => void;
};

export default function TeamManualPanel({ agents, selected, onToggle }: Props) {
    return (
        <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-500">
                Click agents to add them.{" "}
                {selected.length >= TEAM_SIZE && (
                    <span className="font-semibold text-amber-400">Team full!</span>
                )}
            </p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
                {agents.map((agent) => (
                    <AgentCard
                        key={agent.id}
                        agent={agent}
                        selected={selected.some((a) => a.id === agent.id)}
                        disabled={!selected.some((a) => a.id === agent.id) && selected.length >= TEAM_SIZE}
                        onClick={() => onToggle(agent)}
                    />
                ))}
            </div>
        </div>
    );
}
