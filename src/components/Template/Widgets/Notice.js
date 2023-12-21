import {View, Dimensions} from 'react-native';
import React from 'react';
import RenderHtml from 'react-native-render-html';
import Icon from 'react-native-vector-icons/FontAwesome';

const WIDTH = Dimensions.get('window').width;

export default function Notice({component}) {
  const getBackgroundColor = type => {
    if (type === 'general') {
      return '#17A2B8';
    } else if (type === 'warning') {
      return '#FFC107';
    } else if (type === 'notice') {
      return '#fff';
    }
  };
  return (
    <View
      style={{
        backgroundColor: getBackgroundColor(component.type),
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        flex: 1,
        borderRadius: 8,
      }}>
      <Icon
        style={{marginRight: 5}}
        name="exclamation-circle"
        size={24}
        color="#000"
      />
      <RenderHtml source={{html: component.content}} contentWidth={10} />
    </View>
  );
}
