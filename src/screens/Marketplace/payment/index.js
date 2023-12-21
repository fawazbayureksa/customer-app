import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Template from '../../../components/Template';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import convertCSS from '../../../helpers/convertCSS';
import axiosInstance from '../../../helpers/axiosInstance';
import {paymentMethodOptions} from './constants';
import CardPayment from './components/CardPayment';
import {Shadow} from 'react-native-shadow-2';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Divider} from '../../../components/Divider';
import CardPaymentGroup from './components/CardPaymentGroup';
import Currency from '../../../helpers/Currency';
import CustomButton from '../../../components/CustomButton';
import {useToast} from 'react-native-toast-notifications';
import ModalManualTransfer from './components/ModalManualTransfer';
import ModalWebview from './components/ModalWebview';
import {MarketplaceRouteName} from '../../../constants/marketplace_route/marketplaceRouteName';

const WIDTH = Dimensions.get('window').width;

export default function Payment({route, navigation}) {
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );
  const {t} = useTranslation();
  const toast = useToast();

  const fontSize = convertCSS(themeSetting.body_typography.font_size);

  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState({});
  const [selectedPayment, setSelectedPayment] = useState();
  const [selectedManualTransfer, setSelectedManualTransfer] = useState();
  const [selectedExpand, setSelectedExpand] = useState();
  const [data, setData] = useState({});
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [platfomrFeePercentage, setPlatformFeePercentage] = useState();
  const [showManualTransfer, setShowManualTransfer] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [redirectUrlMidtrans, setRedirectUrlMidtrans] = useState('');
  const [modalWebview, setModalWebview] = useState(false);

  useEffect(() => {
    getMasterData();
  }, []);

  useEffect(() => {
    if (selectedPayment) {
      calculatePlatformFee();
    }
  }, [selectedPayment]);

  const getMasterData = () => {
    setLoading(true);
    let params = {
      invoice_number: route.params.invoiceNumber,
    };
    axiosInstance
      .get(`checkout-pay/getMasterData`, {params})
      .then(res => {
        let data = res.data.data;

        // ========================== Payment method ==========================
        let payment_method = {};
        for (const item of JSON.parse(data.payment_method).value) {
          payment_method[item.key] = item;
        }

        // ========================== sumQty, grand_total ==========================
        let sumQty = 0;
        let grand_total = 0;
        for (const datum of res.data.data.data.mp_payment_transactions) {
          grand_total += datum.mp_transaction.grand_total;
          for (const detail of datum.mp_transaction.mp_transaction_details) {
            sumQty += detail.quantity;
          }
        }
        setQuantity(sumQty);
        setTotalPrice(grand_total);
        setPaymentMethod(payment_method);
        setData(res.data.data.data);
        setBankAccounts(data.bank_accounts);
        setTotalPayment(grand_total);
      })
      .catch(error => {
        console.error('error getMasterData', error.response.data);
      })
      .finally(() => setLoading(false));
  };

  const checkPaymentMethodExist = itemKey => {
    let payment_method = paymentMethod[itemKey];
    if (payment_method && payment_method.selected) return true;
    else return false;
  };

  const calculatePlatformFee = () => {
    let payment_method = paymentMethod[selectedPayment];

    if (!payment_method) return;

    let platform_fee = 0;
    let platform_fee_percentage = null;
    if (payment_method.platform_fee_type === 'value') {
      platform_fee = payment_method.platform_fee;
    } else if (payment_method.platform_fee_type === 'percentage') {
      platform_fee = Math.ceil(
        (totalPrice * payment_method.platform_fee) / 100,
      );
      platform_fee_percentage = payment_method.platform_fee;
    }

    setPlatformFee(platform_fee);
    setTotalPayment(totalPrice + platform_fee);
    setPlatformFeePercentage(platform_fee_percentage);
  };

  const onSubmitPayment = () => {
    if (selectedPayment) {
      if (selectedPayment == 'manual') {
        setShowManualTransfer(true);
      } else {
        setLoadingSubmit(true);
        let params = {
          invoice_number: route.params.invoiceNumber,
          enabled_payment: selectedPayment,
        };
        console.log(params);
        axiosInstance
          .post(`checkout-pay/getMidtransToken`, params)
          .then(res => {
            setRedirectUrlMidtrans(res.data.data.redirect_url);
            setModalWebview(true);
          })
          .catch(error => {
            console.error('error onSubmitPayment', error);
          })
          .finally(() => setLoadingSubmit(false));
      }
    } else {
      toast.show(t('common:emptyPaymentMethod'), {
        placement: 'top',
        type: 'danger',
        animationType: 'zoom-in',
        duration: 3000,
      });
    }
  };

  return (
    <>
      {loading ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator
            size="large"
            color={themeSetting?.accent_color?.value}
          />
        </View>
      ) : (
        <Template scroll={true} url={MarketplaceRouteName.PAYMENT}>
          <View style={{padding: 8, flex: 1}}>
            <Text style={{fontSize: fontSize * 1.2, fontWeight: '500'}}>
              {t('common:setPaymentMethod')}
            </Text>

            {paymentMethodOptions.map(item => {
              if (item.group) {
                let visible = false;
                for (const item2 of item.items) {
                  if (checkPaymentMethodExist(item2.key)) {
                    visible = true;
                    break;
                  }
                }
                if (visible)
                  return (
                    <View style={{marginTop: 20}}>
                      <Shadow distance={3} startColor={'#00000010'} radius={8}>
                        <View
                          style={{
                            width: WIDTH * 0.95,
                            borderRadius: 6,
                            padding: 12,
                            borderWidth: 1,
                            borderColor: 'rgba(10, 0, 0, 0.1)',
                            paddingHorizontal: 16,
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              setSelectedExpand(
                                selectedExpand ? '' : item.group,
                              )
                            }
                            style={{
                              paddingVertical: 8,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}>
                            <Text style={{fontWeight: '500'}}>
                              {' '}
                              {t(`common:group_${item.group}`)}
                            </Text>
                            <Icon
                              name={
                                selectedExpand == item.group
                                  ? 'expand-less'
                                  : 'expand-more'
                              }
                              size={24}
                              color="#000"
                            />
                          </TouchableOpacity>
                          {selectedExpand == item.group && (
                            <>
                              <Divider />
                              {item.items.map(item2 => {
                                if (checkPaymentMethodExist(item2.key))
                                  return (
                                    <CardPaymentGroup
                                      data={item2}
                                      fontSize={fontSize}
                                      setSelectedPayment={setSelectedPayment}
                                      selectedPayment={selectedPayment}
                                    />
                                  );
                                else return null;
                              })}
                            </>
                          )}
                        </View>
                      </Shadow>
                    </View>
                  );
              } else {
                if (checkPaymentMethodExist(item.key))
                  return (
                    <CardPayment
                      data={item}
                      fontSize={fontSize}
                      setSelectedPayment={setSelectedPayment}
                      selectedPayment={selectedPayment}
                    />
                  );
                else return null;
              }
            })}
            {data &&
              data?.mp_payment_transactions?.map(item => {
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
                          <View style={{marginVertical: 8}}>
                            <Text style={{fontWeight: '500', fontSize: 16}}>
                              {t('common:summary')}
                            </Text>
                            <Divider />
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View>
                              <Text style={{color: 'grey'}}>
                                {t('common:price')}
                              </Text>
                            </View>
                            <View>
                              <Text style={{color: 'grey'}}>
                                Rp {Currency(item.mp_transaction.price)}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View>
                              <Text style={{color: 'grey'}}>
                                {t('common:shipping')}
                              </Text>
                            </View>
                            <View>
                              <Text style={{color: 'grey'}}>
                                Rp{' '}
                                {Currency(
                                  item.mp_transaction.shipping_fee || 0,
                                )}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View>
                              <Text style={{color: 'grey'}}>
                                {t('common:totalDiscount')}
                              </Text>
                            </View>
                            <View>
                              <Text style={{color: 'grey'}}>
                                {item.mp_transaction.discount > 0 && '-'} Rp{' '}
                                {Currency(item.mp_transaction.discount)}
                              </Text>
                            </View>
                          </View>
                          <Divider />
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View>
                              <Text style={{fontWeight: '500'}}>
                                {t('common:totalPrice')}
                              </Text>
                            </View>
                            <View>
                              <Text style={{fontWeight: '500'}}>
                                Rp {Currency(totalPrice || 0)}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View>
                              <Text style={{color: 'grey'}}>
                                {t('common:platformFee')}{' '}
                                {platfomrFeePercentage
                                  ? `(${platfomrFeePercentage}%)`
                                  : ''}
                              </Text>
                            </View>
                            <View>
                              <Text style={{color: 'grey'}}>
                                Rp {Currency(platformFee || 0)}
                              </Text>
                            </View>
                          </View>
                          <Divider />

                          <View
                            style={{
                              marginBottom: 10,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View>
                              <Text style={{fontWeight: '500'}}>
                                {t('common:totalPayment')}{' '}
                                <Text
                                  style={{
                                    fontWeight: '400',
                                    color: 'grey',
                                  }}>{`(${quantity} ${t(
                                  'common:product',
                                )})`}</Text>
                              </Text>
                            </View>
                            <View>
                              <Text style={{fontWeight: '500'}}>
                                Rp {Currency(totalPayment || 0)}
                              </Text>
                            </View>
                          </View>

                          <CustomButton
                            onPress={onSubmitPayment}
                            // onPress={() => setModalWebview(true)}
                            disabled={loadingSubmit}
                            loading={loadingSubmit}
                            style={{
                              height: 50,
                              width: '100%',
                              alignSelf: 'center',
                              marginTop: 12,
                            }}
                            primary
                            title={t('common:continueBuy')}
                          />
                        </View>
                      </View>
                    </Shadow>
                  </View>
                );
              })}
            <ModalManualTransfer
              showManualTransfer={showManualTransfer}
              setShowManualTransfer={setShowManualTransfer}
              bankAccounts={bankAccounts}
              setSelectedManualTransfer={setSelectedManualTransfer}
              selectedManualTransfer={selectedManualTransfer}
              loadingSubmit={loadingSubmit}
              data={data}
              navigation={navigation}
            />
            <ModalWebview
              redirectUrlMidtrans={redirectUrlMidtrans}
              modalWebview={modalWebview}
              setModalWebview={setModalWebview}
              navigation={navigation}
            />
          </View>
        </Template>
      )}
    </>
  );
}
