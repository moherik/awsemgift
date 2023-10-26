import AuthProvider from "./AuthContext";
import ContactListProvider from "./ContactListModal";
import LoaderProvider from "./Loader";

export default function CustomProvider({ children }) {
  return (
    <AuthProvider>
      <ContactListProvider>
        <LoaderProvider>{children}</LoaderProvider>
      </ContactListProvider>
    </AuthProvider>
  );
}
