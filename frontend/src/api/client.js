
import axios from "axios";

// Base URL for the Spring Boot backend
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 15000,
});

export const TOKEN_KEY = "gh_token";

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Storage unavailable
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Ignore storage errors
  }
};

// Attach the JWT token to every request
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle expired login sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const sentToken = Boolean(
      error.config?.headers?.Authorization
    );

    if (
      error.response?.status === 401 &&
      sentToken &&
      !url.startsWith("/auth/login")
    ) {
      window.dispatchEvent(new Event("auth:expired"));
    }

    return Promise.reject(error);
  }
);

// Convert API errors into readable messages
export function getErrorMessage(
  error,
  fallback = "Something went wrong. Please try again."
) {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.code === "ECONNABORTED") {
    return "The server took too long to answer. Please try again.";
  }

  if (error?.request && !error?.response) {
    return "Cannot reach the server. Check that the backend is running on port 8080.";
  }

  return fallback;
}

// Return field-level validation errors
export function getFieldErrors(error) {
  return error?.response?.data?.fieldErrors || {};
}

export default api;
