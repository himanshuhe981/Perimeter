import { prisma } from "@/lib/prisma";
import { PerimeterForm } from "@/components/manager/PerimeterForm";
import { LiveClockedInTable } from "@/components/manager/LiveClockedInTable";
import { StaffHistoryTable } from "@/components/manager/StaffHistoryTable";

export default async function ManagerPage() {
  const [perimeter, clockedIn, allShifts] = await Promise.all([
    prisma.perimeter.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.shift.findMany({
      where: { clockOutAt: null },
      include: { user: true },
      orderBy: { clockInAt: "desc" },
    }),
    prisma.shift.findMany({
      include: { user: true },
      orderBy: { clockInAt: "desc" },
      take: 200,
    }),
  ]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manager Dashboard</h1>
        <a href="/manager/dashboard" className="text-sm underline">
          View analytics dashboard
        </a>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Perimeter</h2>
        <PerimeterForm currentPerimeter={perimeter} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">
          Currently clocked in ({clockedIn.length})
        </h2>
        <LiveClockedInTable shifts={clockedIn} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Staff shift history</h2>
        <StaffHistoryTable shifts={allShifts} />
      </section>
    </div>
  );
}
