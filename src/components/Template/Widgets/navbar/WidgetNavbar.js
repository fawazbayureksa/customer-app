import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import axiosInstance from '../../../../helpers/axiosInstance';
import { useNavigation } from '@react-navigation/native';
import { MarketplaceRouteName } from '../../../../constants/marketplace_route/marketplaceRouteName';
import { useDispatch, useSelector } from 'react-redux';
import { MainRouteName } from '../../../../constants/mainRouteName';
import CountBubbles from './CountBubbles';
import { useToast } from 'react-native-toast-notifications';
import { useTranslation } from 'react-i18next';

export default function WidgetNavbar({ data, type, index }) {
  const [url, setUrl] = React.useState('');
  const [countCart, setCountCart] = React.useState(0);
  const [countNotification, setCountNotification] = React.useState(0);
  const navigation = useNavigation();
  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
  const { t } = useTranslation()
  const toast = useToast();
  const dispatch = useDispatch();
  useEffect(() => {
    let params = {
      folder: 'cms',
      filename: data.value.logo,
    };
    let url = 'images/getPublicUrl';
    axiosInstance.get(url, { params }).then(response => {
      setUrl(response.data);
    }).catch(err => {
      console.log('error getPublicUrl', err.response.data);
    });
    if (isLoggedIn) {
      getCounter()
    }
  }, []);

  const navigateTo = () => {
    if (type == 'bottom') {
      dispatch({
        type: 'SET_BOTTOM_NAVBAR',
        payload: index,
      });
    }
    if (!isLoggedIn) {
      toast.show(t('forum:please_login'), {
        placement: 'top',
        type: 'danger',
        animationType: 'zoom-in',
        duration: 3000,
      });
      navigation.navigate(MainRouteName.LOGIN);

    } else if (data.type === 'cart') {
      navigation.navigate(MarketplaceRouteName.CART);
    } else if (data.type === 'notification') {
      navigation.navigate(MainRouteName.NOTIFICATION);
    } else if (data.type === 'order') {
      navigation.navigate(MarketplaceRouteName.ORDER_LIST);
    } else if (data.type === 'wishlist') {
      navigation.navigate(MarketplaceRouteName.WISHLIST);
    } else if (data.type === 'chat') {
      navigation.navigate(MarketplaceRouteName.CHAT_OPTIONS, { data: data.value });
    } else {
      console.log(data.type);
    }
  };

  const getCounter = () => {
    axiosInstance.get('cart/get-counter').then(response => {
      setCountCart(response.data.data);
    }).catch(err => {
      console.log('error get counter', err.response.data);
    });
    axiosInstance.get('notification/getNotificationUnread').then(response => {
      setCountNotification(response.data.data);
    }).catch(err => {
      console.log('error getNotificationUnread', err.response.data);
    });
  }

  return (
    <TouchableOpacity
      onPress={navigateTo}
      style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          style={{
            resizeMode: 'contain',
            width: 25,
            height: 25,
            // maxHeight: convertCSS(component.value.max_height),
            // maxWidth: convertCSS(component.value.max_width),
          }}
          source={{
            uri: url,
          }}
        />
        {data.type == 'cart' && countCart > 0 && (
          <CountBubbles count={countCart} />
        )}
        {data.type == 'notification' && countNotification > 0 && (
          <CountBubbles count={countNotification} />
        )}
      </View>
      {type === 'bottom' && (
        <Text style={{ fontSize: 10, marginTop: 1 }}>{data.value.text}</Text>
      )}
    </TouchableOpacity>
  );
}
