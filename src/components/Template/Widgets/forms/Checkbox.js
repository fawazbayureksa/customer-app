import {View, Text} from 'react-native';
import React, {useState} from 'react';
import CheckBox from '@react-native-community/checkbox';

export default function CheckboxComponent({data, appearance, getValue}) {
  const [datas, setDatas] = useState(data.setting_value.options);
  const [selected, setSelected] = useState([]);

  const handleChange = e => {
    console.log(e);
    let temp = datas.map(data => {
      if (e === data.value) {
        return {...data, isChecked: !data.isChecked};
      }
      return data;
    });
    setDatas(temp);
    setSelected(temp.filter(data => data.isChecked));
    getValue(data.id, selected)
  };

  return (
    <>
      {data.setting_value.options &&
        datas.map((item, index) => {
          return (
            <View
              key={index}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <CheckBox
                value={item.isChecked}
                onValueChange={() => handleChange(item.value)}
              />
              <Text>{item.label}</Text>
            </View>
          );
        })}
    </>
  );
}
