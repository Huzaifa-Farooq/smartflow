//import liraries
import React from 'react';
import { useEffect, useState } from 'react';
import { View, RefreshControl, StatusBar, PermissionsAndroid, ScrollView, Text } from 'react-native';
import RNFS from 'react-native-fs';

import CustomHeader from '../../Components/CustomHeader';
import HomeCard from '../../Components/HomeCard';
import HomeCardTwo from '../../Components/HomeCardTwo';
import Banner from '../../Components/BannersAd/Banner';
import SplashScreen from '../SplashScreen/SplashScreen';

import ErrorDialog from '../../Components/ErrorDialog';
import { checkServerConnection, generatePresentation } from '../../api/api.mjs';

import BackgroundFetch from "react-native-background-fetch";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadFiles } from '../../utils/utils.mjs';



const loadAndSavePPTDirectoryPaths = async () => {
    const files = await loadFiles({
        directoryPath: RNFS.ExternalStorageDirectoryPath,
        required_ext: ['.ppt', '.pptx'],
    });
    const directoryPaths = files.map(file => file.path.split('/').slice(0, -1).join('/'));
    const defaultDirectories = [
        RNFS.DownloadDirectoryPath + '/SmartFlow',
        RNFS.DocumentDirectoryPath,
        '/storage/emulated/0/WhatsApp/',
        '/Internal storage/Android/media/com.whatsapp/WhatsApp/',
        '/Internal storage/Android/media/com.whatsapp'
    ];
    directoryPaths.push(...defaultDirectories);
    // removing duplicates from directoryPaths
    const uniqueDirectoryPaths = [...new Set(directoryPaths)];

    try {
        // removing PPTDirectoryPaths
        await AsyncStorage.removeItem('@PPTDirectoryPaths');
        // adding directories to PPTDirectoryPaths
        await AsyncStorage.setItem('@PPTDirectoryPaths', JSON.stringify(uniqueDirectoryPaths));
    } catch (e) {
        console.log('Error saving PPTDirectoryPaths ' + e);
    }
}


let BackgroundFilesFetchTask = async (event) => {
    await loadAndSavePPTDirectoryPaths();
    BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
}

// Configuration
BackgroundFetch.configure(
    {
        minimumFetchInterval: 24 * 60,
        stopOnTerminate: false,
        enableHeadless: true,
        requiresBatteryNotLow: true,
        requiresCharging: false,
        requiresStorageNotLow: false,
        requiresNetworkConnectivity: false,
    },
    onTimeout = () => {
        console.log('BackgroundFetch timeout');
    },
    BackgroundFilesFetchTask
);

// Start the background fetch
BackgroundFetch.start();




const SCANNER_DOCUMENT_PATH = RNFS.DownloadDirectoryPath + '/SmartFlow/ScannerDocuments';

const Home = ({ navigation }) => {
    const [isConnected, setIsConnected] = useState(null);
    const [error, setError] = useState('');
    const [showSplash, setShowSplash] = useState(true);

    const handleToggle = () => {
        navigation.openDrawer();
    }

    useEffect(() => {
        AsyncStorage.getItem('@PPTDirectoryPaths')
            .then((value) => {
                if (value === null) {
                    // trigger BackgroundFilesFetchTask
                    BackgroundFilesFetchTask();
                } else {
                    console.log('PPTDirectoryPaths already exists. \n' + value);
                }
            })
            .catch((e) => {
                console.log('Error getting PDFDirectoryPaths ' + e);
            });

        RNFS.mkdir(SCANNER_DOCUMENT_PATH);
        // checkServerConnection((val) => { setIsConnected(val) })
        setIsConnected(true);

        setTimeout(() => {
            setShowSplash(false);
        }, 2500);

        setTimeout(() => {
            requestPermission();
        }, 500);
    }, []);

    const requestPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission',
                    message: 'Apps need to access storage ',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            console.log('====================================');
            console.log(granted);
            console.log('====================================');
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                createfolder();
            } else {
                console.log('Storage permission denied');
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

    const createfolder = async () => {
        const folder = RNFS.DownloadDirectoryPath + '/SmartFlow/';
        RNFS.mkdir(folder).then(res => {
            console.log('folder created');
        }).catch(error => {
            console.log(error);
        })
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
                        onPress={() => navigation.navigate("Templates")}
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

export default Home;
