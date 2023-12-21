import {View, Image, Dimensions, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import axiosInstance from '../../helpers/axiosInstance';

const WIDTH = Dimensions.get('window').width;

const GetMedia = ({filename, style, selectedImage, folder}) => {
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState('');

  useEffect(() => {
    setLoading(true);
    let params = {
      folder,
      filename,
    };
    let url = 'images/getPublicUrl';
    axiosInstance
      .get(url, {params})
      .then(response => {
        setUrl(response.data);
      })
      .catch(error => console.log('error GetMedia', error.response.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View
      style={{
        padding: 2,
        borderWidth: filename == selectedImage ? 1 : 0,
        borderColor: themeSetting?.accent_color?.value,
        borderRadius: 5,
      }}>
      {loading ? (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator
            size="small"
            color={themeSetting?.accent_color?.value}
          />
        </View>
      ) : (
        <Image
          source={{uri: url}}
          style={{
            width: WIDTH * 0.2,
            height: WIDTH * 0.2,
            alignSelf: 'center',
            marginRight: 4,
            borderRadius: 5,
            ...style,
          }}
        />
      )}
    </View>
  );
};

export default GetMedia;
