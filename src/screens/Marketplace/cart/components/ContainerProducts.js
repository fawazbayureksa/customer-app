import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { Checkbox } from 'react-native-paper';
import { IMAGE_URL } from '@env';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Currency from '../../../../helpers/Currency';
import { AddCircle, MinusCirlce } from 'iconsax-react-native';
import colors from '../../../../assets/theme/colors';
import { useState } from 'react';
import { Divider } from '../../../../components/Divider';

const WIDTH = Dimensions.get('window').width;

export default function ContainerProducts(props) {



  const onChangeCheckbox = product => {
    props.checkProductCheckboxOnChange(product);
  };
  const onDelete = () => {
    props.setModalConfirmDelete(true);
    props.setIdSelected([props.product.id]);
  };

  return (
    <>
      {/* {props.product.mp_product.type === 'general' && ( */}
      <View
        key={props.index2}
        style={{ marginTop: 10 }}
      >
        <View
          style={{
            borderColor: colors.bgColor,
            borderTopWidth: !props.product.mp_product.mp_product_pwp ? 0 : 30,
            borderLeftWidth: !props.product.mp_product.mp_product_pwp ? 0 : 2,
            borderRightWidth: !props.product.mp_product.mp_product_pwp ? 0 : 2,
            borderBottomWidth: !props.product.mp_product.mp_product_pwp ? 0 : 2,
          }}
        >
          {props.product.mp_product.mp_product_pwp &&
            <Text style={{ marginTop: -25, marginBottom: 20, color: "#FFF" }}>PWP Discount</Text>
          }
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 0.8,
              }}>
              <Checkbox
                status={
                  props.selectedIds.includes(props.product.id)
                    ? 'checked'
                    : 'unchecked'
                }
                onPress={() => {
                  onChangeCheckbox(props.product);
                }}
                color="#FA9E25"
              />
              <Image
                source={{
                  uri: `${IMAGE_URL}public/marketplace/products/${props.product?.mp_product?.mp_product_images[0]?.filename}`,
                }}
                style={{
                  resizeMode: 'contain',
                  borderRadius: 3,
                  width: WIDTH * 0.2,
                  height: WIDTH * 0.2,
                  marginLeft: 10,
                }}
              />
              <View style={{ width: "90%", marginLeft: 5 }}>
                <Text>
                  {props.product.mp_product.mp_product_informations[0].name}
                </Text>
                {props.product.mp_product_sku.mp_product_sku_variant_options.map(
                  (item, index) => {
                    return (
                      <Text style={{ fontSize: 12, color: '#8D8D8D' }}>
                        {item.name}
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
                  {props.product.mp_product_sku.normal_price != 0 && (
                    <>
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 3,
                          backgroundColor: '#FFD7A8',
                          borderRadius: 10,
                        }}>
                        <Text style={{ fontSize: 12, color: '#F8931D' }}>
                          {getPercentDiscount(
                            props.product.mp_product_sku.price,
                            props.product.mp_product_sku.normal_price,
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
                          props.product.mp_product_sku.normal_price *
                          props.product.quantity,
                        )}
                      </Text>
                    </>
                  )}
                  <Text style={{ fontWeight: '700' }}>
                    Rp{' '}
                    {Currency(
                      props.product.mp_product_sku.price *
                      props.product.quantity,
                    )}
                  </Text>
                  {/* <Text>Rp {Currency(props.product.mp_product_sku.price)}</Text> */}
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 10,
              marginLeft: WIDTH * 0.2 + 50,
              marginRight: 10,
            }}>
            {props.loadingQuantity &&
              props.product.id == props.indexQuantity ? (
              <View
                style={{
                  width: WIDTH * 0.3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator
                  size="small"
                  color={props.themeSetting?.accent_color?.value}
                />
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    props.onUpdateQuantity(
                      props.product.id,
                      props.product.quantity,
                      'minus',
                      props.product.mp_product_sku.stock,
                    )
                  }>
                  <MinusCirlce
                    size="28"
                    color={
                      props.product.quantity == 1
                        ? '#a6a6a6'
                        : props.themeSetting?.accent_color?.value
                    }
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
                    width: 30,
                    color: '#000',
                  }}
                  onChangeText={text =>
                    props.onChangeQuantity(
                      props.product.id,
                      text,
                      'input',
                      props.product.mp_product_sku.stock,
                    )
                  }
                  onEndEditing={e => {
                    console.log(e.nativeEvent.text);
                    e.nativeEvent.text == '' &&
                      props.onBlurQuantity(
                        props.product.id,
                        1,
                        'input',
                        props.product.mp_product_sku.stock,
                      );
                  }}
                  value={
                    props.quantity == 0 &&
                      props.product.id == props.indexQuantity
                      ? ''
                      : JSON.stringify(props.product.quantity)
                  }
                />
                <TouchableOpacity
                  onPress={() =>
                    props.onUpdateQuantity(
                      props.product.id,
                      props.product.quantity,
                      'add',
                      props.product.mp_product_sku.stock,
                    )
                  }>
                  <AddCircle
                    size="28"
                    color={props.themeSetting?.accent_color?.value}
                    variant="Bold"
                  />
                </TouchableOpacity>
              </View>
            )}

            <View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => props.onAddToWisthlist(props.product)}>
                  {props.product.mp_product.mp_wishlist ? (
                    <Icon
                      name="favorite"
                      size={26}
                      color="#FA9E25"
                      style={{ marginHorizontal: 3 }}
                    />
                  ) : (
                    <Icon
                      name="favorite"
                      size={26}
                      color="#DCDCDC"
                      style={{ marginHorizontal: 3 }}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete}>
                  <Icon
                    name="delete"
                    size={26}
                    color="#F54C4C"
                    style={{ marginHorizontal: 3 }}
                  />
                </TouchableOpacity>
              </View>
              {/* <Text style={{fontWeight: '500'}}>
            Rp{' '}
            {Currency(
              props.product.mp_product_sku.price * props.product.quantity,
            )}
          </Text> */}
            </View>
          </View>
          {props.product.mp_product.mp_product_pwp &&
            <View style={{ padding: 5, width: "80%", }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 5,
                  padding: 5,
                  backgroundColor: colors.bgColor,
                  borderRadius: 20
                }}>
                <Icon name='error' color={colors.white} size={20} />
                <Text numberOfLines={2} style={{ marginLeft: 5, color: colors.white }}>Aktifkan Paket Diskon PWP dengan membeli produk lainnya</Text>
              </View>
              <TouchableOpacity onPress={() => props.addPwp(props.product.mp_product_id)}>
                <Text style={{ color: colors.bgColor }}>Tambah Produk Lain</Text>
              </TouchableOpacity>
            </View>
          }
        </View>

      </View>
      {/* )} */}
    </>
  );
}

const getPercentDiscount = (price, discount) => {
  return `${Math.floor(100 - (price * 100) / discount)}%`;
};
