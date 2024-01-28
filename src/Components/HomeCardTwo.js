
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

const { height, width } = Dimensions.get('window');

const HomeCardTwo = ({ iconName, txt, iconColor, iconBackgroundColor ,onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container,{ backgroundColor: iconBackgroundColor }]}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={iconName} size={40} color={iconColor} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{txt}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default HomeCardTwo;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: height / 5,
        width: width / 1.1,
        backgroundColor: '#fff',
        borderRadius: 20,
        elevation: 3,
        alignSelf:'center',
        marginTop:20
    },
    iconContainer: {
        position: 'absolute',
        top: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        padding: 5,
    },
    textContainer: {
        position: 'absolute',
        bottom: 20,
        borderRadius: 20,
        height: height / 24,
        width: width / 2.8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 22,
        color: '#000',
        fontWeight:'bold',
      
    },
});
