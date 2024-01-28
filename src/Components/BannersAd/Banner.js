import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-5919025595614042/2649509178';

const Banner=() =>{
  return (
    <View>
       <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
    />
    </View>
  )
}

const styles = StyleSheet.create({})

export default Banner;