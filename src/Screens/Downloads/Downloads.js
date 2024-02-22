//import libraries
import CustomHeader from '../../Components/CustomHeader';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Pressable, TouchableHighlight, Image, PermissionsAndroid } from 'react-native'
import { React, useState, useEffect } from 'react'
import RNFS from 'react-native-fs'
import FileViewer from "react-native-file-viewer";
import Banner from '../../Components/BannersAd/Banner';

import { DocumentItem } from '../../Components/DocumentItem';
import { getFileIcon, formatSize, searchFilesArray, loadFiles, sortFilesArray } from '../../utils/utils.mjs';
import SearchBar from "react-native-dynamic-search-bar";


// create a component
const Downloads = ({ navigation }) => {
    const [result, setresult] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        folderReader();
    }, [])

    const folderReader = async () => {
        const directory = RNFS.DownloadDirectoryPath + '/SmartFlow';
        const result = await loadFiles({ directoryPath: directory });
        setresult(sortFilesArray({
            files: result,
            sortBy: 'date',
            reversed: true

        }));
    };

    const Fileopener = (path) => {
        const display = FileViewer.open(path, { showOpenWithDialog: true })
    };

    const files = search ? searchFilesArray({ files: result, query: search }) : result;

    return (
        <View style={styles.container}>
            <CustomHeader title={'Downloads'}
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
                    ListEmptyComponent={() => (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                            <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 20 }}>No files found.</Text>
                        </View>
                    )}
                    data={files}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableHighlight underlayColor={''} onPress={() => { Fileopener(item.path) }}>
                                <DocumentItem iconSrc={getFileIcon(item.name)} title={item.name} size={formatSize(item.size)} />
                            </TouchableHighlight>
                        )
                    }} />
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
