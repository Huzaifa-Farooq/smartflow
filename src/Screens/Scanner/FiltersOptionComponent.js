
import React, { useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, } from 'react-native';
import Banner from '../../Components/BannersAd/Banner';
import Filters, { Filter } from './Filters';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import SubScreenHeader from '../../Components/SubScreenHeader';


const { height, width } = Dimensions.get('window');


DEFAULT_FILTER = 'Original';


export default FiltersOptionComponent = ({ route, navigation }) => {
    const { scannedImagesList } = route.params;

    const imageSource = { uri: scannedImagesList[0] };
    const [selectedFilter, setSelectedFilter] = useState(DEFAULT_FILTER);

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
                                        isSelected={selectedFilter === filterName}
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


const FilterImageOption = ({ filterName, onPress, FilterComponent, imageSource, onExtractImage, isSelected }) => {
    return (
        <TouchableOpacity
            style={styles.item}
            onPress={onPress}
        >
            <View
                style={[
                    isSelected ? { borderColor: '#deb018', borderWidth: 2 } : {},
                ]}
            >
                <FilterComponent imageSource={imageSource} style={styles.filterOptImg} onExtractImage={onExtractImage} />
                <View style={styles.textView}>
                    <Text ellipsizeMode={'tail'} style={styles.text} >{filterName}</Text>
                </View>
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
        marginLeft: 5,
        width: width - 10,
        paddingLeft: 8,
        paddingRight: 18,
        backgroundColor: '#f2f2f2',
        borderRadius: 10, 
        elevation: 5, 
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    item: {
        width: 75,
        height: 80,
        marginRight: 5,
        paddingTop: 5,

        justifyContent: 'center',
        alignItems: 'center',
    },
    filterOptImg: {
        width: 70, height: 70
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
    textView: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        // paddingLeft: 1,
        width: 70,
        bottom: 0
    },
    text: {
        color: 'white',
        fontSize: 9,
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
