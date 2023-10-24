import jwtDecode from "jwt-decode";
import { fromUnixTime, isBefore } from "date-fns";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "user.token";

export async function setToken(token) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken() {
  let token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (!token) return null;

  const decode = jwtDecode(token);
  if (isBefore(fromUnixTime(decode.exp), new Date())) {
    // refresh token;
    console.log("refresh");
  }

  return token;
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
