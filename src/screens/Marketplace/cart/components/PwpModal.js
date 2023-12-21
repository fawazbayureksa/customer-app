import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, FlatList, Animated, Dimensions, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Currency from '../../../../helpers/Currency';
import { CustomDivider } from '../../../../components/Divider';
import colors from '../../../../assets/theme/colors';
import axiosInstance from '../../../../helpers/axiosInstance';
import CustomButton from '../../../../components/CustomButton';
import IsEmpty from '../../../../helpers/IsEmpty';
const WIDTH = Dimensions.get('window').width;
const PwpModal = (props) => {
    const scrollX = new Animated.Value(0);
    let position = Animated.divide(scrollX, WIDTH);
    const toast = useToast();
    const { t } = useTranslation();
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const [productDetail, setProductDetail] = React.useState({});
    const [photoProduct, setPhotoProduct] = React.useState([]);
    const [quantity, setQuantity] = React.useState('1');
    const [productVariant, setProductVariant] = React.useState([]);
    const [productInformation, setProductInformation] = React.useState([]);
    const [normalPrice, setNormalPrice] = React.useState(0);
    const [price, setPrice] = React.useState(0);
    const [productSku, setProductSku] = React.useState([]);
    const [currentVariant, setCurrentVariant] = useState({});
    const [selectedVariant, setSelectedVariant] = React.useState([]);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [sku, setSku] = useState(null);

    useEffect(() => {
        setProductDetail(props.detail.mp_product);
        setPhotoProduct(props?.detail?.mp_product.mp_product_images);
        setProductInformation(
            props?.detail?.mp_product.mp_product_informations[0],
        );
        setProductSku(props?.detail?.mp_product.mp_product_skus[0]);
        setProductVariant(props?.detail?.mp_product.mp_product_variants);
        setPrice(props?.detail?.mp_product.mp_product_skus[0]?.price);
        setNormalPrice(props?.detail?.mp_product.mp_product_skus[0]?.normal_price);
        setCurrentVariant(
            props.detail.mp_product.mp_product_skus.find(
                value => value.is_main == true,
            ),
        );
        if (props?.detail.mp_product.is_variant == false) {
            setSku(props?.detail.mp_product.mp_product_skus[0].id);
        }
    }, [])

    const getPercentDiscount = (price, discount) => {
        return `${Math.floor(100 - (price * 100) / discount)}%`;
    };

    const getArrayUnique = (arrayJson, prop) => {
        let newArray = [];
        newArray = arrayJson.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
        // console.log(JSON.stringify(newArray));
        return newArray;
    };

    const onChangeVariant = variant => {
        let newVariant = [];
        if (selectedVariant.length > 0) {
            let index = selectedVariant.findIndex(
                x => x.mp_product_sku_variant_id == variant.mp_product_sku_variant_id,
            );
            newVariant = [...selectedVariant];
            if (index !== -1) {
                newVariant[index] = variant;
            } else {
                newVariant.push(variant);
            }
        } else {
            newVariant.push(variant);
        }
        setSelectedVariant(newVariant);
        let variantName = [];
        newVariant.map(item => {
            variantName.push(item.name);
        });

        onGetVariant(variantName);
    };

    const onGetVariant = variant => {
        let url = 'ecommerce/product/variant-change';
        axiosInstance
            .post(url, {
                variant: JSON.stringify(variant),
                product_id: productDetail.id,
            })
            .then(response => {
                setSku(response.data.data.id);
            })
            .catch(error => console.log('error onChangeVariant', error.response.data));
    };

    const isSelected = variant => {
        if (selectedVariant.length > 0) {
            let index = selectedVariant.findIndex(x => x.id == variant.id);
            if (index !== -1) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    };
    const checkVariantSelected = () => {
        let result = true;
        if (productDetail.is_variant) {
            if (IsEmpty(selectedVariant)) {
                result = false;
            } else if (
                productDetail.mp_product_variants.length > selectedVariant.length
            ) {
                result = false;
            }
        } else {
            result = true;
        }
        return result;
    };

    const onAddToCart = () => {

        setLoadingSubmit(true);
        let params = {
            qty: 1,
            sku_id: sku,
        };
        if (checkVariantSelected()) {
            let url = 'cart/add';
            axiosInstance
                .post(url, params)
                .then(response => {
                    if (response.data.success) {
                        toast.show(t('common:successAddToCart'), {
                            placement: 'top',
                            type: 'success',
                            animationType: 'zoom-in',
                            duration: 3000,
                        });
                    }
                    props.setModalPwp(false)
                    props.getCart()
                })
                .catch(error => console.log('error onAddToCart', error.response.data))
                .finally(() => setLoadingSubmit(false));
        } else {
            toast.show(t('common:pleaseSelectVariant'), {
                placement: 'top',
                type: 'warning',
                animationType: 'zoom-in',
                duration: 3000,
            });
            setLoadingSubmit(false);
        }
    };

    return (
        <ScrollView>
            <FlatList
                data={photoProduct}
                horizontal
                renderItem={({ item, index }) => {
                    return (
                        <GetMedia
                            item={item}
                            index={index}
                            filename={item.filename}
                        />);
                }}
                showsHorizontalScrollIndicator={false}
                decelerationRate={0.8}
                snapToInterval={WIDTH}
                bounces={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false },
                )}
            />
            <View style={styles.viewCarousel}>
                {photoProduct
                    ? photoProduct.map((data, index) => {
                        let opacity = position.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [0.2, 1, 0.2],
                            extrapolate: 'clamp',
                        });
                        return (
                            <Animated.View
                                key={index}
                                style={[styles.animatedCarousel, { opacity }]}
                            />
                        );
                    })
                    : null}
            </View>
            <Text
                style={{
                    color: '#404040',
                    fontWeight: '700',
                    fontSize: 18,
                }}>
                Rp {Currency(price)}
            </Text>
            {productDetail.is_sale_price && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                        style={{
                            paddingHorizontal: 10,
                            paddingVertical: 3,
                            backgroundColor: '#FFD7A8',
                            borderRadius: 10,
                        }}>
                        <Text style={{ fontSize: 12, color: '#F8931D' }}>
                            {getPercentDiscount(price, normalPrice)}
                        </Text>
                    </View>
                    <Text
                        style={{
                            marginLeft: 5,
                            textDecorationLine: 'line-through',
                            fontSize: 12,
                            color: '#404040'
                        }}>
                        Rp {Currency(normalPrice)}
                    </Text>
                </View>
            )}
            <View>
                <Text style={{ color: '#404040' }}>
                    {productInformation?.name}
                </Text>
                <View
                    style={{
                        marginVertical: 6,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <Icon
                        name="star"
                        size={16}
                        color="#FFD600"
                    />
                    <Text style={styles.smallText}>
                        {productDetail?.rating || '-'} (
                        {productDetail?.mp_product_ratings?.length}{' '}
                        {t('common:reviews')})
                    </Text>
                    <View style={{ marginLeft: 5, width: 6, height: 6, backgroundColor: '#8D8D8D', borderRadius: 10 }} />
                    <Text style={styles.smallText}>
                        {t('common:sold')} {productDetail?.sold_product}
                    </Text>
                </View>
            </View>
            <CustomDivider />
            <View>
                <Text style={{ color: '#000' }}>{t('common:chooseVariant')}</Text>
                {productDetail?.is_variant ? (
                    productVariant.map((item, index) => {
                        return (
                            <View style={{ marginVertical: 8 }} key={index}>
                                <Text style={{ color: '#8D8D8D' }}>{item.name} :</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    {getArrayUnique(
                                        item.mp_product_sku_variant_options,
                                        'name',
                                    ).map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => onChangeVariant(item)}
                                                key={index}
                                                style={{
                                                    marginRight: 5,
                                                    marginVertical: 2,
                                                    borderRadius: 40,
                                                    alignSelf: 'flex-start',
                                                    paddingVertical: 2,
                                                    paddingHorizontal: 12,
                                                    borderWidth: isSelected(item) ? 2 : 1,
                                                    borderColor: isSelected(item)
                                                        ? themeSetting?.accent_color?.value
                                                        : '#DCDCDC',
                                                }}>
                                                <Text
                                                    style={{
                                                        color: isSelected(item)
                                                            ? themeSetting?.accent_color?.value
                                                            : '#DCDCDC',
                                                    }}>
                                                    {item.name}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <Text style={{ color: colors.pasive }}>
                        {t('common:noVariant')}
                    </Text>
                )}
            </View>
            <CustomDivider />
            <CustomButton
                style={{ height: 43 }}
                loading={loadingSubmit}
                onPress={onAddToCart}
                disabled={loadingSubmit}
                primary
                title={t('common:addToCart')}
            />

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    smallText: { marginLeft: 4, fontSize: 12 },
    container: {
        flex: 1,
    },
    viewCarousel: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        marginTop: -5,
    },
    animatedCarousel: {
        width: 8,
        height: 8,
        backgroundColor: '#F8931D',
        marginHorizontal: 4,
        borderRadius: 100,
    },
});
export default PwpModal;

const GetMedia = ({ filename, item, index }) => {
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const [url, setUrl] = useState('');

    useEffect(() => {
        let params = {
            folder: 'marketplace/products',
            filename: filename,
        };
        let url = 'images/getPublicUrl';
        axiosInstance
            .get(url, { params })
            .then(response => {
                setUrl(response.data);
            })
            .catch(error => console.log('error GetMedia', error.response.data));
    }, []);

    return (
        <View
            key={index}
            style={{
                margin: 7,
                borderRadius: 5,
            }}>
            <Image
                source={{ uri: url }}
                style={{
                    borderColor: themeSetting?.accent_color?.value,
                    marginRight: 2,
                    borderRadius: 5,
                    width: WIDTH * 0.9,
                    height: WIDTH * 0.9,
                    alignSelf: 'center',
                }}
            />
        </View>
    );
};
