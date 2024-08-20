import axios from "axios";
import { store } from "../Redux/store";
import { logout } from "../Redux/userSlice";
import { logoutAdmin } from "../Redux/adminSlice";
import { logoutClient } from "../Redux/recruiterSlice";
import { refreshTokenAPI } from "./api";
import { config } from "../../config/config";

const API_URL = config.API_URL;
const USER_API_URL = config.USER_API_URL;
const CLIENT_API_URL = config.CLIENT_API_URL;
const ADMIN_API_URL = config.ADMIN_API_URL;

const createAxiosInstance = (
  baseURL,
  accessTokenKey,
  refreshTokenKey,
  logoutAction
) => {
  const instance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  instance.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem(accessTokenKey);
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
     
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const rfrshToken = localStorage.getItem(refreshTokenKey);
      

      if (error.response && error.response.status === 401 && !originalRequest._retry ) {
        originalRequest._retry = true;
        try {
          const response = await axios.post(refreshTokenAPI, 
            {
            token: rfrshToken,
          },
          {
            withCredentials: true
          }
        );

          const { accessToken, refreshToken } = response.data;
          localStorage.setItem(accessTokenKey, accessToken);
          localStorage.setItem(refreshTokenKey, refreshToken);
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return instance(originalRequest);
        } catch (err) {
          store.dispatch(logoutAction());
          return Promise.reject(err);
        }
      }

      if (!error.response) {
        console.error('Network error or no response received:', error.message);
      } else {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const userAxiosInstance = createAxiosInstance(
  USER_API_URL,
  "useraccessToken",
  "userrefreshToken",
  logout
);
export const clientAxiosInstance = createAxiosInstance(
  CLIENT_API_URL,
  "clientaccessToken",
  "clientrefreshToken",
  logoutClient
);
export const adminAxiosInstance = createAxiosInstance(
  ADMIN_API_URL,
  "adminaccessToken",
  "adminrefreshToken",
  logoutAdmin
);
