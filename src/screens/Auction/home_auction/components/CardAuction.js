import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { Shadow } from 'react-native-shadow-2';
import { useTranslation } from 'react-i18next';
import GetMedia from '../../../../components/common/GetMedia';
import truncate from '../../../../helpers/truncate';
import { useNavigation } from '@react-navigation/native';
import { AuctionRouteName } from '../../../../constants/auction_route/auctionRouteName';

import convertDate from '../../detail_auction/helpers/convertDate';
import convertTime from '../../detail_auction/helpers/convertTime';
import CountdownComponent from '../../history/components/CountdownComponent';
import Currency from '../../../../helpers/Currency';
import moment from 'moment';

const WIDTH = Dimensions.get('window').width;

export default function CardAuction({ data, index, language }) {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  return (
    <TouchableOpacity
      style={{ marginHorizontal: 8 }}
      onPress={() =>
        navigate(AuctionRouteName.DETAIL_AUCTION, {
          productSlug: data.slug,
          sellerSlug: data?.mp_seller?.slug,
          product_id: data?.id
        })
      }>
      <Shadow distance={3} startColor={'#00000010'} radius={6}>
        <View
          key={index}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            borderRadius: 6,
            padding: 8,
            borderWidth: 1,
            borderColor: 'rgba(10, 0, 0, 0.1)',
            width: WIDTH / 2.3,
          }}>
          <GetMedia
            folder="marketplace/products"
            filename={data?.mp_product_images[0]?.filename}
            style={{
              marginVertical: 10,
              width: WIDTH * 0.25,
              height: WIDTH * 0.25,
            }}
          />
          <View style={{ width: '90%' }}>
            {data?.mp_product_informations.map((item, i) => {
              return (
                <View key={i}>
                  {item.language_code == language && (
                    <Text
                      numberOfLines={1}
                    >{truncate(item.name)}</Text>
                  )}
                </View>
              );
            })}
            <Text numberOfLines={1} style={{ fontSize: 12, color: '#8D8D8D' }}>
              {data?.mp_seller?.city}
            </Text>
            <Text style={{ fontSize: 10, color: '#8D8D8D', marginTop: 10 }}>
              {t('auction:startingPrice')}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '700' }}>Rp {Currency(data.mp_product_skus[0].price)}</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}>
              <Text style={{ fontSize: 12 }}>
                {convertDate(data.active_start_date, data.active_end_date)}
              </Text>
              <Text style={{ fontSize: 12 }}>
                {convertTime(data.active_start_date, data.active_end_date)}
              </Text>
            </View>
            {moment(new Date()).isBetween(moment(data?.active_start_date), moment(data?.active_end_date)) &&
              <CountdownComponent detail={data} t={t} />
            }
          </View>
        </View>
      </Shadow>
    </TouchableOpacity>
  );
}
