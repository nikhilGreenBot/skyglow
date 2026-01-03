# Skyglow - Quick Start Guide

Get Skyglow running in 5 minutes!

## 1. Install Dependencies

```bash
cd skyglow
npm install
```

## 2. Get Your Free API Key (30 seconds)

1. Go to https://www.weatherapi.com/signup.aspx
2. Sign up (it's free - no credit card needed)
3. Copy your API key from the dashboard

## 3. Add API Key to App

Open `utils/weatherService.js` and replace:

```javascript
const WEATHER_API_KEY = 'YOUR_API_KEY_HERE';
```

with:

```javascript
const WEATHER_API_KEY = 'your_actual_key_here';
```

## 4. Run the App

**Option A: iOS Simulator**
```bash
npx expo start --ios
```

**Option B: Your iPhone (using Expo Go app)**
```bash
npx expo start
```
Then scan the QR code with your iPhone camera.

## 5. Try It Out!

Enter any valid US zip code:
- `10001` (New York)
- `90210` (Los Angeles)
- `60601` (Chicago)

The app will show you the **real-time actual sky color** for that location!

## No API Key? No Problem!

You can still test the app with simulated colors:

1. Open `App.js`
2. Find this line (around line 33):
   ```javascript
   const [useRealTimeData, setUseRealTimeData] = useState(true);
   ```
3. Change `true` to `false`:
   ```javascript
   const [useRealTimeData, setUseRealTimeData] = useState(false);
   ```

Now the app will use simulated sky colors based on time of day.

## Troubleshooting

**"Cannot find module 'axios'"**
```bash
npm install
```

**"Invalid zip code"**
- Use 5-digit US zip codes only (e.g., `10001`)
- No dashes or spaces

**"API key not configured"**
- Make sure you saved `weatherService.js` after adding your key
- Restart the Expo server

## Need Help?

Check out the full documentation:
- [API_SETUP.md](./API_SETUP.md) - Detailed API setup
- [README.md](./README.md) - Complete documentation

---

That's it! Enjoy Skyglow! 🌤️
