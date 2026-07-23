import { getDashboardStats } from "@/lib/dashboardStats";
import { StatsBarChart } from "@/components/manager/dashboard/StatsBarChart";

export default async function ManagerDashboardPage() {
  const { dailyStats, staffTotals } = await getDashboardStats(7);

  const dayLabels = dailyStats.map((d) =>
    new Date(`${d.date}T00:00:00Z`).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  );

  const staffSorted = [...staffTotals].sort(
    (a, b) => b.totalHours - a.totalHours,
  );

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <a href="/manager" className="text-sm underline">
          Back to manager view
        </a>
      </div>

      <StatsBarChart
        title="Average hours clocked in per day (last 7 days)"
        labels={dayLabels}
        values={dailyStats.map((d) => Math.round(d.avgHours * 10) / 10)}
        valueSuffix="h"
      />

      <StatsBarChart
        title="Number of staff clocking in per day (last 7 days)"
        labels={dayLabels}
        values={dailyStats.map((d) => d.clockInCount)}
      />

      <StatsBarChart
        title="Total hours per staff (last 7 days)"
        labels={staffSorted.map((s) => s.name ?? s.email)}
        values={staffSorted.map((s) => Math.round(s.totalHours * 10) / 10)}
        valueSuffix="h"
        indexAxis="y"
      />
    </div>
  );
}
