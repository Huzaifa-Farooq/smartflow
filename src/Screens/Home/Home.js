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
import FileSelectButton from '../../Components/FileSelectButton';

import { pdfMerge } from '../../utils/pdfMerge';


import { PDFDocument } from 'pdf-lib';
import RNFetchBlob from 'rn-fetch-blob';
import { Buffer } from 'buffer';

// merging pdfs
const createPdf = async () => {
    const pdfFiles = ['/storage/emulated/0/Download/Smartflow/lecture_19.pdf', '/storage/emulated/0/Download/Smartflow/lecture_19.pdf'];

    // loading pdfs
    const pdf1 = await PDFDocument.load(await RNFetchBlob.fs.readFile(pdfFiles[0], 'base64'));
    const pdf2 = await PDFDocument.load(await RNFetchBlob.fs.readFile(pdfFiles[1], 'base64'));
    // // merging both pdfs
    const pdf = await PDFDocument.create();

    // first adding all pages of first pdf
    const pages1 = await pdf.copyPages(pdf1, pdf1.getPageIndices());
    [pdf1, pdf2].forEach(async (pdf) => {
        const pages = await pdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => {
            pdf.addPage(page);
        });
    });
    
    pages1.forEach(page => {
        pdf.addPage(page);
    });
    // then adding all pages of second pdf
    const pages2 = await pdf.copyPages(pdf2, pdf2.getPageIndices());
    pages2.forEach(page => {
        pdf.addPage(page);
    });

    const pdfBytes = await pdf.save();

    const base64 = Buffer.from(pdfBytes).toString('base64');
    console.log('====================================');
    console.log(base64);
    console.log('====================================');
    // await RNFS.writeFile('/storage/emulated/0/Download/sample.pdf', blob, 'base64');
    await RNFetchBlob.fs.writeFile('/storage/emulated/0/Download/Smartflow/a.pdf', base64, 'base64').then(() => {
        console.log('file created');
    }).catch(error => {
        console.log(error);
    })
};

createPdf();

// const pdfFiles = ['/storage/emulated/0/Download/Smartflow/lecture_19.pdf', '/storage/emulated/0/Download/Smartflow/lecture_19.pdf'];

// pdfMerge({
//     pdfFiles,
//     outputFilePath: '/storage/emulated/0/Download/Smartflow/merged.pdf',
//     successCallback: (resp) => {
//         console.log(resp);
//     },
//     errorCallback: (error) => {
//         console.log(error)
//     }

// })


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
