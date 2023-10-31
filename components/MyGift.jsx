import { View } from "react-native";
import { Appbar, Text, useTheme } from "react-native-paper";

export default function MyGift() {
  const theme = useTheme();

  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: theme.colors.primaryContainer,
        }}
      >
        <Appbar.Content title="Hadiah Saya" />
      </Appbar.Header>
    </>
  );
}
