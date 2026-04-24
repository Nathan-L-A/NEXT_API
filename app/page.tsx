import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import SearchBar from "./components/SearchBar";

type WeatherRecord = {
  id: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  recordedAt: Date;
};

type City = {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  weather: WeatherRecord[];
};

const conditionIcon: Record<string, string> = {
  ensoleillé: "☀️",
  nuageux: "☁️",
  pluie: "🌧️",
  orageux: "⛈️",
  brumeux: "🌫️",
  venteux: "💨",
};

async function getCities(q: string): Promise<City[]> {
  return prisma.city.findMany({
    where: q ? { name: { contains: q } } : undefined,
    orderBy: { name: "asc" },
    include: {
      weather: {
        orderBy: { recordedAt: "desc" },
        take: 1,
      },
    },
  });
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const cities = await getCities(q);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 dark:from-zinc-900 dark:to-zinc-800 p-8">
      <div className="mx-auto max-w-3xl">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-zinc-800 dark:text-white mb-2">
            🌤️ Météo France
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Consultez les derniers relevés météo par ville
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="flex justify-center mb-8">
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>

        {/* Résultats */}
        {cities.length === 0 ? (
          <div className="text-center py-16 text-zinc-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg">Aucune ville trouvée pour &quot;{q}&quot;</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {cities.map((city) => {
              const latest = city.weather[0];
              return (
                <div
                  key={city.id}
                  className="rounded-2xl bg-white dark:bg-zinc-800 p-5 shadow-sm border border-zinc-100 dark:border-zinc-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">
                        {city.name}
                      </h2>
                      <p className="text-xs text-zinc-400">{city.country}</p>
                    </div>
                    <span className="text-3xl">
                      {latest ? (conditionIcon[latest.condition] ?? "🌡️") : "—"}
                    </span>
                  </div>

                  {latest ? (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <Stat label="Température" value={`${latest.temperature}°C`} />
                      <Stat label="Humidité" value={`${latest.humidity}%`} />
                      <Stat label="Vent" value={`${latest.windSpeed} km/h`} />
                      <Stat label="Condition" value={latest.condition} />
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-400">Aucun relevé disponible</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 dark:bg-zinc-700 px-3 py-2">
      <p className="text-xs text-zinc-400 mb-0.5">{label}</p>
      <p className="font-medium text-zinc-700 dark:text-zinc-100 capitalize">{value}</p>
    </div>
  );
}
