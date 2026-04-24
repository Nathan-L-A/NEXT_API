import { NextRequest, NextResponse } from "next/server";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      { error: "Le paramètre 'city' est requis." },
      { status: 400 }
    );
  }

  if (!OPENWEATHER_API_KEY) {
    return NextResponse.json(
      { error: "La clé API OpenWeather n'est pas configurée." },
      { status: 500 }
    );
  }

  const url = `${OPENWEATHER_BASE_URL}?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      return NextResponse.json(
        { error: `Ville "${city}" introuvable.` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données météo." },
      { status: response.status }
    );
  }

  const data = await response.json();

  const weather = {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    windSpeed: Math.round(data.wind.speed * 3.6),
    minTemp: Math.round(data.main.temp_min),
    maxTemp: Math.round(data.main.temp_max),
    pressure: data.main.pressure,
  };

  return NextResponse.json(weather);
}
