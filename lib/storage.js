import { MMKV } from "react-native-mmkv";

export function storage(name) {
  const newStorage = new MMKV({
    id: `storage-${name}`,
    encryptionKey: "hunter2",
  });

  return newStorage;
}
