import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { Card } from "antd";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { getDashboardStats } from "@/lib/dashboardStats";
import { ClockInOutCard } from "@/components/worker/ClockInOutCard";
import { MyHistoryTable } from "@/components/worker/MyHistoryTable";
import { StatTile } from "@/components/manager/dashboard/StatTile";
import { ClockIcon, ChartIcon } from "@/components/shared/icons";

export default async function WorkerPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [activeShift, perimeter, myShifts, week] = await Promise.all([
    prisma.shift.findFirst({
      where: { userId: user.id, clockOutAt: null },
      orderBy: { clockInAt: "desc" },
    }),
    prisma.perimeter.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.shift.findMany({
      where: { userId: user.id },
      orderBy: { clockInAt: "desc" },
      take: 50,
    }),
    getDashboardStats(7, user.id),
  ]);

  const firstName = (user.name ?? user.email).split(/\s+/)[0];
  const weekTotalHours = week.staffTotals[0]?.totalHours ?? 0;
  const shiftsThisWeek = week.dailyStats.reduce(
    (sum, d) => sum + d.clockInCount,
    0,
  );
  const avgPerShift = shiftsThisWeek > 0 ? weekTotalHours / shiftsThisWeek : 0;

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-[900px] mx-auto w-full px-4 md:px-8 py-6 md:py-10 mb-20 md:mb-0">
      <div>
        <Title
          level={2}
          style={{
            margin: 0,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            fontSize: "clamp(1.375rem, 4.5vw, 1.75rem)",
          }}
        >
          Hey, {firstName}
        </Title>
        <Text type="secondary" style={{ fontSize: "clamp(0.8rem, 3vw, 0.95rem)" }}>
          Ready to start your shift?
        </Text>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        <div className="flex-[3_1_0%] min-w-0">
          <ClockInOutCard
            initialActiveShift={
              activeShift
                ? {
                    id: activeShift.id,
                    clockInAt: activeShift.clockInAt.toISOString(),
                  }
                : null
            }
            perimeter={perimeter}
          />
        </div>

        <div className="flex-[2_1_0%] min-w-0 grid grid-cols-2 lg:grid-cols-1 gap-3">
          <div className="col-span-2 lg:col-span-1">
            <StatTile
              label="Hours this week"
              value={`${weekTotalHours.toFixed(1)}h`}
              gradient="pm-gradient-violet"
              icon={<ClockIcon size={13} />}
              large
            />
          </div>
          <StatTile label="Shifts this week" value={String(shiftsThisWeek)} />
          <StatTile
            label="Avg / shift"
            value={`${avgPerShift.toFixed(1)}h`}
            gradient="pm-gradient-lime"
            icon={<ChartIcon size={13} />}
          />
        </div>
      </div>

      <Card
        className="pm-card w-full"
        style={{ border: "none" }}
        styles={{ body: { padding: 0 } }}
        title="Your shift history"
      >
        <div className="p-2">
          <MyHistoryTable shifts={myShifts} />
        </div>
      </Card>
    </div>
  );
}
