import { StyleSheet, Text, View, Dimensions, FlatList } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react';
import TemplateItem from './TemplateItem';

import SubScreenHeader from '../../Components/SubScreenHeader';

import { getTemplates } from '../../api/api.mjs';


const { height, width } = Dimensions.get('window');


const Templates = ({ navigation }) => {
    // load templates on load
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        console.log('====================================');
        console.log('Templates Screen Loaded');
        console.log('====================================');
        getTemplates({
            successCallback: (response) => {
                setTemplates(response);
            },
            errorCallback: (error) => {
                console.log(error);
            }
        });
    }, []);

    const handleTemplateSelection = ({ templateId }) => {
        navigation.navigate('Presentation', { templateId });
    }

    return (
        <View>
            <SubScreenHeader
                title={'Choose Template'}
                icon={"keyboard-backspace"}
                onPress={() => navigation.goBack()}
            />
            <View style={[styles.ScrollView]} >
                <View style={{ alignItems: "center", alignContent: "center", height: height / 16.8 }}>
                    <Text style={styles.text}>Templates</Text>
                </View>
                <FlatList
                    data={templates}
                    renderItem={({ item }) => {
                        return <TemplateItem
                            imageSource={item.imageUrl}
                            txt={item.title}
                            iconBackgroundColor={"white"}
                            onPress={() => handleTemplateSelection({ templateId: item.id })}
                        >
                        </TemplateItem>
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>

    )
}

export default Templates;

const styles = StyleSheet.create({
    text: {
        color: '#777777',
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 20,
        marginTop: 10,
    },
    ScrollView: {
        height: height / 2,
        // borderColor: "black",
        // borderWidth: 2,
        // borderRadius: 20,
        width: width / 1.05,
        alignSelf: "center",
        paddingHorizontal: 2,
        // elevation: 3,
        // backgroundColor: 'white',
        paddingBottom: 10,
        // alignItems:"center"

    }
})