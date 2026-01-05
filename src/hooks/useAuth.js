import { useEffect, useState, useCallback } from 'react';
import { signup as fbSignup, login as fbLogin, logout as fbLogout, onAuthState, getAuthInstance } from '../lib/firebase/auth';
import { getUserById, setUserOnline } from '../lib/firebase/users';
import { useAppStore } from '../store/useAppStore';

export const useAuth = () => {
  const { setUser } = useAppStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onAuthState(async (user) => {
      if (user) {
        const profile = await getUserById(user.uid);
        setUser({ uid: user.uid, email: user.email, ...profile });
        await setUserOnline(user.uid, true);
      } else {
        setUser(null);
      }
    });

    // clean-up: set offline when tab closes
    const auth = getAuthInstance();
    const handleBeforeUnload = async () => {
      const u = auth.currentUser;
      if (u) await setUserOnline(u.uid, false);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      unsub();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [setUser]);

  const signup = useCallback(async (data) => {
    setError(null);
    try {
      const user = await fbSignup(data);
      return user;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const login = useCallback(async (data) => {
    setError(null);
    try {
      const user = await fbLogin(data);
      return user;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await fbLogout();
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  return { signup, login, logout, error };
};
