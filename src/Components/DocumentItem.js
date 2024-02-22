import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';


export const DocumentItem = ({ iconSrc, title, size, selected, selectedNumber }) => {
    return (
        <View style={styles.container}>
            <View style={styles.fileInfoContainer}>
            <View style={styles.iconContainer}>
                <Image source={iconSrc} style={styles.icon} />
            </View>
            <View style={styles.textContainer}>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.title}>{title}</Text>
                <Text style={styles.size}>{size}</Text>
            </View>
            </View>
            {
                (selected && selectedNumber) && (
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <View 
                            style={{ 
                                ...styles.iconContainer, 
                                borderRadius: 100,
                                backgroundColor: '#00B0F0',
                                width: 20, 
                                height: 20,
                            }}>
                            <Text style={{ color: '#fff' }}>{selectedNumber}</Text>
                            </View>
                    </View>
                )
            }
        </View>
    );
}

styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        margin: 5,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 5,
    },
    fileInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%'
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 30,
        height: 30,
    },
    textContainer: {
        marginLeft: 10,
        width: '80%'
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#777777'
    },
    size: {
        fontSize: 11,
        color: '#777777'
    },


});
