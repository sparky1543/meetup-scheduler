import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  className = ''
}) => {
  const getButtonClass = () => {
    const baseClass = 'btn';
    const variantClass = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      social: 'btn-social'
    }[variant];
    
    return `${baseClass} ${variantClass} ${className}`;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={getButtonClass()}
    >
      {children}
    </button>
  );
};

export default Button;