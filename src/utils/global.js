import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { mkdir } from 'react-native-saf-x';
import { PermissionsAndroid } from 'react-native';


global.APP_DIRECTORY = RNFS.ExternalDirectoryPath + '/SmartFlow';
// if android version is 13 or greater
if (Platform.constants['Release'] >= 12) {
    global.IS_ANDOID_VERSION_13 = true;
} else {
    global.IS_ANDOID_VERSION_13 = false;
}

PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
.then((response) => {
    if (response) {
        global.APP_DIRECTORY = RNFS.ExternalStorageDirectoryPath + '/SmartFlow';
    }
})

global.ASSIGNMENT_FOLDER = global.APP_DIRECTORY + '/Assignments';
global.NOTES_DIRECTORY_PATH = global.APP_DIRECTORY + '/Notes';
global.MERGED_PDF_DIRECTORY = global.APP_DIRECTORY + '/MergedPDFs';
global.PRESENTATION_FOLDER = global.APP_DIRECTORY + '/Presentations';
global.SCANNER_DOCUMENT_PATH = global.APP_DIRECTORY + '/ScannerDocuments';
global.PPT_IMPORT_DIRECTORY = global.APP_DIRECTORY + '/imports';

// create all directories
const directories = [
    global.APP_DIRECTORY,
    global.ASSIGNMENT_FOLDER,
    global.NOTES_DIRECTORY_PATH,
    global.MERGED_PDF_DIRECTORY,
    global.PRESENTATION_FOLDER,
    global.SCANNER_DOCUMENT_PATH,
    global.PPT_IMPORT_DIRECTORY
];

directories.forEach(async (dir) => {
    console.log(dir);
    await RNFS.mkdir(dir);
});
