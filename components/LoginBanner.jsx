import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import Constants from "expo-constants";

export default function LoginBanner({
  title = "Hola,",
  message = "Login untuk mengakses semua fitur",
  onClick,
}) {
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        marginTop: Constants.statusBarHeight,
      }}
    >
      <Text variant="titleLarge">{title}</Text>
      <Text style={{ marginTop: 20, marginBottom: 10 }}>{message}</Text>
      <Button mode="contained" onPress={onClick}>
        MASUK
      </Button>
    </View>
  );
}
