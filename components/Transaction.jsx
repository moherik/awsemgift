import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
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
  IconButton,
  useTheme,
} from "react-native-paper";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";

import useAuth from "../hooks/useAuth";
import useLoader from "../hooks/useLoader";
import useContactList from "../hooks/useContactList";
import api from "../lib/api";
import storage from "../lib/storage";

import CustomBackdrop from "./CustomBackdrop";
import ProductDetail from "./ProductDetail";
import ProductItem from "./ProductItem";

const numColumns = 3;
const cardHeight = Dimensions.get("window").width / numColumns + 20;

export default function Transaction() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchText, setSearchText] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [selectedCategory, setSelectedCategory] = useState();

  const scrollViewRef = useRef();

  const { showLoader, dismissLoader } = useLoader();

  const theme = useTheme();
  const auth = useAuth();
  const contact = useContactList();
  const navigation = useNavigation();

  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["80%", "96%"], []);

  async function fetchData(isRefresh) {
    const categories = await storage.get("categories");
    if (categories) {
      setCategories(JSON.parse(categories));
    }

    const products = await storage.get("products");
    if (products) {
      setProducts(JSON.parse(products));
    }

    try {
      if (isRefresh) {
        setLoading(true);
        setSearchText("");
        setSelectedCategory(null);

        const resp = await api.post("products", {
          userId: auth?.userData?.id,
        });
        if (resp.status != 200 && !resp.data)
          throw new Error("Terjadi kesalahan");

        if (resp.data) {
          const productsData = resp.data?.products;
          const categoriesData = resp.data?.categories;

          tempData = productsData;
          setProducts(productsData);
          setCategories(categoriesData);

          storage.update("products", JSON.stringify(productsData));
          storage.update("categories", JSON.stringify(categoriesData));
        }
      }
    } catch (error) {
      Toast.show(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [auth.userData]);

  useEffect(() => {
    async function filterData() {
      const products = JSON.parse(await storage.get("products"));
      if (!products) return () => {};

      let filteredData = products;

      let filteredFav = filteredData?.find((val) => val.id == -1);
      let allData = filteredData?.find((val) => val.id !== -1);

      if (searchText) {
        allData.data[0] = allData?.data[0].filter((product) =>
          product.name
            ? product.name.toLowerCase().includes(searchText.toLowerCase())
            : null
        );

        filteredFav.data[0] = filteredFav?.data[0].filter((product) =>
          product.name
            ? product.name.toLowerCase().includes(searchText.toLowerCase())
            : null
        );
      }

      if (selectedCategory) {
        allData.data[0] = allData?.data[0].filter((product) =>
          product.category ? product.category.id == selectedCategory.id : null
        );

        filteredFav.data[0] = filteredFav?.data[0].filter((product) =>
          product.category ? product.category.id == selectedCategory.id : null
        );

        filteredData = [filteredFav, allData];
      }

      setProducts(filteredData);
    }

    filterData();
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

    try {
      const update = await api.post("products/favorite", {
        productGroupId: selectedItem.id,
      });
      if (update.status != 200) throw new Error("Terjadi kesalahan");
    } catch (error) {
      console.log(error);
    }
  }

  function scrollToEnd() {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }

  function renderItem(data) {
    const listItem = data.item;

    if (data.section.id == -1) {
      const hasMore = listItem.length > numColumns;

      return (
        <View style={{ position: "relative" }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <FlatList
              data={listItem}
              scrollEnabled={false}
              horizontal={true}
              contentContainerStyle={{
                flex: 1,
                justifyContent: "center",
                alignItems: "stretch",
              }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <ProductItem
                  onClick={handleOnClick}
                  item={item}
                  numColumns={numColumns}
                  cardHeight={cardHeight}
                  theme={theme}
                />
              )}
            />
          </ScrollView>
          {hasMore && (
            <View
              style={{
                position: "absolute",
                top: 50,
                right: 0,
              }}
            >
              <IconButton
                mode="contained"
                containerColor={theme.colors.background}
                icon="chevron-right"
                onPress={scrollToEnd}
              />
            </View>
          )}
        </View>
      );
    } else {
      return (
        <FlatList
          data={listItem}
          numColumns={numColumns}
          renderItem={({ item }) => (
            <ProductItem
              onClick={handleOnClick}
              item={item}
              numColumns={numColumns}
              cardHeight={cardHeight}
              theme={theme}
            />
          )}
        />
      );
    }
  }

  function renderSectionHeader({ section }) {
    return (
      <View
        style={{
          backgroundColor: theme.colors.background,
          paddingHorizontal: 10,
          paddingVertical: 8,
        }}
      >
        <Text variant="titleSmall">{section.title}</Text>
      </View>
    );
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

      <SectionList
        refreshing={loading}
        onRefresh={() => fetchData(true)}
        keyExtractor={(item) => item.id}
        stickyHeaderIndices={[0]}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        sections={products}
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
