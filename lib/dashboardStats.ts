import { prisma } from "@/lib/prisma";

export type DailyStat = {
  date: string;
  avgHours: number;
  clockInCount: number;
};

export type StaffTotal = {
  userId: string;
  name: string | null;
  email: string;
  totalHours: number;
};

export async function getDashboardStats(
  rangeDays: number = 7,
  staffId?: string | null,
) {
  const startOfRange = new Date();
  startOfRange.setUTCHours(0, 0, 0, 0);
  startOfRange.setUTCDate(startOfRange.getUTCDate() - (rangeDays - 1));

  const shifts = await prisma.shift.findMany({
    where: {
      clockInAt: { gte: startOfRange },
      ...(staffId ? { userId: staffId } : {}),
    },
    include: { user: true },
  });

  const dayBuckets = new Map<
    string,
    { totalHours: number; userIds: Set<string> }
  >();
  for (let i = 0; i < rangeDays; i++) {
    const d = new Date(startOfRange);
    d.setUTCDate(d.getUTCDate() + i);
    dayBuckets.set(d.toISOString().slice(0, 10), {
      totalHours: 0,
      userIds: new Set(),
    });
  }

  const staffTotals = new Map<
    string,
    { name: string | null; email: string; totalHours: number }
  >();

  const now = Date.now();
  for (const shift of shifts) {
    // Still-open shifts count elapsed time-so-far rather than being
    // excluded, so a manager sees today's in-progress hours reflected.
    const hours =
      ((shift.clockOutAt ? shift.clockOutAt.getTime() : now) -
        shift.clockInAt.getTime()) /
      3600000;

    const dayKey = shift.clockInAt.toISOString().slice(0, 10);
    const bucket = dayBuckets.get(dayKey);
    if (bucket) {
      bucket.totalHours += hours;
      bucket.userIds.add(shift.userId);
    }

    const existingTotal = staffTotals.get(shift.userId);
    if (existingTotal) {
      existingTotal.totalHours += hours;
    } else {
      staffTotals.set(shift.userId, {
        name: shift.user.name,
        email: shift.user.email,
        totalHours: hours,
      });
    }
  }

  const dailyStats: DailyStat[] = [...dayBuckets.entries()].map(
    ([date, b]) => ({
      date,
      avgHours: b.userIds.size > 0 ? b.totalHours / b.userIds.size : 0,
      clockInCount: b.userIds.size,
    }),
  );

  const staffTotalsArr: StaffTotal[] = [...staffTotals.entries()].map(
    ([userId, s]) => ({
      userId,
      name: s.name,
      email: s.email,
      totalHours: s.totalHours,
    }),
  );

  return { dailyStats, staffTotals: staffTotalsArr };
}

export async function getAllStaff() {
  return prisma.user.findMany({
    where: { role: "CARE_WORKER" },
    select: { id: true, name: true, email: true },
    orderBy: { email: "asc" },
  });
}
