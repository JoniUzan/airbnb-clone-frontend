import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_BACKEND_BASE_URL
      : "http://localhost:3000/api", // Ensure you include "http://" or "https://" for localhost
});

api.interceptors.request.use(
  (config) => {
    let token: string | undefined | null = localStorage.getItem("token");
    token = token?.slice(1, -1);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Error response:", error.response);
    } else if (error.request) {
      // No response was received
      console.error("Error request:", error.request);
    } else {
      // Something else triggered the error
      console.error("Error message:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
