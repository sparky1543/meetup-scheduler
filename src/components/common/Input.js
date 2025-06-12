import React from 'react';

const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  disabled = false,
  className = ''
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`form-input ${className}`}
    />
  );
};

export default Input;