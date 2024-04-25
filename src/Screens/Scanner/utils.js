import { PDFDocument } from 'pdf-lib';
import RNFetchBlob from 'rn-fetch-blob';
import { Buffer } from 'buffer';
import { Image } from 'react-native-compressor';


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

    const chunkLength = 10;
    const chunks = [];
    for (let i = 0; i < images.length; i += chunkLength) {
        chunks.push(images.slice(i, i + chunkLength));
    }

    console.log('====================================');
    console.log('Total chunks: ' + chunks.length);
    console.log('====================================');

    for (let chunk of chunks) {
        await Promise.all(chunk.map(async (image) => {
            console.log('Processing image: ' + image);
            const page = pdf.addPage();
            image = await Image.compress(image);

            const filename = image.split('/').pop();
            const ext = filename.split('.').pop();

            const imageBytes = await RNFetchBlob.fs.readFile(image, 'base64');
            let pdfImage;
            if (filename.includes('.jpg') || filename.includes('.jpeg')) {
                pdfImage = await pdf.embedJpg(imageBytes);
            } else if (filename.includes('.png')) {
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

            console.log('Processed image: ' + image);

            onImageProcessingCompletion();
        }));
    }

    onPDFCreationStart(outputFilePath);
    const pdfBytes = await pdf.save();
    const base64 = Buffer.from(pdfBytes).toString('base64');
    RNFetchBlob.fs.writeFile(outputFilePath, base64, 'base64')
        .then((resp) => successCallback(outputFilePath))
        .catch(error => errorCallback(error));
}