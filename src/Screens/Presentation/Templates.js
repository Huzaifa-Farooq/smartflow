import { StyleSheet, Text, View, Dimensions, FlatList } from 'react-native'
import React, { Fragment } from 'react'
import { useState, useEffect } from 'react';
import TemplateItem from './TemplateItem';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedIcon from '../../Components/AnimatedIcon';
import Banner from '../../Components/BannersAd/Banner';
import SubScreenHeader from '../../Components/SubScreenHeader';

import { getTemplates } from '../../api/api.mjs';



const { height, width } = Dimensions.get('window');


const Templates = ({ navigation }) => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('====================================');
        console.log('Templates Screen Loaded');
        console.log('====================================');
        getTemplates({
            successCallback: (response) => {
                setTemplates(response);
                setLoading(false);
            },
            errorCallback: (error) => {
                console.log(error);
                setLoading(false);
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
                {
                    loading ? (
                        <View
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: 999,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignContent: 'center',
                                height: height
                            }}
                        >
                            {/* <AnimatedIcon name='wait' style={{ width: 150, height: 150 }} /> */}
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#9c9a9a' }}>Loading Templates. Please wait</Text>
                        </View>
                    ) : (
                        <Fragment>
                            <View style={{ alignItems: "center", alignContent: "center", height: height / 16.8 }}>
                                <Text style={styles.text}>Templates</Text>
                            </View>
                            {templates && (
                                <View
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '80%',
                                        backgroundColor: 'white',
                                        borderRadius: 10,
                                    }}
                                >

                                    <FlatList
                                        ListFooterComponent={() => <View style={{ height: 50 }}></View>}
                                        ListEmptyComponent={() => (
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '40%' }}>
                                                <MaterialCommunityIcons color={'#dedcdc'} name='file' size={100} />
                                                <Text style={{ color: '#9c9a9a', fontWeight: 'bold', fontSize: 20 }}>No Templates found.</Text>
                                            </View>
                                        )}
                                        data={templates ? templates : []}
                                        renderItem={({ item }) => (
                                            <TemplateItem
                                                imageSource={item.imageUrl}
                                                txt={item.title}
                                                iconBackgroundColor={"white"}
                                                onPress={() => handleTemplateSelection({ templateId: item.id })}
                                            />
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                        numColumns={2}
                                    // contentContainerStyle={{ justifyContent: 'space-between' }}
                                    />
                                </View>
                            )}

                        </Fragment>

                    )}
            </View>
            {/* View that will have items at bottom */}
            <View style={{ flex: 1, marginTop: 5, alignSelf: 'flex-end' }}>
                <Banner />
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
        height: height - 60,
        width: width / 1.05,
        alignSelf: "center",
        paddingHorizontal: 2,
        paddingBottom: 10,
    }
})