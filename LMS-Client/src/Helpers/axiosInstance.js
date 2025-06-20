

import axios from "axios";
const backend_domain = import.meta.env.VITE_BAACKEND_URL;
const axiosInstance = axios.create({
  baseURL: backend_domain/api/v1,
  withCredentials: true,
});

export default axiosInstance;