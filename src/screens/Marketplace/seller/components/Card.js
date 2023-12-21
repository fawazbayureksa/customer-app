import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { Shadow } from 'react-native-shadow-2';
import { useTranslation } from 'react-i18next';
import truncate from '../../../../helpers/truncate';
import { useNavigation } from '@react-navigation/native';
import { IMAGE_URL } from '@env';
import Currency from '../../../../helpers/Currency';
import { MarketplaceRouteName } from '../../../../constants/marketplace_route/marketplaceRouteName';
import { Star1, Heart } from 'iconsax-react-native';
import { useSelector } from 'react-redux';
const WIDTH = Dimensions.get('window').width;

export default function CardAuction({ item, index, type }) {
    const { t } = useTranslation();
    const { navigate } = useNavigation();
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const getPercentDiscount = (price, discount) => {
        return `${Math.floor(100 - (price * 100) / discount)}%`;
    };

    const navigation = useNavigation();
    return (
        <TouchableOpacity
            key={index}
            onPress={() => {
                navigation.push(MarketplaceRouteName.PRODUCT_DETAIL, { product: item, })
            }}
            style={{
                paddingRight: 10,
                paddingBottom: 8,
                flex: 1,
            }}>
            <Shadow distance={3} startColor={'#00000010'} radius={8}>
                <View
                    style={{
                        // width: WIDTH / 2.1,
                        // backgroundColor: '#fff',
                        // borderRadius: 6,
                        // padding: 5,
                        // height: 280,
                        // borderWidth: 1,
                        // borderColor: 'rgba(10, 0, 0, 0.1)',
                        // paddingHorizontal: 10,
                        width: WIDTH / 2.2,
                        backgroundColor: '#fff',
                        borderRadius: 6,
                        padding: 8,
                        paddingVertical: 12,
                        height: 280,
                        borderWidth: 1,
                        borderColor: 'rgba(10, 0, 0, 0.1)',
                    }}>
                    <Image
                        source={{
                            uri: `${IMAGE_URL}public/marketplace/products/${item?.mp_product_images[0]?.filename}`,
                        }}
                        style={{
                            // flex: 1,
                            // resizeMode: 'contain',
                            // borderRadius: 8,
                            // width: "100%",
                            // justifyContent: 'center',
                            // alignSelf: 'center',
                            // marginBottom: 10,
                            resizeMode: 'cover',
                            borderRadius: 8,
                            width: (WIDTH / 2) * 0.7,
                            height: (WIDTH / 2) * 0.7,
                            justifyContent: 'center',
                            alignSelf: 'center',
                        }}
                    />
                    <Text
                        style={{
                            color: '#000',
                        }}>
                        {truncate(item.mp_product_informations[0]?.name)}
                    </Text>

                    <Text
                        style={{
                            fontSize: 12,
                            color: '#A0A0A0',
                        }}>
                        {item.mp_seller?.city}
                    </Text>
                    {item.is_sale_price && (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View
                                style={{
                                    padding: 2,
                                    backgroundColor: themeSetting?.accent_color?.value,
                                    borderRadius: 2,
                                }}>
                                <Text style={{ fontSize: 12, color: '#fff' }}>
                                    {getPercentDiscount(
                                        item.mp_product_skus[0].price,
                                        item.mp_product_skus[0].normal_price,
                                    )}
                                </Text>
                            </View>
                            <Text
                                style={{
                                    marginLeft: 5,
                                    textDecorationLine: 'line-through',
                                    fontSize: 12,
                                }}>
                                Rp {Currency(item.mp_product_skus[0].normal_price)}
                            </Text>
                        </View>
                    )}
                    <Text
                        style={{
                            color: '#000',
                            fontWeight: '500',
                        }}>
                        Rp {Currency(item.mp_product_skus[0].price)}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 6,
                            alignItems: 'center',
                        }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Star1
                                style={{ marginHorizontal: 6 }}
                                size={16}
                                color={themeSetting?.accent_color?.value}
                                variant="Outline"
                            />
                            <Text style={{ fontSize: 11 }}>
                                {(item.mp_product_ratings !== null &&
                                    item.mp_product_ratings[0]?.rating.toFixed(1)) ||
                                    '-'}
                            </Text>
                            <Text style={{ fontSize: 11, marginHorizontal: 5 }}>|</Text>
                            <Text style={{ fontSize: 11 }}>Terjual {item.sold_product}</Text>
                        </View>
                    </View>
                </View>
            </Shadow>
        </TouchableOpacity>
    );
}
