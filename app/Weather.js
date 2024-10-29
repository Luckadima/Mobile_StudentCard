// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, Animated, TouchableOpacity } from 'react-native';
// import { useRouter } from 'expo-router';

// const WeatherPage = () => {
//     const [weather, setWeather] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const router = useRouter();

//     const fadeAnim = useRef(new Animated.Value(0)).current; // Declare fadeAnim

//     const LandingPage = () => {
//         router.push('/Landingpage');
//     }

//     const apiKey = 'a8f0979eda1d5bb3bb19b35e8e30cd6e'; // API key
//     const city = 'Johannesburg'; // City

//     useEffect(() => {
//         fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 setWeather(data);
//                 setLoading(false);
//             })
//             .catch(err => {
//                 console.error('Fetch error:', err);
//                 setError(err);
//                 setLoading(false);
//             });
//     }, [city, apiKey]); // Ensure dependencies are listed

//     useEffect(() => {
//         Animated.timing(fadeAnim, {
//             toValue: 1,
//             duration: 3000,
//             useNativeDriver: true,
//         }).start();
//     }, [fadeAnim]);

//     if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
//     if (error) return <Text>Error: {error.message}</Text>;

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Weather in {weather.name}</Text>
//             <Text style={styles.info}>Temperature: {Math.round(weather.main.temp - 273.15)}°C</Text>
//             <Text style={styles.info}>Weather: {weather.weather[0].description}</Text>
//             <Text style={styles.info}>Humidity: {weather.main.humidity}%</Text>
//             <Text style={styles.info}>Wind Speed: {weather.wind.speed} m/s</Text>

//             <Animated.View style={[styles.button, { opacity: fadeAnim }]}>
//                 <TouchableOpacity onPress={LandingPage}>
//                     <Text style={styles.buttonText}>Return To Home</Text>
//                 </TouchableOpacity>
//             </Animated.View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#e0f7fa',
//         padding: 20,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     info: {
//         fontSize: 18,
//         marginBottom: 5,
//     },
//     button: {
//         backgroundColor: 'gray',
//         width: "44%",
//         height: '13%',
//         borderRadius: 5,
//         marginTop: '40%',
//         marginLeft: '4%',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.8,
//         shadowRadius: 3,
//         elevation: 5,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 18,
//     }
// });

// export default WeatherPage;