import { createContext, useContext, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";

const initialState = {
  showLoader: () => {},
  dismissLoader: () => {},
};
export const LoaderContext = createContext(initialState);

export default function LoaderProvider({ children }) {
  const [visible, setVisible] = useState(false);

  const theme = useTheme();

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
            backgroundColor: theme.colors.background,
            marginHorizontal: 20,
            borderRadius: 10,
            padding: 15,
          }}
        >
          <ActivityIndicator
            color={theme.colors.primary}
            animating={true}
            size={32}
          />
        </Modal>
      </Portal>

      {children}
    </LoaderContext.Provider>
  );
}
