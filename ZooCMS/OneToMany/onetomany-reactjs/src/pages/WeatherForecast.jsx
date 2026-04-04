import React, { useEffect, useState } from "react";

const WEATHER_API_URL = "https://localhost:7226/WeatherForecast";

const columns = [
  { key: "date", label: "Date" },
  { key: "temperatureC", label: "Temp (°C)" },
  { key: "temperatureF", label: "Temp (°F)" },
  { key: "summary", label: "Summary" },
];

export default function WeatherForecast() {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "asc" });

  const fetchWeather = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(WEATHER_API_URL, {
        headers: { accept: "text/plain" },
      });
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setForecasts(data);
    } catch (err) {
      setError("Error loading weather data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const sortedForecasts = React.useMemo(() => {
    if (!sortConfig.key) return forecasts;
    const sorted = [...forecasts].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [forecasts, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="main-content">
      <h2>Weather Forecast</h2>
      <div className="mb-2 text-muted" style={{ fontSize: "0.95em" }}>
        Note: Click on any column header to sort the table.
      </div>
      <button className="btn btn-primary mb-3" onClick={fetchWeather} disabled={loading}>
        {loading ? "Loading..." : "Reload"}
      </button>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-striped">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                {getSortIndicator(col.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedForecasts.map((f, idx) => (
            <tr key={idx}>
              <td>{f.date}</td>
              <td>{f.temperatureC}</td>
              <td>{f.temperatureF}</td>
              <td>{f.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}