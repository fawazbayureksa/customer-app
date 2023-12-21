import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import React from 'react';
import {
  HambergerMenu,
  SearchNormal1,
  Sms,
  ShoppingCart,
} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import convertCSS from '../../../helpers/convertCSS';
import Components from '../Components';

const WIDTH = Dimensions.get('window').width;

export default function Footer({theme, footer}) {
  const {navigate} = useNavigation();
  return (
    <>
      {footer &&
        footer.map((section, index) => {
          return (
            <View
              key={index}
              style={{
                backgroundColor: section.style.background_color,
                height: convertCSS(section.style.height),
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
                        }}>
                        {row &&
                          row.columns.map((column, index) => {
                            return (
                              <View
                                key={index}
                                style={{
                                  // backgroundColor: 'green',
                                  flex: 1,
                                  // width: WIDTH,
                                  //   flexDirection: 'row',
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
                                  alignItems: column.style?.column_alignment,
                                }}>
                                {column &&
                                  column.components.map((component, index) => {
                                    return (
                                      <View key={index}>
                                        <Components
                                          component={component}
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
