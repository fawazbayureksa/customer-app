import { View, Text, Image } from 'react-native';
import React from 'react';
import CustomButton from '../../../../components/CustomButton';
import { useTranslation } from 'react-i18next';
import { MarketplaceRouteName } from '../../../../constants/marketplace_route/marketplaceRouteName';

export default function EmptyCard({ WIDTH, navigation }) {
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
        source={require('../../../../assets/images/empty.png')}
      />
      <Text style={{ fontSize: 18, fontWeight: '700' }}>
        {t('common:emptyCart')}
      </Text>
      <Text style={{ fontSize: 14, marginBottom: 12, color: '#898989' }}>
        Produk yang mereka jual akan tampil di sini
      </Text>
      <CustomButton
        onPress={() => navigation.navigate(MarketplaceRouteName.PRODUCTS, { search: '', type: 'product' })}
        style={{ width: WIDTH * 0.9, marginVertical: 12 }}
        primary
        title={t('common:startShopping')}
      />
    </View>
  );
}