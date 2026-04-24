import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// GET /api/cities?q=paris — liste les villes (avec recherche optionnelle)
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  const cities = await prisma.city.findMany({
    where: q
      ? { name: { contains: q } }
      : undefined,
    orderBy: { name: "asc" },
    include: {
      weather: {
        orderBy: { recordedAt: "desc" },
        take: 1,
      },
    },
  });
  return Response.json(cities);
}

// POST /api/cities — crée une ville
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, country, latitude, longitude } = body;

  if (!name || !country || latitude === undefined || longitude === undefined) {
    return Response.json(
      { error: "Champs requis : name, country, latitude, longitude" },
      { status: 400 }
    );
  }

  const city = await prisma.city.create({
    data: { name, country, latitude, longitude },
  });

  return Response.json(city, { status: 201 });
}
