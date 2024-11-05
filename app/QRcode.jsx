import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { CameraView, CameraType, useCameraPermissions, Camera} from 'expo-camera';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router, useFocusEffect } from "expo-router";
import { db, firebase_auth } from './Firebase'; // Adjust the path as necessary
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore methods

function QRcode() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [scanCount, setScanCount] = useState(0); // Counter state for scans
  
    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };

        getCameraPermissions();
    }, []);


    const handleBarcodeScanned = async ({ type, data }) => {
        if (scanned) return; // Prevent handling multiple times during the cooldown
    
        setScanned(true);
        setScanCount(prevCount => prevCount + 1); // Increment the scan counter
      
        // Display "Access Granted" alert
        alert("Access granted");
    
        const userId = firebase_auth.currentUser?.uid;
        if (userId) {
            try {
                const userRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userRef);
    
                let currentCount = 0;
                if (userDoc.exists()) {
                    currentCount = userDoc.data().scanCount || 0;
                }
    
                await setDoc(userRef, { scanCount: currentCount + 1 }, { merge: true });
                console.log("Scan count updated successfully");
    
                // Check if the scanned data matches the expected QR code value
                if (data === "VirtualCard://Activity") {
                    router.push('/Activity'); // Redirect to Activity.js
                }
            } catch (error) {
                console.error("Error updating scan count: ", error);
            }
        } else {
            console.error("User not authenticated");
        }
    };
    
    
  

    const goBack = async () => {
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

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <>
            <View style={styles.container}>
                <View style={{ marginRight: '80%', marginBottom: '40%' }}>
                    <AntDesign onPress={goBack} name="back" size={24} color="black" />
                </View>

                <View style={styles.barcodebox}>
                    <CameraView
                        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                        barcodeScannerSettings={{
                            barcodeTypes: ["qr", "pdf417"],
                        }}
                        style={StyleSheet.absoluteFillObject}
                    />
                </View>

                {/* Display the number of times the scanner has been used */}
                <Text style={styles.scanCountText}>Number of scans: {scanCount}</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    maintext: {
        fontSize: 16,
        margin: 20,
    },
    barcodebox: {
        height: 300,
        width: 300,
        overflow: 'hidden',
        borderRadius: 30,
        backgroundColor: 'tomato',
        marginBottom: '45%'
    },
    cooldownText: {
        fontSize: 18,
        color: 'red',
        marginTop: 10,
    },
});

export default QRcode;