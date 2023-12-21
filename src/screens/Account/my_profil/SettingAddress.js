import React, {useState} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import colors from '../../../assets/theme/colors';
import axiosInstance from '../../../helpers/axiosInstance';
import convertCSS from '../../../helpers/convertCSS';
import CustomButton from '../../../components/CustomButton';
import AddressAdd from './AddressAdd';
import CustomAlert from '../../Forum/components/CustomAlert';
import {ActivityIndicator} from 'react-native-paper';
import {Image} from 'react-native';

const SettingAddress = () => {
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressName, setAddressName] = useState('');
  const [address, setAddress] = useState('');
  const [provinceValue, setProvinceValue] = React.useState();
  const [addressList, setAddressList] = React.useState([]);
  const [cityValue, setCityValue] = React.useState();
  const [subdistrictValue, setSubdistrictValue] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const WIDTH = Dimensions.get('window').width;
  const [mainAddress, setMainAddress] = React.useState({});
  const [addressSelected, setAddressSelected] = React.useState(false);
  const [showModalChangeAddress, setShowModalChangeAddress] =
    React.useState(false);
  const [isMain, setIsMain] = useState(false);
  const [idAddress, setIdAddress] = useState();
  // Modal statements
  const [showModalAdd, setShowModalAdd] = React.useState(false);
  const [showModalDelete, setShowModalDelete] = React.useState(false);
  const [modalSuccesUpdate, setModalSuccesUpdate] = useState(false);
  const [modalSuccesDelete, setModalSuccesDelete] = useState(false);
  const [modalSuccesAdd, setModalSuccesAdd] = useState(false);
  const [lat, setLat] = React.useState(-6.178368);
  const [long, setLong] = React.useState(106.825321);

  React.useEffect(() => {
    getAddress();
  }, []);

  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );

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

  const onDeleteAddress = () => {
    let data = {
      mp_customer_address_id: idAddress,
    };
    axiosInstance
      .post(`profile/address/delete`, data)
      .then(res => {
        console.log(res.data.message);
        setShowModalDelete(false);
        setModalSuccesDelete(true);
        handleClose();
        getAddress();
      })
      .catch(error => {
        console.error('error getAddress', error);
      });
  };

  const onSubmitAddressChange = () => {
    let data = {
      mp_customer_address_id: idAddress,
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
    axiosInstance
      .post(`profile/address/update`, data)
      .then(res => {
        setShowModalChangeAddress(false);
        setShowModalAdd(false);
        setModalSuccesUpdate(true);
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
        setModalSuccesUpdate(true);
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

  const handleChangeAddress = address => {
    setIdAddress(address.id);
    setAddress(address.address);
    setAddressName(address.address_name);
    setCityValue(address.city);
    setProvinceValue(address.province);
    setReceiverName(address.receiver_name);
    setReceiverPhone(address.receiver_phone);
    setSubdistrictValue(address.subdistrict);
    setIsMain(address.is_main);
    setPostalCode(address.postal_code);
    setShowModalAdd(true);
    if (address.lat) {
      setLat(address.lat);
    }
    if (address.lng) {
      setLong(address.lng);
    }
  };

  const handleDeleteAddress = address => {
    setIdAddress(address.id);
    setAddress(address.address);
    setAddressName(address.address_name);
    setCityValue(address.city);
    setProvinceValue(address.province);
    setReceiverName(address.receiver_name);
    setReceiverPhone(address.receiver_phone);
    setSubdistrictValue(address.subdistrict);
    setIsMain(address.is_main);
    setPostalCode(address.postal_code);
    setShowModalDelete(true);
  };

  return (
    <>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="small" color={'orange'} />
        </View>
      ) : (
        <ScrollView>
          {addressList.length > 0 ? (
            addressList.map((item, index) => {
              return (
                <View
                  style={{
                    backgroundColor: '#fff',
                    marginBottom: 10,
                  }}
                  key={index}>
                  <View style={{marginHorizontal: 10, marginVertical: 10}}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: convertCSS(
                          themeSetting.h5_typography.font_size,
                        ),
                      }}>
                      {item.receiver_name}
                    </Text>
                    <Text>{item.receiver_phone}</Text>
                    <Text
                      style={{
                        marginTop: 10,
                        fontWeight: 'bold',
                        fontSize: convertCSS(
                          themeSetting.h5_typography.font_size,
                        ),
                      }}>
                      {item.address_name}
                    </Text>
                    <Text>
                      {`${item.address}, ${item.subdistrict}, ${item.city}, ${item.province}, ${item.postal_code}`}
                    </Text>
                    <View
                      style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                      <TouchableOpacity
                        onPress={() => handleChangeAddress(item)}>
                        <Text
                          style={{
                            color: themeSetting?.accent_color?.value,
                            fontWeight: 'bold',
                            fontSize: convertCSS(
                              themeSetting.h5_typography.font_size,
                            ),
                          }}>
                          Ubah
                        </Text>
                      </TouchableOpacity>
                      <Text
                        style={{marginHorizontal: 10, color: colors.pasive}}>
                        |
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteAddress(item)}>
                        <Text
                          style={{
                            color: themeSetting?.accent_color?.value,
                            fontWeight: 'bold',
                            fontSize: convertCSS(
                              themeSetting.h5_typography.font_size,
                            ),
                          }}>
                          Hapus
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('../../../assets/images/help_banner.png')}
                style={{
                  width: WIDTH,
                  height: WIDTH / 2,
                  resizeMode: 'contain',
                }}
              />
              <Text style={{fontSize: 16, fontWeight: '700'}}>
                Belum ada Alamat
              </Text>
            </View>
          )}
          <CustomButton
            onPress={() => setShowModalAdd(true)}
            style={{
              height: 44,
              width: '95%',
              alignSelf: 'center',
              marginTop: 12,
            }}
            primary
            title="Tambah Alamat Baru"
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

          <Modal isVisible={showModalDelete}>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                paddingVertical: 16,
                paddingHorizontal: 14,
              }}>
              <Text style={{textAlign: 'center'}}>Hapus Alamat Ini ?</Text>
              <View>
                <View style={{display: 'flex'}}>
                  <Text style={{fontWeight: 'bold'}}>{receiverName}</Text>
                  <Text>{receiverPhone}</Text>
                </View>
                <View style={{display: 'flex', marginVertical: 10}}>
                  <Text style={{fontWeight: 'bold'}}>{addressName}</Text>
                </View>
                <View style={{display: 'flex'}}>
                  <Text>{address} </Text>
                </View>
              </View>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: '30%',
                  marginTop: 10,
                }}>
                <TouchableOpacity onPress={() => setShowModalDelete(false)}>
                  <Text
                    style={{
                      color: colors?.danger,
                      fontWeight: 'bold',
                      fontSize: convertCSS(
                        themeSetting.h5_typography.font_size,
                      ),
                    }}>
                    Batal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDeleteAddress(true)}>
                  <Text
                    style={{
                      color: themeSetting?.accent_color?.value,
                      fontWeight: 'bold',
                      fontSize: convertCSS(
                        themeSetting.h5_typography.font_size,
                      ),
                    }}>
                    Hapus
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <CustomAlert
            modalVisible={modalSuccesAdd}
            setModalVisible={setModalSuccesAdd}
            message={'Berhasil Tambah Alamat'}
          />
          <CustomAlert
            modalVisible={modalSuccesUpdate}
            setModalVisible={setModalSuccesUpdate}
            message={'Berhasil Ubah Alamat'}
          />
          <CustomAlert
            modalVisible={modalSuccesDelete}
            setModalVisible={setModalSuccesDelete}
            message={'Berhasil hapus Alamat'}
          />
        </ScrollView>
      )}
    </>
  );
};

const Styles = StyleSheet.create({
  icon: {
    position: 'relative',
    marginLeft: -30,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerTitle: {
    marginVertical: 10,
    marginHorizontal: 10,
    alignSelf: 'flex-start',
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  inputPassword: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
  },

  label: {
    marginHorizontal: 10,
    alignSelf: 'flex-start',
    fontSize: 14,
  },
  labelForgetPass: {
    marginHorizontal: 10,
    marginTop: 10,
    alignSelf: 'flex-end',
    fontSize: 14,
  },
  button: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
export default SettingAddress;
