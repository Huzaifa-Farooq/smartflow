import axios from 'axios';
import * as mime from 'mime';
import { uploadFiles } from "react-native-fs";
import { readPpt } from 'react-native-ppt-to-text';
import { Buffer } from 'buffer';
import RNFetchBlob from 'rn-fetch-blob';


axios.defaults.baseURL = 'http://3.108.117.20';
// axios.defaults.baseURL = 'http://192.168.10.3:8001';


export const generateAssignment = ({ title, mode, successCallback, errorCallback }) => {
    RNFetchBlob.fetch(
      'POST', 
      `${axios.defaults.baseURL}/generate_assignment?title=${title}&mode=${mode}`, {
      })
      .then((response) => {
        if (response.respInfo.headers['content-disposition'].includes('filename=')){
          const filename = response.respInfo.headers['content-disposition'].split('filename=')[1];
          const base64 = response.base64();
          successCallback({ filename, base64 });
        } else {
          errorCallback(response.json().content.message);
        }
      })
      .catch((errorMessage, statusCode) => {
        console.log('Error fetching file ' + errorMessage);
        errorCallback('Error while generating assignment.');
      });
}


const generateNotesWithFile = async ({
  filePath, fileName, actionCode, progress, successCallback, errorCallback
}) => {
  console.log('====================================');
  console.log('filePath: ', filePath);
  console.log('====================================');
  const files = [
    {
      name: 'file',
      filename: fileName,
      filepath: filePath,
      filetype: mime.getType(filePath),
    },
  ];

  let lastReportedProgress = 0;

  try {
    uploadFiles({
      toUrl: `${axios.defaults.baseURL}/generate_notes?action_code=${actionCode}&filename=${fileName}`,
      files: files,
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      progress: (resp) => {
        const p = (resp.totalBytesSent / resp.totalBytesExpectedToSend) * 100;
        if (p - lastReportedProgress > 10 || p >= 99) {
          progress(p);
          lastReportedProgress = p;
      }
    }
    })
      .promise.then((response) => {
        // The server will respond with bytes of the file
        const headers = response.headers;
        const filename = headers['content-disposition'].split('filename=')[1];
        const base64 = response.body;
        successCallback({ filename, base64 });
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        errorCallback("Error uploading file.");
      });
  }
  catch (error) {
    errorCallback('Error while generating notes.');
  }
}

export const generateNotes = async ({
  filePath, fileName, actionCode, progress, successCallback, errorCallback
}) => {
  try {
    let pptText = await readPpt(filePath);
    // converting pptText array to string joined by '||||'
    pptText = pptText.join('||||');
    // console.log('pptText: ', pptText);
    progress(100);
    generateNotesWithText({
      pptText: pptText,
      fileName: fileName,
      actionCode: actionCode,
      successCallback: successCallback,
      errorCallback: errorCallback
    });
  } catch (error) {
    console.log('Error reading ppt file ' + error);

    generateNotesWithFile({
      filePath: filePath,
      fileName: fileName,
      actionCode: actionCode,
      progress: progress,
      successCallback: successCallback,
      errorCallback: errorCallback
    });
  }
}


const generateNotesWithText = async ({ pptText, fileName, actionCode, successCallback, errorCallback }) => {
  try {
    axios.post(`${axios.defaults.baseURL}/generate_notes?action_code=${actionCode}&filename=${fileName}&ppt_text=${pptText}`, {
    }
    )
      .then((response) => {
        // The server will respond with bytes of the file
        const headers = response.respInfo.headers;
        const filename = headers['content-disposition'].split('filename=')[1];
        const base64 = response.base64();
        successCallback({ filename, base64 });
      })
      .catch((error) => {
        console.log(error);
        errorCallback("Error sending text.");
      });
  }
  catch (error) {
    errorCallback('Error while generating notes.');
  }
}


export const generatePresentation = ({ title, templateId, successCallback, errorCallback }) => {
  RNFetchBlob.fetch(
    'POST', 
    `${axios.defaults.baseURL}/generate_presentation?title=${title}&template_id=${templateId}`, {})
    .then((response) => {
      const filename = response.respInfo.headers['content-disposition'].split('filename=')[1];
      const base64 = response.base64();
      successCallback({ filename, base64 });
    })
    .catch((errorMessage, statusCode) => {
      console.log('Error fetching file ' + errorMessage);
      errorCallback('Error while generating presentation.');
    });
}


export const getTemplates = ({ successCallback, errorCallback }) => {
  axios.get('templates', {
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then((response) => {
      successCallback(response.data);
    })
    .catch((error) => {
      console.log('====================================');
      console.log('error while getting templates: ' + error);
      console.log('====================================');
      errorCallback(error.message);
    });
  }


export const checkServerConnection = (onResponse) => {
  console.log('====================================');
  axios.get('/').then((response) => {
    console.log('Server is up and running');
    onResponse(true);
  }).catch((error) => {
    console.log('Server is down: ' + error);
    onResponse(false);
  });
  console.log('====================================');

}
