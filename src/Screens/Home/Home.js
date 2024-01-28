//import liraries
import React from 'react';
import { View, Text, StyleSheet, StatusBar, PermissionsAndroid } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import HomeCard from '../../Components/HomeCard';
import HomeCardTwo from '../../Components/HomeCardTwo';
import HomeCardThree from '../../Components/HomeCardThree';
import Banner from '../../Components/BannersAd/Banner';
import { request, PERMISSIONS } from 'react-native-permissions';
import { useEffect } from 'react';
import RNFS from 'react-native-fs';

import { DocumentView } from '../../Components/DocumentItem';


const Home = ({ navigation }) => {
    const handleToggle = () => {
        navigation.openDrawer();
    }
    useEffect(() => {
        requestPermission();

    }, []);
    const requestPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission',
                    message:
                        'Apps need to access storage ',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                createfolder();
            } else {
                console.log('Storage permission denied');
            }
        } catch (err) {
            console.warn(err);
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
                    onPress={() => navigation.navigate("Notes")}
                />
                <HomeCard txt={'Assignments'}
                    iconName='bookmark-multiple-outline'
                    iconColor={'#0BDA0B'}
                    iconBackgroundColor={"#c9f2ca"}
                    onPress={() => navigation.navigate("Assignments")}
                />


            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 20
            }}>
                <HomeCard txt={'Quiz'}
                    iconName='checkbox-marked-circle-outline'
                    iconColor={'#E60FB7'}
                    iconBackgroundColor={"#E2D0DE"}
                    onPress={() => { }}
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
                    onPress={() => navigation.navigate("Presentations")}
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
