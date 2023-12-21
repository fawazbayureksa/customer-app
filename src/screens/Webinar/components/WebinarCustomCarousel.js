import React, { useRef, useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
    ImageBackground,
    Dimensions,
    FlatList,
    Animated,
    useWindowDimensions
} from 'react-native';
import { IMAGE_URL } from "@env";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import convertCSS from '../../../helpers/convertCSS';

const WebinarCustomCarousel = ({images, title, dataBanner}) => {
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const fontSize = convertCSS(themeSetting.body_typography.font_size);

    const width = Dimensions.get('window').width;
    const scrollX = new Animated.Value(0);
    let position = Animated.divide(scrollX, width);

    const renderProduct = ({ item, index }) => {
        return (
            <View
                style={{
                    width: Dimensions.get('window').width * (dataBanner.width / 100), height: convertCSS(dataBanner.height), alignItems: 'center', justifyContent: 'center',
                }}>
                <Image
                    source={{ uri: `${IMAGE_URL}public/cms/${item?.filename}` }}
                    style={{
                        width: '100%', height: '100%', resizeMode: 'contain',
                    }}
                />
            </View>
        );
    };

    return (
        <View style={{ width: '90%', marginLeft: '5%', marginTop: 10}}>
            <Text style={{ fontSize: convertCSS(themeSetting.h3_typography.font_size), color: 'black', fontWeight: "bold" }}>
                {title}
            </Text>
            <Text style={{ fontSize: fontSize }}>
                Ikut event atau kelas bersama chef profesional
            </Text>
            <FlatList
                data={images ? images : null}
                horizontal
                renderItem={renderProduct}
                showsHorizontalScrollIndicator={false}
                decelerationRate={0.8}
                snapToInterval={width}
                bounces={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false },
                )}
            />
            <View
                style={styles.viewCarousel}>
                {images
                    ? images.map((data, index) => {
                        let opacity = position.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [0.2, 1, 0.2],
                            extrapolate: 'clamp',
                        });
                        return (
                            <Animated.View
                                key={index}
                                style={[styles.animatedCarousel, { opacity }]} />
                        );
                    })
                    : null}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewCarousel: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        // marginTop: 5,
    },
    animatedCarousel: {
        width: '16%',
        height: 2.4,
        backgroundColor: 'black',
        marginHorizontal: 4,
        borderRadius: 100,
    }
});

export default WebinarCustomCarousel