import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Checkbox } from 'react-native-paper';

export default function ProductCategory({
  category,
  onChangeFilter,
  themeSetting,
  filter,
}) {
  const [indexCategory, setIndexCategory] = useState(null);
  const [indexSubCategory, setIndexSubCategory] = useState(null);
  const { t } = useTranslation();

  const onChangeCategory = slug => {
    onChangeFilter('category', slug);
  };

  return (
    <View
      style={{
        // backgroundColor: '#F0F6F9',
        marginVertical: 4,
      }}>
      <Text style={{ fontWeight: '700', fontSize: 18, color: '#404040', marginVertical: 5 }}>{t('common:category')}</Text>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={() => {
          onChangeCategory('');
        }}>
        <Checkbox
          status={filter.category == '' ? 'checked' : 'unchecked'}
          onPress={() => {
            onChangeCategory('');
          }}
          color="#FA9E25"
        />
        <Text
          style={{
            ...styles.textCategory,
            color: '#404040'
          }}>
          {t('common:allCategories')}
        </Text>
      </TouchableOpacity>
      {category.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setIndexCategory(index);
              onChangeCategory(item.slug);
            }}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                status={filter.category == item.slug ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIndexCategory(index);
                  onChangeCategory(item.slug);
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
            {indexCategory == index &&
              item.categories != null &&
              item?.categories?.length > 0 &&
              item.categories.map((i, index2) => {
                return (
                  <TouchableOpacity
                    style={{ marginLeft: 25 }}
                    onPress={() => {
                      setIndexSubCategory(index2);
                      onChangeCategory(i.slug);
                    }}>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Checkbox
                        status={filter.category == i.slug ? 'checked' : 'unchecked'}
                        onPress={() => {
                          setIndexSubCategory(index2);
                          onChangeCategory(i.slug);
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
                    {indexSubCategory == index2 &&
                      i.categories != null &&
                      i?.categories?.length > 0 &&
                      i.categories.map((j, index3) => {
                        return (
                          <TouchableOpacity
                            style={{ marginLeft: 10 }}
                            onPress={() => onChangeCategory(j.slug)}>
                            <View
                              style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Checkbox
                                status={filter.category == j.slug ? 'checked' : 'unchecked'}
                                onPress={() => {
                                  onChangeCategory(j.slug)
                                }}
                                color="#FA9E25"
                              />
                              <Text
                                style={{
                                  ...styles.textCategory,
                                  color: '#404040',
                                }}>
                                {j.name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
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
