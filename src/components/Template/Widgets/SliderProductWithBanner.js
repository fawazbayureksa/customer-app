import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import Currency from '../../../helpers/Currency';
import { Shadow } from 'react-native-shadow-2';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IMAGE_URL } from '@env';
import { MarketplaceRouteName } from '../../../constants/marketplace_route/marketplaceRouteName';
import { useNavigation } from '@react-navigation/native';
import { Heart, Star1 } from 'iconsax-react-native';
import { ActivityIndicator } from 'react-native';

const WIDTH = Dimensions.get('window').width;

export default function SliderProductWithBanner({
  type,
  products,
  data,
  productPerPage,
}) {
  const themeSetting = useSelector(
    state => state.themeReducer?.themeSetting?.theme,
  );
  const { navigate } = useNavigation();
  const navigation = useNavigation();
  const scrolling = useRef(new Animated.Value(0)).current;
  const translation = scrolling.interpolate({
    inputRange: [50, 120, 150],
    outputRange: [0, -30, -50],
    extrapolate: 'clamp',
  });
  const opacity = scrolling.interpolate({
    inputRange: [75, 100, 120, 150],
    outputRange: [1, 0.8, 0.3, 0.15],
    extrapolate: 'clamp',
  });
  const opacityProduct = scrolling.interpolate({
    inputRange: [100, 150],
    outputRange: [1, 1],
    extrapolate: 'clamp',
  });

  return (
    <>
      {products.length < 1 ?
        <View
          style={{
            flex: 1,
            justifyContent: "center",
          }}>
          <ActivityIndicator
            color="orange"
            size={'small'}
            style={{ padding: 10 }}
          />
        </View>
        :
        <View
          style={{
            ...Styles.fill,
            height: "auto",
            flexDirection: 'row',
            backgroundColor: data.value.background_color,
          }}>
          <Animated.View
            style={{
              width: 150,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: -1,
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              opacity: opacity,
              transform: [{ translateX: translation }],
            }}>
            <Image
              style={{ width: '100%', height: '100%' }}
              source={{
                uri: `${IMAGE_URL}public/cms/${data.value.banner_image}`,
              }}
            />
          </Animated.View>

          <Animated.ScrollView
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: scrolling,
                    },
                  },
                },
              ],
              { useNativeDriver: true },
            )}
            scrollEventThrottle={100}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ ...Styles.fill }}>
            <Animated.View
              style={{
                opacity: opacityProduct,
                flexDirection: 'row',
                paddingLeft: 160,
                paddingRight: 10
              }}>
              {products.map((item, index) => {
                return (
                  <View style={Styles.containerSlider} key={index}>
                    {type === 'type_1' &&
                      <TouchableOpacity
                        onPress={() =>
                          navigate(MarketplaceRouteName.PRODUCT_DETAIL, { product: item })
                        }
                        style={{
                          flex: 1,
                          // marginHorizontal: 10
                        }}
                      >
                        <Shadow distance={3} startColor={'#00000010'} radius={8}>
                          <View
                            style={{
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
                            {item.is_sale_price && (
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View
                                  style={{
                                    padding: 2,
                                    backgroundColor: themeSetting?.accent_color?.value,
                                    borderRadius: 2,
                                  }}>
                                  <Text style={{ fontSize: 12, color: "#FFFFFF" }}>
                                    {getPercentDiscount(
                                      item.mp_product_skus[0]?.price,
                                      item.mp_product_skus[0]?.normal_price,
                                    )}
                                  </Text>
                                </View>
                                <Text
                                  style={{
                                    marginLeft: 5,
                                    textDecorationLine: 'line-through',
                                    fontSize: 12,
                                  }}>
                                  Rp {Currency(item.mp_product_skus[0]?.normal_price)}
                                </Text>
                              </View>
                            )}
                            <Text
                              style={{
                                color: '#000',
                                fontWeight: '500',
                              }}>
                              Rp {Currency(item.mp_product_skus[0]?.price)}
                            </Text>

                            <Text
                              style={{
                                marginVertical: 6,
                                fontSize: 10,
                                color: '#A0A0A0',
                              }}>
                              {item.mp_seller?.city}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
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
                                  {(item?.mp_product_ratings != null &&
                                    item?.mp_product_ratings.length > 0 &&
                                    item?.mp_product_ratings[0]?.rating.toFixed(1)) ||
                                    '-'}
                                </Text>
                                <Text style={{ fontSize: 11, marginHorizontal: 5 }}>|</Text>
                                <Text style={{ fontSize: 11 }}>Terjual {item?.sold_product}</Text>
                              </View>

                              <Heart
                                style={{ marginHorizontal: 6 }}
                                size={16}
                                color={themeSetting?.accent_color?.value}
                                variant="Bold"
                              />
                            </View>
                          </View>
                        </Shadow>
                      </TouchableOpacity>
                    }
                    {type === 'type_2' &&
                      <TouchableOpacity
                        onPress={() =>
                          navigate(MarketplaceRouteName.PRODUCT_DETAIL, { product: item })
                        }
                        style={{
                          flex: 1,
                        }}
                      >
                        <Shadow distance={3} startColor={'#00000010'} radius={8}>
                          <View
                            style={{
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
                                resizeMode: 'cover',
                                borderRadius: 8,
                                width: (WIDTH / 2) * 0.7,
                                height: (WIDTH / 2) * 0.7,
                                justifyContent: 'center',
                                alignSelf: 'center',
                                // marginBottom: 5,

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
                                color: '#000',
                                fontWeight: '500',
                              }}>
                              Rp {Currency(item.mp_product_skus[0].price)}
                            </Text>
                            {item.is_sale_price && (
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View
                                  style={{
                                    padding: 2,
                                    backgroundColor: themeSetting?.accent_color?.value,
                                    borderRadius: 2,
                                  }}>
                                  <Text style={{ fontSize: 12, color: "#FFFFFF" }}>
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
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginVertical: 6,
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
                                  {item.mp_product_ratings[0]?.rating.toFixed(1) || '-'}
                                </Text>
                                <Text style={{ fontSize: 11, marginHorizontal: 5 }}>|</Text>
                                <Text style={{ fontSize: 11 }}>Terjual {item.sold_product}</Text>
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}>
                              <Text
                                style={{
                                  fontSize: 10,
                                  color: '#A0A0A0',
                                }}>
                                {item.mp_seller?.city}
                              </Text>
                              <Heart
                                style={{ marginHorizontal: 6 }}
                                size={16}
                                color={themeSetting?.accent_color?.value}
                                variant="Bold"
                              />
                            </View>
                          </View>
                        </Shadow>
                      </TouchableOpacity>
                    }
                    {type === "type_3" &&
                      <TouchableOpacity
                        onPress={() => {
                          type === 'related'
                            ? navigation.push(MarketplaceRouteName.PRODUCT_DETAIL, {
                              product: item,
                            })
                            : navigate(MarketplaceRouteName.PRODUCT_DETAIL, { product: item });
                        }}
                        style={{
                          // paddingRight: 10,
                          // paddingBottom: 8,
                          flex: 1,
                        }}>
                        <Shadow distance={3} startColor={'#00000010'} radius={8}>
                          <View
                            style={{
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
                                fontSize: 10,
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
                                  <Text style={{ fontSize: 12, color: "#FFFFFF" }}>
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
                    }
                  </View>
                );
              })}
              <View style={Styles.containerSlider}>
                <TouchableOpacity style={Styles.containerContent}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <Shadow distance={3} startColor={'#00000010'} radius={30}>
                      <View
                        style={{
                          backgroundColor: '#fff',
                          borderRadius: 30,
                          padding: 5,
                          borderWidth: 1,
                          borderColor: 'rgba(10, 0, 0, 0.1)',
                        }}>
                        <Icon
                          name="chevron-right"
                          size={30}
                          color={themeSetting?.accent_color?.value}
                        />
                      </View>
                    </Shadow>
                    <Text
                      style={{
                        fontWeight: '500',
                        color: themeSetting?.accent_color?.value,
                        marginVertical: 5,
                        fontSize: 13,
                      }}>
                      Lihat Produk Lainnya
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.ScrollView>
        </View >
      }
    </>
  );
}




const getPercentDiscount = (price, discount) => {
  return `${Math.floor(100 - (price * 100) / discount)}%`;
};

const truncate = str => {
  if (str.length > 30) {
    return str.slice(0, 30) + '...';
  } else {
    return str;
  }
};


const Styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  containerSlider: {
    width: WIDTH * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 5,
  },
  containerContent: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});
