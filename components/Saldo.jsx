import { useCallback, useMemo, useRef } from "react";
import { View } from "react-native";
import { Avatar, Button, IconButton, Surface, Text } from "react-native-paper";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

export default function Saldo() {
  const bottomSheetModalRef = useRef();
  const snapPoints = useMemo(() => ["50%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <BottomSheetModalProvider>
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
            <Text variant="bodyLarge" style={{ fontWeight: "700" }}>
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
          <IconButton
            icon="dots-vertical"
            mode="contained"
            onPress={handlePresentModalPress}
          />
        </View>
      </Surface>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 4,
          shadowRadius: 3.84,

          elevation: 5,
        }}
      >
        <View>
          <Text>Awesomse 🎉</Text>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}
