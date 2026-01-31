import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyles = "py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2 shadow-sm";
  
  const variants = {
    // Primary: Cerulean Blue
    primary: "bg-uns-cerulean hover:bg-uns-sky text-white",
    // Secondary: Chrome Yellow with Cerulean Text
    secondary: "bg-uns-yellow hover:bg-uns-yellowHover text-uns-cerulean",
    // Outline: Cerulean Border
    outline: "border-2 border-uns-cerulean text-uns-cerulean hover:bg-uns-sky/5"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
