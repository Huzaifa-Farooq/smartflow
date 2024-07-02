//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import Banner from '../../Components/BannersAd/Banner';
import { useState } from 'react';
import AnimatedIcon from '../../Components/AnimatedIcon';

import { submitFeedback } from '../../api/api.mjs';


// create a component
const FeedBack = ({ navigation }) => {
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [feedback, setFeedback] = useState('');

    const maxLength = 300;
    const minLength = 20;

    const isWithinLimit = feedback.length >= minLength && feedback.length <= maxLength;

    const onPress = () => {
        if (!isWithinLimit) {
            return;
        }
        setFeedback('');
        submitFeedback({
            text: feedback,
            successCallback: () => {
                console.log('Feedback submitted successfully');
                setSuccessModalVisible(true);
            },
            errorCallback: (errorMessage) => {
                console.log('Error while submitting feedback: ', errorMessage);
                setSuccessModalVisible(true);
            }
        });
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#deb018" barStyle="dark-content" />
            <CustomHeader title="FeedBack" icon={"keyboard-backspace"} onPress={() => navigation.goBack()} />

            {
                successModalVisible && (
                    <SuccessModal
                        text={'Feedback submitted successfully'}
                        iconName={'success'}
                        iconProps={{
                            onAnimationFinish: () => { setSuccessModalVisible(false) },
                            speed: 1.3
                        }}
                    />
                )
            }

            <ScrollView>
                <View style={styles.main_cont}>
                    <View style={styles.cont}>
                        <View style={styles.row}>
                            <View style={styles.col_1}>
                                <Text style={styles.paratext}>Share Your FeedBack</Text>
                                <Text style={styles.headtext}>How Satisfy Are You With Our Services</Text>

                            </View>
                            <View style={styles.col_2}>
                                <TextInput
                                    placeholder='Describe What do you like most...'
                                    placeholderTextColor='#777777'
                                    multiline={true}
                                    onChangeText={(text) => { setFeedback(text) }}
                                    style={styles.TextInput}
                                    value={feedback}
                                />
                                <View style={{ marginTop: 5, marginLeft: 8 }} >
                                    <Text style={{ 
                                        color: (isWithinLimit || feedback.length === 0) ? '#777777' : 'red' 
                                        }}>
                                        {feedback.length} / {maxLength} characters - ({minLength} minimum)
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.col_3}>
                                <TouchableOpacity
                                    onPress={onPress}
                                >
                                    <View style={styles.btn_adj}>
                                        <Text style={styles.btn_text}>
                                            Submit
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.charLimitLabel}>
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>
            <Banner />
        </View>
    );
};

const SuccessModal = ({
    text,
    iconName,
    iconProps
}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => { }}
        >
            <View style={modalStyles.centeredView}>
                <View style={modalStyles.modalView}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <AnimatedIcon
                            name={iconName}
                            style={{ width: 100, height: 100 }}
                            loop={false}
                            props={iconProps}
                        />
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


const modalStyles = StyleSheet.create({
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


// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff"

    },
    main_cont: {
        padding: 20

    },
    paratext: {
        fontSize: 20,
        fontWeight: "bold",
        color: '#4B0082'

    },
    headtext: {
        fontSize: 15,
        marginTop: 10


    },
    TextInput: {
        padding: 20,
        height: 150,
        borderRadius: 20,
        backgroundColor: "#D3D3D3",
        textAlignVertical: 'top',
        color: '#777777'

    },
    cont: {

    },
    row: {

    },
    col_1: {


    },
    col_2: {
        marginTop: 20

    },
    col_3: {
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    btn_adj: {
        backgroundColor: 'skyblue',
        paddingHorizontal: 40,
        paddingVertical: 20,
        borderRadius: 20


    },
    btn_text: {
        color: "#3d3a3a",
        fontWeight: 'bold',
        fontSize: 22
    }
});

//make this component available to the app
export default FeedBack;
