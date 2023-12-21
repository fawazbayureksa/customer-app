import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import Carousel, {Pagination} from 'react-native-snap-carousel';

const WIDTH = Dimensions.get('window').width;

export default function Slider({type, sliderItem, width}) {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const _renderBannerItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        // onPress={() => params.onBannerClick(item)}
        style={{width: width, paddingHorizontal: 5, paddingBottom: 8}}>
        <View style={styles.bannerItemImageBackground}>
          <Image
            source={{uri: item.filename ? item.filename : null}}
            style={{
              ...StyleSheet.absoluteFillObject,
              resizeMode: 'cover',
              borderRadius: 8,
              height: width * 0.4,
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {type == 'type_1' && (
        <View style={{height: width*0.4}}>
          <Carousel
            data={sliderItem}
            renderItem={_renderBannerItem}
            sliderWidth={width}
            itemWidth={width}
            hasParallaxImages={true}
            firstItem={1}
            loop={true}
            autoplay={true}
            autoplayDelay={500}
            autoplayInterval={3000}
            onSnapToItem={index => setActiveBannerIndex(index)}
          />
          {/* <Pagination
            dotsLength={sliderItem.length}
            activeDotIndex={activeBannerIndex}
            containerStyle={{
              paddingVertical: 5,
            }}
            dotContainerStyle={{
              marginTop: -150,
            }}
            dotColor={'#fff'}
            dotStyle={styles.dotStyle}
            inactiveDotColor={'#A6A6A6'}
            inactiveDotScale={1}
          /> */}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  bannerItemContainer: {
    width: WIDTH,
    paddingHorizontal: 5,
    paddingBottom: 8,
  },
  bannerItemImageBackground: {
    flex: 1,
    marginBottom: Platform.OS == 'ios' ? 0 : -1,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: 8,
    height: 150,
  },
  dotStyle: {
    width: 8,
    height: 8,
    margin: 0,
    borderRadius: 4,
  },
});
