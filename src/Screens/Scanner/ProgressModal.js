import * as Progress from 'react-native-progress';
import React from 'react';
import { Modal, View, StyleSheet, Text } from 'react-native';


export default ProgressModal = ({ progress, text }) => {
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
                        <Progress.Circle 
                            progress={progress} 
                            size={70} 
                            color='#deb018'
                            borderWidth={2}
                            showsText={true}
                        />
                        <Text style={{ color: 'black' }} >{text}</Text>
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
    text: {
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold',
    }
});
