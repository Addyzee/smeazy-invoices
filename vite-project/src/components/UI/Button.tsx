// components/UI/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick,
  className = '',
  ariaLabel
}) => {
  const baseStyles = "rounded-full transition-all duration-300 font-medium";
  
  const variants = {
    primary: "bg-white text-blue-600 hover:bg-gray-100",
    secondary: "bg-green-500 text-white hover:bg-green-600",
    outline: "bg-transparent border border-white text-white hover:bg-white hover:text-blue-600"
  };
  
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-8 py-3",
    lg: "px-10 py-4 text-lg"
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};