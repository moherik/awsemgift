import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Appbar,
  Chip,
  Divider,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Toast from "react-native-root-toast";

import { useAuth } from "../hooks/useAuth";
import api from "../lib/api";

import CustomBackdrop from "./CustomBackdrop";
import ProductDetail from "./ProductDetail";

let tempData = [];
const numColumns = 2;
const cardHeight = Dimensions.get("window").width / numColumns - 20;

export default function Transaction() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchText, setSearchText] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [selectedCategory, setSelectedCategory] = useState();

  const theme = useTheme();
  const auth = useAuth();

  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["80%", "100%"], []);

  async function fetchData() {
    setLoading(true);

    await api
      .get("products")
      .then((response) => {
        tempData = response.data?.products || [];

        setProducts(response.data?.products || []);
        setCategories(response.data?.categories || []);
        setSelectedCategory(null);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filteredData = tempData;

    if (searchText) {
      filteredData = filteredData.filter((product) =>
        product.name
          ? product.name.toLowerCase().includes(searchText.toLowerCase())
          : null
      );
    }

    if (selectedCategory) {
      filteredData = filteredData.filter((product) =>
        product.category ? product.category.id == selectedCategory.id : null
      );
    }

    setProducts(filteredData);
  }, [searchText, selectedCategory]);

  function handleOnClick(item) {
    Keyboard.dismiss();

    setSelectedItem(item);
    bottomSheetModalRef.current?.present();
  }

  function dismissModal() {
    bottomSheetModalRef.current?.dismiss();
  }

  function handleOnClickCategory(category) {
    if (selectedCategory?.id == category.id) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  }

  async function handleFavorite() {
    if (!auth.userData) {
      Toast.show("Perlu login untuk mengakses fitur ini");
    }

    selectedItem.isFavorite = !selectedItem.isFavorite;
    setSelectedItem(selectedItem);

    await api
      .post("products/favorites", {
        productGroupId: selectedItem.id,
      })
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  }

  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: theme.colors.primaryContainer,
        }}
      >
        <Appbar.Content title="Awsemgift" />
        <Appbar.Action icon="bell" onPress={() => {}} />
      </Appbar.Header>
      <FlatList
        refreshing={loading}
        onRefresh={() => fetchData()}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <TextInput
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
              label="Cari produk"
              dense
              style={{ backgroundColor: theme.colors.background }}
              right={
                <TextInput.Icon
                  icon={!searchText ? "magnify" : "close"}
                  onPress={() => setSearchText("")}
                />
              }
            />
            <ScrollView
              horizontal
              style={{
                ...styles.category,
                backgroundColor: theme.colors.background,
              }}
            >
              {categories &&
                categories.map((category, index) => (
                  <Chip
                    style={{
                      marginRight: 5,
                      backgroundColor:
                        selectedCategory?.id == category.id
                          ? theme.colors.primaryContainer
                          : theme.colors.background,
                      borderColor: theme.colors.primaryContainer,
                      borderWidth: 1,
                    }}
                    onPress={() => handleOnClickCategory(category)}
                    key={index}
                    textStyle={{ fontSize: 13, fontWeight: 400 }}
                  >
                    {category.name}
                  </Chip>
                ))}
            </ScrollView>
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
                    style={{ borderRadius: 12 }}
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
        data={products}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyWrapper}>
              <Text variant="titleMedium">Tidak ada produk</Text>
              <Text variant="bodyMedium" style={{ textAlign: "center" }}>
                Saat ini belum ada produk yang tersedia, atau perbaiki pencarian
                Anda
              </Text>
            </View>
          )
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
          {selectedItem && (
            <ProductDetail
              item={selectedItem}
              onClickFavorite={handleFavorite}
              onClickProduct={() => {
                bottomSheetModalRef.current?.snapToIndex(1);
              }}
            />
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  category: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 5,
    paddingLeft: 5,
    width: "100%",
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
