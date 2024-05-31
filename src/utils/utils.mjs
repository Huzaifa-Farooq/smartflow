import RNFS from 'react-native-fs';
import { readPpt } from 'react-native-ppt-to-text';
import FileViewer from "react-native-file-viewer";
import RNFetchBlob from 'rn-fetch-blob';



export const extractTextFromPpt = async (path) => {
    try {
        const text = await readPpt(path);
        return text;
    } catch (e) {
        console.log('Error extracting text from ppt: ', e);
        return '';
    }
}

export const openFile = async (navigation, path) => {
    const name = path.split('/').pop();
    if (path.endsWith('.pdf')) {
        navigation.navigate('DocViewer', { path, name })
    } else {
        // getting mime type of file
        const mimeType = await RNFetchBlob.fs.stat(path).then((stats) => {
            return stats.mime;
        });
        RNFetchBlob.android.actionViewIntent(path, mimeType)
            .catch((error) => {
                console.log('Error opening file usng intent: ', error);
                FileViewer.open(path, { showOpenWithDialog: true })
                    .catch((error) => {
                        Alert.alert(
                            "No Associated App",
                            "There is no app associated with this file type. Please download appropriate viewer to open it.",
                            [
                                { text: "OK", onPress: () => console.log("OK Pressed") }
                            ],
                            { cancelable: false }
                        );
                    })
            })


    }
}


const isPdf = (name) => {
    return name.includes('.pdf');
};

const formatSize = (size) => {
    if (!size) return '0 Bytes';

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return parseFloat((size / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

const getFileIcon = (name) => {
    if (name.includes('.pdf'))
        return require('../assets/Images/pdf.png');
    else if (name.includes('.docx'))
        return require('../assets/Images/docx.png');
    else if (name.includes('.pptx'))
        return require('../assets/Images/pptx.png');
    else if (name.includes('.ppt'))
        return require('../assets/Images/ppt.png');
    else
        return require('../assets/Images/file.png');
}


const loadFiles = async ({
    directoryPath,
    directoriesToSkip = [
        'images', '/obb', 'cache', 'video', 'photo', 'voice', 'movies', 'music', '/dcim/',
        'sdk', 'gallery', 'img', 'movie', 'temp', 'tmp'
    ],
    required_ext = ['*'],
}) => {
    const hasExtension = (name) => {
        // if required extension has * then return true
        if (required_ext.includes('*')) {
            return true
        }
        else {
            return required_ext.some((ext) => name.endsWith(ext));
        }
    }

    if (!RNFS.exists(encodeURIComponent(directoryPath))) {
        return [];
    }

    let fileNames = [];
    try {
        fileNames = await RNFS.readDir(directoryPath);
    } catch (e) {
        console.log('============== Error reading directory ======================');
        console.log('Directory: ' + directoryPath);
        console.log('====================================');
        return [];
    }
    const requiredFiles = [];
    const visitedDirectories = [];

    await Promise.all(fileNames.map(async (file) => {
        if (file && file.isFile() && hasExtension(file.name)) {
            requiredFiles.push(file);
        } else if (file.isDirectory()) {
            if (directoriesToSkip.some((dir) => file.path.toLowerCase().includes(dir))) {
                return;
            }
            if (visitedDirectories.includes(file.path)) {
                return;
            }
            else {
                visitedDirectories.push(file.path);
                const subFiles = await loadFiles({ directoryPath: file.path, required_ext, directoriesToSkip });
                requiredFiles.push(...subFiles);
            }
        }
    }));

    return requiredFiles;
};


const sortFilesArray = ({ files, mode, reversed }) => {
    if (mode === 'size') {
        files = files.sort((a, b) => {
            return a.size - b.size;
        });
    }
    else if (mode === 'name') {
        files = files.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    }
    else {
        files = files.sort((a, b) => {
            return a.mtime - b.mtime;
        });
    }

    if (reversed) {
        files = reverseArray(files);
    }

    return files;
};


const reverseArray = (arr) => {
    return arr.reverse();
};


const searchFilesArray = ({ files, query }) => {
    return files.filter((file) => {
        return file.name.toLowerCase().includes(query.toLowerCase());
    });
};


export const getFileName = async (directory, fileName) => {
    // determining filename.
    /* 
        1. if file already exists then add a number at its end that doesn't exists
        2. if file doesn't exist then use the same name
    */
    const extension = fileName.split('.').pop();
    fileName = fileName.replace('.' + extension, '');
    let newFileName = fileName;
    let i = 1;
    while (i < 100) {
        const fileExists = await RNFS.exists(`${directory}/${newFileName}.${extension}`)
        if (fileExists) {
            console.log(`${directory}/${newFileName}.${extension} exists`);
            newFileName = `${fileName}(${i})`;
            i++;
        } else {
            break;
        }
    }
    return newFileName + '.' + extension;
}


// exporting functions
export { isPdf, formatSize, getFileIcon, loadFiles, sortFilesArray, reverseArray, searchFilesArray };