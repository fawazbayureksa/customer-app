import {Button, Dimensions, TouchableOpacity, Text} from 'react-native';
import React from 'react';
import convertCSS from '../../../../helpers/convertCSS';

const WIDTH = Dimensions.get('window').width;

export default function Submit({data, appearance, getValue}) {
  console.log(data);
  return (
    <TouchableOpacity
      style={{
        width: WIDTH * 0.8,
        justifyContent: 'center',
        backgroundColor: data?.setting_value.background_color,
        height: convertCSS(data?.setting_value.height),
        alignItems: 'center',
        borderRadius: 6,
      }}>
      <Text
        style={{
          fontSize: convertCSS(data.setting_value.font_size),
          fontWeight: JSON.stringify(
            convertCSS(data.setting_value.font_weight),
          ),
          color:data.setting_value.color
        }}>
        {data.setting_value.text}
      </Text>
      {/* <Button
        title={data.setting_value.text}
        color={data.setting_value.color}
        style={{backgroundColor: data.setting_value.background_color}}
      /> */}
    </TouchableOpacity>
  );
}
