import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions, StyleSheet
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Template from '../../../components/Template';
import Address from './components/Address';
import axiosInstance from '../../../helpers/axiosInstance';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ModalListAddress from './components/ModalListAddress';
import OrderList from './components/OrderList';
import IsEmpty from '../../../helpers/IsEmpty';
import CheckoutSummary from './components/CheckoutSummary';
import ModalVoucher from './components/ModalVoucher';
import ModalChangeAddress from './components/ModalChangeAddress';
import { MarketplaceRouteName } from '../../../constants/marketplace_route/marketplaceRouteName';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react-native';
import { CustomDivider } from '../../../components/Divider';
import { TicketDiscount } from 'iconsax-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Currency from '../../../helpers/Currency';
import CustomButton from '../../../components/CustomButton';
import RBSheet from "react-native-raw-bottom-sheet";
import AddressAdd from '../../Account/my_profil/AddressAdd';
import CustomAlert from '../../Forum/components/CustomAlert';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default function Checkout({ navigation }) {
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [addressList, setAddressList] = React.useState([]);
  const [mainAddress, setMainAddress] = React.useState({});
  const [showAddressModal, setShowAddressModal] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [courierTypeItems, setCourierTypeItems] = React.useState([]);

  const [openDropdownCouriers, setOpenDropdownCouriers] = React.useState({});
  const [courierValue, setCourierValue] = React.useState({});
  const [courierValueTemp, setCourierValueTemp] = React.useState();
  const [idDropdownCourier, setIdDropwdownCourier] = React.useState();

  const [openDropdownDuration, setOpenDropdownDuration] = React.useState({});
  const [durationValue, setDurationValue] = React.useState({});
  const [durationValueTemp, setDurationValueTemp] = React.useState();
  const [durationItem, setDurationItem] = React.useState({});
  const [cartIds, setCartIds] = React.useState([]);

  const [modalVoucher, setModalVoucher] = React.useState(false);
  const [selectedVoucher, setSelectedVoucher] = React.useState([]);
  const [vouchers, setVouchers] = React.useState([]);
  const [shippingCost, setShippingCost] = React.useState([]);

  const [priceWithoutShipping, setPriceWithoutShipping] = React.useState(0);
  const [totalDiscount, setTotalDiscount] = React.useState(0);
  const [shippingFee, setShippingFee] = React.useState(0);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [totalVoucherProduct, setTotalVoucherProduct] = React.useState(0);
  const [totalVoucherShipping, setTotalVoucherShipping] = React.useState(0);
  const [totalVoucher, setTotalVoucher] = React.useState(0);

  const [provinceValue, setProvinceValue] = React.useState();
  const [cityValue, setCityValue] = React.useState();
  const [subdistrictValue, setSubdistrictValue] = React.useState();
  const [selectedVoucherLength, setSelectedVoucherLength] = React.useState(0);

  //ERROR STATE
  const [errorCourier, setErrorCourier] = React.useState({});
  const [errorDuration, setErrorDuration] = React.useState({});

  const [showModalChangeAddress, setShowModalChangeAddress] =
    React.useState(false);


  //Add Address STATE
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressName, setAddressName] = useState('');
  const [address, setAddress] = useState('');
  const [provinceValueAdd, setProvinceValueAdd] = React.useState();
  const [addressListAdd, setAddressListAdd] = React.useState([]);
  const [cityValueAdd, setCityValueAdd] = React.useState();
  const [subdistrictValueAdd, setSubdistrictValueAdd] = React.useState();
  const [lat, setLat] = React.useState(-6.178368);
  const [long, setLong] = React.useState(106.825321);
  const [idAddress, setIdAddress] = useState();
  const [isMain, setIsMain] = useState(false);


  // Modal State
  const [showModalAdd, setShowModalAdd] = React.useState(false);
  const [modalSuccesAdd, setModalSuccesAdd] = useState(false);

  const refRBSheet = useRef();
  useEffect(() => {
    getAddress();
    getDataCheckout();
  }, []);

  useEffect(() => {
    if (!IsEmpty(courierValueTemp)) {
      onChangeCourier();
    }
  }, [courierValueTemp]);

  useEffect(() => {
    if (!IsEmpty(durationValueTemp)) {
      onChangeDuration();
    }
  }, [durationValueTemp]);

  useEffect(() => {
    calculateTotalPrice();
  }, [durationValue, data]);

  useEffect(() => {
    setSelectedVoucherLength(ObjectLength(selectedVoucher));
  }, [selectedVoucher]);

  useEffect(() => {
    calculatedVoucher();
  }, [selectedVoucher, shippingFee]);

  const getAddress = () => {
    setLoading(true);
    axiosInstance
      .get(`profile/address/get`)
      .then(res => {
        let data = res.data.data;
        setAddressList(data);
        data.map(item => {
          if (item.is_main) {
            setMainAddress(item);
          }
        });
      })
      .catch(error => {
        console.error('error getAddress', error);
      })
      .finally(() => setLoading(false));
  };

  const getDataCheckout = () => {
    setLoading(true);
    axiosInstance
      .get(`checkout/getMasterData`)
      .then(res => {
        let carts = [];
        let data = res.data.data;
        setData(data.data);
        data.data.map(item => {
          item.carts.map(cart => {
            carts.push(cart.id);
          });
        });
        // console.log('tes', JSON.stringify(data.data));
        setCartIds(carts);
      })
      .catch(error => {
        console.error('error getAddress', error);
      })
      .finally(() => setLoading(false));
  };

  const onChangeOpenDropdown = (id, value) => {
    setOpenDropdownCouriers({
      ...openDropdownCouriers,
      ['dropdown_' + id]: value,
    });
  };

  const onChangeOpenDropdownDuration = (id, value) => {
    setOpenDropdownDuration({
      ...openDropdownDuration,
      ['dropdown_' + id]: value,
    });
  };

  const onChangeCourier = () => {
    setCourierValue({
      ...courierValue,
      ['courier_' + idDropdownCourier]: courierValueTemp,
    });

    setDurationValue({
      ...durationValue,
      ['duration_' + idDropdownCourier]: undefined,
    });

    let params = {
      mp_seller_id: idDropdownCourier,
      mp_courier_key: courierValueTemp,
      mp_customer_address_id: mainAddress.id,
    };

    axiosInstance
      .get(`checkout/getCourierTypes`, { params })
      .then(res => {
        let data = res.data.data;
        setDurationItem({
          ...durationItem,
          ['durationItem_' + idDropdownCourier]: data.costs,
        });
      })
      .catch(error => {
        console.error('error onChangeCourier', error.response.data);
        setDurationItem({
          ...durationItem,
          ['durationItem_' + idDropdownCourier]: [],
        });
      });
  };

  const onChangeDuration = () => {
    setDurationValue({
      ...durationValue,
      ['duration_' + idDropdownCourier]: durationValueTemp,
    });
  };

  const calculateTotalPrice = () => {
    let price_without_shipping = 0;
    let total_discount = 0;
    let shipping_fee = 0;

    for (const datum of data) {
      if (
        typeof durationValue['duration_' + datum.seller.id]?.cost[0].value ==
        'number'
      ) {
        shipping_fee +=
          durationValue['duration_' + datum.seller.id]?.cost[0].value;
      }

      for (const cart of datum.carts) {
        if (cart.mp_auction_bid) {
          price_without_shipping +=
            cart.mp_auction_bid.bid_price * cart.quantity;
        } else if (cart.mp_product_sku.normal_price == 0) {
          price_without_shipping += cart.mp_product_sku.price * cart.quantity;
        } else {
          price_without_shipping +=
            cart.mp_product_sku.normal_price * cart.quantity;
          total_discount +=
            (parseInt(cart.mp_product_sku.normal_price) -
              parseInt(cart.mp_product_sku.price)) *
            cart.quantity;
        }
      }
    }
    setPriceWithoutShipping(price_without_shipping);
    setTotalDiscount(total_discount);
    setShippingFee(shipping_fee);
    setTotalPrice(price_without_shipping - total_discount + shipping_fee);
  };

  const onChangeValueMainAddress = (type, value) => {
    setMainAddress({
      ...mainAddress,
      [type]: value,
    });
  };

  const onSubmitAddressChange = () => {
    let data = {
      address: mainAddress.address,
      address_name: mainAddress.address_name,
      city: mainAddress.city,
      is_main: mainAddress.is_main,
      lat: mainAddress.lat,
      lng: mainAddress.lng,
      mp_customer_address_id: mainAddress.id,
      postal_code: mainAddress.postal_code,
      province: mainAddress.province,
      receiver_name: mainAddress.receiver_name,
      receiver_phone: mainAddress.receiver_phone,
      subdistrict: mainAddress.subdistrict,
    };
    axiosInstance
      .post(`profile/address/update`, data)
      .then(res => {
        setShowModalChangeAddress(false);
        getAddress();
      })
      .catch(error => {
        console.error('error onSubmitAddressChange', error);
      });
  };

  const onSaveAddress = () => {
    let data = {
      address: address,
      address_name: addressName,
      city: cityValue,
      is_main: isMain,
      postal_code: postalCode,
      province: provinceValue,
      receiver_name: receiverName,
      receiver_phone: receiverPhone,
      subdistrict: subdistrictValue,
      lng: long,
      lat: lat,
    };
    // console.log(data);
    // return
    axiosInstance
      .post(`profile/address/add`, data)
      .then(res => {
        setShowModalAdd(false);
        handleClose();
        setModalSuccesAdd(true)
        getAddress();
      })
      .catch(error => {
        console.error('error onSubmitAddress', error.response.data);
      });
  };

  const handleClose = () => {
    setReceiverName('');
    setReceiverPhone('');
    setPostalCode('');
    setAddressName('');
    setAddress('');
    setProvinceValue('');
    setCityValue('');
    setIdAddress();
    setPostalCode('');
    setLat(-6.178368);
    setLong(106.825321);
    setIsMain(false);
  };


  const calculatedVoucher = () => {
    let discount_for_product = 0;
    let discount_for_shipping = 0;
    vouchers.length > 0 &&
      vouchers.map((item, index) => {
        if (selectedVoucher['selectedVoucher' + item.id]?.value == 'true') {
          if (item.voucher.discount_for == 'product') {
            if (item.voucher.discount_type === 'fixed') {
              discount_for_product += item.voucher.discount;
            } else if (item.voucher.discount_type === 'percentage') {
              discount_for_product += Math.floor(
                (totalPrice * item.voucher.discount) / 100,
              );
              if (item.voucher.max_discount != null) {
                discount_for_product += Math.min(
                  Math.floor((totalPrice * item.voucher.discount) / 100),
                  item.voucher.max_discount,
                );
              }
            }
          } else if (item.voucher.discount_for == 'shipping') {
            if (item.voucher.discount_type === 'fixed') {
              discount_for_shipping += item.voucher.discount;
            } else if (item.voucher.discount_type === 'percentage') {
              discount_for_shipping += Math.floor(
                (shippingFee * item.voucher.discount) / 100,
              );
              if (item.voucher.max_discount != null) {
                discount_for_shipping += Math.min(
                  Math.floor((shippingFee * item.voucher.discount) / 100),
                  item.voucher.max_discount,
                );
              }
            }
          }
        }
      });
    setTotalVoucherProduct(discount_for_product);
    setTotalVoucherShipping(discount_for_shipping);
    setTotalVoucher(discount_for_product + discount_for_shipping);
  };

  const validateSubmit = () => {
    let validate = true;
    // console.log(courierValue);
    data.map(item => {
      if (!courierValue['courier_' + item.seller.id]) {
        validate = false;
        // console.log(item.seller.id);
        setErrorCourier(prev => ({
          ...prev,
          ['errorCourier_' + item.seller.id]: t('common:courierNotSet'),
        }));
      } else {
        setErrorCourier(prev => ({
          ...prev,
          ['errorCourier_' + item.seller.id]: '',
        }));
      }

      if (!durationValue['duration_' + item.seller.id]) {
        validate = false;
        setErrorDuration(prev => ({
          ...prev,
          ['errorDuration_' + item.seller.id]: t('common:durationNotSet'),
        }));
      } else {
        setErrorDuration(prev => ({
          ...prev,
          ['errorDuration_' + item.seller.id]: '',
        }));
      }
    });

    return validate;
  };

  const onSubmitCheckout = () => {
    if (!validateSubmit()) return;

    let idVoucher = [];
    vouchers.map(item => {
      if (selectedVoucher['selectedVoucher' + item.id]?.value == 'true') {
        idVoucher.push(item.id);
      }
    });

    let datas = {
      mp_customer_address_id: mainAddress.id,
      transactions: data.map(item => ({
        cart_ids: getCartIds(item),
        mp_courier_key: courierValue['courier_' + item.seller.id],
        mp_courier_type_key:
          durationValue['duration_' + item.seller.id].service,
        mp_seller_id: item.seller.id,
        shipping_fee: durationValue['duration_' + item.seller.id].cost[0].value,
      })),
      voucher_customer_ids: idVoucher,
    };
    axiosInstance
      .post(`checkout/save`, datas)
      .then(res => {
        // console.log(res.data.data);

        navigation.navigate(MarketplaceRouteName.PAYMENT, {
          invoiceNumber: res.data.data,
        });
      })
      .catch(error => {
        console.error('error onSubmitCheckout', error);
      });
  };

  const getCartIds = item => {
    let ids = [];
    for (const cart of item.carts) {
      ids.push(cart.id);
    }
    return ids;
  };

  const ObjectLength = object => {
    var length = 0;
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        ++length;
      }
    }
    return length;
  };

  return (
    <>
      {loading ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <ActivityIndicator
            size="large"
            color={themeSetting?.accent_color?.value}
          />
        </View>
      ) : (
        <Template scroll={true} url={MarketplaceRouteName.CHECKOUT}>
          <View style={{ flexGrow: 1, padding: 8, flex: 1, zIndex: 1000 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ArrowLeft2
                size="24"
                color="#000"
                onPress={() => {
                  navigation.goBack();
                }}
                style={{ marginRight: 10 }}
              />
              <Text style={{ fontSize: 18, fontWeight: '500' }}>Checkout</Text>
            </View>
            <Address
              handleClose={handleClose}
              setShowModalAdd={setShowModalAdd}
              mainAddress={mainAddress}
              setShowAddressModal={setShowAddressModal}
              showModalChangeAddress={showModalChangeAddress}
              setShowModalChangeAddress={setShowModalChangeAddress}
              addressList={addressList}
            />
            <CustomDivider />
            <View style={{ zIndex: 1000 }}>
              <OrderList
                data={data}
                setOpenDropdownCouriers={setOpenDropdownCouriers}
                openDropdownCouriers={openDropdownCouriers}
                onChangeOpenDropdown={onChangeOpenDropdown}
                setCourierTypeItems={setCourierTypeItems}
                courierTypeItems={courierTypeItems}
                courierValueTemp={courierValueTemp}
                setCourierValueTemp={setCourierValueTemp}
                courierValue={courierValue}
                setCourierValue={setCourierValue}
                setIdDropwdownCourier={setIdDropwdownCourier}
                onChangeOpenDropdownDuration={onChangeOpenDropdownDuration}
                openDropdownDuration={openDropdownDuration}
                durationValueTemp={durationValueTemp}
                durationValue={durationValue}
                setDurationValueTemp={setDurationValueTemp}
                durationItem={durationItem}
                errorCourier={errorCourier}
                errorDuration={errorDuration}
              />
            </View>
            {/* <CheckoutSummary
              selectedVoucher={selectedVoucher}
              data={data}
              modalVoucher={modalVoucher}
              setModalVoucher={setModalVoucher}
              vouchers={vouchers}
              shippingFee={shippingFee}
              priceWithoutShipping={priceWithoutShipping}
              totalDiscount={totalDiscount}
              totalPrice={totalPrice}
              totalVoucherProduct={totalVoucherProduct}
              totalVoucher={totalVoucher}
              onSubmitCheckout={onSubmitCheckout}
            /> */}
          </View>

          <ModalListAddress
            handleClose={handleClose}
            setShowModalAdd={setShowModalAdd}
            mainAddress={mainAddress}
            setMainAddress={setMainAddress}
            showAddressModal={showAddressModal}
            setShowAddressModal={setShowAddressModal}
            addressList={addressList}
            WIDTH={WIDTH}
          />
          <ModalVoucher
            modalVoucher={modalVoucher}
            setModalVoucher={setModalVoucher}
            cartIds={cartIds}
            setSelectedVoucher={setSelectedVoucher}
            selectedVoucher={selectedVoucher}
            setVouchers={setVouchers}
            vouchers={vouchers}
            totalVoucherShipping={totalVoucherShipping}
          />
          <ModalChangeAddress
            mainAddress={mainAddress}
            setMainAddress={setMainAddress}
            showModalChangeAddress={showModalChangeAddress}
            setShowModalChangeAddress={setShowModalChangeAddress}
            provinceValue={provinceValue}
            setProvinceValue={setProvinceValue}
            cityValue={cityValue}
            setCityValue={setCityValue}
            subdistrictValue={subdistrictValue}
            setSubdistrictValue={setSubdistrictValue}
            onChangeValueMainAddress={onChangeValueMainAddress}
            onSubmitAddressChange={onSubmitAddressChange}
          />
          <AddressAdd
            handleClose={handleClose}
            showModalAdd={showModalAdd}
            setShowModalAdd={setShowModalAdd}
            addressName={addressName}
            setAddressName={setAddressName}
            receiverName={receiverName}
            setReceiverName={setReceiverName}
            receiverPhone={receiverPhone}
            setReceiverPhone={setReceiverPhone}
            provinceValue={provinceValue}
            setProvinceValue={setProvinceValue}
            cityValue={cityValue}
            setCityValue={setCityValue}
            subdistrictValue={subdistrictValue}
            setSubdistrictValue={setSubdistrictValue}
            postalCode={postalCode}
            setPostalCode={setPostalCode}
            address={address}
            onSaveAddress={onSaveAddress}
            setAddress={setAddress}
            setIsMain={setIsMain}
            isMain={isMain}
            idAddress={idAddress}
            lat={lat}
            long={long}
            setLat={setLat}
            setLong={setLong}
            onSubmitAddressChange={onSubmitAddressChange}
          />
          <CustomAlert
            modalVisible={modalSuccesAdd}
            setModalVisible={setModalSuccesAdd}
            message={'Berhasil Tambah Alamat'}
          />
        </Template>
      )}
      <View
        style={{
          zIndex: -1,
          // height: HEIGHT * 0.15,
          backgroundColor: '#fff',
          padding: 12,
          borderColor: 'rgba(10, 0, 0, 0.1)',
          borderWidth: 1,
        }}>
        <TouchableOpacity
          onPress={() => setModalVoucher(true)}
          style={{
            borderRadius: 10,
            flexDirection: 'row',
            paddingVertical: 8,
            paddingHorizontal: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(10, 0, 0, 0.1)',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TicketDiscount size="32" color="#FF8A65" />
            {selectedVoucherLength > 0 ? (
              <View>
                <Text style={{ marginLeft: 10, fontWeight: '500' }}>
                  {selectedVoucherLength} Voucher digunakan
                </Text>
                <Text style={{ marginLeft: 10, fontSize: 12, color: '#A6A6A6' }}>
                  Anda Hemat Rp {Currency(totalVoucher)}
                </Text>
              </View>
            ) : (
              <>
                <Text style={{ marginLeft: 10 }}>Pilih Voucher</Text>
              </>
            )}
          </View>
          <ArrowRight2
            size="24"
            color="#000"
            style={{ alignContent: 'flex-end' }}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <Text>
              {t('common:totalPrice')}{' '}
              {`(${data.length} ${t('common:product')})`}
            </Text>
            <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'row' }} onPress={() => refRBSheet.current.open()}>
              <Text style={{ fontSize: 16, fontWeight: '700' }}>
                Rp {Currency(totalPrice)}
              </Text>
              <Icon name="expand-less" size={30} style={{ marginLeft: 5 }} />
            </TouchableOpacity>
          </View>
          <CustomButton
            onPress={onSubmitCheckout}
            style={{
              height: 50,
              width: '40%',
              alignSelf: 'center',
              marginTop: 12,
            }}
            primary
            title="Checkout"
          />
        </View>
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={160}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0, 0, 0, 0.6)"
          },
          draggableIcon: {
            backgroundColor: "#000"
          }
        }}
      >
        <View style={{ paddingHorizontal: 12, }}>
          <View style={styles.row}>
            <Text style={{ color: '#404040', fontWeight: '700', fontSize: 16 }}>Ringkasan Belanja</Text>
            <TouchableOpacity onPress={() => refRBSheet.current.close()}><Icon name="close" size={24} /></TouchableOpacity>
          </View>
          <View style={styles.row}>
            <Text style={{ color: '#8D8D8D' }}>{t('common:totalPrice')}{' '}
              {`(${data.length} ${t('common:product')})`}</Text>
            <Text style={{ color: '#8D8D8D' }}>Rp {Currency(priceWithoutShipping)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={{ color: '#8D8D8D' }}>Diskon</Text>
            <Text style={{ color: '#8D8D8D' }}>Rp {Currency(totalDiscount)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={{ color: '#8D8D8D' }}>Ongkos Kirim</Text>
            <Text style={{ color: '#8D8D8D' }}>Rp {Currency(shippingFee)}</Text>
          </View>
        </View>
      </RBSheet>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8
  },
});
