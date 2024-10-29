import { Text, View, StyleSheet, FlatList, Animated} from "react-native";
import React, { useRef, useState } from "react";
import Navslide from '@/Components/Navslide'
import Slides from '../Sildes'
import OnboardingItems  from './Onboardingitems';
import Sildes from "../Sildes";
export default function Onboarding() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollX = useRef(new Animated.Value(0)).current;

    const viewableItemsChanged = useRef(({ viewableItems }) =>{
        setCurrentIndex(viewableItems[0].index)
    }).current;

    
  return (
    <View style={styles.container} >
    <View style={{flex: 3}}>
        <FlatList data={Slides} renderItem={({ item })=> <OnboardingItems item={item}/>}
            horizontal
            showsHorizontalScrollIndicator= {false}
            pagingEnabled
            bounces={false}
            keyExtractor={(item) => item.id}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX}}}],{
                useNativeDriver: false,
            })}

            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChanged}

        />
        </View>

        <Navslide data={Sildes} scrollX={scrollX}/>
    </View> 
  );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems:'center'
    }
})