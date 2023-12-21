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
import moment from 'moment';
import { AuctionRouteName } from '../../../../constants/auction_route/auctionRouteName';
import { useNavigation } from '@react-navigation/native';

const WIDTH = Dimensions.get('window').width;

export default function History() {
  const [dataOngoing, setDataOngoing] = useState([]);
  const [loading, setLoading] = useState(false);
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );
  const language = useSelector(state => state.themeReducer.language);
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const auth = useSelector(state => state.authReducer.user);
  console.log(auth)

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);
    axiosInstance
      .get('auction/getHistory', { params: { status: 'done' } })
      .then(res => {
        setDataOngoing(res.data.data.data);
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
                    style={{ width: WIDTH, alignItems: 'center', padding: 5 }} key={index}>
                    <Shadow distance={5} startColor={'#00000010'} radius={6}>
                      <TouchableOpacity
                        onPress={() =>
                          navigate(AuctionRouteName.DETAIL_AUCTION, {
                            productSlug: item.slug,
                            sellerSlug: item?.mp_seller?.slug,
                            product_id: item?.id
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
                          <View>
                            <Text
                              style={{
                                color:
                                  JSON.parse(auth).id ==
                                    item.mp_product_auction_bid[0]?.mp_customer_id
                                    ? '#6FC32E'
                                    : '#F54C4C',
                                fontWeight: '700',
                                marginVertical: 2,
                                fontSize:
                                  convertCSS(
                                    themeSetting.body_typography.font_size,
                                  ) * 1.2,
                              }}>
                              {JSON.parse(auth).id === item.mp_product_auction_bid[0]?.mp_customer_id
                                ? 'Menang'
                                : 'Kalah'}
                            </Text>
                          </View>
                          {item?.mp_product_informations &&
                            item?.mp_product_informations.map((sub, i) => {
                              return (
                                <View key={i}>
                                  {sub.language_code == language && (
                                    <Text
                                      style={{
                                        marginVertical: 5,
                                        fontSize: convertCSS(
                                          themeSetting.body_typography
                                            .font_size,
                                        ),
                                      }}>
                                      {sub.name}
                                    </Text>
                                  )}
                                </View>
                              );
                            })}
                          <Text style={{ fontSize: 14 }}>
                            {moment(item.active_start_date).format(
                              'DD MMMM YYYY',
                            )}
                          </Text>
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
                  Belum ada lelang yang sedang berlangsung
                </Text>
              </View>
            }
          </ScrollView>
        </View>
      )}
    </>
  );
}
