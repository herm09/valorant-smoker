import { META_TEMPLATE } from "../../config/game-rules";
import type { Agent, ValorantMap } from "../../types/valorant";

export function generateTeam(
    mainAgent: Agent,
    map: ValorantMap,
    allAgents: Agent[],
): Agent[] {
    const slots = [...META_TEMPLATE];

    // Remove the first slot matching the main agent's role
    const mainIdx = slots.indexOf(mainAgent.role);
    if (mainIdx !== -1) {
        slots.splice(mainIdx, 1);
    }
    // If the main's role has no slot in the template (shouldn't happen with current template),
    // we still proceed — the team will have 5 agents including the main

    const result: Agent[] = [mainAgent];
    const usedIds = new Set<string>([mainAgent.id]);

    for (const role of slots) {
        const candidates = allAgents
            .filter((a) => a.role === role && !usedIds.has(a.id))
            .sort((a, b) => {
                const scoreA = map.featuredAgents.includes(a.id) ? 2 : 0;
                const scoreB = map.featuredAgents.includes(b.id) ? 2 : 0;
                return scoreB - scoreA;
            });

        if (!candidates[0]) {
            throw new Error(`No available agent for role "${role}" — check your agents data`);
        }
        result.push(candidates[0]);
        usedIds.add(candidates[0].id);
    }

    return result;
}
