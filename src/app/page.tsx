import Link from "next/link";
import Image from "next/image";
import { maps } from "../data/maps";

export default function Home() {
  return (
    <main className="flex flex-col">

      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-3 border-b border-gray-800 bg-gray-900/50 px-6 py-16 text-center light:border-gray-200 light:bg-gray-50/50">
        <h1 className="text-5xl font-black tracking-tight text-white light:text-gray-900">
          Valorant{" "}
          <span className="text-cyan-400">Team Builder</span>
        </h1>
        <p className="max-w-lg text-gray-400 light:text-gray-600">
          Build optimal team compositions, visualize smoke lineups, and share
          strategies with your team.
        </p>
        <div className="mt-2 flex items-center gap-3 text-sm font-medium">
          <Link
            href="/compositions"
            className="rounded-lg bg-cyan-600 px-4 py-2 text-white transition-colors hover:bg-cyan-500"
          >
            My Compositions
          </Link>
          <Link
            href="/community"
            className="rounded-lg border border-gray-700 px-4 py-2 text-gray-300 transition-colors hover:border-gray-500 hover:text-white light:border-gray-300 light:text-gray-700 light:hover:border-gray-400 light:hover:text-gray-900"
          >
            Community
          </Link>
        </div>
      </section>

      {/* Maps grid */}
      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-500">
          Maps
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {maps.map((map) => (
            <Link
              key={map.id}
              href={`/maps/${map.id}`}
              className="group relative overflow-hidden rounded-lg border border-gray-800 transition-all hover:border-cyan-500 hover:shadow-[0_0_12px_rgba(6,182,212,0.25)] light:border-gray-200 light:hover:border-cyan-400"
            >
              <div className="relative aspect-video w-full bg-gray-900 light:bg-gray-100">
                <Image
                  src={map.image}
                  alt={map.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <p className="absolute bottom-1.5 left-2 text-xs font-semibold text-white drop-shadow-md">
                  {map.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
