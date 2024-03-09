import React, { Fragment, Component, useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Dimensions,
  Animated,
  RefreshControl,
  TouchableHighlight,
  Platform,
  PermissionsAndroid,
  Alert,
  View,
} from 'react-native';
import Share from 'react-native-share';

import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import { FloatingButton } from '../../Components/FileSelectButton';

import DocumentScanner from 'react-native-document-scanner-plugin'
import CustomHeader from '../../Components/CustomHeader';
import FilesListComponent from '../../Components/FilesList';


const Header = ({ navigation }) => {
  return (
    <CustomHeader title={'Scanner'}
      icon={"keyboard-backspace"}
      onPress={() => navigation.goBack()}
    />
  )
};


const SCANNER_DOCUMENT_PATH = RNFS.DownloadDirectoryPath + '/SmartFlow/ScannerDocuments';


export default Scanner = ({ router, navigation }) => {
  const scanDocument = async () => {
    // prompt user to accept camera permission request if they haven't already
    if (Platform.OS === 'android' && await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    ) !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Error', 'User must grant camera permissions to use document scanner.')
      return
    }
    // start the document scanner
    const { scannedImages, status } = await DocumentScanner.scanDocument({
      maxNumDocuments: 0,
      letUserAdjustCrop: true,
      croppedImageQuality: 50
    });

    if (status == 'success' && scannedImages && scannedImages.length > 0) {
      navigation.navigate('FilterSelectOption', { scannedImagesList: scannedImages });
    }
  }


  useEffect(() => {
    RNFS.mkdir(SCANNER_DOCUMENT_PATH);
  }, [])


  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <FilesListComponent
        navigation={navigation}
        directories={[SCANNER_DOCUMENT_PATH]}
      />
      <FloatingButton
        iconName={'camera'}
        onPress={scanDocument}
      />
    </View>

  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
