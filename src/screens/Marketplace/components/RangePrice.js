import { View, Text } from 'react-native';
import React from 'react';
import { TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Currency from '../../../helpers/Currency';

export default function RangePrice({ filter, onChangeFilter }) {
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );
  const { t } = useTranslation();

  const onChange = (key, value) => {
    onChangeFilter(key, value);
  };

  return (
    <View
      style={{
        marginVertical: 7,
      }}>
      <Text style={{ fontWeight: '700', fontSize: 18, color: '#404040', marginVertical: 5 }}>{t('common:price')}</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TextInput
          style={{ width: '45%', height: 30, fontSize: 12 }}
          label="Terendah"
          mode="outlined"
          value={Currency(filter.min_price)}
          onChangeText={text => onChange('min_price', text)}
          theme={{ colors: { primary: themeSetting?.accent_color?.value } }}
          left={<TextInput.Affix text="Rp" />}
        />
        <TextInput
          style={{ width: '45%', height: 30, fontSize: 12 }}
          label="Tertinggi"
          mode="outlined"
          value={Currency(filter.max_price)}
          onChangeText={text => onChange('max_price', text)}
          theme={{ colors: { primary: themeSetting?.accent_color?.value } }}
          left={<TextInput.Affix text="Rp" />}
        />
      </View>
    </View>
  );
}
