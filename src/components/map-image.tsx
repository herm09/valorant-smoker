import Image from "next/image";
import type { ValorantMap } from "../types/valorant";
import { SMOKE_STYLES } from "../lib/smoke-styles";

export default function MapImage({ map }: { map: ValorantMap }) {
    return (
        <div className="relative mx-auto w-fit overflow-hidden rounded-xl">
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
