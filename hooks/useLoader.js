import { useContext } from "react";
import { LoaderContext } from "../components/Loader";

export default function useLoader() {
  const context = useContext(LoaderContext);

  if (!context) {
    throw new Error("useLoader must be used within an LoaderProvider");
  }

  return context;
}
