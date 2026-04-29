import { useState, useEffect } from 'react';
import api from '@/lib/api';

export const useDemoAdmin = () => {
  const [demos, setDemos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDemos = async () => {
    try {
      const res = await api.get('/demo/admin/list');
      setDemos(res.data);
    } catch (err) {
      console.error("Failed to fetch demo requests", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDemos(); }, []);

  return { demos, isLoading, refresh: fetchDemos };
};