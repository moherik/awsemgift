import { useTheme } from "react-native-paper";
import AuthProvider from "./AuthContext";
import ContactListProvider from "./ContactListModal";
import LoaderProvider from "./Loader";

export default function CustomProvider({ children }) {
  const theme = useTheme();

  return (
    <AuthProvider>
      <ContactListProvider theme={theme}>
        <LoaderProvider>{children}</LoaderProvider>
      </ContactListProvider>
    </AuthProvider>
  );
}
