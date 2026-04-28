// NASA Mars24 algorithm — client-side live clock calculations

const MARS_SOL_MS = 88775244;
const CURIOSITY_LANDING_MS = 1344230277000;
const PERSEVERANCE_LANDING_MS = 1613685300000;

function pad(n) {
  return String(Math.floor(n)).padStart(2, '0');
}

function formatTime(decimalHours) {
  const h = Math.floor(decimalHours);
  const mf = (decimalHours - h) * 60;
  const m = Math.floor(mf);
  const s = Math.floor((mf - m) * 60);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function computeMarsTime(nowMs = Date.now()) {
  const JD_UTC = nowMs / 86400000 + 2440587.5;
  const JD_TT = JD_UTC + 69.184 / 86400;
  const MSD = ((JD_TT - 2451545.0) / 1.0274912517) + 44796.0 - 0.0009626;
  const mtcRaw = (MSD % 1) * 24;
  const mtc = ((mtcRaw % 24) + 24) % 24;

  const curiosityLMST = ((mtc + 137.4 / 15) % 24 + 24) % 24;
  const perseveranceLMST = ((mtc + 77.4 / 15) % 24 + 24) % 24;

  const curiositySol = Math.floor((nowMs - CURIOSITY_LANDING_MS) / MARS_SOL_MS);
  const perseveranceSol = Math.floor((nowMs - PERSEVERANCE_LANDING_MS) / MARS_SOL_MS);

  const now = new Date(nowMs);
  const utcH = now.getUTCHours();
  const utcM = now.getUTCMinutes();
  const utcS = now.getUTCSeconds();
  const earthUtc = `${pad(utcH)}:${pad(utcM)}:${pad(utcS)}`;

  return {
    msd: Math.round(MSD * 100) / 100,
    mtc: formatTime(mtc),
    earthUtc,
    curiosity: { localTime: formatTime(curiosityLMST), sol: curiositySol },
    perseverance: { localTime: formatTime(perseveranceLMST), sol: perseveranceSol }
  };
}
