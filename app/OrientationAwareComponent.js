// OrientationAwareComponent.js
import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

export default function OrientationAwareComponent({ children }) {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    return (
        <View style={[styles.container, isLandscape && styles.containerLandscape]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    containerLandscape: {
        backgroundColor: 'lightblue',
    },
});
