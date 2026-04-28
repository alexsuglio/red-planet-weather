'use strict';

// NASA Mars24 algorithm
// Reference: https://www.giss.nasa.gov/tools/mars24/help/algorithm.html

// Length of a Mars sol in milliseconds
const MARS_SOL_MS = 88775244;

// Rover landing timestamps (Unix ms, UTC)
// Curiosity: 2012-08-06T05:17:57Z
const CURIOSITY_LANDING_MS = 1344230277000;
// Perseverance: 2021-02-18T20:55:00Z
const PERSEVERANCE_LANDING_MS = 1613685300000;

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatTime(decimalHours) {
  const h = Math.floor(decimalHours);
  const mf = (decimalHours - h) * 60;
  const m = Math.floor(mf);
  const s = Math.floor((mf - m) * 60);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function getMarsTimeData(dateMs = Date.now()) {
  const JD_UTC = dateMs / 86400000 + 2440587.5;

  // TT - UTC offset: ~69.184 seconds (2024+)
  const JD_TT = JD_UTC + 69.184 / 86400;

  // Mars Sol Date
  const MSD = ((JD_TT - 2451545.0) / 1.0274912517) + 44796.0 - 0.0009626;

  // Coordinated Mars Time (decimal hours, 0–24)
  const mtcRaw = (MSD % 1) * 24;
  const mtc = ((mtcRaw % 24) + 24) % 24;

  // Curiosity: Gale Crater, 137.4°E
  const curiosityLMST = ((mtc + 137.4 / 15) % 24 + 24) % 24;

  // Perseverance: Jezero Crater, 77.4°E
  const perseveranceLMST = ((mtc + 77.4 / 15) % 24 + 24) % 24;

  // Sol counts from each rover's landing
  const curiositySol = Math.floor((dateMs - CURIOSITY_LANDING_MS) / MARS_SOL_MS);
  const perseveranceSol = Math.floor((dateMs - PERSEVERANCE_LANDING_MS) / MARS_SOL_MS);

  return {
    marsDate: Math.round(MSD * 100) / 100,
    mtc: formatTime(mtc),
    earthUtc: new Date(dateMs).toISOString(),
    curiosity: {
      localTime: formatTime(curiosityLMST),
      sol: curiositySol,
      location: 'Gale Crater',
      longitude: 137.4
    },
    perseverance: {
      localTime: formatTime(perseveranceLMST),
      sol: perseveranceSol,
      location: 'Jezero Crater',
      longitude: 77.4
    }
  };
}

module.exports = { getMarsTimeData };
