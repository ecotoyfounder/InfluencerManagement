import React from 'react';
import './Selector.css';

interface SelectorProps<T extends string> {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  placeholder?: string;
}

const Selector = <T extends string>({
  value,
  options,
  onChange,
  placeholder,
}: SelectorProps<T>) => {
  return (
    <select
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
    >
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Selector;
