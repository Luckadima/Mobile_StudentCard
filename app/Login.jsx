import React, { useState, useContext } from "react";
import { Text, View, StyleSheet, Image, Pressable, TextInput, Modal, Button, ImageBackground } from "react-native";
import Fontisto from '@expo/vector-icons/Fontisto';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { firebase_auth } from "./Firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./Firebase";
import { usercontext } from './Context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; // Responsive screen
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { getAuth } from 'firebase/auth'; // Import Auth functions

function Login() {
    const router = useRouter();
    const { setuser, setusers } = useContext(usercontext);

    // <Text style={{ fontSize: 24, fontWeight: 'bold', margin: 10,  marginLeft:'25%'}}>Enter credentials</Text>
    // </View>

    // State for login and signup
    const [name, setname] = useState('');
    const [studentnumber, setstudentnumber] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [newemail, setnewemail] = useState('');
    const [newpassword, setnewpassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Modal and error handling
    const [modalVisible, setModalVisible] = useState(false);
    // const [newmodalVisible, newsetmodalVisible] = useState(false);
    // // const [adname, setadname] = useState('');
    // // const [adpassword, setadpassword] = useState('');
    // const [errorMessage, setErrorMessage] = useState('');
    const [ifstudent , setifstudent] = useState('');

    // Toggle password visibility
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handlesend = () => {
        setuser(name);
        setusers(studentnumber);
    };


    const QRCodeGenerator = () => {
        router.push('/QRCodeGenerator')
    }




    const Signin = async () => {
        try {
            // Attempt to sign in with email and password
            const response = await signInWithEmailAndPassword(firebase_auth, newemail, newpassword);
            console.log('User signed in:', response.user);
    
            // Get the user's ID and check their ifstudent status
            const userDoc = await getDoc(doc(db, "users", response.user.uid)); // Use the signed-in user's UID
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const isStudent = userData.ifstudent;
    
                if (isStudent === 'Student') {
                    // If the user is a staff member, redirect to Stafflanding
                    router.push('/Landingpage');
                } else {
                    // Show alert for invalid user role
                    alert("Invalid user role. You are not a student.");
                    console.log("Invalid user role.");
                    // Optionally log out the user or redirect to login
                    await firebase_auth.signOut(); // Sign out the user
                }
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.log(error);
            alert('Sign-in failed: ' + error.message);
        }
    };
    
    
    
    
    
    
    
    

    const Signup = async () => {
        try {
            const response = await createUserWithEmailAndPassword(firebase_auth, email, password);
            const userId = response.user.uid;

            await setDoc(doc(db, "users", userId), {
                name: name,
                studentNumber: studentnumber,
                email: email,
                ifstudent:ifstudent
            });

            handlesend();
            setModalVisible(false);
            router.push('./Login');
        } catch (error) {
            console.log(error);
            alert('Sign-up failed: ' + error.message);
        }
    };

    // const Admins = () => {
    //     if (adname.toLowerCase() !== 'admin' || adpassword !== 'admin') {
    //         setErrorMessage('Invalid admin credentials. Please try again.');
    //     } else {
    //         setadname('');
    //         setadpassword('');
    //         setErrorMessage('');
    //         router.push('/AdminLogin');
    //     }
    // };

    

    return (
        <ImageBackground style={styles.background} source={require('../assets/images/background-images.jpg')}>
            {/* Sign Up Modal */}
            <Modal 
                animationType="slide" 
                transparent={true} 
                visible={modalVisible} 
                onRequestClose={() => setModalVisible(false)}
            >
                <GestureHandlerRootView style={styles.modalContainer}>
                    <PanGestureHandler
                        onEnded={() => setModalVisible(false)}
                    >
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>Enter credentials</Text>
                            <TextInput 
                                value={name} 
                                onChangeText={setname} 
                                placeholder="Initials & Surname" 
                                placeholderTextColor='black'
                                style={styles.input}
                            />
                            <TextInput 
                                value={studentnumber} 
                                onChangeText={setstudentnumber} 
                                placeholder="Student Number" 
                                placeholderTextColor='black'
                                style={styles.input}
                            />
                            <TextInput 
                                value={email} 
                                onChangeText={setemail} 
                                placeholder="Email" 
                                placeholderTextColor='black'
                                style={styles.input}
                            />
                            <TextInput 
                                secureTextEntry={true} 
                                value={password} 
                                onChangeText={setpassword} 
                                placeholder="Password" 
                                placeholderTextColor='black'
                                style={styles.input}
                            />
                            <TextInput 
                                secureTextEntry={true} 
                                value={ifstudent} 
                                onChangeText={setifstudent} 
                                placeholder="Student or Staff?" 
                                placeholderTextColor='black'
                                style={styles.input}
                            />
                            <Button title="Save" onPress={Signup} />
                        </View>
                    </PanGestureHandler>
                </GestureHandlerRootView>
            </Modal>

            {/* Admin Modal */}
            {/* <Modal 
                animationType="slide" 
                transparent={true} 
                visible={newmodalVisible} 
                onRequestClose={() => newsetmodalVisible(false)}
            >
                <GestureHandlerRootView style={styles.modalContainer}>
                    <PanGestureHandler
                        onEnded={() => newsetmodalVisible(false)}
                    >
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>Enter Admin Info</Text>
                            <TextInput 
                                value={adname} 
                                onChangeText={setadname} 
                                placeholder="Admin Name" 
                                placeholderTextColor='black'
                                style={styles.input}
                            />
                            <TextInput 
                                value={adpassword} 
                                onChangeText={setadpassword} 
                                placeholder="Admin Password"
                                placeholderTextColor='black' 
                                style={styles.input}
                            />
                            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                            <Button title="Submit" onPress={Admins} />
                        </View>
                    </PanGestureHandler>
                </GestureHandlerRootView>
            </Modal> */}

            {/* Main Login Section */}
            <View style={styles.loginBox}>
                <Image 
                    style={styles.loginImage} 
                    source={require('../assets/images/login picture.jpg')}
                />

                <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop:'10%'}}>Enter credentials</Text>
                
                <View style={styles.inputRow}>
                    <MaterialCommunityIcons name="email-edit" size={16} color="black" />
                    <TextInput 
                        value={newemail}
                        onChangeText={setnewemail}
                        placeholder="Enter your Email"
                        placeholderTextColor='black'
                        style={styles.textInput}
                    />
                </View>

                <View style={styles.inputRow}>
                    <Fontisto name="locked" size={15} color="black" style={styles.icon} />
                    <TextInput 
                        secureTextEntry={!showPassword}
                        value={newpassword}
                        onChangeText={setnewpassword}
                        placeholder="Enter your password"
                        placeholderTextColor='black'
                        style={styles.textInput}
                    />
                    <MaterialCommunityIcons 
                        name={showPassword ? 'eye-off' : 'eye'} 
                        size={25} 
                        color="#aaa" 
                        style={styles.eyeIcon} 
                        onPress={toggleShowPassword}
                    />
                </View>

                <Text style={styles.signupText} onPress={() => setModalVisible(true)}>Signup if you haven't already</Text>
                {/* <Text style={styles.adminText} onPress={() => newsetmodalVisible(true)}>Admin?</Text> */}

                <Pressable style={styles.loginButton} onPress={Signin}>
                    <Text style={styles.loginButtonText}>LOGIN</Text>
                </Pressable>
            </View>
        </ImageBackground>


        
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
    },
    modalView: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: hp('10%'),
        padding: 20,
    },
    modalTitle: {
        fontSize: wp('6%'),
        fontWeight: 'bold',
        marginTop: hp('-2%'),
    },
    input: {
        borderColor: 'gray',
        borderWidth: 2,
        width: wp('70%'),
        height: hp('6%'),
        marginVertical: hp('2%'),
        paddingHorizontal: wp('3%'),
        borderRadius: 8,
       
    },
    errorText: {
        color: 'red',
        marginTop: hp('1%'),
    },
    loginBox: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: wp('85%'),
        height: hp('80%'),
        alignItems: 'center',
    },
    loginImage: {
        width: '100%',
        height: hp('10%'),
        borderTopLeftRadius: 9,
        borderTopRightRadius: 9,
    },
    inputRow: {
        flexDirection: 'row',
        marginVertical: hp('-1%'),
        alignItems: 'center',
        width: '90%',
        marginTop: hp('5%'),
    },
    textInput: {
        flex: 1,
        backgroundColor: '#f3f3f3',
        borderRadius: 8,
        height: hp('6%'),
        paddingHorizontal: wp('3%'),
        marginLeft: wp('2%'),
        
    },
    eyeIcon: {
        marginLeft: wp('2%'),
    },
    signupText: {
        textDecorationLine: 'underline',
        color: 'black',
        marginTop: hp('8%'),
    },
    adminText: {
        textDecorationLine: 'underline',
        color: 'black',
        marginTop: hp('3%'),
    },
    loginButton: {
        backgroundColor: 'black',
        borderRadius: 8,
        paddingVertical: hp('2%'),
        width: '80%',
        alignItems: 'center',
        marginTop: hp('5%'),
    },
    loginButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Login;