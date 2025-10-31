import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.API_BASE_URL || "http://localhost:5001/api",
});

api.interceptors.request.use(
  (config) => {
    const storedAuth = localStorage.getItem("authAdmin");
    if (storedAuth) {
      const { token } = JSON.parse(storedAuth);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — logging out or refreshing...");
      localStorage.removeItem("authAdmin");
    }
    return Promise.reject(error);
  }
);

export default api;
