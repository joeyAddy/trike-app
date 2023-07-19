import { useState } from "react";
import axiosInstance from "./api";
import axios from "axios";

const useAxiosPost = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (url, body) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(url, body);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return { data, loading, error, postData };
};

export default useAxiosPost;
