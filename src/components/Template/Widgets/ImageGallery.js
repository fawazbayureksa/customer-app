import {View, Text, Image, Dimensions, FlatList} from 'react-native';
import React from 'react';
import {IMAGE_URL} from '@env';
import AutoHeightImage from 'react-native-auto-height-image';

const WIDTH = Dimensions.get('window').width * 0.95;

export default function ImageGallery({data}) {
  const flatListRef = React.useRef();

  return (
    <View style={{flexDirection: 'row', marginVertical: 10}}>
      <FlatList
        ref={flatListRef}
        nestedScrollEnabled={true}
        columnWrapperStyle={
          data?.value?.layout === 'grid'
            ? {justifyContent: 'space-between'}
            : null
        }
        data={data.value.images}
        numColumns={
          data?.value?.layout === 'grid' ? data?.value?.number_of_column : 1
        }
        keyExtractor={item => item.id}
        renderItem={({item}) =>
          data?.value?.layout === 'grid' ? (
            <View style={{width: WIDTH / data?.value?.number_of_column,
            padding: 5,}}>
              <AutoHeightImage
                style={{
                  margin: data?.value?.column_spacing,
                  borderWidth: data?.value?.border_type === 'border' ? 1 : 0,
                  // borderColor: 'red',
                  borderRadius: 8,
                }}
                width={(WIDTH / data?.value?.number_of_column) * 0.95}
                source={{uri: item.src}}
              />
            </View>
          ) : (
            // <Image
            //   source={{
            //     uri: `${item?.src}`,
            //   }}
            //   style={{
            //     margin: data?.value?.column_spacing,
            //     borderWidth: data?.value?.border_type === 'border' ? 1 : 0,
            //     borderColor: 'red',
            //     resizeMode: 'cover',
            //     borderRadius: 8,
            //     width: WIDTH / data?.value?.number_of_column,
            //     height: WIDTH / data?.value?.number_of_column,
            //   }}
            // />
            <Image
              source={{
                uri: `${item?.src}`,
              }}
              style={{
                resizeMode: 'cover',
                borderRadius: 8,
                width: WIDTH,
                height: WIDTH,
              }}
            />
          )
        }
      />
    </View>
  );
}
