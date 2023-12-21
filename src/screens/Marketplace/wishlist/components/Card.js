import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Shadow } from 'react-native-shadow-2';
import { Star1, Heart } from 'iconsax-react-native';
import Currency from '../../../../helpers/Currency';
import { MarketplaceRouteName } from '../../../../constants/marketplace_route/marketplaceRouteName';
import { IMAGE_URL } from '@env';
import { truncate } from 'lodash';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuctionRouteName } from '../../../../constants/auction_route/auctionRouteName';

const WIDTH = Dimensions.get('window').width * 0.95;

export default function Card({ data, loading }) {
  const { navigate } = useNavigation();
  const themeSetting = useSelector(
    state => state.themeReducer?.themeSetting?.theme,
  );

  return (
    <>
      {loading ? (
        <ActivityIndicator
          color={themeSetting?.accent_color?.value}
          size={'large'}
          style={{ padding: 20 }}
        />
      ) : (
        data &&
        data.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigate(MarketplaceRouteName.PRODUCT_DETAIL, { product: item.mp_product })
              }
              style={{
                marginHorizontal: 4,
                marginVertical: 10,
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
                      uri: `${IMAGE_URL}public/marketplace/products/${item?.mp_product?.mp_product_images[0]?.filename}`,
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
                  <View>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: '#000',
                      }}>
                      {truncate(
                        item.mp_product?.mp_product_informations[0]?.name,
                      )}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginVertical: 2,
                        alignItems: 'center',
                      }}>
                      <Icon
                        name="check-circle"
                        size={20}
                        color="#FA9E25"
                        style={{ marginRight: 5 }}
                      />
                      <Text
                        style={{
                          marginVertical: 6,
                          fontSize: 10,
                          color: '#A0A0A0',
                        }}>
                        {item.mp_product?.mp_seller?.city}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}>
                      {item?.mp_product?.mp_product_skus[0].normal_price !=
                        0 && (
                          <>
                            <View
                              style={{
                                paddingHorizontal: 10,
                                paddingVertical: 3,
                                backgroundColor: '#FFD7A8',
                                borderRadius: 10,
                              }}>
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: '#F8931D',
                                }}>
                                {getPercentDiscount(
                                  item?.mp_product?.mp_product_skus[0].price,
                                  item?.mp_product?.mp_product_skus[0]
                                    .normal_price,
                                )}
                              </Text>
                            </View>
                            <Text
                              style={{
                                textAlign: 'right',
                                fontSize: 12,
                                textDecorationLine: 'line-through',
                                marginHorizontal: 4,
                                color: '#8D8D8D',
                              }}>
                              Rp{' '}
                              {Currency(
                                item?.mp_product?.mp_product_skus[0].normal_price,
                              )}
                            </Text>
                          </>
                        )}
                      <Text style={{ fontWeight: '700' }}>
                        Rp{' '}
                        {Currency(item?.mp_product?.mp_product_skus[0].price)}
                      </Text>
                    </View>

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
                          {item.mp_product?.mp_product_ratings
                            ? item.mp_product?.mp_product_ratings[0]?.rating.toFixed(
                              1,
                            )
                            : '-'}
                        </Text>
                        <Text style={{ fontSize: 11, marginHorizontal: 5 }}>
                          |
                        </Text>
                        <Text style={{ fontSize: 11 }}>
                          Terjual {item.mp_product?.sold_product}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Shadow>
            </TouchableOpacity>
          );
        })
      )}
    </>
  );
}

const getPercentDiscount = (price, discount) => {
  return `${Math.floor(100 - (price * 100) / discount)}%`;
};
