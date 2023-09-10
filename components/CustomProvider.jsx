import LoaderProvider from "./Loader";

export default function CustomProvider({ children }) {
  return <LoaderProvider>{children}</LoaderProvider>;
}
