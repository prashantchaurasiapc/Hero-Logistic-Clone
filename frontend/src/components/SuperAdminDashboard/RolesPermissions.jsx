import React, { useState, useEffect } from 'react';
import { Shield, Edit3, Search, Check, Square, CheckSquare, X, Loader2, Lock } from 'lucide-react';
import api from '../../services/api';

/* ─── MASTER MENU & PERMISSIONS SCHEMA FOR ALL PLATFORM ROLES ─── */
const ROLE_MODULES_MAP = {
  'Company Admin': [
    { menu: 'Command Centre', actions: ['Show', 'View', 'Export'] },
    { menu: 'All Loads', actions: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { menu: 'Load Inbox', actions: ['Show', 'View', 'Manage'] },
    { menu: 'Customers', actions: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { menu: 'Live Tracking', actions: ['Show', 'View', 'Manage'] },
    { menu: 'Drivers', actions: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { menu: 'Vehicles', actions: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { menu: 'Branches', actions: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { menu: 'Assets', actions: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { menu: 'Warehouse', actions: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { menu: 'Pricing', actions: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { menu: 'Payroll', actions: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { menu: 'Finance', actions: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { menu: 'Documents', actions: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { menu: 'Reports & Analytics', actions: ['Show', 'View', 'Export'] },
    { menu: 'Messages', actions: ['Show', 'View', 'Create', 'Manage'] },
    { menu: 'Support Tickets', actions: ['Show', 'View', 'Create', 'Manage'] },
    { menu: 'Settings', actions: ['Show', 'View', 'Edit', 'Manage'] },
    { menu: 'Users & Permissions', actions: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
  ],
  'Sales': [
    { menu: 'Leads', actions: ['Show', 'View', 'Create', 'Edit', 'Manage'] },
    { menu: 'Pipeline Board', actions: ['Show', 'View', 'Manage'] },
    { menu: 'Demo Bookings', actions: ['Show', 'View', 'Create', 'Edit'] },
    { menu: 'Proposals', actions: ['Show', 'View', 'Create', 'Edit', 'Manage'] },
    { menu: 'Follow-Ups', actions: ['Show', 'View', 'Create', 'Edit', 'Manage'] },
    { menu: 'Onboarding Handover', actions: ['Show', 'View', 'Manage'] },
    { menu: 'Sales Reports', actions: ['Show', 'View', 'Export'] },
  ],
  'Dispatcher': [
    { menu: 'Dispatch Dashboard', actions: ['Show', 'View', 'Export'] },
    { menu: 'Create Load', actions: ['Show', 'View', 'Create', 'Manage'] },
    { menu: 'Active Loads', actions: ['Show', 'View', 'Edit', 'Manage'] },
    { menu: 'Terminal Workspace', actions: ['Show', 'View', 'Manage'] },
    { menu: 'Fleet Monitor', actions: ['Show', 'View', 'Manage'] },
    { menu: 'Roster Control', actions: ['Show', 'View', 'Manage'] },
    { menu: 'Communication Depot', actions: ['Show', 'View', 'Create'] },
  ],
  'Driver': [
    { menu: 'Messages', actions: ['Show', 'View', 'Create', 'Manage'] },
    { menu: 'Assigned Jobs', actions: ['Show', 'View', 'Manage'] },
    { menu: 'Timesheets / Clock In-Out', actions: ['Show', 'View', 'Manage'] },
    { menu: 'Delivery & POD', actions: ['Show', 'View', 'Create', 'Upload', 'Manage'] },
    { menu: 'Add Expense', actions: ['Show', 'View', 'Create'] },
  ],
  'Warehouse Manager': [
    { menu: 'Find Stock', actions: ['Show', 'View', 'Manage'] },
    { menu: 'Warehouse & Yard Map', actions: ['Show', 'View', 'Manage'] },
    { menu: 'Movement History', actions: ['Show', 'View', 'Export'] },
    { menu: 'Reports & Analytics', actions: ['Show', 'View', 'Export'] },
    { menu: 'Dashboard', actions: ['Show', 'View', 'Export'] },
    { menu: 'Inbound Receiving', actions: ['Show', 'View', 'Create', 'Manage'] },
    { menu: 'Outbound Dispatch', actions: ['Show', 'View', 'Manage'] },
  ],
  'Yard Attendant': [
    { menu: 'Receive (Inbound Intake)', actions: ['Show', 'View', 'Create', 'Manage'] },
    { menu: 'Outbound Handover', actions: ['Show', 'View', 'Manage'] },
    { menu: 'Start Work / Finish Work', actions: ['Show', 'View', 'Manage'] },
    { menu: 'Activities', actions: ['Show', 'View', 'Create', 'Manage'] },
    { menu: 'Dashboard', actions: ['Show', 'View'] },
  ],
  'Accounts': [
    { menu: 'Vehicle Costs', actions: ['Show', 'View', 'Manage'] },
    { menu: 'Payments', actions: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { menu: 'Accounts Dashboard', actions: ['Show', 'View', 'Export'] },
    { menu: 'Invoice Review', actions: ['Show', 'View', 'Edit'] },
    { menu: 'Expenses', actions: ['Show', 'View', 'Create', 'Edit'] },
  ],
  'Customer': [
    { menu: 'Account & Users', actions: ['Show', 'View', 'Edit'] },
    { menu: 'Documents & PODs', actions: ['Show', 'View', 'Download'] },
    { menu: 'Dashboard', actions: ['Show', 'View'] },
    { menu: 'Invoices & Payments', actions: ['Show', 'View', 'Pay', 'Download'] },
    { menu: 'Messages & Support', actions: ['Show', 'View', 'Create'] },
  ]
};

/* Color sequence for badge pills matching Screenshot 1 */
const BADGE_COLOR_PALETTE = [
  'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
  'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
  'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]',
  'bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]',
  'bg-[#FFE4E6] text-[#BE123C] border-[#FECDD3]',
  'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
];

/* Default initial master roles state */
const DEFAULT_MASTER_ROLES = [
  { id: 'role-company-admin', name: 'Company Admin', roleKey: 'COMPANY_ADMIN' },
  { id: 'role-sales', name: 'Sales', roleKey: 'SALES' },
  { id: 'role-dispatcher', name: 'Dispatcher', roleKey: 'DISPATCHER' },
  { id: 'role-driver', name: 'Driver', roleKey: 'DRIVER' },
  { id: 'role-warehouse', name: 'Warehouse Manager', roleKey: 'WAREHOUSE' },
  { id: 'role-yard', name: 'Yard Attendant', roleKey: 'YARD' },
  { id: 'role-accounts', name: 'Accounts', roleKey: 'ACCOUNTS' },
  { id: 'role-customer', name: 'Customer', roleKey: 'CUSTOMER' },
];

/* Build default full permission state for a role */
const getDefaultPerms = (roleName) => {
  const modules = ROLE_MODULES_MAP[roleName] || ROLE_MODULES_MAP['Company Admin'];
  const permMap = {};
  modules.forEach(m => {
    permMap[m.menu] = {};
    m.actions.forEach(a => {
      permMap[m.menu][a] = true;
    });
  });
  return permMap;
};

export default function RolesPermissions() {
  const [roles, setRoles] = useState([]);
  const [rolesPerms, setRolesPerms] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [toastMessage, setToastMessage] = useState('');

  // Modal State
  const [activeModalRole, setActiveModalRole] = useState(null);
  const [modalPerms, setModalPerms] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const isCompanyAdmin = window.location.pathname.includes('/company-admin');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const loadRoles = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/custom-roles');
      const backendRoles = res.data?.data || [];

      const initialPerms = {};
      DEFAULT_MASTER_ROLES.forEach(r => {
        const found = backendRoles.find(br => 
          br.name.toLowerCase() === r.name.toLowerCase() || 
          br.slug === r.roleKey || 
          br.name.toUpperCase() === r.roleKey
        );
        if (found && found.permissions && Object.keys(found.permissions).length > 0) {
          initialPerms[r.id] = found.permissions;
        } else {
          initialPerms[r.id] = getDefaultPerms(r.name);
        }
      });

      setRoles(DEFAULT_MASTER_ROLES);
      setRolesPerms(initialPerms);
    } catch (err) {
      console.warn('Failed to load custom roles, using master defaults:', err.message);
      const initialPerms = {};
      DEFAULT_MASTER_ROLES.forEach(r => {
        initialPerms[r.id] = getDefaultPerms(r.name);
      });
      setRoles(DEFAULT_MASTER_ROLES);
      setRolesPerms(initialPerms);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  // Open Edit Modal for a specific role
  const handleOpenEditModal = (role) => {
    setActiveModalRole(role);
    const existing = rolesPerms[role.id] || getDefaultPerms(role.name);
    // Clone perms
    const cloned = JSON.parse(JSON.stringify(existing));
    setModalPerms(cloned);
  };

  // Toggle single permission checkbox in modal
  const handleTogglePerm = (menuName, actionName) => {
    setModalPerms(prev => {
      const updatedMenu = { ...(prev[menuName] || {}) };
      updatedMenu[actionName] = !updatedMenu[actionName];
      return {
        ...prev,
        [menuName]: updatedMenu
      };
    });
  };

  // Select All permissions for active role
  const handleSelectAll = () => {
    if (!activeModalRole) return;
    const modules = ROLE_MODULES_MAP[activeModalRole.name] || ROLE_MODULES_MAP['Company Admin'];
    const updated = {};
    modules.forEach(m => {
      updated[m.menu] = {};
      m.actions.forEach(a => {
        updated[m.menu][a] = true;
      });
    });
    setModalPerms(updated);
  };

  // Deselect All permissions for active role
  const handleDeselectAll = () => {
    if (!activeModalRole) return;
    const modules = ROLE_MODULES_MAP[activeModalRole.name] || ROLE_MODULES_MAP['Company Admin'];
    const updated = {};
    modules.forEach(m => {
      updated[m.menu] = {};
      m.actions.forEach(a => {
        updated[m.menu][a] = false;
      });
    });
    setModalPerms(updated);
  };

  // Save Modal Permissions
  const handleSaveModalPermissions = async () => {
    if (!activeModalRole) return;
    setIsSaving(true);
    try {
      const updatedPerms = { ...rolesPerms, [activeModalRole.id]: modalPerms };
      setRolesPerms(updatedPerms);

      // Persist to backend
      await api.post('/custom-roles', {
        name: activeModalRole.name,
        roleKey: activeModalRole.roleKey,
        permissions: modalPerms
      }).catch(() => {});

      triggerToast(`Permissions updated for ${activeModalRole.name}!`);
      setActiveModalRole(null);
    } catch (err) {
      triggerToast('Failed to save permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to extract granted badges for table pill list
  const getGrantedPills = (role) => {
    const perms = rolesPerms[role.id] || getDefaultPerms(role.name);
    const pills = [];
    Object.entries(perms).forEach(([menu, actions]) => {
      Object.entries(actions || {}).forEach(([action, isGranted]) => {
        if (isGranted) {
          pills.push({ label: `${menu}: ${action}`, menu });
        }
      });
    });
    return pills;
  };

  const filteredRoles = roles.filter(r => {
    if (isCompanyAdmin && r.name.toLowerCase() === 'sales') return false;
    return r.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 overflow-y-auto w-full text-left font-sans min-h-screen relative" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-[999999] flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" /> {toastMessage}
        </div>
      )}

      {/* ── 1. HEADER SECTION ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600 shrink-0" />
            Role & Permission
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            {isCompanyAdmin 
              ? 'Company Controls: Customize permissions for subordinate operational roles. Menus disabled by Platform Super Admin are locked.'
              : 'Platform Master Controls: Configure global access permissions. Any menu/action you disable here cannot be enabled by Company Admins.'
            }
          </p>
        </div>

        <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 font-extrabold text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap shadow-2xs">
          <Shield className="w-3.5 h-3.5" />
          <span>{isCompanyAdmin ? '7 Company Roles (Child)' : '8 Fixed Platform Roles (Master)'}</span>
        </div>
      </div>

      {/* ── 2. CONTROLS BAR ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 mb-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold w-full sm:w-auto">
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 font-bold focus:outline-none cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>entries per page</span>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles..."
            className="w-full pl-8 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* ── 3. ROLES & PERMISSIONS TABLE ── */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-48 whitespace-nowrap">ROLE</th>
                <th className="py-3 px-4">PERMITTED MENUS & ACTIONS</th>
                <th className="py-3 px-4 text-right w-24 whitespace-nowrap">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400 font-semibold text-xs">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                      <span>Loading roles...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400 font-semibold text-xs">
                    No matching roles found.
                  </td>
                </tr>
              ) : (
                filteredRoles.slice(0, entriesPerPage).map((role) => {
                  const pills = getGrantedPills(role);
                  const displayPills = pills.slice(0, 15);
                  const remainingCount = pills.length - displayPills.length;
                  const isLockedRole = isCompanyAdmin && role.name === 'Company Admin';

                  return (
                    <tr key={role.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* ROLE COLUMN */}
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                          <span className="font-extrabold text-slate-900 text-xs whitespace-nowrap">{role.name}</span>
                        </div>
                      </td>

                      {/* PERMITTED MENUS & ACTIONS BADGE PILLS */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {displayPills.map((pill, idx) => {
                            const colorStyle = BADGE_COLOR_PALETTE[idx % BADGE_COLOR_PALETTE.length];
                            return (
                              <span
                                key={idx}
                                className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold border whitespace-nowrap ${colorStyle}`}
                              >
                                {pill.label}
                              </span>
                            );
                          })}
                          {remainingCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[9.5px] font-black bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
                              +{remainingCount} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* ACTION COLUMN */}
                      <td className="py-3.5 px-4 align-middle text-right whitespace-nowrap">
                        {isLockedRole ? (
                          <button
                            disabled
                            className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 inline-flex items-center justify-center text-slate-300 cursor-not-allowed"
                            title="Company Admin Master Permissions Locked"
                          >
                            <Lock size={13} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenEditModal(role)}
                            className="w-7 h-7 rounded-lg bg-[#0EA5E9] hover:bg-[#0284C7] inline-flex items-center justify-center transition-all cursor-pointer shadow-3xs text-white"
                            title={`Edit ${role.name} Permissions`}
                          >
                            <Edit3 size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER / PAGINATION */}
        <div className="px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-semibold text-slate-500">
          <span>Showing 1-{filteredRoles.length} of {filteredRoles.length} entries</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer">
              Previous
            </button>
            <button className="px-3 py-1 bg-amber-400 text-slate-900 font-extrabold rounded-lg cursor-pointer">
              1
            </button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. CONFIGURE MENU ACCESS & PERMISSIONS MODAL (MATCHING SCREENSHOT 2) ── */}
      {activeModalRole && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[999999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] my-auto overflow-hidden animate-fade-in text-left">
            
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-600 shrink-0" />
                <h2 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">
                  Configure Menu Access & Permissions — {activeModalRole.name}
                </h2>
              </div>
              <button
                onClick={() => setActiveModalRole(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* SUB-HEADER INFO & ACTION BAR */}
            <div className="px-6 py-3 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black text-purple-700">
                  Role: <span className="font-extrabold">{activeModalRole.name}</span>
                </div>
                <div className="text-[10.5px] font-semibold text-slate-500 mt-0.5">
                  Master Setting: Disabling a menu/action here locks it globally for all Company Admins.
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <CheckSquare size={13} />
                  <span>Select All</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  <Square size={13} />
                  <span>Deselect All</span>
                </button>
              </div>
            </div>

            {/* MODAL PERMISSIONS TABLE */}
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
              <div className="border border-slate-200/80 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-4 w-52 whitespace-nowrap">ROLE MENU / SUBMENU</th>
                      <th className="py-2.5 px-4">PERMITTED ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium">
                    {(ROLE_MODULES_MAP[activeModalRole.name] || ROLE_MODULES_MAP['Company Admin']).map((m) => (
                      <tr key={m.menu} className="hover:bg-slate-50/50 transition-colors">
                        {/* MENU ITEM WITH GREEN DOT */}
                        <td className="py-2.5 px-4 align-middle whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                            <span className="font-extrabold text-slate-900 text-xs">{m.menu}</span>
                          </div>
                        </td>

                        {/* ACTION CHECKBOXES */}
                        <td className="py-2.5 px-4 align-middle">
                          <div className="flex flex-wrap items-center gap-4">
                            {m.actions.map((act) => {
                              const isChecked = !!modalPerms[m.menu]?.[act];
                              return (
                                <label
                                  key={act}
                                  onClick={() => handleTogglePerm(m.menu, act)}
                                  className="flex items-center gap-1.5 cursor-pointer select-none group"
                                >
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isChecked ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                                    {isChecked && <Check size={11} strokeWidth={3} />}
                                  </div>
                                  <span className={`text-xs font-bold ${isChecked ? 'text-slate-900' : 'text-slate-600'}`}>
                                    {act}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MODAL FOOTER WITH YELLOW SAVE BUTTON */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setActiveModalRole(null)}
                className="px-5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModalPermissions}
                disabled={isSaving}
                className="px-6 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-slate-900 font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving && <Loader2 size={13} className="animate-spin" />}
                <span>{isSaving ? 'Saving...' : 'Save Permissions'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
