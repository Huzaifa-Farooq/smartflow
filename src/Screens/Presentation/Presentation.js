//import liraries
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableHighlight, Dimensions, FlatList, Image } from 'react-native';
import Banner from '../../Components/BannersAd/Banner';
import RNFS from 'react-native-fs';
import FileViewer from "react-native-file-viewer";

import CustomHeader from '../../Components/CustomHeader';
import ErrorDialog from '../../Components/ErrorDialog';
import AnimatedIcon from '../../Components/AnimatedIcon';
import { getFileIcon, formatSize, openFile } from '../../utils/utils.mjs';
import { generatePresentation } from '../../api/api.mjs';
import { DocumentItem } from '../../Components/DocumentItem';
import '../../utils/global.js';


const { height, width } = Dimensions.get('window');


const Presentation = ({ route, navigation }) => {
    const [topic, setTopic] = useState('')
    const [downloadedFile, setDownloadedFile] = useState(null);
    const [error, setError] = useState(null);
    const [requestInProgress, setRequestInProgress] = useState(false);
    const [Scrollheight, setScrollViewHeight] = useState(height / 2);

    const inputRef = useRef(null);


    const PRESENTATION_FOLDER = global.PRESENTATION_FOLDER;
    // create folder if not exists
    RNFS.mkdir(PRESENTATION_FOLDER);

    const { templateId } = route.params;

    const handleInputFocus = () => {
        setScrollViewHeight(height / 3); // Adjust height on focus
    };

    const handleInputBlur = () => {
        if (topic.length === 0) {
            setScrollViewHeight(height / 2); // Reset height on blur if empty
        }
    };

    const handleAssignmentInput = () => {
        setRequestInProgress(true);
        generatePresentation({
            title: topic.trim(),
            templateId: templateId,
            successCallback: ({ base64, filename }) => {
                const path = `${PRESENTATION_FOLDER}/${filename}`;
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
                setError('Error while generating presentation.');
                setRequestInProgress(false);
            }
        });
    }

    return (
        <View style={styles.container}>
            <CustomHeader title={'Presentations'}
                icon={"keyboard-backspace"}
                onPress={() => navigation.goBack()}
            />

            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <TextInput
                    multiline={false}
                    ref={inputRef}
                    placeholder='Enter you Topic'
                    placeholderTextColor='#777777'
                    style={styles.textInput}
                    value={topic}
                    onChangeText={(text) => setTopic(text)}
                    onFocus={handleInputFocus} // Call handleInputFocus on focus
                    onBlur={handleInputBlur} // Call handleInputBlur on blur
                    editable={!requestInProgress}
                />
            </View>

            {
                requestInProgress && (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <AnimatedIcon name='presentation' style={{ width: 200, height: 200, flex: 1 }} />
                        <Text style={{ color: 'black' ,fontSize: 20, fontWeight: 'bold', ...styles.textColor }}>Generating Presentation...</Text>
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

{
                downloadedFile && (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableHighlight
                            underlayColor={''}
                            onPress={() => openFile(navigation, downloadedFile.path)}
                        >
                            <DocumentItem 
                                iconSrc={getFileIcon(downloadedFile.name)} 
                                title={downloadedFile.name} 
                                size={formatSize(downloadedFile.size)} 
                                filePath={downloadedFile.path}
                                />
                        </TouchableHighlight>
                    </View>
                )
            }

            <TouchableOpacity
                style={[topic === '' || requestInProgress ? styles.button : styles.button1]}
                onPress={() => {
                    handleAssignmentInput();
                }}
                disabled={topic === '' || requestInProgress}
            >
                <Text style={styles.btnText}>Generate</Text>
            </TouchableOpacity>

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
    text: {
        color: '#777777',
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 20,
        marginTop: 10,
    },
    button: {
        backgroundColor: 'lightblue',
        width: '50%',
        padding: 20,
        alignSelf: 'center',
        borderRadius: 10,
        alignItems: 'center',
        // marginBottom: 40,
        bottom: 0,
        top: height / 21

    },
    button1: {
        backgroundColor: 'skyblue',
        width: '50%',
        padding: 20,
        alignSelf: 'center',
        borderRadius: 10,
        alignItems: 'center',
        // marginBottom: 40,
        bottom: 0,
        top: height / 21
    },
    btnText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold'
    },

    btnText1: {
        color: '#7393B3',
        fontSize: 18,
        fontWeight: 'bold'
    },

});

//make this component available to the app
export default Presentation;
