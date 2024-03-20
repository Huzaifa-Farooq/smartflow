//import libraries
import CustomHeader from '../../Components/CustomHeader';
import {
    StyleSheet, Text, View, Animated, TouchableHighlight, Dimensions, ScrollView,
    RefreshControl
} from 'react-native';
import { React, useState, useEffect, useRef } from 'react';
import RNFS from 'react-native-fs';
import FileViewer from "react-native-file-viewer";
import Banner from '../../Components/BannersAd/Banner';

import { DocumentItem } from '../../Components/DocumentItem';
import { getFileIcon, formatSize } from '../../utils/utils.mjs';
import { pdfMerge } from '../../utils/pdfMerge';

import ErrorDialog from '../../Components/ErrorDialog';
import PDFMergerProgressModal from '../../Components/PDFMergerProgressModal';

import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import FilesListComponent, { handleLongPress } from '../../Components/FilesList';


// create a component
const PDFMerge = ({ navigation }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [error, setError] = useState('');
    const [completed, setCompleted] = useState(false);
    const [mergeInProgress, setMergeInProgress] = useState(false);
    const [progressMessage, setProgressMessage] = useState('');

    const MAX_FILES = 5;

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

        const defaultFilename = 'Merged-' + Date.now() + '.pdf';
        const filePath = RNFS.DownloadDirectoryPath + '/SmartFlow/' + defaultFilename;

        pdfMerge({
            files: selectedFiles,
            outputFilePath: filePath,
            successCallback: (filePath) => {
                const filename = filePath.split('/').pop();
                setCompleted(true);
                setTimeout(() => {
                    navigation.navigate('Downloads');
                    FileViewer.open(filePath, { showOpenWithDialog: true });
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

    const renderItem = ({ item, index, onLongPress }) => {
        const isSelected = selectedFiles.indexOf(item.path) !== -1;
        const selectedOrder = selectedFiles.indexOf(item.path) + 1;
        return (
            <TouchableHighlight
                underlayColor={''}
                onPress={() => { updateSelectedFiles(item) }}
                onLongPress={onLongPress}
            >
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
                title={'PDF Merger'}
                icon={"keyboard-backspace"}
                onPress={() => navigation.goBack()}
            />

            <FilesListComponent
                navigation={navigation}
                directories={[
                    RNFS.DownloadDirectoryPath + '/SmartFlow', 
                    RNFS.DocumentDirectoryPath,
                    '/storage/emulated/0/WhatsApp/'
                ]}
                renderItem={renderItem}
                required_ext={['.pdf']}
                listFooterHeight={selectedFiles.length > 0 ? 70 : 10}
            />

            {
                selectedFiles.length > 1 && (
                    <BottomDockedPanel
                        onCancelPress={() => setSelectedFiles([])}
                        onMergePress={() => mergePDFS()}
                    />
                )
            }

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
