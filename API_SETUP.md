# Skyglow - API Setup

Skyglow uses **real-time weather data** to show the actual current sky color based on weather conditions, cloud coverage, and time of day.

## Quick Start (Free API)

### Option 1: WeatherAPI.com (Recommended - 1 Million calls/month free)

1. **Sign up for a free API key:**
   - Go to [https://www.weatherapi.com/signup.aspx](https://www.weatherapi.com/signup.aspx)
   - Create a free account
   - Copy your API key from the dashboard

2. **Add your API key to the app:**
   - Open `utils/weatherService.js`
   - Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```javascript
   const WEATHER_API_KEY = 'your_actual_api_key_here';
   ```

3. **That's it!** The app will now fetch real-time weather data.

### Option 2: OpenWeatherMap (1000 calls/day free)

1. **Sign up:**
   - Go to [https://home.openweathermap.org/users/sign_up](https://home.openweathermap.org/users/sign_up)
   - Create a free account
   - Generate an API key

2. **Update the code:**
   - Open `App.js`
   - In the `getSkyColor` function, change the API call to use `getCurrentWeatherOpenWeather` instead of `getCurrentWeather`

## How It Works

The app now:

1. **Validates US Zip Codes** - Only accepts valid 5-digit US zip codes
2. **Fetches Real Weather Data** - Gets current conditions including:
   - Cloud coverage percentage
   - Weather conditions (clear, rainy, cloudy, snowy, etc.)
   - Time of day (day/night)
   - Sunrise/sunset times
3. **Calculates Accurate Sky Color** - Uses algorithm that considers:
   - Current time relative to sunrise/sunset
   - Cloud coverage (0-100%)
   - Weather conditions (rain, snow, fog, etc.)
   - Time of day (dawn, morning, midday, dusk, evening, night)

## Features

### Sky Color Algorithm

The color algorithm adjusts based on:

- **Time of Day:**
  - Dawn: Warm orange/pink tones
  - Morning: Bright blue sky
  - Midday: Deep blue
  - Afternoon: Slightly darker blue
  - Dusk: Orange/pink sunset colors
  - Evening: Purple/indigo tones
  - Night: Dark blue/black

- **Cloud Coverage:**
  - 0-20%: Clear sky (original colors)
  - 20-50%: Partly cloudy (slight grey tint)
  - 50-80%: Mostly cloudy (noticeable grey)
  - 80-100%: Overcast (very grey)

- **Weather Conditions:**
  - Rain: Grey-blue tones
  - Thunderstorm: Dark grey/charcoal
  - Snow: Light grey/white
  - Fog/Mist: Misty grey
  - Clear/Sunny: Enhanced brightness

## Testing Without API Key

If you want to test without setting up an API key:

1. Open `App.js`
2. Find the line: `const [useRealTimeData, setUseRealTimeData] = useState(true);`
3. Change it to: `const [useRealTimeData, setUseRealTimeData] = useState(false);`

This will use the simulated color generator instead of real-time data.

## Example Zip Codes to Try

- `10001` - New York City, NY
- `90210` - Beverly Hills, CA
- `60601` - Chicago, IL
- `33101` - Miami, FL
- `98101` - Seattle, WA
- `02101` - Boston, MA
- `78701` - Austin, TX

## API Rate Limits

- **WeatherAPI.com Free Tier:** 1,000,000 calls/month
- **OpenWeatherMap Free Tier:** 1,000 calls/day (60 calls/minute)

Both are more than enough for personal use!

## Troubleshooting

**Error: "API key not configured"**
- Make sure you've added your API key to `utils/weatherService.js`

**Error: "Invalid zip code"**
- The app only accepts valid 5-digit US zip codes
- Make sure you're entering numbers only (no dashes)

**Error: "Failed to fetch weather data"**
- Check your internet connection
- Verify your API key is correct
- Check if you've exceeded your API rate limit

## Building for iOS

To run on iOS:

```bash
npm install
npx expo start --ios
```

Or use the Expo Go app on your iPhone:
```bash
npx expo start
```
Then scan the QR code with your iPhone camera.
