import { useEffect, useState } from "react";
import { AppRegistry, useColorScheme } from "react-native";
import {
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
  Appbar,
} from "react-native-paper";
import { name as appName } from "./app.json";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { supabase } from "./lib/supabase";

import theme from "./theme/red";

import HomeScreen from "./screen/HomeScreen";
import PaymentScreen from "./screen/PaymentScreen";
import AccountScreen from "./screen/AccountScreen";
import TopupScreen from "./screen/TopupScreen";
import TransferSaldoScreen from "./screen/TransferSaldoScreen";
import CashoutScreen from "./screen/CashoutScreen";
import ScanQRScreen from "./screen/ScanQRScreen";
import AddContactScreen from "./screen/AddContactScreen";
import ContactDetailScreen from "./screen/ContactDetailScreen";
import ReportDetailScreen from "./screen/ReportDetailScreen";
import LoginScreen from "./screen/LoginScreen";
import RegisterScreen from "./screen/RegisterScreen";
import InboxScreen from "./screen/InboxScreen";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);

  async function onSignout() {
    await supabase.auth.signOut();
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
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
      <PaperProvider theme={combinedTheme}>
        <NavigationContainer theme={combinedTheme}>
          {session && session.user ? (
            <Stack.Navigator>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  title: "AwsemPay",
                  header: (props) => (
                    <Appbar.Header
                      style={{
                        backgroundColor: combinedTheme.colors.primaryContainer,
                      }}
                    >
                      <Appbar.Content title={props.options.title} />
                      <Appbar.Action icon="logout" onPress={onSignout} />
                    </Appbar.Header>
                  ),
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
                name="Account"
                component={AccountScreen}
                options={{ title: "Akun Saya" }}
              />
              <Stack.Screen
                name="Topup"
                component={TopupScreen}
                options={{ title: "Topup Saldo" }}
              />
              <Stack.Screen
                name="TransferSaldo"
                component={TransferSaldoScreen}
                options={{ title: "Transfer Saldo" }}
              />
              <Stack.Screen
                name="Cashout"
                component={CashoutScreen}
                options={{ title: "Tarik Tunai" }}
              />
              <Stack.Screen
                name="ScanQR"
                component={ScanQRScreen}
                options={{ title: "Scan QRCode" }}
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
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

AppRegistry.registerComponent(appName, () => App);
