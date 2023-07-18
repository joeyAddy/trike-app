import axios from "axios";
import server from "../constants/server";

const axiosInstance = axios.create({
  // Set your base URL for API requests
  baseURL: server,
  // Add common headers here (if needed)
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
