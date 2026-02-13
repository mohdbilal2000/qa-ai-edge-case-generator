
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className, 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-2xl font-black uppercase tracking-wider transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm active:scale-[0.98]";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/25 focus:ring-indigo-500/40",
    secondary: "bg-white text-slate-800 border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 focus:ring-slate-400/20",
    danger: "bg-rose-600 text-white hover:bg-rose-700 hover:shadow-rose-500/25 focus:ring-rose-500/40"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
