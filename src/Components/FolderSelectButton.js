import { FloatingButton } from './FileSelectButton';

import React from 'react';
import {
    Alert,
    StyleSheet, 
    View, 
} from 'react-native';
import { openDocumentTree } from 'react-native-saf-x';

import { saveFoldersToScan } from '../utils/utils.mjs';



const FolderSelectButton = ({ onFolderSelect, type }) => {
    const handlePress = async () => {
        try {
            const result = await openDocumentTree(true);
            if (result) {
                const folderUri = result.uri;
                console.log('Selected folder:', folderUri);
                
                // Save the folder path to AsyncStorage
                saveFoldersToScan([folderUri]);

                // Call the onFolderSelect callback if provided
                if (onFolderSelect) {
                    onFolderSelect(folderUri);
                }
            }
        } catch (err) {
            console.error('Error selecting folder:', err);
            Alert.alert('Error!', 'You need to select a specific folder to scan for files.');
        }
    };

    return (
        <FloatingButton
            onPress={handlePress}
            iconName={'folder-plus'}
            type={type}
        />
    );
};


export default FolderSelectButton;
