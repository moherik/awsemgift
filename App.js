import { useEffect, useState } from "react";
import { AppRegistry, useColorScheme } from "react-native";
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

import theme from "./theme/custom";
import { getToken } from "./lib/token";

import HomeScreen from "./screen/HomeScreen";
import PaymentScreen from "./screen/PaymentScreen";
import TopupScreen from "./screen/TopupScreen";
import AddContactScreen from "./screen/AddContactScreen";
import ContactDetailScreen from "./screen/ContactDetailScreen";
import ReportDetailScreen from "./screen/ReportDetailScreen";
import LoginScreen from "./screen/LoginScreen";
import RegisterScreen from "./screen/RegisterScreen";
import InboxScreen from "./screen/InboxScreen";

import CustomProvider from "./components/CustomProvider";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const Stack = createNativeStackNavigator();

export default function App() {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    setAuthToken(getToken() || null);
  }, []);

  const colorScheme = useColorScheme();

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootSiblingParent>
        <PaperProvider theme={combinedTheme}>
          <BottomSheetModalProvider>
            <CustomProvider>
              <NavigationContainer theme={combinedTheme}>
                {authToken ? (
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
                      name="Payment"
                      component={PaymentScreen}
                      options={({ route }) => ({ title: route.params.name })}
                    />
                    <Stack.Screen
                      name="AddContact"
                      component={AddContactScreen}
                      options={{ title: "Tambah Kontak" }}
                    />
                    <Stack.Screen
                      name="ContactDetail"
                      component={ContactDetailScreen}
                      options={{ title: "Detail Kontak" }}
                    />
                    <Stack.Screen
                      name="ReportDetail"
                      component={ReportDetailScreen}
                      options={{ title: "Detail Laporan" }}
                    />
                    <Stack.Screen
                      name="Topup"
                      component={TopupScreen}
                      options={{ title: "Topup Saldo" }}
                    />
                    <Stack.Screen
                      name="Inbox"
                      component={InboxScreen}
                      options={{ title: "Inbox" }}
                    />
                  </Stack.Navigator>
                ) : (
                  <Stack.Navigator>
                    <Stack.Screen
                      name="Login"
                      component={LoginScreen}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                  </Stack.Navigator>
                )}
              </NavigationContainer>
            </CustomProvider>
          </BottomSheetModalProvider>
        </PaperProvider>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
}

AppRegistry.registerComponent(appName, () => App);
