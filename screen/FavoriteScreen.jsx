import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { List, Text } from "react-native-paper";
import Toast from "react-native-root-toast";

import api from "../lib/api";
import EmptyBanner from "../components/EmptyBanner";

export default function FavoriteScreen({ route, navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getFavorites() {
    setLoading(true);

    try {
      const resp = await api.get("products/favorite");

      setFavorites(resp.data);
    } catch (error) {
      Toast.show(error?.message || "Terjadi kesalhan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getFavorites();
  }, []);

  return (
    <FlatList
      refreshing={loading}
      onRefresh={getFavorites}
      data={favorites}
      renderItem={({ item }) => (
        <List.Item
          title={item.name}
          left={(props) => (
            <Image
              style={{
                ...props.style,
                borderRadius: 10,
                width: 40,
                height: 40,
              }}
              source={{ uri: item.logo }}
            />
          )}
          onPress={() => navigation.navigate("GiftDetail", { item: item })}
        />
      )}
      ListEmptyComponent={!loading && <EmptyBanner />}
    />
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
