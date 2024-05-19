import { StyleSheet, Image, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';

import FastImage from 'react-native-fast-image';


const { height, width } = Dimensions.get('window');

const TemplateItem = ({ imageSource, txt, iconBackgroundColor, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            underlayColor={''}
            style={[styles.container, { backgroundColor: iconBackgroundColor }]}
        >
            <View style={styles.iconContainer}>
                <MyImageComponent imageSource={imageSource} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{txt}</Text>
            </View>
        </TouchableOpacity>
    );
};

const MyImageComponent = ({ imageSource }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <FastImage
            source={{ uri: imageSource }}
            style={styles.image}
            cache='force-cache'
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
            {isLoading && <ActivityIndicator size="large" color="#9c9a9a" />}
            </View>
        </FastImage>
    );
};

export default TemplateItem;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: height / 5.4,
        width: width / 2.3,
        borderRadius: 10,
        elevation: 3,
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        marginHorizontal: 3,
    },
    iconContainer: {
        position: 'absolute',
        top: 10,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        borderRadius: 15,
        padding: 2,
        elevation: 3
    },
    textContainer: {
        position: 'absolute',
        bottom: 5,
        borderRadius: 20,
        height: height / 24,
        width: width / 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 18,
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