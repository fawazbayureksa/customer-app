import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RadioButton } from 'react-native-paper';

const WIDTH = Dimensions.get('window').width;

export default function CardPaymentGroup({
  fontSize,
  data,
  setSelectedPayment,
  selectedPayment,
}) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={{
        width: WIDTH * 0.945,
        marginLeft: -16,
        backgroundColor: selectedPayment == data.key ? '#FFAA1125' : '#fff',
        paddingHorizontal: 16,
      }}
      onPress={() => setSelectedPayment(data.key)}>
      <View
        style={{
          marginVertical: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <RadioButton status={selectedPayment == data.key ? 'checked' : 'unchecked'} color="#F8931D" onPress={() => setSelectedPayment(data.key)} />
        <Image
          source={data.filename}
          style={{
            width: 75,
            maxHeight: 75,
            resizeMode: 'contain',
          }}
        />
        <View style={{ width: WIDTH * 0.7, marginLeft: 10 }}>
          <Text style={{ fontSize: fontSize * 1.1, fontWeight: '500' }}>
            {t(`common:${data.key}_title`)}
          </Text>
          <Text style={{ fontSize: fontSize }}>
            {t(`common:${data.key}_desc`)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
