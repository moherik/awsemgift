import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert, FlatList, View } from "react-native";
import {
  Avatar,
  Divider,
  List,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";

import useAuth from "../hooks/useAuth";
import { currency } from "../lib/formatter";

import LoginBanner from "./LoginBanner";
import Toast from "react-native-root-toast";

export default function Menu() {
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const theme = useTheme();
  const auth = useAuth();

  const data = [
    {
      id: 0,
      name: currency(auth.userData?.balance || "0"),
      desc: "Saldo Anda",
      icon: "cash-multiple",
      isActive: auth.userData,
    },
    {
      id: 1,
      name: "Favorit",
      desc: "Produk favorit tersimpan",
      icon: "heart-multiple-outline",
      isActive: auth.userData,
      onClick: () => {
        navigation.navigate("Favorite");
      },
    },
    {
      id: 3,
      name: "Bantuan",
      desc: "Pusat bantuan, hubungi kami",
      icon: "help-circle-outline",
      isActive: true,
      onClick: () => {},
    },
    {
      id: 4,
      name: "Kebijakan Privasi",
      isActive: true,
      onClick: async () =>
        await WebBrowser.openBrowserAsync("https://google.com"),
    },
    {
      id: 5,
      name: "Keluar",
      isActive: auth.userData,
      onClick: () => handleLogout(),
    },
  ];

  function handleLogout() {
    Alert.alert("Logout", "Anda yakin ingin keluar dari akun ini?", [
      {
        text: "Batal",
        onPress: () => null,
      },
      { text: "OK", onPress: () => auth.signOut() },
    ]);
  }

  function handleClickLogin() {
    navigation.navigate("Login");
  }

  async function handleRefresh() {
    try {
      await auth.refresh();
    } catch (error) {
      Toast.show("Terjadi kesalahan");
    }
  }

  return (
    <FlatList
      refreshing={loading}
      onRefresh={handleRefresh}
      ListHeaderComponent={
        auth.userData ? (
          <Surface
            style={{ paddingTop: Constants.statusBarHeight }}
            onPress={() => {}}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                paddingVertical: 20,
                paddingHorizontal: 20,
                gap: 15,
                alignItems: "center",
              }}
            >
              {auth.userData.avatarUrl ? (
                <Avatar.Image
                  source={{ uri: auth.userData.avatarUrl }}
                  size={38}
                />
              ) : (
                <Avatar.Icon icon="account" size={38} />
              )}
              <View>
                <Text variant="titleMedium">{auth.userData.name}</Text>
                <Text>{auth.userData.email}</Text>
                <Text>{auth.userData.phone}</Text>
              </View>
            </View>
          </Surface>
        ) : (
          <LoginBanner onClick={handleClickLogin} />
        )
      }
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={<Divider />}
      renderItem={({ item }) =>
        item.isActive && (
          <List.Item
            title={item.name}
            description={item.desc}
            style={{ paddingLeft: !item.icon ? 40 : 0 }}
            left={(props) =>
              item.icon ? <List.Icon {...props} icon={item.icon} /> : null
            }
            right={(props) => <List.Icon {...props} icon={item.iconRight} />}
            onPress={item.onClick}
          />
        )
      }
      data={data}
      ListFooterComponent={
        <View
          style={{ marginTop: 40, alignItems: "center", padding: 15, gap: 5 }}
        >
          <Text variant="labelMedium">Awsemgift &copy; 2023</Text>
          <Text variant="labelMedium">Versi 1.0.0</Text>
        </View>
      }
    />
  );
}
