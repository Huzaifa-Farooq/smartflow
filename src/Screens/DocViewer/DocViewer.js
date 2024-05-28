import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import Pdf from 'react-native-pdf';
import CustomHeader from '../../Components/CustomHeader';
import Banner from '../../Components/BannersAd/Banner';
import SubScreenHeader from '../../Components/SubScreenHeader';


const { height, width } = Dimensions.get('window');

export default DocViewer = ({ navigation, route }) => {
    const { path } = route.params; // Access filePath from route.params
    const { name } = route.params; // Access filePath from route.params
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    console.log("File path " + path);  // Access filePath for debugging
    return (
        <View style={{ flex: 1 }}>
            <SubScreenHeader
                titleElement={
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                color: 'black',
                            }}>
                            { name.length > 30 ? name.substring(0, 30) + "..." : name}
                        </Text>
                    </View>
                }
                icon={"keyboard-backspace"}
                onPress={() => navigation.goBack()}
            />
            <View style={{ flex: 1, padding: 5, }}>
                <Pdf
                    source={{ uri: path, cache: true }}
                    onLoadComplete={(numberOfPages) => {
                        setPages(numberOfPages);
                        console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page) => {
                        setCurrentPage(page);
                    }}
                    onError={(error) => {
                        console.log(error); // Log errors for debugging
                    }}
                    trustAllCerts={false}

                    onPressLink={(uri) => {
                    }}
                    style={styles.pdf}
                />
            </View>
            <Banner />
        </View>
    );
};

const styles = StyleSheet.create({
    pdf: {
        width: (width * 1) - 10,
        height: (height * 0.82) - 10,
    },
});