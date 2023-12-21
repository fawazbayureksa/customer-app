import {View, Text, Dimensions} from 'react-native';
import React from 'react';
import {Shadow} from 'react-native-shadow-2';
import {useTranslation} from 'react-i18next';
import CustomButton from '../../../../components/CustomButton';
import Currency from '../../../../helpers/Currency';

const WIDTH = Dimensions.get('window').width;
export default function Summary(props) {
  const {t} = useTranslation();
  return (
    <View style={{marginTop: 20}}>
      <Shadow distance={3} startColor={'#00000010'} radius={8}>
        <View
          style={{
            width: WIDTH,
            backgroundColor: '#fff',
            borderRadius: 6,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: 'rgba(10, 0, 0, 0.1)',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
          }}>
          <Text style={{fontWeight: '500'}}>{t('common:summary')}</Text>
          <View style={{marginVertical: 16}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>{t('common:totalPrice')}</Text>
              <Text>Rp {Currency(props.totalPrice)}</Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>{t('common:totalDiscount')}</Text>
              <Text>Rp {Currency(props.totalDiscount)}</Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>{t('common:totalPayment')}</Text>
              <Text>Rp {Currency(props.totalPrice - props.totalDiscount)}</Text>
            </View>
          </View>
          <CustomButton
            loading={props.loadingSubmit}
            onPress={props.onBuy}
            disabled={props.loadingSubmit}
            primary
            title={t('common:buy')}
          />
        </View>
      </Shadow>
    </View>
  );
}
