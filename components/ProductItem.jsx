import { Dimensions, StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { Image } from "expo-image";

export default function ProductItem({
  onClick,
  item,
  numColumns,
  cardHeight,
  theme,
}) {
  return (
    <View
      style={{
        ...styles.gridItem,
        height: cardHeight,
        width: Dimensions.get("screen").width / numColumns,
      }}
    >
      <TouchableRipple
        borderless
        style={{
          ...styles.itemWrapper,
          borderColor: theme.colors.primaryContainer,
        }}
        onPress={() => onClick(item)}
      >
        <View
          style={{
            display: "flex",
            flex: 1,
            backgroundColor: theme.colors.inversePrimary,
          }}
        >
          <View
            style={{
              ...styles.itemLogo,
              backgroundColor: item?.color || theme.colors.primaryContainer,
            }}
          >
            <Image
              style={{ borderRadius: 12 }}
              source={{ uri: item?.logo }}
              width={cardHeight - 100}
              height={cardHeight - 100}
              cachePolicy="disk"
            />
          </View>
          <View style={{ paddingHorizontal: 10, paddingVertical: 8 }}>
            <Text variant="titleSmall" numberOfLines={1}>
              {item?.name}
            </Text>
            <Text variant="bodySmall" numberOfLines={1}>
              {item?.price}
            </Text>
          </View>
        </View>
      </TouchableRipple>
    </View>
  );
}

const styles = StyleSheet.create({
  gridItem: {
    display: "flex",
    justifyContent: "flex-start",
  },
  itemWrapper: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    display: "flex",
    overflow: "hidden",
  },
  itemLogo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
