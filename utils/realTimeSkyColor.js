/**
 * Real-time Sky Color Generator
 * Generates accurate sky colors based on actual weather conditions
 */

/**
 * Calculates the current sky color based on real weather data
 * @param {Object} weatherData - Weather data from API
 * @param {Object} astronomyData - Astronomy data (sunrise/sunset times)
 * @returns {Object} - Sky color and gradient information
 */
export const calculateRealTimeSkyColor = (weatherData, astronomyData = null) => {
  const { isDay, cloudCoverage, condition } = weatherData;
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();

  // Determine the base time period
  const timePeriod = determineTimePeriod(currentHour, currentMinute, isDay, astronomyData);

  // Get base colors for time period
  let skyColors = getSkyColorsForTimePeriod(timePeriod, isDay);

  // Adjust colors based on cloud coverage
  skyColors = adjustForCloudCoverage(skyColors, cloudCoverage);

  // Adjust based on weather conditions (rain, snow, storm, etc.)
  skyColors = adjustForWeatherCondition(skyColors, condition.text, condition.code);

  return {
    primaryColor: skyColors.primary,
    gradientColors: skyColors.gradient,
    timeOfDay: timePeriod,
    description: getWeatherBasedDescription(timePeriod, condition.text, cloudCoverage),
    weatherCondition: condition.text
  };
};

/**
 * Determines the current time period considering sunrise/sunset
 */
const determineTimePeriod = (hour, minute, isDay, astronomyData) => {
  const timeInMinutes = hour * 60 + minute;

  // If we have astronomy data, use it for accurate dawn/dusk times
  if (astronomyData) {
    const sunriseTime = parseTimeToMinutes(astronomyData.sunrise);
    const sunsetTime = parseTimeToMinutes(astronomyData.sunset);

    // Dawn: 30 minutes before to 30 minutes after sunrise
    if (timeInMinutes >= sunriseTime - 30 && timeInMinutes <= sunriseTime + 30) {
      return 'dawn';
    }

    // Dusk: 30 minutes before to 30 minutes after sunset
    if (timeInMinutes >= sunsetTime - 30 && timeInMinutes <= sunsetTime + 30) {
      return 'dusk';
    }
  }

  // Fallback to hour-based determination
  if (hour >= 22 || hour < 5) {
    return 'night';
  } else if (hour >= 5 && hour < 7) {
    return 'dawn';
  } else if (hour >= 7 && hour < 10) {
    return 'earlyMorning';
  } else if (hour >= 10 && hour < 12) {
    return 'lateMorning';
  } else if (hour >= 12 && hour < 15) {
    return 'midday';
  } else if (hour >= 15 && hour < 17) {
    return 'afternoon';
  } else if (hour >= 17 && hour < 19) {
    return 'dusk';
  } else {
    return 'evening';
  }
};

/**
 * Converts time string (e.g., "06:30 AM") to minutes since midnight
 */
const parseTimeToMinutes = (timeStr) => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

/**
 * Returns base sky colors for different time periods
 */
const getSkyColorsForTimePeriod = (timePeriod, isDay) => {
  const colorPalettes = {
    night: {
      primary: '#0B1426',
      gradient: ['#000428', '#004e92', '#0B1426']
    },
    dawn: {
      primary: '#FF6B6B',
      gradient: ['#FF6B6B', '#FFB347', '#87CEEB']
    },
    earlyMorning: {
      primary: '#87CEEB',
      gradient: ['#E0F6FF', '#87CEEB', '#4A90E2']
    },
    lateMorning: {
      primary: '#4A90E2',
      gradient: ['#87CEEB', '#4A90E2', '#1E90FF']
    },
    midday: {
      primary: '#1E90FF',
      gradient: ['#4A90E2', '#1E90FF', '#00BFFF']
    },
    afternoon: {
      primary: '#4682B4',
      gradient: ['#5F9EA0', '#4682B4', '#6495ED']
    },
    dusk: {
      primary: '#FF8E53',
      gradient: ['#87CEEB', '#FF8E53', '#FF6B6B']
    },
    evening: {
      primary: '#483D8B',
      gradient: ['#191970', '#483D8B', '#6A5ACD']
    }
  };

  return colorPalettes[timePeriod] || colorPalettes.midday;
};

/**
 * Adjusts colors based on cloud coverage percentage
 */
const adjustForCloudCoverage = (skyColors, cloudPercentage) => {
  if (cloudPercentage < 20) {
    // Clear sky - return original colors
    return skyColors;
  } else if (cloudPercentage < 50) {
    // Partly cloudy - slight grey tint
    return {
      primary: blendColors(skyColors.primary, '#E0E0E0', 0.2),
      gradient: skyColors.gradient.map(color => blendColors(color, '#E0E0E0', 0.15))
    };
  } else if (cloudPercentage < 80) {
    // Mostly cloudy - more grey
    return {
      primary: blendColors(skyColors.primary, '#B0B0B0', 0.4),
      gradient: skyColors.gradient.map(color => blendColors(color, '#B0B0B0', 0.35))
    };
  } else {
    // Overcast - very grey
    return {
      primary: '#8B8B8B',
      gradient: ['#A9A9A9', '#8B8B8B', '#707070']
    };
  }
};

/**
 * Adjusts colors based on specific weather conditions
 */
const adjustForWeatherCondition = (skyColors, conditionText, conditionCode) => {
  const condition = conditionText.toLowerCase();

  // Rain conditions
  if (condition.includes('rain') || condition.includes('drizzle')) {
    return {
      primary: '#536878',
      gradient: ['#6B7B8B', '#536878', '#4A5A6A']
    };
  }

  // Thunderstorm
  if (condition.includes('thunder') || condition.includes('storm')) {
    return {
      primary: '#2C3E50',
      gradient: ['#34495E', '#2C3E50', '#1C2833']
    };
  }

  // Snow
  if (condition.includes('snow') || condition.includes('blizzard')) {
    return {
      primary: '#E8EAF6',
      gradient: ['#F5F5F5', '#E8EAF6', '#CFD8DC']
    };
  }

  // Fog/Mist
  if (condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) {
    return {
      primary: '#B0BEC5',
      gradient: ['#CFD8DC', '#B0BEC5', '#90A4AE']
    };
  }

  // Clear/Sunny - enhance the colors
  if (condition.includes('clear') || condition.includes('sunny')) {
    return {
      primary: brightenColor(skyColors.primary, 0.1),
      gradient: skyColors.gradient.map(color => brightenColor(color, 0.1))
    };
  }

  return skyColors;
};

/**
 * Blends two hex colors together
 */
const blendColors = (color1, color2, ratio) => {
  const hex = (color) => {
    const c = color.replace('#', '');
    return {
      r: parseInt(c.substring(0, 2), 16),
      g: parseInt(c.substring(2, 4), 16),
      b: parseInt(c.substring(4, 6), 16)
    };
  };

  const c1 = hex(color1);
  const c2 = hex(color2);

  const r = Math.round(c1.r * (1 - ratio) + c2.r * ratio);
  const g = Math.round(c1.g * (1 - ratio) + c2.g * ratio);
  const b = Math.round(c1.b * (1 - ratio) + c2.b * ratio);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Brightens a hex color
 */
const brightenColor = (hexColor, factor) => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const newR = Math.min(255, Math.round(r + (255 - r) * factor));
  const newG = Math.min(255, Math.round(g + (255 - g) * factor));
  const newB = Math.min(255, Math.round(b + (255 - b) * factor));

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

/**
 * Generates a descriptive text based on time and weather
 */
const getWeatherBasedDescription = (timePeriod, weatherCondition, cloudCoverage) => {
  const timeDescriptions = {
    night: 'Night',
    dawn: 'Dawn',
    earlyMorning: 'Morning',
    lateMorning: 'Late Morning',
    midday: 'Midday',
    afternoon: 'Afternoon',
    dusk: 'Dusk',
    evening: 'Evening'
  };

  const cloudiness = cloudCoverage > 70 ? 'Cloudy' : cloudCoverage > 30 ? 'Partly Cloudy' : 'Clear';

  return `${timeDescriptions[timePeriod]} - ${weatherCondition}`;
};

/**
 * Export gradient colors in the format needed by LinearGradient
 */
export const getGradientColorsArray = (skyColorData) => {
  return skyColorData.gradientColors || [skyColorData.primaryColor, skyColorData.primaryColor];
};
