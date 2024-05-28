//import libraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight, TouchableOpacity, ActivityIndicator } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import Banner from '../../Components/BannersAd/Banner';
import RNFS from 'react-native-fs';
import FileViewer from "react-native-file-viewer";


import { generateAssignment } from '../../api/api.mjs';
import { DocumentItem } from '../../Components/DocumentItem';
import { getFileIcon, formatSize } from '../../utils/utils.mjs';
import ErrorDialog from '../../Components/ErrorDialog';
import AnimatedIcon from '../../Components/AnimatedIcon';
import AssignmentsOptionModal from '../../Components/AssignmentOptionModel';


// create a component
const Assignment = ({ navigation }) => {
    const [topic, setTopic] = useState('');
    const [generateButtonDisabled, setGenerateButtonDisabled] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [requestInProgress, setRequestInProgress] = useState(false);
    const [error, setError] = useState(null);
    const [downloadedFile, setDownloadedFile] = useState(null);
    const [displayModal, setDisplayModal] = useState(false);

    const ASSIGNMENT_FOLDER = RNFS.DownloadDirectoryPath + '/SmartFlow/Assignments';
    RNFS.mkdir(ASSIGNMENT_FOLDER)


    const Fileopener = (path) => {
        FileViewer.open(path, { showOpenWithDialog: true })
    };

    const handleAssignmentInput = (mode) => {
        // disable the button and let the user know that the request is being processed
        console.log('Generating assignment...');
        setDisplayModal(false);
        setGenerateButtonDisabled(true);
        setRequestInProgress(true);
        setDownloadProgress(0);
        setDownloadedFile(null);
        setError(null);

        generateAssignment({
            title: topic,
            mode: mode,
            successCallback: ({ base64, filename }) => {
                const path = `${ASSIGNMENT_FOLDER}/${filename}`;
                console.log('Writing file');
                RNFS.writeFile(path, base64, 'base64')
                    .then(() => {
                        console.log('File written to ', path);
                        setDownloadedFile({ name: filename, path, size: base64.length });
                    })
                    .catch((err) => {
                        console.log(err.message);
                        setError('Error while creating file.');
                        setDownloadedFile(null);
                    });
                setRequestInProgress(false);
            },
            errorCallback: (error) => {
                console.log(error);
                setError('Error while generating Assignment.');
                setRequestInProgress(false);
                setGenerateButtonDisabled(false);
            }
        });
    }

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
                    placeholderTextColor='#3d3a3a'
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
                downloadedFile && (
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
                displayModal && (
                    <AssignmentsOptionModal
                        onClose={() => setDisplayModal(false)}
                        onPress={handleAssignmentInput}
                    />
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
                    onPress={() => { setDisplayModal(true); }}
                    disabled={topic === '' || requestInProgress}
                >
                    <Text style={styles.btnText}>Generate</Text>
                </TouchableOpacity>
            </View>

            <Banner />
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
        color: '#3d3a3a',
        fontSize: 22,
        fontWeight: 'bold'
    },

    textColor: {
        color: '#3d3a3a'
    }
});


export default Assignment;
