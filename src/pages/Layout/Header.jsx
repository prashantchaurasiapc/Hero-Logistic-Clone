<<<<<<< HEAD
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

=======
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { 
  Menu, Search, Bell, MessageSquare, ChevronDown, User, LogOut 
} from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDispatcher = location.pathname.startsWith('/dispatcher');
  
  // Dropdown state
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

>>>>>>> 9ad804f69b8f639ac668fb4a4d196942ed579546
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn">
          <Menu className="w-5 h-5 text-slate-500" />
        </button>
        {isDispatcher && (
          <div className="dispatcher-title-container">
            <span className="dispatcher-title-sub">DISPATCHER</span>
            <span className="dispatcher-title-main">LIVE DISPATCH OPERATIONS</span>
          </div>
        )}
      </div>
      
      <div className="header-center">
        <div className="search-bar">
          <Search className="search-icon w-4 h-4" />
          <input type="text" placeholder="Quick Search..." className="search-input" />
          <Search className="search-icon-right w-4 h-4" />
        </div>
      </div>
      
      <div className="header-right" ref={dropdownRef}>
        <div className="icon-group">
          {/* Notification Button */}
          <div className="icon-btn-container">
            <div className="icon-btn">
              <Bell className="w-5 h-5" />
              <span className="icon-badge">12</span>
            </div>
          </div>
          
          {/* Messages Button */}
          <div className="icon-btn-container" onClick={() => navigate('/dispatcher/communication-depot')}>
            <div className="icon-btn">
              <MessageSquare className="w-5 h-5" />
              <span className="icon-badge bg-rose-500">0</span>
            </div>
          </div>
        </div>
        
<<<<<<< HEAD
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
=======
        {/* User Profile Controller */}
        <div className="user-profile-trigger" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="avatar-circle-sm">SM</div>
          <ChevronDown className={`dropdown-icon w-4 h-4 transition-transform duration-250 ${showDropdown ? 'rotate-180' : ''}`} />
>>>>>>> 9ad804f69b8f639ac668fb4a4d196942ed579546
        </div>

        {/* Dropdown Menu (3rd Image Match) */}
        {showDropdown && (
          <div className="header-profile-dropdown animate-fade-in">
            <div className="dropdown-header-info">
              <span className="dropdown-info-name">Admin</span>
              <span className="dropdown-info-role">Dispatcher • admin@hero.com</span>
            </div>
            
            <div className="dropdown-menu-divider"></div>
            
            {/* Menu Item 1: Profile Settings */}
            <button 
              onClick={() => {
                setShowDropdown(false);
                navigate('/dispatcher/system-settings');
              }}
              className="dropdown-menu-item"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>Profile Settings</span>
            </button>
            
            {/* Menu Item 2: Sign Out */}
            <button 
              onClick={() => {
                setShowDropdown(false);
                alert("Signing out dispatcher account...");
              }}
              className="dropdown-menu-item signout-btn"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
