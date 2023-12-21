import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import React from 'react';
import GetMedia from '../../../../components/common/GetMedia';
import Icon from 'react-native-vector-icons/MaterialIcons';

const WIDTH = Dimensions.get('window').width;

export default function Seller({
  seller,
  fontSize,
  accentColor,
  t,
  isFollowed,
  onFollow,
}) {
  return (
    <View
      style={{
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <GetMedia
          folder="seller"
          filename={seller?.logo}
          style={{
            width: WIDTH * 0.12,
            height: WIDTH * 0.12,
            backgroundColor: '#A6A6A6',
            borderRadius: 100,
          }}
        />
        <View style={{marginLeft: 10}}>
          <Text style={{fontSize: fontSize, fontWeight: '500'}}>
            {seller?.name}
          </Text>
          <Text
            style={{fontSize: fontSize * 0.8, marginTop: 5, color: '#A6A6A6'}}>
            <Icon name="place" size={12} style={{marginRight: 5}} />
            {seller?.city}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={onFollow}
        style={{
          paddingHorizontal: 18,
          height: 28,
          borderRadius: 5,
          backgroundColor: isFollowed ? accentColor : '#1F1F1F',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: '#fff', fontWeight: '500'}}>
          {isFollowed ? t('common:follow') : t('auction:stopFollow')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
