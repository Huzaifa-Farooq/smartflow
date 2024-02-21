//import liraries
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';
import AnimatedIcon from '../../Components/AnimatedIcon';
import Video from 'react-native-video';


// create a component
const SplashScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <Video
                source={require('../../assets/videos/splash.mp4')} // Replace with the path to your video file
                style={styles.backgroundVideo}
                muted={true}
                repeat={false}
                resizeMode={'cover'}
                rate={1.0}
                ignoreSilentSwitch={'obey'}
            />
        </View>);

    return (
        <View style={styles.container}>
            <AnimatedIcon name='splashScreen' style={{ width: 360, height: 360 }} />
        </View>
    );

    const [logoOpacity] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();
    }, []);



    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../../assets/Images/splash.png')}
                style={{ width: '100%', height: '100%', opacity: logoOpacity, resizeMode: 'cover' }}
            />
        </View>
    );
};

// cetnering and fitting the image in the screen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },

    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});

//make this component available to the app
export default SplashScreen;
