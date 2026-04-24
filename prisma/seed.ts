import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Supprime les données existantes
  await prisma.weatherRecord.deleteMany();
  await prisma.city.deleteMany();

  const cities = await prisma.city.createManyAndReturn({
    data: [
      { name: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522 },
      { name: "Lyon", country: "France", latitude: 45.748, longitude: 4.8467 },
      { name: "Marseille", country: "France", latitude: 43.2965, longitude: 5.3698 },
      { name: "Bordeaux", country: "France", latitude: 44.8378, longitude: -0.5792 },
      { name: "Lille", country: "France", latitude: 50.6292, longitude: 3.0573 },
      { name: "Nantes", country: "France", latitude: 47.2184, longitude: -1.5536 },
      { name: "Toulouse", country: "France", latitude: 43.6047, longitude: 1.4442 },
      { name: "Strasbourg", country: "France", latitude: 48.5734, longitude: 7.7521 },
    ],
  });

  const conditions = ["ensoleillé", "nuageux", "pluie", "orageux", "brumeux", "venteux"];

  const now = new Date();

  for (const city of cities) {
    // 5 relevés par ville sur les 5 derniers jours
    for (let i = 0; i < 5; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      await prisma.weatherRecord.create({
        data: {
          cityId: city.id,
          temperature: parseFloat((Math.random() * 30 - 5).toFixed(1)),
          humidity: Math.floor(Math.random() * 60 + 30),
          windSpeed: parseFloat((Math.random() * 80).toFixed(1)),
          condition: conditions[Math.floor(Math.random() * conditions.length)],
          recordedAt: date,
        },
      });
    }
  }

  console.log(`✅ Seed terminé : ${cities.length} villes, ${cities.length * 5} relevés météo`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
