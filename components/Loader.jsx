import { createContext, useContext, useState } from "react";
import { ActivityIndicator, Modal, Portal, Text } from "react-native-paper";

const initialState = {
  showModal: () => {},
  hideModal: () => {},
};
const LoaderContext = createContext(initialState);
export const useLoader = () => useContext(LoaderContext);

export default function LoaderProvider({ children }) {
  const [visible, setVisible] = useState(false);

  function showModal() {
    setVisible(true);
  }

  function hideModal() {
    setVisible(false);
  }

  return (
    <LoaderContext.Provider value={{ showModal, hideModal }}>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          dismissableBackButton={false}
          dismissable={false}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          contentContainerStyle={{
            backgroundColor: "white",
            marginHorizontal: 20,
            borderRadius: 10,
            padding: 15
          }}
        >
          <ActivityIndicator animating={true} size={32} />
        </Modal>
      </Portal>

      {children}
    </LoaderContext.Provider>
  );
}
