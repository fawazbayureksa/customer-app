import {
  View,
  Text,
  Dimensions,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView,
  Animated,
  FlatList
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Template from '../../../components/Template';
import { useSelector } from 'react-redux';
import { CustomDivider } from '../../../components/Divider';
import { TickCircle, Star1, AddCircle, MinusCirlce, MessageText, Heart } from 'iconsax-react-native';
import colors from '../../../assets/theme/colors';
import CustomButton from '../../../components/CustomButton/index';
import axiosInstance from '../../../helpers/axiosInstance';
import Currency from '../../../helpers/Currency';
import CardSeller from './components/CardSeller';
import { useTranslation } from 'react-i18next';
import ProductInformation from './components/ProductInformation';
import IsEmpty from '../../../helpers/IsEmpty';
import { useToast } from 'react-native-toast-notifications';
import RelatedProducts from './components/RelatedProducts';
import { MarketplaceRouteName } from '../../../constants/marketplace_route/marketplaceRouteName';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ChatRouteName } from '../../../constants/chat_route/ChatRouteName';
import { useNavigation } from '@react-navigation/native';
import PwpView from './components/PwpView';

const WIDTH = Dimensions.get('window').width;

export default function ProductDetail({ route, navigation }) {
  const scrollX = new Animated.Value(0);
  let position = Animated.divide(scrollX, WIDTH);
  const toast = useToast();
  const { t } = useTranslation();
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );

  const product = route.params.product;

  const [quantity, setQuantity] = React.useState('1');
  const [loading, setLoading] = React.useState(false);
  const [productDetail, setProductDetail] = React.useState({});
  const [photoProduct, setPhotoProduct] = React.useState([]);
  const [productInformation, setProductInformation] = React.useState([]);
  const [productSku, setProductSku] = React.useState([]);
  const [productVariant, setProductVariant] = React.useState([]);
  const [seller, setSeller] = React.useState({});
  const [selectedVariant, setSelectedVariant] = React.useState([]);
  const [price, setPrice] = React.useState(0);
  const [normalPrice, setNormalPrice] = React.useState(0);
  const [isWishlist, setIsWishlist] = React.useState(false);
  const [url, setUrl] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [currentVariant, setCurrentVariant] = useState({});
  const [sku, setSku] = useState(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [pwp, setPwp] = useState(null);
  const [bundling, setBundling] = useState([]);

  const { navigate } = useNavigation()

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = () => {
    setLoading(true);
    let params = {
      seller_slug: product.mp_seller.slug,
      product_slug: product.slug,
    };
    axiosInstance
      .get(`ecommerce/product/find`, { params })
      .then(res => {
        getPwpByProductID(res.data.data.detail.id);
        getBundlingByProductID(res.data.data.detail.id);
        setProductDetail(res.data.data.detail);
        setPhotoProduct(res.data.data?.detail?.mp_product_images);
        setProductInformation(
          res.data.data?.detail?.mp_product_informations[0],
        );
        setProductSku(res.data.data?.detail?.mp_product_skus[0]);
        setProductVariant(res.data.data?.detail?.mp_product_variants);
        setSeller(res.data.data?.detail?.mp_seller);
        setPrice(res.data.data?.detail?.mp_product_skus[0]?.price);
        setNormalPrice(res.data.data?.detail?.mp_product_skus[0]?.normal_price);
        if (res.data.data.detail.mp_wishlist) {
          setIsWishlist(true);
        }
        setCurrentVariant(
          res.data.data.detail.mp_product_skus.find(
            value => value.is_main == true,
          ),
        );
        setIsFollowed(res.data.data.detail?.mp_seller?.follow?.is_follow);
        setRelatedProducts(res.data.data.related);
        if (res.data.data.detail?.is_variant == false) {
          setSku(res.data.data.detail.mp_product_skus[0].id);
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false)
      });
  };

  const getPwpByProductID = (id) => {
    if (!id) return

    axiosInstance.get(`ecommerce/product/getPwpByProductID/${id}`)
      .then(response => {
        console.log(response.data.data, 'pwp')
        setPwp(response.data.data)
      }).catch(error => {
        console.log('error get pwp', error.response.data);
      })
  }
  const getBundlingByProductID = (id) => {
    if (!id) return

    axiosInstance.get(`ecommerce/product/getBundlingByProductID/${id}`)
      .then(response => {
        console.log(response.data.data, 'bundling')
        response.data.data.forEach(datum => {
          datum.mp_product_sku.mp_product.mp_product_informations.forEach(information => {
            information.sections = JSON.parse(information.sections) || {};
          });
        })
        setBundling(response.data.data)
      }).catch(error => {
        console.log('error get bundling', error.response.data);
      })
  }


  const onChangeQuantity = (type, text) => {
    let number = parseInt(quantity);
    if (type === 'add') {
      let newQuantity = number + 1;
      setQuantity(newQuantity.toString());
    } else if (type === 'minus') {
      if (parseInt(quantity) > 1) {
        let newQuantity = number - 1;
        setQuantity(newQuantity.toString());
      }
    } else {
      isPositiveInteger(text)
        ? setQuantity(text)
        : text === '' && setQuantity('1');
    }
  };

  const isPositiveInteger = str => {
    if (typeof str !== 'string') {
      return false;
    }

    const num = Number(str);

    if (Number.isInteger(num) && num > 0) {
      return true;
    }

    return false;
  };

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
        setNormalPrice(response.data.data.normal_price);
        setPrice(response.data.data.price);
        setSku(response.data.data.id);
      })
      .catch(error => console.log('error onChangeVariant', error));
  };

  const onAddToWisthlist = () => {
    setLoadingSubmit(true);
    let url = 'my-wishlist/add';
    axiosInstance
      .post(url, {
        product_id: productDetail.id,
      })
      .then(response => {
        if (response.data.success) {
          toast.show(
            t(
              isWishlist
                ?
                'common:successRemoveFromWishList'
                :
                'common:successAddToWishList',
            ),
            {
              placement: 'top',
              type: 'success',
              animationType: 'zoom-in',
              duration: 3000,
            },
          );
          setIsWishlist(!isWishlist);
        }
      })
      .catch(error =>
        console.log('error onAddToWisthlist', error.response.data),
      )
      .finally(() => setLoadingSubmit(false));
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
        })
        .catch(error => console.log('error onAddToCart', error))
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

  const onFollow = () => {
    setLoadingSubmit(true);
    let params = {
      is_follow: !isFollowed,
      mp_seller_id: productDetail.mp_seller_id,
    };
    console.log(params);
    let url = 'ecommerce/seller/follow';
    axiosInstance
      .post(url, params)
      .then(response => {
        if (response.data.success) {
          toast.show(
            t(isFollowed ? 'common:successUnfollow' : 'common:successFollow'),
            {
              placement: 'top',
              type: 'success',
              animationType: 'zoom-in',
              duration: 3000,
            },
          );
          setIsFollowed(!isFollowed);
        }
      })
      .catch(error => console.log('error onAddToCart', error.response.data))
      .finally(() => setLoadingSubmit(false));
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

  return (
    <KeyboardAvoidingView
      style={{ justifyContent: 'center', flex: 1 }}
      enabled
      keyboardVerticalOffset={100}>
      {loading ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <ActivityIndicator
            size="large"
            color={themeSetting?.accent_color?.value}
          />
        </View>
      ) : (
        <>
          <Template scroll={true} url={MarketplaceRouteName.PRODUCT_DETAIL}>
            <View style={{ paddingHorizontal: 16 }}>
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
              {/* <ScrollView horizontal>
              <View style={{ flexDirection: 'row' }}>
                {photoProduct.map((item, index) => {
                  return (
                    <GetMedia
                      item={item}
                      index={index}
                      filename={item.filename}
                    />);
                })}
              </View>
            </ScrollView> */}
              {/* <View style={{ flexDirection: 'row' }}>
              {photoProduct.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedImage(item.filename)}>
                    <GetMedia
                      item={item}
                      index={index}
                      filename={item.filename}
                      selectedImage={selectedImage}
                      />
                  </TouchableOpacity>
                  );
                })}
              </View> */}

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
                  {/* <Text style={styles.smallText}>
                  {productDetail?.mp_seller?.name} |
                </Text> */}
                  <Text style={styles.smallText}>
                    {t('common:sold')} {productDetail?.sold_product}
                  </Text>
                </View>
              </View>
              <CustomDivider />
              {/* <View>
              <Text style={{ color: '#000' }}>{t('common:delivery')}</Text>
              <Text style={{ color: colors.pasive }}>
                {t('common:deliveryFrom')} {productDetail?.mp_seller?.city}
              </Text>
            </View> */}
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
                                  marginVertical: 4,
                                  borderRadius: 40,
                                  alignSelf: 'flex-start',
                                  paddingVertical: 8,
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
              {/* <View>
              <Text style={{ color: '#000' }}>{t('common:totalProduct')}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => onChangeQuantity('minus')}>
                  <MinusCirlce
                    size="28"
                    color={themeSetting?.accent_color?.value}
                    variant="Bold"
                  />
                </TouchableOpacity>
                <TextInput
                  keyboardType="numeric"
                  style={{
                    borderBottomWidth: 1,
                    borderColor: colors.pasive,
                    marginHorizontal: 12,
                    textAlign: 'center',
                    height: 40,
                    width: 50,
                    color: '#000',
                  }}
                  onChangeText={text => onChangeQuantity('', text)}
                  value={quantity}
                />
                <TouchableOpacity onPress={() => onChangeQuantity('add')}>
                  <AddCircle
                    size="28"
                    color={themeSetting?.accent_color?.value}
                    variant="Bold"
                  />
                </TouchableOpacity>
              </View>
              <Text style={{ marginTop: 10, fontSize: 12 }}>
                {t('common:totalPrice')} : Rp{' '}
                {Currency(price * parseInt(quantity))}
              </Text>
            </View> */}
              <PwpView
                pwp={pwp}
                detail={productDetail}
                themeSetting={themeSetting}
              />

              <CardSeller
                data={seller}
                isFollowed={isFollowed}
                onFollow={onFollow}
                navigation={navigation}
              />

              {/* <View style={{ marginVertical: 10 }}>
              <CustomButton
                loading={loadingSubmit}
                onPress={onAddToWisthlist}
                disabled={loadingSubmit}
                secondary
                border
                title={
                  isWishlist
                    ? t('common:addToWishList')
                    : t('common:removeFromWishList')
                }
              />
              <CustomButton
                loading={loadingSubmit}
                onPress={onAddToCart}
                disabled={loadingSubmit}
                primary
                title={t('common:addToCart')}
              />
            </View> */}
            </View>
            <CustomDivider />
            <ProductInformation
              productBundling={bundling}
              productInformation={productInformation}
              productDetail={productDetail}
            />
            <CustomDivider />
            <RelatedProducts products={relatedProducts} navigation={navigation} />
          </Template>
          <View style={{ borderTopWidth: 3, borderTopColor: 'rgba(75, 75, 75, 0.08)', height: 90, backgroundColor: '#FFFFFF', flexDirection: 'row', paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={() => navigate(ChatRouteName.CHAT_MESSAGE, { newUser: { id: seller.id, type: "seller" }, product: { id: productDetail.id, type: "product", name: productInformation?.name, picture: productDetail.mp_product_images[0].filename } })}
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            >
              <View style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#DCDCDC', width: 43, height: 43 }}>
                <MessageText
                  size="28"
                  color="#F8931D"
                  variant="Bold"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onAddToWisthlist}
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#DCDCDC', width: 43, height: 43 }}>
                {
                  isWishlist ?
                    <Heart
                      size="28"
                      color="#F8931D"
                      variant="Bold"
                    /> :
                    <Heart
                      size="28"
                      color="#C1C1C1"
                      variant="Bold"
                    />
                }
              </View>
            </TouchableOpacity>
            <CustomButton
              style={{ flex: 4, height: 43 }}
              loading={loadingSubmit}
              onPress={onAddToCart}
              disabled={loadingSubmit}
              primary
              title={t('common:addToCart')} />
          </View>
        </>
      )}
    </KeyboardAvoidingView>
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
