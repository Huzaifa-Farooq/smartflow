
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,StatusBar } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';


const CustomHeader = ({ title,icon,onPress }) => {

    return (
        
        <View style={styles.Mainview}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onPress}  style={styles.IconContainer} >
                    <MaterialCommunityIcons name={icon} size={36} color='#000'  />
                </TouchableOpacity>

                <Text style={styles.title}>{title}</Text>
            </View>
        </View>
       

    );
};

const styles = StyleSheet.create({
    Mainview: {
        backgroundColor: '#deb018',
        justifyContent: 'center',
        height: 80
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        color: 'black',
        width: '65%',
        textAlign: 'center',
        fontWeight:'bold'
    },
    IconContainer: {
        width: "16%",
        alignItems: 'center'
    }
});

export default CustomHeader;
