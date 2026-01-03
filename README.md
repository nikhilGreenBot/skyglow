# Skyglow

A beautiful React Native iOS app that shows the **real-time current sky color** based on a US zip code. The app fetches live weather data and accurately depicts the sky's color considering time of day, cloud coverage, and current weather conditions.

![React Native](https://img.shields.io/badge/React_Native-0.79-blue)
![Expo](https://img.shields.io/badge/Expo-53.0-black)
![iOS](https://img.shields.io/badge/iOS-Compatible-green)

## Features

- **Enter any US zip code** to see the current sky color for that location
- **Real-time sky colors** that change based on:
  - Time of day (dawn, morning, midday, afternoon, dusk, evening, night)
  - Cloud coverage (clear to overcast)
  - Weather conditions (sunny, rainy, snowy, stormy, foggy)
  - Actual sunrise and sunset times
- **Beautiful full-screen gradients** that accurately represent the sky
- **Save sky colors as wallpapers** to your photo library
- **Simple, elegant interface** designed for iOS

## How It Works

1. **Enter a US zip code** (e.g., 10001 for New York City)
2. **See the sky color** - Full-screen gradient shows what the sky looks like right now
3. **View location details** - City name, weather description, and hex color code
4. **Save as wallpaper** - Export the gradient to your photo library

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

## Installation

```bash
git clone https://github.com/nikhilGreenBot/skyglow.git
cd skyglow
npm install
npx expo start --ios
```

## Sky Color Examples

The app displays different colors throughout the day:

- **Night:** Deep blue to black
- **Dawn:** Orange and pink sunrise hues
- **Morning:** Bright sky blue
- **Midday:** Deep azure blue
- **Afternoon:** Blue-grey tones
- **Dusk:** Orange and pink sunset colors
- **Evening:** Purple and indigo

Colors automatically adjust for:
- Cloud coverage (adds grey tints)
- Rain (grey-blue tones)
- Thunderstorms (dark grey)
- Snow (light grey/white)
- Fog (misty grey)

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

## Built With

- React Native & Expo
- Real-time weather data integration
- Custom sky color algorithm

## License

MIT License

---

Made with ❤️ for sky color enthusiasts
