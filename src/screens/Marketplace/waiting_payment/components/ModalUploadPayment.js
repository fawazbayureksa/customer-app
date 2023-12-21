import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import Modal from 'react-native-modal';
import {Divider} from '../../../../components/Divider';
import colors from '../../../../assets/theme/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomButton from '../../../../components/CustomButton';
import axiosInstance from '../../../../helpers/axiosInstance';
import handleImageLibrary from '../../../../helpers/handleImageLibrary';
import {useToast} from 'react-native-toast-notifications';

const WIDTH = Dimensions.get('window').width;

export default function ModalUploadPayment(props) {
  const {t} = useTranslation();

  const toast = useToast();

  const [bankItems, setBankItems] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState({});

  useEffect(() => {
    getBank();
  }, []);

  const getBank = () => {
    axiosInstance
      .get(`my-orders/getBanks`)
      .then(res => {
        let data = res.data.data;
        console.log(data);
        setBankItems(convertToDropdown(data));
      })
      .catch(error => {
        console.error('error getBank', error.response.data);
      });
  };

  const convertToDropdown = data => {
    let converted = [];

    data.forEach(item => {
      converted.push({
        value: item.id,
        label: item.name,
        data: item,
      });
    });
    return converted;
  };

  const onImagePicker = async () => {
    setUploading(true);
    await handleImageLibrary()
      .then(res => {
        console.log(res);
        props.setPaymentProof(res.url);
        setImage(res);
      })
      .catch(err => {
        console.log('err upload ', err.response.data);
        console.log('err upload ', err);
        if (err.response.data) {
          toast.show(err.response.data.error.message, {
            type: 'warning',
          });
        } else {
          toast.show('Something went wrong, try agin', {
            type: 'warning',
          });
        }
      })
      .finally(() => setUploading(false));
  };

  return (
    <Modal isVisible={props.showUploadModal}>
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
              {t('common:uploadPayment')} {props.invoice}
            </Text>
            <TouchableOpacity onPress={() => props.setShowUploadModal(false)}>
              <Text style={{fontWeight: '500', fontSize: 18}}>X</Text>
            </TouchableOpacity>
          </View>
          <Divider />
          <View style={styles.container}>
            <Text>Payment Proof</Text>
            <TouchableOpacity
              disabled={uploading}
              onPress={onImagePicker}
              style={{
                flexDirection: 'row',
                marginTop: 5,
                borderColor: colors.pasive,
                borderWidth: 1,
                borderRadius: 8,
              }}>
              <TextInput
                editable={false}
                style={{
                  color: '#000',
                  flex: 1,
                }}
                value={image?.url}
              />
              <View
                style={{
                  backgroundColor: colors.pasive,
                  flex: 0.2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderTopRightRadius: 8,
                  borderBottomRightRadius: 8,
                }}>
                <Text>Browse</Text>
              </View>
            </TouchableOpacity>
            {props.errors.paymenProof !== '' && (
              <Text style={{color: colors.danger}}>
                {props.errors.paymenProof}
              </Text>
            )}
            {image.uri && (
              <Image
                source={{uri: image.uri}}
                style={{
                  borderRadius: 8,
                  marginTop: 10,
                  height: WIDTH * 0.5,
                  resizeMode: 'contain',
                }}
              />
            )}
          </View>

          <View style={styles.container}>
            <Text>Account Name</Text>
            <TextInput
              style={{
                color: '#000',
                borderWidth: 1,
                borderColor: colors.pasive,
                flex: 1,
                borderRadius: 8,
              }}
              value={props.accoutName}
              onChangeText={text => props.setAccountName(text)}
            />
            {props.errors.accountName !== '' && (
              <Text style={{color: colors.danger}}>
                {props.errors.accountName}
              </Text>
            )}
          </View>

          <View style={styles.container}>
            <Text>Account Number</Text>
            <TextInput
              style={{
                color: '#000',
                borderWidth: 1,
                borderColor: colors.pasive,
                flex: 1,
                borderRadius: 8,
              }}
              value={props.accoutNumber}
              onChangeText={text => props.setAccountNumber(text)}
            />
            {props.errors.accountNumber !== '' && (
              <Text style={{color: colors.danger}}>
                {props.errors.accountNumber}
              </Text>
            )}
          </View>

          <View style={styles.container}>
            <Text>Bank</Text>
            <DropDownPicker
              zIndex={1000}
              open={openDropdown}
              items={bankItems}
              setOpen={setOpenDropdown}
              value={props.bankValue}
              setValue={props.setBankValue}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
              style={{
                borderWidth: 1,
                width: '100%',
                borderColor: colors.pasive,
              }}
              dropDownContainerStyle={{
                borderWidth: 1,
                width: '100%',
                height: 90,
                borderColor: colors.pasive,
              }}
            />
            {props.errors.bank !== '' && (
              <Text style={{color: colors.danger}}>{props.errors.bank}</Text>
            )}
          </View>

          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginTop: 20,
              marginBottom: 10,
            }}>
            <CustomButton
              onPress={() => props.setShowUploadModal(false)}
              secondary
              border
              title={t('common:cancel')}
              style={{width: '45%'}}
            />
            <CustomButton
              disabled={uploading || props.loadingSubmit}
              loading={uploading || props.loadingSubmit}
              onPress={props.onSubmit}
              primary
              title={t('common:send')}
              style={{width: '45%'}}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {marginVertical: 10},
});
