//import libraries
import CustomHeader from '../../Components/CustomHeader';
import { 
    StyleSheet, Text, View, FlatList, Animated, TouchableHighlight } from 'react-native'
import { React, useState, useEffect, useRef } from 'react'
import RNFS from 'react-native-fs'
import FileViewer from "react-native-file-viewer";
import Banner from '../../Components/BannersAd/Banner';

import { DocumentItem } from '../../Components/DocumentItem';
import { getFileIcon, formatSize, searchFilesArray, loadFiles, sortFilesArray } from '../../utils/utils.mjs';
import { pdfMerge } from '../../utils/pdfMerge';

import ErrorDialog from '../../Components/ErrorDialog';
import PDFMergerProgressModal from '../../Components/PDFMergerProgressModal';

import SearchBar from "react-native-dynamic-search-bar";
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { isInProgress } from 'react-native-document-picker';


// create a component
const PDFMerge = ({ navigation }) => {
    const [result, setresult] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [completedFiles, setCompletedFiles] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [mergeInProgress, setMergeInProgress] = useState(false);


    const MAX_FILES = 5;


    useEffect(() => {
        folderReader();
    }, [])

    const folderReader = async () => {
        const directory = RNFS.DownloadDirectoryPath + '/SmartFlow';
        const result = await loadFiles({ directoryPath: directory, required_ext: ['.pdf'] });
        setresult(sortFilesArray({
            files: result,
            sortBy: 'date',
            reversed: true

        }));
    };

    const updateSelectedFiles = (file) => {
        console.log('file', file);
        // if file path already in array then delete the element
        if (selectedFiles.indexOf(file.path) !== -1) {
            setSelectedFiles(selectedFiles.filter((path) => path !== file.path));
        }
        else if (selectedFiles.length < MAX_FILES) {
            // if file path not in array then add it
            setSelectedFiles([...selectedFiles, file.path]);
        }
    }

    const mergePDFS = () => {
        setSelectedFiles([]);
        setMergeInProgress(true);
        
        pdfMerge({ 
            files: selectedFiles,
            outputFilePath: '/storage/emulated/0/Download/SmartFlow/meed.pdf',
            successCallback: (filePath) => {
                const filename = filePath.split('/').pop();
                setCompleted(true);
                setTimeout(() => {
                    navigation.navigate('Downloads');
                    FileViewer.open(filePath);
                    setCompleted(false);
                    setMergeInProgress(false);
                }, 3000);
            },
            errorCallback: (error) => {
                console.log('error', error);
                // show error dialog
                setError(error);
                setMergeInProgress(false);
            },
            onFileComplete: (file) => {
                // console.log('Completed ', file);
                // setCompletedFiles([...completedFiles, file.name]);
            }
         });
    }

    const files = search ? searchFilesArray({ files: result, query: search }) : result;

    return (
        <View style={styles.container}>
            <CustomHeader
                title={'PDFMerger'}
                icon={"keyboard-backspace"}
                onPress={() => navigation.goBack()}
            />
            <SearchBar
                style={{
                    width: '90%',
                    marginTop: 10,
                    borderRadius: 10,
                }}
                placeholder="Search"
                onChangeText={(text) => setSearch(text)}
                onClearPress={() => setSearch("")}
                // use default if there is search text for clearIconComponent otherwise don't use it
                clearIconComponent={search ? null : <></>}
                searchIconImageStyle={{ tintColor: 'black' }}
                clearIconImageStyle={{ tintColor: 'black' }}
            />
            <View style={{ height: '79%', margin: 10, paddingTop: 2, borderWidth: 2, borderColor: '#e1ebe4', borderRadius: 10 }}>
                <FlatList
                    data={files}
                    ListEmptyComponent={() => (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                            <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 20 }}>No files found.</Text>
                        </View>
                    )}
                    renderItem={({ item, index }) => {
                        const isSelected = selectedFiles.indexOf(item.path) !== -1;
                        const selectedOrder = selectedFiles.indexOf(item.path) + 1;
                        return (
                            <TouchableHighlight
                                underlayColor={''}
                                onPress={() => updateSelectedFiles(item)}>
                                <DocumentItem
                                    iconSrc={getFileIcon(item.name)}
                                    title={item.name}
                                    size={formatSize(item.size)}
                                    selected={isSelected}
                                    selectedNumber={selectedOrder}
                                />
                            </TouchableHighlight>
                        )
                    }} />

                    {/* If files are selected */}
                    {
                        selectedFiles.length > 0 && (
                            <BottomDockedPanel
                                onCancelPress={() => setSelectedFiles([])}
                                onMergePress={() => mergePDFS()}
                            />
                        )
                    }
            </View>

            {
                error && (
                    <ErrorDialog
                        error={error}
                        onClose={() => setError('')}
                    />
                )
            }

            {
                (mergeInProgress && !completed) && (
                    <PDFMergerProgressModal
                        text={'Merging PDFs...'}
                    />
                )
            }

            {
                (mergeInProgress && completed) && (
                    <PDFMergerProgressModal
                        text={'PDFs merged successfully'}
                        iconName={'success'}
                    />
                )
            }

            {/* <View style={{ flex: 1, justifyContent: 'flex-end' }}> */}
            <Banner />
            {/* </View> */}
        </View>
    );
};


const BottomDockedPanel = ({
    onCancelPress,
    onMergePress
}) => {

    const slideAnim = useRef(new Animated.Value(500)).current; 

    useEffect(() => {
        Animated.timing(
            slideAnim,
            {
                toValue: 0,
                duration: 500,
                useNativeDriver: false
            }
        ).start();
    }, []);

    return (
        <Animated.View
        
        style={{
            transform: [{ translateY: slideAnim }],
            backgroundColor: '#e1ebe4',

        }}
        >

        <View
            style={dockingStyles.container}
        >
            <View style={dockingStyles.iconContainer}>
                <MaterialCommunityIcons
                    onPress={onCancelPress}
                    name="cancel"
                    size={30}
                    color="#777777"
                />
                <Text style={dockingStyles.text}>Cancel</Text>
            </View>

            <View style={dockingStyles.iconContainer}>
                <MaterialCommunityIcons
                    onPress={onMergePress}
                    name="checkbox-marked-circle-outline"
                    size={30}
                    color="#777777"
                />
                <Text style={dockingStyles.text}>Merge</Text>
            </View>
            </View>
        </Animated.View>
    )
}


const dockingStyles = StyleSheet.create({
    iconContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '20%',
        marginHorizontal: 10,
        marginVertical: 2
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        height: 50,
    },
    text: {
        color: '#777777'
    }

})


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    }
});


export default PDFMerge;
