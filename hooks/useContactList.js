import { useContext } from "react";
import { ContactListContext } from "../components/ContactListModal";

export default function useContactList() {
  const context = useContext(ContactListContext);

  if (!context) {
    throw new Error(
      "useContactList must be used within an ContactListProvider"
    );
  }

  return context;
}
