import {View, Dimensions} from 'react-native';
import React from 'react';

const WIDTH = Dimensions.get('window').width;

export function CustomDivider({style}) {
  return (
    <View
      style={{
        marginVertical: 24,
        height: 8,
        backgroundColor: '#F5F3F3',
        width: WIDTH,
        alignSelf: 'center',
        zIndex: -1000,
        ...style,
      }}
    />
  );
}

export function Divider({style}) {
  return (
    <View
      style={{
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderColor: '#E8E8E8',
        width: '100%',
        marginVertical: 12,
        ...style,
      }}
    />
  );
}
