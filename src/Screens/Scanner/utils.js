import { PDFDocument } from 'pdf-lib';
import RNFetchBlob from 'rn-fetch-blob';
import { Buffer } from 'buffer';


export const createImagesPDF = async ({
    images,
    outputFilePath,
    successCallback,
    errorCallback,
    onImageProcessingCompletion,
    onPDFCreationStart
}) => {
    const pdf = await PDFDocument.create();
    if (images.length === 0) {
        errorCallback('No images to process');
        return;
    }
    for (let image of images){
        // reading image
        const filename = image.split('/').pop();
        console.log('image', image);
        const page = pdf.addPage();

        const imageBytes = await RNFetchBlob.fs.readFile(image, 'base64');
        let pdfImage;
        if (filename.includes('.jpg') || filename.includes('.jpeg')){
            pdfImage = await pdf.embedJpg(imageBytes);
        } else if (filename.includes('.png')){
            pdfImage = await pdf.embedPng(imageBytes);
        } else {
            console.warn('No an image' + filename);
            return
        }


        page.drawImage(pdfImage, {
            x: 0,
            y: 0,
            width: page.getWidth(),
            height: page.getHeight(),
        });

        onImageProcessingCompletion();
    }

    onPDFCreationStart(outputFilePath);
    const pdfBytes = await pdf.save();
    const base64 = Buffer.from(pdfBytes).toString('base64');
    RNFetchBlob.fs.writeFile(outputFilePath, base64, 'base64')
    .then((resp) => successCallback(outputFilePath))
    .catch(error => errorCallback(error));
}