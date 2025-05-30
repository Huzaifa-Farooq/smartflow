import { StyleSheet } from "react-native";
import { View, Text, Modal } from "react-native";
import AnimatedIcon from "./AnimatedIcon";


const NotesProgressModal = ({ uploadProgress, uploadInProgress, notesGenerationInProgress, fileDownloadInProgress, downloadProgress }) => {
    let iconName = '';
    let text = '';
    let progress = null;
    if (uploadInProgress) {
        iconName = 'fileUpload';
        text = 'Uploading file...';
        progress = uploadProgress.toFixed(2) + '%';
    }
    else if (fileDownloadInProgress) {
        iconName = 'fileDownload';
        text = 'Downloading file...';
        progress = downloadProgress.toFixed(2) + '%';
    }
    else if (notesGenerationInProgress) {
        iconName = 'writeOnPage';
        text = 'Generating Notes...';
    }
    else {
        return null;
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => { }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <AnimatedIcon name={iconName} style={{ width: 100, height: 100 }} />
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>{text}</Text>
                        {progress && <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }} >{progress}</Text>}
                    </View>
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    modalView: {
        backgroundColor: "white",
        height: 200,
        width: 200,
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        borderBlockColor: 'black',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
});


export default NotesProgressModal;
