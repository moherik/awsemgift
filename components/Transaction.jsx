import { useEffect, useState } from "react";
import { FlatList, Keyboard, Pressable, View } from "react-native";
import {
  Avatar,
  Button,
  Divider,
  List,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Saldo from "./Saldo";

const data = [
  { title: "PDAM", icon: "water", pinned: true, id: 1 },
  {
    title: "PLN Prabayar (Token)",
    icon: "lightning-bolt",
    pinned: true,
    id: 2,
  },
  { title: "Game Online", icon: "gamepad-variant", pinned: true, id: 3 },
  { type: "separator", id: 10000 },
  { title: "Pulsa & Paket Data", icon: "phone", pinned: false, id: 5 },
  { title: "E-Wallet", icon: "wallet", pinned: false, id: 6 },
];

export default function Transaction() {
  const [searchText, setSearchText] = useState("");
  const [listData, setListData] = useState(data);

  const theme = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    if (searchText) {
      const newData = data.filter((val) =>
        val.title
          ? val.title.toLowerCase().includes(searchText.toLowerCase())
          : null
      );
      setListData(newData);
    } else {
      setListData(data);
    }
  }, [searchText]);

  function handleOnClick(item) {
    Keyboard.dismiss();

    navigation.navigate("Detail", { ...item });
  }

  return (
    <FlatList
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          <Saldo />
          <TextInput
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            label="Cari Produk"
            style={{ backgroundColor: theme.colors.background }}
            left={
              <TextInput.Icon
                icon={!searchText ? "magnify" : "close"}
                onPress={() => setSearchText("")}
              />
            }
          />
        </>
      }
      stickyHeaderIndices={[0]}
      renderItem={({ item }) =>
        item.type == "separator" ? (
          <Divider />
        ) : (
          <List.Item
            title={item.title}
            left={(props) => (
              <Avatar.Icon
                {...props}
                size={32}
                color={theme.colors.background}
                icon={item.icon}
              />
            )}
            right={(props) => (
              <Pressable
                onPress={() => {
                  console.log("pin/not pin");
                }}
              >
                {item.pinned ? (
                  <List.Icon {...props} icon="pin-off" />
                ) : (
                  <List.Icon {...props} icon="pin" />
                )}
              </Pressable>
            )}
            onPress={() => handleOnClick(item)}
          />
        )
      }
      data={listData}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 100,
            margin: 20,
          }}
        >
          <Text variant="titleMedium">Tidak ada produk</Text>
          <Text variant="bodyMedium" style={{ textAlign: "center" }}>
            Saat ini belum ada produk yang tersedia, atau perbaiki pencarian
            Anda
          </Text>
        </View>
      }
      ListFooterComponent={
        searchText ? (
          <View style={{ margin: 20 }}>
            <Button mode="elevated" onPress={() => setSearchText("")}>
              Reset Pencarian
            </Button>
          </View>
        ) : null
      }
    />
  );
}
