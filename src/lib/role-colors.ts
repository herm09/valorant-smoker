import type { AgentRole } from "../types/valorant";

export const ROLE_BG: Record<AgentRole, string> = {
    Duelist:    "bg-red-600",
    Controller: "bg-blue-600",
    Initiator:  "bg-yellow-500",
    Sentinel:   "bg-green-600",
};

export const ROLE_RING: Record<AgentRole, string> = {
    Duelist:    "ring-red-400",
    Controller: "ring-blue-400",
    Initiator:  "ring-yellow-400",
    Sentinel:   "ring-green-400",
};
