import { PDFDocument } from 'pdf-lib';
import RNFetchBlob from 'rn-fetch-blob';
import { Buffer } from 'buffer';


export const pdfMerge = async ({
    files,
    outputFilePath,
    successCallback,
    errorCallback,
    progressUpdateString,
}) => {
    const pdf = await PDFDocument.create();
    // iterating over all pdf files
    for (let file of files) {
        const filename = file.split('/').pop();
        console.log('file', file);
        progressUpdateString(`Processing ${filename}...`)
        const pdfBytes = await RNFetchBlob.fs.readFile(file, 'base64');
        if (!pdfBytes) {
            continue;
        }
        try{
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = await pdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            pages.forEach(page => {
                pdf.addPage(page);
            });
            progressUpdateString(`Processed ${filename}...`)
        } catch (error) {
            console.log('error', error);
            progressUpdateString(`Failed to process ${filename}...`)
            continue;
        }
    }

    progressUpdateString('Creating merged PDF file...')
    const pdfBytes = await pdf.save();
    const base64 = Buffer.from(pdfBytes).toString('base64');
    RNFetchBlob.fs.writeFile(outputFilePath, base64, 'base64')
    .then((resp) => successCallback(outputFilePath))
    .catch(error => errorCallback(error));
}