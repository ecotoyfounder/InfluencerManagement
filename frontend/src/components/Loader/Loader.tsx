import React from 'react';
import './Loader.css';

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <svg
        width="71"
        height="71"
        viewBox="0 0 71 71"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="9"
          y="28"
          width="13"
          height="26"
          fill="var(--yellow-color)"
          className="bar bar-1"
        />
        <rect
          x="27"
          y="23"
          width="13"
          height="31"
          fill="var(--yellow-color)"
          className="bar bar-2"
        />
        <rect
          x="45"
          y="18"
          width="13"
          height="36"
          fill="var(--yellow-color)"
          className="bar bar-3"
        />
      </svg>
      <p className="loader-text">Loading...</p>
    </div>
  );
};

export default Loader;
