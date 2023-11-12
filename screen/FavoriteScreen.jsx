import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function FavoriteScreen({ route, navigation }) {
  return (
    <View style={styles.container}>
      <Text>Fav</Text>
    </View>
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
