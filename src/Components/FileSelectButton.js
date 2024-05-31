import React from 'react';
import {
    StyleSheet, 
    View, 
    TouchableOpacity, 
    Dimensions,
    Image
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import { openDocument } from 'react-native-saf-x';
import '../utils/global.js';


const window = Dimensions.get('window');

export default FileSelectButton = ({ onFileSelect, allowedTypes, allowMultiSelection = false }) => {
    if (allowedTypes === undefined) {
        allowedTypes = DocumentPicker.types.allFiles;
    }

    const handlePress = async () => {
        try {
            const file = await DocumentPicker.pickSingle({
                type: allowedTypes,
                // mode: 'import',
                // copyTo: 'documentDirectory',
                allowMultiSelection: allowMultiSelection,
                transitionStyle: 'coverVertical',
            });
            console.log(file)
            onFileSelect(file);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('====================================');
                console.log('User cancelled the file selection');
                console.log('====================================');
                return;
            }
            else {
                console.log('====================================');
                console.error(err);
                console.log('====================================');
            }
        }
    };

    return (
        <FloatingButton
            onPress={handlePress}
            image={require('../assets/Images/FlatButton.png')}
        />
    )
};


export const FloatingButton = ({ onPress, image , iconName }) => {
    return (
        <TouchableOpacity
            style={styles.floatingButton}
            onPress={onPress}
        >
            <View style={styles.iconView}>
                {iconName?<MaterialCommunityIcons name={iconName} size={30} color="white" />:<Image source={image} 
                style={styles.image}
                ></Image>}
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    floatingButton: {
        backgroundColor: '#deb018',
        position: 'absolute',
        alignSelf: 'flex-end',
        bottom: 30,
        right: 25,
        width: 65,
        height: 65,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 15,
        zIndex: 1000
    },
    iconView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 10,
        marginVertical: 2
    },
    image:{
        width: 50,
        height: 50,
        resizeMode: 'contain',  
    }
});