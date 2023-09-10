import React, { useMemo } from "react";
import { Dimensions, Image, Pressable } from "react-native";
import { useTheme } from "react-native-paper";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const AnimatedTouchable = Animated.createAnimatedComponent(Pressable);

const CustomBackdrop = ({ animatedIndex, style, color, cover, onPress }) => {
  const theme = useTheme();

  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value + 1,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: color || theme.colors.primaryContainer,
        display: "flex",
        flex: 1,
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  return (
    <AnimatedTouchable style={containerStyle} onPress={onPress}>
      {cover && (
        <Image
          style={{ opacity: 0.8 }}
          source={{ uri: cover }}
          width={Dimensions.get("window").width}
          height={Dimensions.get("window").width / 2}
        />
      )}
    </AnimatedTouchable>
  );
};

export default CustomBackdrop;
