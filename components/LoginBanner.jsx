import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import Constants from "expo-constants";

export default function LoginBanner({
  title = "Selamat Datang,",
  message = "Login untuk mengakses semua fitur",
  onClick,
}) {
  const theme = useTheme();

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        marginTop: Constants.statusBarHeight,
        backgroundColor: theme.colors.background,
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
