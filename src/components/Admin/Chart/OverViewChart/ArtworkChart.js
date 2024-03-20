import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

function ArtworkChart({ dataChart }) {
  const labels = [
    0,
    "00:00 - 05:00",
    "06:00 - 11:00",
    "12:00 - 17:00",
    "18:00 - 23:00",
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Today",
        data: dataChart.current,
        backgroundColor: "transparent",
        fill: false,
        borderColor: "#EC4A68",
        borderWidth: 2,
        pointStyle: "circle",
        pointBackgroundColor: "#EC4A68",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Yesterday",
        data: dataChart.previous,
        backgroundColor: "transparent",
        fill: false,
        borderColor: "#C9CBCF",
        borderWidth: 2,
        pointStyle: "circle",
        pointBackgroundColor: "#C9CBCF",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        display: true,
        labels: {
          font: {
            size: 15,
            weight: "bold",
          },
          boxWidth: 70,
          boxHeight: 0,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US").format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        grid: {
          color: "#f1f1f1",
        },
        ticks: {
          color: "#999",
          font: {
            size: 13,
            weight: "bold",
          },
        },
      },
    },
  };
  return <Line data={data} options={options}></Line>;
}

export default ArtworkChart;
