import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { getWeatherData } from './services/APIService';

export default function App() {
  const [location, setLocation] = useState({});
  const [city, setCity] = useState('');
  const [temp, setTemp] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [wind, setWind] = useState('');
  const [humidity, setHumidity] = useState('');
  const [visibility, setVisibility] = useState('');
  const [weatherDesc, setWeatherDesc] = useState('');
  const [icon, setIcon] = useState('');

  const fahrenheit = (temp * 1.8 - 459.67).toFixed(1);
  const celsius = (temp - 273.15).toFixed(1);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position);
        console.log(location);
        setLocation({ location });
      },
      error => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }, []);

  useEffect(() => {
    if (city.length === 0) {
      setIsLoading(true);
      getWeatherData('Kiev').then(data => {
        setCity(data.name);
        setHumidity(data.main.humidity);
        setVisibility(data.visibility);
        setTemp(data.main.temp);
        setWeatherDesc(data.weather[0].description);
        setWind(data.wind.speed);
        setIcon(data.weather[0].icon);
      });
      setIsLoading(false);
    }
  }, [city]);

  return isLoading ? (
    <Text style={styles.container}>Loading...</Text>
  ) : (
    <View style={styles.container}>
      <Image
        style={styles.stretch}
        source={{
          uri: `http://openweathermap.org/img/wn/${icon}.png`,
        }}
      />
      <Text>{city}</Text>
      <Text>
        {fahrenheit} &#8457; / {celsius} &#8451;
      </Text>

      <Text> {weatherDesc}</Text>
      <Text>Humidity: {humidity}</Text>
      <Text>Wind: {wind} m/s</Text>
      <Text>Visibility: {visibility}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stretch: {
    width: 50,
    height: 50,
    resizeMode: 'stretch',
  },
});
