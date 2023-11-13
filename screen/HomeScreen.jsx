import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { useTheme } from "react-native-paper";

import Transaction from "../components/Transaction";
import MyGift from "../components/MyGift";
import Menu from "../components/Menu";

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
        options={{ title: "Kirim", tabBarIcon: "gift-outline" }}
        component={Transaction}
      />
      <Tab.Screen
        name="MyGift"
        options={{ title: "Hadiah", tabBarIcon: "gift-open-outline" }}
        component={MyGift}
      />
      <Tab.Screen
        name="Menu"
        options={{ title: "Menu", tabBarIcon: "menu" }}
        component={Menu}
      />
    </Tab.Navigator>
  );
}
