// Netlify Function: weather.js
// Simple proxy to OpenWeatherMap current weather API.
// Expects REACT_APP_WEATHER_KEY to be set in Netlify environment variables.
// Example: /.netlify/functions/weather?city=London

const fetch = require("node-fetch");

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  const city = event.queryStringParameters && event.queryStringParameters.city;
  const apiKey = process.env.REACT_APP_WEATHER_KEY; // make sure this is set in Netlify env

  if (!city) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "City is required" }),
    };
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to fetch weather data" }),
    };
  }
};
