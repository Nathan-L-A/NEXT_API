import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ id: string }> };

// GET /api/cities/[id]/weather — relevés météo d'une ville
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const city = await prisma.city.findUnique({ where: { id: Number(id) } });
  if (!city) {
    return Response.json({ error: "Ville introuvable" }, { status: 404 });
  }

  const records = await prisma.weatherRecord.findMany({
    where: { cityId: Number(id) },
    orderBy: { recordedAt: "desc" },
  });

  return Response.json(records);
}

// POST /api/cities/[id]/weather — ajoute un relevé météo
export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;

  const city = await prisma.city.findUnique({ where: { id: Number(id) } });
  if (!city) {
    return Response.json({ error: "Ville introuvable" }, { status: 404 });
  }

  const body = await request.json();
  const { temperature, humidity, windSpeed, condition } = body;

  if (
    temperature === undefined ||
    humidity === undefined ||
    windSpeed === undefined ||
    !condition
  ) {
    return Response.json(
      { error: "Champs requis : temperature, humidity, windSpeed, condition" },
      { status: 400 }
    );
  }

  const record = await prisma.weatherRecord.create({
    data: {
      cityId: Number(id),
      temperature,
      humidity,
      windSpeed,
      condition,
    },
  });

  return Response.json(record, { status: 201 });
}
