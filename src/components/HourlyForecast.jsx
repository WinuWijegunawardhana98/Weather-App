import React from "react";

const HourlyForecast = ({ hourlyData }) => {
  if (!hourlyData || hourlyData.length === 0) return null;

  return (
    <div className="hourly-forecast mt-6 overflow-x-auto flex space-x-4 px-4">
      {hourlyData.map((hour, index) => {
        const time = new Date(hour.dt * 1000).getHours();
        const tempC = Math.round(hour.temp - 273.15);
        const iconUrl = `http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`;

        return (
          <div
            key={index}
            className="flex flex-col items-center bg-white p-3 rounded-lg shadow-md min-w-[80px]"
          >
            <p className="font-semibold">{time}:00</p>
            <img
              src={iconUrl}
              alt={hour.weather[0].description}
              className="w-12 h-12"
            />
            <p className="text-sm">{tempC}°C</p>
            <p className="text-xs capitalize">{hour.weather[0].description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default HourlyForecast;

