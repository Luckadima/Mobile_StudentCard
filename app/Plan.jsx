import React, { useRef } from "react";
import { ImageBackground, Pressable, StyleSheet, Text, Animated } from "react-native";
import { router } from "expo-router";

export default function Plan() {
    const scaleValue1 = useRef(new Animated.Value(1)).current; // Scale for the first Pressable
    const scaleValue2 = useRef(new Animated.Value(1)).current; // Scale for the second Pressable

    const handlePressIn = (scaleValue) => {
        Animated.spring(scaleValue, {
            toValue: 1.1, // Scale up to 110%
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = (scaleValue) => {
        Animated.spring(scaleValue, {
            toValue: 1, // Scale back to original size
            useNativeDriver: true,
        }).start();
    };

    const handleLogin = () => {
        router.push("/Login");
    };

    const Stafflogin = () => {
        router.push('/Stafflogin')
    }

    return (
        <>
            <ImageBackground style={styles.background} source={require('../assets/images/background-images.jpg')}>
                {/* First Pressable (STAFF) */}
                <Animated.View style={{ transform: [{ scale: scaleValue1 }] }}>
                    <Pressable
                        onPress={Stafflogin} // Pass 'staff' role
                        onPressIn={() => handlePressIn(scaleValue1)}
                        onPressOut={() => handlePressOut(scaleValue1)}
                        style={styles.pressable1}
                    >
                        <Text style={styles.text1}>STAFF</Text>
                    </Pressable>
                </Animated.View>

                {/* Second Pressable (STUDENT) */}
                <Animated.View style={{ transform: [{ scale: scaleValue2 }] }}>
                    <Pressable
                        onPress={handleLogin} // Pass 'student' role
                        onPressIn={() => handlePressIn(scaleValue2)}
                        onPressOut={() => handlePressOut(scaleValue2)}
                        style={styles.pressable2}
                    >
                        <Text style={styles.text2}>STUDENT</Text>
                    </Pressable>
                </Animated.View>
            </ImageBackground>
        </>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressable1: {
        backgroundColor: 'black', width: 300, height: '40%', marginTop: '50%', borderRadius: 30
    },
    pressable2: {
        backgroundColor: 'black', width: 300, height: '50%', marginBottom: '15%', borderRadius: 30
    },
    text1: {
        fontSize: 50, marginLeft: '27%', marginTop: '24%', color: 'white'
    },
    text2: {
        fontSize: 50, marginLeft: '15%', marginTop: '25%', color: 'white'
    }
});





