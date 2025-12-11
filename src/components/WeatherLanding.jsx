import React, { useState } from "react";
import {
  WiDaySunny,
  WiNightClear,
  WiCloudy,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog,
  WiStrongWind,
  WiHumidity,
  WiCloud,
  WiBarometer,
} from "react-icons/wi";
import { FiSearch } from "react-icons/fi";

const WeatherLanding = ({ weatherData, dailyData, onSearch, searchCity, setSearchCity }) => {
  const [unit, setUnit] = useState("°C");

  const getWeatherIcon = (weatherMain, size = 150) => {
    switch (weatherMain?.toLowerCase()) {
      case "clear": {
        const hour = new Date().getHours();
        return hour >= 6 && hour < 18 ? (
          <WiDaySunny size={size} />
        ) : (
          <WiNightClear size={size} />
        );
      }
      case "clouds":
        return <WiCloudy size={size} />;
      case "rain":
      case "drizzle":
        return <WiRain size={size} />;
      case "thunderstorm":
        return <WiThunderstorm size={size} />;
      case "snow":
        return <WiSnow size={size} />;
      case "mist":
      case "fog":
        return <WiFog size={size} />;
      default:
        return <WiDaySunny size={size} />;
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()} at ${displayHours}:${displayMinutes} ${ampm}`;
  };

  const formatWeekDate = (timestamp) => {
    const d = new Date(timestamp * 1000);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  };

  const getWeatherIconForForecast = (weatherMain, size = 50) => {
    switch (weatherMain?.toLowerCase()) {
      case "clear":
        return <WiDaySunny size={size} />;
      case "clouds":
        return <WiCloudy size={size} />;
      case "rain":
      case "drizzle":
        return <WiRain size={size} />;
      case "thunderstorm":
        return <WiThunderstorm size={size} />;
      case "snow":
        return <WiSnow size={size} />;
      default:
        return <WiDaySunny size={size} />;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      onSearch(searchCity.trim());
    }
  };

  const getSunriseSunset = (weatherData) => {
    if (!weatherData?.sys) return { sunrise: "N/A", sunset: "N/A" };
    
    const sunrise = new Date(weatherData.sys.sunrise * 1000);
    const sunset = new Date(weatherData.sys.sunset * 1000);
    
    const formatTime = (date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, "0");
      return `${displayHours}:${displayMinutes} ${ampm}`;
    };
    
    return {
      sunrise: formatTime(sunrise),
      sunset: formatTime(sunset),
    };
  };

  if (!weatherData) {
    return (
      <div className="weather-landing-modern">
        <div className="modern-search-container">
          <form onSubmit={handleSearch} className="modern-search-bar">
            <input
              type="text"
              placeholder="Search City"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="modern-search-input"
            />
            <button type="button" className="modern-unit-toggle" onClick={() => setUnit(unit === "°C" ? "°F" : "°C")}>
              {unit}
            </button>
            <button type="submit" className="modern-search-btn">
              <FiSearch size={20} />
            </button>
          </form>
        </div>
        <div className="modern-welcome">
          <h2>Welcome to Weather Forecast</h2>
          <p>Search for a city to see the weather</p>
        </div>
      </div>
    );
  }

  const { name, main, weather, wind, sys, clouds } = weatherData;
  const currentDate = formatDate(new Date());
  const forecastDays = dailyData?.slice(0, 7) || [];
  const { sunrise, sunset } = getSunriseSunset(weatherData);
  const feelsLike = Math.round(main.feels_like - 273.15);
  const currentTemp = Math.round(main.temp - 273.15);

  return (
    <div className="weather-landing-modern">
      {/* Top Search Bar */}
      <form onSubmit={handleSearch} className="modern-search-bar">
        <input
          type="text"
          placeholder="Search City"
          value={searchCity || name}
          onChange={(e) => setSearchCity(e.target.value)}
          className="modern-search-input"
        />
        <button type="button" className="modern-unit-toggle" onClick={() => setUnit(unit === "°C" ? "°F" : "°C")}>
          {unit}
        </button>
        <button type="submit" className="modern-search-btn">
          <FiSearch size={20} />
        </button>
      </form>

      <div className="modern-layout">
        {/* Left Panel - Current Weather */}
        <div className="modern-left-panel">
          <div className="modern-weather-icon">
            {getWeatherIcon(weather[0]?.main)}
          </div>
          <div className="modern-temp-display">
            <div className="modern-temp-large">{currentTemp}{unit}</div>
            <div className="modern-feels-like">Feels like {feelsLike} {unit}</div>
          </div>
          <div className="modern-condition">
            {getWeatherIconForForecast(weather[0]?.main, 30)}
            <span>{weather[0]?.description || "N/A"}</span>
          </div>
          <div className="modern-date-time">{currentDate}</div>
          <div className="modern-location">{name}{sys?.country ? `, ${sys.country}` : ""}</div>
        </div>

        {/* Right Panel - Highlights and Forecast */}
        <div className="modern-right-panel">
          {/* Today's Highlights */}
          <div className="modern-section">
            <h3 className="modern-section-title">Today's Highlights</h3>
            <div className="modern-highlights-grid">
              <div className="modern-highlight-card">
                <WiHumidity size={32} />
                <div className="modern-highlight-content">
                  <span className="modern-highlight-label">Humidity</span>
                  <span className="modern-highlight-value">{main.humidity}%</span>
                </div>
              </div>
              <div className="modern-highlight-card">
                <WiStrongWind size={32} />
                <div className="modern-highlight-content">
                  <span className="modern-highlight-label">Wind Speed</span>
                  <span className="modern-highlight-value">{wind.speed}m/s</span>
                </div>
              </div>
              <div className="modern-highlight-card">
                <div className="modern-sun-icon">
                  <WiDaySunny size={32} />
                </div>
                <div className="modern-highlight-content">
                  <span className="modern-highlight-label">Sunrise/Sunset</span>
                  <div className="modern-sun-times">
                    <span>{sunrise} Sunrise</span>
                    <span>{sunset} Sunset</span>
                  </div>
                </div>
              </div>
              <div className="modern-highlight-card">
                <WiCloud size={32} />
                <div className="modern-highlight-content">
                  <span className="modern-highlight-label">Clouds</span>
                  <span className="modern-highlight-value">{clouds?.all || 0}%</span>
                </div>
              </div>
              <div className="modern-highlight-card">
                <WiDaySunny size={32} />
                <div className="modern-highlight-content">
                  <span className="modern-highlight-label">UV Index</span>
                  <span className="modern-highlight-value">0</span>
                </div>
              </div>
              <div className="modern-highlight-card">
                <WiBarometer size={32} />
                <div className="modern-highlight-content">
                  <span className="modern-highlight-label">Pressure</span>
                  <span className="modern-highlight-value">{main.pressure} hPa</span>
                </div>
              </div>
            </div>
          </div>

          {/* This Week Forecast */}
          <div className="modern-section">
            <h3 className="modern-section-title">This Week</h3>
            <div className="modern-week-forecast">
              {forecastDays.map((day, index) => {
                const date = formatWeekDate(day.dt);
                const tempMin = Math.round((day.main?.temp_min || day.temp?.min || 0) - 273.15);
                const tempMax = Math.round((day.main?.temp_max || day.temp?.max || 0) - 273.15);
                const weatherMain = day.weather?.[0]?.main;
                const description = day.weather?.[0]?.description || "";

                return (
                  <div key={index} className="modern-week-card">
                    <div className="modern-week-date">{date}</div>
                    <div className="modern-week-icon">
                      {getWeatherIconForForecast(weatherMain)}
                    </div>
                    <div className="modern-week-condition">{description}</div>
                    <div className="modern-week-temps">
                      {tempMax}{unit} {tempMin}{unit}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherLanding;
