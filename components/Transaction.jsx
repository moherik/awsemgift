import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
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

const data = [
  {
    name: "AOV",
    logo: "https://storage.googleapis.com/unipin-assets/images/icon_direct_topup_games/1549880449-icon-1540269306-icon-aov.png",
    color: "#fff",
    price: "Rp10.000 - Rp550.000",
  },
  {
    name: "Free Fire",
    logo: "https://storage.googleapis.com/static-sbf/assets_fastpay/game/ic_ff.png",
    color: "#fff",
    price: "Rp10.000 - Rp1.000.000",
  },
  {
    name: "Mobile Legend",
    logo: "https://storage.googleapis.com/static-sbf/assets_fastpay/game/ic_ml.png",
    color: "#fff",
    price: "Rp10.000 - Rp250.000",
  },
];

const numColumns = 2;
const cardHeight = Dimensions.get("window").width / numColumns;

export default function Transaction() {
  const [searchText, setSearchText] = useState("");
  const [listData, setListData] = useState(data);

  const theme = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    if (searchText) {
      const newData = listData.filter((val) =>
        val.name
          ? val.name.toLowerCase().includes(searchText.toLowerCase())
          : null
      );
      setListData(newData);
    } else {
      setListData(data);
    }
  }, [searchText]);

  function handleOnClick(item) {
    Keyboard.dismiss();

    navigation.navigate("Payment", { ...item });
  }

  return (
    <FlatList
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
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
      }
      renderItem={({ item }) => (
        <Pressable style={styles.gridItem} onPress={() => handleOnClick(item)}>
          <View
            style={{
              ...styles.itemWrapper,
              backgroundColor: theme.colors.primaryContainer,
              borderColor: theme.colors.primaryContainer,
            }}
          >
            <View
              style={{
                ...styles.itemLogo,
                backgroundColor: item.color || theme.colors.background,
              }}
            >
              <Image
                source={{
                  uri: item.logo,
                }}
                width={cardHeight - 120}
                height={cardHeight - 120}
              />
            </View>
            <View style={{ padding: 15 }}>
              <Text variant="titleMedium">{item.name}</Text>
              <Text>{item.price}</Text>
            </View>
          </View>
        </Pressable>
      )}
      numColumns={numColumns}
      data={listData}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        <View style={styles.emptyWrapper}>
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

const styles = StyleSheet.create({
  gridItem: {
    flex: 1 / 2,
    display: "flex",
    justifyContent: "flex-start",
    height: cardHeight,
  },
  itemWrapper: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    display: "flex",
    overflow: "hidden",
  },
  itemLogo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  emptyWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
    margin: 20,
  },
});
