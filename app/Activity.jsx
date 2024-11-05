import React, { useState, useEffect, useRef ,} from "react";
import { View, StyleSheet, AppState, TouchableOpacity, Text } from "react-native";
import { doc, getDoc , updateDoc} from "firebase/firestore"; // Import Firestore functions
import { db , firebase_auth} from './Firebase';
import { getAuth } from 'firebase/auth';
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from '@expo/vector-icons/AntDesign';
import ViewShot from 'react-native-view-shot'; // Import ViewShot
import * as FileSystem from 'expo-file-system'; // For file system access
import * as Sharing from 'expo-sharing'; // For sharing the image
import * as MediaLibrary from 'expo-media-library'; // For media library access
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; // Import responsive functions
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from "expo-router";

export default function Activity() {
    const [scanCount, setScan] = useState("no data sent");
    const [timeSpentOnApp, setTimeSpentOnApp] = useState(0); // Time spent in seconds
    const [dateString, setDateString] = useState('');
    const viewShotRef = useRef(null); // Ref for ViewShot
    const [tapCount, setTaps] = useState(0);


    useEffect(() => {
        // Set the current date
        const currentDate = new Date();
        setDateString(currentDate.toLocaleDateString());

        // Fetch user details from Firestore
        fetchStudentDetails();
    }, []);

    // Function to fetch user details from Firestore
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
                setScan(data.scanCount || 0);
                setTimeSpentOnApp(data.timeSpentOnApp || 0); // Ensure it's a number
                setTaps(data.tapCount || 0)
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error loading user data from Firestore: ", error);
        }
    };

    // Request permission to access media library
    const getPermission = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
    };

    // Function to capture view and save the image
    const downloadImage = async () => {
        await getPermission(); // Request permission before downloading

        if (viewShotRef.current) {
            try {
                const uri = await viewShotRef.current.capture(); // Capture the view as an image
                console.log("Image URI: ", uri); // Log the captured image URI

                // Use documentDirectory which is writable
                const fileUri = `${FileSystem.documentDirectory}activity_detail.jpg`;

                await FileSystem.copyAsync({
                    from: uri,
                    to: fileUri,
                });



                // Ensure the file exists and is accessible before sharing
                const fileInfo = await FileSystem.getInfoAsync(fileUri);
                if (fileInfo.exists) {
                    console.log('File exists, sharing now...');
                    await Sharing.shareAsync(fileUri); // Share the image using Expo's Sharing API
                } else {
                    console.error('File does not exist at the provided URI');
                }

                const asset = await MediaLibrary.createAssetAsync(fileUri);
                if (asset) {
                    alert('Image saved successfully!'); 
                } else {
                    alert('Image could not be saved.');
                }
                
            } catch (error) {
                console.error("Error capturing view: ", error);
            }
        }
    };

    // Function to convert seconds into days, hours, minutes, and seconds
    const formatTime = (totalSeconds) => {
        const days = Math.floor(totalSeconds / (24 * 60 * 60));
        const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        const seconds = totalSeconds % 60;

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    // Function to handle refresh action
    const handleRefresh = () => {
        fetchStudentDetails(); // Fetch updated details from Firestore
    };

    // const Landingpage = () => {
    //     router.push('/Landingpage')
    // }


    const handleLandingPage = async () => {
        const userId = firebase_auth.currentUser?.uid;
        if (userId) {
            try {
                const userRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userRef); // Retrieve the document for the user
                if (userDoc.exists()) {
                    const role = userDoc.data().ifstudent; // Assuming 'ifstudent' holds the role
                    if (role === 'Staff') {
                        router.push('/Stafflanding'); // Navigate to Stafflanding if the user is a staff
                    } else {
                        router.push('/Landingpage'); // Navigate to Landingpage otherwise
                    }
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        } else {
            console.error("User not authenticated");
        }
    };



    return (
        <LinearGradient colors={['#FF4500', '#A9A9A9', '#000000']} style={styles.gradient}>
            <View style={styles.container}>
                <Text style={styles.title}>User Activity</Text>
                <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }}>
                    <View style={styles.detailBox}>
                        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                            <FontAwesome name="refresh" size={24} color="red" />
                        </TouchableOpacity>
                        <Text style={styles.label}>Current Date:<Text style={styles.info}>{dateString}</Text></Text>
                        <Text style={styles.label}>Number of times tapped:<Text style={styles.info}>{tapCount}</Text></Text>
                        <Text style={styles.label}>Number of times scanned:<Text style={styles.info}>{scanCount}</Text></Text>
                        <Text style={styles.label}>Time spent on app:<Text style={styles.info}> {formatTime(timeSpentOnApp)}</Text></Text>

                        <TouchableOpacity onPress={downloadImage} style={styles.downloadButton}>
                            <AntDesign name="download" size={24} color='red' />
                        </TouchableOpacity>
                    </View>
                </ViewShot>

            <View style={styles.button}>
                <TouchableOpacity onPress={handleLandingPage}>
                    <Text style={styles.buttonText}>Return To Home</Text>
                </TouchableOpacity>
            </View>

            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        marginLeft: wp('3%'), // Use responsive width percentage
        marginBottom: hp('10%'), // Use responsive height percentage
        alignItems: 'center', // Center content horizontally
    },
    title: {
        fontSize: wp('6%'), // Responsive font size
        fontWeight: 'bold',
        color: 'black',
        marginBottom: hp('2%'), // Responsive margin
    },
    detailBox: {
        backgroundColor: '#FFFFFF', // White background for contrast
        borderRadius: 15, // Rounded corners
        padding: hp('2%'), // Responsive padding
        width: wp('80%'), // Adjust width for better layout
        shadowColor: '#000', // Shadow for pop-out effect
        shadowOffset: { width: 0, height: 5 }, // Shadow position
        shadowOpacity: 0.3, // Shadow transparency
        shadowRadius: 10, // Shadow blur radius
        elevation: 5, // Shadow for Android
    },
    label: {
        fontSize: wp('5%'), // Responsive font size
        fontWeight: 'bold',
        marginBottom: hp('1.5%'), // Responsive margin
        color: '#333', // Darker text for readability
    },
    info: {
        fontWeight: 'normal', // Regular weight for information
        fontSize: wp('4%'), // Responsive font size
        color: 'red', // Lighter text for less emphasis
    },
    downloadButton: {
        marginTop: hp('3%'), // Responsive margin
    },
    refreshButton: {
        marginLeft: "90%", // Adjust for placement of refresh icon
    },
    gradient: {
        flex: 1, // Fill the entire screen
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
    },
    button: {
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        height: hp('7%'), // Responsive height
        width: wp('50%'), // Responsive width
        borderRadius: 22,
        marginTop: hp('35%'), // Responsive margin
        marginRight: wp('2%'), // Responsive margin
    },
});
















