import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ProductCarousel from '../../../../components/Template/Widgets/ProductCarousel';
import { MarketplaceRouteName } from '../../../../constants/marketplace_route/marketplaceRouteName';

export default function RelatedProducts({ products, navigation }) {
  const { t } = useTranslation();

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        {/* <Text style={{fontWeight: '500'}}>{t('common:moreFromSeller')}</Text> */}
        <Text style={{ color: '#404040', fontWeight: '700', marginBottom: 5, fontSize: 16 }}>
          {t('common:relatedProduct')}
        </Text>
        <Text style={{ color: '#404040', fontWeight: '700', marginBottom: 5, fontSize: 16 }}>
          {t('auction:seeAll')}
        </Text>
      </View>
      <View style={{ marginVertical: 10 }}>
        <ProductCarousel
          products={products}
          type="related"
          productPerPage={2}
          navigation={navigation}
          onPress={() => {
            navigation.push(MarketplaceRouteName.PRODUCT_DETAIL);
          }}
        />
      </View>
    </View>
  );
}
