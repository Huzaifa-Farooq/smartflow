//import liraries
import {
    StyleSheet, Text, View, TouchableHighlight, TouchableWithoutFeedback,
    ActivityIndicator, RefreshControl, Animated, Modal,
} from 'react-native';
import { React, useState, useEffect, useRef, useCallback, useMemo } from 'react';

import RNFS from 'react-native-fs';
import CustomHeader from '../../Components/CustomHeader';
import Banner from '../../Components/BannersAd/Banner';

import FolderSelectButton from '../../Components/FolderSelectButton';
import { DocumentItem } from '../../Components/DocumentItem';
import { getFileIcon, formatSize, getFileName, openFile } from '../../utils/utils.mjs';
import NotesOptionModal from '../../Components/NotesOptionModal';
import { generateNotes } from '../../api/api.mjs';
import ErrorDialog from '../../Components/ErrorDialog';
import FileSelectButton from '../../Components/FileSelectButton';
import DocumentPicker from 'react-native-document-picker';
import NotesProgressModal from '../../Components/NotesProgressModal';
import FilesListComponent from '../../Components/FilesList';
import '../../utils/global.js';
import { loadFoldersToScan } from '../../utils/utils.mjs';
import { BottomRightStackComponent } from '../../Components/FileSelectButton';

import { transferFile } from 'react-native-saf-x';

const DEFAULT_PPT_DIRS = [
    global.APP_DIRECTORY,
    RNFS.DownloadDirectoryPath,
    RNFS.DocumentDirectoryPath,
    '/storage/emulated/0/WhatsApp/',
    '/Internal storage/Android/media/com.whatsapp/WhatsApp/',
    '/Internal storage/Android/media/com.whatsapp'
];

// create a component
const Notes = ({ navigation }) => {
    const [displayModal, setDisplayModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState({});
    const [uploadProgress, setUploadProgress] = useState(0);
    const [requestInProgress, setRequestInProgress] = useState(false);
    const [error, setError] = useState(null);
    const [downloadedFile, setDownloadedFile] = useState();
    const [pptDirectories, setPPTDirectories] = useState([]);

    useEffect(() => {
        const init = async () => {
            const folders = await loadFoldersToScan();
            folders.push(...DEFAULT_PPT_DIRS);
            setPPTDirectories(folders);
        };
        init();
    }, []);

    const handleFileSelect = async ({ name, size, path, uri }) => {
        if ((!path && uri) || (path && path.includes('content:'))) {
            fileCopyUri = global.PPT_IMPORT_DIRECTORY + "/" + name;
            console.log('Copying file to ', fileCopyUri);
            try{
                const r = await RNFS.copyFile(uri, fileCopyUri);
                console.log('copy response: ' , r);
            } catch (e){
                console.log('Error copying file using RNFS ', e);
            }
            path = fileCopyUri;
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
        setDownloadedFile(null);
        setError(null);

        generateNotes({
            filePath: selectedFile.path,
            fileName: selectedFile.name,
            actionCode: actionCode,
            progress: (progress) => {
                if (progress > 99) {
                    progress = 100;
                }
                setUploadProgress(progress);
            },
            successCallback: handleNotesResponse,
            errorCallback: (error) => {
                console.log('error while generating notes');
                console.error(JSON.stringify(error));
                // printing error message to user
                if (error.includes('uploading file')) {
                    setError('Error uploading file');
                } else {
                    setError('Error while generating notes');
                }

                setDisplayModal(false);
                setUploadProgress(0);
                setRequestInProgress(false);
                setDownloadedFile(null);
            }
        });
    }

    const handleNotesResponse = async ({ filename, base64 }) => {
        console.log('Handling response');
        setRequestInProgress(false);
        setUploadProgress(100);
        const directory = global.NOTES_DIRECTORY_PATH;
        filename = await getFileName(directory, filename);
        const filePath = directory + "/" + filename;
        console.log('Writing file to disk.');
        RNFS.writeFile(filePath, base64, 'base64')
            .then(() => {
                console.log('File written!');
                setDownloadedFile({
                    size: base64.length,
                    name: filename,
                    path: filePath
                });
            })
            .catch((err) => {
                console.log('Error writing file', err);
            });
    }

    const Header = useMemo(() => {
        return (
            <CustomHeader title={'Notes'}
                icon={"keyboard-backspace"}
                onPress={() => navigation.goBack()}
            />
        )
    }, [navigation]);

    // if loading is true and and files are found, then show loading indicator below the files
    // if loading is false and files are found, then show files without loading indicator
    return (
        <View style={styles.container}>
            {Header}

            <FilesListComponent
                navigation={navigation}
                directories={pptDirectories}
                required_ext={['.pptx']}
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
                    downloadProgress={0}
                    fileDownloadInProgress={false}
                    notesGenerationInProgress={
                        requestInProgress &&
                        (uploadProgress == 0 || uploadProgress == 100)
                    }
                />
            }

            {
                downloadedFile && (
                    <NotesOutputComponent
                        downloadedFile={downloadedFile}
                        onPress={() => { openFile(navigation, downloadedFile.path) }}
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

            <BottomRightStackComponent
                components={[
                    <FolderSelectButton
                        onFolderSelect={(folder) => {
                            setPPTDirectories(prevDirectories => [...prevDirectories, folder]);
                        }}
                        type={'secondary'}
                    />,
                    <FileSelectButton
                        allowedTypes={[DocumentPicker.types.pptx]}
                        allowMultiSelection={false}
                        onFileSelect={(file) => handleFileSelect(file)}
                    />
                ]}
            />

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
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalInnerContent}>
                            <TouchableHighlight
                                underlayColor={''}
                                onPress={onPress}
                            >
                                <DocumentItem
                                    iconSrc={getFileIcon(downloadedFile.name)}
                                    title={downloadedFile.name}
                                    size={formatSize(downloadedFile.size)}
                                    filePath={downloadedFile.path}
                                />
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
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        height: 150,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 3,
    },
    modalInnerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default Notes;