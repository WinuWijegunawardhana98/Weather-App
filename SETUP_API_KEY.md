# Setting Up OpenWeatherMap API Key

## Quick Setup

1. **Create a `.env` file** in the root directory of this project (same level as `package.json`)

2. **Add the following line to your `.env` file:**
   ```
   REACT_APP_OPENWEATHER_KEY=your_api_key_here
   ```

3. **Get your free API key:**
   - Visit: https://openweathermap.org/api
   - Sign up for a free account at: https://home.openweathermap.org/users/sign_up
   - After signing up, go to your API keys section
   - Copy your API key and replace `your_api_key_here` in the `.env` file

4. **Restart your development server** after creating/updating the `.env` file:
   ```bash
   npm start
   ```

## Example `.env` file:

```
REACT_APP_OPENWEATHER_KEY=97df52928dab6f2a4ae9112dec134264
```

## Important Notes:

- The `.env` file should be in the **root directory** (not in `src/` or `weather-backend/`)
- Variable names must start with `REACT_APP_` to be accessible in React
- Never commit your `.env` file to version control (it should be in `.gitignore`)
- The free tier allows 60 calls per minute and 1,000,000 calls per month

## Troubleshooting:

- If you still see the error after adding the key, make sure you've restarted the dev server
- Check that the variable name is exactly `REACT_APP_OPENWEATHER_KEY` (case-sensitive)
- Make sure there are no spaces around the `=` sign
- Verify your API key is active in your OpenWeatherMap account

