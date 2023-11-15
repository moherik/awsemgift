import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { useTheme } from "react-native-paper";

import Transaction from "../components/Transaction";
import Menu from "../components/Menu";
import History from "../components/History";

const Tab = createMaterialBottomTabNavigator();

export default function MainScreen() {
  const theme = useTheme();

  return (
    <Tab.Navigator theme={theme}>
      <Tab.Screen
        name="Transaction"
        options={{ title: "Kirim", tabBarIcon: "gift-outline" }}
        component={Transaction}
      />
      <Tab.Screen
        name="History"
        options={{ title: "Riwayat", tabBarIcon: "history" }}
        component={History}
      />
      <Tab.Screen
        name="Menu"
        options={{ title: "Menu", tabBarIcon: "menu" }}
        component={Menu}
      />
    </Tab.Navigator>
  );
}
