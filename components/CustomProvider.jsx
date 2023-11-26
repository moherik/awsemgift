import { useTheme } from "react-native-paper";

import AuthProvider from "./Auth";
import ContactListProvider from "./ContactListModal";
import LoaderProvider from "./Loader";
import NotificationProvider from "./Notification";

export default function CustomProvider({ children }) {
  const theme = useTheme();

  return (
    <AuthProvider>
      <NotificationProvider>
        <ContactListProvider theme={theme}>
          <LoaderProvider>{children}</LoaderProvider>
        </ContactListProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
