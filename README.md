# Weather App (Frontend Only)

This React app now talks directly to the OpenWeather API so it can be deployed on Netlify without the Express backend.

## Setup

1) Install dependencies  
`npm install`

2) Add an API key  
Create a `.env` file (or add a Netlify environment variable) with:
```
REACT_APP_OPENWEATHER_KEY=your_key_here
```
Optional: override the API base URL:
```
REACT_APP_OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
```

3) Run locally  
`npm start`

4) Build for deploy  
`npm run build`

## Notes
- The API key is required at build time; in Netlify set it in **Site settings → Environment variables**.
- The app fetches current weather and forecast directly from OpenWeather. No backend is needed.
