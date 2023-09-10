import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  View,
} from "react-native";
import {
  Chip,
  Divider,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";

import CustomBackdrop from "./CustomBackdrop";
import ProductDetail from "./ProductDetail";

const data = [
  {
    id: 1,
    name: "AOV",
    logo: "https://storage.googleapis.com/unipin-assets/images/icon_direct_topup_games/1549880449-icon-1540269306-icon-aov.png",
    cover:
      "https://games.lol/wp-content/uploads/2021/06/garena-aov-pc-full-version.jpg",
    color: "#03A9F4",
    price: "Rp10.000 - Rp550.000",
    category: "Game Online",
  },
  {
    id: 2,
    name: "Netflix",
    logo: "https://storage.googleapis.com/static-sbf/fastpay_mobile/logo_produk/game/ic_netflix-min.png",
    cover:
      "https://cdn.eraspace.com/pub/media/mageplaza/blog/post/f/i/fiturnetflix-_primary.jpg",
    color: "#FF5252",
    price: "Rp10.000 - Rp1.000.000",
    category: "Entertainment",
  },
  {
    id: 3,
    name: "Mobile Legend",
    logo: "https://storage.googleapis.com/static-sbf/assets_fastpay/game/ic_ml.png",
    cover:
      "https://gamebrott.com/wp-content/uploads/2022/07/Featured-7-750x375.jpg",
    color: "#ab47bc",
    price: "Rp10.000 - Rp250.000",
    category: "Game Online",
  },
  {
    id: 4,
    name: "Ragnarok",
    logo: "https://cdn.unipin.com/images/icon_product_pages/1622191978-icon-RO-game-logo.jpg",
    cover:
      "https://sm.ign.com/ign_ap/screenshot/default/ragnarok-online_u5wk.jpg",
    color: "#FFEB3B",
    price: "Rp10.000 - Rp250.000",
    category: "Game Online",
    info: "Voucher Ragnarok bisa digunakan untuk melakukan topup di dalam game Ragnarok Online",
    item: [
      {
        name: "Voucher Ragnarok E",
        price: "Rp10.000",
        key: 200,
      },
      {
        name: "Voucher Ragnarok E 50",
        price: "Rp50.000",
        key: 201,
      },
      {
        name: "Voucher Ragnarok E 100",
        price: "Rp1-0.000",
        key: 202,
      },
    ],
  },
  {
    id: 5,
    name: "Spotify",
    logo: "https://storage.googleapis.com/static-sbf/fastpay_mobile/logo_produk/game/ic_spotify-min.png",
    cover:
      "https://gadgetren.com/wp-content/uploads/2023/02/Spotify-Logo-ok.jpg",
    color: "#4CAF50",
    price: "Rp10.000 - Rp250.000",
    category: "Entertainment",
  },
];

const categories = [
  {
    name: "Game Online",
    key: "game-online",
  },
  {
    name: "Voucher Digital",
    key: "digital",
  },
];

const numColumns = 2;
const cardHeight = Dimensions.get("window").width / numColumns;

export default function Transaction() {
  const [searchText, setSearchText] = useState("");
  const [listData, setListData] = useState(data);
  const [selectedItem, setSelectedItem] = useState();

  const theme = useTheme();
  const navigation = useNavigation();

  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["80%"], []);

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

    setSelectedItem(item);
    bottomSheetModalRef.current?.present();
  }

  function dismissModal() {
    bottomSheetModalRef.current?.dismiss();
  }

  return (
    <>
      <FlatList
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
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
            <View
              style={{
                ...styles.category,
                backgroundColor: theme.colors.background,
              }}
            >
              {categories.map((category, index) => (
                <Chip
                  style={{ marginRight: 5 }}
                  onPress={() => console.log("Pressed")}
                  key={index}
                >
                  {category.name}
                </Chip>
              ))}
            </View>
            <Divider />
          </View>
        }
        stickyHeaderIndices={[0]}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <TouchableRipple
              borderless
              style={{
                ...styles.itemWrapper,
                borderColor: theme.colors.primaryContainer,
              }}
              onPress={() => handleOnClick(item)}
            >
              <View style={{ display: "flex", flex: 1 }}>
                <View
                  style={{
                    ...styles.itemLogo,
                    backgroundColor:
                      item.color || theme.colors.primaryContainer,
                  }}
                >
                  <Image
                    style={{ borderRadius: 20 }}
                    source={{ uri: item.logo }}
                    width={cardHeight - 120}
                    height={cardHeight - 120}
                  />
                </View>
                <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                  <Text variant="titleMedium">{item.name}</Text>
                  <Text>{item.price}</Text>
                </View>
              </View>
            </TouchableRipple>
          </View>
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
      />

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={({ animatedIndex, style }) => (
          <CustomBackdrop
            animatedIndex={animatedIndex}
            style={style}
            color={selectedItem?.color}
            cover={selectedItem?.cover}
            onPress={dismissModal}
          />
        )}
      >
        <BottomSheetScrollView>
          {selectedItem && <ProductDetail item={selectedItem} />}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  category: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    paddingVertical: 5,
    paddingLeft: 5,
  },
  gridItem: {
    flex: 1 / numColumns,
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
