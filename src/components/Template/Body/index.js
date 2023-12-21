import { View, Dimensions, Text, ImageBackground } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import convertCSS from '../../../helpers/convertCSS';
import Components from '../Components';

const WIDTH = Dimensions.get('window').width * 0.95;

export default function Body({ data }) {
  const { navigate } = useNavigation();
  return (
    <>
      {data &&
        data.map((section, index) => {
          return (
            <View
              key={index}
              style={{
                backgroundColor:
                  section.style.background_transparent === 'color'
                    ? section.style.background_color
                      ? section.style.background_color
                      : 'unset'
                    : 'transparent',
                height: convertCSS(section.style.height),
                borderRadius: 3,
                marginTop: convertCSS(section.style.margin_top),
                marginRight: convertCSS(section.style.margin_right),
                marginBottom: convertCSS(section.style.margin_bottom),
                marginLeft: convertCSS(section.style.margin_left),
                padding: 8,
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
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}>
                        {row &&
                          row.columns.map((column, index) => {
                            if (column.style.background_image != '') {
                              return (
                                <ImageBackground
                                  source={{
                                    uri: column.style.background_image,
                                  }}
                                  resizeMode="cover"
                                  key={index}
                                  style={{
                                    flex: 1,
                                    backgroundColor:
                                      column.style.background_color,
                                    maxWidth:
                                      (column.width_numerator /
                                        column.width_denominator) *
                                      WIDTH,
                                    // backgroundColor: 'green',
                                    // width: '100%',
                                    // width:
                                    //   (column.width_numerator /
                                    //     column.width_denominator) *
                                    //   WIDTH,
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
                                    alignItems:
                                      column.style?.column_alignment,
                                  }}>
                                  {column &&
                                    column.components.map(
                                      (component, index) => {
                                        return (
                                          <View
                                            key={index}
                                            style={{
                                              backgroundColor:
                                                component.style
                                                  .background_color,
                                              flex: 1,
                                              width: '100%',
                                              // width:
                                              //   (column.width_numerator /
                                              //     column.width_denominator) *
                                              //   WIDTH,
                                            }}>
                                            {/* <Text>{component.type}</Text> */}
                                            <Components
                                              component={component}
                                              width={
                                                (column.width_numerator /
                                                  column.width_denominator) *
                                                WIDTH
                                              }
                                            />
                                          </View>
                                        );
                                      },
                                    )}
                                </ImageBackground>
                              )
                            }
                            else {
                              return (
                                <View
                                  key={index}
                                  style={{
                                    flex: 1,
                                    backgroundColor:
                                      column.style.background_color,
                                    maxWidth:
                                      (column.width_numerator /
                                        column.width_denominator) *
                                      WIDTH,
                                    // backgroundColor: 'green',
                                    // width: '100%',
                                    // width:
                                    //   (column.width_numerator /
                                    //     column.width_denominator) *
                                    //   WIDTH,
                                    flexDirection:
                                      column.style?.content_layout == 'block'
                                        ? 'column'
                                        : column.style?.content_layout,
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
                                    alignItems:
                                      column.style?.column_alignment,
                                  }}>
                                  {column &&
                                    column.components.map(
                                      (component, index) => {
                                        return (
                                          <View
                                            key={index}
                                            style={{
                                              backgroundColor:
                                                component.style
                                                  .background_color,
                                              flex: 1,
                                              width: '100%',
                                              // width:
                                              //   (column.width_numerator /
                                              //     column.width_denominator) *
                                              //   WIDTH,
                                            }}>
                                            {/* <Text>{component.type}</Text> */}
                                            <Components
                                              component={component}
                                              width={
                                                (column.width_numerator /
                                                  column.width_denominator) *
                                                WIDTH
                                              }
                                            />
                                          </View>
                                        );
                                      },
                                    )}
                                </View>
                              )
                            }
                          })
                        }
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
