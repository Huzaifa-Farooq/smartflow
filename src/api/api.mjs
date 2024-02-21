import axios from 'axios';
import FormData from 'form-data';
import RNFetchBlob from 'rn-fetch-blob';
import * as mime from 'mime'
import { uploadFiles, DocumentDirectoryPath } from "react-native-fs";


axios.defaults.baseURL = 'http://172.0.5.191:8001/';


const generateAssignment = ({ title, successCallback, errorCallback }) => {
  axios.post(
    `/generate_assignment`,
    {},
    {
      params: { title: title },
      headers: { 'Content-Type': 'application/json' }
    }
  )
    .then((response) => {
      console.log(response);
      successCallback(response.data);
    })
    .catch((error) => {
      errorCallback(error);
    });
}


const generateNotes = async ({ filePath, fileName, actionCode, progress, successCallback, errorCallback }) => {

  const files = [
    {
      name: 'file',
      filename: fileName,
      filepath: filePath,
      filetype: mime.getType(filePath),
    },
  ];

  try {

    uploadFiles({
      toUrl: `${axios.defaults.baseURL}generate_notes?action_code=${actionCode}`,
      files: files,
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      progress: (resp) => {
        const p = (resp.totalBytesSent / resp.totalBytesExpectedToSend) * 100;
        if (p > 99.0) {
          progress(100);
        }
        else {
          progress(p);
        }
      }
    })
      .promise.then((response) => {
        // after the file is uploaded, the server will respond with the file url
        successCallback(JSON.parse(response.body));
      })
      .catch((error) => {
        errorCallback(error);
      });
  }
  catch (error) {
    errorCallback(error);
  }
}


// generateAssignment({
//   title: 'Fingerprint',
//   successCallback: (data) => {
//     console.log(data);
//   },
//   errorCallback: (error) => {
//     console.error(error);
//   },
// });

// testing generateNotes
// generateNotes({
//   filePath: '/storage/emulated/0/Download/Lecture 02.pptx',
//   actionCode: 1,
//   successCallback: (data) => {
//     console.log(data);
//   },
//   errorCallback: (error) => {
//     console.error(error);
//   },
// });



export { generateAssignment, generateNotes };
