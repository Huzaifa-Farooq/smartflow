//import liraries
import React from 'react';
import { View, Text, StyleSheet,ImageBackground } from 'react-native';

// create a component
const SplashScreen = ({navigation}) => {

    // setTimeout(() => {
    //     navigation.navigate('Home')
    // }, 3000)


    return (
        <View style={styles.container}>

            <ImageBackground source={require('../../assets/Images/backGroundImage.jpg')} style={styles.imageBackground}
                resizeMode="cover">
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>SmartFlow</Text>
                    </View>

            </ImageBackground>

           
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
     
    },
    imageBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
        //  resizeMode: 'cover',
         

    },
    titleContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    title:{
        fontSize:40,
        color:'white',
        fontWeight:'bold',
        fontStyle:'italic'


    }
});

//make this component available to the app
export default SplashScreen;
