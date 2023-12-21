import * as React from 'react';
import { Account, Notifications } from '../screens';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Notification, UserOctagon } from 'iconsax-react-native';
import { MainRouteName } from '../constants/mainRouteName';
import { HomeScreen } from '../screens/index';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const themeSetting = useSelector(
    state => state?.themeReducer?.themeSetting?.theme,
  );
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === MainRouteName.HOME) {
            return (
              <Home
                size={size}
                color={color}
                variant={(iconName = focused ? 'Bold' : 'Outline')}
              />
            );
          } else if (route.name === MainRouteName.NOTIFICATION) {
            return (
              <Notification
                size={size}
                color={color}
                variant={(iconName = focused ? 'Bold' : 'Outline')}
              />
            );
          } else if (route.name === MainRouteName.ACCOUNT) {
            return (
              <UserOctagon
                size={size}
                color={color}
                variant={(iconName = focused ? 'Bold' : 'Outline')}
              />
            );
          }
        },
        tabBarActiveTintColor: themeSetting?.accent_color?.value,
        tabBarInactiveTintColor: '#A6A6A6',
        // headerShown: route.name === ACTIVITY ? true : false,
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 0,
          marginBottom: 1,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: themeSetting?.accent_color?.value,
        },
        headerTitleAlign: 'center',
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontSize: 18,
        },
      })}>
      <Tab.Screen
        name={MainRouteName.HOME}
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: t('navigate:home'),
          headerTitle: t('navigate:home'),
        }}
      />
      <Tab.Screen
        name={MainRouteName.NOTIFICATION}
        component={Notifications}
        options={{
          tabBarLabel: t('navigate:notification'),
          headerTitle: t('navigate:notification'),
        }}
      // listeners={({navigation}) => ({
      //   tabPress: e => {
      //     if (JSON.stringify(data) == '{}' || data == null) {
      //       e.preventDefault();
      //       navigation.navigate(LOGIN);
      //     }
      //   },
      // })}
      />
      <Tab.Screen
        name={MainRouteName.ACCOUNT}
        component={Account}
        options={{
          headerShown: false,
        }}
      // listeners={({navigation}) => ({
      //   tabPress: e => {
      //     if (JSON.stringify(data) == '{}' || data == null) {
      //       e.preventDefault();
      //       navigation.navigate(LOGIN);
      //     }
      //   },
      // })}
      />
    </Tab.Navigator>
  );
}
