'use strict';

const express = require('express');
const { getEarthWeather } = require('../services/earthWeatherService');
const { getMarsWeather } = require('../services/marsWeatherService');
const { getMarsTimeData } = require('../services/marsTimeService');
const { getEarthVsMarsComparison } = require('../services/comparisonService');

const router = express.Router();

// Mars time (no API key needed — pure calculation)
router.get('/mars/time', (req, res) => {
  res.json(getMarsTimeData());
});

// Mars weather — ?rover=curiosity|perseverance
router.get('/mars', async (req, res, next) => {
  try {
    const rover = req.query.rover || 'curiosity';
    const nasaApiKey = process.env.NASA_API_KEY;
    const payload = await getMarsWeather(rover, nasaApiKey);
    res.json(payload);
  } catch (error) {
    next(error);
  }
});

// Earth weather
router.get('/earth', async (req, res, next) => {
  try {
    const location = req.query.location;
    const weatherApiKey = process.env.WEATHER_API_KEY;
    const payload = await getEarthWeather(location, weatherApiKey);
    res.json(payload);
  } catch (error) {
    next(error);
  }
});

// Comparison (kept for reference)
router.get('/compare', async (req, res, next) => {
  try {
    const location = req.query.location;
    const nasaApiKey = process.env.NASA_API_KEY;
    const weatherApiKey = process.env.WEATHER_API_KEY;
    const payload = await getEarthVsMarsComparison(location, nasaApiKey, weatherApiKey);
    res.json(payload);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
