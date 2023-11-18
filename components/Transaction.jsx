import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  SectionList,
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
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";

import useAuth from "../hooks/useAuth";
import useLoader from "../hooks/useLoader";
import useContactList from "../hooks/useContactList";
import api from "../lib/api";

import CustomBackdrop from "./CustomBackdrop";
import ProductDetail from "./ProductDetail";
import ProductItem from "./ProductItem";

let tempData = [];
const numColumns = 3;
const cardHeight = Dimensions.get("window").width / numColumns + 20;

export default function Transaction() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchText, setSearchText] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [selectedCategory, setSelectedCategory] = useState();

  const { showLoader, dismissLoader } = useLoader();

  const theme = useTheme();
  const auth = useAuth();
  const contact = useContactList();
  const navigation = useNavigation();

  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["80%", "96%"], []);

  async function fetchData() {
    setLoading(true);

    await api
      .post("products", { userId: auth?.userData?.id })
      .then((response) => {
        tempData = response.data?.products || [];

        setProducts(response.data?.products || []);
        setCategories(response.data?.categories || []);
        setSelectedCategory(null);
      })
      .catch((err) => {
        Toast.show(err.message || "Terjadi kesalahan");
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

  function handleOnDismissModal() {
    bottomSheetModalRef.current?.dismiss();

    contact.setSelectedItem(undefined);
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
      .post("products/favorite", {
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
        <Appbar.Content title="AwsemGift" />
        <Appbar.Action icon="bell-outline" onPress={() => {}} />
      </Appbar.Header>
      <SectionList
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
          <FlatList
            data={item}
            numColumns={numColumns}
            renderItem={({ subitem }) => (
              <ProductItem
                onClick={handleOnClick}
                item={subitem}
                numColumns={numColumns}
                cardHeight={cardHeight}
              />
            )}
          />
        )}
        renderSectionHeader={({ section }) => (
          <Text style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
            {section.title}
          </Text>
        )}
        sections={products}
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
        onDismiss={handleOnDismissModal}
        handleStyle={{ backgroundColor: theme.colors.background }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.inverseSurface }}
        backdropComponent={({ animatedIndex, style }) => (
          <CustomBackdrop
            animatedIndex={animatedIndex}
            style={style}
            color={selectedItem?.color}
            cover={selectedItem?.cover}
            onPress={handleOnDismissModal}
          />
        )}
      >
        <BottomSheetScrollView
          style={{ backgroundColor: theme.colors.background }}
        >
          {selectedItem && (
            <ProductDetail
              item={selectedItem}
              auth={auth}
              navigation={navigation}
              contact={contact}
              dismissModal={handleOnDismissModal}
              onClickFavorite={handleFavorite}
              onClickProduct={() => {
                bottomSheetModalRef.current?.snapToIndex(1);
              }}
              showLoader={showLoader}
              dismissLoader={dismissLoader}
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
  emptyWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
    margin: 20,
  },
});
