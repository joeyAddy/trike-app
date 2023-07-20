// usePost.js

import { useState } from "react";

const usePost = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const postRequest = async (url, data) => {
    setIsLoading(true);
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers you might need (e.g., authorization)
        },
        body: JSON.stringify(data),
      };
      const res = await fetch(url, requestOptions);
      const json = await res.json();
      setResponse(json);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  return { response, error, isLoading, postRequest };
};

export default usePost;
