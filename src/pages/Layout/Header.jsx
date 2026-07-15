import React from 'react';
import './Header.css';
import { FiMenu, FiSearch, FiBell, FiMessageSquare, FiChevronDown } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn">
          <FiMenu />
        </button>
      </div>
      
      <div className="header-center">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Quick Search..." className="search-input" />
        </div>
      </div>
      
      <div className="header-right">
        <div className="icon-group">
          <div className="icon-btn">
            <FiBell />
            <span className="badge">12</span>
          </div>
          <div className="icon-btn">
            <FiMessageSquare />
            <span className="badge">0</span>
          </div>
        </div>
        
        <div className="user-dropdown">
          <div className="avatar-sm">SM</div>
          <FiChevronDown className="dropdown-icon" />
        </div>
      </div>
    </header>
  );
};

export default Header;
