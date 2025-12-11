import React from "react";
import {
  WiDaySunny,
  WiNightClear,
  WiCloudy,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog,
} from "react-icons/wi";

const CurrentWeatherCard = ({ weatherData, onAddFavorite }) => {
  if (!weatherData) return null;

  const { name, main, weather, wind } = weatherData;

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain.toLowerCase()) {
      case "clear": {
        const hour = new Date().getHours();
        return hour >= 6 && hour < 18 ? (
          <WiDaySunny size={64} />
        ) : (
          <WiNightClear size={64} />
        );
      }
      case "clouds":
        return <WiCloudy size={64} />;
      case "rain":
      case "drizzle":
        return <WiRain size={64} />;
      case "thunderstorm":
        return <WiThunderstorm size={64} />;
      case "snow":
        return <WiSnow size={64} />;
      case "mist":
      case "fog":
        return <WiFog size={64} />;
      default:
        return <WiDaySunny size={64} />;
    }
  };

  return (
    <div className="weather-card bg-blue-100 rounded-lg shadow-md p-6 text-center max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-2">{name}</h2>
      {getWeatherIcon(weather[0].main)}
      <p className="text-lg capitalize mt-2">{weather[0].description}</p>
      <p className="mt-1 text-xl font-semibold">
        {Math.round(main.temp - 273.15)}°C
      </p>
      <div className="flex justify-around mt-4 text-sm text-gray-700">
        <p>Humidity: {main.humidity}%</p>
        <p>Wind: {wind.speed} m/s</p>
      </div>

      {onAddFavorite && (
        <button
          onClick={() => onAddFavorite(name)}
          className="mt-4 bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
        >
          Add to Favorites
        </button>
      )}
    </div>
  );
};

export default CurrentWeatherCard;

