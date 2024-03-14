import axios from 'axios';
import * as mime from 'mime';
import { uploadFiles } from "react-native-fs";


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


export const generateNotes = async ({ filePath, fileName, actionCode, progress, successCallback, errorCallback }) => {

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
      toUrl: `${axios.defaults.baseURL}/generate_notes?action_code=${actionCode}`,
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
        console.log(error);
        errorCallback("Error uploading file.");
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

/*

export AWS_ACCESS_KEY_ID="AKIAWVSHEECG3LXVT7HV"
export AWS_SECRET_ACCESS_KEY="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"
export AWS_BUCKET_NAME="xentechnexus"
export AWS_FILES_ENDPOINT_URL="eu-north-1.amazonaws.com"
export BARD_API_KEY="AIzaSyC3PG_W1l7nS6uot9FnsToqdA1Ec940j08"
export OPENAI_API_KEY="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"

*/
