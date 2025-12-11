import React from "react";

const WeeklyForecast = ({ dailyData }) => {
  if (!dailyData || dailyData.length === 0) return null;

  return (
    <div className="weekly-forecast mt-6 grid grid-cols-2 md:grid-cols-7 gap-3 px-4">
      {dailyData.map((day, index) => {
        // Handle the 3-hour list shape from /forecast
        const date = new Date((day?.dt || 0) * 1000);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

        const tempMinK = day?.main?.temp_min;
        const tempMaxK = day?.main?.temp_max;
        const tempMin =
          typeof tempMinK === "number" ? Math.round(tempMinK - 273.15) : "-";
        const tempMax =
          typeof tempMaxK === "number" ? Math.round(tempMaxK - 273.15) : "-";

        const icon = day?.weather?.[0]?.icon;
        const description = day?.weather?.[0]?.description || "forecast";
        const iconUrl = icon
          ? `http://openweathermap.org/img/wn/${icon}@2x.png`
          : null;

        return (
          <div
            key={index}
            className="flex flex-col items-center bg-white p-3 rounded-lg shadow-md"
          >
            <p className="font-semibold">{dayName}</p>
            {iconUrl && (
              <img src={iconUrl} alt={description} className="w-12 h-12" />
            )}
            <p className="text-sm capitalize">{description}</p>
            <p className="mt-1 text-sm">
              {tempMax}°C / {tempMin}°C
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyForecast;

