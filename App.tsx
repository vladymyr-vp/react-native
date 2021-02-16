import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native';
import Geocoder from 'react-native-geocoding';
import { getWeatherData } from './services/APIService';

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stretch: {
    width: 100,
    height: 100,
    resizeMode: 'stretch',
    marginBottom: 0,
  },
  text: {
    color: '#fff',
  },
  city: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default function App() {
  const [location, setLocation] = useState({
    coords: {
      accuracy: 0,
      altitude: 0,
      altitudeAccuracy: 0,
      heading: 0,
      latitude: 0,
      longitude: 0,
      speed: 0,
    },
    mocked: false,
    timestamp: 0,
  });
  const [city, setCity] = useState('');
  const [temp, setTemp] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [wind, setWind] = useState('');
  const [humidity, setHumidity] = useState('');
  const [weatherDesc, setWeatherDesc] = useState('');
  const [icon, setIcon] = useState('');

  let isGeolocationIsReady = false;

  const fahrenheit = (temp * 1.8 - 459.67).toFixed(1);
  const celsius = (temp - 273.15).toFixed(1);

  useEffect(() => {
    Geocoder.init('....');
    navigator.geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position);

        setLocation(JSON.parse(location));
        Geocoder.from(position.coords.latitude, position.coords.longitude)
          .then(json => {
            const addressComponent = json.results[0].address_components;
            setCity(addressComponent[3].long_name);
          })
          .catch(error => console.warn(error));
      },
      error => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    isGeolocationIsReady = true;
  }, []);

  console.log(location);

  useEffect(() => {
    if (isGeolocationIsReady) {
      setIsLoading(true);
      getWeatherData(city).then(data => {
        setCity(data.name);
        setHumidity(data.main.humidity);
        setTemp(data.main.temp);
        setWeatherDesc(data.weather[0].description);
        setWind(data.wind.speed);
        setIcon(data.weather[0].icon);
      });
      setIsLoading(false);
    }
  }, []);

  return isLoading ? (
    <Text style={styles.containerWrapper}>Loading...</Text>
  ) : (
    <ImageBackground
      source={{ uri: 'https://mfiles.alphacoders.com/747/747892.jpg' }}
      style={styles.container}
    >
      <View style={styles.container}>
        <Image
          style={styles.stretch}
          source={{
            uri: `http://openweathermap.org/img/wn/${icon}.png`,
          }}
        />

        <Text style={[styles.text, styles.city]}>{city}</Text>
        <Text style={styles.text}>
          {fahrenheit} &#8457; / {celsius} &#8451;
        </Text>
        <Text style={styles.text}> {weatherDesc}</Text>
        <Text style={styles.text}>Humidity: {humidity}</Text>
        <Text style={styles.text}>Wind: {wind} m/s</Text>
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
}
