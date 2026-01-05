import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

const ProfileNavbar = () => {
  const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

     useEffect(() => {
          setMounted(true);
        }, []);
  

  return (
    <header className="w-full bg-[var(--bg-surface)] border-b border-[var(--border-main)]">
      <div className="px-18 py-4 flex items-center justify-between">
        <Link to="/" className="text-3xl font-bold text-[var(--accent-primary)]">Chatly</Link>

        <div className="flex items-center gap-3">
          {mounted && (
              <motion.button
              whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="w-11 h-11 flex justify-center items-center rounded-full bg-[var(--bg-main)] text-[var(--text-main)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-main)] border border-[var(--accent-primary)] transition"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={21}/> : <Moon size={21}/>}
              </motion.button>
            )}
        </div>
      </div>
    </header>
  );
};

export default ProfileNavbar;
