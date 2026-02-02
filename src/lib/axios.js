import axios from "axios";

// const port = process.env.NEXT_PUBLIC_PORT!

const axiosInstance = axios.create({
  //   baseURL: port,
  baseURL: "http://localhost:5000/api",
});

// Har request se pehle token add karne ke liye interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
