import Image from "next/image";
import type { ValorantMap, SmokeTeam } from "../types/valorant";

const SMOKE_STYLES: Record<SmokeTeam, { gradient: string; shadow: string; border: string; label: string }> = {
    attacker: {
        gradient: "radial-gradient(circle at 38% 32%, rgba(255,100,80,0.72) 0%, rgba(220,60,40,0.42) 38%, rgba(180,30,20,0.15) 65%, transparent 100%)",
        shadow:   "0 0 18px rgba(239,68,68,0.55), 0 0 48px rgba(239,68,68,0.15)",
        border:   "1px solid rgba(239,68,68,0.35)",
        label:    "group-hover:text-red-400",
    },
    defender: {
        gradient: "radial-gradient(circle at 38% 32%, rgba(80,150,255,0.72) 0%, rgba(50,120,220,0.42) 38%, rgba(30,80,200,0.15) 65%, transparent 100%)",
        shadow:   "0 0 18px rgba(59,130,246,0.55), 0 0 48px rgba(59,130,246,0.15)",
        border:   "1px solid rgba(59,130,246,0.35)",
        label:    "group-hover:text-blue-400",
    },
};

export default function MapImage({ map }: { map: ValorantMap }) {
    return (
        <div className="relative mx-auto w-fit overflow-hidden rounded-xl">
            {/* width/height=0 + sizes laisse le CSS contrôler les dimensions tout en gardant l'optimisation Next.js */}
            <Image
                src={map.image}
                alt={map.name}
                width={0}
                height={0}
                sizes="100vw"
                className="block h-auto max-h-[120vh] w-auto max-w-full"
                priority
            />
            {map.smokes.map((smoke) => {
                const style = SMOKE_STYLES[smoke.team];
                return (
                    <div
                        key={smoke.id}
                        className="group absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${smoke.x}%`, top: `${smoke.y}%` }}
                    >
                        <div
                            className="h-10 w-10 rounded-full transition-transform duration-200 group-hover:scale-110"
                            style={{
                                background: style.gradient,
                                boxShadow:  style.shadow,
                                border:     style.border,
                            }}
                        />
                        <p className={`mt-1 text-center text-xs font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,1)] ${style.label}`}>
                            {smoke.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
