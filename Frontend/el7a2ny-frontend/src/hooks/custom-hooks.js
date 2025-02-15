import { useEffect } from "react";
import { GET } from "src/project-utils/helper-functions";

function useGet({ url, setData, setLoading, setShowError, setError, dependency }) {
  useEffect(
    () => {
      GET({ url, setData, setLoading, setShowError, setError });
    },
    dependency ? dependency : []
  );
}

export { useGet };
