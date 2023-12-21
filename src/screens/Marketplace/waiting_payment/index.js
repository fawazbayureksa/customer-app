import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Template from '../../../components/Template';
import { useTranslation } from 'react-i18next';
import { Divider } from '../../../components/Divider';
import { useSelector } from 'react-redux';
import convertCSS from '../../../helpers/convertCSS';
import axiosInstance from '../../../helpers/axiosInstance';
import Currency from '../../../helpers/Currency';
import CustomButton from '../../../components/CustomButton';
import { BankAccounts } from '../payment/constants';
import ModalUploadPayment from './components/ModalUploadPayment';
import { MarketplaceRouteName } from '../../../constants/marketplace_route/marketplaceRouteName';

export default function WaitingPayment({ route, navigation }) {
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );
  const { t } = useTranslation();
  const fontSize = convertCSS(themeSetting.body_typography.font_size);

  const [data, setData] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [bankValue, setBankValue] = useState(null);
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [paymenProof, setPaymentProof] = useState('');
  const [errors, setErrors] = useState({});
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    getManualTransferDestination();
  }, []);

  const getManualTransferDestination = () => {
    let params = {
      mp_payment_destination_id: route.params.id,
    };
    axiosInstance
      .get(`checkout-pay/getManualTransferDestination`, { params })
      .then(res => {
        let data = res.data.data;
        setData(data);
      })
      .catch(error => {
        console.error('error getMasterData', error.response.data);
      });
  };

  const validate = () => {
    let newErrors = {};
    if (bankValue === null) {
      newErrors.bank = t('common:selectBank');
    }
    if (accountName === '') {
      newErrors.accountName = t('common:fillAccountName');
    }
    if (accountNumber === '') {
      newErrors.accountNumber = t('common:fillAccountNumber');
    }
    if (paymenProof === '') {
      newErrors.paymenProof = t('common:fillPaymentProof');
    }
    return newErrors;
  };

  const onSubmit = () => {
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setErrors({});
      setLoadingSubmit(true);
      let datas = {
        mp_payment_id: data.mp_payment_id,
        payment_proof: paymenProof,
        account_name: accountName,
        account_number: accountNumber,
        mp_bank_id: bankValue,
      };
      console.log(datas);
      axiosInstance
        .post(`my-orders/savePaymentProof`, datas)
        .then(res => {
          console.log(res.data.data);
          navigation.push(MarketplaceRouteName.DETAIL_PAYMENT);
        })
        .catch(error => {
          console.error('error onSubmit', error.response.data);
        })
        .finally(() => setLoadingSubmit(false));
    }
  };

  return (
    <Template scroll={true} url={MarketplaceRouteName.WAITING_PAYMENT}>
      <View style={{ flexGrow: 1, padding: 8, flex: 1 }}>
        <Text style={{ fontSize: fontSize * 1.2, fontWeight: '500' }}>
          {t('common:waitingPayment')}
        </Text>
      </View>
      <Divider />

      <View
        style={{
          flexGrow: 1,
          paddingVertical: 8,
          paddingHorizontal: 16,
          flex: 1,
        }}>
        <Text style={{ fontSize: fontSize, fontWeight: '500' }}>
          {t('common:totalPayment')}
        </Text>
        <Text style={{ fontSize: fontSize * 1.1, fontWeight: '500' }}>
          Rp {Currency(data.payment_total)}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 12,
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => navigation.push(MarketplaceRouteName.ORDER_LIST)}
            style={{
              width: '45%',
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 16,
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                textAlign: 'center',
              }}>
              {t('common:checkOrderStatus')}
            </Text>
          </TouchableOpacity>
          <CustomButton
            onPress={() => setShowUploadModal(true)}
            primary
            title={t('common:uploadPayment')}
            style={{ width: '45%', height: 50, textAlign: 'center' }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 12,
          alignItems: 'center',
        }}>
        <Image
          source={BankAccounts[data.bank_logo]}
          style={{
            width: 120,
            maxHeight: 120,
            resizeMode: 'contain',
          }}
        />
        <View style={{ marginLeft: 15 }}>
          <Text style={{ fontWeight: '500' }}>{data.bank_name}</Text>
          <Text>
            {data.account_number} - {data.account_name}
          </Text>
        </View>
      </View>
      <ModalUploadPayment
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
        data={data}
        setBankValue={setBankValue}
        bankValue={bankValue}
        accountName={accountName}
        setAccountName={setAccountName}
        accountNumber={accountNumber}
        setAccountNumber={setAccountNumber}
        paymenProof={paymenProof}
        setPaymentProof={setPaymentProof}
        onSubmit={onSubmit}
        errors={errors}
        loadingSubmit={loadingSubmit}
        invoice={data.payment_invoice_number}
      />
    </Template>
  );
}
