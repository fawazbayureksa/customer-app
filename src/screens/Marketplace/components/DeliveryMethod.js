import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'react-native-paper';

export default function DeliveryMethod({
  deliveryMethod,
  onChangeFilter,
  themeSetting,
  filter,
}) {
  const [indexMethod, setIndexMethod] = useState(null);
  const { t } = useTranslation();

  const onChange = value => {
    onChangeFilter('delivery_method', value);
  };

  return (
    <View
      style={{ marginVertical: 4 }}>
      <Text style={{ fontWeight: '700', fontSize: 18, color: '#404040', marginVertical: 5 }}>{t('common:deliveryMethod')}</Text>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          flexDirection: 'row',
        }}
        onPress={() => onChange('')}>
        <Checkbox
          status={filter.delivery_method == '' ? 'checked' : 'unchecked'}
          onPress={() => onChange('')}
          color="#FA9E25"
        />
        <Text
          style={{
            ...styles.textCategory,
            color: '#404040'
          }}>
          {t('common:allMethod')}
        </Text>
      </TouchableOpacity>
      {deliveryMethod.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setIndexMethod(index);
              onChange(item.key);
            }}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                status={filter.delivery_method == item.key ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIndexMethod(index);
                  onChange(item.key);
                }}
                color="#FA9E25"
              />
              <Text
                style={{
                  ...styles.textCategory,
                  color: '#404040'
                }}>
                {item.name}
              </Text>
            </View>
            {indexMethod == index &&
              item.mp_courier_types != null &&
              item?.mp_courier_types?.length > 0 &&
              item.mp_courier_types.map((i, index2) => {
                return (
                  <TouchableOpacity
                    style={{ marginLeft: 25 }}
                    onPress={() => {
                      onChange(i.key);
                    }}
                    key={index2}>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Checkbox
                        status={filter.delivery_method == i.key ? 'checked' : 'unchecked'}
                        onPress={() => {
                          onChange(i.key);
                        }}
                        color="#FA9E25"
                      />
                      <Text
                        style={{
                          ...styles.textCategory,
                          color: '#404040'
                        }}>
                        {i.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  textCategory: { marginVertical: 3 },
});
