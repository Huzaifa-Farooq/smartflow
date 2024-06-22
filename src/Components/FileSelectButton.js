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
                console.log('User cancelled the file selection');
                return;
            }
            else {
                console.error(err);
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


export const FloatingButton = ({ onPress, image, iconName, type = 'primary' }) => {
    const isSecondary = type === 'secondary';
    return (
        <TouchableOpacity
            style={[
                styles.floatingButton,
                isSecondary ? styles.floatingButtonSecondary : styles.floatingButtonPrimary
            ]}
            onPress={onPress}
        >
            <View>
                {
                    iconName ? (
                        <MaterialCommunityIcons name={iconName} size={30} color="white" />
                    ) : (
                        <Image source={image} style={styles.image}></Image>
                    )
                }
            </View>
        </TouchableOpacity>
    )
};

export const BottomRightStackComponent = ({ components }) => {
    return (
        <View style={styles.container}>
            {
                components.map((component, index) => {
                    return (
                        <View key={index} style={styles.componentStyle}>
                            {component}
                        </View>
                    )
                
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        backgroundColor: '#deb018',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        elevation: 15,
        zIndex: 1000
    },
    floatingButtonPrimary: {
        width: 65,
        height: 65,
    },
    floatingButtonSecondary: {
        width: 50,
        height: 50,
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        right: 10,
    },
    componentStyle: {
        marginBottom: 10,
    },
});

