import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import {
  HambergerMenu,
  SearchNormal1,
  Sms,
  ShoppingCart,
} from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import WidgetMarketplace from './WidgetMarketplace';
import convertCSS from '../../../helpers/convertCSS';

const WIDTH = Dimensions.get('window').width;

export default function BodyProduct({ data, filter, typeName, type }) {
  const { navigate } = useNavigation();
  return (
    <>
      {data &&
        data.map((section, index) => {
          return (
            <View
              key={index}
              style={{
                backgroundColor: section.style.background_transparent === 'color'
                  ? section.style.background_color
                    ? section.style.background_color
                    : 'transparent'
                  : 'transparent',
                height: convertCSS(section.style.height),
                borderRadius: 3,
                // marginTop: convertCSS(section.style.margin_top),
                marginRight: convertCSS(section.style.margin_right),
                marginBottom: convertCSS(section.style.margin_bottom),
                marginLeft: convertCSS(section.style.margin_left),
              }}>
              {section &&
                section.rows.map((row, index) => {
                  return (
                    <View key={index}>
                      <View
                        style={{
                          paddingTop: convertCSS(row.style.padding_top),
                          paddingRight: convertCSS(row.style.padding_right),
                          paddingBottom: convertCSS(row.style.padding_bottom),
                          paddingLeft: convertCSS(row.style.padding_left),
                          // marginTop: convertCSS(row.style.margin_top),
                          marginRight: convertCSS(row.style.margin_right),
                          // marginBottom: convertCSS(row.style.margin_bottom),
                          marginLeft: convertCSS(row.style.margin_left),
                          // flex: 1,
                          // flexDirection: 'row',
                        }}>
                        {row &&
                          row.columns.map((column, index) => {
                            return (
                              <View
                                key={index}
                                style={{
                                  // width:
                                  //   (column.width_numerator /
                                  //     column.width_denominator) *
                                  //   WIDTH,
                                  // // backgroundColor: 'green',
                                  // // width: WIDTH,
                                  // //   flexDirection: 'row',
                                  paddingTop: convertCSS(
                                    column.style?.padding_top,
                                  ),
                                  paddingRight: convertCSS(
                                    column.style?.padding_right,
                                  ),
                                  paddingBottom: convertCSS(
                                    column.style?.padding_bottom,
                                  ),
                                  paddingLeft: convertCSS(
                                    column.style?.padding_left,
                                  ),
                                  // alignItems: column.style?.column_alignment,
                                }}>
                                {column &&
                                  column.components.map((component, index) => {
                                    return (
                                      <View key={index}>
                                        <WidgetMarketplace
                                          component={component}
                                          filter={filter}
                                          type={type}
                                          typeName={typeName}
                                        />
                                      </View>
                                    );
                                  })}
                              </View>
                            );
                          })}
                      </View>
                    </View>
                  );
                })}
            </View>
          );
        })}
    </>
  );
}
