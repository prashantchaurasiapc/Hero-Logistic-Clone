import React, { useState } from 'react';
import {
  Shield, Edit3, Check, X, Search,
  Lock, Loader2, CheckSquare, Square, AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

/* ─── Hero Logistics Specific Role Menus & Granular Permissions ─── */
export const ROLE_MENUS = {
  COMPANY_ADMIN: [
    { name: 'Command Centre', perms: ['Show', 'View', 'Export'] },
    { name: 'All Loads', perms: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { name: 'Load Inbox', perms: ['Show', 'View', 'Manage'] },
    { name: 'Customers', perms: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { name: 'Live Tracking', perms: ['Show', 'View', 'Manage'] },
    { name: 'Drivers', perms: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { name: 'Vehicles', perms: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { name: 'Branches', perms: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { name: 'Assets', perms: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { name: 'Warehouse', perms: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { name: 'Pricing', perms: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { name: 'Payroll', perms: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { name: 'Finance', perms: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { name: 'Documents', perms: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { name: 'Reports & Analytics', perms: ['Show', 'View', 'Export', 'Manage'] },
    { name: 'Messages', perms: ['Show', 'View', 'Create', 'Manage'] },
    { name: 'User', perms: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { name: 'Role & Permission', perms: ['Show', 'View', 'Edit', 'Manage'] },
    { name: 'My Tickets', perms: ['Show', 'View', 'Create', 'Edit', 'Manage'] },
    { name: 'Open Tickets', perms: ['Show', 'View', 'Create', 'Edit', 'Manage'] },
    { name: 'Knowledge Base', perms: ['Show', 'View', 'Manage'] },
    { name: 'Settings', perms: ['Show', 'View', 'Edit', 'Manage'] },
    { name: 'Safety Checklists', perms: ['Show', 'View', 'Create', 'Edit', 'Manage'] },
    { name: 'Delivery Issues', perms: ['Show', 'View', 'Create', 'Edit', 'Manage'] },
  ],

  DISPATCHER: [
    { name: 'Dispatch Dashboard', perms: ['Show', 'View', 'Export'] },
    { name: 'Create Load', perms: ['Show', 'View', 'Create', 'Manage'] },
    { name: 'Active Loads', perms: ['Show', 'View', 'Edit', 'Manage'] },
    { name: 'Planning Board', perms: ['Show', 'View', 'Edit', 'Manage'] },
    { name: 'Live GPS Map', perms: ['Show', 'View', 'Manage'] },
    { name: 'Drivers', perms: ['Show', 'View', 'Edit', 'Manage'] },
    { name: 'Vehicles / Trailers', perms: ['Show', 'View', 'Edit', 'Manage'] },
    { name: 'Customers', perms: ['Show', 'View', 'Create', 'Edit', 'Manage'] },
    { name: 'Yard / Warehouse', perms: ['Show', 'View', 'Manage'] },
    { name: 'Workforce Availability', perms: ['Show', 'View', 'Manage'] },
    { name: 'Messages', perms: ['Show', 'View', 'Create', 'Manage'] },
    { name: 'Reports & Analytics', perms: ['Show', 'View', 'Export'] },
    { name: 'Profile', perms: ['Show', 'View', 'Edit'] },
  ],

  DRIVER: [
    { name: 'Driver Dashboard', perms: ['Show', 'View'] },
    { name: 'Start Work / Finish Work', perms: ['Show', 'View', 'Manage'] },
    { name: 'Assigned Jobs', perms: ['Show', 'View', 'Manage'] },
    { name: 'Pickup & Loading', perms: ['Show', 'View', 'Edit', 'Manage'] },
    { name: 'Dispatch & Active Run', perms: ['Show', 'View', 'Edit', 'Manage'] },
    { name: 'Delivery & POD', perms: ['Show', 'View', 'Create', 'Upload', 'Manage'] },
    { name: 'Fuel & Expenses', perms: ['Show', 'View', 'Create', 'Edit', 'Manage'] },
    { name: 'Messages', perms: ['Show', 'View', 'Create', 'Manage'] },
    { name: 'Documents & Compliance', perms: ['Show', 'View', 'Upload', 'Manage'] },
    { name: 'Timesheets / Clock In-Out', perms: ['Show', 'View', 'Manage'] },
    { name: 'Payroll & Pay History', perms: ['Show', 'View'] },
    { name: 'Trailer Swap', perms: ['Show', 'View', 'Manage'] },
    { name: 'Offline Sync', perms: ['Show', 'View', 'Manage'] },
  ],

  WAREHOUSE_MANAGER: [
    { name: 'Dashboard', perms: ['Show', 'View', 'Export'] },
    { name: 'Find Stock', perms: ['Show', 'View', 'Manage'] },
    { name: 'Receive (Inbound)', perms: ['Show', 'View', 'Create', 'Manage'] },
    { name: 'Move / Transfer', perms: ['Show', 'View', 'Create', 'Manage'] },
    { name: 'Load Lanes', perms: ['Show', 'View', 'Manage'] },
    { name: 'Dispatch Ready', perms: ['Show', 'View', 'Manage'] },
    { name: 'Stage (Holding Areas)', perms: ['Show', 'View', 'Manage'] },
    { name: 'Movement History', perms: ['Show', 'View', 'Export'] },
    { name: 'Messages', perms: ['Show', 'View', 'Create', 'Manage'] },
    { name: 'My Shift', perms: ['Show', 'View', 'Manage'] },
    { name: 'Warehouse & Yard Map', perms: ['Show', 'View', 'Manage'] },
    { name: 'Reports & Analytics', perms: ['Show', 'View', 'Export'] },
    { name: 'Profile', perms: ['Show', 'View', 'Edit'] },
  ],

  YARD_ATTENDANT: [
    { name: 'Start Work / Finish Work', perms: ['Show', 'View', 'Manage'] },
    { name: 'Dashboard', perms: ['Show', 'View'] },
    { name: 'Receive (Inbound Intake)', perms: ['Show', 'View', 'Create', 'Manage'] },
    { name: 'Find & Search', perms: ['Show', 'View'] },
    { name: 'Move', perms: ['Show', 'View', 'Create', 'Manage'] },
    { name: 'Stage Inventory', perms: ['Show', 'View', 'Manage'] },
    { name: 'Load Lanes', perms: ['Show', 'View', 'Manage'] },
    { name: 'Vehicles', perms: ['Show', 'View', 'Manage'] },
    { name: 'Locations', perms: ['Show', 'View', 'Manage'] },
    { name: 'Loads', perms: ['Show', 'View', 'Manage'] },
    { name: 'Activities', perms: ['Show', 'View', 'Create', 'Manage'] },
    { name: 'QR/Barcode Scan', perms: ['Show', 'View', 'Manage'] },
    { name: 'Yard & Warehouse Map', perms: ['Show', 'View'] },
    { name: 'Outbound Handover', perms: ['Show', 'View', 'Manage'] },
    { name: 'Labels & Barcodes', perms: ['Show', 'View', 'Create', 'Manage'] },
    { name: 'Reports & Analytics', perms: ['Show', 'View', 'Export'] },
    { name: 'Report Issue', perms: ['Show', 'View', 'Create', 'Manage'] },
  ],

  ACCOUNTS: [
    { name: 'Accounts Dashboard', perms: ['Show', 'View', 'Export'] },
    { name: 'Invoice Review', perms: ['Show', 'View', 'Edit', 'Delete', 'Manage'] },
    { name: 'Sent Invoices', perms: ['Show', 'View', 'Export', 'Manage'] },
    { name: 'Payments', perms: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { name: 'Payroll', perms: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { name: 'Contractor Pay', perms: ['Show', 'View', 'Create', 'Edit', 'Manage'] },
    { name: 'Employee Pay', perms: ['Show', 'View', 'Create', 'Edit', 'Manage'] },
    { name: 'Expenses', perms: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { name: 'GST / PAYG', perms: ['Show', 'View', 'Manage'] },
    { name: 'P&L', perms: ['Show', 'View', 'Export'] },
    { name: 'Vehicle Costs', perms: ['Show', 'View', 'Manage'] },
    { name: 'Reports', perms: ['Show', 'View', 'Export'] },
    { name: 'Profile', perms: ['Show', 'View', 'Edit'] },
  ],

  CUSTOMER: [
    { name: 'Dashboard', perms: ['Show', 'View'] },
    { name: 'My Loads', perms: ['Show', 'View', 'Track'] },
    { name: 'Create Booking', perms: ['Show', 'View', 'Create'] },
    { name: 'Invoices & Payments', perms: ['Show', 'View', 'Pay', 'Download'] },
    { name: 'Documents & PODs', perms: ['Show', 'View', 'Download'] },
    { name: 'Messages & Support', perms: ['Show', 'View', 'Create'] },
    { name: 'Account & Users', perms: ['Show', 'View', 'Edit'] },
  ],

  SALES: [
    { name: 'Sales Dashboard', perms: ['Show', 'View', 'Export'] },
    { name: 'Leads', perms: ['Show', 'View', 'Create', 'Edit', 'Delete', 'Manage'] },
    { name: 'Pipeline Board', perms: ['Show', 'View', 'Edit', 'Manage'] },
    { name: 'Demo Bookings', perms: ['Show', 'View', 'Create', 'Edit', 'Manage'] },
    { name: 'Trial Companies', perms: ['Show', 'View', 'Create', 'Edit', 'Manage'] },
    { name: 'Proposals', perms: ['Show', 'View', 'Create', 'Edit', 'Manage'] },
    { name: 'Follow-Ups', perms: ['Show', 'View', 'Create', 'Edit', 'Manage'] },
    { name: 'Onboarding Handover', perms: ['Show', 'View', 'Manage'] },
    { name: 'Sales Reports', perms: ['Show', 'View', 'Export'] },
    { name: 'Messages', perms: ['Show', 'View', 'Create', 'Manage'] },
    { name: 'Settings', perms: ['Show', 'View', 'Edit'] },
  ],
};

/* Get role menu configuration */
const getRoleMenus = (roleSlug, roleName) => {
  const key = roleSlug || roleName?.replace(/\s+/g, '_').toUpperCase();
  return ROLE_MENUS[key] || ROLE_MENUS.COMPANY_ADMIN;
};

/* Get all granted permission badges for a role */
const getGrantedBadges = (permissions) => {
  const badges = [];
  Object.entries(permissions || {}).forEach(([mod, perms]) => {
    if (typeof perms === 'object' && perms !== null) {
      Object.entries(perms).forEach(([perm, val]) => {
        if (val) badges.push(`${mod}: ${perm}`);
      });
    }
  });
  return badges;
};

const BADGE_COLORS = [
  'bg-emerald-50 text-emerald-700 border-emerald-200',
  'bg-blue-50 text-blue-700 border-blue-200',
  'bg-amber-50 text-amber-700 border-amber-200',
  'bg-purple-50 text-purple-700 border-purple-200',
  'bg-rose-50 text-rose-700 border-rose-200',
  'bg-teal-50 text-teal-700 border-teal-200',
];

export default function RolesPermissions() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/custom-roles');
      if (res.data?.success) {
        setRoles(res.data.data.map(r => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
          isSystem: r.isSystem,
          permissions: r.permissions || {},
          parentPermissions: r.parentPermissions || {},
          usersCount: 0
        })));
      }
    } catch (err) {
      console.error('Failed to fetch custom roles', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRoles();
  }, []);

  const [perPage, setPerPage]         = useState(10);
  const [toast, setToast]             = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRole, setEditRole]       = useState(null);

  /* Form state for edit modal */
  const [formName, setFormName]       = useState('');
  const [formPerms, setFormPerms]     = useState({});

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // Hierarchy check: Super Admin can edit all 8 roles; Company Admin can edit subordinate roles only
  const isEditableRole = (role) => {
    if (isSuperAdmin) return true;
    if (role.slug === 'COMPANY_ADMIN' || role.name?.toUpperCase() === 'COMPANY ADMIN') {
      return false;
    }
    return true;
  };

  /* Open Edit modal */
  const openEdit = (role) => {
    if (!isEditableRole(role)) return;
    setEditRole(role);
    setFormName(role.name);

    const roleMenus = getRoleMenus(role.slug, role.name);
    const existingPerms = role.permissions || {};
    const parentPerms = role.parentPermissions || {};
    const initialPerms = {};

    roleMenus.forEach(m => {
      initialPerms[m.name] = {};
      m.perms.forEach(p => {
        // If not super admin and parent disabled this permission -> strictly false
        if (!isSuperAdmin && parentPerms[m.name]?.[p] === false) {
          initialPerms[m.name][p] = false;
        } else if (existingPerms[m.name] && existingPerms[m.name][p] !== undefined) {
          initialPerms[m.name][p] = Boolean(existingPerms[m.name][p]);
        } else {
          initialPerms[m.name][p] = true;
        }
      });
    });

    setFormPerms(initialPerms);
    setShowEditModal(true);
  };

  /* Toggle individual permission checkbox */
  const togglePerm = (modName, perm) => {
    // If not super admin, check if parent locked this item
    if (!isSuperAdmin && editRole?.parentPermissions?.[modName]?.[perm] === false) {
      notify(`This permission is disabled by Platform Super Admin and cannot be enabled.`);
      return;
    }

    setFormPerms(prev => {
      const modObj = prev[modName] || {};
      const nextVal = !modObj[perm];
      const updatedMod = { ...modObj, [perm]: nextVal };

      // If Show/View is turned off, also uncheck other actions; if an action is turned on, ensure Show/View is enabled
      if ((perm === 'Show' || perm === 'View') && !nextVal) {
        Object.keys(updatedMod).forEach(k => { updatedMod[k] = false; });
      } else if (nextVal && (perm !== 'Show' && perm !== 'View')) {
        if (updatedMod.Show !== undefined) updatedMod.Show = true;
        if (updatedMod.View !== undefined) updatedMod.View = true;
      }

      return {
        ...prev,
        [modName]: updatedMod
      };
    });
  };

  /* Select all permissions (respecting Parent Super Admin locks) */
  const selectAll = () => {
    if (!editRole) return;
    const roleMenus = getRoleMenus(editRole.slug, editRole.name);
    const parentPerms = editRole.parentPermissions || {};
    const updated = {};

    roleMenus.forEach(m => {
      updated[m.name] = {};
      m.perms.forEach(p => {
        // If super admin: select all; if company admin: select only what super admin allowed
        if (isSuperAdmin) {
          updated[m.name][p] = true;
        } else {
          updated[m.name][p] = parentPerms[m.name]?.[p] !== false;
        }
      });
    });
    setFormPerms(updated);
  };

  /* Deselect all permissions */
  const deselectAll = () => {
    if (!editRole) return;
    const roleMenus = getRoleMenus(editRole.slug, editRole.name);
    const updated = {};
    roleMenus.forEach(m => {
      updated[m.name] = {};
      m.perms.forEach(p => { updated[m.name][p] = false; });
    });
    setFormPerms(updated);
  };

  /* Save permissions */
  const handleSave = async (e) => {
    e.preventDefault();
    if (!editRole) return;
    try {
      setIsLoading(true);
      const payload = {
        permissions: formPerms
      };
      const res = await api.put(`/custom-roles/${editRole.id}`, payload);
      if (res.data?.success) {
        notify(`Permissions for "${editRole.name}" updated successfully!`);
        setShowEditModal(false);
        fetchRoles();
      }
    } catch (err) {
      notify(err.response?.data?.error?.message || err.response?.data?.message || 'Error saving role permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = roles
    .filter(r => isSuperAdmin || (r.slug !== 'SALES' && r.name?.toUpperCase() !== 'SALES'))
    .filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  const currentRoleMenus = editRole ? getRoleMenus(editRole.slug, editRole.name) : [];
  const parentPerms = editRole?.parentPermissions || {};

  return (
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 overflow-y-auto w-full text-left font-sans min-h-screen relative">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-[999999] flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600 flex-shrink-0" /> Role & Permission
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            {isSuperAdmin
              ? 'Platform Master Controls: Configure global access permissions. Any menu/action you disable here cannot be enabled by Company Admins.'
              : 'Company Controls: Customize permissions for subordinate operational roles. Menus disabled by Platform Super Admin are locked.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-black">
            <Shield className="w-3.5 h-3.5 text-purple-600" /> {isSuperAdmin ? '8 Fixed Platform Roles (Master)' : '7 Company Roles (Child)'}
          </span>
        </div>
      </div>

      {/* ── TOOLBAR ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <select
            value={perPage}
            onChange={e => setPerPage(+e.target.value)}
            className="border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 font-bold focus:outline-none cursor-pointer"
          >
            {[7, 8, 10, 25, 50].map(n => <option key={n}>{n}</option>)}
          </select>
          entries per page
        </div>

        <div className="relative w-full sm:w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search roles..."
            className="pl-8 pr-4 py-2 border border-slate-200 rounded-xl bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-amber-400 w-full transition-all"
          />
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full min-w-[650px] text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3.5 text-left text-[11px] font-black text-slate-400 uppercase tracking-wider w-48 whitespace-nowrap">Role</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-black text-slate-400 uppercase tracking-wider">Permitted Menus & Actions</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-black text-slate-400 uppercase tracking-wider w-24 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center text-slate-400 font-semibold text-sm">
                    <div className="flex justify-center items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading roles...</div>
                  </td>
                </tr>
              ) : filtered.slice(0, perPage).length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center text-slate-400 font-semibold text-sm">
                    No roles found.
                  </td>
                </tr>
              ) : filtered.slice(0, perPage).map((role) => {
                const badges = getGrantedBadges(role.permissions);
                const editable = isEditableRole(role);
                return (
                  <tr key={role.id} className="hover:bg-slate-50/50 transition-all border-b border-slate-50">
                    {/* Role name */}
                    <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                      <span className="inline-flex items-center gap-2 font-black text-slate-800 text-sm whitespace-nowrap">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
                        {role.name}
                      </span>
                    </td>

                    {/* Permission badges */}
                    <td className="px-5 py-3.5 align-middle">
                      <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible scrollbar-hide gap-1.5 py-0.5 items-center">
                        {badges.slice(0, 15).map((b, bi) => (
                          <span
                            key={b}
                            className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap flex-shrink-0 ${BADGE_COLORS[bi % BADGE_COLORS.length]}`}
                          >
                            {b}
                          </span>
                        ))}
                        {badges.length > 15 && (
                          <span className="inline-flex items-center text-[10px] font-black px-2.5 py-1 rounded-full border bg-slate-100 text-slate-600 border-slate-200 whitespace-nowrap flex-shrink-0">
                            +{badges.length - 15} more
                          </span>
                        )}
                        {badges.length === 0 && (
                          <span className="text-xs text-rose-500 font-bold italic whitespace-nowrap flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> All permissions disabled
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 align-middle text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                        {editable ? (
                          <button
                            onClick={() => openEdit(role)}
                            className="w-8 h-8 rounded-lg bg-sky-500 hover:bg-sky-600 flex items-center justify-center transition-all cursor-pointer shadow-sm flex-shrink-0"
                            title="Edit Role Menus & Permissions"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-white" />
                          </button>
                        ) : (
                          <span
                            className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0 cursor-not-allowed"
                            title="Company Admin permissions are configured by Super Admin only"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="px-5 py-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>Showing 1 – {Math.min(perPage, filtered.length)} of {filtered.length} entries</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 cursor-pointer transition-all">Previous</button>
            <button className="px-3 py-1.5 rounded-lg bg-brand-500 text-black font-black cursor-pointer">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 cursor-pointer transition-all">Next</button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          EDIT ROLE PERMISSIONS MODAL (z-[99999])
      ══════════════════════════════════════════ */}
      {showEditModal && editRole && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] my-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-purple-600" />
                Configure Menu Access & Permissions — {editRole.name}
              </h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-700 text-xl cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

                {/* Role Info & Quick Action Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <div className="text-xs font-black text-slate-800 flex items-center gap-2">
                      Role: <span className="text-purple-700">{editRole.name}</span>
                      {!isSuperAdmin && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                          Child Mode (Bound to Super Admin Master)
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      {isSuperAdmin
                        ? 'Master Setting: Disabling a menu/action here locks it globally for all Company Admins.'
                        : 'You can customize allowed permissions for your company. Items disabled by Super Admin are locked.'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={selectAll}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <CheckSquare className="w-3.5 h-3.5" /> Select All
                    </button>
                    <button
                      type="button"
                      onClick={deselectAll}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5" /> Deselect All
                    </button>
                  </div>
                </div>

                {/* Role Menu & Permissions Table */}
                <div>
                  <div className="border border-slate-200 rounded-xl overflow-x-auto custom-scrollbar max-h-[50vh]">
                    <table className="w-full min-w-[500px] text-xs border-collapse">
                      <thead className="sticky top-0 bg-slate-100 z-10">
                        <tr className="border-b border-slate-200">
                          <th className="px-4 py-3 text-left font-black text-slate-600 uppercase tracking-wider text-[11px] w-56">ROLE MENU / SUBMENU</th>
                          <th className="px-4 py-3 text-left font-black text-slate-600 uppercase tracking-wider text-[11px]">PERMITTED ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentRoleMenus.map((mod) => {
                          const modPerms = formPerms[mod.name] || {};
                          const isParentShowAllowed = isSuperAdmin || (parentPerms[mod.name]?.Show !== false && parentPerms[mod.name]?.View !== false);
                          const isVisible = Boolean(modPerms.Show !== false && modPerms.View !== false && isParentShowAllowed);

                          return (
                            <tr key={mod.name} className={`hover:bg-slate-50/50 transition-all ${isVisible ? '' : 'bg-slate-50/70 opacity-60'}`}>
                              {/* Menu name */}
                              <td className="px-4 py-3 font-bold text-slate-800 align-middle text-xs">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${isVisible ? 'bg-emerald-500' : 'bg-rose-400'}`} />
                                  <span className={!isParentShowAllowed ? 'line-through text-slate-400' : ''}>{mod.name}</span>
                                  {!isParentShowAllowed && (
                                    <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                                      <Lock className="w-2.5 h-2.5" /> Locked by Super Admin
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Checkboxes */}
                              <td className="px-4 py-3">
                                <div className="flex flex-wrap items-center gap-3">
                                  {mod.perms.map(perm => {
                                    const isParentPermAllowed = isSuperAdmin || Boolean(parentPerms[mod.name]?.[perm] !== false);
                                    const isChecked = isParentPermAllowed && Boolean(modPerms[perm]);

                                    return (
                                      <label
                                        key={perm}
                                        title={!isParentPermAllowed ? 'Disabled by Platform Super Admin (Master)' : ''}
                                        className={`flex items-center gap-1.5 select-none ${isParentPermAllowed ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}`}
                                      >
                                        <input
                                          type="checkbox"
                                          disabled={!isParentPermAllowed}
                                          checked={isChecked}
                                          onChange={() => togglePerm(mod.name, perm)}
                                          className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400 cursor-pointer disabled:cursor-not-allowed"
                                        />
                                        <span className={`text-xs font-semibold flex items-center gap-0.5 ${isChecked ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                                          {!isParentPermAllowed && <Lock className="w-2.5 h-2.5 text-slate-400" />}
                                          {perm}
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 rounded-b-2xl">
                <button type="button" onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-white cursor-pointer transition-all">
                  Cancel
                </button>
                <button type="submit"
                  className="px-6 py-2.5 bg-brand-500 hover:bg-[#f5c800] rounded-xl text-sm font-black text-black cursor-pointer transition-all shadow-sm">
                  Save Permissions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
