import { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  VirtualizedList,
} from "react-native";
import {
  Button,
  Divider,
  IconButton,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

const numColumns = 2;

export default function ProductDetail({ item }) {
  const [selectedProduct, setselectedProduct] = useState();

  const theme = useTheme();

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
            <Text variant="labelMedium">eGift &bull; {item.category}</Text>
            <Text variant="bodyMedium" style={{ marginTop: 8 }}>
              {item.price}
            </Text>
          </View>
          <IconButton icon="star-plus" onPress={() => {}} />
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
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <TouchableRipple
                borderless
                style={{
                  ...styles.productItemWrapper,
                  backgroundColor:
                    selectedProduct?.key == item.key
                      ? theme.colors.primaryContainer
                      : null,
                  borderColor:
                    selectedProduct?.key == item.key
                      ? theme.colors.primary
                      : theme.colors.primaryContainer,
                }}
                onPress={() => setselectedProduct(item)}
              >
                <View style={{ display: "flex" }}>
                  <Text variant="bodySmall">{item.name}</Text>
                  <Text variant="bodyMedium">{item.price}</Text>
                </View>
              </TouchableRipple>
            </View>
          )}
          data={item.item}
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
              <TextInput
                mode="outlined"
                label="Nomor Telepon"
                right={<TextInput.Icon icon="contacts" onPress={() => {}} />}
              />
              <TextInput mode="outlined" label="Catatan (opsional)" multiline />
            </View>
            <Button mode="contained" icon="gift" onPress={() => {}}>
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
