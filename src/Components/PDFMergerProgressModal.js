import { StyleSheet } from "react-native";
import { View, Text, Modal } from "react-native";
import AnimatedIcon from "./AnimatedIcon";


const PDFMergerProgressModal = ({ 
    text,
    iconName='wait'
}) => {
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
                        <Text 
                        style={{ 
                            fontSize: 14, 
                            fontWeight: 'bold', 
                            color: 'black', 
                            padding: 10 
                            }}
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        >
                            {text}
                            </Text>
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


export default PDFMergerProgressModal;
