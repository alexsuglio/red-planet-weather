import { useState } from 'react';
import MarsTimeClocks from './MarsTimeClocks';

function fmt(val, decimals = 1) {
  return typeof val === 'number' ? val.toFixed(decimals) : '—';
}

function TempDisplay({ labelC, labelF, valC, valF, useFahrenheit, className = '' }) {
  return (
    <span className={`temp-val ${className}`}>
      {useFahrenheit ? `${fmt(valF)}°F` : `${fmt(valC)}°C`}
    </span>
  );
}

export default function MarsWeatherPanel({ data, activeRover, onRoverChange }) {
  const [useFahrenheit, setUseFahrenheit] = useState(false);

  const hasWeather = data && data.avgTempC !== null;
  const hasHistory = data && data.history && data.history.length > 1;

  return (
    <section className="mars-panel">
      <div className="panel-header mars-header">
        <div className="panel-title-row">
          <h2>🔴 Mars</h2>
          <div className="rover-toggle">
            <button
              className={`rover-btn ${activeRover === 'curiosity' ? 'active' : ''}`}
              onClick={() => onRoverChange('curiosity')}
            >
              Curiosity
            </button>
            <button
              className={`rover-btn ${activeRover === 'perseverance' ? 'active' : ''}`}
              onClick={() => onRoverChange('perseverance')}
            >
              Perseverance
            </button>
          </div>
          <button
            className="unit-toggle"
            onClick={() => setUseFahrenheit((f) => !f)}
          >
            {useFahrenheit ? '°C' : '°F'}
          </button>
        </div>
      </div>

      <MarsTimeClocks activeRover={activeRover} />

      {!data ? (
        <div className="no-data">Loading Mars weather…</div>
      ) : (
        <>
          <div className="rover-info-bar">
            <span className="rover-name">{data.rover}</span>
            <span className="rover-instrument">{data.instrument} instrument</span>
            <span className="rover-location">📍 {data.location}</span>
            {data.coordinates && (
              <span className="rover-coords">
                {data.coordinates.lat}°, {data.coordinates.lon}°
              </span>
            )}
          </div>

          <div className="sol-bar">
            <span className="sol-label">Sol {data.sol}</span>
            {data.date && <span className="sol-date">{data.date}</span>}
            {data.season && <span className="sol-season">{data.season}</span>}
            {data.dataQuality && (
              <span className={`data-quality ${data.dataQuality}`}>
                {data.dataQuality === 'complete' ? '✓ complete data' : data.dataQuality}
              </span>
            )}
          </div>

          {data.dataQuality === 'unavailable' ? (
            <div className="unavailable-note">
              <p>{data.dataNote}</p>
              <p>Live MEDA telemetry is not yet available in a public API.</p>
            </div>
          ) : (
            <>
              <div className="weather-metrics">
                <div className="metric-card primary">
                  <span className="metric-label">Temperature</span>
                  <TempDisplay
                    valC={data.avgTempC}
                    valF={data.avgTempF}
                    useFahrenheit={useFahrenheit}
                    className="metric-main"
                  />
                  <div className="metric-range">
                    <span>
                      Low:{' '}
                      <TempDisplay
                        valC={data.minTempC}
                        valF={data.minTempF}
                        useFahrenheit={useFahrenheit}
                        className="temp-min"
                      />
                    </span>
                    <span>
                      High:{' '}
                      <TempDisplay
                        valC={data.maxTempC}
                        valF={data.maxTempF}
                        useFahrenheit={useFahrenheit}
                        className="temp-max"
                      />
                    </span>
                  </div>
                </div>

                <div className="metric-card">
                  <span className="metric-label">Pressure</span>
                  <span className="metric-main">{fmt(data.pressureHpa)} hPa</span>
                </div>

                <div className="metric-card">
                  <span className="metric-label">Wind</span>
                  <span className="metric-main">{fmt(data.windMps)} m/s</span>
                  {data.windDirection && (
                    <span className="metric-sub">{data.windDirection}</span>
                  )}
                </div>

                {data.atmoOpacity && (
                  <div className="metric-card">
                    <span className="metric-label">Sky</span>
                    <span className="metric-main">{data.atmoOpacity}</span>
                  </div>
                )}
              </div>

              {hasHistory && (
                <div className="history-section">
                  <h3>Recent Sols</h3>
                  <div className="history-table">
                    <div className="history-row history-head">
                      <span>Sol</span>
                      <span>Date</span>
                      <span>Low</span>
                      <span>High</span>
                      <span>Pressure</span>
                      <span>Wind</span>
                    </div>
                    {data.history.map((row) => (
                      <div
                        key={row.sol}
                        className={`history-row ${row.sol === data.sol ? 'current-sol' : ''}`}
                      >
                        <span>{row.sol}</span>
                        <span>{row.date || '—'}</span>
                        <span className="temp-min">
                          {useFahrenheit ? `${fmt(row.minTempF)}°F` : `${fmt(row.minTempC)}°C`}
                        </span>
                        <span className="temp-max">
                          {useFahrenheit ? `${fmt(row.maxTempF)}°F` : `${fmt(row.maxTempC)}°C`}
                        </span>
                        <span>{fmt(row.pressureHpa)} hPa</span>
                        <span>{fmt(row.windMps)} m/s</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
