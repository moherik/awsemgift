import { useEffect, useRef, useState } from "react";
import { AppRegistry, Platform, useColorScheme } from "react-native";
import {
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
} from "react-native-paper";
import { name as appName } from "./app.json";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { StatusBar } from "expo-status-bar";
import * as Network from "expo-network";
import Toast from "react-native-root-toast";

import theme from "./theme/custom";

import HomeScreen from "./screen/HomeScreen";
import PaymentResultScreen from "./screen/PaymentResultScreen";
import LoginScreen from "./screen/LoginScreen";
import RegisterScreen from "./screen/RegisterScreen";
import InboxScreen from "./screen/InboxScreen";
import HistoryDetailScreen from "./screen/HistoryDetailScreen";
import FavoriteScreen from "./screen/FavoriteScreen";
import ProfileScreen from "./screen/ProfileScreen";
import PaymentWebviewScreen from "./screen/PaymentWebviewScreen";

import CustomProvider from "./components/CustomProvider";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const Stack = createNativeStackNavigator();

export default function App() {
  const colorScheme = useColorScheme();

  GoogleSignin.configure();

  useEffect(() => {
    async function checkConnection() {
      const conn = await Network.getNetworkStateAsync();
      if (!conn.isConnected) {
        Toast.show("Tidak ada koneksi internet");
      } else {
        console.log("CONNECTED");
      }
    }

    checkConnection();
  });

  const combinedTheme =
    colorScheme === "dark"
      ? {
          ...MD3DarkTheme,
          ...DarkTheme,
          colors: { ...DarkTheme.colors, ...theme.colors.dark },
        }
      : {
          ...MD3LightTheme,
          ...LightTheme,
          colors: { ...LightTheme.colors, ...theme.colors.light },
        };

  return (
    <PaperProvider theme={combinedTheme}>
      <GestureHandlerRootView
        style={{
          flex: 1,
          backgroundColor: theme.colors[colorScheme].background,
        }}
      >
        <RootSiblingParent>
          <BottomSheetModalProvider>
            <CustomProvider>
              <NavigationContainer theme={combinedTheme}>
                <Stack.Navigator>
                  <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                      title: "AwsemGift",
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="PaymentWebView"
                    component={PaymentWebviewScreen}
                    options={{
                      title: "Pembayaran",
                    }}
                  />
                  <Stack.Screen
                    name="PaymentResult"
                    component={PaymentResultScreen}
                    options={{
                      title: "Sukses",
                      headerShown: false,
                      presentation: "fullScreenModal",
                    }}
                  />
                  <Stack.Screen
                    name="GiftDetail"
                    component={HistoryDetailScreen}
                    options={({ route }) => ({
                      title:
                        route.params?.item?.orderDetail?.productData?.name ||
                        "Detail",
                    })}
                  />
                  <Stack.Screen
                    name="Favorite"
                    component={FavoriteScreen}
                    options={{ title: "Produk Favorit" }}
                  />

                  <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                      title: "Profil",
                      headerShown: false,
                      presentation: "fullScreenModal",
                    }}
                  />
                  <Stack.Screen
                    name="Inbox"
                    component={InboxScreen}
                    options={{ title: "Inbox" }}
                  />
                  <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ title: "Masuk" }}
                  />
                  <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ title: "Daftar" }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </CustomProvider>
          </BottomSheetModalProvider>
        </RootSiblingParent>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
