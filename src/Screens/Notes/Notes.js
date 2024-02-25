//import liraries
import {
    StyleSheet, Text, View, FlatList, TouchableHighlight,
    ActivityIndicator, RefreshControl, Animated
} from 'react-native';
import { React, useState, useEffect, useRef, useCallback } from 'react'
import RNFS from 'react-native-fs';
import CustomHeader from '../../Components/CustomHeader';
import Banner from '../../Components/BannersAd/Banner';
import FileViewer from "react-native-file-viewer";

import { DocumentItem } from '../../Components/DocumentItem';
import { getFileIcon, formatSize, sortFilesArray, searchFilesArray } from '../../utils/utils.mjs';
import NotesOptionModal from '../../Components/NotesOptionModal';
import { generateNotes } from '../../api/api.mjs';
import ErrorDialog from '../../Components/ErrorDialog';
import FileSelectButton from '../../Components/FileSelectButton';
import DocumentPicker from 'react-native-document-picker';
import NotesProgressModal from '../../Components/NotesProgressModal';
import { ListEmptyComponent, CustomSearchBarView, FileLoadingComponent } from '../../Components/FilesList';
import { animatedFilesListViewStyle } from '../../styles/styles';


// import { startBackgroundService } from '../../utils/background_tasks';


// create a component
const Notes = ({ navigation }) => {
    const [pptFiles, setPptFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [displayModal, setDisplayModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState({});
    const [uploadProgress, setUploadProgress] = useState(0);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [requestInProgress, setRequestInProgress] = useState(false);
    const [error, setError] = useState(null);
    const [downloadedFile, setDownloadedFile] = useState(null);
    const [search, setSearch] = useState('');
    const [initialLoading, setInitialLoading] = useState(true);

    const scrollY = useRef(new Animated.Value(0)).current;
    const diffClamp = Animated.diffClamp(scrollY, 0, 100);

    const translateY = diffClamp.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -60],
        extrapolate: 'clamp',
    });

    const opacity = diffClamp.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const marginTop = diffClamp.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -30],
        extrapolate: 'clamp',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const Fileopener = (path) => {
        FileViewer.open(path, { showOpenWithDialog: true })
    };

    useEffect(() => {
        fetchPptFiles();
    }, []);

    const fetchPptFiles = async () => {
        setLoading(true);
        const files = await listPptFiles();
        setPptFiles(files);
        setLoading(false);
    };

    const listPptFiles = useCallback(async (directoryPath = RNFS.ExternalStorageDirectoryPath) => {
        console.log('====================================');
        console.log(directoryPath);
        console.log('====================================');
        const fileNames = await RNFS.readDir(directoryPath);
        console.log('====================================');
        console.log(fileNames);
        console.log('====================================');
        const requiredFiles = [];
        const visitedDirectories = [];
        const directoriesToSkip = [
            'images', '/obb', 'cache', 'video', 'photo', 'voice', 'movies', 'music', '/dcim/',
            'sdk', 'media', 'gallery', 'img', 'movie', 'temp', './'
        ];

        // Use Promise.all to parallelize file processing for better performance
        await Promise.all(fileNames.map(async (file) => {
            if (!file) return;
            if (file && file.isFile() && (file.name.endsWith('.ppt') || file.name.endsWith('.pptx'))) {
                requiredFiles.push(file);
                // Update state as soon as a file is found
                setPptFiles((prevFiles) => [...prevFiles, file]);
            } else if (file.isDirectory()) {
                // checking if the directory is to be skipped
                if (directoriesToSkip.some((dir) => file.path.toLowerCase().includes(dir))) {
                    return;
                }
                console.log('Directory found: ', file.path)
                // checking if the directory is already visited or not
                if (visitedDirectories.includes(file.path)) {
                    console.log('Already visited directory: ', file.path)
                    return;
                }
                else {
                    visitedDirectories.push(file.path);
                    const subFiles = await listPptFiles(file.path);
                    requiredFiles.push(...subFiles);
                }
            }
        }));

        return requiredFiles;
    }, []);


    const handleFileSelect = ({ name, size, path }) => {
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
                setUploadProgress(progress);
            },
            successCallback: handleNotesResponse,
            errorCallback: (error) => {
                console.log('error while generating notes');
                console.error(JSON.stringify(error));
                // printing error message to user
                setError(error.message);

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
            setError(response.message);
        }

    }

    const downloadFile = ({ fileUrl, fileName }) => {
        const filePath = RNFS.DownloadDirectoryPath + '/SmartFlow/' + fileName;
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
                setDownloadProgress(val);
                console.log(`Download progress val: ${val}%`);
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
            });
    };

    const renderListItem = ({ item, index }) => {
        return (
            <TouchableHighlight onPress={() => handleFileSelect(item)} underlayColor={'white'}  >
                <DocumentItem iconSrc={getFileIcon(item.name)} title={item.name} size={formatSize(item.size)} />
            </TouchableHighlight>
        )
    }

    const files = search ? searchFilesArray({ files: pptFiles, query: search }) : pptFiles;

    // if there are no files and loading is false, then there are no ppt files in the device
    if (pptFiles.length === 0 && !loading) {
        return (
            <View style={styles.container}>
                <CustomHeader title={'Notes'}
                    icon={"keyboard-backspace"}
                    onPress={() => navigation.goBack()}
                />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>No PPT files found</Text>
                </View>
            </View>
        )
    }
    // if loading is true and no files are found, then show loading indicator
    if ((loading && files.length === 0) || initialLoading) {
        return (
            <View style={styles.container}>
                <CustomHeader title={'Notes'}
                    icon={"keyboard-backspace"}
                    onPress={() => navigation.goBack()}
                />
                <FileLoadingComponent />
            </View>
        )
    }
    // if loading is true and and files are found, then show loading indicator below the files
    // if loading is false and files are found, then show files without loading indicator
    else {
        return (
            <View style={styles.container}>
                <CustomHeader title={'Notes'}
                    icon={"keyboard-backspace"}
                    onPress={() => navigation.goBack()}
                />
                <FileSelectButton
                    allowedTypes={[DocumentPicker.types.ppt, DocumentPicker.types.pptx]}
                    allowMultiSelection={false}
                    onFileSelect={(file) => handleFileSelect(file)}
                />
                <CustomSearchBarView
                    onChangeText={(text) => setSearch(text)}
                    onClearPress={() => setSearch('')}
                    search={search}
                    viewStyle={{ transform: [{ translateY }] }}
                    searchBarStyle={{ opacity: opacity }}
                />
                <View style={animatedFilesListViewStyle}>
                    <Animated.FlatList
                        style={{ marginTop }}
                        refreshControl={
                            <RefreshControl
                                tintColor="#deb018"
                                onRefresh={() => { fetchPptFiles() }}
                                refreshing={false}
                            />
                        }
                        bounces={true}
                        onScroll={(e) => {
                            if (e.nativeEvent.contentOffset.y > 0)
                                scrollY.setValue(e.nativeEvent.contentOffset.y);
                        }}
                        data={sortFilesArray({ files: files, mode: 'date', reversed: true })}
                        ListFooterComponent={<ListFooter loading={loading} files={files} />}
                        ListEmptyComponent={<ListEmptyComponent />}
                        renderItem={renderListItem}
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
                        (error) && (
                            <ErrorDialog
                                onClose={() => setError(null)}
                                error={error}
                            />
                        )
                    }
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <Banner />
                </View>
            </View>
        );
    }
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
