import { Card, Flex } from "antd";
import Title from "antd/es/typography/Title";
import { prisma } from "@/lib/prisma";
import { LiveClockedInTable } from "@/components/manager/LiveClockedInTable";
import { StaffHistoryTable } from "@/components/manager/StaffHistoryTable";
import { RefreshButton } from "@/components/shared/RefreshButton";
import { formatDateTime } from "@/lib/formatDate";

export default async function ManagerLivePage() {
  const [clockedIn, allShifts] = await Promise.all([
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
    <div className="flex flex-col gap-6 max-w-[1080px] mx-auto w-full px-4 md:px-8 py-6 md:py-10 mb-20 md:mb-0">
      <div className="flex flex-row items-center justify-between gap-4">
        <Title
          level={2}
          style={{ margin: 0, fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          Staff &amp; Live Status
        </Title>
        <RefreshButton compact />
      </div>

      <Card
        title={`Currently clocked in (${clockedIn.length})`}
        className="pm-card"
        style={{ border: "none" }}
        styles={{ body: { padding: 0 } }}
      >
        <div className="hidden md:block p-4">
          <LiveClockedInTable shifts={clockedIn} />
        </div>
        <div className="md:hidden flex flex-col divide-y divide-[var(--border)]">
          {clockedIn.map((shift) => (
            <div
              key={shift.id}
              className="p-4 flex justify-between items-center hover:bg-[var(--surface-2)] transition-colors"
            >
              <div>
                <div style={{ fontWeight: 600 }}>
                  {shift.user.name ?? shift.user.email}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {formatDateTime(shift.clockInAt)}
                </div>
              </div>
              <span
                className="pm-pill"
                style={{ background: "var(--green-soft)", color: "var(--green)" }}
              >
                Active
              </span>
            </div>
          ))}
          {clockedIn.length === 0 && (
            <div className="p-6 text-center text-[var(--muted)]">
              No active shifts
            </div>
          )}
        </div>
      </Card>

      <Card
        title="Shift history"
        className="pm-card"
        style={{ border: "none" }}
        styles={{ body: { padding: 0 } }}
      >
        <div className="hidden md:block p-4">
          <StaffHistoryTable shifts={allShifts} />
        </div>
        <div className="md:hidden flex flex-col divide-y divide-[var(--border)] max-h-[60vh] overflow-y-auto">
          {allShifts.slice(0, 30).map((shift) => (
            <div
              key={shift.id}
              className="p-4 flex justify-between items-center hover:bg-[var(--surface-2)] transition-colors"
            >
              <div>
                <div style={{ fontWeight: 600 }}>
                  {shift.user.name ?? shift.user.email}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {formatDateTime(shift.clockInAt)}
                </div>
              </div>
              <span
                className="pm-pill"
                style={{
                  background: shift.clockOutAt
                    ? "var(--surface-2)"
                    : "var(--green-soft)",
                  color: shift.clockOutAt ? "var(--muted)" : "var(--green)",
                }}
              >
                {shift.clockOutAt ? "Completed" : "Active"}
              </span>
            </div>
          ))}
          {allShifts.length === 0 && (
            <div className="p-6 text-center text-[var(--muted)]">
              No shift history
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
