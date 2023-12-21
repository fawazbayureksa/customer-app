/**
 * @format
 */
 import React from 'react';
 import {AppRegistry} from 'react-native';
 import App from './App';
 import {name as appName} from './app.json';
 import notifee, {AndroidImportance} from '@notifee/react-native';
 import messaging from '@react-native-firebase/messaging';
 
 messaging().setBackgroundMessageHandler(async remoteMessage => {
   console.log('Message handled in the background!', remoteMessage);
   const channelId = await notifee.createChannel({
     id: 'notification',
     name: 'notification',
     importance: AndroidImportance.HIGH,
   });
   notifee.displayNotification({
     title: remoteMessage.data.title,
     body: remoteMessage.data.message,
     android: {
       channelId,
       pressAction: {
         launchActivity: 'default',
         id: 'default',
       },
     },
   });
 });
 
 function HeadlessCheck({isHeadless}) {
   if (isHeadless) {
     // App has been launched in the background by iOS, ignore
     return null;
   }
 
   return <App />;
 }
 
 AppRegistry.registerComponent(appName, () => HeadlessCheck);
 