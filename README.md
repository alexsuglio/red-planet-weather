# red-planet-weather

Local full-stack app that compares Earth weather (by location) against Mars weather from NASA.

## Quick Update (2026-04-28)

- Monorepo is now split into `client/` (React + Vite) and `server/` (Express API).
- Current work has been merged to `origin/main` from deployment branch `deploy/main-release-20260428`.
- Root `npm run dev` is set up to run frontend and backend for local development.
- NASA and Earth weather API keys are handled server-only.

### README TODO Checklist

- [ ] Add production deployment URL(s).
- [ ] Add environment variable reference for all required server config.
- [ ] Add screenshots/GIF of compare flow.
- [ ] Add known limitations (NASA data freshness/fallback behavior).
- [ ] Add testing and lint commands once finalized.

## Stack

- Frontend: React + Vite
- API: Express (Node.js)
- Earth weather source: WeatherAPI.com (API key required)
- Mars weather source: NASA InSight API (API key required)

## Security First

- `NASA_API_KEY` and `WEATHER_API_KEY` are read only on the server from environment variables.
- The frontend never receives or stores either API key.
- `.env` files are ignored by git.

## Quick Start

1. Install root dependencies:

```bash
npm install
```

2. Install backend dependencies:

```bash
npm install --prefix server
```

3. Install frontend dependencies:

```bash
npm install --prefix client
```

4. Configure backend environment:

```bash
cp server/.env.example server/.env
```

Set required keys in `server/.env`:

```bash
NASA_API_KEY=your_key_here
WEATHER_API_KEY=your_key_here
PORT=3001
```

5. Run both frontend and backend:

```bash
npm run dev
```

Then open `http://localhost:5173`.

## Main Endpoints

- `GET /api/health`
- `GET /api/weather/compare?location=YourLocation`

## Project Layout

```
red-planet-weather/
├── client/
│   ├── src/
│   ├── index.html
│   └── vite.config.js
├── server/
│   ├── src/
│   └── .env.example
└── package.json
```