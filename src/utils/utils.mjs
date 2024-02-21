import RNFS from 'react-native-fs';


const isPdf = (name) => {
    return name.includes('.pdf');
};

const formatSize = (size) => {
    if (!size) return '0KB';
    return size > 100000 ? ((size / 100000).toFixed(2) + 'MB') : ((size / 1000).toFixed(2) + 'KB');
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
        'sdk', 'media', 'gallery', 'img', 'movie', 'temp'
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

    const fileNames = await RNFS.readDir(directoryPath);
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


export const connectedToInternet = () => {
    return new Promise((resolve, reject) => {
        fetch('https://www.google.com', {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        }).then((res) => {
            resolve(true);
        }).catch((err) => {
            resolve(false);
        });
    });

}



// exporting functions
export { isPdf, formatSize, getFileIcon, loadFiles, sortFilesArray, reverseArray, searchFilesArray };