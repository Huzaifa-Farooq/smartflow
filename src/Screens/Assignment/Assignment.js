//import libraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ProgressBarAndroid } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import Banner from '../../Components/BannersAd/Banner';
import RNFS from 'react-native-fs';

import { generateAssignment } from '../../api/api.mjs';


// create a component
const Assignment = ({ navigation }) => {
    const [topic, setTopic] = useState('');
    const [reqResponse, setReqResponse] = useState(null);

    const handleAssignmentInput = () => {
        // disable the button and let the user know that the request is being processed
        console.log('Generating assignment...');
        generateAssignment({
            title: topic,
            successCallback: setReqResponse,
            errorCallback: (error) => {
                console.error(error);
                console.error(JSON.stringify(error));
            },
        });
    }

    const downloadFile = ({ fileUrl, fileName }) => {
        const filePath = RNFS.DownloadDirectoryPath + '/SmartFlow/' + fileName;
    
        RNFS.downloadFile({
          fromUrl: fileUrl,
          toFile: filePath,
          background: true, // Enable downloading in the background (iOS only)
          discretionary: true, // Allow the OS to control the timing and speed (iOS only)
          progress: (progressResponse) => {
            // Handle download progress updates if needed
            const progress = (progressResponse.bytesWritten / progressResponse.contentLength) * 100;
            console.log(`Progress: ${progress.toFixed(2)}%`);
            // display progress to user (optional)

          },
        })
          .promise.then((response) => {
            console.log('File downloaded!', response);
            // do whatever you want after download is completed
            
          })
          .catch((err) => {
            console.log('Download error:', err);
            // display error to user

          });
      };

    if (reqResponse !== null){
        if (reqResponse.file_url){
            // download the file
            downloadFile({
                fileUrl: reqResponse.file_url,
                fileName: reqResponse.filename,
            });

            // do whatever you want after download is completed

        }
        else{
            console.log(`Error: ${reqResponse.message}`)
            const errorMessage = reqResponse.message; // str
            // display error to user
        }
    }
    // request is not sent yet
    else{
        return (
            <View style={styles.container}>
                <CustomHeader title={'Assignments'}
                    icon={"keyboard-backspace"}
                    onPress={() => navigation.goBack()}
                />
    
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <TextInput multiline={true}
                        placeholder='Enter you Topic'
                        style={styles.textInput}
                        value={topic}
                        onChangeText={(text) => setTopic(text)}
                    />
                </View>

                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <TouchableOpacity 
                        style={[topic === '' ? styles.button : styles.button1]} 
                        onPress={handleAssignmentInput} 
                        disabled={topic === ''}
                    >
                        <Text style={topic === '' ? styles.btnText1 : styles.btnText}>Generate</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <Banner />
                </View>
            </View>
        );
    }

};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    textInput: {
        borderWidth: 1,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 20,
        padding: 20

    },
    button: {
        backgroundColor: 'lightblue',
        width: '50%',
        padding: 20,
        alignSelf: 'center',
        borderRadius: 10,
        alignItems: 'center',
    },
    button1: {
        backgroundColor: 'skyblue',
        width: '50%',
        padding: 20,
        alignSelf: 'center',
        borderRadius: 10,
        alignItems: 'center',
    },

    btnText: {
        color: '#000',
        fontSize: 22,
        fontWeight: 'bold'
    }, btnText1: {
        color: '#7393B3',
        fontSize: 22,
        fontWeight: 'bold'
    }
});


export default Assignment;
