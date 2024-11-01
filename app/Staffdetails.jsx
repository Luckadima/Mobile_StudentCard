import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { getDoc, doc } from "firebase/firestore"; // Import Firestore functions
import { db ,  firebase_auth } from './Firebase'; 
import { getAuth } from 'firebase/auth';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; // Import responsive screen package
import { TouchableOpacity } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";

export default function DetailsPage() {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // State variables for student information
    const [name, setName] = useState("no data sent");
    const [studentNumber, setStudentNumber] = useState("no data sent");
    const [email, setEmail] = useState("no data sent");

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    useEffect(() => {
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
                    setName(data.name || "no data sent"); // Set name
                    setStudentNumber(data.studentNumber || "no data sent"); // Set student number
                    setEmail(data.email || "no data sent"); // Set email
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error loading user data from Firestore: ", error);
            }
        };

        fetchStudentDetails(); // Call the fetch function
    }, []);

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
        <ScrollView style={styles.container}> 
            <View style={styles.header}>
                <Text style={styles.title}>Staff Details</Text>
            </View>

            <View style={styles.detailBox}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.info}>{name}</Text>
                <Text style={styles.label}>Student ID:</Text>
                <Text style={styles.info}>{studentNumber}</Text>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.info}>{email}</Text>
            </View>

            <Animated.View style={[styles.button, { opacity: fadeAnim }]}>
                <TouchableOpacity onPress={handleLandingPage}>
                    <Text style={styles.buttonText}>Return To Home</Text>
                </TouchableOpacity>
            </Animated.View>
        </ScrollView>  
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: wp('7%'), // Responsive padding
        marginRight: wp("20%")
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp('3%'), // Responsive margin
    },
    title: {
        fontSize: hp('5%'), // Responsive font size
        fontWeight: 'bold',
        textAlign: 'center',
    },
    detailBox: {
        marginBottom: hp('2%'), // Responsive margin
    },
    label: {
        fontSize: hp('3%'), // Responsive font size
        fontWeight: 'bold',
        marginLeft: '-5%', // Slightly adjusted for better appearance
    },
    info: {
        fontSize: hp('3%'), // Responsive font size
        color: 'black',
        marginLeft: '-5%', // Slightly adjusted for better appearance
    },
    button: {
        backgroundColor: "lightgray",
        justifyContent: "center",
        alignItems: "center",
        height: hp('7%'), // Responsive height
        width: wp('50%'), // Responsive width
        borderRadius: 22,
        marginTop: hp('5%'), // Responsive margin
        marginLeft: wp('20%'), // Responsive margin
    },
    buttonText: {
        fontSize: hp('2.5%'), // Responsive font size
        color: '#fff',
    },
    gradient: {
        flex: 1, // Fill the entire screen
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
    },
});