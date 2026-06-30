export interface Agent {
    id: string;
    name: string;
    role: string;
    image: string;
    abilities: Ability[];
}

export interface Ability {
    key: string; // example "Q", "E", "C", "X"
    name: string;
    description: string;
    icon?: string;
}

export interface SmokeSpot {
    id: string;
    x: number;
    y: number;
    label: string;
}

export interface ValorantMap {
    id: string;
    name: string;
    image: string;
    smokes: SmokeSpot[];
}