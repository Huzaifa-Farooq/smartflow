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
  View
} from 'react-native';

import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import { FloatingButton } from '../../Components/FileSelectButton';
import FileViewer from "react-native-file-viewer";
import { createImagesPDF } from './utils';
import Filters from './Filters';
import { getFileIcon, formatSize, searchFilesArray, loadFiles, sortFilesArray } from '../../utils/utils.mjs';
import { DocumentItem } from '../../Components/DocumentItem';

import DocumentScanner from 'react-native-document-scanner-plugin'
import CustomHeader from '../../Components/CustomHeader';
import ApplyingFiltersComponent from './ApplyingFiltersComponent';
import { ListEmptyComponent, CustomSearchBarView, ListFooterComponent, FileLoadingComponent } from '../../Components/FilesList';
import { animatedFilesListViewStyle } from '../../styles/styles';


const Header = ({ navigation }) => {
  return (
    <CustomHeader title={'Scanner'}
      icon={"keyboard-backspace"}
      onPress={() => navigation.goBack()}
    />
  )
};


const SCANNER_DOCUMENT_PATH = RNFS.ExternalDirectoryPath + '/SmartFlow/ScannerDocuments';


export default Scanner = ({ navigation }) => {
  const [result, setresult] = useState([]);
  const [search, setSearch] = useState('');
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

  const folderReader = async () => {
    setLoading(true);
    const directory = SCANNER_DOCUMENT_PATH;
    const result = await loadFiles({ directoryPath: directory });
    setresult(sortFilesArray({
      files: result,
      sortBy: 'date',
      reversed: true
    }));
    setLoading(false);
  };

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
    // create SCANNER_DOCUMENT_PATH if it doesn't exist
    RNFS.mkdir(SCANNER_DOCUMENT_PATH);
    folderReader();
  }, [])

  const renderListItem = ({ item, index }) => {
    return (
      <TouchableHighlight underlayColor={''} onPress={() => { FileViewer.open(item.path, { showOpenWithDialog: true }) }}>
        <DocumentItem iconSrc={getFileIcon(item.name)} title={item.name} size={formatSize(item.size)} />
      </TouchableHighlight>
    )
  }

  const files = search ? searchFilesArray({ files: result, query: search }) : result;

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />

      <CustomSearchBarView
        onChangeText={(text) => setSearch(text)}
        onClearPress={() => setSearch('')}
        search={search}
        viewStyle={{ transform: [{ translateY }] }}
        searchBarStyle={{ opacity: opacity }}
      />

      <FloatingButton
        iconName={'camera'}
        onPress={scanDocument}
      />

      {loading && <FileLoadingComponent />}

      <View style={animatedFilesListViewStyle}>
        <Animated.FlatList
          style={{ marginTop }}
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
          ListEmptyComponent={!loading && <ListEmptyComponent />}
          ListFooterComponent={<ListFooterComponent height={20} />}
          renderItem={renderListItem}
        />
      </View>
    </View>

  )

}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },

  body: {
    backgroundColor: 'white',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    height: Dimensions.get('screen').height - 20,
    width: Dimensions.get('screen').width,
  },
  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  images: {
    width: 250,
    height: 250,
  },
  btnParentSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  btnSection: {
    width: 225,
    height: 50,
    backgroundColor: '#DCDCDC',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom: 10,
  },
  btnText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
