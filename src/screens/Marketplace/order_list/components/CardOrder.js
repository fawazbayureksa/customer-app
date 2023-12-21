import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import { Shadow } from 'react-native-shadow-2';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Divider } from '../../../../components/Divider';
import GetMedia from '../../../../components/common/GetMedia';
import {
  PaymentStatusText,
  StatusText,
} from '../../../../helpers/PaymentStatusText';
import Currency from '../../../../helpers/Currency';
import GetButtonByStatus from './GetButtonByStatus';
import { useNavigation } from '@react-navigation/native';
import { MarketplaceRouteName } from '../../../../constants/marketplace_route/marketplaceRouteName';
import { ChatRouteName } from '../../../../constants/chat_route/ChatRouteName';
import { Countdown } from '../../../Auction/detail_auction/helpers/Countdown';
import moment from 'moment';

const WIDTH = Dimensions.get('window').width;
export default function CardOrder({
  themeSetting,
  data,
  loading,
  refresh,
  status,
}) {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const renderItem = (item, index) => {
    if (item?.last_status?.mp_transaction_status_master_key == 'arrived') {
      console.log(item?.courier);
    }
    return (
      <View
        key={index}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 10,
        }}>
        <Shadow distance={3} startColor={'#00000010'} radius={8}>
          <View
            style={{
              width: WIDTH * 0.9,
              backgroundColor: '#fff',
              borderRadius: 8,
              padding: 8,
              borderWidth: 1,
              borderColor: 'rgba(10, 0, 0, 0.1)',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                status === 'pending'
                  ? navigate(MarketplaceRouteName.DETAIL_PAYMENT, {
                    url: item.invoice_number,
                  })
                  : navigate(MarketplaceRouteName.ORDER_DETAIL, {
                    url: item.order_code,
                  });
              }}>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    flex: 2,
                  }}>
                  <Icon
                    name="check-circle"
                    size={20}
                    color={themeSetting?.accent_color?.value}
                  />
                  <Text
                    style={{
                      color: themeSetting?.accent_color?.value,
                      marginLeft: 5,
                      fontWeight: '500',
                    }}>
                    {item.mp_transaction_details[0]?.mp_transaction?.mp_seller
                      ? item?.mp_transaction_details[0]?.mp_transaction
                        ?.mp_seller?.name
                      : item.mp_seller.name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => 
                    navigate(ChatRouteName.CHAT_MESSAGE, { newUser: {
                      id: item.mp_transaction_details[0]?.mp_transaction?.mp_seller
                      ? item?.mp_transaction_details[0]?.mp_transaction
                        ?.mp_seller?.id
                      : item.mp_seller.id, 
                      type: "seller" 
                    }})
                  }
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    flex: 2,
                  }}>
                  <Icon
                    name="email"
                    size={20}
                    color={themeSetting?.accent_color?.value}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flex: 1.5,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
                  {item.last_status.status === 'pending' ? (
                    <View>
                      <Text style={{ fontSize: 12, color: 'grey' }}>
                        Bayar Sebelum
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: 'orange',
                          fontWeight: '700',
                        }}>
                        {item?.mp_transaction_details[0]?.mp_transaction
                          ?.last_status.deadline
                          ? moment(
                            item.mp_transaction_details[0].mp_transaction
                              .last_status.deadline,
                          ).format('DD MMMM, HH:mm')
                          : '-'}
                      </Text>
                    </View>
                  ) : (
                    <>
                      <Text>Status: </Text>
                      <Text
                        style={{
                          fontWeight: '500',
                          color: themeSetting?.accent_color?.value,
                        }}>
                        {item?.last_status?.status ? (
                          <PaymentStatusText data={item?.last_status?.status} />
                        ) : item?.last_status
                          ?.mp_transaction_status_master_key ==
                          'on_delivery' ? (
                          <View>
                            <Text style={{ fontSize: 12, color: 'grey' }}>
                              Estimasi Tiba
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: 'orange',
                                fontWeight: '700',
                              }}>
                              {CalculateEstimateArrived(
                                item.last_status.created_at,
                                item.courier.shipping_estimate_in_hours,
                              )}
                            </Text>
                          </View>
                        ) : item?.last_status
                          ?.mp_transaction_status_master_key == 'arrived' ? (
                          <View>
                            <Text style={{ fontSize: 12, color: 'grey' }}>
                              {/* Estimasi Tiba */}
                              Selesaikan Sebelum
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: 'orange',
                                fontWeight: '700',
                              }}>
                              {moment(item?.last_status?.deadline).format(
                                'DD MMMM, HH:mm',
                              )}
                            </Text>
                          </View>
                        ) : (
                          <StatusText
                            data={
                              item?.last_status
                                ?.mp_transaction_status_master_key
                            }
                          />
                        )}
                      </Text>
                    </>
                  )}
                </View>
              </View>
              <Divider />
              <View style={{ flexDirection: 'row' }}>
                <GetMedia
                  folder="marketplace/products"
                  filename={
                    item?.mp_transaction_details[0]?.mp_transaction_product
                      ?.mp_transaction_product_images[0]?.filename
                  }
                  style={{
                    width: WIDTH * 0.3,
                    height: WIDTH * 0.3,
                  }}
                />
                <View style={{ marginTop: 10, flex: 2 }}>
                  <Text style={{ fontWeight: '600' }}>
                    {
                      item.mp_transaction_details[0].mp_transaction_product
                        .mp_transaction_product_informations[0].name
                    }
                  </Text>
                  {item.mp_transaction_details[0].mp_transaction_product.mp_transaction_product_sku_variants.map(
                    variant => (
                      <View key={variant.id}>
                        <Text>
                          {variant.name}:{' '}
                          {
                            variant.mp_transaction_product_sku_variant_option
                              .name
                          }
                        </Text>
                      </View>
                    ),
                  )}
                  <Text>
                    Rp{' '}
                    {Currency(
                      item.mp_transaction_details[0].mp_transaction_product
                        .mp_transaction_product_sku.price,
                    )}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 10,
                    alignItems: 'flex-end',
                    flex: 1,
                  }}>
                  <Text>
                    {item.mp_transaction_details[0].quantity}{' '}
                    {t('common:product')}
                  </Text>
                  <Text style={{ fontWeight: '500' }}>
                    Rp {Currency(item.mp_transaction_details[0]?.grand_total)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {item.mp_transaction_details.length > 1 && status === 'pending' ? (
              <TouchableOpacity
                onPress={() =>
                  navigate(MarketplaceRouteName.DETAIL_PAYMENT, {
                    url: item.invoice_number,
                  })
                }>
                <Text style={{ fontWeight: '600', color: 'orange' }}>
                  +{item.mp_transaction_details.length - 1}{' '}
                  {t('common:otherProduct')}
                </Text>
              </TouchableOpacity>
            ) : null}
            <Divider />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text>{t('common:totalPayment')}</Text>
              <Text style={{ fontWeight: '500' }}>
                Rp{' '}
                {Currency(
                  item.mp_transaction_details[0]?.mp_transaction?.grand_total
                    ? item.mp_transaction_details[0]?.mp_transaction
                      ?.grand_total
                    : item.mp_transaction_details[0].grand_total,
                )}
              </Text>
            </View>
            <GetButtonByStatus
              refresh={refresh}
              item={item}
              status={
                item.last_status.status
                  ? item.last_status.status
                  : item?.last_status?.mp_transaction_status_master_key
              }
            />
          </View>
        </Shadow>
      </View>
    );
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator
          color={themeSetting?.accent_color?.value}
          size={'large'}
          style={{ padding: 20 }}
        />
      ) : data.length > 0 ? (
        data.map((item, index) => {
          return renderItem(item, index);
        })
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
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
        </View>
      )}
    </>
  );
}

const CalculateEstimateArrived = (delivery_date, estimate_hours) => {
  var dt = new Date(delivery_date);
  dt.setHours(dt.getHours() + estimate_hours);

  return moment(dt).format('DD MMMM, HH:mm');
};
