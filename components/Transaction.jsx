import { useEffect, useState } from "react";
import { FlatList, Keyboard, Pressable, View } from "react-native";
import {
  Avatar,
  Button,
  Divider,
  List,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import Saldo from "./Saldo";

import { supabase } from "../lib/supabase";

export default function Transaction() {
  const [searchText, setSearchText] = useState("");
  const [listData, setListData] = useState([]);

  const theme = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    const data = listData;

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

    supabase
      .from("products")
      .select()
      .then(({ data }) => setListData(data));
  }, [searchText]);

  function handleOnClick(item) {
    Keyboard.dismiss();

    navigation.navigate("Payment", { ...item });
  }

  return (
    <FlatList
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
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
          <Saldo />
        </>
      }
      renderItem={({ item }) => {
        if (item.type == "separator") {
          return <Divider />;
        } else if (item.type == "header") {
          return (
            <>
              <View style={{ padding: 15 }}>
                <Text>{item.label}</Text>
              </View>
              <Divider />
            </>
          );
        } else {
          return (
            <List.Item
              title={item.name}
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
          );
        }
      }}
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
