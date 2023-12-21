import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../helpers/axiosInstance';
import Carousel from 'react-native-snap-carousel';
import { IMAGE_URL } from '@env';
import Video from 'react-native-video';
import YouTube from 'react-native-youtube';
import RenderHTML from 'react-native-render-html';

const WIDTH = Dimensions.get('window').width * 0.95;

export default function AdvancedSlider({ data }) {
  const [sliderData, setSliderData] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState(null);
  const [quality, setQuality] = useState(null);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLooping, setIsLooping] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [fullscreen, setfullscreen] = useState(false);
  const [height, setHeight] = useState(300);
  const [ActiveBannerIndex, setActiveBannerIndex] = useState();

  useEffect(() => {
    getAdvancedSlider();
  }, []);

  const getAdvancedSlider = () => {
    let params = {
      cms_advanced_slider_id: data.value.cms_advanced_slider_id,
    };
    axiosInstance
      .get('cms/getAdvancedSlider', { params })
      .then(res => {
        setSliderData(res.data.data);
        // console.log(res.data.data.cms_advanced_slider_slides);
      })
      .catch(error => {
        console.error('error getArticle: ', error.response.data);
      });
  };

  const convertHorizontalAlignment = alignment => {
    if (alignment == 'left') {
      return 'flex-start';
    } else if (alignment == 'center') {
      return 'center';
    } else if (alignment == 'right') {
      return 'flex-end';
    }
  };

  const _renderBannerItem = ({ item, index }) => {
    let setting = JSON.parse(item.setting) || {};
    return (
      <>
        <TouchableOpacity
          key={index}
          // onPress={() => params.onBannerClick(item)}
          style={{ width: WIDTH, paddingBottom: 8, flex: 1 }}>
          {item.type == 'image' && (
            <GetMedia filename={setting.background_image} type={item.type} />
          )}
          {item.type == 'video' && (
            <GetMedia
              filename={setting.background_video}
              type={item.type}
              play={index == ActiveBannerIndex}
            />
          )}
          {item.type == 'youtube' && (
            <YouTube
              apiKey="AIzaSyChhsokTy8AYBwL4G73tsn-8e89hwpZHo8"
              videoId="oJTncbC8xZs" // The YouTube video ID
              play={true} // control playback of video with true/false
              fullscreen={false} // control whether the video should play in fullscreen or inline
              loop={true} // control whether the video should loop when ended
              onReady={e => setHeight(200)}
              onChangeState={e => console.log('onChangeState:', e.state)}
              onChangeQuality={e => console.log('onChangeQuality: ', e.quality)}
              onError={e => console.log('onError: ', e.error)}
              style={{
                alignSelf: 'stretch',
                height: height,
                backgroundColor: 'black',
                marginVertical: 10,
              }}
            />
          )}
        </TouchableOpacity>
        <View
          style={{
            alignSelf: convertHorizontalAlignment(
              item.horizontal_content_alignment,
            ),
            marginBottom: 10,
            paddingHorizontal: 10,
          }}>
          <RenderHTML source={{ html: item.content }} contentWidth={10} />
          {/* <Text style={{fontSize: 20}}>sssss</Text> */}
        </View>
      </>
    );
  };

  // console.log(data);
  return (
    <View
      style={{
        // padding: 5,
        marginVertical: 5,
        height: (9 / 16) * WIDTH,
        margin: 5,
      }}>
      <Carousel
        data={sliderData.cms_advanced_slider_slides}
        renderItem={_renderBannerItem}
        sliderWidth={WIDTH}
        itemWidth={WIDTH}
        hasParallaxImages={true}
        firstItem={1}
        loop={true}
        autoplay={false}
        autoplayDelay={500}
        autoplayInterval={3000}
        onSnapToItem={index => setActiveBannerIndex(index)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bannerItemImageBackground: {
    flex: 1,
    marginBottom: Platform.OS == 'ios' ? 0 : -1,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
});

const GetMedia = ({ filename, type, play }) => {
  const [url, setUrl] = useState('');
  const [paused, setPaused] = useState();

  useEffect(() => {
    setPaused(!play);
  }, [play]);

  useEffect(() => {
    let params = {
      folder: 'cms',
      filename: filename,
    };
    let url = 'images/getPublicUrl';
    axiosInstance.get(url, { params }).then(response => {
      setUrl(response.data);
    }).catch(error => {
      console.log('error getImageUrl advance slider', error.response.data);
    });
    // console.log('uri', typeof uri);
  }, []);

  return (
    <>
      {type == 'video' && (
        <TouchableOpacity onPress={() => setPaused(!paused)}>
          <Video
            source={{
              uri: url,
            }}
            paused={paused}
            style={{
              // position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              height: 250,
            }}
            repeat={true}
          />
        </TouchableOpacity>
      )}
      {type == 'image' && (
        <View style={styles.bannerItemImageBackground}>
          <Image
            source={{
              uri: url,
            }}
            style={{
              ...StyleSheet.absoluteFillObject,
              resizeMode: 'cover',
              borderRadius: 8,
              width: WIDTH,
              height: (WIDTH * 9) / 16,
            }}
          />
        </View>
      )}
    </>
  );
};
