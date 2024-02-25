//import libraries
import CustomHeader from '../../Components/CustomHeader';
import { StyleSheet, Text, View, TouchableHighlight, Animated, RefreshControl } from 'react-native';
import { React, useState, useEffect, useRef } from 'react';
import RNFS from 'react-native-fs'
import FileViewer from "react-native-file-viewer";
import Banner from '../../Components/BannersAd/Banner';

import { DocumentItem } from '../../Components/DocumentItem';
import { getFileIcon, formatSize, searchFilesArray, loadFiles, sortFilesArray } from '../../utils/utils.mjs';
import SearchBar from "react-native-dynamic-search-bar";
import { ListEmptyComponent, CustomSearchBarView, ListFooterComponent, FileLoadingComponent } from '../../Components/FilesList';
import { animatedFilesListViewStyle } from '../../styles/styles';



// create a component
const Downloads = ({ navigation }) => {
    const [result, setresult] = useState([]);
    const [search, setSearch] = useState('');
    const [initialLoading, setInitialLoading] = useState(true);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        folderReader();
    }, [])

    const folderReader = async () => {
        setLoading(true);
        const directory = RNFS.DownloadDirectoryPath + '/SmartFlow';
        const result = await loadFiles({ directoryPath: directory });
        setresult(sortFilesArray({
            files: result,
            sortBy: 'date',
            reversed: true
        }));
        setLoading(false);
    };

    const Fileopener = (path) => {
        const display = FileViewer.open(path, { showOpenWithDialog: true })
    };

    const renderListItem = ({ item, index }) => {
        return (
            <TouchableHighlight underlayColor={''} onPress={() => { Fileopener(item.path) }}>
                <DocumentItem iconSrc={getFileIcon(item.name)} title={item.name} size={formatSize(item.size)} />
            </TouchableHighlight>
        )
    }

    const files = search ? searchFilesArray({ files: result, query: search }) : result;

    if (initialLoading) {
        return (
            <View style={styles.container}>
                <CustomHeader title={'Downloads'}
                    icon={"keyboard-backspace"}
                    onPress={() => navigation.goBack()}
                />
                <FileLoadingComponent />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <CustomHeader title={'Downloads'}
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
            { loading && <FileLoadingComponent /> }
            <View style={animatedFilesListViewStyle}>
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
                    ListEmptyComponent={<ListEmptyComponent />}
                    ListFooterComponent={<ListFooterComponent height={20} />}
                    renderItem={renderListItem}
                />
            </View>

            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Banner />
            </View>
        </View>
    );
};


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


export default Downloads;
