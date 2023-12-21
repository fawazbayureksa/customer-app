import {View, Text} from 'react-native';
import React from 'react';

export default function CountBubbles({count}) {
  return (
    <View
      style={{
        backgroundColor: 'red',
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginLeft: -10,
        marginTop: -5,
      }}>
      <Text style={{fontSize: 9, color: '#fff'}}>{count}</Text>
    </View>
  );
}
