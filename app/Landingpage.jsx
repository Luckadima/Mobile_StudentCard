import { LinearGradient } from "expo-linear-gradient";
import { Text, View, StyleSheet, Animated, Pressable, ActivityIndicator, PanResponder, AppState, Alert } from "react-native";
import { useRef, useEffect, useState } from "react";
import { router } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import * as Location from 'expo-location';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { doc, getDoc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from './Firebase';
import { getAuth } from 'firebase/auth';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

function Landingpage() {

  const [timeSpentOnApp, setTimeSpentOnApp] = useState(0); // Time spent in seconds
  const [isActive, setIsActive] = useState(true); // Track if the app is active
  const timeSpentRef = useRef(timeSpentOnApp); // Ref to hold the latest time spent

  useEffect(() => {
    // Set the current date
    // const currentDate = new Date();
    // setDateString(currentDate.toLocaleDateString());

    // Fetch user details from Firestore
    const fetchStudentDetails = async () => {
        const auth = getAuth();
        const uid = auth.currentUser?.uid;

        if (!uid) {
            console.error("No user is currently logged in.");
            return;
        }

        try {
            const userDoc = await getDoc(doc(db, "users", uid)); // Get user document from Firestore
            if (userDoc.exists()) {
                const data = userDoc.data();
                // Set time spent on app from Firestore if it exists
                if (data.timeSpentOnApp) {
                    setTimeSpentOnApp(data.timeSpentOnApp); // Set fetched time spent
                    timeSpentRef.current = data.timeSpentOnApp; // Update ref
                }
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error loading user data from Firestore: ", error);
        }
    };

    fetchStudentDetails(); // Call the fetch function

    // Add app state listener for screen time tracking
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
        subscription.remove(); // Clean up the listener on unmount
    };
}, []);

const handleAppStateChange = (nextAppState) => {
    console.log('AppState changed to:', nextAppState); // Log the current app state

    if (nextAppState === 'active') {
        console.log("App is active"); // Log when app becomes active
        setIsActive(true); // Allow the timer to count
    } else if (nextAppState === 'background') {
        console.log("App is inactive"); // Log when app becomes inactive
        setIsActive(false); // Stop the timer

        // Capture the latest time spent on app
        const currentTimeSpent = timeSpentRef.current;
        console.log(`Time spent on app before going inactive: ${currentTimeSpent} seconds`); // Log time spent

        // Save time spent on app to Firestore
        saveTimeSpent(currentTimeSpent);
    }
};

const saveTimeSpent = async (time) => {
    const auth = getAuth();
    const uid = auth.currentUser?.uid;

    if (!uid) {
        console.error("No user is currently logged in.");
        return;
    }

    try {
        await setDoc(doc(db, "users", uid), { timeSpentOnApp: time }, { merge: true }); // Save time spent in Firestore
        console.log("Time spent on app saved successfully!");
    } catch (error) {
        console.error("Error saving time spent on app to Firestore: ", error);
    }
};

// Start a timer that only runs when the app is active
useEffect(() => {
    let intervalId;
    if (isActive) {
        intervalId = setInterval(() => {
            setTimeSpentOnApp((prevTime) => {
                const newTime = prevTime + 1;
                timeSpentRef.current = newTime; // Update the ref with the new time spent
                console.log(`Time spent on app: ${newTime} seconds`); // Log every second
                return newTime; // Increment time spent every second
            });
        }, 1000);
    }

    return () => {
        clearInterval(intervalId); // Clean up the interval on unmount
    };
}, [isActive]);

// Calculate days, hours, minutes, and seconds from time spent
const days = Math.floor(timeSpentOnApp / (3600 * 24));
const hours = Math.floor((timeSpentOnApp % (3600 * 24)) / 3600);
const minutes = Math.floor((timeSpentOnApp % 3600) / 60);
const seconds = timeSpentOnApp % 60;

// Request permission to access media library
// const getPermission = async () => {
//     const { status } = await MediaLibrary.requestPermissionsAsync();
//     if (status !== 'granted') {
//         alert('Sorry, we need camera roll permissions to make this work!');
//     }
// };

  const Homepage = () => {
    router.push('/Homepage');
  }

  const Details = () => {
    router.push('/Details');
  }

  const QRcode = () => {
    router.push('/QRcode');
  }

  const Plan = () => {
    router.push('/Plan')
  }



  const Activity = () => {
    router.push('/Activity');
  }

  const Login = () => {
    router.push('/Login');
  }

  const TimeTable = () => {
    router.push('/Timetable');
  }



  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-wp(80))).current;

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
    Animated.timing(slideAnim, {
      toValue: isSidebarVisible ? 0 : -wp(80),
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const apiKey = 'a8f0979eda1d5bb3bb19b35e8e30cd6e';

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location.coords;
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setWeather(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Fetch error:', err);
          setError(err);
          setLoading(false);
        });
    }
  }, [location, apiKey]);

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

    // PanResponder for swipe gestures
    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          return gestureState.dx < -30; // Trigger on swipe left
        },
        onPanResponderRelease: (evt, gestureState) => {
          if (gestureState.dx < -30) {
            toggleSidebar(); // Close sidebar on swipe left
          }
        },
      })
    ).current;



const handleLogout = () => {
  // Display confirmation alert
  Alert.alert(
    "Confirm Logout",
    "Are you sure you want to log out?",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Logout cancelled"),
        style: "cancel"
      },
      {
        text: "Logout",
        onPress: () => {
          // Stop the time spent timer and clear any interval
          setIsActive(false); // Stop the timer
          
          // Log the logout event
          console.log("User logged out");

          // Save the current time spent before logging out
          saveTimeSpent(timeSpentRef.current);

          // Navigate to the login page
          router.push('/Plan');
        }
      }
    ]
  );
};



  return (
    <>
      <LinearGradient colors={['#FF4500', '#A9A9A9', '#000000']} style={styles.gradient}>
        <View style={styles.container}>
          <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
            WELCOME
          </Animated.Text>
        </View>

        <AntDesign 
          style={{ marginLeft: wp(85), marginTop: hp(-6) }} 
          name="menufold" 
          size={24} 
          color="black" 
          onPress={toggleSidebar} 
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.errorText}>Error: {error.message}</Text>
        ) : (
          <Animated.View style={{ opacity: fadeAnim, marginTop: hp(3) }}>
            <Pressable onPress={toggleDetails}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: wp(2), marginBottom: hp(1) }}>
                <FontAwesome6 name="map-location" size={24} color="black" />
                <Text style={{fontSize: hp(3), fontWeight: '400'}}>{weather.name}</Text>
                <FontAwesome6 name="temperature-quarter" size={24} color="black" />
                <Text style={{fontSize: hp(3), fontWeight: '400'}}>Temperature: {Math.round(weather.main.temp - 273.15)}°C</Text>
              </View>
            </Pressable>
            <Text style={styles.label}>Time spent on app:<Text style={styles.info}>{days}d {hours}h {minutes}m {seconds}s</Text></Text>


            {detailsVisible && (
              <>
                <Text style={styles.weatherText}>Weather: {weather.weather[0].description}</Text>
                <Text style={styles.weatherText}>Humidity: {weather.main.humidity}%</Text>
                <Text style={styles.weatherText}>Wind Speed: {weather.wind.speed} m/s</Text>
              </>
            )}
          </Animated.View>
        )}

        <Animated.View 
          {...panResponder.panHandlers} // Attach pan handlers
          style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
        >
          <Entypo style={{ marginBottom: hp(-7) }} name="bar-graph" size={24} color="white" />
          <Text onPress={Activity} style={styles.sidebarText}>Your activity</Text>
          <AntDesign style={{ marginBottom: hp(-7) }} name="setting" size={24} color="white" />
          <Text style={styles.sidebarText}>Settings</Text>
          <AntDesign style={{ marginBottom: hp(-7) }} name="profile" size={24} color="white" />
          <Text style={styles.sidebarText}>Account</Text>
          <AntDesign style={{ marginBottom: hp(-7) }} name="question" size={24} color="white" />
          <Text style={styles.sidebarText}>About</Text>
          <AntDesign style={{ marginBottom: hp(-7) }} name="logout" size={24} color="white" />
          <Text onPress={handleLogout} style={styles.sidebarText}>Logout</Text>
        </Animated.View>

        <View style={styles.buttonWrapper}>
          <Animated.View style={[styles.buttonContainer]}>
            <Pressable onPress={Homepage}>
              <Text style={styles.buttonText}>Tap To Enter</Text>
            </Pressable>
          </Animated.View>

          <Animated.View style={[styles.buttonContainer]}>
            <Pressable onPress={QRcode}>
              <Text style={styles.buttonText}>Scan</Text>
            </Pressable>
          </Animated.View>
        </View>

        <View style={styles.buttonWrapper}>
          <Animated.View style={[styles.buttonContainer]}>
            <Pressable onPress={Details}>
              <Text style={styles.buttonText}>Details</Text>
            </Pressable>
          </Animated.View>

          <Animated.View style={[styles.buttonContainer]}>
            <Pressable onPress={TimeTable}>
              <Text style={styles.buttonText}>TimeTable</Text>
            </Pressable>
          </Animated.View>
        </View>

      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    height: hp('100%'),
  },
  container: {
    marginTop: hp(5), // Increased to avoid clash with weather
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: hp(5),
    fontWeight: 'bold',
    color: 'black',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: hp(3),
    bottom: 0,
    width: wp(70),
    backgroundColor: 'black',
    zIndex: 10,
    padding: wp(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  sidebarText: {
    color: 'white',
    fontSize: hp(2.5),
    padding: hp(4),
  },
  weatherText: {
    fontSize: hp(2.5),
    fontWeight: '400',
    color: 'black',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: hp(2),
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp(10),
    marginTop: hp(10), // Adjusted for better spacing
  },
  buttonContainer: {
    backgroundColor: 'black',
    width: wp(38),
    height: hp(20), // Increased size
    borderRadius: 5,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
    marginBottom:'-10%'
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: hp(2.5),
  },
  label: {
    marginLeft: wp("-100%"),
    color: 'black', // Darker text for readability
    },
  info: {
        color: 'black', // Lighter text for less emphasis
    },
});

export default Landingpage;