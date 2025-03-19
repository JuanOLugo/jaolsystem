import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { VentasPorMes } from "../Dashboard";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function SellsPerMonth({
  dataVentas,
}: {
  dataVentas: Array<VentasPorMes>;
}) {
  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Ventas Mensuales",
        font: {
          size: 16,
          weight: "bold" as const,
        },
        padding: {
          top: 20,
          bottom: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const data = {
    labels: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    datasets: [
      {
        label: "Ventas",
        data: dataVentas.length
          ? dataVentas.map((v) => v.total)
          : Array(12).fill(0),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderRadius: 6,
      },
    ],
  };

  return <Bar data={data} options={options} />;
}
