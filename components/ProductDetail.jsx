import { useEffect, useState } from "react";
import {
  BackHandler,
  FlatList,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import {
  Button,
  Divider,
  HelperText,
  IconButton,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { Image } from "expo-image";
import Toast from "react-native-root-toast";
import RenderHtml from "react-native-render-html";

import LoginBanner from "./LoginBanner";

import { currency } from "../lib/formatter";
import api from "../lib/api";
import PaymentList from "./PaymentList";

const numColumns = 2;

export default function ProductDetail({
  item,
  auth,
  contact,
  dismissModal,
  navigation,
  onClickProduct,
  onClickFavorite,
  showLoader,
  dismissLoader,
}) {
  const [selectedProduct, setselectedProduct] = useState();
  const [isFavorite, setIsFavorite] = useState(item.isFavorite || false);
  const [selectedPayment, setSelectedPayment] = useState();

  const theme = useTheme();
  const { control, handleSubmit, setValue, formState } = useForm({
    defaultValues: {
      phone: "",
      name: "",
      note: "",
    },
  });

  useEffect(() => {
    setValue(
      "phone",
      contact.selectedItem?.phoneNumbers
        ? contact.selectedItem?.phoneNumbers[0].number
        : ""
    );
    setValue("name", contact.selectedItem?.name);
  }, [contact.selectedItem]);

  useEffect(() => {
    async function backAction() {
      dismissModal();
      return true;
    }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  async function onSubmit({ phone, name, note }) {
    try {
      showLoader();

      if (!selectedPayment) {
        throw new Error("Pilih tipe pembayaran!");
      }

      await api
        .post("gifts/order", {
          productCode: selectedProduct.code,
          phone,
          name,
          note,
          type: selectedPayment,
        })
        .then(async (response) => {
          if (response.status != 200) {
            throw new Error(response.message || "Gagal menambahkan hadiah");
          }

          const { url, orderId } = response.data;
          if (url) {
            dismissModal();
            setTimeout(() => {
              navigation.navigate("PaymentWebView", { url });
            }, 300);
          } else {
            dismissModal();
            setTimeout(() => {
              navigation.navigate("PaymentResult", { orderId });
            }, 300);
          }
        });
    } catch (error) {
      Toast.show(error?.message || "Terjadi kesalahan");
    } finally {
      dismissLoader();
    }
  }

  function handleSelectPayment(paymentId) {
    setSelectedPayment(paymentId);
  }

  function handleFavorite() {
    setIsFavorite(!isFavorite);

    onClickFavorite();
  }

  function handleClickContact() {
    contact.open();
  }

  function handleClickLogin() {
    dismissModal();

    setTimeout(() => {
      navigation?.navigate("Login");
    }, 100);
  }

  function hasError(form) {
    return formState.errors[form] ? true : false;
  }

  return (
    <>
      <View style={styles.header}>
        <Image
          source={{ uri: item.logo }}
          style={{ borderRadius: 10 }}
          width={48}
          height={48}
        />
        <View style={styles.productInfo}>
          <View>
            <Text variant="titleLarge">{item.name}</Text>
            <Text variant="labelMedium">eGift &bull; {item.category.name}</Text>
            <Text variant="bodyMedium" style={{ marginTop: 8 }}>
              {item.price}
            </Text>
          </View>
          <IconButton
            iconColor={isFavorite ? theme.colors.error : null}
            icon={isFavorite ? "heart" : "heart-outline"}
            onPress={handleFavorite}
          />
        </View>
      </View>
      {item.info && (
        <View style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
          <RenderHtml
            baseStyle={{
              lineHeight: theme.fonts.bodySmall.lineHeight,
              fontSize: theme.fonts.bodySmall.fontSize,
              color: theme.colors.inverseSurface,
            }}
            contentWidth={useWindowDimensions().width}
            source={{ html: item.info }}
          />
        </View>
      )}
      <Divider />
      <Text variant="labelMedium" style={styles.headerLabel}>
        Pilih Produk
      </Text>
      <View style={styles.productList}>
        <FlatList
          scrollEnabled={false}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <TouchableRipple
                borderless
                style={{
                  ...styles.productItemWrapper,
                  backgroundColor:
                    selectedProduct?.id == item.id
                      ? theme.colors.primaryContainer
                      : null,
                  borderColor:
                    selectedProduct?.id == item.id
                      ? theme.colors.primary
                      : theme.colors.primaryContainer,
                }}
                onPress={() => {
                  setselectedProduct(item);
                  onClickProduct();
                }}
              >
                <View style={{ display: "flex" }}>
                  <Text
                    variant="bodySmall"
                    lineBreakMode="tail"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text variant="bodyMedium">
                    {currency(item.price + item.admin)}
                  </Text>
                </View>
              </TouchableRipple>
            </View>
          )}
          data={item.products}
        />
      </View>
      {selectedProduct && (
        <>
          <Divider />
          {!auth.userData ? (
            <LoginBanner
              navigation={navigation}
              onClick={handleClickLogin}
              title="Tunggu Dulu,"
              message="Login untuk mengakses fitur ini"
            />
          ) : (
            <>
              <Text style={styles.headerLabel} variant="labelMedium">
                Penerima
              </Text>
              <View style={styles.form}>
                <Controller
                  control={control}
                  rules={{ required: true }}
                  name="phone"
                  render={({ field: { onBlur, onChange, value } }) => (
                    <>
                      <TextInput
                        error={formState.errors.phone}
                        mode="outlined"
                        label="Nomor Telepon"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        right={
                          <TextInput.Icon
                            icon="contacts-outline"
                            onPress={handleClickContact}
                          />
                        }
                      />
                      {formState.errors.phone && (
                        <HelperText type="error">
                          Nomor telepon harus diisi
                        </HelperText>
                      )}
                    </>
                  )}
                />
                <Controller
                  control={control}
                  rules={{ required: true }}
                  name="name"
                  render={({ field: { onBlur, onChange, value } }) => (
                    <>
                      <TextInput
                        error={formState.errors.name}
                        mode="outlined"
                        label="Nama Panggilan"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                      />
                      {formState.errors.name && (
                        <HelperText type="error">Nama harus diisi</HelperText>
                      )}
                    </>
                  )}
                />
                <Controller
                  control={control}
                  rules={{ required: false }}
                  name="note"
                  render={({ field: { onBlur, onChange, value } }) => (
                    <TextInput
                      mode="outlined"
                      label="Ucapan"
                      multiline
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
              <Text style={styles.headerLabel} variant="labelMedium">
                Pembayaran
              </Text>
              <PaymentList
                price={selectedProduct.price + selectedProduct.admin}
                onSelect={handleSelectPayment}
                auth={auth}
              />
              <View style={{ marginVertical: 20, gap: 10 }}>
                <View style={styles.row}>
                  <Text>Produk</Text>
                  <Text variant="labelLarge">{selectedProduct.name}</Text>
                </View>
                <View style={styles.row}>
                  <Text>Total Bayar</Text>
                  <Text variant="labelLarge">
                    {currency(selectedProduct.price + selectedProduct.admin)}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  paddingHorizontal: 10,
                }}
              >
                <Button
                  mode="contained"
                  icon="gift"
                  onPress={handleSubmit(onSubmit)}
                >
                  Kirim Hadiah
                </Button>
              </View>
            </>
          )}
        </>
      )}
      <Button
        style={{ marginHorizontal: 15, marginVertical: 10 }}
        mode="text"
        onPress={() => dismissModal()}
      >
        Kembali
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingRight: 10,
    gap: 20,
  },
  productInfo: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  productList: {
    padding: 5,
    paddingTop: 0,
  },
  productItem: {
    flex: 1 / numColumns,
    display: "flex",
    justifyContent: "flex-start",
    padding: 5,
  },
  productItemWrapper: {
    padding: 10,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    display: "flex",
    gap: 2,
  },
  form: {
    display: "flex",
    gap: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  headerLabel: { paddingHorizontal: 10, paddingVertical: 10 },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 15,
  },
});
