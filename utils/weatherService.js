import axios from 'axios';

// Free weather API options:
// 1. WeatherAPI.com (1M calls/month free)
// 2. OpenWeatherMap (1000 calls/day free)
// We'll use WeatherAPI.com for more generous limits

const WEATHER_API_KEY = 'YOUR_API_KEY_HERE'; // User needs to get their own key
const WEATHER_API_BASE = 'https://api.weatherapi.com/v1';

/**
 * Validates US zip code format
 * @param {string} zipCode - The zip code to validate
 * @returns {boolean} - True if valid US zip code
 */
export const isValidUSZipCode = (zipCode) => {
  // US zip code: 5 digits or 5 digits + 4 digits (xxxxx or xxxxx-xxxx)
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
};

/**
 * Fetches current weather data for a given zip code
 * @param {string} zipCode - US zip code
 * @returns {Promise<Object>} - Weather data including sky conditions
 */
export const getCurrentWeather = async (zipCode) => {
  try {
    const response = await axios.get(`${WEATHER_API_BASE}/current.json`, {
      params: {
        key: WEATHER_API_KEY,
        q: zipCode,
        aqi: 'no'
      }
    });

    return {
      location: response.data.location,
      current: response.data.current,
      condition: response.data.current.condition,
      isDay: response.data.current.is_day === 1,
      cloudCoverage: response.data.current.cloud,
      temperature: response.data.current.temp_f,
      humidity: response.data.current.humidity
    };
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error('Invalid zip code. Please enter a valid US zip code.');
    } else if (error.response?.status === 401) {
      throw new Error('API key not configured. Please add your WeatherAPI.com key.');
    } else {
      throw new Error('Failed to fetch weather data. Please try again.');
    }
  }
};

/**
 * Fetches astronomy data (sunrise/sunset times) for a given location
 * @param {string} zipCode - US zip code
 * @returns {Promise<Object>} - Astronomy data
 */
export const getAstronomyData = async (zipCode) => {
  try {
    const response = await axios.get(`${WEATHER_API_BASE}/astronomy.json`, {
      params: {
        key: WEATHER_API_KEY,
        q: zipCode,
        dt: new Date().toISOString().split('T')[0]
      }
    });

    return {
      sunrise: response.data.astronomy.astro.sunrise,
      sunset: response.data.astronomy.astro.sunset,
      moonPhase: response.data.astronomy.astro.moon_phase,
      moonIllumination: response.data.astronomy.astro.moon_illumination
    };
  } catch (error) {
    console.error('Failed to fetch astronomy data:', error);
    return null;
  }
};

/**
 * Alternative: Use OpenWeatherMap API (requires different API key)
 */
export const getCurrentWeatherOpenWeather = async (zipCode) => {
  const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY';
  const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${OPENWEATHER_API_KEY}&units=imperial`;

  try {
    const response = await axios.get(url);

    return {
      location: {
        name: response.data.name,
        region: response.data.sys.country,
        lat: response.data.coord.lat,
        lon: response.data.coord.lon
      },
      current: {
        temp_f: response.data.main.temp,
        condition: {
          text: response.data.weather[0].description,
          code: response.data.weather[0].id
        },
        cloud: response.data.clouds.all,
        humidity: response.data.main.humidity
      },
      isDay: response.data.weather[0].icon.includes('d'),
      cloudCoverage: response.data.clouds.all
    };
  } catch (error) {
    throw new Error('Failed to fetch weather data from OpenWeatherMap.');
  }
};
