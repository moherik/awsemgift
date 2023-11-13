import { useEffect, useState } from "react";
import { Image, Share, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Divider,
  IconButton,
  List,
  Text,
  useTheme,
} from "react-native-paper";
import Toast from "react-native-root-toast";
import * as Clipboard from "expo-clipboard";

import { currency, dateFormat } from "../lib/formatter";
import api from "../lib/api";

export default function GiftDetailScreen({ route, navigation }) {
  const item = route.params?.item;
  const orderDetail = item.orderDetail;
  const productData = orderDetail.productData;

  const [orderData, setOrderData] = useState();
  const [loading, setLoading] = useState(true);

  const theme = useTheme();

  const mapStatus = {
    "-1": {
      color: theme.colors.secondary,
      label: "Pending",
    },
    0: {
      color: theme.colors.primary,
      label: "Ready",
    },
    1: {
      color: theme.colors.primary,
      label: "Proses",
    },
  };

  useEffect(() => {
    async function checkStatus(orderId) {
      await api
        .post("/gifts/status", {
          orderId,
        })
        .then((resp) => {
          setOrderData(resp.data);
        })
        .catch((err) => {
          Toast.show(err?.message || "Terjadi kesalahan");
          setTimeout(() => {
            navigation.goBack();
          }, 3000);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    checkStatus(item.id);
  }, []);

  async function handleSharing() {
    try {
      Share.share({ message: orderData?.message, url: orderData?.url });
    } catch (error) {
      Toast.show(error?.message || "Sharing error");
    }
  }

  async function copyToClipboard() {
    await Clipboard.setStringAsync(item?.id)
      .then(() => {
        Toast.show("Order id copied to clipboard");
      })
      .catch((err) => {
        Toast.show("Error copying to clipboard");
      });
  }

  if (loading) {
    return (
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text variant="bodySmall">Order ID: {item.id}</Text>
        <IconButton size={14} icon="content-copy" onPress={copyToClipboard} />
      </View>
      <Divider />
      <List.Item
        style={{ backgroundColor: theme.colors.background }}
        title={productData.name}
        description={productData.code + " - " + productData.group.category.name}
        left={(props) => (
          <Image
            style={{
              ...props.style,
              borderRadius: 10,
              width: 40,
              height: 40,
            }}
            source={{ uri: productData?.group?.logo }}
          />
        )}
        right={(_props) => (
          <View
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: mapStatus[item.status].color }}>
              {mapStatus[item.status]?.label?.toUpperCase()}
            </Text>
          </View>
        )}
      />
      <View style={styles.divider} />
      <List.Item
        style={{ backgroundColor: theme.colors.background }}
        title={
          <View>
            <Text>{item.billInfo2}</Text>
            <Text>{item.billInfo1}</Text>
          </View>
        }
        description="Penerima"
        descriptionStyle={{ fontSize: 13 }}
        left={(props) => <List.Icon {...props} icon="gift-open-outline" />}
      />
      {orderDetail.note && (
        <>
          <View style={styles.divider} />
          <List.Item
            style={{ backgroundColor: theme.colors.background }}
            title={orderDetail.note}
            description="Ucapan"
            descriptionStyle={{ fontSize: 13 }}
            left={(props) => (
              <List.Icon {...props} icon="mailbox-open-outline" />
            )}
          />
        </>
      )}
      <View style={styles.divider} />
      <List.Item
        style={{ backgroundColor: theme.colors.background }}
        title={currency(productData.price + productData.admin)}
        description="Total Harga"
        descriptionStyle={{ fontSize: 13 }}
        left={(props) => <List.Icon {...props} icon="cash-multiple" />}
      />
      {orderData.status == 0 || orderData.status == 1 ? (
        <View style={{ marginTop: 15 }}>
          <Button mode="contained" icon="link" onPress={handleSharing}>
            Bagikan Link
          </Button>
        </View>
      ) : null}
      <View style={{ ...styles.centered, marginTop: 15 }}>
        <Text variant="bodySmall">
          Order Time: {dateFormat(item.createdAt, "hh:ii:ss dd MMMM yyyy")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
  },
  centered: {
    display: "flex",
    alignItems: "center",
  },
  divider: {
    marginVertical: 4,
  },
});
