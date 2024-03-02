//import libraries
import CustomHeader from '../../Components/CustomHeader';
import { StyleSheet, View, TouchableHighlight, Animated, RefreshControl } from 'react-native';
import { React, useState, useEffect, useRef } from 'react';
import RNFS from 'react-native-fs'
import Banner from '../../Components/BannersAd/Banner';

import FilesListComponent from '../../Components/FilesList';



const Downloads = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <CustomHeader 
                title={'Downloads'}
                icon={"keyboard-backspace"}
                onPress={() => navigation.goBack()}
            />
            <FilesListComponent
                navigation={navigation}
                directory={RNFS.DownloadDirectoryPath + '/SmartFlow'}
            />
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Banner />
            </View>
        </View>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});


export default Downloads;
