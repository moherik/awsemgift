import * as React from "react";
import { AppRegistry, useColorScheme } from "react-native";
import {
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
} from "react-native-paper";
import { name as appName } from "./app.json";
import theme from "./theme";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screen/HomeScreen";

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
          colors: { ...theme.colors.dark, ...DarkTheme.colors },
        }
      : {
          ...MD3LightTheme,
          ...LightTheme,
          colors: { ...theme.colors.light, ...LightTheme.colors },
        };

  return (
    <PaperProvider theme={combinedTheme}>
      <NavigationContainer theme={combinedTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Awsem" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
