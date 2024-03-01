
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';


const { height, width } = Dimensions.get('window');

const HomeCard = ({ iconName, txt, iconColor, iconBackgroundColor, onPress, topRightIconName }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container,{ backgroundColor: iconBackgroundColor }]}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={iconName} size={40} color={iconColor} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{txt}</Text>
            </View>
            {topRightIconName && (
                <View style={styles.topRightIconContainer}>
                    <MaterialCommunityIcons name={topRightIconName} size={20} color={iconColor} />
                </View>
            )}

        </TouchableOpacity>
    );
};

export default HomeCard;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: height / 5,
        width: width / 2.3,
        backgroundColor: '#fff',
        borderRadius: 20,
        elevation: 3,
       
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
        width: width / 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        color: '#000',
        // fontWeight:'bold',
        fontFamily: 'ProximaNova-Regular',
        
    },
    topRightIconContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
