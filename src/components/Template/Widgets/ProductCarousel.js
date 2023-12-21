import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import React, { PureComponent } from 'react';
import Carousel from 'react-native-snap-carousel';
import { IMAGE_URL } from '@env';
import { Star1, Heart } from 'iconsax-react-native';
import { useSelector } from 'react-redux';
import Currency from '../../../helpers/Currency';
import { Shadow } from 'react-native-shadow-2';
import { useNavigation } from '@react-navigation/native';
import { MarketplaceRouteName } from '../../../constants/marketplace_route/marketplaceRouteName';

const WIDTH = Dimensions.get('window').width;
const widthSlider = WIDTH * 0.83;

export default class CarouselComponent extends PureComponent {
  constructor() {
    super();
  }

  // const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  _renderBannerItem = ({ item, index }) => {
    return (
      <>
        {this.props.type === 'type_2' && (
          <Card2
            item={item}
            index={index}
            productPerPage={this.props.productPerPage}
          />
        )}
        {this.props.type === 'type_3' && (
          <Card3
            item={item}
            index={index}
            productPerPage={this.props.productPerPage}
          />
        )}
        {this.props.type === 'type_1' && (
          <Card1
            item={item}
            index={index}
            productPerPage={this.props.productPerPage}
          />
        )}
        {this.props.type === 'related' && (
          <Card3
            type="related"
            item={item}
            index={index}
            productPerPage={this.props.productPerPage}
            onPress={this.props.onPress}
            navigation={this.props.navigation}
          />
        )}
        <View style={{ width: 20 }} />
      </>
    );
  };

  render() {
    return (
      <Carousel
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
        layout={'default'}
        data={this.props.products}
        renderItem={this._renderBannerItem}
        sliderWidth={WIDTH * 0.95}
        itemWidth={widthSlider / this.props.productPerPage / 0.9}
        hasParallaxImages={true}
        firstItem={0}
        activeSlideAlignment={'start'}
      />
    );
  }
}

const Card1 = ({ item, index, productPerPage }) => {
  const themeSetting = useSelector(
    state => state.themeReducer?.themeSetting?.theme,
  );
  const { navigate } = useNavigation();
  return (
    <TouchableOpacity
      key={index}
      onPress={() =>
        navigate(MarketplaceRouteName.PRODUCT_DETAIL, { product: item })
      }
      style={{
        paddingRight: index == 0 ? 10 : 0,
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
            width: WIDTH / 2.0,
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
  );
};

const Card2 = ({ item, index, productPerPage }) => {
  const themeSetting = useSelector(
    state => state.themeReducer?.themeSetting?.theme,
  );
  const { navigate } = useNavigation();

  return (
    <TouchableOpacity
      key={index}
      onPress={() =>
        navigate(MarketplaceRouteName.PRODUCT_DETAIL, { product: item })
      }
      style={{
        paddingRight: index == 0 ? 10 : 0,
        paddingBottom: 8,
        flex: 1,
      }}>
      <Shadow distance={3} startColor={'#00000010'} radius={8}>
        <View
          style={{
            width: WIDTH / 2.0,
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

const Card3 = ({ item, index, productPerPage, type, navigation }) => {
  const themeSetting = useSelector(
    state => state.themeReducer?.themeSetting?.theme,
  );
  const { navigate } = useNavigation();

  return (
    <TouchableOpacity
      key={index}
      onPress={() => {
        type === 'related'
          ? navigation.push(MarketplaceRouteName.PRODUCT_DETAIL, {
            product: item,
          })
          : navigate(MarketplaceRouteName.PRODUCT_DETAIL, { product: item });
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
            width: WIDTH / 2.4,
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
};

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
