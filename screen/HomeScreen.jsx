import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "react-native-paper";

import Transaction from "../components/Transaction";
import Report from "../components/Report";
import Contact from "../components/Contact";

const Tab = createMaterialTopTabNavigator();

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
        options={{ title: "Transaksi" }}
        component={Transaction}
      />
      <Tab.Screen
        name="Report"
        options={{ title: "Riwayat" }}
        component={Report}
      />
      <Tab.Screen
        name="Contact"
        options={{ title: "Kontak" }}
        component={Contact}
      />
    </Tab.Navigator>
  );
}
