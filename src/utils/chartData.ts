const weeklyData = {
  labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  datasets: [
    {
      label: "Jobs Completed",
      data: [30, 50, 40, 70, 50, 60, 90],
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      tension: 0.4,
    },
  ],
};

const monthlyData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "Jobs Completed",
      data: [150, 200, 170, 250],
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      tension: 0.4,
    },
  ],
};

const yearlyData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Jobs Completed",
      data: [500, 600, 750, 800, 900, 850, 950, 1000, 1100, 1200, 1300, 1400],
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      tension: 0.4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          return `${context.raw} Jobs Completed`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 1500,
    },
  },
};

export { weeklyData, monthlyData, yearlyData, chartOptions };
