import {View, Text, Dimensions} from 'react-native';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import convertCSS from '../../../../helpers/convertCSS';

const WIDTH = Dimensions.get('window').width;

const datas = [
  {label: 'Laki-laki', value: 'Male'},
  {label: 'Perempuan', value: 'Female'},
  {label: 'Perempu', value: 'Femal'},
  {label: 'Perean', value: 'Fmale'},
];

export default function Select({data, appearance, getValue}) {
  const [items, setItems] = React.useState(data.setting_value.options);
  const [value, setValue] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  return (
    <View
      style={{
        flex: 1,
        height: open ? data.setting_value.options.length * 42 : 42,
      }}>
      <DropDownPicker
        zIndex={1000}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
        style={{
          borderWidth: 1,
          borderRadius: convertCSS(appearance.field_border_radius),
          width: WIDTH * 0.8,
          color: appearance.field_text_color || '#000000',
          backgroundColor: appearance.field_background_color || '#FFFFFF',
          borderColor: appearance.field_border_color || '#000000',
        }}
        containerStyle={{
          width: WIDTH * 0.8,
          zIndex: 1000,
          flex: 1,
        }}
        dropDownContainerStyle={{
          borderWidth: 1,
          borderRadius: convertCSS(appearance.field_border_radius),
          width: WIDTH * 0.8,
          color: appearance.field_text_color || '#000000',
          backgroundColor: appearance.field_background_color || '#FFFFFF',
          borderColor: appearance.field_border_color || '#000000',
        }}
      />
    </View>
  );
}
