// dialog box to display error with icon
import { 
    View, Text, StyleSheet, Modal, 
    TouchableWithoutFeedback,
    Pressable
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';


export default ErrorDialog = ({ 
    onClose, 
    error, 
    iconName = "alert-circle", 
    iconColor = "#ff0000",
    textColor = '#ff0000',
}) => {
    // stringify error
    console.log('====================================');
    console.log('ErrorDialog', error);
    console.log('====================================');


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
                        {/* <Image
                            style={styles.errorIcon}
                            source={require('../assets/Images/error.png')}
                        /> */}
                        <MaterialCommunityIcons
                            name={iconName}
                            color={iconColor}
                            size={60}
                            style={{ ...styles.errorIcon, height: 60, width: 60 }}
                        />
                        <Text style={{ ...styles.errorText, color: textColor }}>{error}</Text>
                        <Pressable
                            style={styles.crossButton}
                            onPress={onClose}>
                            <MaterialCommunityIcons 
                                name="close-circle-outline"
                                size={20} 
                                color="black"
                            />
                        </Pressable>
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
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    crossButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        fontSize: 20,
        color: '#000',
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '90%',
        height: 180,
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorIcon: {
        width: 50,
        height: 50,
        alignSelf: 'center',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        width: 100, // Adjust the width as needed
        alignSelf: 'center', // Center the button
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16, // Adjust the font size as needed
    },
});