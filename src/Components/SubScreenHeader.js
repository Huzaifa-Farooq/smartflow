
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,StatusBar } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';


export default SubScreenHeader = ({ title, icon, onPress, titleElement }) => {
    return (
        <View style={styles.Mainview}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onPress}  style={styles.IconContainer} >
                    <MaterialCommunityIcons name={icon} size={28} color='#000'  />
                </TouchableOpacity>
                
                {
                    title ? <Text style={styles.title}>{title}</Text> : titleElement
                }
            </View>
        </View>
       

    );
};

const styles = StyleSheet.create({
    Mainview: {
        backgroundColor: '#deb018',
        justifyContent: 'center',
        height: 60
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        color: 'black',
        width: '65%',
        textAlign: 'center',
        marginLeft: 10,
        fontFamily: 'ProximaNova-Regular',
    },
    IconContainer: {
        width: "16%",
        alignItems: 'center'
    }
});
