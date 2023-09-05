import { useCallback, useMemo, useRef } from "react";
import { View } from "react-native";
import { Avatar, Button, IconButton, Surface, Text } from "react-native-paper";

export default function Saldo() {
  return (
    <Surface
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Avatar.Icon size={32} icon="wallet" />
        <View style={{ marginLeft: 15 }}>
          <Text variant="labelMedium">Saldo Anda</Text>
          <Text variant="bodyLarge" style={{ fontWeight: "600" }}>
            Rp50.000
          </Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Button
          icon="plus-box"
          mode="contained"
          onPress={() => console.log("Pressed")}
        >
          Topup
        </Button>
      </View>
    </Surface>
  );
}
