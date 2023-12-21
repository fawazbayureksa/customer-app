import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  StyleSheet,
} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Modal from 'react-native-modal';
import {Divider} from '../../../../components/Divider';
import colors from '../../../../assets/theme/colors';
import CustomButton from '../../../../components/CustomButton';
import {Checkbox} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import axiosInstance from '../../../../helpers/axiosInstance';

const WIDTH = Dimensions.get('window').width;

export default function ModalChangeAddress(props) {
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );
  const {t} = useTranslation();
  const [provinceOpen, setProvinceOpen] = React.useState(false);
  const [provinceItem, setProvinceItem] = React.useState([]);
  const [provinceValue, setProvinceValue] = React.useState(
    props.mainAddress.province,
  );
  const [districtOpen, setDistrictOpen] = React.useState(false);
  const [districtItem, setDistrictItem] = React.useState([]);
  const [districtValue, setDistrictValue] = React.useState(
    props.mainAddress.city,
  );
  const [subdistrictOpen, setSubdistrictOpen] = React.useState(false);
  const [subdistrictItem, setSubdistrictItem] = React.useState([]);
  const [subdistrictValue, setSubdistrictValue] = React.useState(
    props.mainAddress.subdistrict,
  );

  const [addressNoChanged, setAddressNoChanged] = React.useState(
    props.mainAddress,
  );

  useEffect(() => {
    getProvince();
    // setProvinceValue(props.mainAddress.province);
    // setDistrictValue(props.mainAddress.city);
    // setSubdistrictValue(props.mainAddress.subdistrict);
  }, []);

  useEffect(() => {
    if (!provinceValue) return;
    props.onChangeValueMainAddress('province', provinceValue);
    getCity();
  }, [provinceValue]);

  useEffect(() => {
    if (!districtValue) return;
    props.onChangeValueMainAddress('city', districtValue);

    if (addressNoChanged.city !== districtValue) {
      let postalCode = districtItem.find(x => x.value == districtValue).data
        .postal_code;
      props.onChangeValueMainAddress('postal_code', postalCode);
      props.onChangeValueMainAddress('city', districtValue);
    }

    getSubdistrict();
  }, [districtValue]);

  useEffect(() => {
    if (!subdistrictValue) return;
    props.onChangeValueMainAddress('subdistrict', subdistrictValue);
  }, [subdistrictValue]);

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
      mp_province_name: provinceValue,
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
      mp_city_name: districtValue,
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
    <Modal isVisible={props.showModalChangeAddress}>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 10,
          paddingVertical: 16,
          paddingHorizontal: 14,
        }}>
        <ScrollView>
          <Text style={{fontWeight: '500', fontSize: 16}}>
            {t('common:changeAddress')}
          </Text>
          <Divider />
          <View style={styles.containerRow}>
            <TextInput
              placeholder={t('common:addressName')}
              style={styles.textInput}
              value={props.mainAddress.address_name}
              onChangeText={text =>
                props.onChangeValueMainAddress('address_name', text)
              }
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                margin: 3,
              }}>
              <Checkbox
                status={props.mainAddress.is_main ? 'checked' : 'unchecked'}
                onPress={() => {
                  props.onChangeValueMainAddress('is_main', !props.mainAddress.is_main);
                }}
                color={themeSetting?.accent_color?.value}
              />
              <Text>{t('common:setMainAddress')}</Text>
            </View>
          </View>

          <View style={styles.containerRow}>
            <TextInput
              placeholder={t('common:receiverName')}
              style={styles.textInput}
              value={props.mainAddress.receiver_name}
              onChangeText={text =>
                props.onChangeValueMainAddress('receiver_name', text)
              }
            />
            <TextInput
              placeholder={t('common:receiverPhone')}
              style={styles.textInput}
              value={props.mainAddress.receiver_phone}
              onChangeText={text =>
                props.onChangeValueMainAddress('receiver_phone', text)
              }
            />
          </View>

          <View style={styles.containerRow}>
            <View style={{flex: 1, margin: 3}}>
              <DropDownPicker
                zIndex={1000}
                open={provinceOpen}
                items={provinceItem}
                setOpen={setProvinceOpen}
                value={props.mainAddress.province}
                setValue={setProvinceValue}
                listMode="SCROLLVIEW"
                placeholder={t('common:chooseProvince')}
                placeholderStyle={{color: 'grey'}}
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

            <View style={{flex: 1, margin: 3}}>
              <DropDownPicker
                zIndex={1000}
                open={districtOpen}
                items={districtItem}
                setOpen={setDistrictOpen}
                value={props.mainAddress.city}
                setValue={setDistrictValue}
                listMode="SCROLLVIEW"
                placeholder={t('common:chooseCity')}
                placeholderStyle={{color: 'grey'}}
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
          </View>

          <View style={styles.containerRow}>
            <View style={{flex: 1, margin: 3}}>
              <DropDownPicker
                zIndex={900}
                open={subdistrictOpen}
                items={subdistrictItem}
                setOpen={setSubdistrictOpen}
                value={props.mainAddress.subdistrict}
                setValue={setSubdistrictValue}
                listMode="SCROLLVIEW"
                placeholder={t('common:chooseDistrict')}
                placeholderStyle={{color: 'grey'}}
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
            <TextInput
              placeholder={t('common:postalCode')}
              style={styles.textInput}
              value={props.mainAddress.postal_code}
              onChangeText={text =>
                props.onChangeValueMainAddress('postal_code', text)
              }
            />
          </View>

          <TextInput
            placeholder={t('common:address')}
            style={{...styles.textInput, textAlignVertical: 'top'}}
            multiline
            numberOfLines={4}
            value={props.mainAddress.address}
            onChangeText={text =>
              props.onChangeValueMainAddress('address', text)
            }
          />

          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <CustomButton
              onPress={() => {
                props.setMainAddress(addressNoChanged);
                props.setShowModalChangeAddress(false);
              }}
              style={{
                width: '20%',
                alignSelf: 'flex-end',
                marginTop: 12,
                borderColor: colors.pasive,
                margin: 4,
              }}
              secondary
              border
              color="#000"
              title={t('common:cancel')}
            />
            <CustomButton
              onPress={props.onSubmitAddressChange}
              style={{
                width: '20%',
                alignSelf: 'flex-end',
                marginTop: 12,
                borderColor: colors.pasive,
              }}
              primary
              title={t('common:change')}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 0.7,
    flex: 1,
    margin: 3,
    borderColor: colors.pasive,
    borderRadius: 6,
  },
  containerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
});
