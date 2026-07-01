import type { SmokeTeam } from "../types/valorant";

export const SMOKE_STYLES: Record<SmokeTeam, {
    gradient: string;
    shadow: string;
    border: string;
    label: string;
}> = {
    defender: {
        gradient: "radial-gradient(circle at 38% 32%, rgba(255,100,80,0.72) 0%, rgba(220,60,40,0.42) 38%, rgba(180,30,20,0.15) 65%, transparent 100%)",
        shadow:   "0 0 18px rgba(239,68,68,0.55), 0 0 48px rgba(239,68,68,0.15)",
        border:   "1px solid rgba(239,68,68,0.35)",
        label:    "group-hover:text-red-400",
    },
    attacker: {
        gradient: "radial-gradient(circle at 38% 32%, rgba(80,220,120,0.72) 0%, rgba(40,180,80,0.42) 38%, rgba(20,130,50,0.15) 65%, transparent 100%)",
        shadow:   "0 0 18px rgba(34,197,94,0.55), 0 0 48px rgba(34,197,94,0.15)",
        border:   "1px solid rgba(34,197,94,0.35)",
        label:    "group-hover:text-green-400",
    },
};
