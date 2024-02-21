//import liraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import Banner from '../../Components/BannersAd/Banner';

// create a component
const Presentation = ({ navigation }) => {
    const [topic, setTopic] = useState('')
    return (
        <View style={styles.container}>
            <CustomHeader title={'Presentations'}
                icon={"keyboard-backspace"}
                onPress={() => navigation.goBack()}
            />
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <TextInput multiline={true}
                    placeholder='Enter you Topic'
                    placeholderTextColor='#777777'
                    style={styles.textInput}
                    value={topic}
                    onChangeText={(text) => setTopic(text)}
                />
                <TouchableOpacity style={[topic === '' ? styles.button : styles.button1]} onPress={() => { }} disabled={topic === ''}>
                    <Text style={topic === '' ? styles.btnText1 : styles.btnText}>Generate</Text>
                </TouchableOpacity>


            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Banner />
            </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    textInput: {
        borderWidth: 1,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 20,
        padding: 20,
        color: '#777777'

    },
    button: {
        backgroundColor: 'lightblue',
        width: '50%',
        padding: 20,
        alignSelf: 'center',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 40,
        bottom: 0, 
        top: '50%'

    },
    button1: {
        backgroundColor: 'skyblue',
        width: '50%',
        padding: 20,
        alignSelf: 'center',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 40,
        bottom: 0, 
        top: '40%'
    },
    btnText: {
        color: '#000',
        fontSize: 22,
        fontWeight: 'bold'
    }, btnText1: {
        color: '#7393B3',
        fontSize: 22,
        fontWeight: 'bold'
    }
});

//make this component available to the app
export default Presentation;
