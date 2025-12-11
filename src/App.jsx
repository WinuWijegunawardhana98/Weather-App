import React, { useState } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import CurrentWeatherCard from "./components/CurrentWeatherCard";
import HourlyForecast from "./components/HourlyForecast";
import WeeklyForecast from "./components/WeeklyForecast";
import TemperatureCharts from "./components/TemperatureCharts";
import WeatherLanding from "./components/WeatherLanding";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [viewMode, setViewMode] = useState("landing"); // "landing" or "detailed"
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("favorites");
      return saved ? JSON.parse(saved) : [];
    } catch (_e) {
      return [];
    }
  });
  const [theme, setTheme] = useState("light");

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const ensureNotificationPermission = async () => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission !== "denied") {
      const perm = await Notification.requestPermission();
      return perm === "granted";
    }
    return false;
  };

  const notifyExtremeWeather = async (data) => {
    const permission = await ensureNotificationPermission();
    if (!permission || !data) return;

    const main = data?.weather?.[0]?.main?.toLowerCase() || "";
    const tempK = data?.main?.temp;
    const wind = data?.wind?.speed;

    const isHot = typeof tempK === "number" && tempK - 273.15 >= 35;
    const isWindy = typeof wind === "number" && wind >= 15;
    const isStorm = ["thunderstorm", "tornado"].some((w) => main.includes(w));
    const isHeavyRainOrSnow = ["rain", "snow"].some((w) => main.includes(w));

    if (isHot || isWindy || isStorm || isHeavyRainOrSnow) {
      const title = "Weather Alert";
      const bodyParts = [];
      if (isHot) bodyParts.push("High heat");
      if (isWindy) bodyParts.push("Strong winds");
      if (isStorm) bodyParts.push("Storm conditions");
      if (isHeavyRainOrSnow) bodyParts.push("Rain/Snow");
      const body = bodyParts.join(" • ");
      new Notification(title, { body });
    }
  };

  const fetchWeather = async (city) => {
    try {
      const trimmed = city.trim();
      if (!trimmed) {
        alert("Please enter a city name");
        return;
      }

      console.log("🔍 Searching for city:", trimmed);
      
      // Let backend handle encoding
      const res = await axios.get(
        `http://localhost:5000/weather/${encodeURIComponent(trimmed)}`,
        {
          timeout: 10000 // 10 second timeout
        }
      );

      console.log("✅ Weather data received:", res.data);
      
      setWeatherData(res.data.current);
      setHourlyData(res.data.hourly);
      setDailyData(res.data.daily);
      notifyExtremeWeather(res.data.current);
    } catch (error) {
      console.error("❌ Fetch weather error:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
        alert("Cannot connect to backend server. Please make sure the backend is running on port 5000.\n\nRun: cd weather-backend && npm start");
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        alert("Request timed out. Please check your internet connection.");
      } else if (error.response) {
        const message = error.response.data?.message || "City not found!";
        const status = error.response.status;
        alert(`Error (${status}): ${message}\n\nPlease check:\n- City name is spelled correctly\n- Backend server is running\n- Check browser console for details`);
      } else {
        alert(`Error: ${error.message || "City not found!"}\n\nPlease check your internet connection and try again.`);
      }
    }
  };

  const persistFavorites = (list) => {
    setFavorites(list);
    try {
      localStorage.setItem("favorites", JSON.stringify(list));
    } catch (_e) {
      // ignore storage errors
    }
  };

  const addFavorite = (city) => {
    const normalized = city?.trim();
    if (!normalized) return;
    const exists = favorites.some(
      (c) => c.trim().toLowerCase() === normalized.toLowerCase()
    );
    if (exists) return;
    persistFavorites([...favorites, normalized]);
  };

  const removeFavorite = (city) => {
    const normalized = city?.trim();
    if (!normalized) return;
    const updated = favorites.filter(
      (c) => c.trim().toLowerCase() !== normalized.toLowerCase()
    );
    persistFavorites(updated);
  };

  const getBackgroundClass = () => {
    // Prefer current weather, then first hourly entry, then first daily entry
    const mainWeather =
      weatherData?.weather?.[0]?.main ||
      hourlyData?.[0]?.weather?.[0]?.main ||
      dailyData?.[0]?.weather?.[0]?.main;

    if (!mainWeather) return "bg-default";

    const normalized = mainWeather.toLowerCase();

    if (normalized.includes("cloud")) return "bg-cloudy";
    if (normalized.includes("rain")) return "bg-rainy";
    if (normalized.includes("sun") || normalized.includes("clear")) return "bg-sunny";
    return "bg-default";
  };

  // Use landing page as default view
  if (viewMode === "landing") {
    return (
      <WeatherLanding
        weatherData={weatherData}
        dailyData={dailyData}
        onSearch={fetchWeather}
        searchCity={searchCity}
        setSearchCity={setSearchCity}
      />
    );
  }

  // Detailed view (original layout)
  return (
    <div className={`App ${getBackgroundClass()} theme-${theme}`}>
      <div className="top-bar">
        <h1 className="text-3xl font-bold mb-4">Weather Forecast App</h1>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button className="toggle-btn" onClick={() => setViewMode("landing")}>
            Landing View
          </button>
          <button className="toggle-btn" onClick={toggleTheme}>
            {theme === "light" ? "Dark mode" : "Light mode"}
          </button>
        </div>
      </div>
      <SearchBar onSearch={fetchWeather} />
      <CurrentWeatherCard weatherData={weatherData} onAddFavorite={addFavorite} />
      <HourlyForecast hourlyData={hourlyData} />
      <WeeklyForecast dailyData={dailyData} />
      <TemperatureCharts hourlyData={hourlyData} dailyData={dailyData} />
      {favorites.length > 0 && (
        <div className="favorites-section mt-8">
          <h2 className="text-2xl font-semibold mb-4">Favorite Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {favorites.map((city) => (
              <div
                key={city}
                className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
              >
                <p className="font-bold">{city}</p>
                <button
                  onClick={() => fetchWeather(city)}
                  className="mt-2 bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-500"
                >
                  View
                </button>
                <button
                  onClick={() => removeFavorite(city)}
                  className="mt-2 bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

