import React, { createContext, useEffect, useState } from "react";

import {
  deleteAccessToken,
  deleteRefreshToken,
  deleteToken,
  getAccessToken,
  setAccessToken,
  setRefreshToken,
} from "../lib/token";
import api from "../lib/api";

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [userData, setuserData] = useState({});

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    const authToken = await getAccessToken();
    if (authToken) {
      setuserData(authToken);
    } else {
      setuserData(undefined);
    }
  }

  async function signIn(email, password) {
    return await api
      .post("/auth/signin", { email, password })
      .then(async (response) => {
        const data = response?.data;

        if (response.status != 200) {
          throw new Error(data.message);
        }

        if (data.accessToken && data.refreshToken) {
          await setAccessToken(data.accessToken);
          await setRefreshToken(data.refreshToken);
          setuserData(data);

          return true;
        }

        return false;
      })
      .catch((err) => {
        return false;
      });
  }

  async function signOut() {
    await deleteAccessToken();
    await deleteRefreshToken();

    setuserData(undefined);
  }

  return (
    <AuthContext.Provider value={{ userData, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
