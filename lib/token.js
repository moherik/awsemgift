import jwtDecode from "jwt-decode";
import { fromUnixTime, isBefore } from "date-fns";

import { STORAGE_TYPE, storage } from "./storage";
const KEY = "user.token";

export function setToken(token) {
  storage(STORAGE_TYPE.USER).set(KEY, token);
  return token;
}

export function getToken() {
  let token = storage(STORAGE_TYPE.USER).getString(KEY);
  if (!token) return null;

  const decode = jwtDecode(token);
  if (isBefore(fromUnixTime(decode.exp), new Date())) {
    // refresh token;
    console.log("refresh");
  }

  return token;
}

export function deleteToken() {
  storage(STORAGE_TYPE.USER).delete(KEY);
}
