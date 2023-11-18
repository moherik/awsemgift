import { useEffect, useState } from "react";
import { Image, ScrollView, Share, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Chip,
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
import useLoader from "../hooks/useLoader";
import useAuth from "../hooks/useAuth";

import PaymentList from "../components/PaymentList";

import { ORDER_STATUS, giftStatus } from "../constants";

export default function HistoryDetailScreen({ route, navigation }) {
  const item = route.params?.item;
  const orderDetail = item.orderDetail;
  const productData = orderDetail.productData;

  const [orderData, setOrderData] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState();

  const theme = useTheme();
  const auth = useAuth();
  const { showLoader, dismissLoader } = useLoader();

  const mapStatus = giftStatus(theme);

  async function checkStatus(orderId) {
    setLoading(true);

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

  useEffect(() => {
    checkStatus(item.id);
  }, []);

  async function handlePay() {
    if (orderData.paymentData) {
      const url = orderData.paymentData.invoice_url;
      navigation.navigate("PaymentWebView", { url });
    } else {
      await processNewPayment();
    }
  }

  async function processNewPayment() {
    try {
      showLoader();

      if (!selectedPayment) {
        throw new Error("Pilih tipe pembayaran!");
      }

      await api
        .post("gifts/order", {
          productCode: productData.code,
          phone: item.billInfo1,
          name: item.billInfo2,
          note: orderDetail.note,
          type: selectedPayment,
        })
        .then(async (response) => {
          if (response.status != 200) {
            throw new Error(response.message || "Gagal menambahkan hadiah");
          }

          const { url, orderId } = response.data;
          if (url) {
            navigation.navigate("PaymentWebView", { url });
          } else {
            navigation.navigate("PaymentResult", { orderId });
          }
        });
    } catch (error) {
      Toast.show(error?.message || "Terjadi kesalahan");
    } finally {
      dismissLoader();
    }
  }

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
        Toast.show("Berhasil disalin");
      })
      .catch((err) => {
        Toast.show("Terjadi kesalahan");
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
    <ScrollView>
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
          title={productData.name}
          description={
            productData.code + " - " + productData.group.category.name
          }
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
            <View style={styles.right}>
              <Chip>
                <Text style={{ color: mapStatus[item.status].color }}>
                  {mapStatus[item.status]?.label?.toUpperCase()}
                </Text>
              </Chip>
            </View>
          )}
        />
        <List.Item
          title={mapStatus[item.status]?.info}
          titleNumberOfLines={3}
          left={(props) => <List.Icon {...props} icon="help-circle-outline" />}
        />
        <List.Item
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
              title={orderDetail.note}
              description="Ucapan"
              descriptionStyle={{ fontSize: 13 }}
              left={(props) => (
                <List.Icon {...props} icon="mailbox-open-outline" />
              )}
            />
          </>
        )}
        <List.Item
          title={currency(productData.price + productData.admin)}
          description="Total Harga"
          descriptionStyle={{ fontSize: 13 }}
          left={(props) => <List.Icon {...props} icon="cash-multiple" />}
        />
        {orderData?.status == ORDER_STATUS.PENDING ? (
          <View style={{ width: "100%" }}>
            {orderData.paymentData ? (
              <List.Item
                title={dateFormat(
                  orderData?.paymentData?.expiry_date,
                  "dd MMMM yyyy hh:mm:ss"
                )}
                description="Bayar Sebelum"
                descriptionStyle={{ fontSize: 13 }}
                left={(props) => <List.Icon {...props} icon="clock-outline" />}
              />
            ) : (
              <>
                <Divider />
                <Text style={{ paddingHorizontal: 15, marginTop: 10 }}>
                  Metode Pembayaran
                </Text>
                <PaymentList
                  onSelect={(paymentId) => setSelectedPayment(paymentId)}
                  price={productData.price + productData.admin}
                  auth={auth}
                />
              </>
            )}
            <Button
              style={{ marginHorizontal: 15, marginVertical: 10 }}
              mode="contained"
              icon="cash"
              onPress={handlePay}
            >
              Bayar Sekarang
            </Button>
          </View>
        ) : orderData?.status == ORDER_STATUS.PLACED ? (
          <View style={{ marginTop: 15 }}>
            <Button mode="contained" icon="link" onPress={handleSharing}>
              Bagikan Link
            </Button>
          </View>
        ) : null}
        <View style={{ ...styles.centered, marginVertical: 15 }}>
          <Text variant="bodySmall">
            Order Time: {dateFormat(item.createdAt, "dd MMMM yyyy hh:mm:ss")}
          </Text>
        </View>
      </View>
    </ScrollView>
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
  right: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
