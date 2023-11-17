import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Constants from "expo-constants";

export default function EmptyBanner({
  title = "Belum ada data nih",
  message = "",
  onClick,
}) {
  const theme = useTheme();

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        marginTop: Constants.statusBarHeight,
        backgroundColor: theme.colors.background,
        gap: 4,
      }}
    >
      <Text variant="titleMedium">{title}</Text>
      <Text>{message}</Text>
    </View>
  );
}
