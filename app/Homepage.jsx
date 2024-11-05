import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native"; 
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect, } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"; 
import { db } from './Firebase'; 
import { getAuth } from 'firebase/auth';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; // Import responsive screen package
import LottieView from 'lottie-react-native';

export default function Homepage() {
    const [userRole, setUserRole] = useState(""); // State to store user role
    const [image, setImage] = useState(null);
    const [name, setName] = useState("no data sent");
    const [studentNumber, setStudentNumber] = useState("no data sent");
    const [timerCompleted, setTimerCompleted] = useState(false); // State to track 
    const [resetCount, setResetCount] = useState(0); // State to track the reset count
    const [isScannerPressed, setIsScannerPressed] = useState(false);


    useEffect(() => {
        const loadUserData = async () => {
            try {
                const auth = getAuth();
                const uid = auth.currentUser?.uid; 

                if (uid) {
                    const userDoc = await getDoc(doc(db, "users", uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        if (data.imageUrl) {
                            setImage(data.imageUrl);
                        }
                        setName(data.name || "no data sent");
                        setStudentNumber(data.studentNumber || "no data sent");
                        setUserRole(data.ifstudent || ""); // Load user role from Firebase
                    } else {
                        console.log("No such document!");
                    }
                }
            } catch (error) {
                console.error("Error loading user data from Firestore: ", error);
            }
        };
        loadUserData();
    }, []);

    const handleReturnHome = () => {
        if (userRole === 'Staff') {
            router.push('/Stafflanding');
        } else {
            router.push('/Landingpage');
        }
    };

    const uploadImageToFirebase = async (uri) => {
        try {
            const auth = getAuth();
            const uid = auth.currentUser?.uid;
    
            if (!uid) {
                console.error("No user is logged in.");
                return null;
            }
    
            const response = await fetch(uri);
            const blob = await response.blob();
    
            const storage = getStorage();
            if (!storage) {
                console.error("Firebase storage not initialized.");
                return null;
            }
    
            // Pass both storage and the path to `ref`
            const storageRef = ref(storage, `storage images/${uid}/profile-image`);
            
            await uploadBytes(storageRef, blob);
            console.log("Image uploaded to Firebase storage.");
    
            const downloadUrl = await getDownloadURL(storageRef);
            console.log("Download URL obtained:", downloadUrl);
    
            await setDoc(doc(db, "users", uid), { imageUrl: downloadUrl }, { merge: true });
            console.log("Image URL saved to Firestore.");
    
            return downloadUrl;
        } catch (error) {
            console.error("Error uploading image: ", error);
            return null;
        }
    };
    

    const pickImage = async () => {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
            Alert.alert('Permissions required', 'Camera and gallery permissions are required.');
            return;
        }
    
        Alert.alert(
            'Select Image',
            'Choose an option',
            [
                {
                    text: 'Take Photo',
                    onPress: async () => {
                        let result = await ImagePicker.launchCameraAsync({
                            allowsEditing: true,
                            aspect: [4, 3],
                            quality: 1,
                        });
    
                        if (!result.canceled) {
                            await handleImageUpdate(result.assets[0].uri);
                        }
                    },
                },
                {
                    text: 'Pick from Gallery',
                    onPress: async () => {
                        let result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [4, 3],
                            quality: 1,
                        });
    
                        if (!result.canceled) {
                            await handleImageUpdate(result.assets[0].uri);
                        }
                    },
                },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    const handleImageUpdate = async (uri) => {
        try {
            setImage(null); // Clear current image before updating
            const imageUrl = await uploadImageToFirebase(uri); // Upload new image
    
            if (imageUrl) {
                setImage(imageUrl); // Set new image URL in state
                await AsyncStorage.setItem('image', imageUrl); // Update AsyncStorage with new URL
            }
        } catch (error) {
            console.error("Error handling image update: ", error);
        }
    };
    
    

    const [animationStatus, setAnimationStatus] = useState('scanning');
    useEffect(() => {
        if (isScannerPressed) { 
            const timer = setTimeout(() => {
                setAnimationStatus('success'); 
                setTimerCompleted(true); 

                const resetTimer = setTimeout(async () => {
                    setResetCount((prevCount) => {
                        const newCount = prevCount + 1;
                        updateFirebaseTapCount(newCount); 
                        Alert.alert('Access Granted');
                        router.push('/Activity');
                        return newCount;
                    }); 
                    setAnimationStatus('scanning'); 
                }, 4000); 

                return () => clearTimeout(resetTimer); 
            }, 5000); 

            return () => clearTimeout(timer); 
        }
    }, [isScannerPressed]);


    const updateFirebaseTapCount = async () => {
        const auth = getAuth();
        const uid = auth.currentUser?.uid; 
    
        if (uid) {
            try {
                // Fetch the current tap count from Firestore
                const userDoc = await getDoc(doc(db, "users", uid));
                const currentCount = userDoc.exists() ? userDoc.data().tapCount || 0 : 0; // Default to 0 if it doesn't exist
                
                const newCount = currentCount + 1; // Increment the count
                
                await updateDoc(doc(db, "users", uid), { tapCount: newCount }); // Update tapCount in Firestore
                console.log("Tap count updated in Firestore:", newCount);
            } catch (error) {
                console.error("Error updating tap count in Firestore:", error);
            }
        }
    };



    return (
        <>
            <SafeAreaView>
            </SafeAreaView>

            <View style={styles.userInfoContainer}>
                <Text style={styles.userInfoText}>{name}</Text>
                <Text style={styles.userInfoText}>{studentNumber}</Text>
            </View>

            <View style={styles.containers}>
                <Text></Text>
            </View>

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.imagePickerContainer}>
                        <TouchableOpacity
                            onPress={pickImage}
                            style={styles.imagePicker}
                        >
                            {image ? (
                                <Image
                                    source={{ uri: image }}
                                    style={styles.image}
                                />
                            ) : (
                                <AntDesign name="camera" size={54} color="black" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
            {/* <TouchableOpacity onPress={() => setIsScannerPressed(true)}> */}

            <View style={styles.tapToEnterContainer}> 
            <TouchableOpacity onPress={() => setIsScannerPressed(true)}>
                {animationStatus === 'scanning' && (
                    <LottieView
                    source={require('./Scannerios.json')} 
                    autoPlay
                    loop
                    style={styles.animation}
                    />
                )}

                {animationStatus === 'success' && (
                    <LottieView
                    source={require('./Done.json')} 
                    autoPlay
                    loop={false} 
                    onAnimationFinish={() => {
                    setAnimationStatus('scanning'); 
                    }}
                    style={styles.animation}
                    />
                )}


                {timerCompleted && (
                    <Text style={styles.resetCountText}>
                        Timer reset count: {resetCount}
                    </Text>
                )}
            </TouchableOpacity>




            </View>

            <View style={styles.button}>
                <TouchableOpacity onPress={handleReturnHome} >
                    <Text style={styles.buttonText}>Return To Home</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    userInfoContainer: {
        backgroundColor: 'black',
        height: hp('30%'), // Responsive height
        borderRadius: 20,
        width: wp('90%'), // Responsive width
        marginLeft: wp('5%'),
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 20,
    },
    userInfoText: {
        color: 'white',
        fontSize: hp('3%'), // Responsive font size
    },
    containers: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        alignItems: "center",
        borderRadius: 20,
    },
    imagePickerContainer: {
        width: "55%",
        borderRadius: 20,
    },
    imagePicker: {
        height: hp('25%'), // Responsive height
        width: wp('40%'), // Responsive width
        borderRadius: 20,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        marginTop: -hp('35%'), // Adjust according to your layout
        marginLeft: wp('30%'), // Responsive margin
    },
    image: {
        width: '100%', // Responsive width
        height: '100%', // Responsive height
        borderRadius: 20,
    },
    logo: {
        height: hp('10%'), // Responsive height
        width: wp('20%'), // Responsive width
        borderRadius: 99,
        marginBottom: hp('7%'),
        marginRight: wp('20%'), // Responsive margin
    },
    tapToEnterText: {
        marginLeft: wp('20%'), // Responsive margin
        marginTop: hp('2%'), // Responsive margin
    },
    button: {
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        height: hp('7%'), // Responsive height
        width: wp('50%'), // Responsive width
        borderRadius: 22,
        marginTop: hp('5%'), // Responsive margin
        marginLeft: wp('25%'), // Responsive margin
    },
    buttonText: {
        fontSize: hp('2.5%'), // Responsive font size
        color: '#fff',
    },
    tapToEnterContainer: {
    marginBottom: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
  resetCountText: {
    color: 'whitesmoke',
    fontSize: hp('3%'), // Responsive font size
    marginBottom: hp('-5%'), // Responsive margin
},
}); 

