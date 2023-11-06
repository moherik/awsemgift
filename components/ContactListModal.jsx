import { createContext, useMemo, useRef, useState } from "react";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import ContactList from "./ContactList";

export const ContactListContext = createContext({});

export default function ContactListProvider({ children }) {
  const [selectedItem, setSelectedItem] = useState();

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["100%"], []);

  function open() {
    bottomSheetModalRef.current?.present();
  }

  function dismiss() {
    bottomSheetModalRef.current?.dismiss();
  }

  function onClickItem(item) {
    dismiss();
    setSelectedItem(item);
  }

  return (
    <ContactListContext.Provider
      value={{ open, dismiss, selectedItem, setSelectedItem }}
    >
      {children}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
      >
        <BottomSheetScrollView keyboardShouldPersistTaps="always">
          <ContactList enableScroll={false} onClickItem={onClickItem} />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </ContactListContext.Provider>
  );
}
