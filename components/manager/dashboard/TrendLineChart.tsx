"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card } from "antd";
import { useTheme } from "@/components/shared/AntdThemeProvider";
import { chartColors } from "@/lib/chartTheme";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

export function TrendLineChart({
  title,
  labels,
  values,
  valueSuffix = "",
}: {
  title: string;
  labels: string[];
  values: number[];
  valueSuffix?: string;
}) {
  const { theme } = useTheme();
  const colors = theme === "dark" ? chartColors.dark : chartColors.light;

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.formattedValue}${valueSuffix}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: colors.text },
        border: { color: colors.axis },
      },
      y: {
        grid: { color: colors.grid },
        ticks: { color: colors.text },
        border: { display: false },
        beginAtZero: true,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: colors.bar,
        backgroundColor: colors.bar + "1a",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colors.bar,
        pointHoverBorderColor: colors.surface,
        pointHoverBorderWidth: 2,
      },
    ],
  };

  return (
    <Card title={title} size="small">
      <div style={{ height: 240 }}>
        <Line options={options} data={data} />
      </div>
    </Card>
  );
}
