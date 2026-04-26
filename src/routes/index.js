'use strict';

const express = require('express');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Root route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to red-planet-weather!' });
});

module.exports = router;
