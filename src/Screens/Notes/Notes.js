//import liraries
import {
    StyleSheet, Text, View, TouchableHighlight, TouchableWithoutFeedback,
    ActivityIndicator, RefreshControl, Animated, Modal,
} from 'react-native';
import { React, useState, useEffect, useRef, useCallback, useMemo } from 'react';

import RNFS from 'react-native-fs';
import CustomHeader from '../../Components/CustomHeader';
import Banner from '../../Components/BannersAd/Banner';
import FileViewer from "react-native-file-viewer";

import { DocumentItem } from '../../Components/DocumentItem';
import { getFileIcon, formatSize, getFileName } from '../../utils/utils.mjs';
import NotesOptionModal from '../../Components/NotesOptionModal';
import { generateNotes } from '../../api/api.mjs';
import ErrorDialog from '../../Components/ErrorDialog';
import FileSelectButton from '../../Components/FileSelectButton';
import DocumentPicker from 'react-native-document-picker';
import NotesProgressModal from '../../Components/NotesProgressModal';
import FilesListComponent from '../../Components/FilesList';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';


// create a component
const Notes = ({ navigation }) => {
    const [displayModal, setDisplayModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState({});
    const [uploadProgress, setUploadProgress] = useState(0);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [requestInProgress, setRequestInProgress] = useState(false);
    const [error, setError] = useState(null);
    const [downloadedFile, setDownloadedFile] = useState();
    const [pptDirectories, setPPTDirectories] = useState([
        RNFS.DownloadDirectoryPath + '/SmartFlow',
        RNFS.DocumentDirectoryPath,
        '/storage/emulated/0/WhatsApp/',
        '/Internal storage/Android/media/com.whatsapp/WhatsApp/',
        '/Internal storage/Android/media/com.whatsapp'
    ]);

    useEffect(() => {
        getPPTDirectories();
    }, []);

    const Fileopener = (path) => {
        FileViewer.open(path, { showOpenWithDialog: true })
    };

    const handleFileSelect = async ({ name, size, path, uri }) => {
        if (!path && uri) {
            path = (await RNFetchBlob.fs.stat(uri)).path;
        }
        console.log('File selected: ', path);
        setDisplayModal(true);
        setSelectedFile({ name, size, path });
    };

    const handleNotesRequest = (actionCode) => {
        console.log('Notes request: ', actionCode);
        console.log('Selected file: ', selectedFile);
        setDisplayModal(false);
        setRequestInProgress(true);
        setDownloadProgress(0);
        setDownloadedFile(null);
        setError(null);

        generateNotes({
            filePath: selectedFile.path,
            fileName: selectedFile.name,
            actionCode: actionCode,
            progress: (progress) => {
                if (progress > 99){
                    progress = 100;
                }
                setUploadProgress(progress);
            },
            successCallback: handleNotesResponse,
            errorCallback: (error) => {
                console.log('error while generating notes');
                console.error(JSON.stringify(error));
                // printing error message to user
                if (error.includes('uploading file')){
                    setError('Error uploading file');
                } else {
                    setError('Error while generating notes');
                }

                setDisplayModal(false);
                setUploadProgress(0);
                setRequestInProgress(false);
                setDownloadProgress(0);
                setDownloadedFile(null);
            }
        });
    }

    const handleNotesResponse = (response) => {
        console.log(response);
        setRequestInProgress(false);
        if (response.pdf_url) {
            console.log('Downloading file...')
            downloadFile({
                fileUrl: response.pdf_url,
                fileName: response.filename,
            });
        }
        else {
            console.log('No file to download')
            setError('No file to download');
        }
    }

    const downloadFile = async ({ fileUrl, fileName }) => {
        const directory = RNFS.DownloadDirectoryPath + '/SmartFlow';
        fileName = await getFileName(directory, fileName);
        const filePath = directory + "/" + fileName;
        console.log('Downloading file' + fileUrl + ' to ' + filePath);

        // random number from 1 - 10
        const randomNumber = Math.floor(Math.random() * 10) + 1;
        setDownloadProgress(randomNumber);

        RNFS.downloadFile({
            fromUrl: fileUrl,
            toFile: filePath,
            background: true, // Enable downloading in the background (iOS only)
            discretionary: true, // Allow the OS to control the timing and speed (iOS only)
            progress: (progressResponse) => {
                // Handle download progress updates if needed
                const val = (progressResponse.bytesWritten / progressResponse.contentLength) * 100;
                // display progress to user
                val >= downloadProgress ? setDownloadProgress(val) : null;
                console.log(`Download progress val: ${val}%`);
            },
        })
            .promise.then((response) => {
                console.log('====================================');
                console.log('File downloaded!', response);
                console.log({
                    size: response.bytesWritten,
                    name: fileName,
                    path: filePath
                });
                console.log('====================================');
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
            });
    };

    const Header = useMemo(() => {
        return (
            <CustomHeader title={'Notes'}
                icon={"keyboard-backspace"}
                onPress={() => navigation.goBack()}
            />
        )
    }, [navigation]);


    const getPPTDirectories = () => {
        AsyncStorage.getItem('@PPTDirectoryPaths')
            .then((value) => {
                if (value !== null) {
                    setPPTDirectories(JSON.parse(value));
                }
            })
            .catch((e) => {
                console.log('Error getting PPTDirectoryPaths ' + e);
            });
    };


    console.log(
        'uploadProgress: ', uploadProgress,
        'downloadProgress: ', downloadProgress,
        'requestInProgress: ', requestInProgress,

    )

    // if loading is true and and files are found, then show loading indicator below the files
    // if loading is false and files are found, then show files without loading indicator
    return (
        <View style={styles.container}>
            {Header}
            <FileSelectButton
                allowedTypes={[DocumentPicker.types.ppt, DocumentPicker.types.pptx]}
                allowMultiSelection={false}
                onFileSelect={(file) => handleFileSelect(file)}
            />

            <FilesListComponent
                navigation={navigation}
                directories={pptDirectories}
                required_ext={['.ppt', '.pptx']}
                // listFooterHeight={files.length > 0 ? 70 : 10}
                // CustomListFooter={<ListFooter loading={loading} files={files} />}
                onFileClick={(file) => handleFileSelect(file)}
            />


            {
                displayModal && (
                    <NotesOptionModal
                        onClose={() => setDisplayModal(false)}
                        onButtonPress={handleNotesRequest}
                    />
                )
            }

            {
                <NotesProgressModal
                    uploadProgress={uploadProgress}
                    uploadInProgress={uploadProgress > 0 && uploadProgress < 100}
                    downloadProgress={downloadProgress}
                    fileDownloadInProgress={downloadProgress > 0 && downloadProgress < 100}
                    notesGenerationInProgress={
                        requestInProgress &&
                        (uploadProgress == 0 || uploadProgress == 100) &&
                        (downloadProgress == 0 || downloadProgress == 100)
                    }
                />
            }

            {
                downloadedFile && downloadProgress == 100 && (
                    <NotesOutputComponent
                        downloadedFile={downloadedFile}
                        onPress={() => { navigation.navigate('DocViewer', {     
                            path: downloadedFile.path, 
                            name: downloadedFile.name
                        }) }}
                        onClose={() => setDownloadedFile(null)}
                    />
                )
            }

            {
                (error) && (
                    <ErrorDialog
                        onClose={() => setError(null)}
                        error={error}
                    />
                )
            }
        </View>
    );
};

const ListFooter = ({ loading, files }) => {
    return (
        (loading && files.length > 0) && (
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 10, paddingBottom: 10 }}>
                <ActivityIndicator size='small' color='black' />
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: 'black' }}>Loading...</Text>
            </View>
        )
    )
}


const NotesOutputComponent = ({ downloadedFile, onPress, onClose }) => {
    return (
        <Modal
            transparent={true}
            visible={true}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }} >
                    <View
                        style={{
                            height: 150,
                            backgroundColor: '#ffff',
                            // ading shadows
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 1,
                            shadowRadius: 3.84,

                        }}
                    >
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <TouchableHighlight
                                underlayColor={''}
                                onPress={onPress}
                            >
                                <DocumentItem iconSrc={getFileIcon(downloadedFile.name)} title={downloadedFile.name} size={formatSize(downloadedFile.size)} />
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>

            </TouchableWithoutFeedback>
        </Modal>

    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    floatingButton: {
        backgroundColor: '#deb018',
        position: 'absolute',
        bottom: 30,
        right: 25,
        width: 60,
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 15,
    },
    text: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold'
    },
    iconView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        justifyContent: 'space-around',
        marginHorizontal: 10,
        marginVertical: 2

    },
    RBText: {
        fontSize: 26,
        color: '#000',
        fontWeight: 'bold'

    }
});


export default Notes;
