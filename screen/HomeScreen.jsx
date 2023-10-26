import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { useTheme } from "react-native-paper";

import Transaction from "../components/Transaction";
import Menu from "../components/Menu";
import Contact from "../components/Contact";

const Tab = createMaterialBottomTabNavigator();

export default function MainScreen() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: theme.colors.primaryContainer },
      }}
    >
      <Tab.Screen
        name="Transaction"
        options={{ title: "Kirim", tabBarIcon: "gift" }}
        component={Transaction}
      />
      <Tab.Screen
        name="Contact"
        options={{ title: "Kontak", tabBarIcon: "account-multiple" }}
        component={Contact}
      />
      <Tab.Screen
        name="Menu"
        options={{ title: "Menu", tabBarIcon: "menu" }}
        component={Menu}
      />
    </Tab.Navigator>
  );
}
