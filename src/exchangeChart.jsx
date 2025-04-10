import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function ExchangeChart({ from, toList }) {
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);

      const startDate = start.toISOString().split("T")[0];
      const endDate = end.toISOString().split("T")[0];

      const results = await Promise.all(
        toList.map(async (to) => {
          const url = `https://api.frankfurter.app/${startDate}..${endDate}?from=${from}&to=${to}`;
          const res = await axios.get(url);

          if (!res.data || !res.data.rates) {
            throw new Error(
              `Não foi possível obter dados para ${from} → ${to}`
            );
          }

          const labels = Object.keys(res.data.rates);
          const values = labels.map((date) => res.data.rates[date][to]);

          return {
            to,
            data: {
              labels,
              datasets: [
                {
                  label: `Variação de ${from} para ${to}`,
                  data: values,
                  borderColor: "#f9b233",
                  backgroundColor: "transparent",
                  tension: 0.3,
                },
              ],
            },
          };
        })
      );

      setCharts(results);
    };

    if (from && toList.length) {
      fetchData();
    }
  }, [from, toList]);

  if (!charts.length) return null;

  return (
    <div className="chart-container">
      {charts.map((chart) => (
        <div key={chart.to} style={{ marginBottom: "2rem" }}>
          <Line data={chart.data} />
        </div>
      ))}
    </div>
  );
}

export default ExchangeChart;
