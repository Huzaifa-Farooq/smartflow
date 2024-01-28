const isPdf = (name) => {
    return name.includes('.pdf');
};

const formatSize = ({ size }) => {
    if (!size) return '0KB';
    return size > 100000 ? ((size / 100000).toFixed(2) + 'MB') : ((size / 1000).toFixed(2) + 'KB');
}

const getFileIcon = (name) => {
    if (name.includes('.pdf'))
        return require('../assets/Images/pdf.png');
    else if (name.includes('.docx'))
        return require('../assets/Images/docx.png');
    else if (name.includes('.pptx'))
        return require('../assets/Images/pptx.png');
    else if (name.includes('.ppt'))
        return require('../assets/Images/ppt.png');
    else
        return require('../assets/Images/file.png'); 
}


export { isPdf, formatSize, getFileIcon };
