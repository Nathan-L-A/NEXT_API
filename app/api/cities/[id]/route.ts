import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ id: string }> };

// GET /api/cities/[id] — détails d'une ville
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const city = await prisma.city.findUnique({
    where: { id: Number(id) },
  });

  if (!city) {
    return Response.json({ error: "Ville introuvable" }, { status: 404 });
  }

  return Response.json(city);
}

// DELETE /api/cities/[id] — supprime une ville (et ses relevés)
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const city = await prisma.city.findUnique({ where: { id: Number(id) } });
  if (!city) {
    return Response.json({ error: "Ville introuvable" }, { status: 404 });
  }

  await prisma.city.delete({ where: { id: Number(id) } });
  return new Response(null, { status: 204 });
}
