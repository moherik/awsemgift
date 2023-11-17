import { useEffect, useState } from "react";
import { FlatList, Image, View } from "react-native";
import { Appbar, List, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import api from "../lib/api";
import useAuth from "../hooks/useAuth";
import { dateFormat } from "../lib/formatter";

import LoginBanner from "./LoginBanner";
import { giftStatus } from "../constants";
import EmptyBanner from "./EmptyBanner";

export default function History() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const navigation = useNavigation();
  const auth = useAuth();

  const mapStatus = giftStatus(theme);

  async function getHistoryGift() {
    setLoading(true);

    await api
      .get("gifts")
      .then((resp) => {
        setGifts(resp.data);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setGifts([]);

    if (auth.userData) {
      getHistoryGift();
    }
  }, [auth.userData]);

  function handleClickLogin() {
    navigation.navigate("Login");
  }

  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: theme.colors.primaryContainer,
        }}
      >
        <Appbar.Content title="Riwayat Transaksi" />
      </Appbar.Header>
      <FlatList
        style={{ backgroundColor: theme.colors.background }}
        refreshing={loading}
        onRefresh={auth.userData ? getHistoryGift : null}
        data={gifts}
        ListHeaderComponent={
          !auth.userData ? <LoginBanner onClick={handleClickLogin} /> : null
        }
        renderItem={({ item }) => (
          <List.Item
            title={item.orderDetail.productData.name}
            description={() => (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text>{item.billInfo2}</Text>
                <Text variant="bodySmall">
                  {dateFormat(item.createdAt, "dd MMM yyyy hh:ii")}
                </Text>
              </View>
            )}
            left={(props) => (
              <Image
                style={{
                  ...props.style,
                  borderRadius: 10,
                  width: 40,
                  height: 40,
                }}
                source={{ uri: item.orderDetail?.productData?.group?.logo }}
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
                <Text
                  style={{
                    marginBottom: 2,
                    color: mapStatus[item.status].color,
                  }}
                >
                  {mapStatus[item.status]?.label?.toUpperCase()}
                </Text>
              </View>
            )}
            onPress={() => navigation.navigate("GiftDetail", { item: item })}
          />
        )}
        ListEmptyComponent={!loading && <EmptyBanner />}
      />
    </>
  );
}
