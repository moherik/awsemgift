import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { FlatList } from "react-native";
import {
  AnimatedFAB,
  Avatar,
  Divider,
  List,
  useTheme,
} from "react-native-paper";

const data = [
  {
    id: 1,
    name: "Erik Maulana",
    phone: "085157759782",
  },
  {
    id: 2,
    name: "Erika Maulani",
    phone: "087875900664",
  },
];

export default function Contact() {
  const [isExtended, setIsExtended] = useState(true);

  const theme = useTheme();
  const navigation = useNavigation();

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  return (
    <>
      <FlatList
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={<Divider />}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={item.phone}
            descriptionStyle={{ fontSize: 12, marginTop: 2 }}
            left={(props) => (
              <Avatar.Icon
                {...props}
                size={32}
                color={theme.colors.background}
                icon="account"
                // style={{ marginTop: 8, marginLeft: 15 }}
              />
            )}
            onPress={() => navigation.navigate('ContactDetail')}
          />
        )}
        data={data}
        onScroll={onScroll}
      />

      <AnimatedFAB
        icon="plus"
        label="Tambah"
        extended={isExtended}
        onPress={() => navigation.navigate("AddContact")}
        animateFrom="right"
        iconMode="dynamic"
        style={[{ bottom: 16, right: 16, position: "absolute", elevation: 1 }]}
      />
    </>
  );
}
