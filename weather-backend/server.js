const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/weather-app";

// MongoDB connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({ 
    message: "Weather API is running", 
    port: PORT,
    mongodb: dbStatus
  });
});

// MongoDB connection test endpoint
app.get("/db/status", (req, res) => {
  const state = mongoose.connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };
  
  res.json({
    status: states[state] || "unknown",
    readyState: state,
    connected: state === 1,
    host: mongoose.connection.host,
    name: mongoose.connection.name
  });
});

// Test API key endpoint
app.get("/test-api", async (req, res) => {
  const API_KEY = process.env.API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: "API key not found in .env" });
  }
  
  try {
    const testRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${API_KEY}`
    );
    res.json({ 
      success: true, 
      message: "API key is valid!",
      city: testRes.data.name,
      apiKeyPreview: API_KEY.substring(0, 8) + "..."
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.response?.data?.message || error.message,
      details: error.response?.data
    });
  }
});

// Route to get weather data
app.get("/weather/:city", async (req, res) => {
  let rawCity = req.params.city || "";
  
  // Handle double encoding - decode multiple times if needed
  let city = rawCity;
  try {
    while (city !== decodeURIComponent(city)) {
      city = decodeURIComponent(city);
    }
  } catch (e) {
    // If decoding fails, use the original
    city = rawCity;
  }
  
  const API_KEY = process.env.API_KEY;

  console.log(`\n📍 Weather request received`);
  console.log(`   Raw param: "${rawCity}"`);
  console.log(`   Decoded city: "${city}"`);

  if (!API_KEY) {
    console.error("❌ API key missing!");
    return res.status(500).json({ message: "API key missing on server" });
  }

  if (!city || city.trim() === "") {
    console.error("❌ Empty city name!");
    return res.status(400).json({ message: "City name cannot be empty" });
  }

  console.log(`🔑 API Key present: ${API_KEY.substring(0, 8)}...`);

  try {
    // Step 1: Get current weather
    const encodedCity = encodeURIComponent(city.trim());
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${API_KEY}`;
    
    console.log("🌤️  Fetching current weather...");
    console.log(`   URL: https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${API_KEY.substring(0, 8)}...`);
    
    const cityRes = await axios.get(weatherUrl);

    const currentWeather = cityRes.data;
    console.log(`✅ Current weather received for: ${currentWeather.name}`);

    // Step 2: Get 5-day forecast
    console.log("📅 Fetching 5-day forecast...");
    const forecastRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
        city
      )}&appid=${API_KEY}`
    );

    const hourlyData = forecastRes.data.list.slice(0, 8); // next 24 hours
    const dailyData = [];
    for (let i = 0; i < forecastRes.data.list.length; i += 8) {
      dailyData.push(forecastRes.data.list[i]);
    }

    console.log(`✅ Forecast received: ${hourlyData.length} hourly, ${dailyData.length} daily entries`);
    console.log("✅ Sending response to client\n");

    res.json({
      current: currentWeather,
      hourly: hourlyData,
      daily: dailyData,
    });
  } catch (error) {
    console.error("\n❌ Weather API Error Details:");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", JSON.stringify(error.response.data, null, 2));
      
      // Check if it's an API key issue
      if (error.response.status === 401) {
        console.error("⚠️  API Key authentication failed! Check if API key is valid.");
      }
    }
    
    const status = error.response?.status || 500;
    let message = error.response?.data?.message || error.message || "City not found!";
    
    // Provide more helpful error messages
    if (status === 404) {
      message = `City "${city}" not found. Please check the spelling or try a different city name.`;
    } else if (status === 401) {
      message = "Invalid API key. Please check your OpenWeatherMap API key.";
    } else if (status === 429) {
      message = "API rate limit exceeded. Please try again later.";
    }
    
    console.error(`❌ Sending error response: ${message} (Status: ${status})\n`);
    res.status(status === 404 ? 404 : 500).json({ message, status, city: city });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

