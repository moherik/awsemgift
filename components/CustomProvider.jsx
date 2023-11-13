import AuthProvider from "./AuthContext";
import ContactListProvider from "./ContactListModal";
import ModalProvider from "./Modal";
import LoaderProvider from "./Loader";

export default function CustomProvider({ children }) {
  return (
    <AuthProvider>
      <ContactListProvider>
        <ModalProvider>
          <LoaderProvider>{children}</LoaderProvider>
        </ModalProvider>
      </ContactListProvider>
    </AuthProvider>
  );
}
