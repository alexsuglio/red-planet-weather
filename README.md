# red-planet-weather

Local full-stack app that compares Earth weather (by location) against Mars weather from NASA.

## Stack

- Frontend: React + Vite
- API: Express (Node.js)
- Earth weather source: Open-Meteo (free)
- Mars weather source: NASA InSight API (API key required)

## Security First

- The NASA API key is read only on the server from environment variables.
- The frontend never receives or stores the NASA key.
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

Set your NASA key in `server/.env`:

```bash
NASA_API_KEY=your_key_here
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