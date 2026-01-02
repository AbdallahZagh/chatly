import { forwardRef } from 'react';

const Input = forwardRef(({ label, icon: Icon, error, ...props }, ref) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-sm font-medium text-app-text/80 px-1">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />}
        <input
          ref={ref}
          className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 bg-app-bg border ${
            error ? 'border-status-error' : 'border-app-border'
          } rounded-xl focus:ring-2 focus:ring-brand-primary/50 outline-none transition-all text-app-text`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-status-error px-1 font-medium">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;