import React, { createContext, useEffect, useState } from "react";
import { sender } from "../lib/sender";
import { deleteToken, getToken, setToken } from "../lib/token";

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [userData, setuserData] = useState({});

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    const authToken = await getToken();
    if (authToken) {
      setuserData(authToken);
    }
  }

  async function signIn(email, password) {
    return await sender({
      url: "users/login",
      data: { email, password },
      method: "POST",
    })
      .then(async (response) => {
        const data = response?.data;

        if (response.status != 200) {
          throw new Error(data.message);
        }

        if (data.token) {
          await setToken(data.token);
          setuserData(data);

          return true;
        }

        return false;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  async function signOut() {
    await deleteToken();
    setuserData(undefined);
  }

  return (
    <AuthContext.Provider value={{ userData, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
