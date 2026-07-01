import { TEAM_SIZE, MAX_DUELISTS, MIN_CONTROLLERS } from "../../config/game-rules";
import type { Agent } from "../../types/valorant";

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

export function validateTeam(agents: Agent[]): ValidationResult {
    const errors: string[] = [];

    const ids = agents.map((a) => a.id);
    if (new Set(ids).size !== ids.length) {
        errors.push("An agent cannot appear more than once");
    }

    const duelists = agents.filter((a) => a.role === "Duelist").length;
    if (duelists > MAX_DUELISTS) {
        errors.push(`Max ${MAX_DUELISTS} Duelists (${duelists} selected)`);
    }

    if (agents.length === TEAM_SIZE) {
        const controllers = agents.filter((a) => a.role === "Controller").length;
        if (controllers < MIN_CONTROLLERS) {
            errors.push(`At least ${MIN_CONTROLLERS} Controller required`);
        }
    }

    const valid = agents.length === TEAM_SIZE && errors.length === 0;
    return { valid, errors };
}
