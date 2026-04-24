"use client";

import { useState } from "react";
import Image from "next/image";

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  minTemp: number;
  maxTemp: number;
  pressure: number;
}

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(city.trim())}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Une erreur est survenue.");
      } else {
        setWeather(data);
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchWeather();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          🌤️ Météo
        </h1>
        <p className="text-blue-100 text-center mb-8 text-sm">
          Consultez la météo de n&apos;importe quelle ville
        </p>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Entrez une ville..."
            className="flex-1 px-4 py-3 rounded-xl text-gray-800 bg-white/90 backdrop-blur placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            onClick={fetchWeather}
            disabled={loading || !city.trim()}
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "..." : "Chercher"}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {weather && (
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {weather.city}, {weather.country}
                </h2>
                <p className="text-blue-100 capitalize">{weather.description}</p>
              </div>
              <Image
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.description}
                width={64}
                height={64}
                className="drop-shadow-md"
              />
            </div>

            <div className="text-6xl font-thin mb-4">
              {weather.temperature}°C
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-blue-200">Ressenti</p>
                <p className="font-semibold text-lg">{weather.feelsLike}°C</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-blue-200">Humidité</p>
                <p className="font-semibold text-lg">{weather.humidity}%</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-blue-200">Vent</p>
                <p className="font-semibold text-lg">{weather.windSpeed} km/h</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-blue-200">Pression</p>
                <p className="font-semibold text-lg">{weather.pressure} hPa</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-blue-200">Min</p>
                <p className="font-semibold text-lg">{weather.minTemp}°C</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-blue-200">Max</p>
                <p className="font-semibold text-lg">{weather.maxTemp}°C</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
