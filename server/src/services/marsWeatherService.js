'use strict';

const HttpError = require('../utils/httpError');

// MAAS2 API — Curiosity REMS data from InSight/MAAS proxy
const MAAS2_URL = 'https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json';

// NASA InSight fallback
const NASA_INSIGHT_URL = 'https://api.nasa.gov/insight_weather/';

// Perseverance landing: Sol 0 = 2021-02-18
const PERSEVERANCE_LANDING_MS = 1613685300000;
const MARS_SOL_MS = 88775244;

function toNum(v) {
  return typeof v === 'number' ? Math.round(v * 10) / 10 : null;
}

function toNumC(v) {
  return typeof v === 'number' ? Math.round(v * 10) / 10 : null;
}

function cToF(c) {
  return typeof c === 'number' ? Math.round(((c * 9) / 5 + 32) * 10) / 10 : null;
}

// Curiosity via MAAS2 (NASA Mars Weather Service)
async function getCuriosityWeather() {
  try {
    const response = await fetch(MAAS2_URL, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('MAAS2 unavailable');

    const payload = await response.json();
    const reports = Array.isArray(payload) ? payload : (payload.soles || []);
    if (!reports.length) throw new Error('No MAAS2 data');

    // Build history: last N sols
    const sorted = [...reports].sort((a, b) => Number(b.sol) - Number(a.sol));
    const history = sorted.slice(0, 7).map((r) => ({
      sol: Number(r.sol),
      date: r.terrestrial_date || null,
      minTempC: toNumC(Number(r.min_temp)),
      maxTempC: toNumC(Number(r.max_temp)),
      minTempF: cToF(Number(r.min_temp)),
      maxTempF: cToF(Number(r.max_temp)),
      pressureHpa: toNum(Number(r.pressure)),
      windMps: r.wind_speed !== '--' ? toNum(Number(r.wind_speed)) : null,
      windDirection: r.wind_direction !== '--' ? r.wind_direction : null,
      atmoOpacity: r.atmo_opacity || null,
      season: r.season || null
    }));

    const latest = history[0];

    return {
      rover: 'Curiosity',
      instrument: 'REMS',
      location: 'Gale Crater',
      coordinates: { lat: -4.59, lon: 137.44 },
      sol: latest.sol,
      date: latest.date,
      avgTempC: latest.minTempC !== null && latest.maxTempC !== null
        ? Math.round(((latest.minTempC + latest.maxTempC) / 2) * 10) / 10
        : null,
      minTempC: latest.minTempC,
      maxTempC: latest.maxTempC,
      avgTempF: latest.minTempF !== null && latest.maxTempF !== null
        ? Math.round(((latest.minTempF + latest.maxTempF) / 2) * 10) / 10
        : null,
      minTempF: latest.minTempF,
      maxTempF: latest.maxTempF,
      pressureHpa: latest.pressureHpa,
      windMps: latest.windMps,
      windDirection: latest.windDirection,
      atmoOpacity: latest.atmoOpacity,
      season: latest.season,
      dataQuality: 'complete',
      history
    };
  } catch {
    return null;
  }
}

// Perseverance — modeled from known Jezero Crater atmospheric data
// (No public real-time MEDA API yet; returns null for live data fields)
async function getPerseveranceWeather() {
  const currentSol = Math.floor((Date.now() - PERSEVERANCE_LANDING_MS) / MARS_SOL_MS);

  // Jezero Crater is at ~18.4°N, similar pressure to InSight (Elysium Planitia)
  // Temps are slightly warmer than Gale due to lower elevation
  return {
    rover: 'Perseverance',
    instrument: 'MEDA',
    location: 'Jezero Crater',
    coordinates: { lat: 18.44, lon: 77.45 },
    sol: currentSol,
    date: null,
    avgTempC: null,
    minTempC: null,
    maxTempC: null,
    avgTempF: null,
    minTempF: null,
    maxTempF: null,
    pressureHpa: null,
    windMps: null,
    windDirection: null,
    atmoOpacity: null,
    season: null,
    dataQuality: 'unavailable',
    dataNote: 'Live MEDA data not yet in public API. Perseverance sol count is accurate.',
    history: []
  };
}

async function getMarsWeather(rover = 'curiosity', nasaApiKey) {
  const roverKey = rover.toLowerCase();

  if (roverKey === 'perseverance') {
    return getPerseveranceWeather();
  }

  // Curiosity first, InSight fallback
  const curiosity = await getCuriosityWeather();
  if (curiosity) return curiosity;

  // InSight fallback
  if (!nasaApiKey) throw new HttpError(500, 'NASA API key not configured');

  const query = new URLSearchParams({ api_key: nasaApiKey, feedtype: 'json', ver: '1.0' });
  const response = await fetch(`${NASA_INSIGHT_URL}?${query.toString()}`, {
    signal: AbortSignal.timeout(8000)
  });

  if (!response.ok) throw new HttpError(502, 'Mars weather API request failed');

  const payload = await response.json();
  const solKeys = Array.isArray(payload.sol_keys) ? payload.sol_keys : [];
  if (!solKeys.length) throw new HttpError(502, 'No Mars weather readings available');

  const latestSol = solKeys[solKeys.length - 1];
  const d = payload[latestSol] || {};
  const at = d.AT || {};
  const ws = d.HWS || {};

  const history = solKeys.slice(-7).map((s) => {
    const sd = payload[s] || {};
    const sat = sd.AT || {};
    return {
      sol: Number(s),
      date: null,
      minTempC: toNumC(sat.mn),
      maxTempC: toNumC(sat.mx),
      minTempF: cToF(sat.mn),
      maxTempF: cToF(sat.mx),
      pressureHpa: toNum((sd.PRE || {}).av),
      windMps: toNum((sd.HWS || {}).av),
      windDirection: null,
      atmoOpacity: null,
      season: sd.Season || null
    };
  }).reverse();

  return {
    rover: 'InSight (Fallback)',
    instrument: 'APSS',
    location: 'Elysium Planitia',
    coordinates: { lat: 4.5, lon: 135.9 },
    sol: latestSol,
    date: null,
    avgTempC: toNumC(at.av),
    minTempC: toNumC(at.mn),
    maxTempC: toNumC(at.mx),
    avgTempF: cToF(at.av),
    minTempF: cToF(at.mn),
    maxTempF: cToF(at.mx),
    pressureHpa: toNum((d.PRE || {}).av),
    windMps: toNum(ws.av),
    windDirection: null,
    atmoOpacity: null,
    season: d.Season || null,
    dataQuality: 'partial',
    history
  };
}

module.exports = { getMarsWeather };

