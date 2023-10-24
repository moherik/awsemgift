import AuthProvider from "./AuthContext";
import LoaderProvider from "./Loader";

export default function CustomProvider({ children }) {
  return (
    <AuthProvider>
      <LoaderProvider>{children}</LoaderProvider>
    </AuthProvider>
  );
}
