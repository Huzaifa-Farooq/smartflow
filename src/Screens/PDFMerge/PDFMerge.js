//import libraries
import CustomHeader from '../../Components/CustomHeader';
import {
    StyleSheet, Text, View, FlatList, Animated, TouchableHighlight, Dimensions, ScrollView,
    RefreshControl
} from 'react-native';
import { React, useState, useEffect, useRef } from 'react';
import RNFS from 'react-native-fs';
import FileViewer from "react-native-file-viewer";
import Banner from '../../Components/BannersAd/Banner';

import { DocumentItem } from '../../Components/DocumentItem';
import { getFileIcon, formatSize, searchFilesArray, loadFiles, sortFilesArray } from '../../utils/utils.mjs';
import { pdfMerge } from '../../utils/pdfMerge';

import ErrorDialog from '../../Components/ErrorDialog';
import PDFMergerProgressModal from '../../Components/PDFMergerProgressModal';

import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { animatedFilesListViewStyle } from '../../styles/styles';

import { ListEmptyComponent, FileLoadingComponent, ListFooterComponent, CustomSearchBarView } from '../../Components/FilesList';


// create a component
const PDFMerge = ({ navigation }) => {
    const [result, setresult] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [completed, setCompleted] = useState(false);
    const [mergeInProgress, setMergeInProgress] = useState(false);
    const [progressMessage, setProgressMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const scrollY = useRef(new Animated.Value(0)).current;
    const diffClamp = Animated.diffClamp(scrollY, 0, 100);

    const MAX_FILES = 5;

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
        folderReader();
    }, [])

    const folderReader = async () => {
        setLoading(true);
        const directory = RNFS.DownloadDirectoryPath + '/SmartFlow';
        const result = await loadFiles({ directoryPath: directory, required_ext: ['.pdf'] });
        setresult(sortFilesArray({
            files: result,
            sortBy: 'date',
            reversed: true
        }));
        setLoading(false);
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

        // merged-datetime in DD-MM-YYYY HH-MM-SS format
        const datetime = new Date().toLocaleString().replace(/:/g, '-').replace(/\//g, '-').replace(/,/g, '');
        const defaultFilename = 'merged-' + datetime + '.pdf';
        const filePath = RNFS.DownloadDirectoryPath + '/SmartFlow/' + defaultFilename;

        pdfMerge({
            files: selectedFiles,
            outputFilePath: filePath,
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
            progressUpdateString: (message) => {
                setProgressMessage(message);
            }
        });
    }

    const files = search ? searchFilesArray({ files: result, query: search }) : result;

    const renderListItem = ({ item, index }) => {
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
    }

    return (
        <View style={styles.container}>
            <CustomHeader
                title={'PDFMerger'}
                icon={"keyboard-backspace"}
                onPress={() => navigation.goBack()}
            />
            <CustomSearchBarView
                onChangeText={(text) => setSearch(text)}
                onClearPress={() => setSearch('')}
                search={search}
                viewStyle={{ transform: [{ translateY }] }}
                searchBarStyle={{ opacity: opacity }}
            />

            {
                loading && <FileLoadingComponent />
            }

            <View
                style={animatedFilesListViewStyle}
            >
                <Animated.FlatList 
                    style={{ marginTop }}
                    refreshControl={
                        <RefreshControl
                            tintColor="#deb018"
                            onRefresh={() => {folderReader()}}
                            refreshing={false}
                        />
                    }
                    bounces={true}
                    data={files}
                    onScroll={(e) => {
                        if (e.nativeEvent.contentOffset.y > 0)
                            scrollY.setValue(e.nativeEvent.contentOffset.y);
                    }}
                    ListEmptyComponent={loading ? null : <ListEmptyComponent />}
                    ListFooterComponent={<ListFooterComponent height={selectedFiles.length > 0 ? 50 : 10} />}
                    renderItem={renderListItem}
                />

                {
                    selectedFiles.length > 1 && (
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
                        text={progressMessage}
                        iconName={'wait'}
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
                position: 'absolute',
                bottom: 0,
                width: '100%',
                flexDirection: 'row',

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
