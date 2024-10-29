import { View, StyleSheet, Animated, useWindowDimensions, Text } from 'react-native'
import React from 'react'
import { router } from 'expo-router';

export default function Navslide({ data , scrollX }) {
    // const Login = () => {
    //     router.push("/Login")
    //   };

      const Plan = () => {
        router.push("/Plan")
      };



    const { width } = useWindowDimensions();
  return (
    <>
    <View style={{flexDirection:'row', height: 64}}>
      {data.map((_, i) => {
        const inputRange = [(i-1) * width, i * width, (i+1) * width];

        const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10,20,10],
            extrapolate: 'clamp',
        });



        return <Animated.View style={[styles.dot, { width: dotWidth } ]} key={i.toString()} />
      })}

    </View>

      <Text onPress={Plan} style={{marginLeft:'80%', marginBottom: '15%', fontSize: 18, color: "black"}}> Skip</Text>

      </>
  )
}

const styles = StyleSheet.create({
    dot:{
        height: 10,
        borderRadius: 5,
        backgroundColor: 'black',
        marginHorizontal: 8,
        marginTop: 80
    }

})