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
import Currency from '../../../../helpers/Currency';
import { useCountdown } from '../../../../helpers/useCountdown';
import moment from 'moment';

const WIDTH = Dimensions.get('window').width;

export default function AuctionProduct(props) {
  const onChangeCheckbox = product => {
    props.checkProductCheckboxOnChange(product);
  };
  const onDelete = () => {
    props.setModalConfirmDelete(true);
    props.setIdSelected([props.product.id]);
  };
  return (
    <>
      {props.product.mp_product.type === 'auction' && (
        <>
          <View key={props.index2}>
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
                    {props.type ? (
                      <Text style={{ fontWeight: '700' }}>
                        Rp{' '}
                        {Currency(
                          props.product?.mp_auction_bid?.bid_price *
                          props?.product?.quantity,
                        )}
                      </Text>
                    ) : (
                      <Text style={{ fontWeight: '700' }}>
                        Rp{' '}
                        {Currency(
                          props.product.mp_product_sku.price *
                          props.product.quantity,
                        )}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: 10,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 14,
              backgroundColor: '#FFD7A8',
              width: '90%',
            }}>
            <Text style={{ fontSize: 12, fontWeight: '600' }}>
              {moment(props.product.deadline).format('DD MMMM YYYY')}
            </Text>
            <Text style={{ fontSize: 12 }}>
              Produk akan hangus dalam waktu{' '}
              <Text style={{ color: '#F54C4C', fontWeight: '700' }}>
                {useCountdown(props.product?.deadline)?.days || 0}{' '}
                {props.t('auction:days')} :{' '}
                {useCountdown(props.product?.deadline)?.hours || 0}{' '}
                {props.t('auction:hours')} :{' '}
                {
                  useCountdown(props.product?.deadline)
                    ?.minutes
                }{' '}
                {props.t('auction:minutes')}
              </Text>
            </Text>
          </View>
        </>
      )}
    </>
  );
}
