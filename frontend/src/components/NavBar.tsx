import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Influencer List</Link>
        </li>
        <li>
          <Link to="/create">Create Influencer</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
