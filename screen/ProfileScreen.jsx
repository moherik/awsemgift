import { Alert, StyleSheet, View } from "react-native";
import { Avatar, Divider, IconButton, List, Text } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";
import Constants from "expo-constants";
import Toast from "react-native-root-toast";

import api from "../lib/api";
import useLoader from "../hooks/useLoader";
import useAuth from "../hooks/useAuth";

export default function ProfileScreen({ route, navigation }) {
  const data = route.params;

  const auth = useAuth();
  const { showLoader, dismissLoader } = useLoader();

  function handleDeleteAccount() {
    Alert.alert("Hapus Akun?", "Anda yakin ingin menghapus akun ini?", [
      {
        text: "Batal",
        onPress: () => null,
      },
      { text: "OK", onPress: () => deleteAccount() },
    ]);
  }

  async function deleteAccount() {
    try {
      showLoader();

      const resp = await api.delete("users");
      if (resp.status != 200) throw new Error("Terjadi kesalahan");

      auth.signOut();

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Home" }],
        })
      );
    } catch (error) {
      Toast.show(error.message || "Terjadi kesalahan");
    } finally {
      dismissLoader();
    }
  }

  return (
    <View style={{ paddingTop: Constants.statusBarHeight }}>
      <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
      <View style={styles.header}>
        {data?.avatarUrl ? (
          <Avatar.Image source={{ uri: data?.avatarUrl }} size={80} />
        ) : (
          <Avatar.Text label={data.name} />
        )}
        <View style={styles.centered}>
          <Text variant="titleMedium">{data.name}</Text>
          <Text>{data.email}</Text>
        </View>
      </View>
      <Divider />
      <List.Item
        title={data.phone}
        description="Nomor Telepon"
        left={(props) => <List.Icon {...props} icon="phone" />}
      />
      <List.Item
        title={data.email}
        description="Email"
        left={(props) => <List.Icon {...props} icon="email-outline" />}
      />
      <List.Item
        title="Hapus Akun"
        onPress={handleDeleteAccount}
        left={(props) => <List.Icon {...props} icon="account-outline" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  centered: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  avatar: {},
});
