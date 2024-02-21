import { PDFDocument } from 'pdf-lib';
import RNFetchBlob from 'rn-fetch-blob';
import { Buffer } from 'buffer';


export const pdfMerge = async ({
    pdfFiles,
    outputFilePath,
    successCallback,
    errorCallback
}) => {
    const pdf = await PDFDocument.create();
    // iterating over all pdf files
    pdfFiles.forEach((file) => {
        console.log('file ' + file)
        const pdfBytes = RNFetchBlob.fs.readFile(file, 'base64');
        const pdfDoc = PDFDocument.load(pdfBytes);
        const pages = pdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach(page => {
            pdf.addPage(page);
        });
    });

    const pdfBytes = await pdf.save();
    const base64 = Buffer.from(pdfBytes).toString('base64');
    RNFetchBlob.fs.writeFile(outputFilePath, base64, 'base64')
    .then((resp) => successCallback(resp))
    .catch(error => errorCallback(error));
}