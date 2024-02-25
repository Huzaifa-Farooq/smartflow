import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, RefreshControl, TouchableHighlight, Dimensions } from 'react-native';
import SearchBar from "react-native-dynamic-search-bar";
import AnimatedIcon from './AnimatedIcon';


const height = Dimensions.get('window').height;

export const ListEmptyComponent = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 20 }}>No files found.</Text>
        </View>
    )
}

export const ListFooterComponent = ({ height }) => {
    return (
        <View style={{ height: height }}>
        </View>
    )
}


export const RefreshControlComponent = ({ refreshing, onRefresh }) => {
    console.log('====================================');
    console.log('refreshing', refreshing);
    console.log('====================================');
    return (
        <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#deb018"
        />
    )
}


export const CustomSearchBarView = ({ onChangeText, onClearPress, search, viewStyle, searchBarStyle }) => {
    return (
        <Animated.View
            style={{
                width: '90%',
                marginTop: 10,
                paddingBottom: 10,
                marginBottom: 10,
                height: 30,
                zIndex: 1,
                ...viewStyle
            }}
        >
            <SearchBar
                style={{
                    width: '90%',
                    marginTop: 10,
                    borderRadius: 50,
                    ...searchBarStyle
                }}
                placeholder="Search"
                onChangeText={(text) => onChangeText(text)}
                onClearPress={() => onClearPress("")}
                clearIconComponent={search ? null : <></>}
                searchIconImageStyle={{ tintColor: 'black' }}
                clearIconImageStyle={{ tintColor: 'black' }}
            />
        </Animated.View>
    )
}


export const FileLoadingComponent = () => {
    return (
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
            <AnimatedIcon name='fileSearch' style={{ width: 150, height: 150 }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>Loading...</Text>
        </View>
    )
}
