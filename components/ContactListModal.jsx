import { createContext, useMemo, useRef, useState } from "react";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";

import ContactList from "./ContactList";

export const ContactListContext = createContext({});

export default function ContactListProvider({ children, theme }) {
  const [selectedItem, setSelectedItem] = useState();

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["96%"], []);

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
        handleStyle={{ backgroundColor: theme.colors.background }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.inverseSurface }}
      >
        <BottomSheetScrollView
          style={{ backgroundColor: theme.colors.background }}
        >
          <ContactList
            enableScroll={false}
            onBack={() => dismiss()}
            onClickItem={onClickItem}
          />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </ContactListContext.Provider>
  );
}
