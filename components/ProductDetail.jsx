import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import {
  Button,
  Divider,
  IconButton,
  List,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import Toast from "react-native-root-toast";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import LoginBanner from "./LoginBanner";

import { currency } from "../lib/numberFormat";
import { BASE_URL } from "../constants";
import api from "../lib/api";

const numColumns = 2;

export default function ProductDetail({
  item,
  auth,
  contact,
  dismissModal,
  navigation,
  onClickProduct,
  onClickFavorite,
  showModal,
  hideModal,
}) {
  const [selectedProduct, setselectedProduct] = useState();
  const [isFavorite, setIsFavorite] = useState(item.isFavorite || false);
  const [selectedPayment, setSelectedPayment] = useState();
  const [paymentList, setPaymentList] = useState([]);

  const url = Linking.useURL();
  if (url) {
    const { hostname, path, queryParams } = Linking.parse(url);
    if (hostname == "payment" && path == "success") {
      navigation.navigate("PaymentSuccess");
      dismissModal();
    }
  }

  const theme = useTheme();
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      phone: "",
      name: "",
      note: "",
    },
  });

  useEffect(() => {
    setValue("phone", contact.selectedItem?.phoneNumbers[0].number);
    setValue("name", contact.selectedItem?.name);
  }, [contact.selectedItem]);

  useEffect(() => {
    async function getPaymentList() {
      await api.get("general/payment-list").then((res) => {
        setPaymentList(res.data);
      });
    }

    getPaymentList();
  }, []);

  async function onSubmit({ phone, name, note }) {
    try {
      showModal();

      if (!selectedPayment) {
        throw new Error("Pilih tipe pembayaran!");
      }

      await api
        .post("gift/order", {
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

          const data = response.data;
          if (data.url) {
            await WebBrowser.openBrowserAsync(data.url);
          }
        });
    } catch (error) {
      Toast.show(error?.message || "Terjadi kesalahan");
    } finally {
      hideModal();
    }
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
            iconColor={isFavorite ? theme.colors.error : theme.colors.shadow}
            icon={isFavorite ? "heart" : "heart-outline"}
            onPress={handleFavorite}
          />
        </View>
      </View>
      {item.info && (
        <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
          <Text variant="bodySmall">{item.info}</Text>
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
              title="Hello There,"
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
                    <TextInput
                      mode="outlined"
                      label="Nomor Telepon"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      right={
                        <TextInput.Icon
                          icon="contacts"
                          onPress={handleClickContact}
                        />
                      }
                    />
                  )}
                />
                <Controller
                  control={control}
                  rules={{ required: true }}
                  name="name"
                  render={({ field: { onBlur, onChange, value } }) => (
                    <TextInput
                      mode="outlined"
                      label="Nama Panggilan"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
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
              {paymentList.map((payment, index) => (
                <List.Item
                  key={payment.id || index}
                  title={payment.label}
                  disabled={
                    payment.balance <= 0 ||
                    payment.balance < selectedProduct?.price
                  }
                  description={
                    payment.id == "BALANCE"
                      ? payment.balance > selectedProduct.price
                        ? currency(payment.balance)
                        : currency(payment.balance) +
                          " - saldo Anda tidak mencukupi"
                      : ""
                  }
                  left={(props) =>
                    payment.icon ? (
                      <List.Icon {...props} icon={payment.icon} />
                    ) : (
                      <Image
                        {...props}
                        width={22}
                        height={22}
                        source={{ uri: `${BASE_URL}/${payment.logo}` }}
                      />
                    )
                  }
                  right={(props) =>
                    payment.id == selectedPayment && (
                      <List.Icon
                        {...props}
                        icon="check-circle"
                        color={theme.colors.primary}
                      />
                    )
                  }
                  onPress={() => setSelectedPayment(payment.id)}
                />
              ))}
              <List.Item
                title="Total Bayar"
                right={() => (
                  <Text variant="titleMedium">
                    {currency(selectedProduct.price + selectedProduct.admin)}
                  </Text>
                )}
              />
              <View
                style={{
                  paddingHorizontal: 10,
                  marginBottom: 30,
                }}
              >
                <Button
                  mode="contained"
                  icon="gift"
                  onPress={handleSubmit(onSubmit)}
                >
                  Kirim Hadiah
                </Button>
                <Button
                  style={{ marginTop: 10 }}
                  mode="text"
                  onPress={() => dismissModal()}
                >
                  Kembali
                </Button>
              </View>
            </>
          )}
        </>
      )}
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
});
