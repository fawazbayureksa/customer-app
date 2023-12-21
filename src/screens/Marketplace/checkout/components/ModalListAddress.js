import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { Divider } from '../../../../components/Divider';
import colors from '../../../../assets/theme/colors';
import CustomButton from '../../../../components/CustomButton';
import { Shadow } from 'react-native-shadow-2';

export default function ModalListAddress(props) {
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );
  const { t } = useTranslation();

  return (
    <Modal isVisible={props.showAddressModal}>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 10,
          paddingVertical: 16,
          paddingHorizontal: 8,
        }}>
        <ScrollView>
          <Text style={{ fontWeight: '500', fontSize: 16 }}>
            {t('common:chooseAddress')}
          </Text>
          <Divider />
          {props.addressList.map((item, index) => {
            return (
              <View key={index}>
                <Shadow distance={3} startColor={'#00000010'} radius={8}>
                  <TouchableOpacity
                    onPress={() => {
                      props.setMainAddress(item);
                      props.setShowAddressModal(false);
                    }}
                    style={{
                      width: props.WIDTH * 0.82,
                      backgroundColor: '#fff',
                      borderRadius: 6,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: 'rgba(10, 0, 0, 0.1)',
                      justifyContent: 'space-between',
                      paddingHorizontal: 16,
                      backgroundColor:
                        item.id == props.mainAddress.id ? '#FFFA9E20' : '#FFF',
                    }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ fontSize: 16, fontWeight: '500' }}>
                        {`${item.receiver_name} | ${item.receiver_phone}`}
                      </Text>
                      {item.id == props.mainAddress.id && (
                        <View
                          style={{
                            backgroundColor: themeSetting?.accent_color?.value,
                            paddingHorizontal: 5,
                            paddingVertical: 2,
                            borderRadius: 5,
                            marginLeft: 5,
                          }}>
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 11,
                              textAlignVertical: 'center',
                            }}>
                            Default
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ color: 'grey' }}>{item.address}</Text>
                    <Text style={{ color: 'grey' }}>
                      {`${item.subdistrict}, ${item.city}, ${item.province}, ${item.postal_code}`}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginVertical: 5,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginRight: 50,
                      }}>
                      <TouchableOpacity>
                        <Text
                          style={{
                            fontWeight: '500',
                            color: '#FA9E25',
                          }}>
                          {t('common:change')}
                        </Text>
                      </TouchableOpacity>

                      {item.id != props.mainAddress.id && (
                        <>
                          <Text
                            style={{
                              color: colors.pasive,
                              fontWeight: '600',
                              fontSize: 16,
                            }}>
                            |
                          </Text>
                          <TouchableOpacity>
                            <Text
                              style={{
                                fontWeight: '500',
                                color: '#FA9E25',
                              }}>
                              {t('common:chooseDefaultAddress')}
                            </Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </TouchableOpacity>
                </Shadow>
                <View style={{ height: 10 }} />
              </View>
            );
          })}
          <TouchableOpacity onPress={() => props.setShowModalAdd(true)}>
            <Text
              style={{
                fontWeight: '500',
                color: '#FA9E25',
              }}>
              {t('common:addAddress')}
            </Text>
          </TouchableOpacity>
          <CustomButton
            onPress={() => props.setShowAddressModal(false)}
            style={{
              width: '20%',
              alignSelf: 'flex-end',
              marginTop: 12,
              borderColor: colors.pasive,
            }}
            secondary
            border
            color="#000"
            title={t('common:cancel')}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}
