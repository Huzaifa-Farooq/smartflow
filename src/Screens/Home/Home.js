//import liraries
import React from 'react';
import { useEffect, useState } from 'react';
import { View, RefreshControl, StatusBar, PermissionsAndroid, ScrollView, Text } from 'react-native';
import RNFS from 'react-native-fs';

import CustomHeader from '../../Components/CustomHeader';
import HomeCard from '../../Components/HomeCard';
import Banner from '../../Components/BannersAd/Banner';
import SplashScreen from '../SplashScreen/SplashScreen';

import ErrorDialog from '../../Components/ErrorDialog';
import { checkServerConnection, generatePresentation } from '../../api/api.mjs';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadFiles } from '../../utils/utils.mjs';
import '../../utils/global.js';

import { Linking, Alert } from 'react-native'; // Import Alert from 'react-native'
import VersionCheck from 'react-native-version-check';

import OpenCV from '../../../modules/opencv/OpenCV';


RNFS.readDir(RNFS.DownloadDirectoryPath).then((result) => {
    result.forEach((file) => {
        if (file.isFile() && file.name.endsWith('.jpg')) {
            console.log(file.name);
            RNFS.readFile(file.path, 'base64').then((res) => {
                OpenCV.checkForBlurryImage(res, (r) => { console.log(r) }, (r) => { console.log(r) });
            });
        }
    })
}).catch((err) => {
    console.log(err)
})


const Home = ({ navigation }) => {
    const [isConnected, setIsConnected] = useState(null);
    const [error, setError] = useState('');
    const [showSplash, setShowSplash] = useState(true);

    const handleToggle = () => {
        navigation.openDrawer();
    }

    useEffect(() => {
        checkAppVersion();
    }, []);

    useEffect(() => {
        checkServerConnection((val) => { setIsConnected(val) })

        setTimeout(() => {
            setShowSplash(false);
            setTimeout(() => {
                requestPermission();
            }, 500);
        }, 2500);
    }, []);

    const requestPermission = async () => {
        try {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission',
                    message: 'Apps need to access storage (optional).',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            console.log('====================================');
            console.log(result);
            console.log('====================================');
            if (result === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Storage Permission Granted.');
            } else if (result === PermissionsAndroid.RESULTS.DENIED) {
                console.log('Storage Permission Denied.');
            } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                console.log('Storage Permission Denied with Never Ask Again.');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const handleNavigation = (path) => {
        if (isConnected) {
            navigation.navigate(path);
        } else if (!isConnected) {
            setError("No internet connection");
        }
    };

    if (showSplash) {
        return (
            <SplashScreen />
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor="#deb018" barStyle="dark-content" />
            <CustomHeader title="SmartFlow" icon={"menu"} onPress={handleToggle} />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        tintColor="#deb018"
                        onRefresh={() => { checkServerConnection((val) => { setIsConnected(val) }) }}
                        refreshing={false}
                    />
                }
            >
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 20
                }}>
                    <HomeCard txt={'Notes'}
                        imageSource={require('../../assets/Images/Notes.png')}
                        iconColor={'#09C3B6'}
                        iconBackgroundColor={"#bfe0dd"}
                        onPress={() => handleNavigation("Notes")}
                        topRightIconName={isConnected ? null : 'wifi-off'}
                    />
                    <HomeCard txt={'Assignments'}
                        // iconName='bookmark-multiple-outline'
                        imageSource={require('../../assets/Images/Assignment.png')}
                        iconColor={'#0BDA0B'}
                        iconBackgroundColor={"#c9f2ca"}
                        onPress={() => handleNavigation("Assignments")}
                        topRightIconName={isConnected ? null : 'wifi-off'}
                    />
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 20
                }}>
                    <HomeCard txt={'PDF Merger'}
                        imageSource={require('../../assets/Images/PdfMerge.png')}
                        iconColor={'#PdfMerge60FB7'}
                        iconBackgroundColor={"#E2D0DE"}
                        onPress={() => { navigation.navigate("PDFMerge") }}
                    />
                    <HomeCard txt={'Presentation'}
                        imageSource={require('../../assets/Images/Presentation.png')}
                        iconColor={'#E28C20'}
                        iconBackgroundColor={"#F8BBD0"}
                        onPress={() => handleNavigation("Templates")}
                        topRightIconName={isConnected ? null : 'wifi-off'}
                    />

                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 20
                }}>
                    <HomeCard txt={'Scanner'}
                        // iconName='camera-document'
                        imageSource={require('../../assets/Images/Scanning.png')}
                        iconColor={'#2A3BE2'}
                        iconBackgroundColor={"#CDCEE0"}
                        onPress={() => navigation.navigate("Scanner")}
                    />
                    <HomeCard txt={'My Files'}
                        iconName='file-document'
                        iconColor={'#E28C20'}
                        iconBackgroundColor={"#ebeda8"}
                        onPress={() => navigation.navigate("Downloads")}
                    />
                </View>
                <Text></Text>
            </ScrollView>

            {error && <ErrorDialog iconColor='black' textColor='black' iconName='wifi-off' error={error} onClose={() => setError('')} />}

            <Banner />

        </View>
    );
};


const checkAppVersion = async () => {
    const packageName = 'com.smartflow';
    try {
        const latestVersion = await VersionCheck.getLatestVersion({
                provider: 'playStore',
                packageName: packageName,
                ignoreErrors: true,
            });

        console.log('Latest version  ', latestVersion)

        const currentVersion = VersionCheck.getCurrentVersion();

        if (latestVersion > currentVersion) {
            const url = await VersionCheck.getStoreUrl({ packageName: packageName });
            Alert.alert(
                'Update Required',
                'A new version of the app is available. Please update to continue using the app.',
                [
                    {
                        text: 'Update Now',
                        onPress: () => { Linking.openURL(url) },
                    },
                ],
                { cancelable: false }
            );
        } else {
            // App is up-to-date; proceed with the app
        }
    } catch (error) {
        // Handle error while checking app version
        console.error('Error checking app version:', error);
    }
};


export default Home;
