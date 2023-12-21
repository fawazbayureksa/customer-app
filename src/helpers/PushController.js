import React, { Component } from 'react';
import PushNotification from 'react-native-push-notification';
import Firebase from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidStyle, AndroidImportance } from '@notifee/react-native';

export default class PushController extends Component {
  componentDidMount() {
    Firebase.initializeApp(this);
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        let data = {
          token,
          device: 'android',
        };
        AsyncStorage.setItem('tokenFirebase', token.token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onBackgroundEvent: function (notification) {
        console.log('NOTIFICATION:', notification);
        if (notification.data.image_path) {
          notifee.displayNotification({
            title: notification.data.title,
            body: notification.data.body,
            android: {
              channelId,
              style: {
                type: AndroidStyle.BIGPICTURE,
                picture: notification.data.image_path,
              },
            },
          });
        } else {
          notifee.displayNotification({
            title: notification.data.title,
            body: notification.data.body,
            android: {
              channelId,
            },
          });
        }

        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  }

  render() {
    return null;
  }
}
