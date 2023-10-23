import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";

export default function LoginBanner({}) {
  const navigation = useNavigation();

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
      <Text variant="titleLarge">Hola,</Text>
      <Text style={{ marginTop: 20, marginBottom: 10 }}>
        Login untuk mengakses semua fitur
      </Text>
      <Button mode="contained" onPress={() => navigation.navigate("Login")}>
        MASUK
      </Button>
    </View>
  );
}
