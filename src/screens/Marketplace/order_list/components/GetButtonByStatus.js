import React, { useState } from 'react';
import { View, Text } from 'react-native';
import CustomButton from '../../../../components/CustomButton';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { drsRouteName } from '../../../../constants/drs_route/drsRouteName';
import { MarketplaceRouteName } from '../../../../constants/marketplace_route/marketplaceRouteName';
import { useToast } from 'react-native-toast-notifications';
import axiosInstance from '../../../../helpers/axiosInstance';
import ModalUploadPayment from '../../waiting_payment/components/ModalUploadPayment';
import Modal from 'react-native-modal';
import { Divider } from '../../../../components/Divider';
import RequestRefund from './RequestRefund';

export default function GetButtonByStatus({ status, item, refresh }) {
  const { t } = useTranslation();
  const toast = useToast();

  const { navigate } = useNavigation();
  const navigation = useNavigation();

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [bankValue, setBankValue] = useState(null);
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [paymenProof, setPaymentProof] = useState('');
  const [errors, setErrors] = useState({});
  const [modalCancel, setModalCancel] = useState(false);
  const [modalConfirmReceiveProduct, setModalConfirmReceiveProduct] =
    useState(false);
  const [selectedOrderCode, setSelectedOrderCode] = useState('');

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
        mp_payment_id: item.id,
        payment_proof: paymenProof,
        account_name: accountName,
        account_number: accountNumber,
        mp_bank_id: bankValue,
      };
      console.log(datas);
      axiosInstance
        .post(`my-orders/savePaymentProof`, datas)
        .then(res => {
          navigation.push(MarketplaceRouteName.DETAIL_PAYMENT);
        })
        .catch(error => {
          console.error('error onSubmit', error.response.data);
          if (error.response.data.message) {
            toast.show(error.response.data.message, {
              placement: 'top',
              type: 'danger',
              animationType: 'zoom-in',
              duration: 3000,
            });
          }
        })
        .finally(() => setLoadingSubmit(false));
    }
  };

  const onAddToCart = () => {
    setLoadingSubmit(true);
    let params = {
      qty: 1,
      sku_id: item.mp_transaction_details[0].mp_product_sku_id,
    };
    let url = 'cart/add';
    axiosInstance
      .post(url, params)
      .then(response => {
        if (response.data.success) {
          toast.show(t('common:successAddToCart'), {
            placement: 'top',
            type: 'success',
            animationType: 'zoom-in',
            duration: 3000,
          });
        }
      })
      .catch(error => {
        console.log('error onAddToCart', error)
        if (error.response.data.message) {
          toast.show(error.response.data.message, {
            placement: 'top',
            type: 'danger',
            animationType: 'zoom-in',
            duration: 3000,
          });
        }
      })
      .finally(() => setLoadingSubmit(false));
  };

  const onCancelOrder = () => {
    setLoadingSubmit(true);

    let data = {
      order_code: selectedOrderCode,
    };
    let url = 'my-orders/cancelOrder';
    // console.log(data);
    // return
    axiosInstance
      .post(url, data)
      .then(response => {
        refresh();
        setModalCancel(false);
      })
      .catch(error => console.log('error onCancelOrder', error.response))
      .finally(() => setLoadingSubmit(false));
  };

  const onConfirmReceiveProduct = () => {
    setLoadingSubmit(true);

    let data = {
      order_code: selectedOrderCode,
    };
    let url = 'my-orders/completeTransaction';
    // console.log(data);
    // return
    axiosInstance
      .post(url, data)
      .then(response => {
        refresh();
        console.log(response.data.message)
        setModalConfirmReceiveProduct(false);
      })
      .catch(error => {
        console.log('error onConfirmReceiveProduct', error.response);
        toast.show((error.response.data.message), {
          placement: 'top',
          type: 'danger',
          animationType: 'zoom-in',
          duration: 3000,
        });

      }).finally(() => setLoadingSubmit(false));
  };

  if (status == 'expired') {
    return (
      <>
        <CustomButton
          loading={loadingSubmit}
          onPress={onAddToCart}
          style={{
            height: 40,
            width: '100%',
            alignSelf: 'center',
            marginTop: 5,
            borderRadius: 5,
          }}
          secondary
          border
          title={t('common:buyAgain')}
        />
        <CustomButton
          style={{
            height: 40,
            width: '100%',
            alignSelf: 'center',
            marginTop: 5,
            borderColor: 'grey',
            borderRadius: 5,
          }}
          color="grey"
          onPress={() => {
            if (item?.last_dispute) {
              // console.log(item.last_dispute.ticket_id);
              navigate(drsRouteName.HELP_CENTER_CHAT_MESSAGE, { ticketId: item.last_dispute.ticket_id })
            } else {
              navigate(drsRouteName.HELP_CENTER_FAQ, { item: item })
            }
          }}
          secondary
          border
          title={t('common:helpCenter')}
        />
        {item.last_dispute &&
          item.mp_payment_transaction.mp_payment.last_status.status !==
          'cancelled' && <RequestRefund data={item} refresh={refresh} />}
      </>
    );
  } else if (status == 'complete') {
    return (
      <>
        <CustomButton
          onPress={onAddToCart}
          style={{
            height: 40,
            width: '100%',
            alignSelf: 'center',
            marginTop: 5,
            borderRadius: 5,
          }}
          secondary
          border
          title={t('common:buyAgain')}
        />
        {item.mp_product_rating.length < 1 &&
          <CustomButton
            style={{
              height: 40,
              width: '100%',
              alignSelf: 'center',
              marginTop: 5,
              borderColor: 'grey',
              borderRadius: 5,
            }}
            color="grey"
            onPress={() => navigate(MarketplaceRouteName.RATING, { item: item })}
            secondary
            border
            title={t('common:sendReview')}
          />
        }
      </>
    );
  } else if (status == 'pending') {
    return (
      <>
        <CustomButton
          style={{
            height: 40,
            width: '100%',
            alignSelf: 'center',
            marginTop: 5,
            borderRadius: 5,
          }}
          onPress={() => navigate(MarketplaceRouteName.PAYMENT, { invoiceNumber: item.invoice_number })}
          secondary
          border
          title={t('common:pay')}
        />
        <CustomButton
          // Sisa finishing
          onPress={() => { setSelectedOrderCode(item.mp_payment_transactions[0].mp_transaction.order_code); onCancelOrder }}
          style={{
            height: 40,
            width: '100%',
            alignSelf: 'center',
            marginTop: 5,
            borderColor: 'red',
            borderRadius: 5,
          }}
          color="red"
          secondary
          border
          title={t('common:cancelOrder')}
        />
      </>
    );
  } else if (status == 'refund_in_progress') {
    return (
      <CustomButton
        style={{
          height: 40,
          width: '100%',
          alignSelf: 'center',
          marginTop: 5,
          borderColor: 'grey',
          borderRadius: 5,
        }}
        color="grey"
        // onPress={() => navigate(drsRouteName.HELP_CENTER_FAQ, { item: item })}
        onPress={() => {
          if (item?.last_dispute) {
            // console.log(item.last_dispute.ticket_id);
            navigate(drsRouteName.HELP_CENTER_CHAT_MESSAGE, { ticketId: item.last_dispute.ticket_id })
          } else {
            navigate(drsRouteName.HELP_CENTER_FAQ, { item: item })
          }
        }}
        secondary
        border
        title={t('common:helpCenter')}
      />
    );
  } else if (status == 'refund_approved') {
    return (
      <>
        <CustomButton
          onPress={onAddToCart}
          style={{
            height: 40,
            width: '100%',
            alignSelf: 'center',
            marginTop: 5,
            borderRadius: 5,
          }}
          secondary
          border
          title={t('common:buyAgain')}
        />
        <CustomButton
          style={{
            height: 40,
            width: '100%',
            alignSelf: 'center',
            marginTop: 5,
            borderColor: 'grey',
            borderRadius: 5,
          }}
          color="grey"
          // onPress={() => navigate(drsRouteName.HELP_CENTER_FAQ, { item: item })}
          onPress={() => {
            if (item?.last_dispute) {
              // console.log(item.last_dispute.ticket_id);
              navigate(drsRouteName.HELP_CENTER_CHAT_MESSAGE, { ticketId: item.last_dispute.ticket_id })
            } else {
              navigate(drsRouteName.HELP_CENTER_FAQ, { item: item })
            }
          }}
          secondary
          border
          title={t('common:helpCenter')}
        />
      </>
    );
  } else if (status == 'cancelled') {
    return (
      <CustomButton
        onPress={onAddToCart}
        style={{
          height: 40,
          width: '100%',
          alignSelf: 'center',
          marginTop: 5,
          borderRadius: 5,
        }}
        secondary
        border
        title={t('common:buyAgain')}
      />
    );
  } else if (status == 'arrived') {
    return (
      <>
        <CustomButton
          onPress={() => {
            setModalConfirmReceiveProduct(true),
              setSelectedOrderCode(
                item?.order_code
              );
          }}
          style={{
            height: 40,
            width: '100%',
            alignSelf: 'center',
            marginTop: 5,
            borderRadius: 5,
          }}
          secondary
          border
          title={t('common:confirmReceiveProduct')}
        />
        <CustomButton
          style={{
            height: 40,
            width: '100%',
            alignSelf: 'center',
            marginTop: 5,
            borderColor: 'grey',
            borderRadius: 5,
          }}
          color="grey"
          onPress={() => {
            if (item?.last_dispute) {
              // console.log(item.last_dispute.ticket_id);
              navigate(drsRouteName.HELP_CENTER_CHAT_MESSAGE, { ticketId: item.last_dispute.ticket_id })
            } else {
              navigate(drsRouteName.HELP_CENTER_FAQ, { item: item })
            }
          }}
          secondary
          border
          title={t('common:helpCenter')}
        />
        {/* Kondisi ada ticket drs */}
        {item.last_dispute &&
          item.mp_payment_transaction.mp_payment.last_status.status !==
          'cancelled' && <RequestRefund data={item} refresh={refresh} />}
        <Modal isVisible={modalConfirmReceiveProduct}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingVertical: 16,
              paddingHorizontal: 14,
            }}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>
              {t('common:confirmReceiveProduct')}
            </Text>
            <Divider />
            <Text>
              Anda yakin telah menerima barang dari{' '}
              <Text style={{ fontWeight: '700' }}>{item.mp_seller.name}</Text>?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <CustomButton
                onPress={() => setModalConfirmReceiveProduct(false)}
                style={{
                  height: 40,
                  width: '40%',
                  alignSelf: 'center',
                  marginTop: 5,
                  borderColor: '#000',
                  borderRadius: 5,
                }}
                color="#000"
                secondary
                border
                title={t('common:cancel')}
              />
              <CustomButton
                onPress={onConfirmReceiveProduct}
                style={{
                  height: 40,
                  width: '40%',
                  alignSelf: 'center',
                  marginTop: 5,
                  borderColor: 'red',
                  borderRadius: 5,
                }}
                primary
                title={t('common:confirm')}
              />
            </View>
          </View>
        </Modal>
      </>
    );
  } else if (status == 'forwarded_to_seller') {
    return (
      <>
        <CustomButton
          style={{
            height: 40,
            width: '100%',
            alignSelf: 'center',
            marginTop: 5,
            borderColor: 'grey',
            borderRadius: 5,
          }}
          color="grey"
          // onPress={() => navigate(drsRouteName.HELP_CENTER_FAQ, { item: item })}
          onPress={() => {
            if (item?.last_dispute) {
              // console.log(item.last_dispute.ticket_id);
              navigate(drsRouteName.HELP_CENTER_CHAT_MESSAGE, { ticketId: item.last_dispute.ticket_id })
            } else {
              navigate(drsRouteName.HELP_CENTER_FAQ, { item: item })
            }
          }}
          secondary
          border
          title={t('common:helpCenter')}
        />
        <CustomButton
          onPress={() => {
            setSelectedOrderCode(
              item.mp_transaction_details[0].mp_transaction.order_code
            );
            setModalCancel(true);
          }}
          style={{
            height: 40,
            width: '100%',
            alignSelf: 'center',
            marginTop: 5,
            borderColor: 'red',
            borderRadius: 5,
          }}
          color="red"
          secondary
          border
          title={t('common:cancelOrder')}
        />
        <Modal isVisible={modalCancel}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingVertical: 16,
              paddingHorizontal: 14,
            }}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>
              {t('common:cancelOrder')}
            </Text>
            <Divider />
            <Text>Anda yakin ingin membatalkan pesanan ini?</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <CustomButton
                onPress={() => setModalCancel(false)}
                style={{
                  height: 40,
                  width: '40%',
                  alignSelf: 'center',
                  marginTop: 5,
                  borderColor: '#000',
                  borderRadius: 5,
                }}
                color="#000"
                secondary
                border
                title={t('common:cancel')}
              />
              <CustomButton
                onPress={onCancelOrder}
                style={{
                  height: 40,
                  width: '40%',
                  alignSelf: 'center',
                  marginTop: 5,
                  borderColor: 'red',
                  borderRadius: 5,
                }}
                primary
                title={t('common:confirm')}
              />
            </View>
          </View>
        </Modal>
      </>
    );
  } else if (status == 'waiting_for_upload') {
    return (
      <>
        <CustomButton
          onPress={() =>
            navigate(MarketplaceRouteName.WAITING_PAYMENT, {
              id: item?.mp_payment_destination?.id,
            })
          }
          style={{
            height: 40,
            width: '100%',
            alignSelf: 'center',
            marginTop: 5,
            borderRadius: 5,
          }}
          secondary
          border
          title={t('common:howToPay')}
        />
        <CustomButton
          onPress={() => setShowUploadModal(true)}
          style={{
            height: 40,
            width: '100%',
            alignSelf: 'center',
            marginTop: 5,
            borderRadius: 5,
          }}
          secondary
          border
          title={t('common:UploadPaymentProof')}
        />
        <CustomButton
          onPress={() => {
            setSelectedOrderCode(
              item.mp_transaction_details[0].mp_transaction.order_code
            );
            setModalCancel(true);
          }}
          style={{
            height: 40,
            width: '100%',
            alignSelf: 'center',
            marginTop: 5,
            borderColor: 'red',
            borderRadius: 5,
          }}
          color="red"
          secondary
          border
          title={t('common:cancelOrder')}
        />
        <ModalUploadPayment
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
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
          invoice={item.invoice_number}
        />
        <Modal isVisible={modalCancel}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingVertical: 16,
              paddingHorizontal: 14,
            }}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>
              {t('common:cancelOrder')}
            </Text>
            <Divider />
            <Text>Anda yakin ingin membatalkan pesanan ini?</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <CustomButton
                onPress={() => setModalCancel(false)}
                style={{
                  height: 40,
                  width: '40%',
                  alignSelf: 'center',
                  marginTop: 5,
                  borderColor: '#000',
                  borderRadius: 5,
                }}
                color="#000"
                secondary
                border
                title={t('common:cancel')}
              />
              <CustomButton
                onPress={onCancelOrder}
                style={{
                  height: 40,
                  width: '40%',
                  alignSelf: 'center',
                  marginTop: 5,
                  borderColor: 'red',
                  borderRadius: 5,
                }}
                primary
                title={t('common:confirm')}
              />
            </View>
          </View>
        </Modal>
      </>
    );
  } else return null;
}
