import { motion } from 'framer-motion';

const Button = ({ children, isLoading, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-brand-primary text-white hover:bg-brand-primary/90',
    secondary: 'bg-app-surface text-app-text border border-app-border hover:bg-app-bg',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${variants[variant]}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;