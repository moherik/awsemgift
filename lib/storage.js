import { MMKV } from "react-native-mmkv";

export const STORAGE_TYPE = {
  USER: "user",
};

export function storage(name) {
  const newStorage = new MMKV({
    id: `storage-${name}`,
    encryptionKey: "hunter2",
  });

  return newStorage;
}
