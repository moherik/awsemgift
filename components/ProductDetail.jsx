import { useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import {
  Button,
  Divider,
  IconButton,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import * as Contacts from "expo-contacts";
import Toast from "react-native-root-toast";

import { currency } from "../lib/numberFormat";
import api from "../lib/api";
import { useLoader } from "./Loader";

const numColumns = 2;

export default function ProductDetail({
  item,
  onClickProduct,
  onClickFavorite,
}) {
  const [selectedProduct, setselectedProduct] = useState();
  const [isFavorite, setIsFavorite] = useState(item.isFavorite || false);

  const theme = useTheme();
  const { showModal, hideModal } = useLoader();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      phone: "",
      name: "",
      note: "",
    },
  });

  async function onSubmit({ phone, name, note }) {
    try {
      showModal();

      await api
        .post("gift/order", {
          productCode: selectedProduct.code,
          phone,
          name,
          note,
        })
        .then((response) => {
          if (!response) throw new Error("Gagal menambahkan hadiah");

          console.log(response);
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

  async function handleClickContact() {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        console.log(data);
      }
    }
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
      <Text
        variant="labelMedium"
        style={{ paddingHorizontal: 10, paddingVertical: 10 }}
      >
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
                  <Text variant="bodyMedium">{currency(item.price)}</Text>
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
          <Text
            style={{ paddingHorizontal: 10, paddingVertical: 10 }}
            variant="labelMedium"
          >
            Penerima
          </Text>
          <View style={{ paddingHorizontal: 10, marginBottom: 20 }}>
            <View
              style={{
                display: "flex",
                marginBottom: 20,
                gap: 10,
              }}
            >
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
                rules={{ required: true }}
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
});
