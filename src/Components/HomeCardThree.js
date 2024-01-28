import { View, Text , StyleSheet,Dimensions,ScrollView} from 'react-native'
import React from 'react'
import NoteView from './NoteView';

const { height, width } = Dimensions.get('window');
const HomeCardThree = () => {
  return (
    <View style={Styles.container}>
        <View style={{alignItems:'center', width:width/1.1 }}>
            <Text style={Styles.Text1}> Downloads</Text>
            </View>
      <ScrollView style={{height:height/4}}>
            <View>
            <NoteView title={"Unraveling Software vs. Hardware"} date={"12/11/2023"} />
                    <NoteView title={"Decoding Cash Memory: A Comprehensive Guide"} date={"02/10/2023"} />
                    <NoteView title={"Networking Protocols Demystified"} date={"12/11/2023"} />
                    <NoteView title={"Encryption Methods: Safeguarding Data"} date={"12/11/2023"} />
                    <NoteView title={"Understanding Cloud Computing Basics"} date={"12/11/2023"} />
                    <NoteView title={"Diving into Data Structures: Fundamentals"} date={"12/11/2023"} />
                    <NoteView title={"AI vs. Machine Learning: Unraveling the Differences"} date={"12/11/2023"} />
                    <NoteView title={"Cybersecurity Essentials: Protecting Your System"} date={"12/11/2023"} />
                    <NoteView title={"Database Management Systems Demystified"} date={"12/11/2023"} />
                    <NoteView title={"Unraveling Software vs. Hardware"} date={"12/11/2023"} />
                </View>
      </ScrollView>
    </View>
  )
}
const Styles = StyleSheet.create({
    container:{
        height:height/2.7,
        width:width/1.1,
        margin:20,
        backgroundColor:'#CCEAEA',
        borderRadius:15,
        shadowOffset:{
            width:10,
            height:10
        },
        alignItems:'center',
        elevation:3
    },
    Text1:{
        textAlign:"justify",
        color:"#000",
        fontSize: 24, fontWeight: 'bold', margin: 12

    }
})

export default HomeCardThree;