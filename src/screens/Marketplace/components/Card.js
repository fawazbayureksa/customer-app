import {
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Shadow } from 'react-native-shadow-2';
import { Star1, Heart } from 'iconsax-react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Currency from '../../../helpers/Currency';
import { MarketplaceRouteName } from '../../../constants/marketplace_route/marketplaceRouteName';
import { IMAGE_URL } from '@env';
import CountdownComponent from '../../Auction/history/components/CountdownComponent';
import moment from 'moment';
import convertDate from '../../Auction/detail_auction/helpers/convertDate';
import convertTime from '../../Auction/detail_auction/helpers/convertTime';
import { AuctionRouteName } from '../../../constants/auction_route/auctionRouteName';
const WIDTH = Dimensions.get('window').width * 0.9;

export default function Card({ product, index, data }) {

  return (
    <>
      {data?.value.layout === 'type_2' && (
        <Card2 item={product} index={index} data={data} />
      )}
      {data?.value.layout === 'type_3' && (
        <Card3 item={product} index={index} data={data} />
      )}
      {data?.value.layout === 'type_1' && (
        <Card1 item={product} index={index} data={data} />
      )}
    </>
  );
}

const truncate = str => {
  if (str.length > 30) {
    return str.slice(0, 30) + '...';
  } else {
    return str;
  }
};

const Card1 = ({ item, index, data }) => {
  const { navigate } = useNavigation();
  const themeSetting = useSelector(
    state => state.themeReducer?.themeSetting?.theme,
  );

  return (
    <TouchableOpacity
      key={index}
      onPress={() =>
        navigate(MarketplaceRouteName.PRODUCT_DETAIL, { product: item })
      }
      style={{
        paddingBottom: 8,
        flex: 1,
        paddingHorizontal: 2,
      }}>
      <Shadow distance={3} startColor={'#00000010'} radius={8}>
        <View
          style={{
            width: WIDTH / data?.value?.number_of_column,
            backgroundColor: '#fff',
            borderRadius: 6,
            padding: 8,
            height: 280,
            borderColor: 'rgba(10, 0, 0, 0.1)',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <Image
            source={{
              uri: `${IMAGE_URL}public/marketplace/products/${item?.mp_product_images[0]?.filename}`,
            }}
            style={{
              resizeMode: 'cover',
              borderRadius: 8,
              width: (WIDTH / data?.value?.number_of_column) * 0.7,
              height: (WIDTH / data?.value?.number_of_column) * 0.7,
              justifyContent: 'center',
              alignSelf: 'center',
            }}
          />
          <View>
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

            <Text
              style={{
                marginVertical: 6,
                fontSize: 12,
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
                  {item.mp_product_ratings[0]?.rating.toFixed(1) || '-'}
                </Text>
                <Text style={{ fontSize: 11, marginHorizontal: 5 }}>|</Text>
                <Text style={{ fontSize: 11 }}>Terjual {item.sold_product}</Text>
              </View>

              <Heart
                style={{ marginHorizontal: 6 }}
                size={16}
                color={themeSetting?.accent_color?.value}
                variant="Bold"
              />
            </View>
          </View>
        </View>
      </Shadow>
    </TouchableOpacity>
  );
};

const Card2 = ({ item, index, data }) => {
  const { navigate } = useNavigation();
  const themeSetting = useSelector(
    state => state.themeReducer?.themeSetting?.theme,
  );

  return (
    <TouchableOpacity
      onPress={() =>
        navigate(MarketplaceRouteName.PRODUCT_DETAIL, { product: item })
      }
      key={index}
      style={{
        paddingBottom: 8,
        flex: 1,
        paddingHorizontal: 2,
      }}>
      <Shadow distance={3} startColor={'#00000010'} radius={8}>
        <View
          style={{
            width: WIDTH / data?.value?.number_of_column,
            backgroundColor: '#fff',
            borderRadius: 6,
            padding: 8,
            height: 280,
            borderColor: 'rgba(10, 0, 0, 0.1)',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <Image
            source={{
              uri: `${IMAGE_URL}public/marketplace/products/${item?.mp_product_images[0]?.filename}`,
            }}
            style={{
              resizeMode: 'cover',
              borderRadius: 8,
              width: (WIDTH / data?.value?.number_of_column) * 0.7,
              height: (WIDTH / data?.value?.number_of_column) * 0.7,
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
                fontSize: 12,
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
  );
};

const Card3 = ({ item, index, data }) => {
  const { navigate } = useNavigation();
  const themeSetting = useSelector(
    state => state.themeReducer?.themeSetting?.theme,
  );

  const onDetail = (type) => {
    if (type === "auction") {
      navigate(AuctionRouteName.DETAIL_AUCTION, {
        productSlug: item.slug,
        sellerSlug: item?.mp_seller?.slug,
        product_id: item?.id
      })
    } else {
      navigate(MarketplaceRouteName.PRODUCT_DETAIL, { product: item })
    }
  }
  return (
    <TouchableOpacity
      key={index}
      onPress={() => onDetail(item.type)}
      style={{
        paddingBottom: 8,
        flex: 1,
        paddingHorizontal: 2,
      }}>
      <Shadow distance={3} startColor={'#00000010'} radius={8}>
        <View
          style={{
            width: WIDTH / data?.value?.number_of_column,
            backgroundColor: '#fff',
            borderRadius: 6,
            padding: 8,
            height: 280,
            borderColor: 'rgba(10, 0, 0, 0.1)',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <Image
            source={{
              uri: `${IMAGE_URL}public/marketplace/products/${item?.mp_product_images[0]?.filename}`,
            }}
            style={{
              resizeMode: 'cover',
              borderRadius: 8,
              width: (WIDTH / data?.value?.number_of_column) * 0.7,
              height: (WIDTH / data?.value?.number_of_column) * 0.7,
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
          {item.type === 'auction' &&
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}>
              <Text style={{ fontSize: 12 }}>
                {convertDate(item.active_start_date, item.active_end_date)}
              </Text>
              <Text style={{ fontSize: 12 }}>
                {convertTime(item.active_start_date, item.active_end_date)}
              </Text>
            </View>
          }
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
                {item.mp_product_ratings[0]?.rating.toFixed(1) || '-'}
              </Text>
              <Text style={{ fontSize: 11, marginHorizontal: 5 }}>|</Text>
              <Text style={{ fontSize: 11 }}>Terjual {item.sold_product}</Text>
            </View>
          </View>
          {item.type === 'auction' && moment(new Date()).isBetween(moment(item?.active_start_date), moment(item?.active_end_date)) &&
            <CountdownComponent detail={item} />
          }
        </View>
      </Shadow>
    </TouchableOpacity>
  );
};

const getPercentDiscount = (price, discount) => {
  return `${Math.floor(100 - (price * 100) / discount)}%`;
};
