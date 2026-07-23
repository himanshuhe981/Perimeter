import dotenv from "dotenv";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Demo-only care workers seeded purely as data (auth0Id is a fake but valid
// placeholder — these accounts never log in, they only exist to populate
// realistic-looking tables and charts for a manager to explore).
const DEMO_WORKERS = [
  { slug: "amelia-chen", name: "Amelia Chen", email: "amelia.chen@demo.perimeter.app" },
  { slug: "daniel-osei", name: "Daniel Osei", email: "daniel.osei@demo.perimeter.app" },
  { slug: "priya-nair", name: "Priya Nair", email: "priya.nair@demo.perimeter.app" },
  { slug: "marcus-webb", name: "Marcus Webb", email: "marcus.webb@demo.perimeter.app" },
];

const NOTES_IN = [
  null,
  null,
  "Starting morning round",
  "Covering an extra hour today",
  null,
];
const NOTES_OUT = [
  null,
  null,
  "All tasks completed",
  "Handed off to next shift",
  null,
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function jitter(value: number, meters: number) {
  // ~0.00001 deg latitude ≈ 1.1m — keep seeded points within the perimeter.
  return value + (Math.random() - 0.5) * 2 * meters * 0.000009;
}

async function main() {
  const manager = await prisma.user.findFirst({ where: { role: "MANAGER" } });
  if (!manager) {
    throw new Error(
      "No MANAGER account found — log in and complete onboarding as a manager first.",
    );
  }

  const perimeter = await prisma.perimeter.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  if (!perimeter) {
    throw new Error(
      "No active perimeter found — set one from /manager first.",
    );
  }

  console.log(`Seeding demo shifts against perimeter "${perimeter.label}"...`);

  const workers = [];
  for (const w of DEMO_WORKERS) {
    const user = await prisma.user.upsert({
      where: { email: w.email },
      update: {},
      create: {
        auth0Id: `seed|${w.slug}`,
        email: w.email,
        name: w.name,
        role: "CARE_WORKER",
      },
    });
    workers.push(user);
  }

  const realWorker = await prisma.user.findFirst({
    where: { role: "CARE_WORKER", email: { notIn: DEMO_WORKERS.map((w) => w.email) } },
  });
  const allWorkers = realWorker ? [...workers, realWorker] : workers;

  // Clear previously seeded demo shifts so this script is safely re-runnable.
  await prisma.shift.deleteMany({
    where: { userId: { in: workers.map((w) => w.id) } },
  });

  const DAYS = 14;
  const now = new Date();
  let created = 0;

  for (let dayOffset = DAYS - 1; dayOffset >= 0; dayOffset--) {
    const day = new Date(now);
    day.setDate(day.getDate() - dayOffset);
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;

    for (const worker of allWorkers) {
      // Skip some weekend shifts and the occasional weekday for realism.
      if (isWeekend && Math.random() < 0.6) continue;
      if (!isWeekend && Math.random() < 0.12) continue;

      const clockInAt = new Date(day);
      clockInAt.setHours(7 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60), 0, 0);

      const isToday = dayOffset === 0;
      const stillClockedIn = isToday && Math.random() < 0.35;

      const shiftHours = 6 + Math.random() * 3.5;
      const clockOutAt = stillClockedIn
        ? null
        : new Date(clockInAt.getTime() + shiftHours * 3600000);

      await prisma.shift.create({
        data: {
          userId: worker.id,
          clockInAt,
          clockInLat: jitter(perimeter.latitude, perimeter.radiusMeters * 0.3),
          clockInLng: jitter(perimeter.longitude, perimeter.radiusMeters * 0.3),
          clockInNote: pick(NOTES_IN),
          clockOutAt,
          clockOutLat: clockOutAt
            ? jitter(perimeter.latitude, perimeter.radiusMeters * 0.3)
            : null,
          clockOutLng: clockOutAt
            ? jitter(perimeter.longitude, perimeter.radiusMeters * 0.3)
            : null,
          clockOutNote: clockOutAt ? pick(NOTES_OUT) : null,
        },
      });
      created++;
    }
  }

  console.log(`Created ${created} demo shifts across ${allWorkers.length} staff over the last ${DAYS} days.`);
  console.log(`Manager: ${manager.email} — log in and visit /manager to see it.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
