import AsyncStorage from "@react-native-async-storage/async-storage";

const storage = {
  set: async function setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log(error);
    }
  },

  get: async function getItem(key) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  update: async function updateItem(key, value) {
    try {
      await AsyncStorage.removeItem(key);
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log(error);
    }
  },

  delete: async function deleteItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  },
};

export default storage;
