import * as React from "react";
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
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import theme from "./theme";

import HomeScreen from "./screen/HomeScreen";
import DetailScreen from "./screen/DetailScreen";
import AddCustomerScreen from "./screen/AddCustomerScreen";
import Saldo from "./components/Saldo";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const Stack = createNativeStackNavigator();

export default function App() {
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
                    <Appbar.Action icon="dots-vertical" onPress={() => {}} />
                  </Appbar.Header>
                ),
              }}
            />
            <Stack.Screen
              name="Detail"
              component={DetailScreen}
              options={({ route }) => ({ title: route.params.title })}
            />
            <Stack.Screen
              name="AddCustomer"
              component={AddCustomerScreen}
              options={{ title: "Tambah Pelanggan" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

AppRegistry.registerComponent(appName, () => App);
