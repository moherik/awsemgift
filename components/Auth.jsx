import React, { createContext, useEffect, useState } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import {
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  setAccessToken,
  setRefreshToken,
} from "../lib/token";
import api from "../lib/api";

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [userData, setuserData] = useState({});

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      const authToken = await getAccessToken();
      if (authToken) {
        const response = await api.get("users/profile");
        setuserData(response.data);
      } else {
        throw new Error("UNAUTHORIZED");
      }
    } catch (error) {
      console.log(error);
      await signOut();
    }
  }

  async function signIn({ email, password, type = "email" }) {
    return await api
      .post("auth/signin", { email, password, type })
      .then(async (response) => {
        const data = response?.data;

        if (response.status != 200) {
          throw new Error(data.message);
        }

        if (data.accessToken && data.refreshToken) {
          const { accessToken, refreshToken, ...userData } = data;

          await setAccessToken(accessToken);
          await setRefreshToken(refreshToken);

          setuserData(userData);

          return response;
        }

        return false;
      })
      .catch((err) => {
        return err;
      });
  }

  async function signOut() {
    await deleteAccessToken();
    await deleteRefreshToken();
    await GoogleSignin.signOut();

    setuserData(undefined);
  }

  return (
    <AuthContext.Provider value={{ userData, signIn, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
