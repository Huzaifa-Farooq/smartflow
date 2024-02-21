// import BackgroundService from 'react-native-background-actions';
// import RNFS from 'react-native-fs';
// import { AsyncStorage } from 'react-native';





// const detailsFilePath = RNFS.DocumentDirectoryPath + '/files_details.json';

// const options = {
//   taskName: 'FileScanner',
//   taskTitle: 'File Scanner',
//   taskDesc: 'Scanning files in background',
//   taskIcon: {
//       name: 'ic_launcher',
//       type: 'mipmap',
//   },
//   color: '#ff00ff',
//   linkingURI: 'yourSchemeHere://chat/jane',
//   parameters: {
//       delay: 500,
//   }
// };


// const test = async () => {
//   console.log('test');
// }

// export const startBackgroundService = async () => {
//   await BackgroundService.start(test, options)

//   await BackgroundService.updateNotification({
//       taskDesc: 'Scanning files in background',
//   });

//   await BackgroundService.stop();
// }

// export const searchFiles = async ({
//   directoryPath=RNFS.ExternalStorageDirectoryPath,
//   directoriesToSkip = [
//       'images', '/obb', 'cache', 'video', 'photo', 'voice', 'movies', 'music', '/dcim/',
//       'sdk', 'media', 'gallery', 'img', 'movie', 'temp'
//   ],
//   required_ext = ['ppt', 'pptx', 'pdf', 'doc', 'docx'],
// }) => {
//   const hasExtension = (name) => {
//       // if required extension has * then return true
//       if (required_ext.includes('*')) {
//           return true
//       }
//       else {
//           return required_ext.some((ext) => name.endsWith(ext));
//       }
//   }

//   const fileNames = await RNFS.readDir(directoryPath);
//   const requiredFiles = [];
//   const visitedDirectories = [];

//   fileNames.map(async (file) => {
//       if (file && file.isFile() && hasExtension(file.name)) {
//           console.log("Found file: " + file);
//           requiredFiles.push(file);
//       } else if (file.isDirectory()) {
//           if (directoriesToSkip.some((dir) => file.path.toLowerCase().includes(dir))) {
//               return;
//           }
//           if (visitedDirectories.includes(file.path)) {
//               return;
//           }
//           else {
//               visitedDirectories.push(file.path);
//               const subFiles = await searchFiles({ directoryPath: file.path, required_ext, directoriesToSkip });
//               requiredFiles.push(...subFiles);
//           }
//       }
//   });

//   return requiredFiles;
// };


// const saveFilesDetails = async (files) => {
//   try {
//       await RNFS.writeFile(detailsFilePath, JSON.stringify(files), 'utf8');
//   } catch (error) {
//       console.log('Error while saving files details', error);
//   }
// };


// const loadFilesDetails = async () => {
//   try {
//       const filesDetails = await RNFS.readFile(detailsFilePath, 'utf8');
//       return JSON.parse(filesDetails);
//   }
//   catch (error) {
//       console.log('Error while loading files details', error);
//   }
// };



  
