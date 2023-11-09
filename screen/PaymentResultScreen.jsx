import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

import api from "../lib/api";
import { useLoader } from "../components/Loader";

export default function PaymentResultScreen({ route, navigation }) {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState();
  const { orderId } = route.params;

  const { showModal, hideModal } = useLoader();

  useEffect(() => {
    async function checkStatus(orderId) {
      showModal();

      await api
        .post("/gifts/status", {
          orderId,
        })
        .then((resp) => {
          setStatus(resp.data.status);
        })
        .finally(() => {
          setLoading(false);
          hideModal();
        });
    }

    checkStatus(orderId);
  }, []);

  return (
    <View style={styles.container}>
      {!status && loading ? (
        <Text>Loading...</Text>
      ) : status == 0 ? (
        <View style={styles.centered}>
          <Text>Sukses</Text>
          <Button onPress={() => navigation.goBack()}>Kembali</Button>
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
  },
});
