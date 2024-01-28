//import liraries
import { StyleSheet, Text, View, TouchableOpacity, FlatList, PermissionsAndroid, Image, ActivityIndicator } from 'react-native'
import { React, useState, useEffect , useRef , useCallback} from 'react'
import RNFS from 'react-native-fs';
import CustomHeader from '../../Components/CustomHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import RBSheet from "react-native-raw-bottom-sheet";
import Banner from '../../Components/BannersAd/Banner';


import { DocumentItem } from '../../Components/DocumentItem';
import { getFileIcon, formatSize } from '../../utils/utils.mjs';


// create a component
const Notes = ({ navigation }) => {
    const bottomSheetRef = useRef();
    const openBottomSheet = () => {
        if (bottomSheetRef.current) {
            bottomSheetRef.current.open();
        }
    };

    const [pptFiles, setPptFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        requestPermission();
    }, []);

    const requestPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission',
                    message:
                        'Apps need to access storage ',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("granted")
                fetchPptFiles();
            } else {
                console.log('Storage permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const fetchPptFiles = async () => {
        const files = await listPptFiles();
        setPptFiles(files);
        setLoading(false);
    };

    const listPptFiles = useCallback(async (directoryPath = RNFS.ExternalStorageDirectoryPath) => {
        const fileNames = await RNFS.readDir(directoryPath);
        const requiredFiles = [];
        const visitedDirectories = [];

        // Use Promise.all to parallelize file processing for better performance
        await Promise.all(fileNames.map(async (file) => {
            if (file && file.isFile() && (file.name.endsWith('.ppt') || file.name.endsWith('.pptx'))) {
                requiredFiles.push(file);
                // Update state as soon as a file is found
                setPptFiles((prevFiles) => [...prevFiles, file]);
            } else if (file.isDirectory()) {
                // checking if the directory is already visited or not
                if (visitedDirectories.includes(file.path)){
                    console.log('Already visited directory: ', file.path)
                    return;
                }
                else{
                    visitedDirectories.push(file.path);
                    const subFiles = await listPptFiles(file.path);
                    requiredFiles.push(...subFiles);
                }
            }
        }));

        return requiredFiles;
    }, []);

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
    if (loading && pptFiles.length === 0){
        return (
            <View style={styles.container}>
                <CustomHeader title={'Notes'}
                    icon={"keyboard-backspace"}
                    onPress={() => navigation.goBack()}
                />
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size='large' />
                    <Text style={{fontSize:20, fontWeight:'bold'}}>Loading...</Text>
                </View>
            </View>
        )
    }
    // if loading is true and and files are found, then show loading indicator below the files
    // if loading is false and files are found, then show files without loading indicator
    else{
        return (
            <View style={styles.container}>
                <CustomHeader title={'Notes'}
                    icon={"keyboard-backspace"}
                    onPress={() => navigation.goBack()}
                />
                <View style={{height:'79%', margin: 10, paddingTop: 2, borderWidth:2, borderColor:'#e1ebe4', borderRadius: 10 }}>
                    <FlatList data={pptFiles} renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => {}}>
                                <DocumentItem iconSrc={getFileIcon(item.name)} title={item.name} size={formatSize(item)} />
                            </TouchableOpacity>
                        )
                    }} />
                    {
                        (loading && pptFiles.length > 0) && (
                                <View style={{justifyContent:'center', alignItems:'center'}}>
                                    <ActivityIndicator size='small' color='black' />
                                    <Text style={{fontSize: 11, fontWeight:'bold'}}>Loading...</Text>
                                </View>
                        )
                    }
                </View>
                

                <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={openBottomSheet}
                >
                    <Text style={styles.text}>Show Options</Text>

                </TouchableOpacity>
                <View style={{ flex:1 , justifyContent:'flex-end'}}>
                    <Banner/>
                </View>    
                <RBSheet
                    ref={bottomSheetRef}
                    height={200}
                    openDuration={250}
                    closeOnDragDown={true}
                    closeOnPressMask={false}
                    customStyles={{
                        container: {
                            borderTopRightRadius: 30,
                            borderTopLeftRadius: 30,

                        }
                    }}
                >
                    <View style={{ margin: 10 }}>
                        <View style={styles.iconView}>
                            <MaterialCommunityIcons name={"hand-pointing-right"} size={36} color={'blue'} />
                            <TouchableOpacity><Text style={[styles.RBText,{color:'blue'}]}>Detail Note</Text></TouchableOpacity>
                        </View>

                        <View style={styles.iconView}>
                            <MaterialCommunityIcons name={"hand-pointing-right"} size={36} color={'red'} />
                            <TouchableOpacity><Text style={[styles.RBText,{color:'red'}]}>Main Point</Text></TouchableOpacity>
                        </View>

                        <View style={styles.iconView}>
                            <MaterialCommunityIcons name={"hand-pointing-right"} size={36} color={'green'} />
                            <TouchableOpacity><Text style={[styles.RBText,{color:'green'}]}>Summary</Text></TouchableOpacity>
                        </View>

                    </View>


                </RBSheet>
            </View>
        );
    }
};


const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    floatingButton: {
        position: 'absolute',
        bottom: 65,
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
        marginHorizontal:10,
        marginVertical:2

    },
    RBText: {
        fontSize: 26,
        color: '#000',
        fontWeight: 'bold'

    }
});


export default Notes;
