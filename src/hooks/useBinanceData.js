import { useState, useEffect } from 'react';
import { fetchKlines } from '../api/binance';

export function useBinanceData(symbol, timeframe) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchKlines(symbol, timeframe);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [symbol, timeframe]);

  return { data, loading, error };
}
