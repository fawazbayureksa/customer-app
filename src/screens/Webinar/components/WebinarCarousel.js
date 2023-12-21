import React, { useRef, useState, useEffect } from 'react';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import convertCSS from '../../../helpers/convertCSS';
import { IMAGE_URL } from "@env";

const WIDTH = Dimensions.get('window').width;

const WebinarCarousel = ({images, title, dataBanner}) => {
    // const WIDTH = Dimensions.get('window').width;
    const { t } = useTranslation()
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const carouselRef = useRef(null);


    const renderItem = ({ item, index }, parallaxProps) => {
        // console.log(item)
        return (
            <View 
            // style={styles.item} //default
            style={{
                width: `${dataBanner.width}%`,
                height: WIDTH / 2
                // height: `${dataBanner.height}%`
            }}
            >
                <ParallaxImage
                    source={{ uri: `${IMAGE_URL}public/cms/${item?.filename}` }}
                    // source={item}
                    width={WIDTH}
                    containerStyle={styles.imageContainer}
                    style={styles.image}
                    parallaxFactor={0.4}
                    {...parallaxProps}
                />
            </View>
        );
    };

    return (
        <>
            <View style={{ backgroundColor: "#fff", paddingBottom: 20, paddingTop: 10 }}>
                <Text style={{
                    marginLeft: '2.5%',
                    fontWeight: "700",
                    fontSize: convertCSS(themeSetting.h3_typography.font_size),
                }}
                >
                    {title}
                </Text>
                <Text style={{
                    marginLeft: '2.5%',
                    marginBottom: 10,
                    fontWeight: "400",
                    fontSize: convertCSS(themeSetting.body_typography.font_size),
                    color: "#8D8D8D"

                }}
                >
                    {t('webinar:sub_title')}
                </Text>
                <Carousel
                    ref={carouselRef}
                    sliderWidth={WIDTH}
                    sliderHeight={WIDTH}
                    itemWidth={WIDTH}
                    data={images}
                    renderItem={renderItem}
                    hasParallaxImages={true}
                    autoplay={dataBanner?.auto_play === "enable" ? true : false}
                    autoplayDelay={parseInt(dataBanner?.animation_speed)}
                    autoplayInterval={parseInt(dataBanner?.slideshow_speed)}
                    loop
                />
            </View>

        </>

    );
}

export default WebinarCarousel


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        width: WIDTH,
        height: WIDTH / 2,
    },
    imageContainer: {
        flex: 1,
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderRadius: 8,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'contain',
    },
});