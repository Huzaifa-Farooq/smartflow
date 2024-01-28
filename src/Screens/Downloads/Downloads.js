//import libraries
import CustomHeader from '../../Components/CustomHeader';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, PermissionsAndroid } from 'react-native'
import { React, useState, useEffect } from 'react'
import RNFS from 'react-native-fs'
import FileViewer from "react-native-file-viewer";
import Banner from '../../Components/BannersAd/Banner';

import { DocumentItem } from '../../Components/DocumentItem';
import { getFileIcon, formatSize } from '../../utils/utils.mjs';


// create a component
const Downloads = ({ navigation }) => {
    const [result, setresult] = useState([]);
    useEffect(() => {
        folderReader();
    }, [])

    const folderReader = async () => {
        const file = RNFS.DownloadDirectoryPath + '/SmartFlow';
        const result = RNFS.readDir(file).then(res => {
            console.log(res);
            setresult(res);
            console.log(result);
            console.log(RNFS.DownloadDirectoryPath + '/SmartFlow')
        }).catch(error => {
            console.log(error);
        })
    };

    const Fileopener = (path) => {
        const display = FileViewer.open(path);
    };

    return (
        <View style={styles.container}>
            <CustomHeader title={'Downloads'}
                icon={"keyboard-backspace"}
                onPress={() => navigation.goBack()}
            />
            <View style={{height:'79%', margin: 10, paddingTop: 2, borderWidth:2, borderColor:'#e1ebe4', borderRadius: 10 }}>
                <FlatList data={result} renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity onPress={() => { Fileopener(item.path) }}>
                            <DocumentItem iconSrc={getFileIcon(item.name)} title={item.name} size={formatSize(item)} />
                        </TouchableOpacity>
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
