'use strict';

const HttpError = require('../utils/httpError');

const WEATHER_API_BASE = 'https://api.weatherapi.com/v1';

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const message = error.error?.message || `External API failed: ${url}`;
    throw new HttpError(response.status, message);
  }

  return response.json();
}

async function getEarthWeather(location, apiKey) {
  if (!location) {
    throw new HttpError(400, 'Location is required');
  }

  if (!apiKey) {
    throw new HttpError(500, 'Weather API key is not configured on the server');
  }

  const query = new URLSearchParams({
    key: apiKey,
    q: location,
    aqi: 'no'
  });

  const data = await fetchJson(`${WEATHER_API_BASE}/current.json?${query.toString()}`);

  if (!data.current || !data.location) {
    throw new HttpError(502, 'No weather data available for this location');
  }

  const current = data.current;
  const loc = data.location;

  return {
    location: {
      name: loc.name,
      region: loc.region,
      country: loc.country,
      latitude: loc.lat,
      longitude: loc.lon,
      timezone: loc.tz_id
    },
    weather: {
      temperatureF: current.temp_f,
      feelsLikeF: current.feelslike_f,
      humidityPercent: current.humidity,
      windMph: current.wind_mph,
      windGustMph: current.gust_mph,
      pressureMb: current.pressure_mb,
      visibilityKm: current.vis_km,
      uvIndex: current.uv,
      condition: current.condition.text,
      icon: current.condition.icon,
      observedAt: current.last_updated
    }
  };
}

module.exports = {
  getEarthWeather
};
