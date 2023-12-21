import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shadow } from 'react-native-shadow-2';
import { RadioButton } from 'react-native-paper';

const WIDTH = Dimensions.get('window').width;

export default function CardPayment({
  fontSize,
  data,
  setSelectedPayment,
  selectedPayment,
}) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={{ marginTop: 20 }}
      onPress={() => setSelectedPayment(data.key)}>
      <Shadow distance={3} startColor={'#00000010'} radius={8}>
        <View
          style={{
            width: WIDTH * 0.95,
            backgroundColor: selectedPayment == data.key ? '#FFAA1125' : '#fff',
            borderRadius: 6,
            padding: 12,
            borderWidth: 1,
            borderColor: 'rgba(10, 0, 0, 0.1)',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
          }}>
          <View
            style={{
              marginVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}>

            <RadioButton status={selectedPayment == data.key  ? 'checked' : 'unchecked'} color="#F8931D" />
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
        </View>
      </Shadow>
    </TouchableOpacity>
  );
}
