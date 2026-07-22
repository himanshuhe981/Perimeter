import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { ClockInOutCard } from "@/components/worker/ClockInOutCard";

export default async function WorkerPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [activeShift, perimeter] = await Promise.all([
    prisma.shift.findFirst({
      where: { userId: user.id, clockOutAt: null },
      orderBy: { clockInAt: "desc" },
    }),
    prisma.perimeter.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12">
      <h1 className="text-2xl font-semibold">Clock In / Out</h1>
      <ClockInOutCard
        initialActiveShift={
          activeShift
            ? { id: activeShift.id, clockInAt: activeShift.clockInAt.toISOString() }
            : null
        }
        perimeter={perimeter}
      />
    </div>
  );
}
