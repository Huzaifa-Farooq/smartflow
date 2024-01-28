import React,{useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


const NoteView = ({ title, date }) => {
    const getFileType = (fileName) => {
        const lowerCaseName = fileName.toLowerCase();
        if (lowerCaseName.endsWith('.ppt')) {
          return 'ppt';
        } else if (lowerCaseName.endsWith('.pptx')) {
          return 'pptx';
        } else if (lowerCaseName.endsWith('.docx')) {
          return 'docx';
        } else if (lowerCaseName.endsWith('.pdf')) {
          return 'pdf';
        }
      };
    return (
        <TouchableOpacity
            style={[styles.container , {flexDirection: 'row'}]}
            onPress={()=>{}}
        >  
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.date}>{date}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        marginHorizontal: 10,
        marginTop: 10,
        padding: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 20,
        color: '#000',
        fontWeight: 'bold',
    },
    date: {
        color: '#000',
    }
});

export default NoteView;
