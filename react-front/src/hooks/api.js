import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

export const baseURL = "http://localhost:8080";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || "";
  }
  return "";
};

const headers = () => {
  const token = getToken();

  return {
    "Content-Type": "multipart/form-data",
    "Authorization": `Bearer ${token}`,
    "X-Custom-Header": "foobar",
   /*  "Access-Control-Allow-Origin": "*",
     "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
     "Access-Control-Allow-Methods": "GET",*/
  };
};


const api = axios.create({
  baseURL: baseURL,
  timeout: 500000,
});

api.interceptors.request.use(async config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      if (typeof window !== "undefined" && localStorage.getItem("token") !== null) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
