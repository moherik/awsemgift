import { FlatList, View } from "react-native";
import { Avatar, Divider, List, Text, useTheme } from "react-native-paper";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";

const data = [
  {
    id: 1,
    name: "PLN Prabayar (Token)",
    icon: "lightning-bolt",
    date: "30 Juni 2023",
    price: "Rp100.000",
    type: "kredit",
  },
  {
    id: 2,
    name: "Deposit Akun",
    icon: "wallet",
    date: "30 Juni 2023",
    price: "Rp100.000",
    type: "debit",
  },
];

export default function Report() {
  const theme = useTheme();

  return (
    <FlatList
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={<Divider />}
      renderItem={({ item }) => (
        <List.Item
          title={item.name}
          description={item.date}
          descriptionStyle={{ fontSize: 12, marginTop: 2 }}
          left={(props) => (
            <Avatar.Icon
              {...props}
              size={32}
              color={theme.colors.background}
              icon={item.icon}
            />
          )}
          right={(props) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <Icons
                name={
                  item.type == "kredit" ? "arrow-up-bold" : "arrow-down-bold"
                }
                color={
                  item.type == "kredit"
                    ? theme.colors.error
                    : theme.colors.primary
                }
              />
              <Text
                variant="bodyMedium"
                style={{
                  fontWeight: "700",
                  marginLeft: 5,
                  color:
                    item.type == "kredit"
                      ? theme.colors.error
                      : theme.colors.primary,
                }}
              >
                {item.price}
              </Text>
            </View>
          )}
          onPress={() => {}}
        />
      )}
      data={data}
    />
  );
}
