import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Star1 } from 'iconsax-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'react-native-paper';

export default function Rating({ filter, themeSetting, onChangeFilter }) {
  const { t } = useTranslation();

  const onChange = (value) => {
    console.log('rating', value);
    onChangeFilter('rating', value);
  };

  return (
    <View
      style={{
        marginVertical: 7,
      }}>
      <Text style={{ fontWeight: '700', fontSize: 18, color: '#404040', marginVertical: 5 }}>Rating</Text>
      <TouchableOpacity
        onPress={() => onChange('')}
        style={{
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Checkbox
          status={filter.rating == '' ? 'checked' : 'unchecked'}
          onPress={() => onChange('')}
          color="#FA9E25"
        />
        <Text
          style={{
            marginLeft: 5,
            color: '#404040'
          }}>
          {t('common:allRating')}
        </Text>
      </TouchableOpacity>
      {[5, 4, 3].map((item, index) => {
        return (
          <TouchableOpacity
            onPress={() => onChange(item)}
            key={index}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                status={filter.rating == item ? 'checked' : 'unchecked'}
                onPress={() => onChange(item)}
                color="#FA9E25"
              />
              <Text
                style={{
                  marginLeft: 5,
                  color: '#404040'
                }}>
                {item} {t('common:above')}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
