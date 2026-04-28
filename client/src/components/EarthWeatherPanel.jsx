const PRESET_LOCATIONS = [
  { name: 'Cape Canaveral, FL', shortName: 'NASA KSC', label: 'NASA Kennedy Space Center' },
  { name: 'Houston, TX', shortName: 'NASA JSC', label: 'NASA Johnson Space Center' },
  { name: 'Pasadena, CA', shortName: 'NASA JPL', label: 'NASA Jet Propulsion Laboratory' }
];

function fmt(val, dec = 0) {
  return typeof val === 'number' ? val.toFixed(dec) : '—';
}

export default function EarthWeatherPanel({
  data,
  selectedLocation,
  customLocation,
  onCustomChange,
  onSearch,
  onPreset,
  loading,
  error
}) {
  return (
    <section className="earth-panel">
      <div className="panel-header earth-header">
        <h2>🌍 Earth</h2>
      </div>

      <div className="earth-search">
        <form onSubmit={onSearch} className="search-form">
          <input
            type="text"
            value={customLocation}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder="City, region, or place…"
            className="search-input"
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? '…' : 'Go'}
          </button>
        </form>

        <div className="presets">
          {PRESET_LOCATIONS.map((loc) => (
            <button
              key={loc.name}
              onClick={() => onPreset(loc.name)}
              className={`preset-btn ${selectedLocation === loc.name ? 'active' : ''}`}
              title={loc.label}
            >
              {loc.shortName}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="earth-error">{error}</div>}

      {!data ? (
        <div className="no-data">{loading ? 'Loading…' : 'Search a location above'}</div>
      ) : (
        <>
          <div className="earth-location-bar">
            <span className="earth-place">
              {data.location.name}
              {data.location.region ? `, ${data.location.region}` : ''}
            </span>
            <span className="earth-country">{data.location.country}</span>
            <span className="earth-coords">
              {data.location.latitude}°, {data.location.longitude}°
            </span>
          </div>

          <div className="earth-main">
            {data.weather.icon && (
              <img
                src={`https:${data.weather.icon}`}
                alt={data.weather.condition}
                className="earth-icon"
              />
            )}
            <div className="earth-temp-block">
              <span className="earth-temp">{Math.round(data.weather.temperatureF)}°F</span>
              <span className="earth-temp-c">
                {Math.round((data.weather.temperatureF - 32) * 5 / 9)}°C
              </span>
              <span className="earth-condition">{data.weather.condition}</span>
              <span className="earth-feels">Feels like {Math.round(data.weather.feelsLikeF)}°F</span>
            </div>
          </div>

          <div className="earth-metrics">
            <div className="e-metric">
              <span className="e-label">Humidity</span>
              <span className="e-val">{fmt(data.weather.humidityPercent)}%</span>
            </div>
            <div className="e-metric">
              <span className="e-label">Wind</span>
              <span className="e-val">{fmt(data.weather.windMph)} mph</span>
            </div>
            <div className="e-metric">
              <span className="e-label">Gust</span>
              <span className="e-val">{fmt(data.weather.windGustMph)} mph</span>
            </div>
            <div className="e-metric">
              <span className="e-label">Pressure</span>
              <span className="e-val">{fmt(data.weather.pressureMb)} mb</span>
            </div>
            <div className="e-metric">
              <span className="e-label">Visibility</span>
              <span className="e-val">{fmt(data.weather.visibilityKm, 1)} km</span>
            </div>
            <div className="e-metric">
              <span className="e-label">UV Index</span>
              <span className="e-val">{fmt(data.weather.uvIndex, 1)}</span>
            </div>
          </div>

          <p className="earth-updated">
            Updated {new Date(data.weather.observedAt).toLocaleTimeString()} •{' '}
            {data.location.timezone}
          </p>
        </>
      )}
    </section>
  );
}
