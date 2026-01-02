import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export const useInitializeTheme = () => {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
};