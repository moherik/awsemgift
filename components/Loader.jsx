import { createContext, useContext, useState } from "react";
import { ActivityIndicator, Modal, Portal, Text } from "react-native-paper";

const initialState = {
  showLoader: () => {},
  dismissLoader: () => {},
};
export const LoaderContext = createContext(initialState);

export default function LoaderProvider({ children }) {
  const [visible, setVisible] = useState(false);

  function showLoader() {
    setVisible(true);
  }

  function dismissLoader() {
    setVisible(false);
  }

  return (
    <LoaderContext.Provider value={{ showLoader, dismissLoader }}>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={dismissLoader}
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
            padding: 15,
          }}
        >
          <ActivityIndicator animating={true} size={32} />
        </Modal>
      </Portal>

      {children}
    </LoaderContext.Provider>
  );
}
