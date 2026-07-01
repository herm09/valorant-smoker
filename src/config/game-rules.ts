import type { AgentRole } from "../types/valorant";

export const TEAM_SIZE = 5;
export const MAX_DUELISTS = 2;
export const MIN_CONTROLLERS = 1;

export const AGENT_ROLES: AgentRole[] = [
    "Duelist",
    "Controller",
    "Initiator",
    "Sentinel",
];

export const META_TEMPLATE: AgentRole[] = [
    "Duelist",
    "Duelist",
    "Controller",
    "Initiator",
    "Sentinel",
];

export const SMOKE_POPOVER_MAX_X = 70;
export const SMOKE_POPOVER_MAX_Y = 80;
