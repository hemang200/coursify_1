// import axios from "axios";

// const BASE_URL = "http://localhost:5000/api/v1";

// const axiosInstance = axios.create();

// axiosInstance.defaults.baseURL = BASE_URL;
// axiosInstance.defaults.withCredentials = true;

// export default axiosInstance;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1/",
  withCredentials: true,
});

export default axiosInstance;