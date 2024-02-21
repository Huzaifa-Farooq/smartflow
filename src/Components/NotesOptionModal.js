import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';


const NotesOptionModal = ({ onClose, onButtonPress }) => {
    const buttons = [
        { 'name': 'Comprehensive Notes', actionCode: 1 },
        { 'name': 'Concise Summary', actionCode: 2 },
        { 'name': 'MCQs', actionCode: 3 },
        { 'name': 'Key Points', actionCode: 4 },
        { 'name': 'Conceptual Questions', actionCode: 5 }
    ];

    const handleButtonPress = (actionCode) => {
        onButtonPress(actionCode);
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {
                            buttons.map((button, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.button}
                                    onPress={() => handleButtonPress(button.actionCode)}>
                                    <Text style={styles.buttonText}>{button.name}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}


const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '90%',
        padding: 20,
        borderRadius: 10,
        elevation: 5
    },
    button: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 5,
        alignItems: 'center'
    },
    buttonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
        padding: 10,
    }
});


export default NotesOptionModal;