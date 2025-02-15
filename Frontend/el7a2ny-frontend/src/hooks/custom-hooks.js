import axios from "axios";
import { useEffect } from "react";
function useGet({ url, setData, setLoading, setShowError, setError }) {
  useEffect(() => {
    axios(url, { withCredentials: true })
      .then((response) => {
        console.log("data ", response);
        setData(response.data.data);
        if (setLoading) setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setShowError(true);
        setError(error.response.data.message);
      });
  }, []);
}

function usePost({ url, body, setData, setLoading, setShowError, setError }) {
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

function usePatch({ url, body, setData, setLoading, setShowError, setError }) {
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

function useDelete({ url, body, setData, setLoading, setShowError, setError }) {
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

export { useGet, usePost, usePatch, useDelete };
