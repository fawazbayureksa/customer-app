import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import { IMAGE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import { MainRouteName } from '../../../constants/mainRouteName';
import { WebinarRouteName } from '../../../constants/webinar_route/webinarRouteName';
import { ForumRouteName } from '../../../constants/forum_route/forumRouteName';
import { AuctionRouteName } from '../../../constants/auction_route/auctionRouteName';
import getUrl from '../../../helpers/getUrl';
import { MarketplaceRouteName } from '../../../constants/marketplace_route/marketplaceRouteName';
import { useSelector } from 'react-redux';

export default function IconWidget({ data, type, index }) {
  const { navigate } = useNavigation();
  const selectedBottomNavbar = useSelector(
    state => state.themeReducer.selectedBottomNavbar,
  );
  const themeSetting = useSelector(
    state => state.themeReducer?.themeSetting?.theme,
  );

  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
  const navigateTo = () => {

    if (data.value.redirect_link != '') {
      //MARKETPLACE
      if (data.value.redirect_link.includes('cart')) {
        navigate(MarketplaceRouteName.CART);
      } else if (
        data.value.redirect_link.includes('account-settings/my-orders')
      ) {
        navigate(MarketplaceRouteName.ORDER_LIST);
      } else if (
        data.value.redirect_link.includes('account-settings/wishlist')
      ) {
        navigate(MarketplaceRouteName.WISHLIST);
      } else if (data.value.redirect_link.includes('products')) {
        navigate(MarketplaceRouteName.PRODUCTS);
      } else if (data.value.redirect_link.includes('checkout-order')) {
        navigate(MarketplaceRouteName.CHECKOUT);
      } else if (data.value.redirect_link.includes('product/')) {
        let url = data.value.redirect_link;
        let slug = url.replace('product/', '');
        if (slug[0] == '/') {
          slug = slug.substring(1);
        }
        let index = slug.indexOf('/');
        navigate(MarketplaceRouteName.PRODUCT_DETAIL, {
          product: {
            mp_seller: { slug: slug.substring(0, index) },
            slug: slug.split('/')[1],
          },
        });
      }

      //FORUM
      else if (data.value.redirect_link.includes('forum/my/list')) {
        navigate(ForumRouteName.FORUMLIST);
      } else if (data.value.redirect_link.includes('forum/my')) {
        navigate(ForumRouteName.MY_FORUM);
      }

      //AUCTION
      else if (data.value.redirect_link.includes('auction/my')) {
        navigate(AuctionRouteName.HOME_AUCTION);
      }

      //WEBINAR
      else if (data.value.redirect_link.includes('webinar/dashboard')) {
        navigate(WebinarRouteName.WEBINAR_DASHBOARD);
      }

      //main
      else if (data.value.redirect_link.includes('login')) {
        navigate(MainRouteName.LOGIN);
      } else if (data.value.redirect_link.includes('notification')) {
        navigate(MainRouteName.NOTIFICATION);
      } else if (data.value.redirect_link.includes('register')) {
        navigate(MainRouteName.REGISTER);
      } else if (data.value.redirect_link.includes('account-settings')) {
        if (isLoggedIn) navigate(MainRouteName.ACCOUNT);
        else navigate(MainRouteName.LOGIN);
      } else if (data.value.redirect_link.includes('article/')) {
        navigate(MainRouteName.DETAIL_ARTICLE, {
          article: data.value.redirect_link
            .replace('article/', '')
            .replace('/', ''),
        });
      }

      //ELSE
      else if (
        data.value.redirect_link.includes('https') ||
        data.value.redirect_link.includes('http')
      ) {
        Linking.openURL(getUrl(data.value.redirect_link));
      } else {
        navigate(MainRouteName.CUSTOM_PAGE, {
          url: data.value.redirect_link,
        });
      }
    }
  };
  return (
    <TouchableOpacity
      onPress={navigateTo}
      style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Image
        style={{
          resizeMode: 'contain',
          width: 20,
          height: 20,
          // maxHeight: convertCSS(component.value.max_height),
          // maxWidth: convertCSS(component.value.max_width),
        }}
        source={{
          uri: index == selectedBottomNavbar ? data.value.image_active ? `${IMAGE_URL}public/cms/${data.value.image_active}` : `${IMAGE_URL}public/cms/${data.value.image}` : `${IMAGE_URL}public/cms/${data.value.image}`,
        }}
      />
      {type === 'bottom' && (
        <Text style={{ fontSize: 10, marginTop: 1, color: index == selectedBottomNavbar ? themeSetting?.accent_color?.value : '#A6A6A6' }}>{data.value.text}</Text>
      )}
    </TouchableOpacity>
  );
}
