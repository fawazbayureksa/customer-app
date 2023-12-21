import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import Template from '../../../components/Template';
import {CustomDivider, Divider} from '../../../components/Divider';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import convertCSS from '../../../helpers/convertCSS';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Shadow} from 'react-native-shadow-2';
import axiosInstance from '../../../helpers/axiosInstance';
import {MarketplaceRouteName} from '../../../constants/marketplace_route/marketplaceRouteName';
import moment from 'moment';
import GetButtonByStatus from '../order_list/components/GetButtonByStatus';
import GetMedia from '../../../components/common/GetMedia';
import Currency from '../../../helpers/Currency';

const WIDTH = Dimensions.get('window').width;

export default function DetailPayment({navigation, route}) {
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );

  const language = useSelector(state => state.themeReducer.language);

  const {t} = useTranslation();
  const fontSize = convertCSS(themeSetting.body_typography.font_size);

  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({});
  const [totalPayment, setTotalPayment] = React.useState(0);

  React.useEffect(() => {
    getPaymentDetail();
  }, []);

  const getPaymentDetail = () => {
    setLoading(true);
    axiosInstance
      .get(`my-orders/getPaymentDetail/${route?.params?.url}`)
      .then(res => {
        let total_payment = res.data.data.total;
        for (const mp_payment_additional of res.data.data
          .mp_payment_additionals) {
          total_payment += mp_payment_additional.total;
        }
        setData(res.data.data);
        setTotalPayment(total_payment);
      })
      .catch(error => {
        navigation.replace(MarketplaceRouteName.ORDER_DETAIL, {
          invoiceNumber: route?.params?.url,
        });
        console.error('error getPaymentDetail ', error.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      {loading ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator
            size="large"
            color={themeSetting?.accent_color?.value}
          />
        </View>
      ) : (
        <Template scroll={true} url={MarketplaceRouteName.DETAIL_PAYMENT}>
          <View style={{padding: 8}}>
            <Text
              style={{
                fontSize: fontSize * 1,
                fontWeight: '500',
                color: themeSetting.accent_color?.value,
                textAlign: 'center',
              }}>
              {t('common:accountSetting')} / {t('common:payment')} /{' '}
              {route?.params?.url}
            </Text>
          </View>
          <Divider />

          <View style={{flexGrow: 1, paddingHorizontal: 12, flex: 1}}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                name="chevron-left"
                size={16}
                color={themeSetting.accent_color?.value}
                style={{marginHorizontal: 5}}
              />
              <Text
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  fontSize: fontSize * 1,
                  color: themeSetting.accent_color?.value,
                }}>
                {t('common:backToListOrder')}
              </Text>
            </TouchableOpacity>

            <View style={{marginTop: 20}}>
              <Shadow distance={3} startColor={'#00000010'} radius={8}>
                <View
                  style={{
                    width: WIDTH * 0.93,
                    backgroundColor: '#fff',
                    borderRadius: 6,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(10, 0, 0, 0.1)',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                  }}>
                  <View style={{marginVertical: 8}}>
                    <Text>Status</Text>
                    <Text style={{fontWeight: '500'}}>
                      {t(`payment_status.${data?.last_status?.status}`)}
                    </Text>
                    {data?.last_status?.notes ? (
                      <Text style={{color: '#EB2424'}}>
                        {data?.last_status?.notes}
                      </Text>
                    ) : null}

                    <Text style={{marginTop: 5}}>{t(`common:buyingDate`)}</Text>
                    <Text style={{fontWeight: '500'}}>
                      {moment(data?.created_at).format('DD MMMM YYYY')}
                    </Text>
                    <GetButtonByStatus
                      refresh={getPaymentDetail}
                      item={data}
                      status={
                        data?.last_status?.status
                          ? data?.last_status?.status
                          : data?.last_status?.mp_transaction_status_master_key
                      }
                    />

                    <Text style={{marginTop: 5}}>Invoice</Text>
                    {data?.mp_payment_transactions?.length > 0 &&
                      data?.mp_payment_transactions.map((item, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              marginTop: 5,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text style={{fontWeight: '700', color: 'orange'}}>
                              {item?.mp_transaction?.order_code}
                            </Text>
                          </View>
                        );
                      })}
                  </View>
                </View>
              </Shadow>
            </View>

            <View style={{marginTop: 20}}>
              <Text
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  fontSize: fontSize * 1,
                  color: themeSetting.accent_color?.value,
                  marginVertical: 10,
                }}>
                List Produk
              </Text>
              <Shadow distance={3} startColor={'#00000010'} radius={8}>
                <View
                  style={{
                    width: WIDTH * 0.93,
                    backgroundColor: '#fff',
                    borderRadius: 6,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(10, 0, 0, 0.1)',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                  }}>
                  <View style={{marginVertical: 8}}>
                    {data?.mp_payment_transactions &&
                      data?.mp_payment_transactions?.length > 0 &&
                      data?.mp_payment_transactions?.map((item, index) => {
                        return (
                          <View key={index}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <Text>{item.mp_transaction.mp_seller.name}</Text>
                              <Text>{item.mp_transaction?.order_code}</Text>
                            </View>
                            <Divider />
                            <View style={{justifyContent: 'space-between'}}>
                              {item.mp_transaction.mp_transaction_details
                                .length > 0 &&
                                item.mp_transaction.mp_transaction_details.map(
                                  (value, i) => {
                                    return (
                                      <>
                                        <View
                                          key={i}
                                          style={{
                                            flexDirection: 'row',
                                            flex: 1,
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                          }}>
                                          <GetMedia
                                            folder="marketplace/products"
                                            filename={
                                              value.mp_transaction_product
                                                .mp_transaction_product_images[0]
                                                .filename
                                            }
                                            style={{
                                              width: 100,
                                              height: 100,
                                              borderRadius: 12,
                                              backgroundColor: '#FFFFFF',
                                            }}
                                          />
                                          <View
                                            style={{
                                              flex: 1,
                                              flexDirection: 'row',
                                            }}>
                                            {value?.mp_transaction_product
                                              .mp_transaction_product_informations &&
                                              value?.mp_transaction_product.mp_transaction_product_informations.map(
                                                val => {
                                                  return (
                                                    <View
                                                      key={val.id}
                                                      style={{flex: 3}}>
                                                      {val.language_code ==
                                                      language ? (
                                                        <Text
                                                          style={{
                                                            marginVertical: 10,
                                                          }}>
                                                          {val.name}
                                                        </Text>
                                                      ) : (
                                                        <Text
                                                          style={{
                                                            marginVertical: 10,
                                                          }}>
                                                          {
                                                            value
                                                              ?.mp_transaction_product
                                                              .mp_transaction_product_informations[0]
                                                              .name
                                                          }
                                                        </Text>
                                                      )}
                                                    </View>
                                                  );
                                                },
                                              )}
                                            <Text
                                              style={{
                                                marginVertical: 10,
                                                flex: 0.5,
                                              }}>
                                              x{value.quantity}
                                            </Text>
                                            <Text
                                              style={{
                                                marginVertical: 10,
                                                flex: 2.2,
                                                fontWeight: '700',
                                                textAlign: 'right',
                                              }}>
                                              Rp {Currency(value.grand_total)}
                                            </Text>
                                          </View>
                                        </View>
                                      </>
                                    );
                                  },
                                )}

                              <Divider />
                              <View
                                style={{
                                  justifyContent: 'space-between',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Text>Total Harga Barang</Text>
                                <Text
                                  style={{
                                    flex: 2,
                                    textAlign: 'right',
                                  }}>
                                  Rp {Currency(item.mp_transaction.price)}
                                </Text>
                              </View>
                              <View
                                style={{
                                  justifyContent: 'space-between',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Text>Total Ongkos Kirim</Text>
                                <Text
                                  style={{
                                    flex: 2,
                                    textAlign: 'right',
                                  }}>
                                  Rp{' '}
                                  {Currency(item.mp_transaction.shipping_fee)}
                                </Text>
                              </View>
                              <View
                                style={{
                                  justifyContent: 'space-between',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Text>Total Diskon</Text>
                                <Text
                                  style={{
                                    flex: 2,
                                    textAlign: 'right',
                                  }}>
                                  Rp {Currency(item.mp_transaction.discount)}
                                </Text>
                              </View>

                              <Divider />
                              <View
                                style={{
                                  justifyContent: 'space-between',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Text>Total</Text>
                                <Text
                                  style={{
                                    flex: 2,
                                    textAlign: 'right',
                                  }}>
                                  Rp {Currency(item.mp_transaction.grand_total)}
                                </Text>
                              </View>
                            </View>
                            {data?.mp_payment_transactions &&
                              index !==
                                data?.mp_payment_transactions?.length - 1 && (
                                <CustomDivider style={{width: WIDTH * 0.9}} />
                              )}
                          </View>
                        );
                      })}
                  </View>
                </View>
              </Shadow>
            </View>

            <View style={{marginVertical: 20}}>
              <Text
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  fontSize: fontSize * 1,
                  color: themeSetting.accent_color?.value,
                  marginVertical: 10,
                }}>
                {t('common:paymentInformation')}
              </Text>
              <Shadow distance={3} startColor={'#00000010'} radius={8}>
                <View
                  style={{
                    width: WIDTH * 0.93,
                    backgroundColor: '#fff',
                    borderRadius: 6,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(10, 0, 0, 0.1)',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                  }}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Text>{t('common:paymentMethod')}</Text>
                    <Text>
                      {data.type === 'midtrans'
                        ? t('common:onlinePayment')
                        : data.type === 'manual'
                        ? t('common:manualPayement')
                        : '-'}
                    </Text>
                  </View>
                  <Divider />

                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text>Total</Text>
                    <Text
                      style={{
                        marginVertical: 10,
                        flex: 2,
                        fontWeight: '700',
                        textAlign: 'right',
                      }}>
                      Rp {Currency(data.total)}
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    {data.mp_payment_additionals?.map(item => {
                      return (
                        <>
                          <Text>{t(`common:${item.key}`)}</Text>
                          <Text
                            Text
                            style={{
                              marginVertical: 10,
                              flex: 2,
                              fontWeight: '700',
                              textAlign: 'right',
                            }}>
                            Rp {Currency(item.total)}
                          </Text>
                        </>
                      );
                    })}
                  </View>
                  <Divider />
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text>{t('common:totalPayment')}</Text>
                    <Text
                      style={{
                        marginVertical: 10,
                        flex: 2,
                        fontWeight: '700',
                        textAlign: 'right',
                      }}>
                      Rp {Currency(totalPayment)}
                    </Text>
                  </View>
                </View>
              </Shadow>
            </View>

            <View style={{marginVertical: 20}}>
              <Text
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  fontSize: fontSize * 1,
                  color: themeSetting.accent_color?.value,
                  marginVertical: 10,
                }}>
                {t('common:paymentStatus')}
              </Text>
              <Shadow distance={3} startColor={'#00000010'} radius={8}>
                <View
                  style={{
                    width: WIDTH * 0.93,
                    backgroundColor: '#fff',
                    borderRadius: 6,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(10, 0, 0, 0.1)',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                  }}>
                  {data &&
                    data?.mp_payment_statuses?.length > 0 &&
                    data?.mp_payment_statuses.map((item, index) => (
                      <View key={index}>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                            alignItems: 'center',
                          }}>
                          <View style={{flex: 1}}>
                            <PaymentCreatedBy
                              style={{flex: 1}}
                              status={item.status}
                            />
                          </View>
                          <View style={{flex: 1.5}}>
                            {index !== 0 && <Divider />}
                            <Text>{t(`payment_status.${item.status}`)}</Text>
                            <Text>
                              {moment(item.created_at).format(
                                'DD MMMM YYYY HH:mm',
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                </View>
              </Shadow>
            </View>
          </View>
        </Template>
      )}
    </>
  );
}

const PaymentCreatedBy = ({status}) => {
  if (status === 'pending') return <Text>Customer</Text>;
  else if (status === 'waiting_for_payment')
    return <Text className="color-24ABE1">Customer</Text>;
  else if (status === 'waiting_for_upload')
    return <Text className="color-24ABE1">Customer</Text>;
  else if (status === 'waiting_approval')
    return <Text className="color-24ABE1">Customer</Text>;
  else if (status === 'rejected')
    return <Text className="color-EC9700">Marketplace</Text>;
  else if (status === 'approved')
    return <Text className="color-EC9700">Marketplace</Text>;
  else if (status === 'expired')
    return <Text className="color-EC9700">Marketplace</Text>;
  else return null;
};
