import { useState } from "react";
import { FlatList, View } from "react-native";
import {
  Button,
  Checkbox,
  IconButton,
  List,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";

export default function SelectOption({
  data,
  label,
  name,
  placeholder,
  onBlur,
  onChange,
  ...props
}) {
  const [value, setValue] = useState();
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: "white",
            marginHorizontal: 20,
            borderRadius: 10,
          }}
        >
          <View
            style={{
              paddingTop: 10,
              paddingLeft: 20,
              paddingRight: 10,
              paddingBottom: 10,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text variant="titleMedium">{label}</Text>
            <IconButton icon="close" size={24} onPress={hideModal} />
          </View>
          <FlatList
            style={{ borderStyle: "solid", borderColor: "#000" }}
            renderItem={({ item }) => (
              <Checkbox.Item
                label={item.label}
                mode="android"
                status={item.value == selectedItem?.value ? "checked" : "unchecked"}
                onPress={() => {
                  setSelectedItem(item);
                }}
              />
            )}
            data={data}
          />
          <View style={{ padding: 20 }}>
            <Button
              mode="contained"
              onPress={() => {
                onChange(selectedItem.value);
                setValue(selectedItem.label)
                hideModal();
              }}
            >
              OK
            </Button>
          </View>
        </Modal>
      </Portal>

      <TextInput
        {...props}
        mode="outlined"
        value={value}
        label={label}
        placeholder={placeholder || ""}
        onBlur={onBlur}
        onChange={onChange}
        onPressIn={showModal}
        readOnly
        style={{ backgroundColor: theme.colors.background }}
        right={<TextInput.Icon icon="chevron-down" onPress={showModal} />}
      />
    </>
  );
}
