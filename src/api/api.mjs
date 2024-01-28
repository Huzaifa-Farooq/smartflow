import axios from 'axios';
import FormData from 'form-data';
import RNFetchBlob from 'rn-fetch-blob';


axios.defaults.baseURL = 'http://192.168.10.4:8001/';


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
      successCallback(response.data);
    })
    .catch((error) => {
      errorCallback(error);
    });
}


const generateNotes = ({ filePath, actionCode, successCallback, errorCallback }) => {
  let formData = new FormData();
  RNFetchBlob.fs.readFile(filePath)
    .then((content) => {
      formData.append('file', content, filePath);

      axios.post(
        `/generate_notes`,
        formData,
        {
          params: { action_code: actionCode },
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )
        .then((response) => {
          successCallback(response.data);
        })
        .catch((error) => {
          errorCallback(error);
        });
    })
    .catch((error) => {
      errorCallback(error);
    });
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
//   filePath: 'C:/Users/Huzaifa Farooq/Downloads/lecture_19.pptx',
//   actionCode: '1',
//   successCallback: (data) => {
//     console.log(data);
//   },
//   errorCallback: (error) => {
//     console.error(error);
//   },
// });


export { generateAssignment, generateNotes };
