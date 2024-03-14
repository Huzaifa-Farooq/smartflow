//import liraries
import React from 'react';
import { useEffect, useState } from 'react';
import { View, RefreshControl, StyleSheet, StatusBar, PermissionsAndroid, ScrollView, Text } from 'react-native';
import RNFS from 'react-native-fs';

import CustomHeader from '../../Components/CustomHeader';
import HomeCard from '../../Components/HomeCard';
import HomeCardTwo from '../../Components/HomeCardTwo';
import Banner from '../../Components/BannersAd/Banner';
import SplashScreen from '../SplashScreen/SplashScreen';

import ErrorDialog from '../../Components/ErrorDialog';
import { checkServerConnection } from '../../api/api.mjs';


const SCANNER_DOCUMENT_PATH = RNFS.DownloadDirectoryPath + '/SmartFlow/ScannerDocuments';

const Home = ({ navigation }) => {
    const [isConnected, setIsConnected] = useState(null);
    const [error, setError] = useState('');
    const [showSplash, setShowSplash] = useState(true);

    const handleToggle = () => {
        navigation.openDrawer();
    }

    useEffect(() => {
        RNFS.mkdir(SCANNER_DOCUMENT_PATH);
        checkServerConnection((val) => { setIsConnected(val) })

        setTimeout(() => {
            setShowSplash(false);
        }, 2500);

        if (!showSplash) {
            // execute function after 1 second
            setTimeout(() => {
                requestPermission();
            }, 500);
        }
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
        console.log('====================================');
        console.log(isConnected);
        console.log('====================================');
        if (isConnected) {
            navigation.navigate(path);
        } else if (!isConnected) {
            setError("No internet connection");
        }
    };

    const createfolder = async () => {
        const file = RNFS.DownloadDirectoryPath + '/SmartFlow/';
        RNFS.mkdir(file).then(res => {
            console.log('folder created');
            console.log(RNFS.DownloadDirectoryPath + '/SmartFlow/');
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
                        iconName='book-open-page-variant-outline'
                        iconColor={'#09C3B6'}
                        iconBackgroundColor={"#bfe0dd"}
                        onPress={() => handleNavigation("Notes")}
                        topRightIconName={isConnected ? null : 'wifi-off'}
                    />
                    <HomeCard txt={'Assignments'}
                        iconName='bookmark-multiple-outline'
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
                    <HomeCard txt={'PDFMerger'}
                        iconName='file-document-multiple'
                        iconColor={'#E60FB7'}
                        iconBackgroundColor={"#E2D0DE"}
                        onPress={() => { navigation.navigate("PDFMerge") }}
                    />

                    <HomeCard txt={'Scanner'}
                        iconName='camera-document'
                        iconColor={'#2A3BE2'}
                        iconBackgroundColor={"#CDCEE0"}
                        onPress={() => navigation.navigate("Scanner")}
                    />
                </View>
                <View >
                    <HomeCardTwo txt={'My Files'}
                        iconName='download'
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

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Home;
