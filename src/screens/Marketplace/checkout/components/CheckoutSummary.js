import {View, Text, Dimensions, TouchableOpacity, Image} from 'react-native';
import React, {useEffect} from 'react';
import CustomButton from '../../../../components/CustomButton';
import {Shadow} from 'react-native-shadow-2';
import {useTranslation} from 'react-i18next';
import {Divider} from '../../../../components/Divider';
import Currency from '../../../../helpers/Currency';
import {IMAGE_URL} from '@env';

const WIDTH = Dimensions.get('window').width;

export default function CheckoutSummary(props) {
  const {t} = useTranslation();

  const getDiscountText = item => {
    if (item.voucher.discount_type === 'fixed')
      return `Rp ${Currency(item.voucher.discount)}`;
    else if (item.voucher.discount_type === 'percentage')
      return `${item.voucher.discount}%`;

    return '';
  };

  return (
    <View style={{marginTop: 20}}>
      <Shadow distance={3} startColor={'#00000010'} radius={8}>
        <View
          style={{
            width: WIDTH * 0.95,
            backgroundColor: '#fff',
            borderRadius: 6,
            padding: 12,
            borderWidth: 1,
            borderColor: 'rgba(10, 0, 0, 0.1)',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
          }}>
          <View style={{marginVertical: 8}}>
            <Text style={{fontWeight: '500', fontSize: 16}}>
              {t('common:voucherDiscount')}
            </Text>
            {props.vouchers.length > 0 &&
              props.vouchers.map((item, index) => {
                return (
                  <>
                    {props.selectedVoucher['selectedVoucher' + item.id]
                      ?.value == 'true' && (
                      <View style={{marginTop: 10}}>
                        <Shadow
                          distance={3}
                          startColor={'#00000010'}
                          radius={8}>
                          <View
                            style={{
                              width: WIDTH * 0.87,
                              backgroundColor: '#fff',
                              borderRadius: 6,
                              padding: 8,
                              borderWidth: 1,
                              borderColor: 'rgba(10, 0, 0, 0.1)',
                              justifyContent: 'space-between',
                              paddingHorizontal: 10,
                            }}>
                            <View style={{marginVertical: 3}}>
                              <View style={{flex: 1.5, padding: 5}}>
                                <Image
                                  source={{
                                    uri: `${IMAGE_URL}public/marketplace/voucher/${item?.voucher?.image}`,
                                  }}
                                  style={{
                                    resizeMode: 'contain',
                                    borderRadius: 5,
                                    height: WIDTH * 0.45,
                                  }}
                                />
                              </View>
                              <Text>
                                {t('common:youGetDiscount', {
                                  discountFor:
                                    item.voucher.discount_for == 'product'
                                      ? t('common:product')
                                      : t('common:shipping'),
                                  discount: getDiscountText(item),
                                })}
                              </Text>
                            </View>
                          </View>
                        </Shadow>
                      </View>
                    )}
                  </>
                );
              })}
            <TouchableOpacity onPress={() => props.setModalVoucher(true)}>
              <Text
                style={{
                  fontWeight: '500',
                  color: '#FA9E25',
                  marginVertical: 10,
                  textAlign: 'center',
                }}>
                Mau Voucher Lain?
              </Text>
            </TouchableOpacity>
            <Divider />
            <View style={{marginVertical: 8}}>
              <Text style={{fontWeight: '500', fontSize: 16}}>
                {t('common:summary')}
              </Text>
              <Divider />
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text style={{color: 'grey'}}>{t('common:totalPrice')}</Text>
              </View>
              <View>
                <Text style={{color: 'grey'}}>
                  Rp {Currency(props.totalPrice)}
                </Text>
              </View>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text style={{color: 'grey'}}>{t('common:shippingCost')}</Text>
              </View>
              <View>
                <Text style={{color: 'grey'}}>
                  Rp {Currency(props.shippingFee || 0)}
                </Text>
              </View>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text style={{color: 'grey'}}>{t('common:totalDiscount')}</Text>
              </View>
              <View>
                <Text style={{color: 'grey'}}>
                  - Rp {Currency(props.totalVoucher)}
                </Text>
              </View>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text style={{fontWeight: '500'}}>
                  {`${t('common:totalPayment')} (${props.data.length} ${t(
                    'common:product',
                  )})`}
                </Text>
              </View>
              <View>
                <Text style={{fontWeight: '500'}}>
                  Rp{' '}
                  {Currency((props.totalPrice + props.shippingFee) - props.totalVoucher)}
                </Text>
              </View>
            </View>
          </View>
          <CustomButton
            onPress={props.onSubmitCheckout}
            style={{
              height: 50,
              width: '100%',
              alignSelf: 'center',
              marginTop: 12,
            }}
            primary
            title={t('common:continueBuy')}
          />
          <Text>
            {t('common:privacyPolicyAgree') + ' '}
            <Text style={{color: '#FA9E25', fontWeight: '500'}}>
              {t('common:termsConditions')}
            </Text>
          </Text>
        </View>
      </Shadow>
    </View>
  );
}
