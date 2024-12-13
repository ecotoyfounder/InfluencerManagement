import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="nav-container">
      <ul className="link-container">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'active-link' : 'link')}
          >
            Influencer List
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/create"
            className={({ isActive }) => (isActive ? 'active-link' : 'link')}
          >
            Create Influencer
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
