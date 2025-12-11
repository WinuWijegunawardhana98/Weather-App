import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Safely convert Kelvin or Celsius values to Celsius (handles missing data).
const toCelsius = (value) => {
  if (typeof value !== "number") return null;
  // OpenWeather free forecast returns Kelvin; guard in case already Celsius.
  return Math.abs(value) > 150 ? Math.round(value - 273.15) : Math.round(value);
};

const TemperatureCharts = ({ hourlyData = [], dailyData = [] }) => {
  const hourlyChartData = (hourlyData || []).map((h) => {
    const rawTemp = h?.main?.temp ?? h?.temp;
    const tempC = toCelsius(rawTemp);
    const time = h?.dt
      ? new Date(h.dt * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
    return { time, temp: tempC };
  });

  const dailyChartData = (dailyData || []).map((d) => {
    const rawMin = d?.main?.temp_min ?? d?.temp?.min ?? d?.tempMin;
    const rawMax = d?.main?.temp_max ?? d?.temp?.max ?? d?.tempMax;
    const min = toCelsius(rawMin);
    const max = toCelsius(rawMax);
    const day = d?.dt
      ? new Date(d.dt * 1000).toLocaleDateString([], { weekday: "short" })
      : "";
    return { day, min, max };
  });

  const hasHourly = hourlyChartData.some((d) => typeof d.temp === "number");
  const hasDaily =
    dailyChartData.some((d) => typeof d.min === "number") &&
    dailyChartData.some((d) => typeof d.max === "number");

  if (!hasHourly && !hasDaily) return null;

  return (
    <div className="temperature-charts mt-6 px-4 grid gap-6 md:grid-cols-2">
      {hasHourly && (
        <div className="chart-card bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-3 text-lg">Hourly Temperature</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={hourlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis unit="°C" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {hasDaily && (
        <div className="chart-card bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-3 text-lg">Daily Min/Max</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis unit="°C" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="min"
                stroke="#10b981"
                strokeWidth={2}
                dot
              />
              <Line
                type="monotone"
                dataKey="max"
                stroke="#ef4444"
                strokeWidth={2}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TemperatureCharts;

