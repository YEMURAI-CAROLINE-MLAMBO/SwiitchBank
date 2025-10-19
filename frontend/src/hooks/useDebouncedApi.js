import { useState, useEffect } from 'react';

const useDebouncedApi = (apiCall, delay = 500) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!apiCall) return;

      setLoading(true);
      setError(null);

      try {
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [apiCall, delay]);

  return { data, loading, error };
};
