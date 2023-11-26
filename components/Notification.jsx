import React, { createContext, useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";

import api from "../lib/api";
import useAuth from "../hooks/useAuth";

export const NotificationContext = createContext({});

export default function NotificationProvider({ children }) {
  const notificationListener = useRef();
  const responseListener = useRef();
  const auth = useAuth();

  async function sendDeviceToken(token) {
    if (!auth.userData) return false;

    try {
      await api.post("general/device-token", { token });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => sendDeviceToken(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [auth.userData]);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    token = (await Notifications.getDevicePushTokenAsync()).data;

    return token;
  }

  return (
    <NotificationContext.Provider value={notificationListener}>
      {children}
    </NotificationContext.Provider>
  );
}
