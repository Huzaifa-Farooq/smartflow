
import { StyleSheet, Image, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';


const { height, width } = Dimensions.get('window');

const TemplateItem = ({ imageSource, txt, iconBackgroundColor, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: iconBackgroundColor }]}>
            <View style={styles.iconContainer}>
                <Image 
                    source={{ uri: imageSource }}
                    style={styles.image} 
                    cache='force-cache'
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{txt}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default TemplateItem;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: height / 5.4,
        width: width / 2.19,
        backgroundColor: '#fff',
        borderRadius: 20,
        elevation: 3,
        marginBottom: 10,
        marginTop: 10,
        marginHorizontal: 3

    },
    iconContainer: {
        position: 'absolute',
        top: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        // borderColor:'black',
        padding: 2,
        elevation: 3

    },
    textContainer: {
        position: 'absolute',
        bottom: 10,
        borderRadius: 20,
        height: height / 24,
        width: width / 3,
        alignItems: 'center',
        justifyContent: 'center',

    },
    text: {
        fontSize: 20,
        color: '#000',
        fontFamily: 'ProximaNova-Regular',
        marginTop: 5

    },
    topRightIconContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        height: height / 9.5,
        width: width / 2.45,
    }
});
