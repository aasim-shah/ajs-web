import { baseUrl, filesServerBaseUrl } from "@/utils/constants";
import { getValueFromLocalStorage } from "@/utils/reuseableMethods";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${baseUrl}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getValueFromLocalStorage("accessToken");
    if (accessToken && config.headers.requiresAuth) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const axiosFilesInstance = axios.create({
  baseURL: `${filesServerBaseUrl}/api/v1`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

axiosFilesInstance.interceptors.request.use(
  (config) => {
    const accessToken = getValueFromLocalStorage("accessToken");
    if (accessToken && config.headers.requiresAuth) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosFilesInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
