import React, {useEffect} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import AuctionWishlist from './components/AuctionWishlist';
import MarketplaceWishlist from './components/MarketplaceWishlist';
import {MainRouteName} from '../../../constants/mainRouteName';

const Tab = createMaterialTopTabNavigator();
export default function Wishlist({navigation}) {
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );

  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
  const {t} = useTranslation();
  useEffect(() => {
    !isLoggedIn && navigation.replace(MainRouteName.LOGIN);
  }, []);
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontWeight: '500'},
        tabBarActiveTintColor: themeSetting?.accent_color?.value,
        tabBarInactiveTintColor: '#A6A6A6',
        tabBarIndicatorStyle: {
          backgroundColor: themeSetting?.accent_color?.value,
        },
      }}>
      <Tab.Screen name={t('common:shop')} component={MarketplaceWishlist} navigation={navigation}/>
      <Tab.Screen
        name={t('auction:auctionProduct')}
        component={AuctionWishlist}
      />
    </Tab.Navigator>
  );
}
