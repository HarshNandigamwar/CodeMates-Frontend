import axios from "axios";
const url = process.env.NEXT_PUBLIC_API_URL;
const axiosInstance = axios.create({
  baseURL: `${url}/api`,
  withCredentials: true,
});

export default axiosInstance;
