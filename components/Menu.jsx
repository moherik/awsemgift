import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { FlatList, View } from "react-native";
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

import { useAuth } from "../hooks/useAuth";

import LoginBanner from "./LoginBanner";

export default function Menu() {
  const theme = useTheme();
  const navigation = useNavigation();

  const auth = useAuth();
  useEffect(() => {}, []);

  const data = [
    {
      id: 1,
      name: "Favorit",
      desc: "Produk favorit tersimpan",
      icon: "heart-circle",
      isActive: auth.userData,
      onClick: () => {},
    },
    {
      id: 2,
      name: "Riwayat Transaksi",
      desc: "Hadiah yang pernah dikirimkan",
      icon: "gift-open",
      isActive: auth.userData,
      onClick: () => {},
    },
    {
      id: 3,
      name: "Bantuan",
      desc: "Pusat bantuan, hubungi kami",
      icon: "help-box",
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
      name: "Hapus Akun",
      isActive: auth.userData,
      onClick: () => {},
    },
    {
      id: 6,
      name: "Keluar",
      isActive: auth.userData,
      onClick: () => auth.signOut(),
    },
  ];

  return (
    <FlatList
      ListHeaderComponent={
        auth.userData ? (
          <TouchableRipple
            style={{ paddingTop: Constants.statusBarHeight }}
            onPress={() => {}}
          >
            <Surface>
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
                <Avatar.Icon icon="account" size={38} />
                <View>
                  <Text variant="titleMedium">Erik Maulana</Text>
                  <Text>muherik.maulana@gmail.com</Text>
                </View>
              </View>
            </Surface>
          </TouchableRipple>
        ) : (
          <LoginBanner />
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
