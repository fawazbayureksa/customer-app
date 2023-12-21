import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidStyle,
  AndroidImportance,
  EventType,
} from '@notifee/react-native';

export const pushNotification = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);

    const channelId = await notifee.createChannel({
      id: 'notification',
      name: 'notification',
      importance: AndroidImportance.HIGH,
    });

    notifee.onBackgroundEvent(async ({type, detail}) => {
      console.log('set')
      // const {notification, pressAction} = detail;
      // // if (type === 1) {
      // messaging().setBackgroundMessageHandler(async remoteMessage => {
      //   console.log(
      //     'Notification caused app to open from background state:',
      //     remoteMessage.notification,
      //   );
      //   if (remoteMessage.data.image_path) {
      //     await notifee.displayNotification({
      //       title: remoteMessage.data.title,
      //       body: remoteMessage.data.body,
      //       android: {
      //         channelId,
      //         style: {
      //           type: AndroidStyle.BIGPICTURE,
      //           picture: remoteMessage.data.image_path,
      //         },
      //       },
      //     });
      //   } else {
      //     await notifee.displayNotification({
      //       title: remoteMessage.data.title,
      //       body: remoteMessage.data.body,
      //       android: {
      //         channelId,
      //       },
      //     });
      //   }
      // });
      // }
      // Check if the user pressed the "Mark as read" action
      // if (
      //   type === EventType.ACTION_PRESS &&
      //   pressAction.id === 'mark-as-read'
      // ) {
      //   // Update external API
      //   await fetch(
      //     `https://my-api.com/chat/${notification.data.chatId}/read`,
      //     {
      //       method: 'POST',
      //     },
      //   );

      //   // Remove the notification
      //   await notifee.cancelNotification(notification.id);
      // }
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('remote message setBackgroundMessageHandler', remoteMessage);
      if (remoteMessage.data.image_path) {
        await notifee.displayNotification({
          title: remoteMessage.data.title,
          body: remoteMessage.data.body,
          android: {
            channelId,
            style: {
              type: AndroidStyle.BIGPICTURE,
              picture: remoteMessage.data.image_path,
            },
          },
        });
      } else {
        await notifee.displayNotification({
          title: remoteMessage.data.title,
          body: remoteMessage.data.body,
          android: {
            channelId,
          },
        });
      }
    });

    messaging().onMessage(async remoteMessage => {
      console.log('remote message onMessage', remoteMessage);
      if (remoteMessage.data.image_path) {
        await notifee.displayNotification({
          title: remoteMessage.data.title,
          body: remoteMessage.data.body,
          android: {
            channelId,
            style: {
              type: AndroidStyle.BIGPICTURE,
              picture: remoteMessage.data.image_path,
            },
          },
        });
      } else {
        await notifee.displayNotification({
          title: remoteMessage.data.title,
          body: remoteMessage.data.body,
          android: {
            channelId,
          },
        });
      }
    });

    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });
  }
};
