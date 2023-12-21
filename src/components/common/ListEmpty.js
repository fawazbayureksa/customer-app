import { View, Text, Image, Dimensions } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const WIDTH = Dimensions.get('window').width;
export default function ListEmpty() {
  const { t } = useTranslation();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        style={{
          width: WIDTH * 0.7,
          height: WIDTH * 0.7,
          resizeMode: 'contain',
        }}
        source={require('../../assets/images/productNotFound.png')}
      />
      <Text style={{ fontWeight: '600', fontSize: 18 }}>
        {t('common:productNotFound')}
      </Text>
      <Text>{t('common:searchOther')}</Text>
    </View>
  );
}
