/* ============================================
   API BASE URL + AXIOS INSTANCE
   --------------------------------------------
   Local: falls back to http://localhost:5000 with no .env
   Deploy: set VITE_API_URL on Vercel,
            e.g. https://munchbox-api.onrender.com
   ============================================ */

import axios from "axios";

const RAW =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/* Strip the trailing slash so we never build a double // */
export const SERVER_URL = RAW.replace(/\/+$/, "");

export const API = `${SERVER_URL}/api`;

export const TOKEN_KEY = "munchbox-token";

/* The backend returns "/uploads/xyz.jpg" — make it absolute */
export const imageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  if (image.startsWith("data:")) return image;
  return `${SERVER_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

/* ============================================
   TOKEN HELPERS
   ============================================ */

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* localStorage can be blocked in private mode */
  }
};

/* ============================================
   AXIOS INSTANCE
   --------------------------------------------
   The token is attached to every request, and a
   401 clears it and sends the user back to login.
   ============================================ */

export const api = axios.create({
  baseURL: API,
  timeout: 20000,
});

/* REQUEST — token attach */

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* RESPONSE — 401 pe logout */

let onUnauthorized = null;

export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      setToken(null);

      if (onUnauthorized) onUnauthorized();
    }

    return Promise.reject(error);
  }
);

/* Helper to pull the message out of a failed response */

export const errorMessage = (error, fallback = "Something went wrong.") =>
  error?.response?.data?.message || fallback;

export default API;
