import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { List } from "react-native-paper";
import * as Contacts from "expo-contacts";

export default function ContactList({ onClickItem, enableScroll = true }) {
  const [contacts, setContacts] = useState([]);

  async function getListContact() {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        setContacts(data);
      }
    }
  }

  useEffect(() => {
    getListContact();
  }, []);

  return (
    <FlatList
      scrollEnabled={enableScroll}
      data={contacts}
      renderItem={({ item }) => (
        <List.Item
          title={item.name}
          description={item.phoneNumbers[0].number}
          onPress={() => onClickItem(item)}
        />
      )}
    />
  );
}
