import { useState, useEffect } from 'react';
import { computeMarsTime } from '../utils/marsTime';

export default function MarsTimeClocks({ activeRover }) {
  const [time, setTime] = useState(() => computeMarsTime());

  useEffect(() => {
    const id = setInterval(() => setTime(computeMarsTime()), 1000);
    return () => clearInterval(id);
  }, []);

  const roverData = activeRover === 'perseverance' ? time.perseverance : time.curiosity;
  const roverLabel = activeRover === 'perseverance' ? 'Perseverance' : 'Curiosity';
  const roverLocation = activeRover === 'perseverance' ? 'Jezero Crater' : 'Gale Crater';

  return (
    <div className="time-clocks">
      <div className="clock-card mtc">
        <span className="clock-label">Coordinated Mars Time</span>
        <span className="clock-face">{time.mtc}</span>
        <span className="clock-sub">MSD {time.msd.toLocaleString()}</span>
      </div>

      <div className={`clock-card rover-clock ${activeRover}`}>
        <span className="clock-label">{roverLabel} — {roverLocation}</span>
        <span className="clock-face">{roverData.localTime}</span>
        <span className="clock-sub">Sol {roverData.sol.toLocaleString()}</span>
      </div>

      <div className="clock-card earth-utc">
        <span className="clock-label">Earth UTC</span>
        <span className="clock-face">{time.earthUtc}</span>
        <span className="clock-sub">Reference</span>
      </div>
    </div>
  );
}
