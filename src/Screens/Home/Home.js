//import liraries
import React from 'react';
import { View, Text, StyleSheet, StatusBar, PermissionsAndroid } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import HomeCard from '../../Components/HomeCard';
import HomeCardTwo from '../../Components/HomeCardTwo';
import HomeCardThree from '../../Components/HomeCardThree';
import Banner from '../../Components/BannersAd/Banner';
import { useEffect, useState } from 'react';
import RNFS from 'react-native-fs';

import ErrorDialog from '../../Components/ErrorDialog';
import NetInfo from '@react-native-community/netinfo';


const Home = ({ navigation }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState('');

    const handleToggle = () => {
        navigation.openDrawer();
    }

    useEffect(() => {
        requestPermission();
        networkchecker();
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

    const networkchecker = () => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
            console.log("checking internet connection : " + state.isConnected);
        });

        return () => unsubscribe();
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

    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor="#deb018" barStyle="dark-content" />
            <CustomHeader title="SmartFlow" icon={"menu"} onPress={handleToggle} />
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
                {/* <HomeCard txt={'FeedBack'}
                    iconName='notebook-edit-outline'
                    iconColor={'#2A3BE2'}
                    iconBackgroundColor={"#CDCEE0"}
                    onPress={() => navigation.navigate("FeedBack")}
                /> */}


                <HomeCard txt={'Presentations'}
                    iconName='book-check-outline'
                    iconColor={'#2A3BE2'}
                    iconBackgroundColor={"#CDCEE0"}
                    onPress={() => handleNavigation("Presentations")}
                    topRightIconName={isConnected ? null : 'wifi-off'}
                />
            </View>
            <View >
                <HomeCardTwo txt={'Downloads'}
                    iconName='download'
                    iconColor={'#E28C20'}
                    iconBackgroundColor={"#ebeda8"}
                    onPress={() => navigation.navigate("Downloads")}
                />
            </View>

            { error && <ErrorDialog iconColor='black' textColor='black' iconName='wifi-off' error={error} onClose={() => setError('')} /> }


            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Banner />
            </View>

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
