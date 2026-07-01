import type { StoredSmoke } from "../types/valorant";

function isStoredSmoke(v: unknown): v is StoredSmoke {
    if (typeof v !== "object" || v === null) return false;
    const s = v as Record<string, unknown>;
    return (
        typeof s.id === "string" &&
        typeof s.x === "number" &&
        typeof s.y === "number" &&
        typeof s.label === "string" &&
        (s.team === "attacker" || s.team === "defender")
    );
}

export function parseStoredSmokes(json: unknown): StoredSmoke[] {
    if (!Array.isArray(json)) return [];
    return json.filter(isStoredSmoke);
}
