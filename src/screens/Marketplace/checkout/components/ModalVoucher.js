import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { Divider } from '../../../../components/Divider';
import axiosInstance from '../../../../helpers/axiosInstance';
import { IMAGE_URL } from '@env';
import Icon from 'react-native-vector-icons/FontAwesome';
import convertCSS from '../../../../helpers/convertCSS';
import Currency from '../../../../helpers/Currency';
import moment from 'moment';

const WIDTH = Dimensions.get('window').width;

export default function ModalVoucher(props) {
  const [loading, setLoading] = React.useState(false);
  const [vouchers, setVouchers] = React.useState([]);
  const [select, setSelect] = React.useState()
  const [detailOpened, setDetailOpened] = React.useState({});
  const [errorMesssage, setErrorMessage] = React.useState('');
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );
  const fontSize = convertCSS(themeSetting.body_typography.font_size);

  const queryString = require('query-string');
  const { t } = useTranslation();

  useEffect(() => {
    props.modalVoucher && getVoucher();
  }, [props.modalVoucher]);

  const getVoucher = () => {
    setLoading(true);
    axiosInstance
      .get(
        `checkout/getAvailableVouchers?${queryString.stringify({
          cart_ids: props.cartIds,
        })}`,
      )
      .then(res => {
        let data = res.data.data;
        setVouchers(data);
        props.setVouchers(data);
      })
      .catch(error => {
        console.error('error getVoucher', error.response.data);
      })
      .finally(() => setLoading(false));
  };

  const validateVoucher = item => {
    if (select === item.id) {
      props.setSelectedVoucher(0)
      setSelect()
      return
    }
    setLoading(true);
    axiosInstance
      .get(
        `checkout/validateVoucherCode?voucher_customer_ids=${item.id
        }&${queryString.stringify({
          cart_ids: props.cartIds,
        })}`,
      )
      .then(res => {
        props.setSelectedVoucher({
          ...props.selectedVoucher,
          ['selectedVoucher' + item.id]: {
            item: item,
            value:
              props.selectedVoucher['selectedVoucher' + item.id]?.value ==
                'true'
                ? 'false'
                : 'true',
          },
        });
        setSelect(item.id)
        setErrorMessage('');
        // let tempDeleted = props.selectedVoucherId;
        // if (tempDeleted.includes(item.id)) {
        //   tempDeleted.splice(
        //     tempDeleted.findIndex(value => value === item.id),
        //     1,
        //   );
        // } else {
        //   tempDeleted.push(item.id);
        // }

        // props.setSelectedVoucherId([...tempDeleted]);

      })
      .catch(error => {
        // console.error('error getVoucher', error.response.data);
        props.setSelectedVoucher({
          ...props.selectedVoucher,
          ['selectedVoucher' + item.id]: {
            item: item,
            value: 'disabled',
          },
        });
        setErrorMessage(error.response.data.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal isVisible={props.modalVoucher}>
      {loading ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <ActivityIndicator
            size="large"
            color={themeSetting?.accent_color?.value}
          />
        </View>
      ) : (
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 8,
          }}>
          <ScrollView>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: '500', fontSize: fontSize * 1.2 }}>
                Voucher
              </Text>
              <TouchableOpacity onPress={() => props.setModalVoucher(false)}>
                <Text style={{ fontWeight: '500', fontSize: 16 }}>X</Text>
              </TouchableOpacity>
            </View>
            <Divider />
            <Text style={{ fontSize: fontSize }}>
              {t('common:chooseVoucher')}
            </Text>
            {errorMesssage != '' && (
              <View
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  backgroundColor: 'rgba(242, 52, 52,0.8)',
                  borderRadius: 5,
                  marginVertical: 10,
                }}>
                <Text style={{ fontSize: fontSize, color: '#fff' }}>
                  {errorMesssage}
                </Text>
              </View>
            )}
            <View>
              {vouchers.map((item, index) => {
                return (
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() => validateVoucher(item)}
                      style={{
                        borderRadius: 6,
                        padding: 7,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 5,
                        borderColor: themeSetting?.accent_color?.value,
                        borderWidth:
                          props.selectedVoucher['selectedVoucher' + item.id]
                            ?.value == 'true'
                            ? 1.5
                            : 0,
                        opacity:
                          props.selectedVoucher['selectedVoucher' + item.id]
                            ?.value == 'disabled'
                            ? 0.5
                            : 1,
                      }}>
                      <View style={{ flex: 1.5, padding: 5 }}>
                        <Image
                          source={{
                            uri: `${IMAGE_URL}public/marketplace/voucher/${item?.voucher?.image}`,
                          }}
                          style={{
                            resizeMode: 'contain',
                            borderRadius: 5,
                            height: WIDTH * 0.2,
                            width: WIDTH * 0.3,
                          }}
                        />
                      </View>
                      <View style={{ flex: 2 }}>
                        <Text style={{ fontWeight: '500', fontSize: fontSize }}>
                          {item?.voucher?.name}
                        </Text>
                        <Text style={{ fontSize: fontSize, color: 'grey' }}>
                          {item?.voucher?.code}
                        </Text>
                        <Text style={{ fontSize: fontSize * 0.9, color: 'grey' }}>
                          Minimal Pembelian Rp{' '}
                          {item?.voucher?.conditions.map(
                            i => i.type == 'min_purchase' && Currency(i?.value),
                          )}
                        </Text>
                        <Text style={{ fontSize: fontSize * 0.9 }}>
                          Berakhir{' '}
                          {moment(item?.active_end_date).format('DD MM YYYY')}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            setDetailOpened({
                              ...detailOpened,
                              ['detail' + item.id]:
                                detailOpened['detail' + item.id] == 'true'
                                  ? 'false'
                                  : 'true',
                            })
                          }>
                          <Text
                            style={{
                              fontSize: fontSize * 0.9,
                              fontWeight: '500',
                              color: themeSetting?.accent_color?.value,
                            }}>
                            Detail
                          </Text>
                        </TouchableOpacity>
                        {detailOpened['detail' + item.id] == 'true' ? (
                          <Text
                            style={{
                              fontSize: fontSize * 0.9,
                              color: 'grey',
                            }}>
                            {
                              item?.voucher?.informations[0]
                                ?.terms_and_conditions
                            }
                          </Text>
                        ) : null}
                      </View>
                      <Icon
                        name={
                          props.selectedVoucher['selectedVoucher' + item.id]
                            ?.value != 'true'
                            ? 'plus'
                            : 'check'
                        }
                        size={24}
                        color={themeSetting?.accent_color?.value}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}
    </Modal>
  );
}
