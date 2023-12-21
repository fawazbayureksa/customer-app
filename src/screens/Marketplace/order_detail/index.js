import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import Template from '../../../components/Template';
import { Divider } from '../../../components/Divider';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import convertCSS from '../../../helpers/convertCSS';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Shadow } from 'react-native-shadow-2';
import axiosInstance from '../../../helpers/axiosInstance';
import { MarketplaceRouteName } from '../../../constants/marketplace_route/marketplaceRouteName';
import GetButtonByStatus from '../order_list/components/GetButtonByStatus';
import moment from 'moment';
import GetMedia from '../../../components/common/GetMedia';
import Currency from '../../../helpers/Currency';

const WIDTH = Dimensions.get('window').width;

export default function OrderDetail({ route }) {
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );

  const language = useSelector(state => state.themeReducer.language);

  const { t } = useTranslation();
  const fontSize = convertCSS(themeSetting.body_typography.font_size);

  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({});
  const [totalPayment, setTotalPayment] = React.useState(0);

  React.useEffect(() => {
    getOrderDetail();
  }, []);

  const getOrderDetail = () => {
    setLoading(true);
    console.log(route.params.url);
    axiosInstance
      .get(`my-orders/get-detail?order_code=${route.params.url}`)
      .then(res => {
        let data = res.data.data;
        data.mp_transaction_details.forEach(detail => {
          if (detail.mp_transaction_product.type === 'bundling') {
            detail.bundlings.forEach(bundling => {
              bundling.sku = JSON.parse(bundling.sku);
            });
          }
        });
        data.courier.mp_transaction_courier_statuses.forEach(detail => {
          if (detail.data) detail.data = JSON.parse(detail.data);
          else detail.data = [];
        });
        // console.log('getOrderDetail', JSON.stringify(data));
        setData(data);
      })
      .catch(error => {
        console.error('error getOrderDetail ', error);
      })
      .finally(() => {
        setLoading(false);
      });
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
        <Template scroll={true} url={MarketplaceRouteName.DETAIL_PAYMENT}>
          <View style={{ flexGrow: 1, padding: 8, flex: 1 }}>
            <Text
              style={{
                fontSize: fontSize * 1,
                fontWeight: '500',
                color: themeSetting.accent_color?.value,
                textAlign: 'center',
              }}>
              {t('common:accountSetting')} / {t('common:order')} /{' '}
              {route.params.url}
            </Text>
          </View>
          <Divider />

          <View style={{ flexGrow: 1, paddingHorizontal: 12, flex: 1 }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name="chevron-left"
                size={16}
                color={themeSetting.accent_color?.value}
                style={{ marginHorizontal: 5 }}
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

            <View style={{ marginTop: 20 }}>
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
                  <View style={{ marginVertical: 8 }}>
                    <Text>Status</Text>
                    <Text style={{ fontWeight: '500' }}>
                      {t(
                        `payment_status.${data?.last_status?.mp_transaction_status_master_key}`,
                      )}
                    </Text>
                    {data?.last_status?.notes ? (
                      <Text style={{ color: '#EB2424' }}>
                        {data?.last_status?.notes}
                      </Text>
                    ) : null}

                    <GetButtonByStatus
                      refresh={getOrderDetail}
                      item={data}
                      status={
                        data?.last_status?.status
                          ? data?.last_status?.status
                          : data?.last_status?.mp_transaction_status_master_key
                      }
                    />
                    <Text style={{ marginTop: 5 }}>{t(`common:buyingDate`)}</Text>
                    <Text style={{ fontWeight: '500' }}>
                      {moment(data?.created_at).format('DD MMMM YYYY')}
                    </Text>

                    <Text style={{ marginTop: 5 }}>Invoice</Text>
                    <View
                      style={{
                        marginTop: 5,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{ fontWeight: '700', color: 'orange' }}>
                        {route.params.url}
                      </Text>
                    </View>
                  </View>
                </View>
              </Shadow>
            </View>

            <View style={{ marginTop: 20 }}>
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
                  <View style={{ marginVertical: 8 }}>
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <GetMedia
                          folder="marketplace/products"
                          filename={
                            data.mp_transaction_details?.[0]
                              .mp_transaction_product
                              .mp_transaction_product_images?.[0].filename
                          }
                          style={{
                            width: 100,
                            height: 100,
                            borderRadius: 12,
                            backgroundColor: '#FFFFFF',
                          }}
                        />
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                          <View style={{ flex: 3 }}>
                            <Text>
                              {
                                data.mp_transaction_details?.[0]
                                  .mp_transaction_product
                                  .mp_transaction_product_informations[0].name
                              }
                            </Text>
                            {data.mp_transaction_details?.[0]
                              .mp_transaction_product
                              .mp_transaction_product_sku_variants.length > 0 &&
                              data.mp_transaction_details?.[0].mp_transaction_product.mp_transaction_product_sku_variants.map(
                                val => {
                                  return (
                                    <View key={val.id} style={{ flex: 2 }}>
                                      <Text style={{ marginVertical: 10 }}>
                                        {val.name}:{' '}
                                        {
                                          val
                                            .mp_transaction_product_sku_variant_option
                                            .name
                                        }
                                      </Text>
                                    </View>
                                  );
                                },
                              )}
                          </View>
                          <Text style={{ marginVertical: 10, flex: 0.5 }}>
                            x{data.mp_transaction_details?.[0].quantity}
                          </Text>
                          <Text
                            style={{
                              marginVertical: 10,
                              flex: 2,
                              fontWeight: '700',
                              textAlign: 'right',
                            }}>
                            Rp{' '}
                            {Currency(
                              data.mp_transaction_details?.[0].grand_total,
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </Shadow>
            </View>

            <View style={{ marginTop: 20 }}>
              <Text
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  fontSize: fontSize * 1,
                  color: themeSetting.accent_color?.value,
                  marginVertical: 10,
                }}>
                {t('common:shippingDetail')}
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
                  <View style={{ marginVertical: 8 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 1 }}>
                        <Text>{t('common:seller')}</Text>
                        <Text style={{ fontWeight: '700' }}>
                          {data?.mp_seller?.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          borderLeftWidth: 0.8,
                          flex: 0.1,
                          borderColor: 'grey',
                        }}
                      />

                      <View style={{ flex: 1.2 }}>
                        <Text>{t('common:shippingMethod')}</Text>
                        <Text style={{ fontWeight: '700' }}>
                          {data?.courier &&
                            data?.courier?.mp_courier_key === 'internal'
                            ? `${data?.courier?.mp_internal_courier?.name}`
                            : `${data?.courier?.mp_courier_type?.mp_courier?.name} ${data?.courier?.mp_courier_type?.name}`}
                        </Text>
                      </View>

                      <View
                        style={{
                          borderLeftWidth: 0.8,
                          flex: 0.1,
                          borderColor: 'grey',
                        }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text>Tracking Code</Text>
                        <Text style={{ fontWeight: '700' }}>
                          {data?.courier?.last_courier_status
                            ?.tracking_number || '-'}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                      <Text style={{ flex: 1 }}>
                        {t('common:shippingAddress')}
                      </Text>
                      <View style={{ flex: 2 }}>
                        <Text style={{}}>
                          {data?.mp_transaction_address?.receiver_name},{' '}
                          {data?.mp_transaction_address?.receiver_phone}
                        </Text>
                        <Text style={{}}>
                          {data?.mp_transaction_address?.address}
                        </Text>
                        <Text style={{}}>
                          {data?.mp_transaction_address?.subdistrict},{' '}
                          {data?.mp_transaction_address?.city},{' '}
                          {data?.mp_transaction_address?.postal_code}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Shadow>
            </View>

            <View style={{ marginTop: 20 }}>
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
                      {data?.mp_payment_transaction?.mp_payment?.last_status
                        ?.type === 'midtrans'
                        ? t('common:onlinePayment')
                        : data?.mp_payment_transaction?.mp_payment?.last_status
                          ?.type === 'manual'
                          ? t('common:manualPayment')
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
                    <Text>Total Harga Barang</Text>
                    <Text style={{ textAlign: 'right' }}>
                      Rp {Currency(data.price)}
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text>Total Ongkos Kirim</Text>
                    <Text style={{ ftextAlign: 'right' }}>
                      Rp {Currency(data.shipping_fee)}
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text>Total Diskon</Text>
                    <Text style={{ textAlign: 'right' }}>
                      - Rp {Currency(data.discount)}
                    </Text>
                  </View>
                  <Divider />
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text>{t('common:totalPayment')}</Text>
                    <Text style={{ fontWeight: '700', textAlign: 'right' }}>
                      Rp {Currency(data.grand_total)}
                    </Text>
                  </View>
                </View>
              </Shadow>
            </View>

            <View style={{ marginVertical: 20 }}>
              <Text
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  fontSize: fontSize * 1,
                  color: themeSetting.accent_color?.value,
                  marginVertical: 10,
                }}>
                {t('common:orderStatus')}
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
                    data?.mp_transaction_statuses?.length > 0 &&
                    data?.mp_transaction_statuses.map((item, index) => (
                      <View key={index}>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                            alignItems: 'center',
                          }}>
                          <View style={{ flex: 1 }}>
                            <PaymentCreatedBy
                              style={{ flex: 1 }}
                              createdBy={item.created_by}
                            />
                          </View>
                          <View style={{ flex: 1.5 }}>
                            {index !== 0 && <Divider />}
                            <Text>
                              {t(
                                `transaction_status.${item.mp_transaction_status_master_key}`,
                              )}
                            </Text>
                            <Text>
                              {moment(item.created_at).format('DD MMMM YYYY')}
                            </Text>
                            {item?.notes ? (
                              <Text style={{ color: '#333333' }}>
                                Notes : {item.notes}
                              </Text>
                            ) : null}
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

const PaymentCreatedBy = ({ createdBy }) => {
  let splitted = createdBy.split('#');
  if (splitted[0] === 'system')
    return <Text style={{ color: '#374650' }}>System</Text>;
  if (splitted[0] === 'midtrans')
    return <Text style={{ color: '#374650' }}>System</Text>;
  else if (splitted[0] === 'customer')
    return <Text style={{ color: '#24ABE1' }}>Customer</Text>;
  else if (splitted[0] === 'admin')
    return <Text style={{ color: '#EC9700' }}>Marketplace</Text>;
  else if (splitted[0] === 'seller')
    return <Text style={{ color: '#8CC73F' }}>Seller</Text>;
  else return splitted[0];
};
