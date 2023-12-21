import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../helpers/axiosInstance';
import { useTranslation } from 'react-i18next';
import convertCSS from '../../../helpers/convertCSS';
import { useSelector } from 'react-redux';
import Currency from '../../../helpers/Currency';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Countdown from './components/CountdownComponent';
import { Shadow } from 'react-native-shadow-2';
import Seller from './components/Seller';
import { useToast } from 'react-native-toast-notifications';
import ProductDescription from './components/ProductDescription';
import convertDate from './helpers/convertDate';
import convertTime from './helpers/convertTime';
import ModalTC from './components/ModalTC';
import Modal from 'react-native-modal';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { MainRouteName } from '../../../constants/mainRouteName';
import { IMAGE_URL } from '@env';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default function DetailAuction({ route }) {
  const { t } = useTranslation();
  const toast = useToast();
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );
  const auth = useSelector(state => state.authReducer.user);
  // console.log(JSON.parse(auth).id);
  const language = useSelector(state => state.themeReducer.language);
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState({});
  const [bidOption, setBidOption] = useState([]);
  const [relatedList, setRelatedList] = useState([]);
  const [offerValue, setOfferValue] = useState(null);
  const [productImage, setProductImage] = useState('');
  const [isFollowed, setIsFollowed] = useState(false);
  const [productInformation, setProductInformation] = useState([]);
  const [productSku, setProductSku] = useState([]);
  const [price, setPrice] = useState(0);
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState([]);
  const [modalTC, setModalTC] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [auctionStatus, setAuctionStatus] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [modalFailed, setModalFailed] = useState(false);
  const [checkSimiliar, setCheckSimiliar] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [dataAuction, setDataAuction] = useState()
  const [tnc, setTnc] = useState([])
  useEffect(() => {
    getData();
    getDataAuction();
    getTnc();
  }, []);

  const getData = () => {
    setLoading(true);
    let params = {
      product_slug: route.params.productSlug,
      seller_slug: route.params.sellerSlug,
    };
    axiosInstance
      .get('ecommerce/product/find', { params })
      .then(res => {
        setProductSku(res.data.data.detail.mp_product_skus);
        setPrice(res.data.data.detail.mp_product_skus[0].price);
        setDetail(res.data.data.detail);
        setRelatedList(res.data.data.related);
        setProductImage(res.data.data?.detail?.mp_product_images[0]?.filename);
        setIsFollowed(res.data.data.detail?.mp_seller?.follow?.is_follow);
        setProductInformation(res.data.data.detail.mp_product_informations);
        if (res.data.data.detail.mp_wishlist) {
          setIsWishlist(true)
        }
      })
      .catch(error => {
        console.error('error DetailAuction: ', error.response.data);
      })
      .finally(() => setLoading(false));
  };

  const getDataAuction = () => {
    axiosInstance
      .get(`auction/detailAuction/${route.params.product_id}`)
      .then(res => {
        setBidOption(res.data.data.bid_option);
        if (res.data.data.highest_bidder.length > 0) {
          setHighestBid(res.data.data.highest_bidder[0].bid_price);
          setHighestBidder(res.data.data.highest_bidder);
        }
        setAuctionStatus(res.data.data.auction_status);
        setDataAuction(res.data.data)
        if (res.data.data.approve_tnc === true) {
          setIsChecked(true)
        }
        setCheckSimiliar(res.data.data.notif_similiar_product)
      })
      .catch(error => {
        console.error('error DetailAuction: ', error.response.data);
      })

  }
  const getTnc = () => {
    axiosInstance
      .get(`auction/product/getTnc`)
      .then(res => {
        setTnc(res.data.data)
      })
      .catch(error => {
        console.error('error getTnc: ', error.response.data);
      })

  }


  const onFollow = () => {
    let params = {
      is_follow: !isFollowed,
      mp_seller_id: detail.mp_seller_id,
    };
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
      .catch(error => console.log('error onFollow', error.response.data));
  };

  const onSubmitAuction = () => {

    let params = {
      mp_product_id: detail.id,
      mp_auction_bid_option_id: offerValue?.id,
      bid_price: offerValue?.value + highestBid,
    };
    let url = 'auction/product/submitBidAction';
    axiosInstance
      .post(url, params)
      .then(response => {
        toast.show(response.data.message,
          {
            placement: 'top',
            type: 'success',
            animationType: 'zoom-in',
            duration: 3000,
          },
        );
        onRefreshing();
      })
      .catch(error => {
        setConfirmed(false);
        console.log('error onSubmitAuction', error.response.data.message);
        toast.show(error.response.data.message,
          {
            placement: 'top',
            type: 'danger',
            animationType: 'zoom-in',
            duration: 3000,
          },
        );

        if (error.response.data.message ==
          'sorry, another bidder has raised the price. please reload the page'
        ) {
          setModalFailed(true);
        }
      });
  };

  const onSubmitTNC = () => {
    let params = {
      mp_product_id: detail.id,
    };
    console.log(params);
    let url = 'auction/product/approveTnc';
    axiosInstance
      .post(url, params)
      .then(response => {
        setConfirmed(true)
      })
      .catch(error =>
        console.log('error onSubmitAuction', error.response.data),
      );
  };
  const onBid = () => {
    if (!auth) {
      navigate(MainRouteName.LOGIN)
      return
    }
    // if (moment(new Date()).isBefore(moment(detail?.active_start_date))) {
    //   toast.show(
    //     'Lelang belum di mulai',
    //     {
    //       placement: 'top',
    //       type: 'danger',
    //       animationType: 'zoom-in',
    //       duration: 3000,
    //     },
    //   );
    //   return
    // }
    if (dataAuction?.approve_tnc === true) {
      setConfirmed(true)
    } else {
      setModalTC(true)
    }
  }

  const censorName = name => {
    const regex = /(^.|\s[^\s])|./g;
    const converted = name.replace(regex, (x, y) => y || 'x');
    return converted;
  };

  const onRefreshing = () => {
    getData();
    getDataAuction();
    setOfferValue(null);
    setModalFailed(false);
    setModalTC(false);
    setConfirmed(false);
  };

  const selectBidOption = item => {
    let now = moment().format('YYYY-MM-DD');
    let startDate = moment(detail.active_start_date).format('YYYY-MM-DD');
    // console.log(moment(now).isBefore(startDate));
    if (moment(now).isBefore(startDate)) {
      toast.show(t('Lelang belum dimulai'), {
        placement: 'top',
        type: 'warning',
        animationType: 'zoom-in',
        duration: 3000,
      });
    } else {
      setOfferValue({
        id: item.id,
        value: (item.value * price) / 100,
      });
    }
  };

  const addSmiliar = () => {
    let params = {
      mp_product_id: detail.id,
    };
    let url = 'auction/product/addNotifSimiliarProduct';
    axiosInstance
      .post(url, params)
      .then(response => {
        getDataAuction()
        toast.show(
          "Success",
          {
            placement: 'top',
            type: 'success',
            animationType: 'zoom-in',
            duration: 3000,
          },
        );

      })
      .catch(error =>
        console.log('error addSmiliar', error.response.data),
      );
  }
  const DeleteSmiliar = () => {
    let params = {
      mp_product_id: detail.id,
    };
    let url = 'auction/product/deleteNotifSimiliarProduct';
    axiosInstance
      .post(url, params)
      .then(response => {
        getDataAuction()
        toast.show(
          "Success Cancel",
          {
            placement: 'top',
            type: 'success',
            animationType: 'zoom-in',
            duration: 3000,
          },
        );
        // setIsChecked(true);
        console.log(response.data.data)
      })
      .catch(error =>
        console.log('error DeleteSmiliar', error.response.data),
      );
  }
  const onAddToWisthlist = () => {
    // setLoadingSubmit(true);
    if (!auth) {
      navigate(MainRouteName.LOGIN)
      return
    }
    let url = 'my-wishlist/add';
    axiosInstance
      .post(url, {
        product_id: detail.id,
      })
      .then(response => {
        if (response.data.success) {
          toast.show(
            t(
              !isWishlist
                ? 'common:successAddToWishList'
                : 'common:successRemoveFromWishList',
            ),
            {
              placement: 'top',
              type: 'success',
              animationType: 'zoom-in',
              duration: 3000,
            },
          );
          setIsWishlist(!isWishlist)
        }
        // getData()
      })
      .catch(error => console.log('error onAddToWisthlist lelang', error.response.data.message))
  };


  return (
    <>
      {loading ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <ActivityIndicator
            size="large"
            color={themeSetting?.accent_color?.value}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
          }}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={onRefreshing} />
            }>
            <View
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
              }}>
              <Image
                source={{
                  uri: `${IMAGE_URL}public/marketplace/products/${productImage}`,
                }}
                style={{
                  width: WIDTH * 0.8,
                  height: WIDTH * 0.8,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                  justifyContent: 'center',
                }}
              />
              {['sold', 'win', 'lose'].includes(auctionStatus) && (
                <View
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    alignItems: 'center',
                    position: 'absolute',
                    top: WIDTH * 0.3,
                    borderWidth: 3,
                    borderColor: auctionStatus == 'win' ? '#6FC32E' : '#F54C4C',
                    paddingVertical: 5,
                    paddingHorizontal: 40,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: auctionStatus == 'win' ? '#6FC32E' : '#F54C4C',
                      fontSize: 40,
                      fontWeight: '700',
                    }}>
                    {t(`auction:${auctionStatus}`)}
                  </Text>
                </View>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 5,
                }}>
                <View>
                  <Text
                    style={{
                      fontSize:
                        convertCSS(themeSetting.body_typography.font_size) *
                        0.9,
                      color: '#A6A6A6',
                    }}>
                    {t('auction:startingPrice')}
                  </Text>
                  <Text
                    style={{
                      fontSize:
                        convertCSS(themeSetting.body_typography.font_size) *
                        1.25,
                      fontWeight: '700',
                    }}>
                    Rp {Currency(productSku[0]?.price)}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize:
                        convertCSS(themeSetting.body_typography.font_size) *
                        0.9,
                      color: '#A6A6A6',
                    }}>
                    {t('auction:highestOffer')}
                  </Text>
                  <Text
                    style={{
                      fontSize:
                        convertCSS(themeSetting.body_typography.font_size) *
                        1.25,
                      fontWeight: '700',
                      color: themeSetting?.accent_color?.value,
                      textAlign: 'right',
                    }}>
                    {highestBid == 0 ? '-' : `Rp ${Currency(highestBid)}`}
                  </Text>
                </View>
              </View>

              {detail?.mp_product_informations &&
                detail?.mp_product_informations.map((item, i) => {
                  return (
                    <View key={i}>
                      {item.language_code == language && (
                        <Text style={{ marginVertical: 10 }}>{item.name}</Text>
                      )}
                    </View>
                  );
                })}

              <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Icon
                    name="event-available"
                    size={16}
                    style={{ marginRight: 5 }}
                  />
                  <Text
                    style={{
                      fontSize:
                        convertCSS(themeSetting.body_typography.font_size) *
                        0.85,
                    }}>
                    {convertDate(
                      detail.active_start_date,
                      detail.active_end_date,
                    )}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginLeft: 10,
                  }}>
                  <Icon
                    name="watch-later"
                    size={16}
                    style={{ marginHorizontal: 5 }}
                  />
                  <Text
                    style={{
                      fontSize:
                        convertCSS(themeSetting.body_typography.font_size) *
                        0.85,
                    }}>
                    {convertTime(
                      detail.active_start_date,
                      detail.active_end_date,
                    )}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 4,
                  justifyContent: 'space-between',
                }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text
                    style={{
                      fontSize:
                        convertCSS(themeSetting.body_typography.font_size) *
                        0.85,
                    }}>
                    {t('auction:storePrice')} :{' '}
                    <Text style={{ fontWeight: '600' }}>
                      Rp {Currency(productSku[0]?.normal_price)}
                    </Text>
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      fontSize:
                        convertCSS(themeSetting.body_typography.font_size) *
                        0.85,
                    }}>
                    {t('auction:shippingFrom')} :
                    <Text style={{ fontWeight: '600' }}>
                      {detail?.mp_seller?.city}
                    </Text>
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 8,
                  flexWrap: 'wrap',
                }}>
                {detail?.mp_product_labels &&
                  detail?.mp_product_labels.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          marginVertical: 2,
                          marginRight: 6,
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 42,
                          backgroundColor: '#F5F5F5',
                        }}>
                        <Text
                          style={{
                            fontSize:
                              convertCSS(
                                themeSetting.body_typography.font_size,
                              ) * 0.85,
                            color: '#8D8D8D',
                          }}>
                          {item?.mp_label?.name}
                        </Text>
                      </View>
                    );
                  })}
              </View>

              <View style={styles.horizontalLine} />

              <View>
                {!['sold', 'win', 'lose'].includes(auctionStatus) && (
                  <>
                    <Text
                      style={{
                        fontSize:
                          convertCSS(themeSetting.body_typography.font_size) *
                          1.1,
                        fontWeight: '600',
                      }}>
                      {t('auction:increaseOffer')}
                    </Text>
                    {moment(new Date()).isBefore(detail?.active_start_date) === false ?
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginVertical: 8,
                            flexWrap: 'wrap',
                          }}>

                          {bidOption.length > 0 &&
                            bidOption.map((item, index) => {
                              return (
                                <TouchableOpacity
                                  disabled={
                                    JSON.parse(auth)?.id ==
                                    highestBidder[0]?.mp_customer_id
                                  }
                                  onPress={() => selectBidOption(item)}
                                  key={index}
                                  style={{
                                    marginVertical: 2,
                                    marginRight: 6,
                                    paddingHorizontal: 16,
                                    paddingVertical: 10,
                                    borderRadius: 10,
                                    borderWidth: 2,
                                    borderColor: '#F5F5F5',
                                    backgroundColor:
                                      offerValue?.id == item.id
                                        ? themeSetting?.accent_color?.value
                                        : '#fff',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: convertCSS(
                                        themeSetting.body_typography.font_size,
                                      ),
                                      color:
                                        offerValue?.id == item.id
                                          ? '#fff'
                                          : '#8D8D8D',
                                    }}>
                                    + {Currency((item.value * price) / 100)}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                        </View>
                        <Countdown detail={detail} />
                      </>
                      :
                      <View style={{ flexDirection: "row", justifyContent: 'space-between', marginVertical: 8 }}>
                        <Text
                          style={{
                            fontSize:
                              14,
                            fontWeight: '400',
                          }}
                        >Lelang Belum Mulai</Text>
                        <TouchableOpacity onPress={onAddToWisthlist}>
                          {isWishlist ?
                            <Icon
                              name="favorite"
                              size={28}
                              color={themeSetting.accent_color.value}
                            />
                            :
                            <Icon
                              name="favorite-border"
                              size={28}
                              color={themeSetting.accent_color.value}
                            />
                          }
                        </TouchableOpacity>
                      </View>
                    }
                  </>
                )}

                <View style={styles.horizontalLine} />

                {highestBidder.length > 0 && (
                  <>
                    <View>
                      <Text
                        style={{
                          fontSize:
                            convertCSS(themeSetting.body_typography.font_size) *
                            1.1,
                          fontWeight: '500',
                        }}>
                        {t('auction:bidder')}
                      </Text>
                      {highestBidder.map((item, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                color:
                                  JSON.parse(auth)?.id == item.mp_customer_id
                                    ? themeSetting?.accent_color?.value
                                    : '#A6A6A6',
                                marginVertical: 5,
                              }}>
                              {JSON.parse(auth)?.id == item.mp_customer_id
                                ? t('auction:you')
                                : censorName(item.name)}
                            </Text>
                            <Text
                              style={{
                                color:
                                  index === 0
                                    ? themeSetting?.accent_color?.value
                                    : '#000',
                                marginVertical: 5,
                                fontSize: index == 0 ? 16 : 14,
                                fontWeight: index == 0 ? '600' : '400',
                              }}>
                              Rp {Currency(item.bid_price)}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                    <View style={styles.horizontalLine} />
                  </>
                )}
                {/* ================= */}
                <Seller
                  seller={detail?.mp_seller}
                  fontSize={convertCSS(themeSetting.body_typography.font_size)}
                  accentColor={themeSetting?.accent_color?.value}
                  t={t}
                  isFollowed={isFollowed}
                  onFollow={onFollow}
                />

                <View style={styles.horizontalLine} />
                <ProductDescription
                  fontSize={convertCSS(themeSetting.body_typography.font_size)}
                  accentColor={themeSetting?.accent_color?.value}
                  t={t}
                  detail={detail}
                  productInformation={productInformation}
                  language={language}
                />
              </View>
            </View>
          </ScrollView>
          {['sold', 'win', 'lose'].includes(auctionStatus) ? (
            <TouchableOpacity
              onPress={checkSimiliar ? DeleteSmiliar : addSmiliar}
              style={{
                padding: 10,
                backgroundColor: '#F8931D',
                marginBottom: 15,
                marginHorizontal: 20,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 15,
              }}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                {checkSimiliar ? 'Batalkan pemberitahuan produk serupa' : ' Beri tahu saya produk serupa'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{ height: HEIGHT * 0.1, width: WIDTH }}>
              <Shadow distance={5} startColor={'#00000010'} radius={6}>
                <View
                  style={{
                    height: '100%',
                    width: WIDTH,
                    padding: 12,
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Text>Anda akan menawar</Text>
                      <Text
                        style={{
                          fontWeight: '700',
                          fontSize:
                            convertCSS(themeSetting.body_typography.font_size) *
                            1.2,
                        }}>
                        Rp{' '}
                        {offerValue
                          ? Currency(offerValue?.value + highestBid)
                          : '-'}
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={onBid}
                        disabled={!offerValue}
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 5,
                          paddingHorizontal: 45,
                          paddingVertical: 12,
                          backgroundColor: offerValue
                            ? themeSetting?.accent_color?.value
                            : '#A6A6A6',
                        }}>
                        <Text style={{ color: '#fff', fontWeight: '500' }}>
                          {t('auction:bid')}
                        </Text>
                      </TouchableOpacity>
                      {JSON.parse(auth)?.id ==
                        highestBidder[0]?.mp_customer_id && (
                          <Text
                            style={{
                              fontSize: 10,
                              color: '#A6A6A6',
                              textAlign: 'center',
                            }}>
                            Anda penawar tertinggi
                          </Text>
                        )}
                    </View>
                  </View>
                </View>
              </Shadow>
            </View>
          )}
          <ModalTC
            confirmed={confirmed}
            setConfirmed={setConfirmed}
            modalFailed={modalFailed}
            setModalFailed={setModalFailed}
            isVisible={modalTC}
            close={() => setModalTC(false)}
            themeSetting={themeSetting}
            onSubmit={onSubmitAuction}
            onSubmitTNC={onSubmitTNC}
            setIsChecked={setIsChecked}
            isChecked={isChecked}
            tnc={tnc}
          />
          <Modal isVisible={modalFailed}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignContent: 'flex-end',
              }}>
              <View
                style={{
                  padding: 10,
                  paddingVertical: 20,
                  backgroundColor: '#fff',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{ fontSize: 18, fontWeight: '700' }}>
                    Gagal Menaikkan Penawaran
                  </Text>
                  <Text
                    onPress={() => setModalFailed(false)}
                    style={{ fontSize: 18, fontWeight: '700' }}>
                    X
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    marginVertical: 20,
                    paddingHorizontal: 10,
                  }}>
                  Mohon maaf, penawar lain telah menaikkan penawaran. Silahkan
                  perbaharui halaman dan coba naikkan penawaran lagi.
                </Text>
                <TouchableOpacity
                  onPress={onRefreshing}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    paddingHorizontal: 45,
                    paddingVertical: 12,
                    backgroundColor: isChecked
                      ? themeSetting?.accent_color?.value
                      : '#A6A6A6',
                  }}>
                  <Text style={{ color: '#fff', fontWeight: '500' }}>
                    Perbaharui Halaman
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal isVisible={confirmed}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignContent: 'flex-end',
              }}>
              <View
                style={{
                  padding: 10,
                  paddingVertical: 20,
                  backgroundColor: '#fff',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{ fontSize: 18, fontWeight: '700' }}>
                    Konfirmasi Penawaran
                  </Text>
                  <Text
                    onPress={() => setConfirmed(false)}
                    style={{ fontSize: 18, fontWeight: '700' }}>
                    X
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    marginVertical: 20,
                    paddingHorizontal: 10,
                  }}>
                  Anda yakin ingin menaikkan penawaran sebesar{' '}
                  <Text style={{ fontSize: 16, fontWeight: '700' }}>
                    Rp {Currency(offerValue?.value + highestBid)}
                  </Text>
                  ?
                </Text>
                <TouchableOpacity
                  onPress={onSubmitAuction}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    paddingHorizontal: 45,
                    paddingVertical: 12,
                    backgroundColor: isChecked
                      ? themeSetting?.accent_color?.value
                      : '#A6A6A6',
                  }}>
                  <Text style={{ color: '#fff', fontWeight: '500' }}>
                    Yakin dan Naikkan Penawaran
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  verticalLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#DCDCDC',
    marginHorizontal: 10,
  },
  horizontalLine: {
    marginVertical: 12,
    height: 6,
    backgroundColor: '#FAFAFA',
    width: WIDTH,
    alignSelf: 'center',
    zIndex: -1000,
  },
});
