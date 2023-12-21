import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import Home from '../screens/Home/index';
import { MainRouteName } from '../constants/mainRouteName';
import Logout from '../screens/Auth/Logout';
import BottomTabNavigator from './BottomTabNavigator';
import MarketplaceRoute from '../constants/marketplace_route/marketplaceRoute';
import LanguageSelector from '../screens/Home/LanguageSelector';
import {
  CustomPage,
  DetailArticle,
  Login,
  OnTesting,
  Register,
  ForgetPassword,
  CreateNewPassword,
  SettingProfile,
  SettingAddress,
  Account,
  Notifications,
  ChangePassword,
  Membership,
  EmailVerificationSent,
  FriendList,
  Mapbox,
} from '../screens';
import ForumRoute from '../constants/forum_route/forumRoute';
import WebinarRoute from '../constants/webinar_route/webinarRoute';
import AuctionRoute from '../constants/auction_route/auctionRoute';
import { ArrowLeft2 } from 'iconsax-react-native';
import ChatRoute from '../constants/chat_route/ChatRoute';
import Websocket from '../helpers/websocket/Websocket';
import DrsRoute from '../constants/drs_route/drsRoute'

const ArrowBackButton = () => {
  const navigation = useNavigation();

  return (
    <ArrowLeft2
      size="24"
      color="#000"
      onPress={() => {
        navigation.goBack();
      }}
      style={{ marginRight: 10 }}
    />
  );
};

const MainStack = ({ isLoggedIn, navigation }) => (
  <NavigationContainer>
    <Websocket>
      <Stack.Navigator
        initialRouteName={
          // isLoggedIn ? MainRouteName.HOME_NAVIGATOR : MainRouteName.LOGIN
          MainRouteName.HOME
        }>
        <Stack.Screen
          name={MainRouteName.HOME_NAVIGATOR}
          options={{ headerShown: false }}
          component={BottomTabNavigator}
        />
        <Stack.Screen
          name={MainRouteName.LOGIN}
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={MainRouteName.REGISTER}
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={MainRouteName.FORGET_PASSWORD}
          component={ForgetPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={MainRouteName.CREATE_NEW_PASSWORD}
          component={CreateNewPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={MainRouteName.CHANGE_PASSWORD}
          component={ChangePassword}
          options={{
            headerShown: true,
            headerTitle: "Ubah Kata Sandi",
            headerLeft: () => (
              <>
                <ArrowBackButton />
              </>
            )
          }}
        />
        <Stack.Screen
          name={MainRouteName.MEMBERSHIP}
          component={Membership}
          options={{
            headerShown: true,
            headerTitle: "Poin Anda",
            headerLeft: () => (
              <>
                <ArrowBackButton />
              </>
            )
          }}
        />
        <Stack.Screen
          name={MainRouteName.FRIEND_LIST}
          component={FriendList}
          options={{
            headerShown: false,
            headerTitle: "Daftar Teman",
            headerLeft: () => (
              <>
                <ArrowBackButton />
              </>
            )
          }}
        />
        <Stack.Screen
          name={MainRouteName.HOME}
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={MainRouteName.LOGOUT}
          component={Logout}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={MainRouteName.SELECT_LANGUAGE}
          component={LanguageSelector}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={MainRouteName.DETAIL_ARTICLE}
          component={DetailArticle}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={MainRouteName.MAPS}
          component={Mapbox}
        />
        <Stack.Screen
          name={MainRouteName.NOTIFICATION}
          component={Notifications}
          options={{
            // headerShown: false,
            headerLeft: () => (
              <>
                <ArrowBackButton />
              </>
            ),
          }}
        />
        <Stack.Screen
          name={MainRouteName.ON_TESTING}
          component={OnTesting}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={MainRouteName.PROFILE_SETTING}
          component={SettingProfile}
          options={{
            headerShown: true,
            headerTitle: "Pengaturan Profil",
            headerLeft: () => (
              <>
                <ArrowBackButton />
              </>
            )
          }}
        />
        <Stack.Screen
          name={MainRouteName.ADDRESS_SETTING}
          component={SettingAddress}
          options={{
            headerShown: true,
            headerTitle: "Pengaturan Alamat",
            headerLeft: () => (
              <>
                <ArrowBackButton />
              </>
            )
          }}
        />
        <Stack.Screen
          name={MainRouteName.CUSTOM_PAGE}
          component={CustomPage}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={MainRouteName.ACCOUNT}
          component={Account}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={MainRouteName.EMAIL_SENT}
          component={EmailVerificationSent}
          options={{
            headerShown: false,
          }}
        />
        {MarketplaceRoute.map(route => (
          <Stack.Screen
            key={route.path}
            name={route.path}
            component={route.component}
            options={{
              headerShown: route.headerShown,
              headerTitle: route.title,
              headerRight: route.headerRight,
              headerLeft: route.headerLeft,
            }}
          />
        ))}
        {ForumRoute.map(route => (
          <Stack.Screen
            key={route.path}
            name={route.path}
            component={route.component}
            options={{
              headerShown: route.headerShown,
              headerTitle: route.title,
              headerRight: route.headerRight,
              headerLeft: route.headerLeft,
            }}
          />
        ))}
        {WebinarRoute.map(route => (
          <Stack.Screen
            key={route.path}
            name={route.path}
            component={route.component}
            options={{
              headerShown: route.headerShown,
              headerTitle: route.title,
              headerRight: route.headerRight,
              headerLeft: route.headerLeft,
            }}
          />
        ))}
        {AuctionRoute.map(route => (
          <Stack.Screen
            key={route.path}
            name={route.path}
            component={route.component}
            options={{
              headerShown: route.headerShown,
              headerTitle: route.title,
              headerRight: route.headerRight,
              headerLeft: route.headerLeft,
            }}
          />
        ))}
        {DrsRoute.map(route => (
          <Stack.Screen
            key={route.path}
            name={route.path}
            component={route.component}
            options={{
              headerShown: route.headerShown,
              headerTitle: route.title,
              headerRight: route.headerRight,
              headerLeft: route.headerLeft,
            }}
          />
        ))}
        {ChatRoute.map(route => (
          <Stack.Screen
            key={route.path}
            name={route.path}
            component={route.component}
            options={{
              headerShown: route.headerShown,
              headerTitle: route.title,
              headerRight: route.headerRight,
              headerLeft: route.headerLeft,
            }}
          />
        ))}
      </Stack.Navigator>
    </Websocket>
  </NavigationContainer>
);

export default MainStack;
