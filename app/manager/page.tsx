import { Card, Flex } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getDashboardStats } from "@/lib/dashboardStats";
import { formatShortDate } from "@/lib/formatDate";
import { PerimeterForm } from "@/components/manager/PerimeterForm";
import { LiveClockedInTable } from "@/components/manager/LiveClockedInTable";
import { StatTile } from "@/components/manager/dashboard/StatTile";
import { TrendLineChart } from "@/components/manager/dashboard/TrendLineChart";
import { RefreshButton } from "@/components/shared/RefreshButton";
import { UsersIcon, ClockIcon, ChartIcon } from "@/components/shared/icons";

export default async function ManagerPage() {
  const user = await getCurrentUser();
  const [perimeter, clockedIn, today, week] = await Promise.all([
    prisma.perimeter.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.shift.findMany({
      where: { clockOutAt: null },
      include: { user: true },
      orderBy: { clockInAt: "desc" },
      take: 5,
    }),
    getDashboardStats(1),
    getDashboardStats(7),
  ]);

  const todayStat = today.dailyStats[0];
  const weekTotalHours = week.staffTotals.reduce(
    (sum, s) => sum + s.totalHours,
    0,
  );

  const dayLabels = week.dailyStats.map((d) =>
    formatShortDate(new Date(`${d.date}T00:00:00Z`)),
  );
  const avgHoursValues = week.dailyStats.map(
    (d) => Math.round(d.avgHours * 10) / 10,
  );

  const firstName = (user?.name ?? user?.email ?? "").split(/\s+/)[0];

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-[1200px] mx-auto w-full px-4 md:px-8 py-6 md:py-10 mb-20 md:mb-0">
      <div className="flex flex-row items-start justify-between gap-3">
        <div className="min-w-0">
          <Title
            level={2}
            style={{
              margin: 0,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              fontSize: "clamp(1.375rem, 4.5vw, 1.75rem)",
            }}
          >
            Welcome back, {firstName}
          </Title>
          <Text
            type="secondary"
            style={{ fontSize: "clamp(0.8rem, 3vw, 0.95rem)" }}
          >
            Here&apos;s what&apos;s happening across your team today.
          </Text>
        </div>
        <div className="mt-1 shrink-0">
          <RefreshButton compact />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <div className="col-span-2 sm:col-span-1">
          <StatTile
            label="Clocked in now"
            value={String(clockedIn.length)}
            gradient="pm-gradient-violet"
            icon={<UsersIcon size={14} />}
            large
          />
        </div>
        <StatTile
          label="Clocked in today"
          value={String(todayStat?.clockInCount ?? 0)}
          icon={<ClockIcon size={13} />}
        />
        <StatTile
          label="Avg hours today"
          value={`${(todayStat?.avgHours ?? 0).toFixed(1)}h`}
          gradient="pm-gradient-lime"
        />
        <div className="col-span-2 sm:col-span-1">
          <StatTile
            label="Total hours (7d)"
            value={`${weekTotalHours.toFixed(1)}h`}
            icon={<ChartIcon size={13} />}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
        <div className="flex flex-col gap-6 flex-[2_1_0%] min-w-0">
          <div className="pm-card w-full p-4 md:p-6">
            <Flex
              justify="space-between"
              align="center"
              style={{ marginBottom: 16 }}
            >
              <Title level={5} style={{ margin: 0 }}>
                Activity Overview
              </Title>
              <Link
                href="/manager/dashboard"
                style={{ fontSize: 13, fontWeight: 500, color: "var(--accent)" }}
              >
                View full analytics →
              </Link>
            </Flex>
            <TrendLineChart
              title=""
              labels={dayLabels}
              values={avgHoursValues}
              valueSuffix="h"
            />
          </div>

          <Card
            className="pm-card w-full"
            style={{ border: "none" }}
            title={`Currently clocked in (${clockedIn.length})`}
            extra={
              <Link
                href="/manager/live"
                style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500 }}
              >
                See all →
              </Link>
            }
          >
            <LiveClockedInTable shifts={clockedIn} compact />
          </Card>
        </div>

        <div className="flex-[1_1_0%] min-w-0">
          <PerimeterForm currentPerimeter={perimeter} />
        </div>
      </div>
    </div>
  );
}
