import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import { FiMenu, FiSearch, FiBell, FiMessageSquare, FiChevronDown, FiUser, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileSettings = () => {
    setProfileOpen(false);
    // Navigate or show toast — for now just stay on page
    alert('Profile Settings');
  };

  const handleSignOut = () => {
    setProfileOpen(false);
    navigate('/login');
  };

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
        
        <div className="user-dropdown-wrapper" ref={dropdownRef}>
          <div className="user-dropdown" onClick={() => setProfileOpen(!profileOpen)}>
            <div className="avatar-sm">SM</div>
            <FiChevronDown className={`dropdown-icon ${profileOpen ? 'dropdown-icon-rotated' : ''}`} />
          </div>

          {profileOpen && (
            <div className="profile-dropdown-menu">
              <div className="profile-dropdown-header">
                <p className="profile-dropdown-name">Admin</p>
                <p className="profile-dropdown-role">Driver • admin@hero.com</p>
              </div>
              <div className="profile-dropdown-divider"></div>
              <button className="profile-dropdown-item" onClick={handleProfileSettings}>
                <FiUser className="profile-dropdown-item-icon" />
                <span>Profile Settings</span>
              </button>
              <button className="profile-dropdown-item profile-dropdown-item-danger" onClick={handleSignOut}>
                <FiLogOut className="profile-dropdown-item-icon" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
