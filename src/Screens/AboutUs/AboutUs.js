import { Image, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native'
import React from 'react'
import CustomHeader from '../../Components/CustomHeader'



const AboutUs = ({ navigation }) => {

    const handleEmailPress = () => {
        Linking.openURL('mailto:xentechnexus@gmail.com')
    }

    return (
        <View style={{ flex: 1 }}>
            <CustomHeader title={'SmartFlow'}
                icon={"keyboard-backspace"}
                onPress={() => navigation.goBack()}
            />
            {/* <View style> */}
            <View style={styles.AboutUs}>
                <Text style={styles.title}>
                    About Us
                </Text>
                <Text style={styles.text}>At the forefront of the future, Xentech Nexus (XTN) is building the tools that empower you to stay ahead of the curve. We design and develop innovative apps and software solutions that give your business a competitive advantage.</Text>
                <View style={styles.ContactUs}>
                    <Text style={styles.title}>
                        Contact Us
                    </Text>
                    <TouchableOpacity onPress={handleEmailPress}>
                        <Text style={styles.text}>xentechnexus@gmail.com</Text>
                    </TouchableOpacity>
                </View>
                <Image source={require('../../assets/Images/XentechLogo.png')} style={styles.image} />
            </View>
        </View>
    )
}

export default AboutUs;

const styles = StyleSheet.create({
    AboutUs: {
        height: '80%',
        width: '100%',
        // backgroundColor:'#fff',
        alignSelf: 'center',
        marginTop: '10%'

    }, title: {
        fontSize: 25,
        fontWeight: '900',
        color: '#4B0082',
        textAlign: 'center',
        marginTop: 30,
        marginHorizontal: 50,
        // fontFamily:

    }
    , text: {
        fontSize: 17,
        fontWeight: '600',
        color: '#777777',
        textAlign: 'center',
        marginTop: 15,
        marginHorizontal: 50,
        marginBottom: 10,
        justifyContent: "center"

        // fontFamily:
    },
    image: {
        height: 60,
        width: 60,
        alignSelf: 'center',
        marginTop: 15
    },
    ContactUs: {
        marginTop: 15
    }
})