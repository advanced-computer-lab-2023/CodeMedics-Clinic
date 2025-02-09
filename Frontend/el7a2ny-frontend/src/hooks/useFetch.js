import axios from "axios";
import { useEffect } from "react";
function useFetch({ url, body, setData, setLoading, setShowError, setError }) {
  useEffect(() => {
    setLoading(true);
    axios(url, body)
      .then((response) => {
        setData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setShowError(true);
        setError(error.response.data.message);
      });
  }, []);
}

export default useFetch;
