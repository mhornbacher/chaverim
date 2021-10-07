import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { Subscription } from '@unimodules/core';

// tell the OS to show notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function useNotifications() {
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  return useEffect(() => {
    registerForPushNotificationsAsync().then(token => console.log({token}));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => console.log({notification}));
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => console.log({response}));

    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(notificationListener.current);

      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    }
  });
}

async function registerForPushNotificationsAsync() {

  // ensure we are on a physical device
  if (!Constants.isDevice) {
    // alert is ok in this context as we know we are not on a mobile device
    alert('Must use a physical device for Push notifications');
    return;
  }

  // only ask if we don't already have permission
  let { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    status = (await Notifications.requestPermissionsAsync()).status;
  }

  // tell the user there is an issue
  if (status !== 'granted') {
    // TODO: Replace with nice popup
    alert('Without notification permission you will not be able to be notified of incoming calls');
    return;
  }

  // get a cross-platform notification token and return
  return (await Notifications.getExpoPushTokenAsync()).data;
}
