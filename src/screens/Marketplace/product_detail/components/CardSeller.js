import { View, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { IMAGE_URL } from '@env';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../../../components/CustomButton';
import { MarketplaceRouteName } from '../../../../constants/marketplace_route/marketplaceRouteName';

const WIDTH = Dimensions.get('window').width;
export default function CardSeller({ data, isFollowed, onFollow, navigation }) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
      }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          // height: 100,
          // alignItems: 'center',
        }}
        onPress={() => navigation.push(MarketplaceRouteName.SELLER_PROFILE, { seller_slug: data.slug })}
      >
        <Image
          source={{
            uri: `${IMAGE_URL}public/seller/${data.logo}`,
          }}
          style={{
            flex: 0.7,
            resizeMode: 'contain',
            borderRadius: 3,
            width: '80%',
            height: '80%',
          }}
        />

        <View style={{ flex: 1.5, marginLeft: 10 }}>
          <Text
            style={{
              color: '#404040',
              fontWeight: '500',
              fontSize: 16,
            }}>
            {data.name}
          </Text>
          <View style={{ width: 150 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, backgroundColor: "rgba(255, 172, 75, 0.5)", paddingVertical: 3, borderRadius: 20 }}>
              <Icon
                name="check-circle"
                size={24}
                color="#FA9E25"
                style={{ marginRight: 3 }}
              />
              <Text style={{ color: '#F8931D' }}>Akun Terverifikasi</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
            <Icon name="place" size={14} color="#8D8D8D" />
            <Text style={{ color: '#8D8D8D' }}>{data.city}</Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <CustomButton
            small
            border
            onPress={onFollow}
            style={{ paddingHorizontal: 10 }}
            secondary
            title={t(isFollowed ? 'common:unfollow' : 'common:follow')}
          />
        </View>
      </TouchableOpacity>

      {/* <View
          style={{
            marginVertical: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <CustomButton
            // loading={loading}
            // onPress={onSubmit}
            // disabled={loading}
            style={{ width: WIDTH * 0.4 }}
            secondary
            border
            title={t('common:call')}
          />
          <CustomButton
            // loading={loading}
            onPress={onFollow}
            // disabled={loading}
            style={{ width: WIDTH * 0.4 }}
            primary
            title={t(isFollowed ? 'common:unfollow' : 'common:follow')}
          />
        </View> */}
    </View>
  );
}
