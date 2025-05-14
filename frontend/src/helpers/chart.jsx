import {
  ArcElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  Chart as ChartJS,
} from "chart.js";
import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import moment from "moment";

// Register chart.js elements once
ChartJS.register(
  ArcElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
);


export const getLast7Days = () => {
  const currentDate = moment();
  const last7Days = [];

  for (let i = 0; i < 7; i++) {
    const day = currentDate.clone().subtract(i, "days").format("dddd");
    last7Days.unshift(day);
  }

  return last7Days;
};

// Line chart options
const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      grid: { display: false },
    },
  },
};

// LineChart component
export const LineChart = ({ value = [] }) => {
  const data = {
    labels: getLast7Days(),
    datasets: [
      {
        label: "Messages",
        data: value,
        fill: true,
        backgroundColor: "rgba(173, 216, 230, 0.2)", // light blue
        borderColor: "#1E88E5", // blue
        tension: 0.4,
      },
    ],
  };

  return <Line data={data} options={lineChartOptions} />;
};

// Doughnut chart options
export const DoughnutChart = ({ value = [], labels = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        backgroundColor: ["#1E88E5", "#FB8C00"],
        hoverBackgroundColor: ["#64B5F6", "#FFB74D"],
        borderColor: ["#1976D2", "#F57C00"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: 100,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };
  console.log("DoughnutChart labels:", labels);
console.log("DoughnutChart values:", value);

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};