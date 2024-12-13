import React from 'react';
import './Input.css';

interface TextInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  type?: string;
}

const Input: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  required = false,
  type = 'text',
}) => {
  return (
    <div className="input-container">
      {label && <label>{label}</label>}
      <input
        className="input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
      />
    </div>
  );
};

export default Input;
