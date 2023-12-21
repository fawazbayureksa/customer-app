import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'react-native-paper';

export default function SellerArea({
  area,
  style,
  onChangeFilter,
  themeSetting,
  filter,
}) {
  const { t } = useTranslation();

  const onChangeArea = value => {
    onChangeFilter('area', value);
  };

  return (
    <View style={{ ...style }}>
      <Text style={{ fontWeight: '700', fontSize: 18, color: '#404040', marginVertical: 5 }}>Area</Text>
      <TouchableOpacity onPress={() => onChangeArea('')}
        style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Checkbox
          status={filter.area== '' ? 'checked' : 'unchecked'}
          onPress={() => onChangeArea('')}
          color="#FA9E25"
        />
        <Text
          style={{
            ...styles.text,
            color: '#404040'
          }}>
          {t('common:allArea')}
        </Text>
      </TouchableOpacity>
      {area.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => onChangeArea(item.value)}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                status={filter.area === item.value ? 'checked' : 'unchecked'}
                onPress={() => onChangeArea(item.value)}
                color="#FA9E25"
              />
              <Text
                style={{
                  ...styles.text,
                  color: '#404040'
                }}>
                {item.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  text: { marginVertical: 3 },
});
