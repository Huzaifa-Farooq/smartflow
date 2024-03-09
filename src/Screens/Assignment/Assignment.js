//import libraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight, TouchableOpacity, ActivityIndicator } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import Banner from '../../Components/BannersAd/Banner';
import RNFS from 'react-native-fs';
import FileViewer from "react-native-file-viewer";
import LottieView from 'lottie-react-native';


import { generateAssignment } from '../../api/api.mjs';
import { DocumentItem } from '../../Components/DocumentItem';
import { getFileIcon, formatSize } from '../../utils/utils.mjs';
import ErrorDialog from '../../Components/ErrorDialog';
import AnimatedIcon from '../../Components/AnimatedIcon';



// create a component
const Assignment = ({ navigation }) => {
    const [topic, setTopic] = useState('');
    const [generateButtonDisabled, setGenerateButtonDisabled] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [requestInProgress, setRequestInProgress] = useState(false);
    const [error, setError] = useState(null);
    const [downloadedFile, setDownloadedFile] = useState(null);

    const Fileopener = (path) => {
        FileViewer.open(path, { showOpenWithDialog: true })
    };

    const handleResponse = (response) => {
        console.log('response received')
        setRequestInProgress(false);
        // random number between 1 - 10
        const randomNumber = Math.floor(Math.random() * 10) + 1;
        setDownloadProgress(randomNumber);

        if (response.file_url) {
            console.log('Downloading file...')
            downloadFile({
                fileUrl: response.file_url,
                fileName: response.filename,
            });
        }
        else {
            console.log('No file to download')
            console.log(JSON.stringify(response))
            setError(response.message);
        }

        setGenerateButtonDisabled(false);
    }

    const handleError = (err) => {
        console.log('error while generating assignment');
        console.log("error is: " + err);
        setError(err);
        setRequestInProgress(false);
        setGenerateButtonDisabled(false);
    }

    const handleAssignmentInput = () => {
        // disable the button and let the user know that the request is being processed
        console.log('Generating assignment...');
        setGenerateButtonDisabled(true);
        setRequestInProgress(true);
        setDownloadProgress(0);
        setDownloadedFile(null);
        setError(null);

        generateAssignment({
            title: topic,
            successCallback: handleResponse,
            errorCallback: (err) => handleError(err.message)
        });
    }

    const downloadFile = ({ fileUrl, fileName }) => {
        setGenerateButtonDisabled(true);
        const filePath = RNFS.DownloadDirectoryPath + '/SmartFlow/' + fileName;
        console.log('Downloading file to ' + filePath);

        RNFS.downloadFile({
            fromUrl: fileUrl,
            toFile: filePath,
            background: true, // Enable downloading in the background (iOS only)
            discretionary: true, // Allow the OS to control the timing and speed (iOS only)
            progress: (progressResponse) => {
                // Handle download progress updates if needed
                const progress = (progressResponse.bytesWritten / progressResponse.contentLength) * 100;
                // display progress to user
                setDownloadProgress(progress);
            },
        })
            .promise.then((response) => {
                console.log('File downloaded!', response);
                setDownloadProgress(100);
                setDownloadedFile({
                    size: response.bytesWritten,
                    name: fileName,
                    path: filePath
                });
            })
            .catch((err) => {
                console.log('Download error:', err);
                // display error to user
                setError('Error downloading file. Please check your internet connection.');
                // resetting downloading progress
                setDownloadProgress(0);

            });

        setGenerateButtonDisabled(false);
    };

    const buttonDisabled = topic === '' || generateButtonDisabled;


    // request is not sent yet
    return (
        <View style={styles.container}>
            <CustomHeader title={'Assignments'}
                icon={"keyboard-backspace"}
                onPress={() => navigation.goBack()}
            />

            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <TextInput 
                    multiline={true}
                    placeholder='Enter your Topic'
                    placeholderTextColor='#777777'
                    style={styles.textInput}
                    value={topic}
                    onChangeText={(text) => setTopic(text)}
                    editable={!requestInProgress}
                />
            </View>


            {
                requestInProgress && (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <AnimatedIcon name='writeOnPage' style={{ width: 200, height: 200, flex: 1 }} />
                        <Text style={{ fontSize: 20, fontWeight: 'bold', ...styles.textColor }}>Generating Assignment...</Text>
                    </View>
                )
            }

            {
                (downloadProgress > 0 && !downloadedFile) && (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <AnimatedIcon name='fileDownload' style={{ width: 150, height: 150 }} />
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>Downloading file...</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>{downloadProgress.toFixed(2)}%</Text>
                    </View>
                )
            }

            {
                downloadedFile && downloadProgress == 100 && (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableHighlight
                            underlayColor={''}
                            onPress={() => Fileopener(downloadedFile.path)}
                        >
                            <DocumentItem iconSrc={getFileIcon(downloadedFile.name)} title={downloadedFile.name} size={formatSize(downloadedFile.size)} />
                        </TouchableHighlight>
                    </View>
                )
            }

            {
                (error) && (
                    <ErrorDialog
                        error={error}
                        onClose={() => setError(null)}
                    />
                )
            }

            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    style={[buttonDisabled ? styles.button1 : styles.button]}
                    onPress={handleAssignmentInput}
                    disabled={topic === ''}
                >
                    <Text style={ styles.btnText }>Generate</Text>
                </TouchableOpacity>
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
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd', // border
        width: '90%',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f9f9f9',
        color: 'black'
    },
    button: {
        backgroundColor: 'skyblue',
        width: '50%',
        padding: 20,
        alignSelf: 'center',
        borderRadius: 10,
        alignItems: 'center',
        bottom: 0, top: '100%'
    },
    button1: {
        backgroundColor: 'lightblue',
        width: '50%',
        padding: 20,
        alignSelf: 'center',
        borderRadius: 10,
        alignItems: 'center',
        bottom: 0, top: '100%'
    },

    btnText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold'
    },

    textColor: {
        color: '#777777'
    }
});


export default Assignment;
