import { Button, Flex } from "antd";
import Title from "antd/es/typography/Title";
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
    <Flex
      vertical
      gap="large"
      style={{ maxWidth: 960, margin: "0 auto", padding: 24, width: "100%" }}
    >
      <Flex align="center" justify="space-between">
        <Title level={2} style={{ margin: 0 }}>
          Dashboard
        </Title>
        <Button href="/manager">Back to manager view</Button>
      </Flex>

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
    </Flex>
  );
}
