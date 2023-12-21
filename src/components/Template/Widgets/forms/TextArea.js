import {View, Text, TextInput, Dimensions} from 'react-native';
import React from 'react';
import convertCSS from '../../../../helpers/convertCSS';

const WIDTH = Dimensions.get('window').width;

export default function TextArea({data, appearance, getValue}) {
  return (
    // <View
    //   style={{
    //     marginVertical: 6,
    //     width: '100%',
    //   }}>
    //   {appearance.label_position === 'above' && data.setting_value.label && (
    //     <Text
    //       style={{
    //         color: appearance.field_label_color,
    //         marginBottom: convertCSS(appearance.form_group_margin_bottom),
    //       }}>
    //       {data.setting_value.label}
    //       {data.setting_value.required_field && (
    //         <Text style={{color: 'red'}}>*</Text>
    //       )}
    //     </Text>
    //   )}
    <TextInput
      style={{
        borderWidth: 1,
        borderRadius: convertCSS(appearance.field_border_radius),
        width: WIDTH * 0.8,
        color: appearance.field_text_color || '#000000',
        backgroundColor: appearance.field_background_color || '#FFFFFF',
        borderColor: appearance.field_border_color || '#000000',
      }}
      placeholder={data.setting_value.placeholder}
      onChangeText={text => getValue(data.id, text)}
      numberOfLines={convertCSS(data.setting_value.text_area_row)}
    />
    //   {appearance.label_position === 'below' && data.setting_value.label && (
    //     <Text
    //       style={{
    //         color: appearance.field_label_color,
    //         marginBottom: convertCSS(appearance.form_group_margin_bottom),
    //       }}>
    //       {data.setting_value.label}
    //       {data.setting_value.required_field && (
    //         <Text style={{color: 'red'}}>*</Text>
    //       )}
    //     </Text>
    //   )}
    // </View>
  );
}
