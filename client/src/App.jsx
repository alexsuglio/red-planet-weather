import { useState, useEffect } from 'react';
import './styles.css';
import MarsWeatherPanel from './components/MarsWeatherPanel';
import EarthWeatherPanel from './components/EarthWeatherPanel';

export default function App() {
  const [activeRover, setActiveRover] = useState('curiosity');
  const [marsData, setMarsData] = useState(null);
  const [marsLoading, setMarsLoading] = useState(false);

  const [earthData, setEarthData] = useState(null);
  const [earthLoading, setEarthLoading] = useState(false);
  const [earthError, setEarthError] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Cape Canaveral, FL');
  const [customLocation, setCustomLocation] = useState('');

  useEffect(() => {
    fetchMars(activeRover);
  }, [activeRover]);

  useEffect(() => {
    fetchEarth(selectedLocation);
  }, [selectedLocation]);

  async function fetchMars(rover) {
    setMarsLoading(true);
    try {
      const res = await fetch(`/api/weather/mars?rover=${rover}`);
      if (!res.ok) throw new Error('Mars fetch failed');
      setMarsData(await res.json());
    } catch {
      setMarsData(null);
    } finally {
      setMarsLoading(false);
    }
  }

  async function fetchEarth(location) {
    setEarthLoading(true);
    setEarthError('');
    try {
      const res = await fetch(`/api/weather/earth?location=${encodeURIComponent(location)}`);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Earth fetch failed');
      setEarthData(payload);
    } catch (err) {
      setEarthError(err.message);
      setEarthData(null);
    } finally {
      setEarthLoading(false);
    }
  }

  function handlePreset(locationName) {
    setSelectedLocation(locationName);
    setCustomLocation('');
  }

  function handleSearch(e) {
    e.preventDefault();
    const trimmed = customLocation.trim();
    if (trimmed) {
      setSelectedLocation(trimmed);
      setCustomLocation('');
    }
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-inner">
          <h1>Red Planet Weather</h1>
          <p className="header-sub">Live Mars &amp; Earth weather · NASA data</p>
        </div>
        <div className="header-badge">🚀 Live</div>
      </header>

      <main className="dashboard-layout">
        <MarsWeatherPanel
          data={marsData}
          activeRover={activeRover}
          onRoverChange={setActiveRover}
          loading={marsLoading}
        />

        <EarthWeatherPanel
          data={earthData}
          selectedLocation={selectedLocation}
          customLocation={customLocation}
          onCustomChange={setCustomLocation}
          onSearch={handleSearch}
          onPreset={handlePreset}
          loading={earthLoading}
          error={earthError}
        />
      </main>

      <footer className="app-footer">
        Mars weather: NASA REMS (Curiosity) · Time: NASA Mars24 algorithm · Earth weather: WeatherAPI
      </footer>
    </div>
  );
}
