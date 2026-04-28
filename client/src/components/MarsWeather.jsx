export default function MarsWeather({ data, compact = false }) {
  const { sol, season, weather } = data;

  function formatTemp(temp) {
    return typeof temp === 'number' ? Math.round(temp) : 'N/A';
  }

  function formatNumber(value) {
    return typeof value === 'number' ? value.toFixed(2) : 'N/A';
  }

  return (
    <div className="weather-card mars-card">
      <div className="card-header">
        <h2>🔴 Mars Weather</h2>
        <p className="location">Sol {sol} • {season}</p>
      </div>

      <div className="condition-section">
        <div className="mars-icon">🤖</div>
        <div className="condition-info">
          <div className="temp-display mars-temps">
            <div className="temp-row">
              <span className="label">Average</span>
              <span className="temperature">{formatTemp(weather.averageTempF)}°</span>
            </div>
            <div className="temp-row">
              <span className="label">Min</span>
              <span className="temperature min">{formatTemp(weather.minTempF)}°</span>
            </div>
            <div className="temp-row">
              <span className="label">Max</span>
              <span className="temperature max">{formatTemp(weather.maxTempF)}°</span>
            </div>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="details-grid mars-details">
          <div className="detail-item">
            <span className="label">Wind Speed</span>
            <span className="value">{formatNumber(weather.windMps)} m/s</span>
          </div>
          <div className="detail-item">
            <span className="label">Data Source</span>
            <span className="value">NASA InSight</span>
          </div>
          <div className="detail-item">
            <span className="label">Season</span>
            <span className="value">{season}</span>
          </div>
        </div>
      )}

      {compact && (
        <div className="details-compact mars-compact">
          <div className="detail-item">
            <span className="label">Wind:</span>
            <span className="value">{formatNumber(weather.windMps)} m/s</span>
          </div>
          <div className="detail-item">
            <span className="label">Season:</span>
            <span className="value">{season}</span>
          </div>
        </div>
      )}

      <p className="mars-note">Data from NASA InSight Mars Lander</p>
    </div>
  );
}
