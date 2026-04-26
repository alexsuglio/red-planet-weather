# red-planet-weather

A stock Node.js + Express application template, ready to clone and build locally.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/alexsuglio/red-planet-weather.git
cd red-planet-weather
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` to set your values (port, database URL, API keys, etc.).

### 4. Start the development server

```bash
npm run dev
```

The server will start with **nodemon** (auto-reloads on file changes) at `http://localhost:3000`.

### 5. Start the production server

```bash
npm start
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the server (production) |
| `npm run dev` | Start the server with auto-reload (nodemon) |
| `npm test` | Run tests with Jest and generate a coverage report |
| `npm run lint` | Lint source and test files with ESLint |
| `npm run lint:fix` | Auto-fix lint issues |

---

## Project Structure

```
red-planet-weather/
├── src/
│   ├── index.js              # App entry point
│   ├── routes/
│   │   └── index.js          # Route definitions
│   └── middleware/
│       └── errorHandler.js   # Global error handler
├── tests/
│   └── index.test.js         # API tests (Jest + Supertest)
├── .env.example              # Example environment variables
├── .eslintrc.js              # ESLint configuration
├── .gitignore
└── package.json
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Welcome message |
| GET | `/health` | Health check |

---

## Running Tests

```bash
npm test
```

Test coverage reports are written to the `coverage/` directory (excluded from git).