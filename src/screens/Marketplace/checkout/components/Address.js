import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import CustomButton from '../../../../components/CustomButton';
import { Shadow } from 'react-native-shadow-2';
import { useTranslation } from 'react-i18next';
import { Divider } from '../../../../components/Divider';

const WIDTH = Dimensions.get('window').width;

export default function Address(props) {
  const { t } = useTranslation();

  return (
    <View style={{ marginTop: 20 }}>
      {props.mainAddress.receiver_name ?
        <View
          style={{
            width: WIDTH * 0.95,
            backgroundColor: '#fff',
            borderRadius: 6,
            // padding: 12,
            justifyContent: 'space-between',
            paddingHorizontal: 8,
          }}>
          <View style={{ marginVertical: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 8 }}>
                <Text style={{ fontWeight: '500', fontSize: 16 }}>
                  {t('common:shippingAddress')}
                </Text>
              </View>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => props.setShowModalChangeAddress(true)}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#FA9E25',
                  }}>
                  {t('common:change')}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>
              {`${props.mainAddress.receiver_name} | ${props.mainAddress.receiver_phone}`}
            </Text>
            <Text style={{ color: 'grey' }}>{props.mainAddress.address}</Text>
            <Text style={{ color: 'grey' }}>
              {`${props.mainAddress.subdistrict}, ${props.mainAddress.city}, ${props.mainAddress.province}, ${props.mainAddress.postal_code}`}
            </Text>
          </View>
          <CustomButton
            onPress={() => props.setShowAddressModal(true)}
            style={{
              height: 50,
              width: '100%',
              alignSelf: 'center',
              marginTop: 12,
            }}
            secondary
            border
            title={t('common:chooseAnotherAddress')}
          />
        </View>
        :
        props.addressList.length > 0 ?
          <View>
            <CustomButton
              onPress={() => props.setShowAddressModal(true)}
              style={{
                height: 50,
                width: '100%',
                alignSelf: 'center',
                marginTop: 12,
              }}
              secondary
              border
              title={t('common:chooseAnotherAddress')}
            />
          </View>
          :
          <CustomButton
            onPress={() => props.setShowModalAdd(true)}
            style={{
              height: 50,
              width: '100%',
              alignSelf: 'center',
              marginTop: 12,
            }}
            secondary
            border
            title={t('common:addAddress')}
          />
      }
    </View>
  );
}
