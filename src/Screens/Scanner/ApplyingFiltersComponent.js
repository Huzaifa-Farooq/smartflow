import { FlatList } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';
import { Filter } from './Filters';
import { Image, Text, Platform, TouchableOpacity, TextInput, View, Button } from 'react-native'
import SubScreenHeader from '../../Components/SubScreenHeader';
import RNFS from 'react-native-fs';
import { useState } from 'react';
import FileViewer from "react-native-file-viewer";
import { createImagesPDF } from './utils';
import ProgressModal from './ProgressModal';
import { useMemo } from 'react';
import React from 'react';
import '../../utils/global.js';


const screenWidth = Dimensions.get('window').width;
const numColumns = 3;
const itemSize = (screenWidth / numColumns) - 20;


const SCANNER_DOCUMENT_PATH = global.SCANNER_DOCUMENT_PATH;


const FileNameInputTag = ({ txt, onChangeText }) => {
    return (
        <TextInput
            multiline={false}
            placeholder={txt}
            placeholderTextColor='#777777'
            value={txt}
            onChangeText={onChangeText}
            editable={true}
            style={{
                fontSize: 18,
                fontWeight: 'bold',
                borderBottomWidth: txt ? 1 : null,
                borderStyle: txt ? 'dotted' : null,
                margin: 0,
                padding: 0,
                color: 'black',
            }}
        />
    )
}

export default ApplyingFiltersComponent = ({ route, navigation }) => {
    const { filterName, scannedImagesList } = route.params;

    const [filteredImages, setFilteredImages] = useState([])
    const [processedImagesCount, setProcessedImagesCount] = useState(0);
    const [outputPDFPath, setOutputPDFPath] = useState('');
    const [pdfInProgress, setPdfInProgress] = useState(false);
    const [fileName, setFileName] = useState('Scanner-' + Date.now());

    const onUserAction = (confirmed) => {
        if (confirmed && !pdfInProgress) {
            setPdfInProgress(true);

            let images;
            if (!filteredImages.length && filterName === 'Original') {
                images = scannedImagesList;
            } else {
                console.log(filteredImages);
                // sorting images as they appear in scannedImagesList and selecting only the dstURI
                const sortedImages = [...filteredImages].sort((a, b) => {
                    const indexA = scannedImagesList.indexOf(a[0]);
                    const indexB = scannedImagesList.indexOf(b[0]);
                    return indexA - indexB;
                });
                // selecting only the dstURI
                images = sortedImages.map(([srcURI, dstURI]) => dstURI);
            }

            const outputFilePath = SCANNER_DOCUMENT_PATH + '/' + fileName + '.pdf';

            // printing size of each file im MBs
            // images.forEach((image) => {
            //     RNFS.stat(image).then((stats) => {
            //         console.log('File size: ' + stats.size / (1024 * 1024) + ' MB');
            //     });
            // });

            createImagesPDF({
                images: images,
                outputFilePath: outputFilePath,
                successCallback: (outputFilePath) => {
                    console.log('Created file');
                    setPdfInProgress(false);
                    navigation.navigate('Scanner', { refresh: true });
                    // navigate to DocViewer
                    navigation.navigate('DocViewer', { path: outputFilePath, name: outputFilePath.split('/').pop() })
                },
                errorCallback: (error) => {
                    setPdfInProgress(false)
                    console.log('Error creating PDF', error);
                },
                onImageProcessingCompletion: () => {
                    console.log('====================================');
                    console.log('Image processed ' + processedImagesCount);
                    console.log('====================================');
                    setProcessedImagesCount(prevCount => prevCount + 1);
                },
                onPDFCreationStart: (path) => {
                    setOutputPDFPath(path);
                }
            });

        } else {
            navigation.goBack();
        }
    };

    const onExtractImage = ({ srcURI, dstURI }) => {
        // saving both srcURI and dstURI images to Downloads directory
        const srcPath = `${RNFS.TemporaryDirectoryPath}/${srcURI.split('/').pop()}`;
        const dstPath = `${RNFS.TemporaryDirectoryPath}/${dstURI.split('/').pop()}`;

        RNFS.copyFile(srcURI, srcPath).then(() => {
            console.log('Copied image', srcURI, ' at: ' + srcPath);
        }).catch((error) => {
            console.log('Error copying image', srcURI, ' at: ' + srcPath, error);
        });
        RNFS.copyFile(dstURI, dstPath).then(() => {
            console.log('Copied image', dstURI, ' at: ' + dstPath);
        }).catch((error) => {
            console.log('Error copying image', dstURI, ' at: ' + dstPath, error);
        });

        console.log('Extracted image', srcURI, ' at: ' + dstURI);
        setFilteredImages([...filteredImages, [srcURI, dstURI]]);
    }

    // Define a memoized version of renderItem
    const renderItem = useMemo(() => {
        return ({ item: scannedImage, index }) => {
            return (
                <View style={styles.item}>
                    <ImageFilterComponent
                        key={index}
                        filterName={filterName}
                        imagePath={scannedImage}
                        onExtractImage={(event) => {
                            if (event.nativeEvent.uri) {
                                onExtractImage({
                                    srcURI: scannedImage,
                                    dstURI: event.nativeEvent.uri
                                })
                            }
                        }}
                    />
                </View>
            )
        }
    }, [filterName, onExtractImage]);

    <FlatList
        data={scannedImagesList}
        numColumns={numColumns}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        contentContainerStyle={{ justifyContent: 'space-between' }}
    />

    return (
        <View style={{ flex: 1 }}>
            <SubScreenHeader
                titleElement={
                    <FileNameInputTag
                        txt={fileName}
                        onChangeText={(txt) => {
                            setFileName(txt);
                        }}
                    />
                }
                icon={"keyboard-backspace"}
                onPress={() => navigation.goBack()}
            />
            <View style={{ flex: 1, padding: 5 }} >
                {
                    (pdfInProgress && !outputPDFPath) && (
                        <ProgressModal
                            progress={processedImagesCount / scannedImagesList.length}
                            text={`Processing ${processedImagesCount + 1} of ${scannedImagesList.length} images...`}
                        />
                    )
                }
                <FlatList
                    data={scannedImagesList}
                    numColumns={numColumns}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ justifyContent: 'space-between' }}
                />
                <View style={{
                    marginTop: 20,
                    marginBottom: 20,
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                }}>
                    <CustomButton isPrimary={true} title="Cancel" onPress={() => onUserAction(false)} />
                    <CustomButton title="Confirm" onPress={() => onUserAction(true)} />
                </View>
            </View>
        </View>
    )
}


const CustomButton = ({ onPress, title, isPrimary }) => {
    return (
        <TouchableOpacity
            style={
                [
                    styles.button,
                    isPrimary ? styles.buttonPrimary : styles.buttonDefault
                ]
            }
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
}

// component to display an image with a filter applying or applied
const ImageFilterComponent = ({ filterName, imagePath, onExtractImage }) => {
    const imageSource = { uri: imagePath };
    return (
        <Filter
            filterName={filterName}
            imageSource={imageSource}
            style={styles.image}
            onExtractImage={onExtractImage}
        />
    );
}



const styles = StyleSheet.create({
    item: {
        width: itemSize,
        height: itemSize,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    image: {
        width: itemSize,
        height: itemSize,
        borderRadius: 5,
    },
    button: {
        width: '30%',
        padding: 10,
        alignSelf: 'center',
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonPrimary: {
        backgroundColor: 'lightblue'
    },
    buttonDefault: {
        backgroundColor: 'skyblue',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
    }
});
