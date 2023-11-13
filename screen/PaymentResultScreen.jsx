import { useEffect, useState } from "react";
import { Share, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import LottieView from "lottie-react-native";
import Toast from "react-native-root-toast";

import api from "../lib/api";
import useLoader from "../hooks/useLoader";

export default function PaymentResultScreen({ route, navigation }) {
  const [orderData, setOrderData] = useState();
  const [loading, setLoading] = useState(true);

  const { orderId } = route.params;

  const { showLoader, dismissLoader } = useLoader();

  useEffect(() => {
    async function checkStatus(orderId) {
      showLoader();

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
          dismissLoader();
        });
    }

    setTimeout(() => {
      checkStatus(orderId);
    }, 3000);
  }, []);

  async function handleSharing() {
    try {
      Share.share({ message: orderData?.message, url: orderData?.url }).catch();
    } catch (error) {
      Toast.show(error?.message || "Sharing error");
    }
  }

  return (
    <View style={styles.container}>
      {!orderData?.status && loading ? (
        <ActivityIndicator />
      ) : orderData?.status == 0 ? (
        <View style={styles.centered}>
          <LottieView
            autoPlay
            loop={false}
            style={{
              width: 200,
              height: 200,
            }}
            source={require("../assets/lottie-success.json")}
          />
          <View style={{ gap: 2, marginBottom: 20 }}>
            <Text style={{ textAlign: "center" }} variant="headlineSmall">
              Hadiah Berhasil Ditambahkan
            </Text>
            <Text style={{ textAlign: "center" }} variant="bodyMedium">
              Bagikan link untuk mengambil hadiah
            </Text>
          </View>
          <Button mode="contained" icon="link" onPress={handleSharing}>
            Bagikan Link
          </Button>
          <Button style={{ marginTop: 20 }} onPress={() => navigation.goBack()}>
            Kembali
          </Button>
        </View>
      ) : (
        <Text>Not Sukses</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  centered: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
  },
});
