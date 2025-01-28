"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTimeFilter } from "@/context/TimeFilterProvider";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const PackagesOverview = () => {
  const { timeFilter } = useTimeFilter();

  const dataByTimeFilter = {
    weekly: {
      data: [1200, 600, 1500],
      total: 3300,
      change: -10,
    },
    monthly: {
      data: [8500, 2500, 5000],
      total: 10320,
      change: -20,
    },
    yearly: {
      data: [95000, 45000, 70000],
      total: 210000,
      change: 15,
    },
    allTime: {
      data: [250000, 125000, 175000],
      total: 550000,
      change: 30,
    },
  };

  const { data, total, change } =
    dataByTimeFilter[timeFilter as keyof typeof dataByTimeFilter];

  const chartData = {
    labels: ["Basic", "Standard", "Premium"],
    datasets: [
      {
        label: "Packages",
        data,
        backgroundColor: [
          "rgba(0, 123, 255, 0.5)",
          "rgba(0, 123, 255, 0.3)",
          "rgba(0, 123, 255, 1)",
        ],
      },
    ],
  };

  const options = {
    // responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
        // max: Math.max(...data) + 2000,
      },
    },
  };

  return (
    <div className="bg-background rounded-lg p-4 h-full">
      <h2 className="font-bold">Packages Overview</h2>

      <div className="font-bold mb-4">
        {total.toLocaleString()}{" "}
        <span className="text-sm text-red-500 ">{change}%</span>
      </div>

      <Bar className="h-full" data={chartData} options={options} />
    </div>
  );
};

export default PackagesOverview;
