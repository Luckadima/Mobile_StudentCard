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
    const [cooldown, setCooldown] = useState(0); // Timer state for cooldown
    const [scanCount, setScanCount] = useState(0); // Counter state for scans
    const cooldownDuration = 5; // Cooldown duration in seconds
  
    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };

        getCameraPermissions();
    }, []);

    // Countdown timer for scanner
    useEffect(() => {
        let interval;
        if (scanned && cooldown > 0) {
            interval = setInterval(() => {
                setCooldown((prevCooldown) => prevCooldown - 1);
            }, 1000);
        } else if (cooldown === 0 && scanned) {
            setScanned(false); // Re-enable scanning after cooldown
        }

        return () => clearInterval(interval); // Clear interval on unmount
    }, [scanned, cooldown]);

    // Reset cooldown and scanned state when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            if (cooldown > 0) {
                setScanned(true); // Ensure scanned is true if there's an active cooldown
            }
        }, [cooldown])
    );

    const handleBarcodeScanned = async ({ type, data }) => {
      setScanned(true);
      setCooldown(cooldownDuration); // Start cooldown
      setScanCount(prevCount => prevCount + 1); // Increment the scan counter
      alert(`Scanned data: ${data}`);
  
      const userId = firebase_auth.currentUser?.uid; // Dynamically get the current user's UID
      if (userId) {
          try {
              const userRef = doc(db, 'users', userId);
              const userDoc = await getDoc(userRef); // Retrieve the document for the user
  
              let currentCount = 0; // Default to 0 if no existing document
              if (userDoc.exists()) {
                  currentCount = userDoc.data().scanCount || 0; // Get current scan count or default to 0
              }
  
              // Update the scan count in Firestore
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
                    if (role === 'staff') {
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
                
                {scanned && cooldown > 0 && (
                    <Text style={styles.cooldownText}>Please wait {cooldown} seconds to scan again</Text>
                )}

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