import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import GetMedia from '../../../../components/common/GetMedia';
import axiosInstance from '../../../../helpers/axiosInstance';
import { useSelector } from 'react-redux';
import convertCSS from '../../../../helpers/convertCSS';
import CountdownComponent from './CountdownComponent';
import Currency from '../../../../helpers/Currency';
import { Shadow } from 'react-native-shadow-2';
import { useTranslation } from 'react-i18next';
import { AuctionRouteName } from '../../../../constants/auction_route/auctionRouteName';
import { useNavigation } from '@react-navigation/native';

const WIDTH = Dimensions.get('window').width;

export default function Ongoing() {
  const [dataOngoing, setDataOngoing] = useState([]);
  const [loading, setLoading] = useState(false);
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );
  const language = useSelector(state => state.themeReducer.language);
  const { t } = useTranslation();
  useEffect(() => {
    getData();
  }, []);
  const { navigate } = useNavigation();

  const getData = () => {
    setLoading(true);
    axiosInstance
      .get('auction/product/ongoing')
      .then(res => {
        setDataOngoing(res.data.data);
      })
      .catch(error => {
        console.error('error Ongoing: ', error.response.data);
      })
      .finally(() => setLoading(false));
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
        <View style={{ paddingVertical: 12, backgroundColor: '#fff', flex: 1 }}>
          <ScrollView>
            {dataOngoing.length > 0 ?
              dataOngoing.map((item, index) => {
                return (
                  <View
                    style={{ width: WIDTH, alignItems: 'center', padding: 5 }}>
                    <Shadow distance={5} startColor={'#00000010'} radius={6}>
                      <TouchableOpacity
                        onPress={() =>
                          navigate(AuctionRouteName.DETAIL_AUCTION, {
                            productSlug: item.slug,
                            sellerSlug: item?.mp_seller?.slug,
                          })
                        }
                        key={index}
                        style={{
                          width: '95%',
                          padding: 12,
                          marginBottom: 5,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <GetMedia
                          folder="marketplace/products"
                          filename={item.mp_product_images[0].filename}
                          style={{
                            width: WIDTH * 0.25,
                            height: WIDTH * 0.25,
                            alignSelf: 'center',
                            resizeMode: 'contain',
                          }}
                        />
                        <View style={{ flex: 1 }}>
                          {item?.mp_product_informations &&
                            item?.mp_product_informations.map((sub, i) => {
                              return (
                                <View key={i}>
                                  {sub.language_code == language && (
                                    <Text
                                      style={{
                                        marginVertical: 5,
                                        fontSize:
                                          convertCSS(
                                            themeSetting.body_typography
                                              .font_size,
                                          ) * 1.1,
                                      }}>
                                      {sub.name}
                                    </Text>
                                  )}
                                </View>
                              );
                            })}

                          <CountdownComponent detail={item} t={t} />
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <Text style={{ color: '#A6A6A6', fontSize: 10 }}>
                              {t('auction:highestBid')} :
                            </Text>
                            <Text
                              style={{
                                fontSize: 16,
                                color: '#F8931D',
                                fontWeight: '700',
                              }}>
                              Rp {Currency(9999)}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </Shadow>
                  </View>
                );
              })
              :
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: "#fff"
                }}>
                <Image
                  style={{
                    width: WIDTH * 0.7,
                    height: WIDTH * 0.7,
                    resizeMode: 'contain',
                  }}
                  source={require('../../../../assets/images/empty.png')}
                />
                <Text style={{ fontSize: 18, fontWeight: '700' }}>
                  {t('common:emptyCart')}
                </Text>
                <Text style={{ fontWeight: '600', color: '#303030' }}>
                  Belum ada lelang yang diikuti
                </Text>
              </View>
            }
          </ScrollView>
        </View>
      )}
    </>
  );
}
