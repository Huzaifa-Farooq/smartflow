//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet , StatusBar, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import Banner from '../../Components/BannersAd/Banner';


// create a component
const FeedBack = ({navigation}) => {
    
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#deb018" barStyle="dark-content" />
            <CustomHeader title="FeedBack" icon={"keyboard-backspace"} onPress={() => navigation.goBack()} />
            <ScrollView>
                <View style={styles.main_cont}>
                    <View style={styles.cont}>
                        <View style={styles.row}>
                            <View style={styles.col_1}>
                                <Text style={styles.paratext}>Share Your FeedBack</Text>
                                <Text style={styles.headtext}>How Satisfy Are You With Our Services</Text>

                            </View>
                            <View style={styles.col_2}>
                                <TextInput placeholder='Describe What do you like most...' style={styles.TextInput}/>

                            </View>
                            <View style={styles.col_3}>
                                <TouchableOpacity>
                                    <View style={styles.btn_adj}>
                                        <Text style={styles.btn_text}>
                                            Submit
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>

                </View>
            </ScrollView>
            <Banner/>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#ffffff"

    },
    main_cont:{
        padding:20

    },
    paratext:{
        fontSize:20,
        fontWeight:"bold",
        color:'#4B0082'

    },
    headtext:{
        fontSize:15,
        marginTop:10


    },
    TextInput:{
        padding:20,
        height:150,
        borderRadius:20,
        backgroundColor:"#D3D3D3",
        textAlignVertical: 'top',

    },
    cont:{

    },
    row:{

    },
    col_1:{
      

    },
    col_2:{
        marginTop:20

    },
    col_3:{
        marginTop:20,
        alignItems:"center",
        justifyContent:"center"
    },
    btn_adj:{
        backgroundColor:'skyblue',
        paddingHorizontal:40,
        paddingVertical:20,
        borderRadius:20
       
        
    },
    btn_text:{
        color:"#000",
        fontWeight:'bold',
        fontSize:22
    }
});

//make this component available to the app
export default FeedBack;
