import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function BungieCord() {
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    setLoading(true);
    setError('');
    setWeather([]);
    try {
      const response = await fetch('https://localhost:7226/WeatherForecast', {
        headers: { accept: 'text/plain' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Bungie Cord</h2>
      <p>
        This is a placeholder page for exploring the API provided by the Bungie Service.
        Here, you will be able to interact with Bungie's endpoints, view data, and experiment with integration features.
        Stay tuned for more updates and hands-on API exploration!
      </p>
      <button className="btn btn-primary mb-3" onClick={fetchWeather} disabled={loading}>
        {loading ? 'Loading...' : 'Get Weather Forecast'}
      </button>
      {error && <div className="alert alert-danger">{error}</div>}
      {weather.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Temperature (°C)</th>
                <th>Temperature (°F)</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              {weather.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.date}</td>
                  <td>{item.temperatureC}</td>
                  <td>{item.temperatureF}</td>
                  <td>{item.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <hr className="my-4" />
      <Link to="/image-things" className="btn btn-outline-secondary">
        Go to Image Things
      </Link>
    </div>
  );
}