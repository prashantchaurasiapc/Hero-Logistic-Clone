import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Check, X, Filter, Settings,
  UserCheck, Shield, Users, UserPlus, Key, Edit3, Trash2,
  Eye, Lock, Unlock, Mail, Phone, Building, LogIn, EyeOff, Loader2
} from 'lucide-react';
import api from '../../services/api';

/* ============================================================
   ROLE BADGE CONFIGURATIONS & PERMISSIONS LIST
   ============================================================ */
const ROLE_OPTIONS = [
  { id: 'Super Admin', label: 'Super Admin (Platform)', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Shield },
  { id: 'Company Admin', label: 'Company Admin', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Building },
  { id: 'Sales Rep', label: 'Sales Rep', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: Users },
  { id: 'Dispatcher', label: 'Dispatcher', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: UserCheck },
  { id: 'Driver', label: 'Driver', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Users },
  { id: 'Warehouse Manager', label: 'Warehouse Manager', color: 'bg-teal-100 text-teal-700 border-teal-200', icon: Building },
  { id: 'Yard Attendant', label: 'Yard Attendant', color: 'bg-cyan-100 text-cyan-700 border-cyan-200', icon: Users },
  { id: 'Accounts Manager', label: 'Accounts Manager', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: Key },
  { id: 'Customer', label: 'Customer Portal User', color: 'bg-violet-100 text-violet-700 border-violet-200', icon: Users },
];

export default function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/users');
      if (res.data?.success) {
        setUsers(res.data.data.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || 'N/A',
          role: u.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '),
          company: u.company?.name || 'Platform Level',
          status: u.isActive ? 'ACTIVE' : 'INACTIVE',
          lastLogin: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never',
          created: new Date(u.createdAt).toLocaleDateString(),
          permissions: ['Basic Access']
        })));
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toolbar & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All Roles');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All Statuses');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('All Companies');
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [density, setDensity] = useState('DEFAULT'); // COMPACT | DEFAULT | RELAXED
  const [showPasswordMap, setShowPasswordMap] = useState({});

  // Column visibility
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    checkboxes: true,
    user: true,
    contact: true,
    role: true,
    company: true,
    password: false,
    status: true,
    lastLogin: true,
    created: true,
  });

  // Action Menu state
  const [activeActionsMenu, setActiveActionsMenu] = useState(null);

  // Modal States
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showInspectorModal, setShowInspectorModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Company Admin',
    company: 'Falcon Logistics LLC',
    password: '123',
    status: 'ACTIVE'
  });

  const columnsMenuRef = useRef(null);
  const actionsMenuRef = useRef(null);

  // Close dropdown menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (columnsMenuRef.current && !columnsMenuRef.current.contains(event.target)) {
        setShowColumnsMenu(false);
      }
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target)) {
        setActiveActionsMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showNotification = (msg) => {
    setToast(msg);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle Login As User (Impersonate / Direct Login)
  const handleLoginAsUser = (user) => {
    const sessionData = {
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company
    };
    localStorage.setItem('hero_session', JSON.stringify(sessionData));

    showNotification(`Logging in as ${user.name} (${user.role})...`);
    setActiveActionsMenu(null);
    setShowInspectorModal(false);

    setTimeout(() => {
      switch (user.role) {
        case 'Super Admin':
          navigate('/admin/dashboard');
          break;
        case 'Company Admin':
          navigate('/company-admin/command-centre');
          break;
        case 'Sales Rep':
          navigate('/sales/dashboard');
          break;
        case 'Dispatcher':
          navigate('/dispatcher/command-center');
          break;
        case 'Driver':
          navigate('/driver/dashboard');
          break;
        case 'Warehouse Manager':
          navigate('/warehouse/dashboard');
          break;
        case 'Yard Attendant':
          navigate('/yard/dashboard');
          break;
        case 'Accounts Manager':
          navigate('/accounts/dashboard');
          break;
        case 'Customer':
          navigate('/customer/dashboard');
          break;
        default:
          navigate('/admin/dashboard');
      }
    }, 900);
  };

  // Handle Add User Submit
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    try {
      setIsLoading(true);
      const res = await api.post('/users', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        role: formData.role.toUpperCase().replace(/ /g, '_'),
        password: formData.password || '123',
        isActive: formData.status === 'ACTIVE'
      });
      if (res.data?.success) {
        showNotification(`User "${formData.name}" added successfully!`);
        setShowAddUserModal(false);
        setFormData({ name: '', email: '', phone: '', role: 'Company Admin', company: 'Falcon Logistics LLC', password: '123', status: 'ACTIVE' });
        fetchUsers();
      }
    } catch (err) {
      showNotification(err.response?.data?.error?.message || 'Error adding user.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Edit User Submit
  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      setIsLoading(true);
      const res = await api.put(`/users/${selectedUser.id}`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        role: formData.role.toUpperCase().replace(/ /g, '_'),
        isActive: formData.status === 'ACTIVE'
      });
      if (res.data?.success) {
        showNotification(`User "${formData.name}" updated successfully.`);
        setShowEditUserModal(false);
        fetchUsers();
      }
    } catch (err) {
      showNotification(err.response?.data?.error?.message || 'Error updating user.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      try {
        setIsLoading(true);
        const res = await api.delete(`/users/${id}`);
        if (res.status === 204 || res.data?.success) {
          setActiveActionsMenu(null);
          showNotification(`User "${name}" deleted.`);
          fetchUsers();
        }
      } catch (err) {
        showNotification('Error deleting user.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Toggle User Status
  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await api.put(`/users/${user.id}`, { isActive: nextStatus === 'ACTIVE' });
      if (res.data?.success) {
        setActiveActionsMenu(null);
        showNotification(`User status changed to ${nextStatus}.`);
        fetchUsers();
      }
    } catch (err) {
      showNotification('Error updating user status.');
    }
  };

  // Open Edit Modal
  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      company: user.company,
      password: user.password || '123',
      status: user.status
    });
    setShowEditUserModal(true);
    setActiveActionsMenu(null);
  };

  // Open Inspector Modal
  const openInspectorModal = (user) => {
    setSelectedUser(user);
    setShowInspectorModal(true);
    setActiveActionsMenu(null);
  };

  // Toggle show password per row
  const toggleShowPasswordRow = (userId) => {
    setShowPasswordMap(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Get distinct companies list
  const uniqueCompanies = Array.from(new Set(users.map(u => u.company))).filter(Boolean);

  // Filter Logic
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRoleFilter === 'All Roles' || u.role === selectedRoleFilter;
    const matchesStatus = selectedStatusFilter === 'All Statuses' || u.status === selectedStatusFilter;
    const matchesCompany = selectedCompanyFilter === 'All Companies' || u.company === selectedCompanyFilter;

    return matchesSearch && matchesRole && matchesStatus && matchesCompany;
  });

  // Calculate Metrics
  const totalUsers = users.length;
  const superAdmins = users.filter(u => u.role === 'Super Admin').length;
  const companyAdmins = users.filter(u => u.role === 'Company Admin').length;
  const dispatchers = users.filter(u => u.role === 'Dispatcher').length;
  const drivers = users.filter(u => u.role === 'Driver').length;
  const activeUsers = users.filter(u => u.status === 'ACTIVE').length;

  // Role Badge Helper
  const getRoleBadge = (roleName) => {
    const config = ROLE_OPTIONS.find(r => r.id === roleName);
    const colorClass = config ? config.color : 'bg-slate-100 text-slate-700 border-slate-200';
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-wider ${colorClass}`}>
        {roleName}
      </span>
    );
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">ACTIVE</span>;
      case 'SUSPENDED':
      case 'HOLD':
        return <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">SUSPENDED</span>;
      case 'PENDING':
        return <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">PENDING</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">{status}</span>;
    }
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ['USER ID', 'NAME', 'EMAIL', 'PHONE', 'ROLE', 'COMPANY', 'PASSWORD', 'STATUS', 'LAST LOGIN', 'CREATED DATE'];
    const csvRows = [headers.join(',')];

    filteredUsers.forEach(u => {
      csvRows.push([
        `"${u.id}"`,
        `"${u.name}"`,
        `"${u.email}"`,
        `"${u.phone}"`,
        `"${u.role}"`,
        `"${u.company}"`,
        `"${u.password || '123'}"`,
        `"${u.status}"`,
        `"${u.lastLogin}"`,
        `"${u.created}"`
      ].join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_management_export_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification('CSV Export generated successfully.');
  };

  return (
    <div className="flex-grow bg-[#F1F5F9] p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto w-full text-left font-sans relative custom-scrollbar">

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg border border-slate-700/50 z-50 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-2">
        <div>
          <h1 className="text-xl sm:text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
            Super Admin <span className="text-slate-400 font-black">•</span> User Management
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 font-semibold mt-1">
            Manage system-wide user credentials, set passwords, and switch/login as any platform role instantly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto w-full sm:w-auto">
          <button
            onClick={exportCSV}
            className="border border-[#e2e8f0] hover:bg-slate-50 text-amber-500 font-extrabold text-xs px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer bg-white whitespace-nowrap flex-1 sm:flex-none"
          >
            Export CSV
          </button>

          <button
            onClick={() => setShowAddUserModal(true)}
            className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs px-4 sm:px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap flex-1 sm:flex-none"
          >
            <UserPlus className="w-4 h-4" /> Add Platform User
          </button>
        </div>
      </div>

      {/* Metric / KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">TOTAL SYSTEM USERS</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">{totalUsers}</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-2 block whitespace-nowrap">Across all platform roles</span>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">SUPER ADMINS</span>
            <span className="text-2xl font-black text-purple-700 block mt-1.5">{superAdmins}</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-2 block whitespace-nowrap">Platform Owners</span>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">COMPANY ADMINS</span>
            <span className="text-2xl font-black text-blue-700 block mt-1.5">{companyAdmins}</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-2 block whitespace-nowrap">Tenant Administrators</span>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">DISPATCHERS</span>
            <span className="text-2xl font-black text-amber-700 block mt-1.5">{dispatchers}</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-2 block whitespace-nowrap">Logistics Operators</span>
        </div>

        {/* Card 5 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">FLEET DRIVERS</span>
            <span className="text-2xl font-black text-emerald-700 block mt-1.5">{drivers}</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-2 block whitespace-nowrap">Mobile App Users</span>
        </div>

        {/* Card 6 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ACTIVE STATUS</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">{activeUsers} / {totalUsers}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">Healthy Account Pool</span>
            <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md shrink-0">
              {Math.round((activeUsers / (totalUsers || 1)) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full xl:w-auto">
            <div className="relative w-full sm:w-64 text-left">
              <input
                type="text"
                placeholder="Search users by name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800 font-bold"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            </div>

            <button
              onClick={() => setAdvancedSearchOpen(!advancedSearchOpen)}
              className={`flex items-center justify-center gap-1.5 border font-extrabold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer w-full sm:w-auto ${
                advancedSearchOpen
                  ? 'border-black border bg-slate-50 text-slate-900'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <Filter className="w-3.5 h-3.5" /> Filters
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full xl:w-auto xl:justify-end">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-hide">
              <button
                onClick={exportCSV}
                className="border border-amber-500 hover:bg-amber-50/10 text-yellow-600 font-extrabold text-[11px] px-3.5 py-2 rounded-xl transition-colors cursor-pointer bg-white whitespace-nowrap"
              >
                CSV Export
              </button>
              <button
                onClick={() => showNotification('Excel report compiled')}
                className="border border-amber-500 hover:bg-amber-50/10 text-yellow-600 font-extrabold text-[11px] px-3.5 py-2 rounded-xl transition-colors cursor-pointer bg-white whitespace-nowrap"
              >
                Excel Export
              </button>
              <button
                onClick={() => showNotification('PDF document compiled')}
                className="border border-amber-500 hover:bg-amber-50/10 text-yellow-600 font-extrabold text-[11px] px-3.5 py-2 rounded-xl transition-colors cursor-pointer bg-white whitespace-nowrap"
              >
                PDF Export
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              {/* Density selector */}
              <div className="bg-slate-100 p-0.5 rounded-xl flex gap-0.5 border border-slate-200 shrink-0">
                {['COMPACT', 'DEFAULT', 'RELAXED'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDensity(mode)}
                    className={`px-3 py-1.5 text-[9px] font-black rounded-lg transition-all cursor-pointer ${
                      density === mode
                        ? 'bg-[#FFD400] text-black shadow-xs font-black'
                        : 'text-black hover:bg-slate-200/50'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Columns button */}
              <div className="relative text-left" ref={columnsMenuRef}>
                <button
                  onClick={() => setShowColumnsMenu(!showColumnsMenu)}
                  className="bg-white border border-black hover:bg-slate-50 text-slate-700 font-extrabold text-[11px] px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  <span>COLUMNS</span>
                </button>

                {showColumnsMenu && (
                  <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 space-y-1.5 text-left text-xs text-slate-700 font-black max-h-60 overflow-y-auto custom-scrollbar">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100 mb-1.5">
                      TOGGLE COLUMNS
                    </span>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.user}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, user: !prev.user }))}
                        className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                      />
                      <span>User Details</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.contact}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, contact: !prev.contact }))}
                        className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Contact Info</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.role}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, role: !prev.role }))}
                        className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Assigned Role</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.company}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, company: !prev.company }))}
                        className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Company Tenant</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.password}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, password: !prev.password }))}
                        className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Password</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.status}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, status: !prev.status }))}
                        className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Status</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.lastLogin}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, lastLogin: !prev.lastLogin }))}
                        className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Last Login</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.created}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, created: !prev.created }))}
                        className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Created Date</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Dropdowns when Expanded */}
        {advancedSearchOpen && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-700">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Filter By Role</label>
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
              >
                <option value="All Roles">All System Roles</option>
                {ROLE_OPTIONS.map(r => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Filter By Status</label>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
              >
                <option value="All Statuses">All Account Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Filter By Company Tenant</label>
              <select
                value={selectedCompanyFilter}
                onChange={(e) => setSelectedCompanyFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
              >
                <option value="All Companies">All Companies</option>
                {uniqueCompanies.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Users Data Table */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs font-bold text-slate-700 min-w-[1100px] whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                {visibleColumns.checkboxes && (
                  <th className="py-4 px-4 text-center w-10">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded cursor-pointer" />
                  </th>
                )}
                {visibleColumns.user && <th className="py-4 px-4">USER NAME & ID</th>}
                {visibleColumns.contact && <th className="py-4 px-4">CONTACT INFO</th>}
                {visibleColumns.role && <th className="py-4 px-4">ASSIGNED ROLE</th>}
                {visibleColumns.company && <th className="py-4 px-4">COMPANY / TENANT</th>}
                {visibleColumns.password && <th className="py-4 px-4">PASSWORD</th>}
                {visibleColumns.status && <th className="py-4 px-4">STATUS</th>}
                {visibleColumns.lastLogin && <th className="py-4 px-4">LAST LOGIN</th>}
                {visibleColumns.created && <th className="py-4 px-4">CREATED DATE</th>}
                <th className="py-4 px-6 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 font-semibold bg-white w-full">
                     <div className="flex justify-center items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading users...</div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-400 font-semibold bg-white w-full">
                    No platform users found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const pyPadding = density === 'COMPACT' ? 'py-2' : density === 'RELAXED' ? 'py-5' : 'py-3.5';
                  const isPasswordVisible = showPasswordMap[user.id];

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      {visibleColumns.checkboxes && (
                        <td className={`${pyPadding} px-4 text-center w-10`}>
                          <input type="checkbox" className="w-3.5 h-3.5 rounded cursor-pointer" />
                        </td>
                      )}

                      {visibleColumns.user && (
                        <td className={`${pyPadding} px-4`}>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-900 text-[#FFD400] flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="text-slate-900 font-black block">{user.name}</span>
                              <span className="text-[10px] font-bold text-slate-400 block">{user.id}</span>
                            </div>
                          </div>
                        </td>
                      )}

                      {visibleColumns.contact && (
                        <td className={`${pyPadding} px-4`}>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{user.phone}</span>
                            </div>
                          </div>
                        </td>
                      )}

                      {visibleColumns.role && (
                        <td className={`${pyPadding} px-4`}>
                          {getRoleBadge(user.role)}
                        </td>
                      )}

                      {visibleColumns.company && (
                        <td className={`${pyPadding} px-4`}>
                          <div className="flex items-center gap-1.5 text-slate-800 font-extrabold">
                            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{user.company}</span>
                          </div>
                        </td>
                      )}

                      {visibleColumns.password && (
                        <td className={`${pyPadding} px-4`}>
                          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg w-fit">
                            <span className="font-mono text-xs text-slate-800">
                              {isPasswordVisible ? (user.password || '123') : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleShowPasswordRow(user.id)}
                              className="text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                              {isPasswordVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                          </div>
                        </td>
                      )}

                      {visibleColumns.status && (
                        <td className={`${pyPadding} px-4`}>
                          {getStatusBadge(user.status)}
                        </td>
                      )}

                      {visibleColumns.lastLogin && (
                        <td className={`${pyPadding} px-4 text-slate-600 font-semibold`}>
                          {user.lastLogin}
                        </td>
                      )}

                      {visibleColumns.created && (
                        <td className={`${pyPadding} px-4 text-slate-400 font-semibold`}>
                          {user.created}
                        </td>
                      )}

                      <td className={`${pyPadding} px-6 text-center relative`} ref={activeActionsMenu === user.id ? actionsMenuRef : null}>
                        <button
                          onClick={() => setActiveActionsMenu(activeActionsMenu === user.id ? null : user.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Settings className="w-4 h-4" />
                        </button>

                        {activeActionsMenu === user.id && (
                          <div className="absolute right-6 top-10 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 space-y-1 text-left text-xs font-bold text-slate-700">
                            <button
                              onClick={() => handleLoginAsUser(user)}
                              className="w-full flex items-center gap-2 px-3 py-2 bg-[#FFD400] text-black font-black hover:bg-[#FFC800] rounded-xl cursor-pointer shadow-xs"
                            >
                              <LogIn className="w-3.5 h-3.5 text-black" /> Login As User
                            </button>

                            <button
                              onClick={() => openInspectorModal(user)}
                              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl text-slate-700 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-500" /> View Permissions
                            </button>

                            <button
                              onClick={() => openEditModal(user)}
                              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl text-slate-700 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Edit Details & Password
                            </button>

                            <button
                              onClick={() => handleToggleStatus(user)}
                              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl text-slate-700 cursor-pointer"
                            >
                              {user.status === 'ACTIVE' ? (
                                <>
                                  <Lock className="w-3.5 h-3.5 text-amber-500" /> Suspend Account
                                </>
                              ) : (
                                <>
                                  <Unlock className="w-3.5 h-3.5 text-emerald-500" /> Activate Account
                                </>
                              )}
                            </button>

                            <div className="my-1 border-t border-slate-100" />

                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-rose-50 rounded-xl text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" /> Delete User
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================
         ADD PLATFORM USER MODAL
         ============================================================ */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[99999] overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 text-left relative animate-in fade-in zoom-in-95 my-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#FFD400] text-black flex items-center justify-center font-black">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Add New Platform User</h3>
                  <p className="text-slate-400 text-xs font-medium">Provision user credentials and set password</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-[#FFD400] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-[#FFD400] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 555-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-[#FFD400] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">System Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-[#FFD400] focus:outline-none cursor-pointer"
                  >
                    {ROLE_OPTIONS.map(r => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">Company / Tenant *</label>
                  <select
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-[#FFD400] focus:outline-none cursor-pointer"
                  >
                    <option value="Hero Logistics Global (Platform)">Hero Logistics Global (Platform)</option>
                    {uniqueCompanies.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">User Password *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 123"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-[#FFD400] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-[#FFD400] focus:outline-none cursor-pointer"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="PENDING">PENDING APPROVAL</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FFD400] hover:bg-[#FFC800] text-black font-black text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
         EDIT PLATFORM USER MODAL
         ============================================================ */}
      {showEditUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[99999] overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 text-left relative animate-in fade-in zoom-in-95 my-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Edit User Details</h3>
                  <p className="text-slate-400 text-xs font-medium">Update account properties & password for {selectedUser?.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditUserModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-[#FFD400] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-[#FFD400] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-[#FFD400] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">Assigned System Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-[#FFD400] focus:outline-none cursor-pointer"
                  >
                    {ROLE_OPTIONS.map(r => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">Company Tenant</label>
                  <select
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-[#FFD400] focus:outline-none cursor-pointer"
                  >
                    <option value="Hero Logistics Global (Platform)">Hero Logistics Global (Platform)</option>
                    {uniqueCompanies.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">Password</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-[#FFD400] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-[#FFD400] focus:outline-none cursor-pointer"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="PENDING">PENDING APPROVAL</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FFD400] hover:bg-[#FFC800] text-black font-black text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
         VIEW PERMISSIONS & INSPECTOR MODAL
         ============================================================ */}
      {showInspectorModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[99999] overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 text-left relative animate-in fade-in zoom-in-95 my-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-[#FFD400] flex items-center justify-center font-black text-sm shadow-xs">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{selectedUser.name}</h3>
                  <p className="text-slate-400 text-xs font-medium">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setShowInspectorModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold text-slate-700">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">USER ID</span>
                  <span className="text-slate-900 font-extrabold">{selectedUser.id}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ROLE</span>
                  {getRoleBadge(selectedUser.role)}
                </div>
                <div className="mt-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">COMPANY</span>
                  <span className="text-slate-800 font-bold">{selectedUser.company}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">PASSWORD</span>
                  <span className="font-mono text-xs text-slate-900 bg-slate-200/70 px-2 py-0.5 rounded-md">
                    {selectedUser.password || '123'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">ENABLED MODULE PERMISSIONS</span>
                <div className="flex flex-wrap gap-2">
                  {(selectedUser.permissions || ['Standard Module Access']).map((perm, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-[10px] font-black border border-slate-200">
                      ✓ {perm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 font-semibold space-y-1">
                <div>Last Active: <span className="text-slate-700 font-bold">{selectedUser.lastLogin}</span></div>
                <div>Registered On: <span className="text-slate-700 font-bold">{selectedUser.created}</span></div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100 gap-3">
              <button
                onClick={() => handleLoginAsUser(selectedUser)}
                className="px-4 py-2.5 bg-[#FFD400] hover:bg-[#FFC800] text-black font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" /> Login As User
              </button>
              <button
                onClick={() => setShowInspectorModal(false)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
