import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { List, TextInput } from "react-native-paper";
import * as Contacts from "expo-contacts";

let tempData = [];

export default function ContactList({ onClickItem, enableScroll = true }) {
  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState();

  async function getListContact() {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        tempData = data;
        setContacts(data);
      }
    }
  }

  useEffect(() => {
    getListContact();
  }, []);

  useEffect(() => {
    let filteredData = tempData;

    if (searchText) {
      filteredData = filteredData.filter((contact) =>
        contact.name
          ? contact.name.toLowerCase().includes(searchText.toLowerCase())
          : null
      );
    }

    setContacts(filteredData);
  }, [searchText]);

  return (
    <FlatList
      ListHeaderComponent={
        <View style={{ flex: 1 }}>
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
      stickyHeaderIndices={[0]}
      scrollEnabled={enableScroll}
      data={contacts}
      renderItem={({ item }) => (
        <List.Item
          title={item.name}
          description={item.phoneNumbers ? item.phoneNumbers[0]?.number : ""}
          left={(props) => <List.Icon {...props} icon="account-circle" />}
          onPress={() => onClickItem(item)}
        />
      )}
    />
  );
}
