import React from 'react';

interface SelectorProps<T extends string> {
  value: T;
  options: T[];
  onChange: (value: T) => void;
}

const Selector = <T extends string>({
  value,
  options,
  onChange,
}: SelectorProps<T>) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as T)}>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Selector;
