// Sky Color Generator - Inspired by sky.dlazaro.ca
// This utility generates sky colors based on zip codes and time of day

export const generateSkyColor = (zipCode, timestamp = Date.now()) => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const minute = date.getMinutes();
  
  // Convert zip code to a seed for consistent colors
  const seed = parseInt(zipCode) || 10000;
  
  // Base sky colors for different times of day
  const skyColors = {
    night: ['#0B1426', '#1a1a2e', '#16213e', '#0f3460', '#1e3a8a'],
    dawn: ['#FF6B6B', '#FF8E53', '#FFB347', '#FFD93D', '#FFE66D'],
    morning: ['#87CEEB', '#87CEFA', '#B0E0E6', '#ADD8E6', '#E0F6FF'],
    noon: ['#4A90E2', '#1E90FF', '#00BFFF', '#87CEEB', '#B0E0E6'],
    afternoon: ['#4682B4', '#5F9EA0', '#6495ED', '#7B68EE', '#9370DB'],
    dusk: ['#FF6B6B', '#FF8E53', '#FFB347', '#FFD93D', '#FFE66D'],
    evening: ['#191970', '#483D8B', '#6A5ACD', '#7B68EE', '#9370DB']
  };
  
  // Determine time of day
  let timeOfDay;
  if (hour >= 22 || hour < 6) {
    timeOfDay = 'night';
  } else if (hour >= 6 && hour < 8) {
    timeOfDay = 'dawn';
  } else if (hour >= 8 && hour < 12) {
    timeOfDay = 'morning';
  } else if (hour >= 12 && hour < 16) {
    timeOfDay = 'noon';
  } else if (hour >= 16 && hour < 18) {
    timeOfDay = 'afternoon';
  } else if (hour >= 18 && hour < 20) {
    timeOfDay = 'dusk';
  } else {
    timeOfDay = 'evening';
  }
  
  // Select color based on seed and time
  const colors = skyColors[timeOfDay];
  const colorIndex = seed % colors.length;
  let baseColor = colors[colorIndex];
  
  // Add subtle variations based on minutes
  const minuteVariation = (minute / 60) * 0.1;
  const adjustedColor = adjustColorBrightness(baseColor, minuteVariation);
  
  return {
    color: adjustedColor,
    timeOfDay,
    hour,
    minute
  };
};

// Helper function to adjust color brightness
const adjustColorBrightness = (hex, factor) => {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Adjust brightness
  const newR = Math.min(255, Math.max(0, r + (factor * 255)));
  const newG = Math.min(255, Math.max(0, g + (factor * 255)));
  const newB = Math.min(255, Math.max(0, b + (factor * 255)));
  
  // Convert back to hex
  return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
};

// Get complementary colors for gradients
export const getGradientColors = (baseColor) => {
  const gradients = {
    '#87CEEB': ['#4A90E2', '#7B68EE'],
    '#4682B4': ['#2E5A88', '#5F9EA0'],
    '#1E90FF': ['#0066CC', '#4A90E2'],
    '#00BFFF': ['#0099CC', '#87CEEB'],
    '#87CEFA': ['#5F9EA0', '#B0E0E6'],
    '#B0E0E6': ['#87CEEB', '#E0F6FF'],
    '#ADD8E6': ['#87CEEB', '#F0F8FF'],
    '#F0F8FF': ['#E0F6FF', '#FFFFFF'],
    '#E0F6FF': ['#B0E0E6', '#F0F8FF'],
    '#B8E6B8': ['#90EE90', '#E0F6FF'],
    '#191970': ['#000080', '#483D8B'],
    '#FF6B6B': ['#FF4757', '#FF6B6B'],
    '#FF8E53': ['#FF6B6B', '#FF8E53'],
    '#FFB347': ['#FF8E53', '#FFB347'],
    '#FFD93D': ['#FFB347', '#FFD93D'],
    '#FFE66D': ['#FFD93D', '#FFE66D']
  };
  
  return gradients[baseColor] || ['#4A90E2', '#7B68EE'];
};

// Get time-based description
export const getTimeDescription = (timeOfDay) => {
  const descriptions = {
    night: 'Night Sky',
    dawn: 'Dawn Breaking',
    morning: 'Morning Sky',
    noon: 'Midday Sky',
    afternoon: 'Afternoon Sky',
    dusk: 'Dusk Setting',
    evening: 'Evening Sky'
  };
  
  return descriptions[timeOfDay] || 'Sky Color';
};
