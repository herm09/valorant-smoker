import { ValorantMap } from "../types/valorant";

export const maps: ValorantMap[] = [
    {
        id: "ascent",
        name: "Ascent",
        image: "/maps/ascent.webp",
        smokes: [
        {
            id: "1",
            x: 35,
            y: 40,
            label: "Market"
        },
        {
            id: "2",
            x: 60,
            y: 25,
            label: "Tree"
        }
        ]
    },
    {
        id: "haven",
        name: "Haven",
        image: "/maps/haven.webp",
        smokes: []
    }
];