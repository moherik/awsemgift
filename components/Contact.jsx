import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { AnimatedFAB, TextInput, useTheme } from "react-native-paper";
import Constants from "expo-constants";

import useAuth from "../hooks/useAuth";

import LoginBanner from "./LoginBanner";
import ContactList from "./ContactList";

export default function Contact() {
  const [searchText, setSearchText] = useState();
  const [isExtended, setIsExtended] = useState(true);

  const theme = useTheme();
  const navigation = useNavigation();
  const auth = useAuth();

  if (!auth.userData) {
    return <LoginBanner />;
  }

  return (
    <>
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

      <ContactList onClickItem={() => {}} />

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
