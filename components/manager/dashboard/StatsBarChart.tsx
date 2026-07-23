"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card } from "antd";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { chartColors } from "@/lib/chartTheme";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export function StatsBarChart({
  title,
  labels,
  values,
  valueSuffix = "",
  indexAxis = "x",
}: {
  title: string;
  labels: string[];
  values: number[];
  valueSuffix?: string;
  indexAxis?: "x" | "y";
}) {
  const isDark = useIsDarkMode();
  const colors = isDark ? chartColors.dark : chartColors.light;

  const options: ChartOptions<"bar"> = {
    indexAxis,
    responsive: true,
    maintainAspectRatio: false,
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
        grid: { color: colors.grid, display: indexAxis === "y" },
        ticks: { color: colors.text },
        border: { color: colors.axis },
      },
      y: {
        grid: { color: colors.grid, display: indexAxis === "x" },
        ticks: { color: colors.text },
        border: { color: colors.axis },
        beginAtZero: true,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors.bar,
        borderRadius: 4,
        borderSkipped: false,
        maxBarThickness: 24,
      },
    ],
  };

  return (
    <Card title={title} size="small">
      <div style={{ height: 240 }}>
        <Bar options={options} data={data} />
      </div>
    </Card>
  );
}
