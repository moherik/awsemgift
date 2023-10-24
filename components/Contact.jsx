import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { FlatList, View } from "react-native";
import {
  AnimatedFAB,
  Avatar,
  Divider,
  List,
  TextInput,
  useTheme,
} from "react-native-paper";
import Constants from "expo-constants";
import { getToken } from "../lib/token";
import LoginBanner from "./LoginBanner";
import { useAuth } from "../hooks/useAuth";

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
  const [searchText, setSearchText] = useState();
  const [isExtended, setIsExtended] = useState(true);

  const theme = useTheme();
  const navigation = useNavigation();

  const auth = useAuth();

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  if (!auth.userData) {
    return <LoginBanner />;
  }

  return (
    <>
      <FlatList
        ListHeaderComponent={
          <View style={{ flex: 1, paddingTop: Constants.statusBarHeight }}>
            <TextInput
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
              label="Cari kontak"
              dense
              style={{ backgroundColor: theme.colors.background }}
              right={
                <TextInput.Icon
                  icon={!searchText ? "magnify" : "close"}
                  onPress={() => setSearchText("")}
                />
              }
            />
          </View>
        }
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
              />
            )}
            onPress={() => navigation.navigate("ContactDetail")}
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
