export type AgentRole = "Duelist" | "Controller" | "Initiator" | "Sentinel";

export interface Ability {
    key: string; // "Q", "E", "C", "X"
    name: string;
    description: string;
    icon?: string;
}

export interface Agent {
    id: string;
    name: string;
    role: AgentRole;
    image: string;
    abilities: Ability[];
}

export type SmokeTeam = "attacker" | "defender";

export interface SmokeSpot {
    id: string;
    // Coordonnées en % relatif à la taille de l'image (0-100)
    x: number;
    y: number;
    label: string;
    team: SmokeTeam;
}

export interface ValorantMap {
    id: string;
    name: string;
    image: string;
    smokes: SmokeSpot[];
}

export interface TeamComposition {
    id: string;
    name: string;
    mapId: string;
    agents: Agent[];
}
