
import React, { useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, } from 'react-native';
import Banner from '../../Components/BannersAd/Banner';
import Filters, { Filter } from './Filters';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import SubScreenHeader from '../../Components/SubScreenHeader';


const { height, width } = Dimensions.get('window');


export default FiltersOptionComponent = ({ route, navigation }) => {
    const { scannedImagesList } = route.params;

    const imageSource = { uri: scannedImagesList[0] };
    const [selectedFilter, setSelectedFilter] = useState('Original');

    return (
        <View style={styles.container}>
            <SubScreenHeader
                title={'Select Filter'}
                icon={"keyboard-backspace"}
                onPress={() => navigation.goBack()}
            />
            <View>
                <Filter filterName={selectedFilter} imageSource={imageSource} style={styles.capturedimage} />
            </View>
            <View>
                <View style={styles.bottomview}>
                    <TouchableOpacity
                        style={styles.bottombuttons}
                        onPress={() => {
                            navigation.navigate('ApplyFilters',
                                { filterName: selectedFilter, scannedImagesList: scannedImagesList }
                            )
                        }}
                    >
                        <MaterialCommunityIcons name="check" size={30} color="black" />
                    </TouchableOpacity>
                </View>

                <View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.scrollView}
                    >
                        {
                            Object.entries(Filters).map(([filterName, FilterComponent]) => {
                                return (
                                    <FilterImageOption
                                        key={filterName}
                                        filterName={filterName}
                                        FilterComponent={FilterComponent}
                                        imageSource={imageSource}
                                        onPress={() => { setSelectedFilter(filterName) }}
                                    />
                                )
                            })
                        }
                    </ScrollView>
                </View>
            </View>
        </View>
    )

}


const FilterImageOption = ({ filterName, onPress, FilterComponent, imageSource, onExtractImage }) => {
    return (
        <TouchableOpacity
            style={styles.item}
            onPress={onPress}
        >
            <View>
                <FilterComponent imageSource={imageSource} style={styles.filterOptImg} onExtractImage={onExtractImage} />
                <Text style={styles.text} >{filterName}</Text>
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        marginTop: 20,
        marginBottom: 5,
        paddingLeft: 8,
        paddingRight: 18,
    },
    item: {
        width: 70,
        height: 70,
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterOptImg: {
        width: 70, height: 70, marginBottom: 5
    },
    capturedimage: {
        height: height / 1.6,
        width: width / 1.2,
        marginHorizontal: width / 11.9,
        marginBottom: 20,
        marginTop: 10,
        borderWidth: 1,
        borderColor: "grey",
    },
    text: {
        position: "absolute",
        color: 'white',
        fontSize: 8,
        fontWeight: "700",
        bottom: 8,
        marginHorizontal: 12
    },
    bottomview: {
        height: 30,
        flexDirection: "row"
    },
    bottombuttons: {
        bordercolor: "black",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: width / 11.9,
        elevation: 5
    }

})
