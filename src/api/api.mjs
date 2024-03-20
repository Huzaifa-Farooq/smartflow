import axios from 'axios';
import * as mime from 'mime';
import { uploadFiles } from "react-native-fs";
import { readPpt } from 'react-native-ppt-to-text';


axios.defaults.baseURL = 'http://3.111.103.148';


export const generateAssignment = ({ title, successCallback, errorCallback }) => {
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
        if (p - lastReportedProgress > 5 || p >= 99) {
          progress(p);
          lastReportedProgress = p;
      }
    }
    })
      .promise.then((response) => {
        // after the file is uploaded, the server will respond with the file url
        successCallback(JSON.parse(response.body));
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
        console.log(JSON.stringify(response));
        successCallback(response.data);
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


export const checkServerConnection = (onResponse) => {
  console.log('====================================');
  axios.get('').then((response) => {
    console.log('Server is up and running');
    onResponse(true);
  }).catch((error) => {
    console.log('Server is down: ' + error);
    onResponse(false);
  });
  console.log('====================================');

}
