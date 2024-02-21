import React from 'react';
import {
    StyleSheet, Text, View, FlatList, PermissionsAndroid, TouchableHighlight, TouchableOpacity,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';


const window = Dimensions.get('window');

export default FileSelectButton = ({ onFileSelect, allowedTypes, allowMultiSelection = false }) => {
    if (allowedTypes === undefined) {
        allowedTypes = DocumentPicker.types.allFiles;
    }

    const handlePress = async () => {
        try {
            const files = await DocumentPicker.pick({
                type: allowedTypes,
                allowMultiSelection: allowMultiSelection
            });
            onFileSelect(files[0]);
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
        <TouchableOpacity
            style={styles.floatingButton}
            onPress={handlePress}
        >
            <View style={styles.iconView}>
                <MaterialCommunityIcons name="file" size={30} color="white" />
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
        width: 60,
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 15,
        zIndex: 1000
    },
    iconView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        justifyContent: 'space-around',
        marginHorizontal: 10,
        marginVertical: 2
    },
});