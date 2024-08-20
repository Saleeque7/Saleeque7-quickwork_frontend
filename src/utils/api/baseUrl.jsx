import axios from 'axios';
import { config } from "../../config/config";

const API_URL = config.API_URL

const createAxiosInstance = (baseURL) => {
  return axios.create({
    baseURL,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true,
  });
};

export const AuthAxios = createAxiosInstance(`${API_URL}`);
export const UserAxios = createAxiosInstance(`${API_URL}/user`);
export const ClientAxios = createAxiosInstance(`${API_URL}/client`);
export const AdminAxios = createAxiosInstance(`${API_URL}/admin`);



