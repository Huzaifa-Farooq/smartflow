import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { View, Text, Animated, RefreshControl, TouchableHighlight, Dimensions, Alert, FlatList } from 'react-native';
import SearchBar from "react-native-dynamic-search-bar";
import AnimatedIcon from './AnimatedIcon';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';

import { StyleSheet, } from 'react-native';
import FileViewer from "react-native-file-viewer";
import { DocumentItem } from './DocumentItem';
import { getFileIcon, formatSize, searchFilesArray, loadFiles, sortFilesArray } from '../utils/utils.mjs';
import { animatedFilesListViewStyle } from '../styles/styles';


const height = Dimensions.get('window').height;


export const ListEmptyComponent = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '50%' }}>
            <MaterialCommunityIcons color={'#dedcdc'} name='file-search' size={100} />
            <Text style={{ color: '#9c9a9a', fontWeight: 'bold', fontSize: 20 }}>No files found.</Text>
        </View>
    )
}

export const ListFooterComponent = ({ height }) => {
    return (
        <View style={{ height: height }}>
        </View>
    )
}


export const RefreshControlComponent = ({ refreshing, onRefresh }) => {
    return (
        <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#deb018"
        />
    )
}


export const CustomSearchBarView = ({ onChangeText, onClearPress, search, viewStyle, searchBarStyle }) => {
    return (
        <Animated.View
            style={{
                width: '100%',
                marginTop: 10,
                paddingBottom: 10,
                marginBottom: 10,
                height: 30,
                zIndex: 1,
                ...viewStyle
            }}
        >
            <SearchBar
                style={{
                    marginTop: 10,
                    borderRadius: 50,
                    ...searchBarStyle
                }}
                placeholder="Search"
                onChangeText={(text) => onChangeText(text)}
                onClearPress={() => onClearPress("")}
                clearIconComponent={search ? null : <></>}
                searchIconImageStyle={{ tintColor: 'black' }}
                clearIconImageStyle={{ tintColor: 'black' }}
            />
        </Animated.View>
    )
}


export const FileLoadingComponent = () => {
    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                height: height
            }}
        >
            <AnimatedIcon name='fileSearch' style={{ width: 150, height: 150 }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>Loading...</Text>
        </View>
    )
};



export default FilesListComponent = ({
    navigation,
    directories,
    onFileClick,
    renderItem,
    listFooterHeight = 20,
    CustomListFooter,
    required_ext = ['*']
}) => {
    const [result, setResult] = useState([]);
    const [search, setSearch] = useState('');
    const [initialLoading, setInitialLoading] = useState(true);
    const [loading, setLoading] = useState(true);

    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        try {
            folderReader();
        } catch (e) {
            console.log('==== Error reading directories ====');
            console.log('Error: ' + e);
        }

        const timer = setTimeout(() => {
            setInitialLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [directories]);

    const folderReader = async () => {
        setLoading(true);
        const results = await Promise.all(directories.map(async directory => {
            return await loadFiles({
                directoryPath: directory,
                required_ext: required_ext
            });
        }));
        // removing duplicated items with path key
        const dupeFilteredResults = results.flat().filter((item, index, self) =>
            index === self.findIndex((t) => (
                t.path === item.path
            ))
        );

        const filteredResults = [];
        // If there are files with duplicated names, keep the one that has 'content' in their path
        dupeFilteredResults.forEach((item) => {
            if (filteredResults.some((file) => file.name === item.name)) {
                const index = filteredResults.findIndex((file) => file.name === item.name);
                if (item.path.includes('content')) {
                    filteredResults[index] = item;
                }
            } else {
                filteredResults.push(item);
            }
        });

        setResult(sortFilesArray({
            files: filteredResults,
            sortBy: 'date',
            reversed: true
        }));
        
        setLoading(false);
    };

    if (!onFileClick) {
        onFileClick = ({ name, path }) => {
            if (path.endsWith('.pdf')) {
                navigation.navigate('DocViewer', { path, name })
            } else {
                    FileViewer.open(path, { showOpenWithDialog: true })
                    .then()
                    .catch((error) => {
                    Alert.alert(
                        "No Associated App",
                        "There is no app associated with this file type. Please download appropriate viewer to open it.",
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );
                })
            }
        }
    }

    const onDelete = (filePath) => {
        RNFetchBlob.fs.unlink(filePath)
            .then(() => {
                setResult(result.filter((file) => file.path !== filePath));
            })
            .catch((error) => console.error(error));
    }

    if (!renderItem) {
        renderItem = ({ item, index }) => {
            return (
                <TouchableHighlight
                    underlayColor={''}
                    onPress={() => { onFileClick(item) }}
                    onLongPress={() => handleLongPress(item.path, onDelete)}
                >
                    <DocumentItem
                        iconSrc={getFileIcon(item.name)}
                        title={item.name}
                        size={formatSize(item.size)}
                        filePath={item.path}
                    />
                </TouchableHighlight>
            )
        }
    };


    const files = useMemo(() => {
        let f = search ? searchFilesArray({ files: result, query: search }) : result;
        f = sortFilesArray({ files: f, mode: 'date', reversed: true });
        return f;
    }, [search, result]);


    if (initialLoading) {
        return (
            <FileLoadingComponent />
        )
    }

    return (
        <>
            <CustomSearchBarView
                onChangeText={(text) => setSearch(text)}
                onClearPress={() => setSearch('')}
                search={search}
            // viewStyle={{ transform: [{ translateY }] }}
            // searchBarStyle={{ opacity: opacity }}
            />
            {loading && <FileLoadingComponent />}

            <View style={animatedFilesListViewStyle}>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            tintColor="#deb018"
                            onRefresh={() => { folderReader() }}
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
                    ListFooterComponent={
                        CustomListFooter ? CustomListFooter : <ListFooterComponent height={listFooterHeight} />
                    }
                    renderItem={({ item, index }) => renderItem({ item, index, onLongPress: () => handleLongPress(item.path, onDelete) })}
                    initialNumToRender={10}
                    maxToRenderPerBatch={8}
                    windowSize={4}
                />
            </View>
        </>
    );
};


export const onShare = async (filePath) => {
    filePath = filePath.replace(/ /g, '%20');
    const options = {
        title: 'Share',
        message: 'Sent via Smartflow',
        url: `file://${filePath}`
    };
    try {
        const result = await Share.open(options);
        console.log(`Result: ${JSON.stringify(result)}`);
    } catch (error) {
        console.log(error);
    }
};

const deleteFile = (filePath, onDelete) => {
    Alert.alert(
        "Delete File",
        "Are you sure you want to delete this file?",
        [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
            },
            {
                text: "Delete",
                onPress: () => { onDelete(filePath) }
            }
        ]
    )
}

export const handleLongPress = (filePath, onDelete) => {
    Alert.alert(
        "File Options",
        "Choose an option",
        [
            {
                text: "Share",
                onPress: () => { onShare(filePath) }
            },
            {
                text: "Delete",
                onPress: () => { deleteFile(filePath, onDelete) }
            },
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            }
        ]
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: '#00B0F0',
        width: 130,
        height: 60,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
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
