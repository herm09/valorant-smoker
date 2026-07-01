"use client";

import type { Agent } from "../types/valorant";
import { ROLE_BG, ROLE_RING } from "../lib/role-colors";

type Props = {
    agent: Agent;
    selected: boolean;
    disabled: boolean;
    onClick: () => void;
};

export default function AgentCard({ agent, selected, disabled, onClick }: Props) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={[
                "flex flex-col items-center rounded-lg border p-2 text-center transition-all duration-150",
                selected
                    ? `border-transparent ring-2 ${ROLE_RING[agent.role]} bg-gray-800 light:bg-gray-100`
                    : "border-gray-700 bg-gray-900 hover:border-gray-500 light:border-gray-200 light:bg-gray-50 light:hover:border-gray-300",
                disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
            ].join(" ")}
        >
            <div className={`relative mb-1 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full ${ROLE_BG[agent.role]}`}>
                <span className="text-xl font-bold text-white select-none">{agent.name[0]}</span>
                <img
                    src={agent.image}
                    alt={agent.name}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
            </div>
            <p className="text-xs font-semibold leading-tight text-white light:text-gray-900">{agent.name}</p>
            <span className={`mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium text-white ${ROLE_BG[agent.role]}`}>
                {agent.role}
            </span>
        </button>
    );
}
