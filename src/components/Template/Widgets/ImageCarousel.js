import { View, Text, ScrollView, Image, Dimensions } from 'react-native';
import React from 'react';
import AutoHeightImage from 'react-native-auto-height-image';
import convertCSS from '../../../helpers/convertCSS';

const WIDTH = Dimensions.get('window').width;

export default function ImageCarousel({ data }) {
  // console.log(data);
  return (
    <ScrollView horizontal={true}>
      {data.images.length > 0 &&
        data.images.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                paddingRight: convertCSS(data.padding_right),
                paddingTop: convertCSS(data.padding_top),
                paddingleft: convertCSS(data.padding_left),
                paddingBottom: convertCSS(data.padding_bottom),
              }}>

              <AutoHeightImage
                width={(WIDTH / data.max_columns) * 0.95}
                source={{ uri: item.src }}
              />
            </View>
          );
        })}
    </ScrollView>
  );
}
