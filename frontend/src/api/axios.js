import axios from "axios";

const baseURL = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "") + "/api";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("edesa_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      // token invalid -> logout otomatis
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register") {
        localStorage.removeItem("edesa_token");
        localStorage.removeItem("edesa_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
