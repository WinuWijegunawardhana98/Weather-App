// Netlify serverless function for weather API
// This function can be used as a proxy to hide the API key from the frontend
// However, since the app now calls OpenWeather directly, this function may not be needed

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  const { city } = event.queryStringParameters || {};
  
  if (!city) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'City parameter is required' })
    };
  }

  const API_KEY = process.env.REACT_APP_OPENWEATHER_KEY || process.env.API_KEY;
  
  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'API key not configured' })
    };
  }

  try {
    const encodedCity = encodeURIComponent(city);
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&appid=${API_KEY}`;

    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl)
    ]);

    if (!weatherRes.ok || !forecastRes.ok) {
      throw new Error('Weather API request failed');
    }

    const currentWeather = await weatherRes.json();
    const forecastData = await forecastRes.json();

    const hourly = forecastData.list.slice(0, 8);
    const daily = [];
    for (let i = 0; i < forecastData.list.length; i += 8) {
      daily.push(forecastData.list[i]);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        current: currentWeather,
        hourly,
        daily
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error fetching weather data',
        error: error.message 
      })
    };
  }
};

