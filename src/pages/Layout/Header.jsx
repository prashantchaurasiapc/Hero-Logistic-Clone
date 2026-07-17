import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { 
  Menu, Search, Bell, MessageSquare, ChevronDown, User, LogOut, X, 
  MapPin, Shield, Truck, Users, LayoutDashboard, Settings
} from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Stacking role details
  const isAdminPath = location.pathname.startsWith('/company-admin');
  const isDispatcherPath = location.pathname.startsWith('/dispatcher');
  const getRoleLabel = () => {
    if (location.pathname.startsWith('/driver')) return 'Driver';
    if (isDispatcherPath) return 'Dispatcher';
    if (location.pathname.startsWith('/warehouse')) return 'Warehouse';
    if (isAdminPath) return 'Company Admin';
    if (location.pathname.startsWith('/super-admin')) return 'Super Admin';
    if (location.pathname.startsWith('/sales')) return 'Sales';
    return 'Admin';
  };

  // Notification lists state
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(12);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'LOAD', text: "Load LD-2041 status updated to 'IN DEPOT'", time: '2 mins ago', read: false },
    { id: 2, type: 'SAFETY', text: "Liam Smith submitted pre-trip safety checklist", time: '15 mins ago', read: false },
    { id: 3, type: 'FLEET', text: "Tesla Model S EV 0001 has entered Sydney Depot", time: '1 hr ago', read: false },
    { id: 4, type: 'BILLING', text: "Strategic Account rate sheets updated for Acme Corp", time: '3 hrs ago', read: false }
  ]);

  // Command Palette Quick Search state
  const [showSearchPalette, setShowSearchPalette] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Available links for Spotlight Search
  const searchItems = [
    { name: 'Command Centre Dashboard', path: '/company-admin/command-centre', category: 'Dashboard', icon: LayoutDashboard },
    { name: 'Loads Management', path: '/company-admin/loads', category: 'Operations', icon: Truck },
    { name: 'Live Tracking Monitor', path: '/company-admin/live-tracking', category: 'Operations', icon: MapPin },
    { name: 'Driver Roster Profiles', path: '/company-admin/drivers', category: 'Staff', icon: Users },
    { name: 'Fleet Vehicles Registry', path: '/company-admin/vehicles', category: 'Fleet', icon: Truck },
    { name: 'Customer Accounts', path: '/company-admin/customers', category: 'CRM', icon: Users },
    { name: 'Branches & Depots', path: '/company-admin/branches', category: 'Locations', icon: Shield },
    { name: 'Asset Inventory Ledger', path: '/company-admin/assets', category: 'Inventory', icon: Shield },
    { name: 'Warehouse Holding Areas', path: '/company-admin/warehouse', category: 'Locations', icon: Shield },
    { name: 'Messages & Chat Log', path: '/company-admin/messages', category: 'CRM', icon: MessageSquare }
  ];

  // User Profile drop down state
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Refs for outside click dismissals
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const searchPaletteRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close menus on clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (searchPaletteRef.current && !searchPaletteRef.current.contains(event.target) && event.target.className !== 'search-input') {
        setShowSearchPalette(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K to open search palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchPalette(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autofocus search input when palette opens
  useEffect(() => {
    if (showSearchPalette && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 80);
    }
  }, [showSearchPalette]);

  const handleClearNotifications = () => {
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSearchNavigate = (path) => {
    navigate(path);
    setShowSearchPalette(false);
    setSearchQuery('');
  };

  const handleMessageClick = () => {
    if (isDispatcherPath) {
      navigate('/dispatcher/communication-depot');
    } else {
      navigate('/company-admin/messages');
    }
  };

  const handleProfileSettingsClick = () => {
    setShowDropdown(false);
    if (isDispatcherPath) {
      navigate('/dispatcher/system-settings');
    } else {
      navigate('/company-admin/my-profile');
    }
  };

  const filteredSearchItems = searchItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="header">
        <div className="header-left">
          <button className="menu-btn" onClick={() => navigate('/company-admin/command-centre')}>
            <Menu className="w-5 h-5 text-slate-500" />
          </button>
          {isDispatcherPath && (
            <div className="dispatcher-title-container">
              <span className="dispatcher-title-sub">DISPATCHER</span>
              <span className="dispatcher-title-main">LIVE DISPATCH OPERATIONS</span>
            </div>
          )}
        </div>
        
        <div className="header-center">
          <div className="search-bar" onClick={() => setShowSearchPalette(true)}>
            <Search className="search-icon w-4 h-4" />
            <input 
              type="text" 
              placeholder="Quick Search... (Ctrl+K)" 
              className="search-input cursor-pointer" 
              readOnly 
            />
            <Search className="search-icon-right w-4 h-4" />
          </div>
        </div>
        
        <div className="header-right">
          <div className="icon-group">
            {/* Notification Button */}
            <div className="icon-btn-container" ref={notificationRef} onClick={() => setShowNotifications(!showNotifications)}>
              <div className="icon-btn">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && <span className="icon-badge">{unreadCount}</span>}
              </div>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-[50px] w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-[999] overflow-hidden text-left p-1 animate-in fade-in duration-200">
                  <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Notifications</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleClearNotifications(); }}
                        className="text-[9px] font-black text-blue-600 hover:text-blue-700 bg-transparent border-0 cursor-pointer uppercase tracking-widest"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-slate-50 max-h-[300px] overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-3.5 hover:bg-slate-50/50 transition-colors flex flex-col gap-1 ${!n.read ? 'bg-blue-50/20' : ''}`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            n.type === 'LOAD' ? 'bg-blue-50 text-blue-600' :
                            n.type === 'SAFETY' ? 'bg-amber-50 text-amber-600' :
                            n.type === 'FLEET' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'
                          }`}>{n.type}</span>
                          <span className="text-[9px] text-slate-400 font-semibold">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-700 font-semibold leading-normal">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Messages Button */}
            <div className="icon-btn-container" onClick={handleMessageClick}>
              <div className="icon-btn">
                <MessageSquare className="w-5 h-5" />
                <span className="icon-badge bg-rose-500">0</span>
              </div>
            </div>
          </div>
          
          {/* User Profile Controller */}
          <div className="user-profile-trigger" ref={dropdownRef} onClick={() => setShowDropdown(!showDropdown)}>
            <div className="avatar-circle-sm">SM</div>
            <ChevronDown className={`dropdown-icon w-4 h-4 transition-transform duration-250 ${showDropdown ? 'rotate-180' : ''}`} />
            
            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="header-profile-dropdown animate-fade-in z-[999] top-[50px]">
                <div className="dropdown-header-info">
                  <span className="dropdown-info-name">Admin</span>
                  <span className="dropdown-info-role">{getRoleLabel()} • admin@hero.com</span>
                </div>
                
                <div className="dropdown-menu-divider"></div>
                
                <button onClick={(e) => { e.stopPropagation(); handleProfileSettingsClick(); }} className="dropdown-menu-item">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Profile Settings</span>
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                    navigate('/login');
                  }}
                  className="dropdown-menu-item signout-btn"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spotlight Command Palette Modal */}
      {showSearchPalette && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-start justify-center z-[99999] p-4 pt-[12vh] animate-in fade-in duration-200">
          <div 
            ref={searchPaletteRef}
            className="bg-white rounded-3xl border border-slate-100 max-w-xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-left"
          >
            {/* Spotlight Search Input */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="text-slate-400 shrink-0" size={18} />
              <input 
                ref={searchInputRef}
                type="text"
                placeholder="Type to search pages or shortcuts..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-sm font-semibold outline-none border-0 text-slate-800 placeholder-slate-400 bg-white"
              />
              <button 
                onClick={() => setShowSearchPalette(false)}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-800 bg-transparent border-0"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Spotlight Search Matches List */}
            <div className="max-h-[350px] overflow-y-auto p-2 divide-y divide-slate-50/50">
              {filteredSearchItems.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">No matching pages found</div>
              ) : (
                filteredSearchItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSearchNavigate(item.path)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer border-0 bg-white group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-amber-100 group-hover:text-slate-900 transition-colors">
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 group-hover:text-[#EAB308] transition-colors leading-tight mb-0.5">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold leading-none">{item.path}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded leading-none shrink-0">
                        {item.category}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
