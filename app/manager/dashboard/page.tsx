import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { getDashboardStats, getAllStaff } from "@/lib/dashboardStats";
import { StatsBarChart } from "@/components/manager/dashboard/StatsBarChart";
import { TrendLineChart } from "@/components/manager/dashboard/TrendLineChart";
import { DashboardFilters } from "@/components/manager/dashboard/DashboardFilters";
import { StatTile } from "@/components/manager/dashboard/StatTile";
import { formatShortDate } from "@/lib/formatDate";

const VALID_RANGES = [7, 14, 30];

export default async function ManagerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; staff?: string }>;
}) {
  const params = await searchParams;
  const rangeDays = VALID_RANGES.includes(Number(params.range))
    ? Number(params.range)
    : 7;
  const staffId = params.staff;

  const [{ dailyStats, staffTotals }, allStaff] = await Promise.all([
    getDashboardStats(rangeDays, staffId),
    getAllStaff(),
  ]);

  const dayLabels = dailyStats.map((d) =>
    formatShortDate(new Date(`${d.date}T00:00:00Z`)),
  );

  const staffSorted = [...staffTotals].sort(
    (a, b) => b.totalHours - a.totalHours,
  );

  const daysWithData = dailyStats.filter((d) => d.clockInCount > 0);
  const avgOfPeriod =
    daysWithData.length > 0
      ? daysWithData.reduce((sum, d) => sum + d.avgHours, 0) /
        daysWithData.length
      : 0;
  const totalClockIns = dailyStats.reduce((sum, d) => sum + d.clockInCount, 0);
  const topStaff = staffSorted[0];

  return (
    <div className="flex flex-col gap-6 max-w-[1080px] mx-auto w-full px-4 md:px-8 py-6 md:py-10 mb-20 md:mb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title
            level={2}
            style={{ margin: 0, fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            Analytics
          </Title>
          <Text type="secondary">
            Trends across your team&apos;s clocked hours.
          </Text>
        </div>
        <DashboardFilters
          rangeDays={rangeDays}
          staffId={staffId}
          staff={allStaff}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
        <StatTile
          label={`Avg hours/day (${rangeDays}d)`}
          value={`${avgOfPeriod.toFixed(1)}h`}
          gradient="pm-gradient-violet"
        />
        <StatTile label="Total clock-ins" value={String(totalClockIns)} />
        <StatTile
          label="Most active staff"
          value={
            topStaff ? (topStaff.name ?? topStaff.email).split(" ")[0] : "—"
          }
          gradient="pm-gradient-lime"
        />
        <StatTile
          label="Total hours"
          value={`${staffSorted.reduce((sum, s) => sum + s.totalHours, 0).toFixed(1)}h`}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1 min-w-0">
          <TrendLineChart
            title="Average hours per day"
            labels={dayLabels}
            values={dailyStats.map((d) => Math.round(d.avgHours * 10) / 10)}
            valueSuffix="h"
          />
        </div>
        <div className="flex-1 min-w-0">
          <TrendLineChart
            title="Staff clocking in per day"
            labels={dayLabels}
            values={dailyStats.map((d) => d.clockInCount)}
          />
        </div>
      </div>

      <StatsBarChart
        title="Total hours per staff"
        labels={staffSorted.map((s) => s.name ?? s.email)}
        values={staffSorted.map((s) => Math.round(s.totalHours * 10) / 10)}
        valueSuffix="h"
        indexAxis="y"
      />
    </div>
  );
}
