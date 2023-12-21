import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Modal from 'react-native-modal';
import {Divider} from '../../../../components/Divider';
import CustomButton from '../../../../components/CustomButton';
import {BankAccounts} from '../constants';
import {MarketplaceRouteName} from '../../../../constants/marketplace_route/marketplaceRouteName';
import axiosInstance from '../../../../helpers/axiosInstance';

export default function ModalManualTransfer(props) {
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );
  const {t} = useTranslation();

  const onSubmitManualTransfer = () => {
    let params = {
      mp_payment_id: props.data.id,
      mp_company_bank_account_id: props.selectedManualTransfer,
    };
    axiosInstance
      .post(`checkout-pay/checkoutManual`, params)
      .then(res => {
        console.log(res.data.data);
        props.navigation.push(MarketplaceRouteName.WAITING_PAYMENT, {
          id: res.data.data,
        });
      })
      .catch(error => {
        console.error('error onSubmit', error.response.data);
      });
  };

  return (
    <Modal isVisible={props.showManualTransfer}>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 10,
          paddingVertical: 16,
          paddingHorizontal: 14,
        }}>
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: '500', fontSize: 16}}>
              Select Manual Bank Transfer
            </Text>
            <TouchableOpacity
              onPress={() => {
                props.setSelectedManualTransfer(null);
                props.setShowManualTransfer(false);
              }}>
              <Text style={{fontWeight: '500', fontSize: 18}}>X</Text>
            </TouchableOpacity>
          </View>
          <Divider />

          {props.bankAccounts.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => props.setSelectedManualTransfer(item.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor:
                    props.selectedManualTransfer == item.id
                      ? themeSetting?.accent_color?.value
                      : '#fff',
                }}>
                <Image
                  source={BankAccounts[item.mp_bank.logo]}
                  style={{
                    width: 120,
                    maxHeight: 80,
                    resizeMode: 'contain',
                  }}
                />
                <View style={{marginLeft: 10}}>
                  <Text style={{fontWeight: '500'}}>{item.mp_bank.name}</Text>
                  <Text>{item.account_name}</Text>
                  <Text>{item.account_number}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
          {props.selectedManualTransfer && (
            <CustomButton
              onPress={onSubmitManualTransfer}
              disabled={props.loadingSubmit}
              loading={props.loadingSubmit}
              style={{
                height: 50,
                width: '100%',
                alignSelf: 'center',
                marginTop: 12,
              }}
              primary
              title={t('common:continue')}
            />
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
