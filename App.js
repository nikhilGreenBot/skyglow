import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { generateSkyColor, getGradientColors, getTimeDescription } from './utils/colorGenerator';
import { getCurrentWeather, getAstronomyData, isValidUSZipCode } from './utils/weatherService';
import { calculateRealTimeSkyColor, getGradientColorsArray } from './utils/realTimeSkyColor';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [zipCode, setZipCode] = useState('');
  const [skyColor, setSkyColor] = useState('#87CEEB');
  const [gradientColors, setGradientColors] = useState(['#4A90E2', '#7B68EE']);
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [weatherDescription, setWeatherDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const [useRealTimeData, setUseRealTimeData] = useState(true);

  // Request permissions on app start
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant media library permission to save wallpapers.');
    }
  };

  const getSkyColor = async (zip) => {
    setIsLoading(true);
    try {
      if (useRealTimeData) {
        // Fetch real-time weather data
        const weatherData = await getCurrentWeather(zip);
        const astronomyData = await getAstronomyData(zip);

        // Calculate real sky color based on actual conditions
        const skyColorData = calculateRealTimeSkyColor(weatherData, astronomyData);

        setSkyColor(skyColorData.primaryColor);
        setGradientColors(skyColorData.gradientColors);
        setTimeOfDay(skyColorData.timeOfDay);
        setWeatherDescription(skyColorData.description);
        setLocationName(`${weatherData.location.name}, ${weatherData.location.region}`);
        setShowInput(false);
      } else {
        // Fallback to simulated color generator
        const result = generateSkyColor(zip);
        setSkyColor(result.color);
        setGradientColors(getGradientColors(result.color));
        setTimeOfDay(result.timeOfDay);
        setWeatherDescription(getTimeDescription(result.timeOfDay));
        setLocationName('Simulated');
        setShowInput(false);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to get sky color. Please try again.');
      // Fallback to simulated mode
      const result = generateSkyColor(zip);
      setSkyColor(result.color);
      setGradientColors(getGradientColors(result.color));
      setTimeOfDay(result.timeOfDay);
      setWeatherDescription(getTimeDescription(result.timeOfDay));
      setLocationName('Simulated (API Error)');
      setShowInput(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleZipCodeSubmit = () => {
    if (zipCode.trim().length === 0) {
      Alert.alert('Error', 'Please enter a zip code');
      return;
    }

    // Validate US zip code format
    if (!isValidUSZipCode(zipCode)) {
      Alert.alert('Invalid Zip Code', 'Please enter a valid 5-digit US zip code (e.g., 10001)');
      return;
    }

    getSkyColor(zipCode);
  };

  const setAsWallpaper = async () => {
    try {
      // Create a simple image with the sky color
      const svgContent = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:${skyColor};stop-opacity:1" />
              <stop offset="100%" style="stop-color:${getGradientColors(skyColor)[1]};stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#skyGradient)"/>
          <text x="50%" y="40%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="28" fill="white" font-weight="bold">
            ${getTimeDescription(timeOfDay)}
          </text>
          <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="20" fill="white">
            ${skyColor}
          </text>
          <text x="50%" y="60%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="white" opacity="0.8">
            Zip: ${zipCode}
          </text>
        </svg>
      `;

      const fileUri = `${FileSystem.documentDirectory}sky_wallpaper.svg`;
      await FileSystem.writeAsStringAsync(fileUri, svgContent);

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('Sky Colors', asset, false);

      Alert.alert('Success', 'Sky color saved to your photos! You can now set it as wallpaper from your device settings.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save wallpaper. Please try again.');
    }
  };

  const resetApp = () => {
    setZipCode('');
    setSkyColor('#87CEEB');
    setGradientColors(['#4A90E2', '#7B68EE']);
    setTimeOfDay('morning');
    setWeatherDescription('');
    setLocationName('');
    setShowInput(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {showInput ? (
        <LinearGradient
          colors={['#4A90E2', '#7B68EE']}
          style={styles.container}
        >
          <View style={styles.content}>
            <View style={styles.cloudContainer}>
              <Ionicons name="cloud" size={80} color="white" style={styles.cloudIcon} />
            </View>
            
            <Text style={styles.title}>Skyglow</Text>
            <Text style={styles.subtitle}>Enter your zip code to see the sky color</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter Zip Code"
                placeholderTextColor="#999"
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="numeric"
                maxLength={5}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleZipCodeSubmit}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Loading...' : 'Find Sky Color'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={gradientColors}
          style={styles.container}
        >
          <View style={styles.resultContainer}>
            <View style={styles.colorDisplay}>
              <Text style={styles.colorText}>{weatherDescription || getTimeDescription(timeOfDay)}</Text>
              {locationName ? <Text style={styles.locationText}>{locationName}</Text> : null}
              <Text style={styles.colorCode}>{skyColor}</Text>
              <Text style={styles.zipCode}>Zip: {zipCode}</Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.wallpaperButton} onPress={setAsWallpaper}>
                <Ionicons name="image" size={24} color="white" />
                <Text style={styles.wallpaperButtonText}>Set as Wallpaper</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.resetButton} onPress={resetApp}>
                <Ionicons name="refresh" size={24} color="white" />
                <Text style={styles.resetButtonText}>Try Another Zip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cloudContainer: {
    marginBottom: 30,
  },
  cloudIcon: {
    opacity: 0.8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 300,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  colorDisplay: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 40,
    backdropFilter: 'blur(10px)',
  },
  colorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  locationText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  colorCode: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  zipCode: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  wallpaperButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  wallpaperButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  resetButton: {
    backgroundColor: '#FF9800',
    borderRadius: 25,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
