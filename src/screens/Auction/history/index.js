import React, {useEffect} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import History from './components/History';
import Ongoing from './components/Ongoing';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import { MainRouteName } from '../../../constants/mainRouteName';

const Tab = createMaterialTopTabNavigator();
export default function HistoryAuction({navigation}) {
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );

  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
  useEffect(() => {
    !isLoggedIn && navigation.replace(MainRouteName.LOGIN);
  }, []);
  const {t} = useTranslation();
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
      <Tab.Screen name={t('auction:ongoing')} component={Ongoing} />
      <Tab.Screen name={t('auction:bidHistory')} component={History} />
    </Tab.Navigator>
  );
}
