export default function EarthWeather({ data, location, compact = false }) {
  const { location: loc, weather } = data;

  function formatTemp(temp) {
    return Math.round(temp);
  }

  function formatNumber(value, decimals = 1) {
    return typeof value === 'number' ? value.toFixed(decimals) : 'N/A';
  }

  const locationDisplay = `${loc.name}${loc.region ? ', ' + loc.region : ''}`;

  return (
    <div className="weather-card earth-card">
      <div className="card-header">
        <h2>🌍 Earth Weather</h2>
        <p className="location">{locationDisplay}, {loc.country}</p>
      </div>

      <div className="condition-section">
        {weather.icon && <img src={weather.icon} alt={weather.condition} className="weather-icon" />}
        <div className="condition-info">
          <div className="temp-display">
            <span className="temperature">{formatTemp(weather.temperatureF)}°</span>
            <span className="unit">F</span>
          </div>
          <p className="condition-text">{weather.condition}</p>
          <p className="feels-like">Feels like {formatTemp(weather.feelsLikeF)}°</p>
        </div>
      </div>

      {!compact && (
        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Humidity</span>
            <span className="value">{weather.humidityPercent}%</span>
          </div>
          <div className="detail-item">
            <span className="label">Wind Speed</span>
            <span className="value">{formatNumber(weather.windMph, 0)} mph</span>
          </div>
          <div className="detail-item">
            <span className="label">Wind Gust</span>
            <span className="value">{formatNumber(weather.windGustMph, 0)} mph</span>
          </div>
          <div className="detail-item">
            <span className="label">Pressure</span>
            <span className="value">{formatNumber(weather.pressureMb, 0)} mb</span>
          </div>
          <div className="detail-item">
            <span className="label">Visibility</span>
            <span className="value">{formatNumber(weather.visibilityKm, 1)} km</span>
          </div>
          <div className="detail-item">
            <span className="label">UV Index</span>
            <span className="value">{formatNumber(weather.uvIndex, 1)}</span>
          </div>
        </div>
      )}

      {compact && (
        <div className="details-compact">
          <div className="detail-item">
            <span className="label">Humidity:</span>
            <span className="value">{weather.humidityPercent}%</span>
          </div>
          <div className="detail-item">
            <span className="label">Wind:</span>
            <span className="value">{formatNumber(weather.windMph, 0)} mph</span>
          </div>
          <div className="detail-item">
            <span className="label">Pressure:</span>
            <span className="value">{formatNumber(weather.pressureMb, 0)} mb</span>
          </div>
        </div>
      )}

      <p className="updated-time">Updated: {new Date(weather.observedAt).toLocaleTimeString()}</p>
    </div>
  );
}
