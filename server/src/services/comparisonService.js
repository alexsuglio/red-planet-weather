'use strict';

const { getEarthWeather } = require('./earthWeatherService');
const { getMarsWeather } = require('./marsWeatherService');

async function getEarthVsMarsComparison(location, nasaApiKey, weatherApiKey) {
  const [earth, mars] = await Promise.all([
    getEarthWeather(location, weatherApiKey),
    getMarsWeather(nasaApiKey)
  ]);

  const earthTempF = earth.weather.temperatureF;
  const marsTempF = mars.weather.averageTempF;
  const tempDifferenceF =
    typeof marsTempF === 'number' ? Math.round((earthTempF - marsTempF) * 100) / 100 : null;

  return {
    earth,
    mars,
    comparison: {
      earthTempF,
      marsTempF,
      tempDifferenceF,
      summary:
        typeof marsTempF === 'number'
          ? `${earth.location.name} is currently ${tempDifferenceF} F warmer than Mars (sol ${mars.sol}).`
          : `Mars temperature data is unavailable for sol ${mars.sol}.`
    }
  };
}

module.exports = {
  getEarthVsMarsComparison
};
