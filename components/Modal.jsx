import { createContext, useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { Modal, Portal, Text } from "react-native-paper";

const initialState = {
  showModal: () => {},
  dismissModal: () => {},
};
const ModalContext = createContext(initialState);
export const useModal = () => useContext(ModalContext);

export default function ModalProvider({ children }) {
  const [visible, setVisible] = useState(false);

  function showModal() {
    setVisible(true);
  }

  function dismissModal() {
    setVisible(false);
  }

  return (
    <ModalContext.Provider value={{ showModal, dismissModal }}>
      <Portal>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={dismissModal}
            contentContainerStyle={styles.container}
          >
            <Text>Example Modal. Click outside this area to dismiss.</Text>
          </Modal>
        </Portal>
      </Portal>

      {children}
    </ModalContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "white", padding: 20 },
});
