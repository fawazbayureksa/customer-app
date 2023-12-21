import {View, Text, Dimensions} from 'react-native';
import React from 'react';
import DashedLine from 'react-native-dashed-line';
import convertCSS from '../../../helpers/convertCSS';

const WIDTH = Dimensions.get('window').width;

export default function Separator({data}) {
  const getWidth = width => {
    if (width.includes('%')) {
      let number = parseInt(width.replace(/\D/g, ''));
      return (parseInt(number) / 100) * WIDTH;
    } else if (width == '') {
      return WIDTH * 0.9;
    } else {
      return WIDTH * 0.9;
    }
  };

  const getThickness = type => {
    if (
      type == 'single_border_solid' ||
      type == 'single_border_dashed' ||
      type == 'single_border_dotted' ||
      type == 'double_border_dotted'
    ) {
      return 4;
    } else if (
      type == 'double_border_solid' ||
      type == 'double_border_dashed'
    ) {
      return 10;
    }
  };

  return (
    <View
      style={{
        alignSelf: 'center',
        width: getWidth(data?.value?.width),
        marginTop: convertCSS(data?.value?.margin_top),
        marginRight: convertCSS(data?.value?.margin_right),
        marginBottom: convertCSS(data?.value?.margin_bottom),
        marginLeft: convertCSS(data?.value?.margin_left),
      }}>
      {data?.value?.type == 'single_border_dotted' ? (
        <>
          <DashedLine
            dashLength={8}
            dashThickness={8}
            dashColor={data.value.color}
            dashGap={getWidth(data?.value?.width) / 50}
            dashStyle={{borderRadius: 50}}
          />
        </>
      ) : data?.value?.type == 'double_border_dotted' ? (
        <>
          <DashedLine
            dashLength={8}
            dashThickness={8}
            dashColor={data.value.color}
            dashGap={getWidth(data?.value?.width) / 50}
            dashStyle={{borderRadius: 50}}
          />
          <DashedLine
            dashLength={8}
            dashThickness={8}
            dashColor={data.value.color}
            dashGap={getWidth(data?.value?.width) / 50}
            dashStyle={{borderRadius: 50}}
          />
        </>
      ) : (
        <DashedLine
          dashLength={
            data.value.type.includes('solid')
              ? getWidth(data?.value?.width)
              : getWidth(data?.value?.width) / 30
          }
          dashThickness={getThickness(data?.value?.type)}
          dashColor={data.value.color}
          dashGap={getWidth(data?.value?.width) / 30}
        />
      )}
    </View>
  );
}
