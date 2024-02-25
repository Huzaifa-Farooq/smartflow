
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,StatusBar } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';


const CustomHeader = ({ title, icon, onPress }) => {
    console.log('====================================');
    console.log(title, icon, onPress);
    console.log('====================================');
    if (title === 'SmartFlow'){
        titleStyle = {
            ...styles.title,
            fontFamily: 'OldStandardTT-italic'
        }
    } else {
        titleStyle = {
            ...styles.title,
            fontWeight: 'bold'
        }
    }

    return (
        <View style={styles.Mainview}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onPress}  style={styles.IconContainer} >
                    <MaterialCommunityIcons name={icon} size={28} color='#000'  />
                </TouchableOpacity>

                
                <Text style={titleStyle}>
                    {title}
                </Text>
                    

                
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
    },
    IconContainer: {
        width: "16%",
        alignItems: 'center'
    }
});

export default CustomHeader;
