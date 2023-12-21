import React, { useRef, useState, useEffect, createRef } from 'react';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, FlatList, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../helpers/axiosInstance';
import convertCSS from '../../../helpers/convertCSS';
import { IMAGE_URL } from "@env";

const WIDTH = Dimensions.get('window').width;


const ForumCarousel = () => {
    const [images, setImage] = useState([])
    const [loading, setLoading] = useState(false);
    // const WIDTH = Dimensions.get('window').width;
    const [dataBanner, setDataBanner] = useState()
    const [urlBanner, setUrlBanner] = useState([]);

    const { t } = useTranslation()
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const scrollX = new Animated.Value(0);
    let position = Animated.divide(scrollX, WIDTH);

    useEffect(() => {
        getBanner()
    }, []);

    const getBanner = () => {
        setLoading(true)
        axiosInstance
            .get('forum/banner/get')
            .then(res => {
                setDataBanner(res.data.data)
                setImage(res.data.data.forum_banner_slide)
                res.data.data.forum_banner_slide.map(item => {
                    getUrlMedia(item.filename);
                });
            }).catch(error => {
                console.error('error banner: ', error.response.data.message);
            }).finally(() => setLoading(false))
    }

    const carouselRef = useRef(null);

    const getUrlMedia = async filename => {
        let params = {
            folder: 'cms',
            filename,
        };
        let url = 'images/getPublicUrl';
        await axiosInstance.get(url, { params }).then(response => {
            setUrlBanner(prev => [...prev, response.data]);
        });
    };


    // const renderItem = ({ item, index }) => {
    //     return (
    //         <View
    //             key={index}
    //             style={{
    //                 width: Dimensions.get('window').width,
    //                 height: convertCSS(200),
    //                 alignItems: 'center',
    //                 justifyContent: 'center',
    //             }}>
    //             <Image
    //                 source={{ uri: urlBanner[index] }}
    //                 style={{
    //                     width: '95%',
    //                     height: '100%',
    //                     resizeMode: 'contain',
    //                 }}
    //             />
    //         </View>
    //     );
    // };
    const renderItem = ({ item, index }, parallaxProps) => {
        return (
            <View style={styles.item}>
                <ParallaxImage
                    source={{ uri: `${IMAGE_URL}public/cms/${item?.filename}` }}
                    width={WIDTH}
                    containerStyle={styles.imageContainer}
                    style={{
                        ...StyleSheet.absoluteFillObject,
                        resizeMode: 'cover',
                        borderRadius: 8,
                    }}
                    parallaxFactor={0.4}
                    {...parallaxProps}
                />
            </View>
        );
    };



    return (
        <>
            <View style={{ backgroundColor: "#fff", paddingBottom: 20, paddingTop: 10 }}>
                <ScrollView>
                    <Text style={{
                        marginLeft: 20,
                        fontWeight: "700",
                        fontSize: convertCSS(themeSetting.h3_typography.font_size),
                    }}
                    >
                        {t('forum:tokodapur_forum')}
                    </Text>
                    <Text style={{
                        marginLeft: 20,
                        marginBottom: 10,
                        fontWeight: "400",
                        fontSize: convertCSS(themeSetting.body_typography.font_size),
                        color: "#8D8D8D"

                    }}
                    >
                        {t('forum:faqs')}
                    </Text>
                    <View
                        style={{
                            marginVertical: 5,
                            marginHorizontal: 10
                        }}>
                        <Carousel
                            ref={carouselRef}
                            sliderWidth={WIDTH * 0.95}
                            itemWidth={WIDTH * 0.95}
                            data={images}
                            renderItem={renderItem}
                            hasParallaxImages={true}
                            autoplay={dataBanner?.auto_play === "enable"}
                            autoplayDelay={parseInt(dataBanner?.animation_speed)}
                            autoplayInterval={parseInt(dataBanner?.slideshow_speed)}
                            loop
                        />
                    </View>
                    {/* <FlatList
                        data={images ? images : null}
                        horizontal
                        renderItem={renderItem}
                        showsHorizontalScrollIndicator={false}
                        decelerationRate={0.8}
                        snapToInterval={WIDTH}
                        bounces={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false },
                        )}
                    /> */}
                    {dataBanner?.indicator === "pagination" &&
                        <View style={styles.viewCarousel}>
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
                                            style={[styles.animatedCarousel]}
                                        />
                                    );
                                })
                                : null}
                        </View>
                    }
                </ScrollView>
            </View>

        </>

    );
}

export default ForumCarousel;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        width: WIDTH,
        height: (WIDTH * 8) / 16,
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
    viewCarousel: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        // marginTop: 5,
    },
    animatedCarousel: {
        width: '10%',
        height: 2.4,
        backgroundColor: 'black',
        marginHorizontal: 4,
        borderRadius: 100,
    },
});
