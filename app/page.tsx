import { maps } from "../src/data/maps";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">
        Valorant Team Builder
      </h1>

      <div className="grid grid-cols-2 gap-4">
        {maps.map((map) => (
          <div
            key={map.id}
            className="border rounded-lg p-4"
          >
            <h2 className="text-xl font-semibold">
              {map.name}
            </h2>
          </div>
        ))}
      </div>
    </main>
  );
}