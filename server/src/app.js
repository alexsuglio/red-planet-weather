'use strict';

const express = require('express');
const weatherRoutes = require('./routes/weatherRoutes');

const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/weather', weatherRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ error: message });
});

module.exports = app;
