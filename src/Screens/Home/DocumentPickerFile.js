import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {request, PERMISSIONS} from 'react-native-permissions';

import RNFetchBlob from 'react-native-fetch-blob';



const DocumentPickerFile = () => {
  const [pickedDocument, setPickedDocument] = useState(null);

  useEffect(() => {
        // Automatically pick a document when the component mounts
        askpermissions(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    pickDocument();
    const  responseBody ='https://xentechnexus.s3.eu-north-1.amazonaws.com/public/ghmhzrsGgkJc.docx'
        
    const filetype = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    downloadFile(responseBody,filetype)
  }, []); // Empty dependency array ensures it runs only once on mount
const pickDocument = async () => {
      try {
        const result = await DocumentPicker.pickSingle({
          type: [DocumentPicker.types.ppt , DocumentPicker.types.pptx ],
          allowMultiSelection:false
        });

        console.log(result);

        setPickedDocument(result);
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker
          console.log('User cancelled the picker');
        } else {
          throw err;
        }
      }
    };
    const askpermissions= async (Permission)=>{
      request(Permission).then((result) => {
          console.log(result)
    });
  };

  const downloadFile = async (fileUrl, fileType) => {
    try {
      const response = await RNFetchBlob.config({
        // Add the desired file path where you want to save the file
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: `${RNFetchBlob.fs.dirs.DownloadDir}/${pickedDocument.name}.${fileType}`,
          mime: fileType,
          description: 'File downloaded via app.',
        },
      }).fetch('GET', fileUrl);

      console.log('File downloaded successfully:', response.path());
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const FileUri = result; 
  

  // const uploadPresentationFiles = async (FileUri) => {

  //   const [command, setCommand] = useState(null);
  //   try {
  //     const apiUrl = 'https://pregnant-whitney-xentechnexus.koyeb.app/'; // Replace with your API endpoint
  //     const apiUrlWithCommand = `${apiUrl}?command=${command}`
  //     if (FileUri.endswith('ppt')) {
  //       // Create FormData for PPT file
  //     const pptFormData = new FormData();
  //     pptFormData.append('pptFile', {
  //       uri: FileUri,
  //       type: 'application/vnd.ms-powerpoint', // MIME type for .ppt
  //       name: pickedDocument.name,
  //     });
  //       // Make the fetch request for PPT file
  //       const pptResponse = await RNFetchBlob.fetch(
  //         'POST',
  //         apiUrl,
  //         {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //         pptFormData
  //       );
  //       if (pptResponse.respInfo.status === 200 ) {
  //         console.log('PPT and PPTX files uploaded successfully');
  //       } else {
  //         console.error('File upload failed');
  //       }
  //     }
  //     else{
  //        // Create FormData for PPTX file
  //     const pptxFormData = new FormData();
  //     pptxFormData.append('pptxFile', {
  //       uri: FileUri,
  //       type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', // MIME type for .pptx
  //       name: pickedDocument.name,
  //     });
  //     // Make the fetch request for PPTX file
  //     const pptxResponse = await RNFetchBlob.fetch(
  //       'POST',
  //       apiUrl,
  //       {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       pptxFormData
  //     );
  //     if (pptxResponse.respInfo.status === 200) {
  //       console.log('PPT and PPTX files uploaded successfully');
  //       // const responseBody = response.text();
  //       const  responseBody ='https://xentechnexus.s3.eu-north-1.amazonaws.com/public/ghmhzrsGgkJc.docx'
        
  //       const filetype = 'application/pdf';
  //       downloadFile(responseBody,filetype)
  //     } else {
  //       console.error('File upload failed');
  //     }
  //     }
           
  //   } catch (error) {
  //     console.error('Error uploading files:', error);
  //   }
  // };
  // uploadPresentationFiles(FileUri);
  

  
  return (
    <View>
      {pickedDocument ? (
        <View>
          <Text>Selected Document:</Text>
          <Text>{pickedDocument.name}</Text>
          <Text>{pickedDocument.type}</Text>
          <Text>{pickedDocument.uri}</Text>
          {/* Add more details if needed */}
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};


export default DocumentPickerFile;
