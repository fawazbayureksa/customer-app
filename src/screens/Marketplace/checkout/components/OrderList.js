import { View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Shadow } from 'react-native-shadow-2';
import { useTranslation } from 'react-i18next';
import { CustomDivider, Divider } from '../../../../components/Divider';
import { IMAGE_URL } from '@env';
import DropDownPicker from 'react-native-dropdown-picker';
import Currency from '../../../../helpers/Currency';
import colors from '../../../../assets/theme/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

const WIDTH = Dimensions.get('window').width;

export default function OrderList(props) {
  const { t } = useTranslation();

  const convertToDropdown = data => {
    let converted = [];

    data.forEach(item => {
      converted.push({
        value: item.key,
        label: item.name,
        data: item,
      });
    });
    return converted;
  };

  const convertToDropdownDuration = data => {
    let converted = [];
    if (data != undefined) {
      data.forEach(item => {
        converted.push({
          value: item,
          label: `${item.description} (Rp ${Currency(item.cost[0].value)})`,
        });
      });
      return converted;
    } else {
      return [];
    }
  };

  return (
    <>
      {props.data != null &&
        props.data.map((item, index) => {
          return (
            <View key={index} zIndex={index * -1}>
              <View>
                <View
                  style={{
                    width: WIDTH * 0.95,
                    backgroundColor: '#fff',
                    borderRadius: 6,
                    // padding: 12,
                    // borderWidth: 1,
                    // borderColor: 'rgba(10, 0, 0, 0.1)',
                    justifyContent: 'space-between',
                    paddingHorizontal: 8,
                  }}>
                  <View style={{ marginVertical: 2 }}>
                    <Text style={{ fontWeight: '500', fontSize: 16 }}>
                      {t('common:yourOrder')}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginVertical: 10,
                        alignItems: 'center',
                      }}>
                      <Icon
                        name="check-circle"
                        size={20}
                        color="#FA9E25"
                        style={{ marginHorizontal: 5 }}
                      />
                      <Text
                        style={{
                          fontWeight: '500',
                          fontSize: 16,
                        }}>
                        {item.seller.name}
                      </Text>
                    </View>
                    {item.carts.map((item2, index2) => {
                      return (
                        <View
                          key={index2}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              marginLeft: 10,
                              flexDirection: 'row',
                              alignItems: 'center',
                              flex: 0.6,
                            }}>
                            <Image
                              source={{
                                uri: `${IMAGE_URL}public/marketplace/products/${item2?.mp_product?.mp_product_images[0]?.filename}`,
                              }}
                              style={{
                                resizeMode: 'contain',
                                borderRadius: 3,
                                width: WIDTH * 0.2,
                                height: WIDTH * 0.2,
                              }}
                            />
                            <View style={{ marginLeft: 10 }}>
                              <Text>
                                {
                                  item2?.mp_product?.mp_product_informations[0]
                                    ?.name
                                }
                              </Text>
                              {item2?.mp_product_sku.mp_product_sku_variant_options.map(
                                (i, index) => {
                                  return (
                                    <Text
                                      style={{ fontSize: 12, color: '#8D8D8D' }}>
                                      {i.name}
                                    </Text>
                                  );
                                },
                              )}
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  marginTop: 5,
                                }}>
                                {item2.mp_auction_bid ? (
                                  <Text style={{ fontWeight: '700' }}>
                                    Rp{' '}
                                    {Currency(
                                      item2?.mp_auction_bid.bid_price *
                                      item2?.quantity,
                                    )}
                                  </Text>
                                ) : (
                                  <>
                                    {item2?.mp_product_sku.normal_price !=
                                      0 && (
                                        <>
                                          <View
                                            style={{
                                              paddingHorizontal: 10,
                                              paddingVertical: 3,
                                              backgroundColor: '#FFD7A8',
                                              borderRadius: 10,
                                            }}>
                                            <Text
                                              style={{
                                                fontSize: 12,
                                                color: '#F8931D',
                                              }}>
                                              {getPercentDiscount(
                                                item2?.mp_product_sku.price,
                                                item2?.mp_product_sku
                                                  .normal_price,
                                              )}
                                            </Text>
                                          </View>
                                          <Text
                                            style={{
                                              textAlign: 'right',
                                              fontSize: 12,
                                              textDecorationLine: 'line-through',
                                              marginHorizontal: 4,
                                              color: '#8D8D8D',
                                            }}>
                                            Rp{' '}
                                            {Currency(
                                              item2?.mp_product_sku.normal_price *
                                              item2?.quantity,
                                            )}
                                          </Text>
                                        </>
                                      )}
                                    <Text style={{ fontWeight: '700' }}>
                                      Rp{' '}
                                      {Currency(
                                        item2?.mp_product_sku.price *
                                        item2?.quantity,
                                      )}
                                    </Text>
                                  </>
                                )}
                                {/* <Text>Rp {Currency(props.product.mp_product_sku.price)}</Text> */}
                              </View>
                              {/* <Text>{item2.quantity} pcs</Text> */}
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
              <CustomDivider />
              {/* <Shadow distance={3} startColor={'#00000010'} radius={8}> */}
              <View style={{ marginVertical: 2, marginHorizontal: 8, }}>
                <Text style={{ fontWeight: '500', fontSize: 16 }}>
                  {t('common:deliveryMethod')}
                </Text>
              </View>
              <View style={{ marginVertical: 5, zIndex: 2, marginHorizontal: 8, }}>
                <Text style={{ color: 'grey', marginBottom: 5 }}>
                  {t('common:chooseCourier')}
                </Text>
              </View>
              <DropDownPicker
                bottomOffset={100}
                zIndex={3000}
                open={
                  props.openDropdownCouriers['dropdown_' + item.seller.id]
                }
                items={convertToDropdown(item.couriers)}
                setOpen={e =>
                  props.onChangeOpenDropdown(item.seller.id, e)
                }
                value={props.courierValue['courier_' + item.seller.id]}
                setValue={e => {
                  props.setCourierValueTemp(e);
                  props.setIdDropwdownCourier(item.seller.id);
                }}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
                style={{
                  marginHorizontal: 8,
                  borderWidth: 1,
                  width: WIDTH * 0.92,
                  borderColor: 'rgba(10, 0, 0, 0.1)',
                }}
                dropDownContainerStyle={{
                  marginHorizontal: 8,
                  borderWidth: 1,
                  width: WIDTH * 0.92,
                  borderColor: 'rgba(10, 0, 0, 0.1)',
                }}
              />
              {props.errorCourier['errorCourier_' + item.seller.id] !=
                '' &&
                props.errorCourier['errorCourier_' + item.seller.id] !=
                undefined && (
                  <Text style={{ color: colors.danger }}>
                    {props.errorCourier['errorCourier_' + item.seller.id]}
                  </Text>
                )}
              <View style={{ marginVertical: 5, zIndex: 1, marginHorizontal: 8, }}>
                <Text style={{ color: 'grey', marginBottom: 5 }}>
                  {t('common:chooseDuration')}
                </Text>
              </View>
              <DropDownPicker
                zIndex={2000}
                open={
                  props.openDropdownDuration['dropdown_' + item.seller.id]
                }
                items={convertToDropdownDuration(
                  props.durationItem['durationItem_' + item.seller.id],
                )}
                setOpen={e =>
                  props.onChangeOpenDropdownDuration(item.seller.id, e)
                }
                value={props.durationValue['duration_' + item.seller.id]}
                setValue={e => {
                  props.setDurationValueTemp(e);
                  // props.setIdDropwdownDuration(item.seller.id);
                }}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
                style={{
                  marginHorizontal: 8,
                  borderWidth: 1,
                  width: WIDTH * 0.92,
                  borderColor: 'rgba(10, 0, 0, 0.1)',
                }}
                dropDownContainerStyle={{
                  marginHorizontal: 8,
                  borderWidth: 1,
                  width: WIDTH * 0.92,
                  borderColor: 'rgba(10, 0, 0, 0.1)',
                }}
              />
              {props.errorDuration['errorDuration_' + item.seller.id] !=
                '' &&
                props.errorDuration['errorDuration_' + item.seller.id] !=
                undefined && (
                  <Text style={{ color: colors.danger }}>
                    {
                      props.errorDuration[
                      'errorDuration_' + item.seller.id
                      ]
                    }
                  </Text>
                )}
              {props.durationValue['duration_' + item.seller.id] && (
                <Text style={{ marginVertical: 3 }}>
                  ETD:{' '}
                  {
                    props.durationValue['duration_' + item.seller.id]
                      ?.cost[0].etd
                  }
                </Text>
              )}
              {/* </Shadow> */}

              {index !== props.data.length - 1 && < CustomDivider />}
            </View>
          );
        })}
    </>
  );
}

const getPercentDiscount = (price, discount) => {
  return `${Math.floor(100 - (price * 100) / discount)}%`;
};
