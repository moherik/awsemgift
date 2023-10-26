import axios from "axios";
import { getAccessToken, getRefreshToken, setAccessToken } from "./token";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    const data = response.data || {};
    const status = response.status || "";

    if (!data) {
      throw new Error("Tidak dapat terhubung ke server");
    }

    const resData = {
      message: data.message,
      status: status,
    };

    if (data.data) resData.data = data.data;

    return resData;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== "/auth/signin" && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const rs = await instance.post("auth/refresh", {
            refreshToken: await getRefreshToken(),
          });

          const { accessToken } = rs.data;
          setAccessToken(accessToken);

          return instance(originalConfig);
        } catch (_err) {
          return Promise.reject(_err);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
