import { useState, useEffect } from 'react';
import axios from 'axios';
const api = import.meta.env.VITE_API_URL;

export const useAuth = () => {
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${api}/info`, { withCredentials: true });
        if (res.data.username) setLoggedIn(true);
        else setLoggedIn(false);
      } catch {
        setLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  return loggedIn;
};
