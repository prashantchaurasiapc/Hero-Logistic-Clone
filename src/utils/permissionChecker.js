/**
 * RBAC Permission Checker Utility
 * Enforces role-based menu visibility and action permissions across the application.
 */

// Mapping between Sidebar menu labels/paths and the Permission Module schema
const MENU_TO_MODULE_MAP = {
  // Driver Portal
  '/driver/dashboard': 'Driver Dashboard',
  'Driver Dashboard': 'Driver Dashboard',

  '/driver/create-draft-load': 'Create / Edit Loads',
  'Create Draft Load': 'Create / Edit Loads',
  'Create / Edit Loads': 'Create / Edit Loads',

  '/driver/assigned-jobs': 'Assigned Jobs',
  '/driver/jobs': 'Assigned Jobs',
  'Assigned Jobs': 'Assigned Jobs',

  '/driver/safety-checklist': 'Timesheets / Clock In-Out',
  '/driver/work-status': 'Timesheets / Clock In-Out',
  'Start Work / Finish Work': 'Timesheets / Clock In-Out',

  '/driver/pickup-loading': 'Pickup & Loading',
  'Pickup & Loading': 'Pickup & Loading',

  '/driver/active-run': 'Dispatch & Active Run',
  '/driver/start-trip': 'Dispatch & Active Run',
  'Dispatch & Active Run': 'Dispatch & Active Run',

  '/driver/delivery-pod': 'Delivery & POD',
  '/driver/delivery': 'Delivery & POD',
  'Delivery & POD': 'Delivery & POD',

  '/driver/fuel-expenses': 'Add Expense',
  '/driver/add-expense': 'Add Expense',
  'Fuel & Expenses': 'Add Expense',
  'Add Expense': 'Add Expense',

  '/driver/messages': 'Messages',
  'Messages': 'Messages',

  '/driver/documents': 'Documents & Compliance',
  'Documents & Compliance': 'Documents & Compliance',

  '/driver/timesheets': 'Timesheets / Clock In-Out',
  'Timesheets / Clock In-Out': 'Timesheets / Clock In-Out',

  '/driver/my-pay': 'Payroll & Pay History',
  'Payroll & Pay History': 'Payroll & Pay History',

  '/driver/trailer-swap': 'Trailer Swap',
  'Trailer Swap': 'Trailer Swap',

  '/driver/offline-sync': 'Offline Sync',
  'Offline Sync': 'Offline Sync',

  // Dispatcher Portal
  '/dispatcher/dashboard': 'Dispatch Dashboard',
  'Dispatch Dashboard': 'Dispatch Dashboard',
  '/dispatcher/create-load': 'Create Load',
  'Create Load': 'Create Load',
  '/dispatcher/active-loads': 'Active Loads',
  'Active Loads': 'Active Loads',
  '/dispatcher/planning-board': 'Terminal Workspace',
  'Terminal Workspace': 'Terminal Workspace',
  '/dispatcher/live-gps-map': 'Fleet Monitor',
  'Fleet Monitor': 'Fleet Monitor',
  '/dispatcher/workforce-availability': 'Roster Control',
  'Roster Control': 'Roster Control',
  '/dispatcher/messages': 'Communication Depot',
  'Communication Depot': 'Communication Depot',

  // Warehouse Portal
  '/warehouse/find-stock': 'Find Stock',
  'Find Stock': 'Find Stock',
  '/warehouse/receive-inbound': 'Inbound Receiving',
  'Inbound Receiving': 'Inbound Receiving',
  '/warehouse/dispatch-ready': 'Outbound Dispatch',
  'Outbound Dispatch': 'Outbound Dispatch',
  '/warehouse/warehouse-yard-map': 'Warehouse & Yard Map',
  'Warehouse & Yard Map': 'Warehouse & Yard Map',
  '/warehouse/movement-history': 'Movement History',
  'Movement History': 'Movement History',

  // Accounts Portal
  '/accounts/vehicle-costs': 'Vehicle Costs',
  'Vehicle Costs': 'Vehicle Costs',
  '/accounts/payments': 'Payments',
  'Payments': 'Payments',
  '/accounts/dashboard': 'Accounts Dashboard',
  'Accounts Dashboard': 'Accounts Dashboard',
  '/accounts/invoice-review': 'Invoice Review',
  'Invoice Review': 'Invoice Review',
  '/accounts/expenses': 'Expenses',
  'Expenses': 'Expenses',
};

/**
 * Retrieves the effective permissions dictionary for the active user.
 */
export const getActiveUserPermissions = (user) => {
  if (!user) {
    try {
      const session = JSON.parse(localStorage.getItem('hero_session') || '{}');
      user = session;
    } catch (e) {
      return {};
    }
  }

  // 1. Direct permissions object on user object
  if (user?.permissions && typeof user.permissions === 'object' && Object.keys(user.permissions).length > 0) {
    return user.permissions;
  }

  // 2. Local storage role-specific permissions cache
  const roleName = user?.role || 'DRIVER';
  const roleKey = roleName.toUpperCase().replace(/\s+/g, '_');
  try {
    const cachedRolePerms = localStorage.getItem(`hero_role_perms_${roleKey}`);
    if (cachedRolePerms) {
      return JSON.parse(cachedRolePerms);
    }
  } catch (e) {}

  return {};
};

/**
 * Checks if the user is allowed to see and access a given menu item.
 * @param {Object} user Current logged-in user
 * @param {string} menuLabel Title of menu item e.g. "Create Draft Load"
 * @param {string} menuPath URL path e.g. "/driver/create-draft-load"
 * @returns {boolean}
 */
export const hasMenuAccess = (user, menuLabel, menuPath = '') => {
  const role = (user?.role || localStorage.getItem('user_role') || '').toUpperCase().trim();

  // Super Admin and Company Admin always have access to their operational tools
  if (role === 'SUPER_ADMIN' || role === 'SUPER ADMIN') return true;
  if (role === 'COMPANY_ADMIN' || role === 'COMPANY ADMIN' || role === 'ADMIN') return true;

  // Portal domain boundary checks to prevent cross-portal leakage
  if (menuPath.startsWith('/admin') && !role.includes('SUPER')) return false;
  if (menuPath.startsWith('/company-admin') && !role.includes('ADMIN')) return false;
  if (menuPath.startsWith('/driver') && !role.includes('DRIVER')) return false;
  if (menuPath.startsWith('/dispatcher') && !role.includes('DISPATCH')) return false;
  if (menuPath.startsWith('/warehouse') && !role.includes('WAREHOUSE')) return false;
  if (menuPath.startsWith('/accounts') && !role.includes('ACCOUNT')) return false;
  if (menuPath.startsWith('/sales') && !role.includes('SALE')) return false;

  // Essential dashboard landing pages always remain accessible within user's portal
  if (menuPath.endsWith('/dashboard') || menuLabel.toLowerCase().includes('dashboard')) {
    return true;
  }

  const moduleName = MENU_TO_MODULE_MAP[menuPath] || MENU_TO_MODULE_MAP[menuLabel] || menuLabel;
  const permissions = getActiveUserPermissions(user);

  // If no permissions configured in DB or session, default to role defaults:
  // For Driver: "Create / Edit Loads" defaults to FALSE unless explicitly granted!
  if (!permissions || Object.keys(permissions).length === 0) {
    if (role.includes('DRIVER') && moduleName === 'Create / Edit Loads') {
      return false; // Standard drivers cannot create loads by default
    }
    return true; // Allow standard default driver tabs
  }

  const modulePerms = permissions[moduleName];
  if (!modulePerms || typeof modulePerms !== 'object') {
    // If permission block doesn't exist for Create / Edit Loads, restrict for driver
    if (role.includes('DRIVER') && moduleName === 'Create / Edit Loads') {
      return false;
    }
    return true;
  }

  // If explicit "Show" or "View" is set to false, hide the menu
  if (modulePerms.Show === false || modulePerms.View === false) {
    return false;
  }

  // For Create / Edit Loads specifically, require Show !== false and explicit Create or Edit permission
  if (moduleName === 'Create / Edit Loads') {
    return Boolean(modulePerms.Show !== false && (modulePerms.Create === true || modulePerms.Edit === true));
  }

  return true;
};

/**
 * Checks if the user has permission to perform a specific action on a module.
 * @param {Object} user Current user
 * @param {string} moduleName Module e.g. "Create / Edit Loads", "Delivery & POD"
 * @param {string} action Action e.g. "Create", "Edit", "Delete", "Upload", "Manage"
 * @returns {boolean}
 */
export const hasActionPermission = (user, moduleName, action) => {
  const role = (user?.role || '').toUpperCase().trim();
  if (role === 'SUPER_ADMIN' || role === 'SUPER ADMIN') return true;
  if (role === 'COMPANY_ADMIN' || role === 'COMPANY ADMIN' || role === 'ADMIN') return true;

  const permissions = getActiveUserPermissions(user);
  const targetModule = MENU_TO_MODULE_MAP[moduleName] || moduleName;
  const modulePerms = permissions[targetModule];

  if (!modulePerms || typeof modulePerms !== 'object') {
    // By default Driver cannot create loads unless granted
    if (role.includes('DRIVER') && targetModule === 'Create / Edit Loads' && (action === 'Create' || action === 'Edit')) {
      return false;
    }
    return true;
  }

  return Boolean(modulePerms[action] !== false);
};
