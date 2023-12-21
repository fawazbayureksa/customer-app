import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';

export default function FloatingButton(props) {
  const themeSetting = useSelector(
    state => state.themeReducer?.themeSetting?.theme,
  );
  return (
    <TouchableOpacity onPress={props.onPress} style={props.style}>
      <View
        style={{
          // borderWidth: 0.5,
          borderColor: 'rgba(10, 0, 0, 0.2)',
          // width: 100,
          height: 35,
          borderRadius: 25,
          justifyContent: 'center',
          alignItems: 'center',

          shadowColor: '#000000',
          shadowOffset: {
            width: 2,
            height: 2,
          },
          shadowOpacity: 0.2,
          shadowRadius: 3.84,
          elevation: 3,
          flexDirection: 'row',
          backgroundColor: themeSetting?.accent_color?.value,
          paddingHorizontal: 30,
        }}>
        <Icon name="tune" size={20} color="#fff" />
        <Text style={{color: '#fff', fontWeight: '500', marginLeft: 5}}>
          Filter
        </Text>
      </View>
    </TouchableOpacity>
  );
}
