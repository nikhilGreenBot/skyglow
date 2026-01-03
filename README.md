# Skyglow

A beautiful React Native iOS app that shows the **real-time current sky color** based on a US zip code. The app fetches live weather data and accurately depicts the sky's color considering time of day, cloud coverage, and current weather conditions.

![React Native](https://img.shields.io/badge/React_Native-0.79-blue)
![Expo](https://img.shields.io/badge/Expo-53.0-black)
![iOS](https://img.shields.io/badge/iOS-Compatible-green)

## Features

- **Real-Time Weather Integration** - Fetches live weather data from WeatherAPI.com or OpenWeatherMap
- **Accurate Sky Colors** - Sophisticated algorithm that considers:
  - Current time of day (dawn, morning, midday, afternoon, dusk, evening, night)
  - Cloud coverage percentage (0-100%)
  - Weather conditions (clear, rain, snow, thunderstorm, fog, etc.)
  - Sunrise and sunset times for the location
- **US Zip Code Validation** - Only accepts valid 5-digit US zip codes
- **Beautiful Gradient Display** - Full-screen gradient that mimics the actual sky
- **Wallpaper Export** - Save the sky color as a wallpaper to your photos
- **iOS Optimized** - Built specifically for iOS devices

## How It Works

1. **Enter a valid US zip code** (e.g., 10001 for New York City)
2. **App fetches real-time data:**
   - Current weather conditions
   - Cloud coverage
   - Time of day
   - Sunrise/sunset times
3. **Algorithm calculates the actual sky color:**
   - Maps time to color palette (dawn oranges, midday blues, etc.)
   - Adjusts for cloud coverage (grey tints)
   - Modifies based on weather (darker for storms, lighter for snow)
4. **Displays full-screen gradient** representing the real sky color

## Screenshots

```
┌─────────────────────┐     ┌─────────────────────┐
│      Skyglow        │     │    Morning Sky      │
│                     │     │   New York, NY      │
│    Enter Zip Code   │ --> │                     │
│    [_____10001____] │     │     #4A90E2         │
│                     │     │   Zip: 10001        │
│  [Find Sky Color]   │     │                     │
└─────────────────────┘     └─────────────────────┘
```

## Installation & Setup

### Prerequisites

- Node.js 18+ installed
- iOS device or simulator
- Expo Go app (for testing on device)

### Step 1: Install Dependencies

```bash
cd skyglow
npm install
```

### Step 2: Get Free API Key

See detailed instructions in [API_SETUP.md](./API_SETUP.md)

**Quick version:**
1. Sign up at [WeatherAPI.com](https://www.weatherapi.com/signup.aspx)
2. Copy your free API key
3. Open `utils/weatherService.js`
4. Replace `YOUR_API_KEY_HERE` with your key

### Step 3: Run the App

**On iOS Simulator:**
```bash
npx expo start --ios
```

**On Physical iPhone (using Expo Go):**
```bash
npx expo start
```
Then scan the QR code with your iPhone camera.

**Build for Production:**
```bash
npx expo build:ios
```

## Project Structure

```
skyglow/
├── App.js                          # Main app component
├── utils/
│   ├── weatherService.js           # Weather API integration
│   ├── realTimeSkyColor.js         # Sky color calculation algorithm
│   └── colorGenerator.js           # Fallback simulated colors
├── assets/                         # App icons and images
├── API_SETUP.md                    # Detailed API setup guide
└── package.json
```

## Sky Color Algorithm

The algorithm uses a multi-factor approach:

### 1. Time-Based Base Colors

| Time Period | Color Palette |
|-------------|---------------|
| Night (10PM-5AM) | Dark blue to black |
| Dawn (5AM-7AM) | Orange, pink, light blue |
| Morning (7AM-10AM) | Bright sky blue |
| Midday (12PM-3PM) | Deep blue |
| Afternoon (3PM-5PM) | Blue-grey |
| Dusk (5PM-7PM) | Orange, pink |
| Evening (7PM-10PM) | Purple, indigo |

### 2. Cloud Coverage Adjustment

- **0-20% clouds:** Original colors (clear)
- **20-50% clouds:** Slight grey tint
- **50-80% clouds:** Noticeable grey
- **80-100% clouds:** Very grey/overcast

### 3. Weather Condition Overrides

- **Rain:** Grey-blue tones
- **Thunderstorm:** Dark charcoal grey
- **Snow:** Light grey/white
- **Fog/Mist:** Misty grey
- **Clear/Sunny:** Enhanced brightness

## API Information

### Free Tier Limits

- **WeatherAPI.com:** 1,000,000 calls/month (Recommended)
- **OpenWeatherMap:** 1,000 calls/day

Both are more than sufficient for personal use.

### Fallback Mode

If no API key is configured, the app falls back to a simulated color generator that uses time of day and the zip code as a seed for consistent colors.

## Example Zip Codes

Try these major US cities:

- `10001` - New York City, NY
- `90210` - Beverly Hills, CA
- `60601` - Chicago, IL
- `33101` - Miami, FL
- `98101` - Seattle, WA
- `02101` - Boston, MA
- `78701` - Austin, TX
- `94102` - San Francisco, CA

## Technologies Used

- **React Native** 0.79 - Mobile framework
- **Expo** 53.0 - Development platform
- **Axios** - HTTP client for API calls
- **expo-linear-gradient** - Gradient backgrounds
- **WeatherAPI.com** - Weather data provider

## Development

### Testing Without API Key

Set `useRealTimeData` to `false` in App.js:

```javascript
const [useRealTimeData, setUseRealTimeData] = useState(false);
```

### Adding New Weather Conditions

Edit `utils/realTimeSkyColor.js` and add to `adjustForWeatherCondition()`:

```javascript
if (condition.includes('your_condition')) {
  return {
    primary: '#HEXCOLOR',
    gradient: ['#COLOR1', '#COLOR2', '#COLOR3']
  };
}
```

## License

MIT License - See LICENSE file for details

## Credits

Inspired by [sky.dlazaro.ca](https://sky.dlazaro.ca)

Built with React Native and Expo for iOS.

---

Made with ❤️ for accurate sky color representation
