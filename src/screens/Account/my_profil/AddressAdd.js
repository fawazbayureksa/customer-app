import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  StyleSheet,
} from 'react-native';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { Divider } from '../../../components/Divider';
import colors from '../../../assets/theme/colors';
import CustomButton from '../../../components/CustomButton';
import { Checkbox } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import axiosInstance from '../../../helpers/axiosInstance';
import { CloseCircle } from 'iconsax-react-native';
import MapView, { Marker } from 'react-native-maps';
import Mapbox from '../../../components/Mapbox';

const AddressAdd = props => {
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );
  //provinsi
  const [provinceOpen, setProvinceOpen] = React.useState(false);
  const [provinceItem, setProvinceItem] = React.useState([]);
  const [provinceValue, setProvinceValue] = React.useState();
  //
  const [districtOpen, setDistrictOpen] = React.useState(false);
  const [districtItem, setDistrictItem] = React.useState([]);
  const [districtValue, setDistrictValue] = React.useState();
  //
  const [subdistrictOpen, setSubdistrictOpen] = React.useState(false);
  const [subdistrictItem, setSubdistrictItem] = React.useState([]);
  const [subdistrictValue, setSubdistrictValue] = React.useState();

  const windowHeight = Dimensions.get('window').height;

  const [scrollOffset, setScrollOffset] = React.useState(null);

  const { t } = useTranslation();

  const scrollViewRef = React.createRef();

  const handleScrollTo = p => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  const handleOnScroll = event => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  useEffect(() => {
    getProvince();
  }, []);

  useEffect(() => {
    if (!props.provinceValue) {
      setDistrictItem([])
      return
    }
    getCity();
  }, [props.provinceValue]);

  useEffect(() => {
    if (!props.cityValue) {
      setSubdistrictItem([])
      return
    }
    getSubdistrict();
  }, [props.cityValue]);

  const getProvince = () => {
    axiosInstance
      .get(`profile/address/getProvince`)
      .then(res => {
        let data = res.data.data;
        setProvinceItem(convertToDropdown(data));
      })
      .catch(error => {
        console.error('error getProvince', error);
      });
  };

  const getCity = () => {
    let params = {
      mp_province_name: props.provinceValue,
    };
    axiosInstance
      .post(`profile/address/getCityByProvince`, params)
      .then(res => {
        let data = res.data.data;
        setDistrictItem(convertToDropdown(data));
      })
      .catch(error => {
        console.error('error getCity', error);
      });
  };

  const getSubdistrict = () => {
    let params = {
      mp_city_name: props.cityValue,
    };
    axiosInstance
      .post(`profile/address/getSubdistrictByCity`, params)
      .then(res => {
        let data = res.data.data;
        setSubdistrictItem(convertToDropdown(data));
      })
      .catch(error => {
        console.error('error getCity', error);
      });
  };

  const convertToDropdown = data => {
    let converted = [];

    data.forEach(item => {
      converted.push({
        value: item.label,
        label: item.label,
        data: item,
      });
    });
    return converted;
  };

  return (
    <Modal
      isVisible={props.showModalAdd}
      onBackdropPress={() => {
        props.setShowModalAdd(!props.showModalAdd);
        props.handleClose();
      }}
      onBackButtonPress={() => {
        props.setShowModalAdd(!props.showModalAdd);
        props.handleClose();
      }}
      propagateSwipe={true}
      style={Styles.view}
      swipeDirection={['down']}
      scrollTo={handleScrollTo}
      scrollOffset={scrollOffset}
      scrollOffsetMax={300 - 200} // content height - ScrollView height
    >
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 10,
          paddingVertical: 16,
          paddingHorizontal: 14,
          maxHeight: windowHeight * 0.9,
        }}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginBottom: 20,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
            }}>
            {!props.idAddress ? 'Tambahkan Alamat' : 'Ubah Alamat'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              props.setShowModalAdd(!props.showModalAdd);
              props.handleClose();
            }}>
            <CloseCircle size="22" color="#000" variant="Bold" />
          </TouchableOpacity>
        </View>
        <ScrollView
          ref={scrollViewRef}
          onScroll={handleOnScroll}
          scrollEventThrottle={16}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
            }}>
            <Checkbox
              status={props.isMain ? 'checked' : 'unchecked'}
              onPress={() => props.setIsMain(!props.isMain)}
              color={themeSetting?.accent_color?.value}
            />
            <Text>Pilih sebagai alamat utama</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text>Nama Alamat</Text>
            <TextInput
              style={[Styles.input, { borderColor: colors.line }]}
              value={props.addressName}
              onChangeText={text => props.setAddressName(text)}
              placeholder="Nama alamat"
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text>Nama Penerima</Text>
            <TextInput
              style={[Styles.input, { borderColor: colors.line }]}
              value={props.receiverName}
              onChangeText={text => props.setReceiverName(text)}
              placeholder="Nama penerima"
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text>No. Telepon</Text>
            <TextInput
              style={[Styles.input, { borderColor: colors.line }]}
              value={props.receiverPhone}
              onChangeText={text => props.setReceiverPhone(text)}
              placeholder="No Telepon"
            />
          </View>
          <View style={{ flex: 1, marginTop: 10 }}>
            <Text>Provinsi</Text>
            <DropDownPicker
              zIndex={888}
              open={provinceOpen}
              items={provinceItem}
              setOpen={setProvinceOpen}
              value={props.provinceValue}
              setValue={props.setProvinceValue}
              listMode="SCROLLVIEW"
              placeholder={t('common:chooseProvince')}
              placeholderStyle={{ color: 'grey' }}
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
              style={{
                borderWidth: 1,
                borderColor: 'rgba(10, 0, 0, 0.1)',
              }}
              dropDownContainerStyle={{
                borderWidth: 1,
                borderColor: 'rgba(10, 0, 0, 0.1)',
              }}
            />
          </View>
          <View style={{ flex: 1, marginTop: 10 }}>
            <Text>Kota / Kabupaten</Text>
            <DropDownPicker
              zIndex={777}
              open={districtOpen}
              items={districtItem}
              setOpen={setDistrictOpen}
              value={props.cityValue}
              setValue={props.setCityValue}
              listMode="SCROLLVIEW"
              placeholder={t('common:chooseCity')}
              placeholderStyle={{ color: 'grey' }}
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
              style={{
                borderWidth: 1,
                borderColor: 'rgba(10, 0, 0, 0.1)',
              }}
              dropDownContainerStyle={{
                borderWidth: 1,
                borderColor: 'rgba(10, 0, 0, 0.1)',
              }}
            />
          </View>
          <View style={{ flex: 1, marginTop: 10 }}>
            <Text>Kecamatan</Text>
            <DropDownPicker
              zIndex={666}
              open={subdistrictOpen}
              items={subdistrictItem}
              setOpen={setSubdistrictOpen}
              value={props.subdistrictValue}
              setValue={props.setSubdistrictValue}
              listMode="SCROLLVIEW"
              placeholder={t('common:chooseDistrict')}
              placeholderStyle={{ color: 'grey' }}
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
              style={{
                borderWidth: 1,
                borderColor: 'rgba(10, 0, 0, 0.1)',
              }}
              dropDownContainerStyle={{
                borderWidth: 1,
                borderColor: 'rgba(10, 0, 0, 0.1)',
              }}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text>Kode Pos</Text>
            <TextInput
              style={[Styles.input, { borderColor: colors.line }]}
              value={props.postalCode}
              onChangeText={text => props.setPostalCode(text)}
              placeholder="kode pos"
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text>Detail Alamat</Text>
            <TextInput
              style={[Styles.inputDetail, { borderColor: colors.line, textAlignVertical: 'top' }]}
              value={props.address}
              onChangeText={text => props.setAddress(text)}
            />
          </View>
          <Mapbox lat={props.lat} long={props.long} setLat={props.setLat} setLong={props.setLong} />
          <Text style={{ textAlign: 'left', marginLeft: 10 }}>
            {props.lat}, {props.long}
          </Text>
          {!props.idAddress ? (
            <CustomButton
              onPress={props.onSaveAddress}
              style={{
                height: 44,
                width: '100%',
                alignSelf: 'center',
                marginTop: 12,
              }}
              primary
              title="Simpan"
            />
          ) : (
            <CustomButton
              onPress={props.onSubmitAddressChange}
              style={{
                height: 44,
                width: '100%',
                alignSelf: 'center',
                marginTop: 12,
              }}
              primary
              title="Ubah"
            />
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const Styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  view: {
    justifyContent: 'flex-end',
    margin: 0,
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
  inputDetail: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    height: 80,
  },
});

export default AddressAdd;
