import {View, Text, TouchableOpacity, Dimensions, Linking} from 'react-native';
import React from 'react';
import convertCSS from '../../../helpers/convertCSS';
import {useNavigation} from '@react-navigation/native';
import {Origin} from '@env';
import {MainRouteName} from '../../../constants/mainRouteName';
import getSlug from '../../../helpers/getSlug';
import getUrl from '../../../helpers/getUrl';

const WIDTH = Dimensions.get('window').width * 0.95;

export default function ButtonWidget({data}) {
  const {navigate} = useNavigation();

  return (
    <View style={{margin: 5}}>
      <TouchableOpacity
        onPress={() => {
          data?.value?.url.includes(Origin) ||
          !data?.value?.url.includes('https') ||
          !data?.value?.url.includes('http')
            ? navigate(MainRouteName.CUSTOM_PAGE, {
                url: getSlug(data?.value?.url),
              })
            : Linking.openURL(getUrl(data?.value?.url));
        }}
        style={{
          backgroundColor: data?.value?.background_color,
          height: convertCSS(data?.value?.height),
          width: convertCSS(data?.value?.width, WIDTH),
          justifyContent: 'center',
          alignItems: 'center',
          padding: 5,
          borderWidth:
            data?.value?.border_width == ''
              ? 1
              : convertCSS(data?.value?.border_width),
          borderColor: data?.value?.border_color,
          borderRadius: 5,
        }}>
        <Text
          style={{
            color: data?.value?.color,
            fontSize:
              data?.value?.font_size == ''
                ? 16
                : convertCSS(data?.value?.font_size),
            fontWeight: '500',
          }}>
          {data?.value?.text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
