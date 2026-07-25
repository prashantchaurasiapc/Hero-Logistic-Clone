import React, { useState, useRef } from 'react';
import {
  Building, Users, Award, Plug, Cpu, ShieldCheck, CheckCircle2, Clock,
  AlertTriangle, Mail, Sliders, DollarSign, CreditCard, Bell, Shield,
  ArrowUpRight, Activity, Database, RefreshCw, Bookmark, ChevronRight,
  ChevronDown, HelpCircle, Phone, MapPin, Globe, Save, Check, Zap,
  TrendingUp, BarChart2, Server, Lock, UserPlus, FileText, ArrowRight,
  HardDrive, Layers, CheckSquare, MessageSquare, AlertCircle, Upload,
  Trash2, Download, Info, Calendar, Palette, Hash, Settings, FileCheck,
  UserCheck, UserX, Key, Search, Plus, Edit, Filter, MoreHorizontal, Send,
  Link2, Star, Truck, Crown
} from 'lucide-react';

export default function CompanySettings() {
  const [currentView, setCurrentView] = useState('subscription-billing'); // Default to 13.9 Subscription & Billing (Screenshot 2)
  const [billingTab, setBillingTab] = useState('Overview');
  const [securityLogsTab, setSecurityLogsTab] = useState('Overview');
  const [notificationsTab, setNotificationsTab] = useState('Overview');
  const [activeTab, setActiveTab] = useState('Company Details');
  const [usersTab, setUsersTab] = useState('Users');
  const [isMoreActionsDropdownOpen, setIsMoreActionsDropdownOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const logoInputRef = useRef(null);
  
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Form State for 13.2 Company Settings
  const [companyDetails, setCompanyDetails] = useState({
    companyName: 'Hero Logistics Pty Ltd',
    tradingName: 'Hero Logistics',
    abn: '12 345 678 901',
    acn: '123 456 789',
    registeredAddress: 'Level 8, 25 Market Street',
    city: 'Sydney',
    state: 'NSW',
    postcode: '2000',
    country: 'Australia',
    phone: '+61 2 9123 4567',
    email: 'admin@herologistics.com.au',
    website: 'www.herologistics.com.au',
    startDate: '2023-01-01',
    description: "Australia's trusted logistics and transport partner, delivering reliable, safe and efficient solutions nationwide."
  });

  const [contactDetails, setContactDetails] = useState({
    name: 'Sarah Mitchell',
    position: 'Operations Director',
    phone: '+61 412 345 678',
    email: 'sarah.mitchell@herologistics.com.au'
  });

  const [businessHours, setBusinessHours] = useState({
    timeZone: '(AEST) Australia/Sydney',
    start: '07:00 AM',
    end: '05:00 PM',
    weekStart: 'Monday'
  });

  const [defaultBranch, setDefaultBranch] = useState({
    name: 'Sydney Head Office',
    address: 'Level 8, 25 Market Street, Sydney NSW 2000',
    phone: '+61 2 9123 4567',
    email: 'sydney@herologistics.com.au'
  });

  const [taxCompliance, setTaxCompliance] = useState({
    gstRegistered: true,
    gstDate: '2023-01-01',
    tfn: '12 345 678 901',
    payg: 'AAMI',
    workersComp: true,
    workersPolicy: 'WCI123456789',
    publicLiability: 'QBE Insurance',
    publicPolicy: 'PL123456789'
  });

  // COMPANY BRANDING STATE
  const [logoUrl, setLogoUrl] = useState(null); // null = default Hero logo
  const [branding, setBranding] = useState({
    primary: '#1E3ABA',
    secondary: '#6356F1',
    accent: '#F59EOB'
  });

  // Logo Upload Handler
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerToast('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setLogoUrl(uploadEvent.target.result);
        triggerToast('Company logo updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const [financials, setFinancials] = useState({
    currency: 'AUD - Australian Dollar ($)',
    taxRate: '10%',
    method: 'Exclusive',
    rounding: '2 Decimal Places',
    paymentTerms: '30 Days',
    priceList: 'Standard Price List',
    pricesIncludeTax: false
  });

  // Additional States for 7 Sub-tabs in 13.2
  const [operationalDefaults, setOperationalDefaults] = useState({
    autoAssignDrivers: true,
    maxDrivingHours: '12',
    breakMandatory: '30 mins after 5 hrs',
    fuelPolicy: 'Fill Full Tank before Shift',
    defaultDepot: 'Sydney Central Yard',
    speedLimitAlert: '110 km/h'
  });

  const [paymentTermsState, setPaymentTermsState] = useState({
    defaultCreditPeriod: '30 Days',
    lateFeeRate: '2.5%',
    bankName: 'Commonwealth Bank of Australia',
    bsb: '062-000',
    accountNumber: '1234 5678',
    remittanceEmail: 'accounts@herologistics.com.au',
    allowCreditCard: true,
    allowDirectDebit: true
  });

  const [docNumbering, setDocNumbering] = useState({
    invPrefix: 'INV-2025-',
    invNext: '001042',
    podPrefix: 'POD-2025-',
    podNext: '005820',
    qtePrefix: 'QTE-2025-',
    qteNext: '000315',
    conPrefix: 'CON-2025-',
    conNext: '012940'
  });

  const [otherPreferences, setOtherPreferences] = useState({
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12-Hour (09:30 AM)',
    units: 'Metric (km, kg, L)',
    language: 'English (Australia)',
    autoBackupDaily: true,
    auditLogRetention: '365 Days'
  });

  // State for 13.3 Users, Roles & Permissions
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [activeRowMenuId, setActiveRowMenuId] = useState(null);

  const [usersList, setUsersList] = useState([
    { id: 1, name: 'Sarah Mitchell', email: 'sarah.mitchell@herologistics.com.au', role: 'Super Admin', roleColor: 'bg-purple-100 text-purple-700', branch: 'All Branches', status: 'Active', lastLogin: '30 May 2025 09:15 AM', joined: '01 Jan 2023', phone: '+61 412 345 678', avatar: 'SM', avatarBg: 'bg-purple-600' },
    { id: 2, name: 'John Davis', email: 'john.davis@herologistics.com.au', role: 'Admin', roleColor: 'bg-blue-100 text-blue-700', branch: 'All Branches', status: 'Active', lastLogin: '30 May 2025 08:45 AM', joined: '15 Mar 2023', phone: '+61 419 876 543', avatar: 'JD', avatarBg: 'bg-blue-600' },
    { id: 3, name: 'Ravi Wilson', email: 'ravi.wilson@herologistics.com.au', role: 'Dispatch Manager', roleColor: 'bg-amber-100 text-amber-800', branch: 'Sydney, Melbourne', status: 'Active', lastLogin: '30 May 2025 07:58 AM', joined: '10 Feb 2023', phone: '+61 433 112 233', avatar: 'RW', avatarBg: 'bg-amber-600' },
    { id: 4, name: 'Amit Handa', email: 'amit.handa@herologistics.com.au', role: 'Dispatcher', roleColor: 'bg-teal-100 text-teal-800', branch: 'Sydney', status: 'Active', lastLogin: '30 May 2025 07:20 AM', joined: '05 Apr 2023', phone: '+61 422 334 455', avatar: 'AH', avatarBg: 'bg-teal-600' },
    { id: 5, name: 'Lisa Patel', email: 'lisa.patel@herologistics.com.au', role: 'Accounts', roleColor: 'bg-purple-100 text-purple-800', branch: 'Sydney', status: 'Active', lastLogin: '30 May 2025 09:10 AM', joined: '12 Apr 2023', phone: '+61 455 667 788', avatar: 'LP', avatarBg: 'bg-indigo-600' },
    { id: 6, name: 'Brian Taylor', email: 'brian.taylor@herologistics.com.au', role: 'Warehouse Manager', roleColor: 'bg-orange-100 text-orange-800', branch: 'Melbourne Warehouse', status: 'Active', lastLogin: '30 May 2025 06:55 AM', joined: '18 Apr 2023', phone: '+61 477 889 900', avatar: 'BT', avatarBg: 'bg-orange-600' },
    { id: 7, name: 'Michael Kumar', email: 'michael.kumar@herologistics.com.au', role: 'Driver', roleColor: 'bg-emerald-100 text-emerald-800', branch: 'Sydney', status: 'Active', lastLogin: '30 May 2025 05:30 AM', joined: '22 Apr 2023', phone: '+61 488 990 112', avatar: 'MK', avatarBg: 'bg-emerald-600' },
    { id: 8, name: 'Shane Cooper', email: 'shane.cooper@herologistics.com.au', role: 'Customer User', roleColor: 'bg-pink-100 text-pink-700', branch: 'All Branches', status: 'Inactive', lastLogin: '25 May 2025 11:40 AM', joined: '02 May 2023', phone: '+61 411 223 344', avatar: 'SC', avatarBg: 'bg-slate-500' }
  ]);

  const [selectedUser, setSelectedUser] = useState({
    id: 1,
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@herologistics.com.au',
    role: 'Super Admin',
    branch: 'All Branches',
    status: 'Active',
    lastLogin: '30 May 2025 09:15 AM',
    joined: '01 Jan 2023',
    phone: '+61 412 345 678',
    avatar: 'SM',
    avatarBg: 'bg-purple-600'
  });

  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'Admin',
    branch: 'Sydney',
    status: 'Active',
    phone: ''
  });

  const [editUserForm, setEditUserForm] = useState({
    id: null,
    name: '',
    email: '',
    role: 'Admin',
    branch: 'Sydney',
    status: 'Active',
    phone: ''
  });

  // Roles Management State
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);

  const [rolesList, setRolesList] = useState([
    { id: 1, name: 'Super Admin', users: 1, desc: 'Unrestricted full platform & system access', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { id: 2, name: 'Admin', users: 3, desc: 'Manage company settings, users and branches', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 3, name: 'Dispatch Manager', users: 4, desc: 'Full dispatch control & driver roster oversight', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { id: 4, name: 'Dispatcher', users: 8, desc: 'Assign loads to drivers & track live jobs', color: 'bg-teal-100 text-teal-800 border-teal-200' },
    { id: 5, name: 'Accounts', users: 6, desc: 'Invoicing, payroll, rates and financial reports', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { id: 6, name: 'Warehouse Manager', users: 5, desc: 'Stock movements, bin locations & dispatch', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { id: 7, name: 'Driver', users: 15, desc: 'Mobile app job execution & proof of delivery', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { id: 8, name: 'Customer User', users: 6, desc: 'Customer portal access for load tracking', color: 'bg-pink-100 text-pink-700 border-pink-200' }
  ]);

  const [newRoleForm, setNewRoleForm] = useState({
    name: '',
    desc: '',
    colorTheme: 'blue'
  });

  const [editRoleForm, setEditRoleForm] = useState({
    id: null,
    name: '',
    desc: '',
    colorTheme: 'blue'
  });

  const getThemeClass = (theme) => {
    switch (theme) {
      case 'purple': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'amber': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'teal': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'orange': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'emerald': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pink': return 'bg-pink-100 text-pink-700 border-pink-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const handleCreateRoleSubmit = (e) => {
    e.preventDefault();
    if (!newRoleForm.name) {
      triggerToast('Please enter a role name!');
      return;
    }

    const newRoleObj = {
      id: Date.now(),
      name: newRoleForm.name,
      users: 0,
      desc: newRoleForm.desc || 'Custom system security role',
      color: getThemeClass(newRoleForm.colorTheme)
    };

    setRolesList([...rolesList, newRoleObj]);
    setIsCreateRoleModalOpen(false);
    setNewRoleForm({ name: '', desc: '', colorTheme: 'blue' });
    triggerToast(`Role "${newRoleObj.name}" created successfully!`);
  };

  const handleOpenEditRoleModal = (roleObj) => {
    setEditRoleForm({
      id: roleObj.id,
      name: roleObj.name,
      desc: roleObj.desc,
      colorTheme: 'blue'
    });
    setIsEditRoleModalOpen(true);
  };

  const handleEditRoleSubmit = (e) => {
    e.preventDefault();
    const updatedRoles = rolesList.map(r => {
      if (r.id === editRoleForm.id) {
        return {
          ...r,
          name: editRoleForm.name,
          desc: editRoleForm.desc
        };
      }
      return r;
    });

    setRolesList(updatedRoles);
    setIsEditRoleModalOpen(false);
    triggerToast(`Role "${editRoleForm.name}" updated successfully!`);
  };

  // Workflow Rules State (13.4)
  const [workflowTab, setWorkflowTab] = useState('Overview');
  const [workflowSearchQuery, setWorkflowSearchQuery] = useState('');
  const [workflowCategoryFilter, setWorkflowCategoryFilter] = useState('All Categories');
  const [workflowStatusFilter, setWorkflowStatusFilter] = useState('All Status');
  const [workflowTriggerFilter, setWorkflowTriggerFilter] = useState('All Triggers');

  const [isCreateWorkflowRuleModalOpen, setIsCreateWorkflowRuleModalOpen] = useState(false);
  const [isEditWorkflowRuleModalOpen, setIsEditWorkflowRuleModalOpen] = useState(false);
  const [activeRuleRowMenuId, setActiveRuleRowMenuId] = useState(null);

  const [workflowRulesList, setWorkflowRulesList] = useState([
    { id: 1, name: 'Auto Invoice on Delivery', desc: 'Automatically generate invoice when load is delivered', category: 'Invoice Automation', categoryColor: 'bg-teal-100 text-teal-800', trigger: 'Load Status: Delivered', action: 'Create Invoice & Notify Accounts', status: 'Active', lastExecuted: '30 May 2025 09:15 AM', executions: 128, createdBy: 'Sarah Mitchell', createdOn: '01 Jan 2023', lastModified: '28 May 2025 10:30 AM' },
    { id: 2, name: 'Payment Reminder - Overdue', desc: 'Send reminder for overdue invoices', category: 'Payment Reminders', categoryColor: 'bg-blue-100 text-blue-800', trigger: 'Invoice Due Date Passed', action: 'Send Email to Customer', status: 'Active', lastExecuted: '30 May 2025 08:30 AM', executions: 342, createdBy: 'John Davis', createdOn: '15 Feb 2023', lastModified: '20 May 2025 04:15 PM' },
    { id: 3, name: 'License Expiry Reminder', desc: 'Remind before driver license expires', category: 'Compliance Reminders', categoryColor: 'bg-amber-100 text-amber-800', trigger: 'License Expiry 7 Days Before', action: 'Send Email to Driver & Admin', status: 'Active', lastExecuted: '30 May 2025 07:20 AM', executions: 56, createdBy: 'Sarah Mitchell', createdOn: '10 Mar 2023', lastModified: '18 May 2025 02:10 PM' },
    { id: 4, name: 'Load Arrived - Notify Customer', desc: 'Notify customer when driver arrives', category: 'Load Status Actions', categoryColor: 'bg-purple-100 text-purple-800', trigger: 'Load Status: Arrived', action: 'Send SMS to Customer', status: 'Active', lastExecuted: '30 May 2025 06:45 AM', executions: 214, createdBy: 'Ravi Wilson', createdOn: '02 Apr 2023', lastModified: '25 May 2025 11:20 AM' },
    { id: 5, name: 'POD Received - Notify Customer', desc: 'Notify customer when POD is uploaded', category: 'Customer Notifications', categoryColor: 'bg-amber-100 text-amber-800', trigger: 'POD Uploaded', action: 'Send Email with POD Attachment', status: 'Active', lastExecuted: '30 May 2025 05:10 AM', executions: 187, createdBy: 'Amit Handa', createdOn: '18 May 2023', lastModified: '22 May 2025 09:40 AM' },
    { id: 6, name: 'Expense Approval Workflow', desc: 'Route expenses for approval', category: 'Approval Workflows', categoryColor: 'bg-[#EEF2FF] text-[#4F46E5]', trigger: 'Expense Submitted', action: 'Send to Manager for Approval', status: 'Active', lastExecuted: '30 May 2025 04:05 AM', executions: 91, createdBy: 'Lisa Patel', createdOn: '20 Jun 2023', lastModified: '27 May 2025 01:15 PM' },
    { id: 7, name: 'Maintenance Due Alert', desc: 'Alert when vehicle maintenance is due', category: 'Compliance Reminders', categoryColor: 'bg-amber-100 text-amber-800', trigger: 'Maintenance Due 1 Day Before', action: 'Send Email to Admin & Driver', status: 'Inactive', lastExecuted: '-', executions: 0, createdBy: 'Brian Taylor', createdOn: '05 Aug 2023', lastModified: '10 May 2025 08:30 AM' },
    { id: 8, name: 'Payment Received - Thank You', desc: 'Send thank you when payment is received', category: 'Customer Notifications', categoryColor: 'bg-amber-100 text-amber-800', trigger: 'Payment Received', action: 'Send Email to Customer', status: 'Active', lastExecuted: '30 May 2025 02:16 AM', executions: 275, createdBy: 'Sarah Mitchell', createdOn: '12 Sep 2023', lastModified: '29 May 2025 03:50 PM' }
  ]);

  const [selectedWorkflowRule, setSelectedWorkflowRule] = useState({
    id: 1,
    name: 'Auto Invoice on Delivery',
    desc: 'Automatically generate invoice when load is delivered',
    category: 'Invoice Automation',
    categoryColor: 'bg-teal-100 text-teal-800',
    trigger: 'Load Status: Delivered',
    action: 'Create Invoice & Notify Accounts',
    status: 'Active',
    lastExecuted: '30 May 2025 09:15 AM',
    executions: 128,
    createdBy: 'Sarah Mitchell',
    createdOn: '01 Jan 2023',
    lastModified: '28 May 2025 10:30 AM'
  });

  const [newWorkflowRuleForm, setNewWorkflowRuleForm] = useState({
    name: '',
    desc: '',
    category: 'Invoice Automation',
    trigger: 'Load Status: Delivered',
    action: 'Create Invoice & Notify Accounts',
    status: 'Active'
  });

  const [editWorkflowRuleForm, setEditWorkflowRuleForm] = useState({
    id: null,
    name: '',
    desc: '',
    category: 'Invoice Automation',
    trigger: 'Load Status: Delivered',
    action: 'Create Invoice & Notify Accounts',
    status: 'Active'
  });

  // AI Configuration State (13.5 - Screenshot 2 Match)
  const [aiTab, setAiTab] = useState('Overview');
  const [aiFeaturesList, setAiFeaturesList] = useState([
    { id: 1, name: 'AI Load Creation', desc: 'Auto-create loads from emails, bookings and documents', status: 'Enabled', model: 'GPT-4o', confidence: 90, autoExecute: true, iconBg: 'bg-blue-50 text-blue-600 border border-blue-100', icon: <FileText size={13} /> },
    { id: 2, name: 'Trailer Recommendation', desc: 'Suggest best trailer based on load and availability', status: 'Enabled', model: 'Hero AI Model v1.3', confidence: 85, autoExecute: true, iconBg: 'bg-orange-50 text-orange-600 border border-orange-100', icon: <Zap size={13} /> },
    { id: 3, name: 'Document OCR', desc: 'Extract data from invoices, receipts and documents', status: 'Enabled', model: 'Azure OCR v3', confidence: 95, autoExecute: true, iconBg: 'bg-purple-50 text-purple-600 border border-purple-100', icon: <FileCheck size={13} /> },
    { id: 4, name: 'AI Messaging Assistant', desc: 'Smart replies and message suggestions', status: 'Enabled', model: 'GPT-4o Mini', confidence: 80, autoExecute: false, iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100', icon: <MessageSquare size={13} /> },
    { id: 5, name: 'Payment Reminder AI', desc: 'Predict overdue invoices and send smart reminders', status: 'Enabled', model: 'Hero AI Model v1.1', confidence: 88, autoExecute: true, iconBg: 'bg-amber-50 text-amber-600 border border-amber-100', icon: <Bell size={13} /> },
    { id: 6, name: 'Load Price Suggestion', desc: 'Suggest optimal pricing for new loads', status: 'Disabled', model: 'Hero AI Model v1.0', confidence: 75, autoExecute: false, iconBg: 'bg-blue-50 text-blue-600 border border-blue-100', icon: <TrendingUp size={13} /> },
    { id: 7, name: 'Compliance Monitoring', desc: 'Monitor compliance and document expiries', status: 'Enabled', model: 'Compliance AI v2.2', confidence: 90, autoExecute: true, iconBg: 'bg-rose-50 text-rose-600 border border-rose-100', icon: <ShieldCheck size={13} /> },
    { id: 8, name: 'Maintenance Prediction', desc: 'Predict maintenance based on usage and history', status: 'Enabled', model: 'Predictive AI v1.5', confidence: 85, autoExecute: true, iconBg: 'bg-purple-50 text-purple-600 border border-purple-100', icon: <Settings size={13} /> },
  ]);

  const [aiModelsList, setAiModelsList] = useState([
    { id: 1, name: 'GPT-4o', provider: 'OpenAI', version: '4o-2024-05-13', status: 'Active', lastUpdated: '28 May 2025' },
    { id: 2, name: 'Hero AI Model', provider: 'Hero AI', version: 'v1.3', status: 'Active', lastUpdated: '20 May 2025' },
    { id: 3, name: 'Azure OCR', provider: 'Microsoft', version: 'v3.2', status: 'Active', lastUpdated: '18 May 2025' },
    { id: 4, name: 'Hero AI Mini', provider: 'Hero AI', version: 'v1.1', status: 'Active', lastUpdated: '15 May 2025' },
    { id: 5, name: 'Compliance AI', provider: 'Hero AI', version: 'v2.2', status: 'Active', lastUpdated: '10 May 2025' },
  ]);

  // Integrations State (13.6)
  const [integrationsTab, setIntegrationsTab] = useState('Overview');
  const [isRefreshingIntegrations, setIsRefreshingIntegrations] = useState(false);
  const [isAddIntegrationModalOpen, setIsAddIntegrationModalOpen] = useState(false);
  const [newIntegrationForm, setNewIntegrationForm] = useState({
    name: '',
    category: 'Accounting',
    provider: 'Xero Accounting',
    apiKey: '',
    syncFrequency: 'Every 15 minutes',
    autoSync: true
  });

  const handleRefreshIntegrations = () => {
    setIsRefreshingIntegrations(true);
    triggerToast('Syncing all integrations in real time...');
    setTimeout(() => {
      setIsRefreshingIntegrations(false);
      triggerToast('All 12 integrations refreshed successfully!');
    }, 1200);
  };

  const handleAddIntegrationSubmit = (e) => {
    e.preventDefault();
    if (!newIntegrationForm.name) {
      triggerToast('Please enter an integration name.');
      return;
    }
    triggerToast(`Successfully connected ${newIntegrationForm.name}!`);
    setIsAddIntegrationModalOpen(false);
    setNewIntegrationForm({
      name: '',
      category: 'Accounting',
      provider: 'Xero Accounting',
      apiKey: '',
      syncFrequency: 'Every 15 minutes',
      autoSync: true
    });
  };

  // Notifications State (13.7)
  const [isRefreshingNotifications, setIsRefreshingNotifications] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [isTestNotificationModalOpen, setIsTestNotificationModalOpen] = useState(false);
  const [testNotificationForm, setTestNotificationForm] = useState({
    channel: 'Email',
    recipient: 'sarah.mitchell@herologistics.com.au',
    message: 'Test notification from Hero Logistics platform.'
  });

  const handleRefreshNotifications = () => {
    setIsRefreshingNotifications(true);
    triggerToast('Refreshing notification channels & statistics...');
    setTimeout(() => {
      setIsRefreshingNotifications(false);
      triggerToast('Notification channels updated!');
    }, 1000);
  };

  const handleSaveNotifications = () => {
    setIsSavingNotifications(true);
    triggerToast('Saving notification preferences...');
    setTimeout(() => {
      setIsSavingNotifications(false);
      triggerToast('Notification & Communication settings saved successfully!');
    }, 1000);
  };

  const handleSendTestNotificationSubmit = (e) => {
    e.preventDefault();
    triggerToast(`Test notification sent via ${testNotificationForm.channel} to ${testNotificationForm.recipient}!`);
    setIsTestNotificationModalOpen(false);
  };

  // Security & Audit Logs State (13.8)
  const [isRefreshingSecurityLogs, setIsRefreshingSecurityLogs] = useState(false);
  const [isSecuritySettingsModalOpen, setIsSecuritySettingsModalOpen] = useState(false);
  const [securitySettingsForm, setSecuritySettingsForm] = useState({
    retentionDays: '365 Days',
    twoFactorAuth: true,
    ipWhitelisting: false,
    sessionTimeout: '30 Minutes',
    auditAlerts: true
  });

  const handleRefreshSecurityLogs = () => {
    setIsRefreshingSecurityLogs(true);
    triggerToast('Refreshing security audit logs...');
    setTimeout(() => {
      setIsRefreshingSecurityLogs(false);
      triggerToast('Security audit logs updated!');
    }, 1000);
  };

  const handleExportSecurityLogs = () => {
    const headers = "Timestamp,User,Email,EventType,Action,Module,Details,IPAddress,Outcome\n";
    const rows = [
      '30 May 2025 09:15 AM,"Sarah Mitchell","sarah.mitchell@herologistics.com.au","Login","User Logged In","Authentication","Login via Web","203.26.45.12","Success"',
      '30 May 2025 09:12 AM,"John Davis","john.davis@herologistics.com.au","Data Update","Updated Load LD-3981","Loads","Changed status to Dispatched","203.26.45.18","Success"',
      '30 May 2025 09:10 AM,"Ravi Wilson","ravi.wilson@herologistics.com.au","Permission Change","Updated role permissions","Users & Roles","Role: Dispatcher Permissions modified","203.26.45.21","Success"',
      '30 May 2025 09:05 AM,"Amit Handa","amit.handa@herologistics.com.au","Data Export","Exported Invoice Report","Reports","Report: Invoices Format: PDF","203.26.45.12","Success"',
      '30 May 2025 08:58 AM,"Lisa Patel","lisa.patel@herologistics.com.au","Security Event","Failed Login Attempt","Authentication","Invalid password","203.26.45.99","Failed"',
      '30 May 2025 08:50 AM,"Brian Taylor","brian.taylor@herologistics.com.au","Trailer Swap","Trailer swapped","Vehicles","Trailer TR-1045 swapped from Truck TRK-12","203.26.45.18","Success"',
      '30 May 2025 08:45 AM,"Michael Kumar","michael.kumar@herologistics.com.au","Data Delete","Deleted Expense Record","Expenses","Expense ID: EXP-7781","203.26.45.21","Success"',
      '30 May 2025 08:30 AM,"Shane Cooper","shane.cooper@herologistics.com.au","Blocked Action","Blocked Unauthorized Export","Reports","Attempted to export restricted data","203.26.45.77","Blocked"'
    ].join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security_audit_logs_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    triggerToast('Security audit logs exported to CSV successfully!');
  };

  const handleSaveSecuritySettingsSubmit = (e) => {
    e.preventDefault();
    triggerToast('Security settings updated successfully!');
    setIsSecuritySettingsModalOpen(false);
  };

  // Subscription & Billing State (13.9)
  const [isRefreshingBilling, setIsRefreshingBilling] = useState(false);
  const [isManageSubscriptionModalOpen, setIsManageSubscriptionModalOpen] = useState(false);
  const [manageSubscriptionForm, setManageSubscriptionForm] = useState({
    plan: 'Hero Pro ($499/mo)',
    billingCycle: 'Monthly',
    userSeats: 50,
    aiAddon: true,
    reportingAddon: true,
    smsAddon: true
  });

  const handleRefreshBilling = () => {
    setIsRefreshingBilling(true);
    triggerToast('Refreshing subscription plan & usage data...');
    setTimeout(() => {
      setIsRefreshingBilling(false);
      triggerToast('Subscription & billing data updated!');
    }, 1000);
  };

  const handleDownloadStatement = () => {
    const headers = "BillingCycle,InvoiceNumber,Date,Description,Subtotal,GST,TotalAUD,Status,PaymentMethod\n";
    const rows = [
      'May 2025,"INV-2025-0529","29 May 2025","Monthly Subscription - May 2025","$777.00","$77.70","$854.70","Paid","Visa •••• 4242"',
      'Apr 2025,"INV-2025-0429","29 Apr 2025","Monthly Subscription - April 2025","$777.00","$77.70","$854.70","Paid","Visa •••• 4242"',
      'Mar 2025,"INV-2025-0329","29 Mar 2025","Monthly Subscription - March 2025","$777.00","$77.70","$854.70","Paid","Visa •••• 4242"',
      'Feb 2025,"INV-2025-0228","28 Feb 2025","Monthly Subscription - February 2025","$777.00","$77.70","$854.70","Paid","Visa •••• 4242"',
      'Jan 2025,"INV-2025-0129","29 Jan 2025","Monthly Subscription - January 2025","$777.00","$77.70","$854.70","Paid","Visa •••• 4242"'
    ].join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `billing_statement_may_2025_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    triggerToast('Billing statement downloaded successfully!');
  };

  const handleDownloadSingleInvoice = (invNumber) => {
    const content = `Invoice Number: ${invNumber}\nCompany: Hero Logistics Pty Ltd\nPlan: Hero Pro ($499.00)\nAI Add-on: $199.00\nReporting Add-on: $99.00\nSMS Credits: $29.00\nDiscount: -$49.00\nSubtotal: $777.00\nGST (10%): $77.70\nTotal Amount Paid: $854.70 AUD\nPayment Method: Visa ending in 4242\nStatus: PAID`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invNumber}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    triggerToast(`Invoice ${invNumber} downloaded successfully!`);
  };

  const handleSaveManageSubscriptionSubmit = (e) => {
    e.preventDefault();
    triggerToast('Subscription plan updated successfully!');
    setIsManageSubscriptionModalOpen(false);
  };

  // Company Settings 13.2 Handlers
  const [isRefreshingCompanySettings, setIsRefreshingCompanySettings] = useState(false);
  const [isSavingCompanySettings, setIsSavingCompanySettings] = useState(false);

  const handleRefreshCompanySettings = () => {
    setIsRefreshingCompanySettings(true);
    triggerToast('Refreshing company settings details...');
    setTimeout(() => {
      setIsRefreshingCompanySettings(false);
      triggerToast('Company settings refreshed successfully!');
    }, 1000);
  };

  const handleExportCompanySettings = () => {
    const exportObject = {
      companyDetails: typeof companyDetails !== 'undefined' ? companyDetails : {},
      taxCompliance: typeof taxCompliance !== 'undefined' ? taxCompliance : {},
      financialYear: typeof financialYear !== 'undefined' ? financialYear : {},
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `company_settings_backup_${Date.now()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    triggerToast('Company settings exported to JSON successfully!');
  };

  const handleSaveCompanySettings = () => {
    setIsSavingCompanySettings(true);
    triggerToast('Saving company configuration changes...');
    setTimeout(() => {
      setIsSavingCompanySettings(false);
      triggerToast('Company settings saved successfully!');
    }, 800);
  };

  const getCategoryBadgeColor = (cat) => {
    switch (cat) {
      case 'Invoice Automation': return 'bg-teal-100 text-teal-800';
      case 'Payment Reminders': return 'bg-blue-100 text-blue-800';
      case 'Compliance Reminders': return 'bg-amber-100 text-amber-800';
      case 'Load Status Actions': return 'bg-purple-100 text-purple-800';
      case 'Customer Notifications': return 'bg-amber-100 text-amber-800';
      case 'Approval Workflows': return 'bg-[#EEF2FF] text-[#4F46E5]';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const renderRuleIcon = (rule, isLarge = false) => {
    const size = isLarge ? 22 : 12;
    const boxSize = isLarge ? 'w-11 h-11 rounded-xl shadow-xs' : 'w-6 h-6 rounded-md shadow-3xs';
    
    switch (rule?.name) {
      case 'Auto Invoice on Delivery':
        return (
          <div className={`${boxSize} bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0`}>
            <FileText size={size} />
          </div>
        );
      case 'Payment Reminder - Overdue':
        return (
          <div className={`${boxSize} bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0`}>
            <Mail size={size} />
          </div>
        );
      case 'License Expiry Reminder':
        return (
          <div className={`${boxSize} bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0`}>
            <AlertTriangle size={size} />
          </div>
        );
      case 'Load Arrived - Notify Customer':
        return (
          <div className={`${boxSize} bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0`}>
            <Send size={size} />
          </div>
        );
      case 'POD Received - Notify Customer':
        return (
          <div className={`${boxSize} bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0`}>
            <Bell size={size} />
          </div>
        );
      case 'Expense Approval Workflow':
        return (
          <div className={`${boxSize} bg-[#EEF2FF] border border-indigo-200 text-[#4F46E5] flex items-center justify-center shrink-0`}>
            <Users size={size} />
          </div>
        );
      case 'Maintenance Due Alert':
        return (
          <div className={`${boxSize} bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0`}>
            <Sliders size={size} />
          </div>
        );
      case 'Payment Received - Thank You':
        return (
          <div className={`${boxSize} bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0`}>
            <CheckCircle2 size={size} />
          </div>
        );
      default:
        return (
          <div className={`${boxSize} bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0`}>
            <Sliders size={size} />
          </div>
        );
    }
  };

  const handleCreateWorkflowRuleSubmit = (e) => {
    e.preventDefault();
    if (!newWorkflowRuleForm.name) {
      triggerToast('Please enter a rule name!');
      return;
    }

    const newRule = {
      id: Date.now(),
      name: newWorkflowRuleForm.name,
      desc: newWorkflowRuleForm.desc || 'Automated workflow rule',
      category: newWorkflowRuleForm.category,
      categoryColor: getCategoryBadgeColor(newWorkflowRuleForm.category),
      trigger: newWorkflowRuleForm.trigger,
      action: newWorkflowRuleForm.action,
      status: newWorkflowRuleForm.status,
      lastExecuted: 'Just Now',
      executions: 0,
      createdBy: 'Sarah Mitchell',
      createdOn: 'Today',
      lastModified: 'Just Now'
    };

    setWorkflowRulesList([newRule, ...workflowRulesList]);
    setSelectedWorkflowRule(newRule);
    setIsCreateWorkflowRuleModalOpen(false);
    setNewWorkflowRuleForm({ name: '', desc: '', category: 'Invoice Automation', trigger: 'Load Status: Delivered', action: 'Create Invoice & Notify Accounts', status: 'Active' });
    triggerToast(`Workflow Rule "${newRule.name}" created successfully!`);
  };

  const handleOpenEditWorkflowRuleModal = (ruleObj) => {
    setEditWorkflowRuleForm({
      id: ruleObj.id,
      name: ruleObj.name,
      desc: ruleObj.desc,
      category: ruleObj.category,
      trigger: ruleObj.trigger,
      action: ruleObj.action,
      status: ruleObj.status
    });
    setIsEditWorkflowRuleModalOpen(true);
    setActiveRuleRowMenuId(null);
  };

  const handleEditWorkflowRuleSubmit = (e) => {
    e.preventDefault();
    const updated = workflowRulesList.map(r => {
      if (r.id === editWorkflowRuleForm.id) {
        const item = {
          ...r,
          name: editWorkflowRuleForm.name,
          desc: editWorkflowRuleForm.desc,
          category: editWorkflowRuleForm.category,
          categoryColor: getCategoryBadgeColor(editWorkflowRuleForm.category),
          trigger: editWorkflowRuleForm.trigger,
          action: editWorkflowRuleForm.action,
          status: editWorkflowRuleForm.status,
          lastModified: 'Just Now'
        };
        if (selectedWorkflowRule.id === r.id) setSelectedWorkflowRule(item);
        return item;
      }
      return r;
    });

    setWorkflowRulesList(updated);
    setIsEditWorkflowRuleModalOpen(false);
    triggerToast('Workflow rule updated successfully!');
  };

  const handleDeleteWorkflowRule = (ruleObj) => {
    if (workflowRulesList.length <= 1) {
      triggerToast('Cannot delete the only remaining workflow rule!');
      return;
    }
    const updated = workflowRulesList.filter(r => r.id !== ruleObj.id);
    setWorkflowRulesList(updated);
    if (selectedWorkflowRule.id === ruleObj.id) setSelectedWorkflowRule(updated[0]);
    setActiveRuleRowMenuId(null);
    triggerToast(`Rule "${ruleObj.name}" deleted.`);
  };

  const handleToggleWorkflowRuleStatus = (ruleObj) => {
    const newStatus = ruleObj.status === 'Active' ? 'Inactive' : 'Active';
    const updated = workflowRulesList.map(r => {
      if (r.id === ruleObj.id) {
        const item = { ...r, status: newStatus };
        if (selectedWorkflowRule.id === r.id) setSelectedWorkflowRule(item);
        return item;
      }
      return r;
    });
    setWorkflowRulesList(updated);
    setActiveRuleRowMenuId(null);
    triggerToast(`Rule "${ruleObj.name}" status set to ${newStatus}.`);
  };

  const handleExportWorkflowRulesCSV = () => {
    const headers = "ID,Name,Category,Trigger,Action,Status,Executions,LastExecuted\n";
    const rows = workflowRulesList.map(r => `${r.id},"${r.name}","${r.category}","${r.trigger}","${r.action}","${r.status}",${r.executions},"${r.lastExecuted}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow_rules_export_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    triggerToast('Workflow rules exported to CSV successfully!');
  };

  const filteredWorkflowRules = workflowRulesList.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(workflowSearchQuery.toLowerCase()) || 
                          r.desc.toLowerCase().includes(workflowSearchQuery.toLowerCase()) ||
                          r.trigger.toLowerCase().includes(workflowSearchQuery.toLowerCase());
    const matchesCategory = workflowCategoryFilter === 'All Categories' || r.category === workflowCategoryFilter;
    const matchesStatus = workflowStatusFilter === 'All Status' || r.status === workflowStatusFilter;
    const matchesTrigger = workflowTriggerFilter === 'All Triggers' || r.trigger === workflowTriggerFilter;
    const matchesTab = workflowTab === 'Overview' || r.category.toLowerCase().includes(workflowTab.toLowerCase().split(' ')[0]);
    return matchesSearch && matchesCategory && matchesStatus && matchesTrigger && matchesTab;
  });

  const getRoleBadgeColor = (roleName) => {
    switch (roleName) {
      case 'Super Admin': return 'bg-purple-100 text-purple-700';
      case 'Admin': return 'bg-blue-100 text-blue-700';
      case 'Dispatch Manager': return 'bg-amber-100 text-amber-800';
      case 'Dispatcher': return 'bg-teal-100 text-teal-800';
      case 'Accounts': return 'bg-purple-100 text-purple-800';
      case 'Warehouse Manager': return 'bg-orange-100 text-orange-800';
      case 'Driver': return 'bg-emerald-100 text-emerald-800';
      case 'Customer User': return 'bg-pink-100 text-pink-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) {
      triggerToast('Please fill in required fields (Name & Email)');
      return;
    }

    const initials = newUserForm.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US';
    const newEntry = {
      id: Date.now(),
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      roleColor: getRoleBadgeColor(newUserForm.role),
      branch: newUserForm.branch,
      status: newUserForm.status,
      lastLogin: 'Never',
      joined: 'Just Now',
      phone: newUserForm.phone || '+61 400 000 000',
      avatar: initials,
      avatarBg: 'bg-[#2563EB]'
    };

    setUsersList([newEntry, ...usersList]);
    setSelectedUser(newEntry);
    setIsAddModalOpen(false);
    setNewUserForm({ name: '', email: '', role: 'Admin', branch: 'Sydney', status: 'Active', phone: '' });
    triggerToast(`User "${newEntry.name}" created successfully!`);
  };

  const handleOpenEditModal = (userObj) => {
    setEditUserForm({
      id: userObj.id,
      name: userObj.name,
      email: userObj.email,
      role: userObj.role,
      branch: userObj.branch,
      status: userObj.status,
      phone: userObj.phone
    });
    setIsEditModalOpen(true);
    setActiveRowMenuId(null);
  };

  const handleEditUserSubmit = (e) => {
    e.preventDefault();
    const updatedList = usersList.map(u => {
      if (u.id === editUserForm.id) {
        const initials = editUserForm.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || u.avatar;
        const updated = {
          ...u,
          name: editUserForm.name,
          email: editUserForm.email,
          role: editUserForm.role,
          roleColor: getRoleBadgeColor(editUserForm.role),
          branch: editUserForm.branch,
          status: editUserForm.status,
          phone: editUserForm.phone,
          avatar: initials
        };
        if (selectedUser.id === u.id) {
          setSelectedUser(updated);
        }
        return updated;
      }
      return u;
    });

    setUsersList(updatedList);
    setIsEditModalOpen(false);
    triggerToast('User details updated successfully!');
  };

  const handleDeleteUser = (userObj) => {
    if (usersList.length <= 1) {
      triggerToast('Cannot delete the only remaining user!');
      return;
    }
    const updated = usersList.filter(u => u.id !== userObj.id);
    setUsersList(updated);
    if (selectedUser.id === userObj.id) {
      setSelectedUser(updated[0]);
    }
    setActiveRowMenuId(null);
    triggerToast(`User "${userObj.name}" deleted.`);
  };

  const handleToggleUserStatus = (userObj) => {
    const newStatus = userObj.status === 'Active' ? 'Inactive' : 'Active';
    const updated = usersList.map(u => {
      if (u.id === userObj.id) {
        const item = { ...u, status: newStatus };
        if (selectedUser.id === u.id) setSelectedUser(item);
        return item;
      }
      return u;
    });
    setUsersList(updated);
    setActiveRowMenuId(null);
    triggerToast(`User "${userObj.name}" status updated to ${newStatus}.`);
  };

  const handleExportCSV = () => {
    const headers = "ID,Name,Email,Role,Branch,Status,Joined,LastLogin\n";
    const rows = usersList.map(u => `${u.id},"${u.name}","${u.email}","${u.role}","${u.branch}","${u.status}","${u.joined}","${u.lastLogin}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_report_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    triggerToast('User list exported to CSV successfully!');
  };

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'All Roles' || u.role === selectedRole;
    const matchesStatus = selectedStatus === 'All Status' || u.status === selectedStatus;
    const matchesBranch = selectedBranch === 'All Branches' || u.branch.includes(selectedBranch);
    return matchesSearch && matchesRole && matchesStatus && matchesBranch;
  });

  return (
    <div className="p-3 sm:p-5 max-w-[1750px] mx-auto bg-[#F8FAFC] min-h-screen text-left font-sans flex flex-col space-y-4">
      
      {/* Hidden File Input for Logo Upload */}
      <input 
        type="file" 
        ref={logoInputRef} 
        onChange={handleLogoUpload} 
        accept="image/png, image/jpeg, image/jpg, image/svg+xml" 
        className="hidden" 
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMsg}
        </div>
      )}

      {/* TOP BREADCRUMB & HEADER CONTROLS */}
      <div className="flex flex-row flex-nowrap items-center justify-between gap-2 w-full overflow-x-auto whitespace-nowrap scrollbar-none pb-1 sm:pb-0">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB] shrink-0">
          <span onClick={() => setCurrentView('dashboard')} className="hover:underline cursor-pointer">Home</span>
          <span className="text-[#2563EB] font-semibold">›</span>
          <span onClick={() => setCurrentView('dashboard')} className="hover:underline cursor-pointer">Settings</span>
          <span className="text-[#2563EB] font-semibold">›</span>
          <span className="text-[#2563EB] font-bold">
            {currentView === 'company-settings' ? 'Company Settings' : currentView === 'users-permissions' ? 'Users, Roles & Permissions' : currentView === 'workflow-rules' ? 'Workflow & Automation Rules' : currentView === 'ai-configuration' ? 'AI Configuration' : currentView === 'integrations' ? 'Integrations' : currentView === 'notifications' ? 'Notifications & Communication Settings' : currentView === 'security-audit-logs' ? 'Security & Audit Logs' : currentView === 'subscription-billing' ? 'Subscription & Billing' : 'Dashboard'}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0 flex-nowrap">
          <button 
            onClick={() => triggerToast('Opening Help & Support documentation...')} 
            className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline transition-colors cursor-pointer whitespace-nowrap"
          >
            <HelpCircle size={15} className="text-[#2563EB]" />
            <span>Need help?</span>
          </button>

          {/* Notification Bell with Red Badge 10 */}
          <div className="relative cursor-pointer shrink-0" onClick={() => triggerToast('10 new notifications')}>
            <Bell size={18} className="text-slate-700 hover:text-blue-600 transition-colors" />
            <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white leading-none shadow-2xs">
              10
            </span>
          </div>
          
          {/* Avatar Circle SM */}
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shadow-xs cursor-pointer shrink-0" title="Sarah Mitchell (Super Admin)">
            SM
          </div>

          {/* More Actions Dropdown Button & Menu */}
          <div className="relative shrink-0">
            <button 
              onClick={() => setIsMoreActionsDropdownOpen(!isMoreActionsDropdownOpen)} 
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200/90 px-3 py-1 rounded-xl shadow-2xs hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>More Actions</span>
              <ChevronDown size={13} className={`text-slate-500 transition-transform ${isMoreActionsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMoreActionsDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-[9999]" 
                  onClick={() => setIsMoreActionsDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-2xl z-[99999] py-1.5 animate-fade-in text-left">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">SYSTEM ACTIONS</span>
                  </div>

                  <button 
                    onClick={() => {
                      setIsMoreActionsDropdownOpen(false);
                      triggerToast('Exporting system settings backup...');
                    }} 
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download size={14} className="text-slate-400" />
                    <span>Export Settings Backup</span>
                  </button>

                  <button 
                    onClick={() => {
                      setIsMoreActionsDropdownOpen(false);
                      triggerToast('Opening config import wizard...');
                    }} 
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Upload size={14} className="text-slate-400" />
                    <span>Import Configuration</span>
                  </button>

                  <button 
                    onClick={() => {
                      setIsMoreActionsDropdownOpen(false);
                      setCurrentView('security-audit-logs');
                    }} 
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Shield size={14} className="text-slate-400" />
                    <span>Security & Audit Logs</span>
                  </button>

                  <button 
                    onClick={() => {
                      setIsMoreActionsDropdownOpen(false);
                      setCurrentView('integrations');
                    }} 
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Plug size={14} className="text-slate-400" />
                    <span>View Integration Logs</span>
                  </button>

                  <div className="my-1 border-t border-slate-100"></div>

                  <button 
                    onClick={() => {
                      setIsMoreActionsDropdownOpen(false);
                      triggerToast('Resetting module display preferences...');
                    }} 
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <RefreshCw size={14} className="text-rose-500" />
                    <span>Reset Preferences</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
         VIEW 1: 13.1 SETTINGS DASHBOARD (Screenshot 1)
         ========================================================================= */}
      {currentView === 'dashboard' && (
        <div className="space-y-4">

          {/* TITLE & HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none">
                  13.1 Settings Dashboard
                </h1>
                <div className="w-5 h-5 rounded-md border border-purple-200 bg-purple-50 text-purple-600 flex items-center justify-center cursor-pointer hover:bg-purple-100 transition-colors">
                  <Bookmark size={11} />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                Manage system configuration, users, integrations and platform settings.
              </p>
            </div>

            <button 
              onClick={() => setCurrentView('company-settings')} 
              className="flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Building size={14} /> Open Company Settings
            </button>
          </div>

          {/* 1. TOP METRIC CARDS (ROW OF 6 CARDS) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            
            {/* Card 1: Company Setup */}
            <div className="bg-white rounded-xl border border-slate-200/80 px-3 py-2 shadow-2xs flex flex-col justify-between hover:border-purple-200 transition-all min-h-[92px]">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                  <Building size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">COMPANY SETUP</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-base font-black text-slate-900">92%</span>
                    <span className="text-[9.5px] font-bold text-emerald-600">Complete</span>
                  </div>
                </div>
              </div>
              <div className="mt-1">
                <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                  <div className="bg-[#2563EB] h-1 rounded-full w-[92%] transition-all"></div>
                </div>
                <p className="text-[8px] font-semibold text-slate-400 mt-1 leading-none">Last updated: 30 May 2025</p>
              </div>
            </div>

            {/* Card 2: Active Users */}
            <div className="bg-white rounded-xl border border-slate-200/80 px-3 py-2 shadow-2xs flex flex-col justify-between hover:border-emerald-200 transition-all min-h-[92px]">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                  <Users size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">ACTIVE USERS</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-base font-black text-slate-900">48</span>
                    <span className="text-[9.5px] font-bold text-slate-600">Users</span>
                  </div>
                  <p className="text-[8.5px] font-extrabold text-emerald-600 leading-none mt-0.5">↑ 12.5% <span className="font-semibold text-slate-400">vs Last Month</span></p>
                </div>
              </div>
              <div className="pt-1 border-t border-slate-50 flex justify-end">
                <button onClick={() => setCurrentView('users-permissions')} className="text-[8.5px] font-bold text-[#2563EB] hover:underline flex items-center gap-0.5 cursor-pointer leading-none">
                  View users →
                </button>
              </div>
            </div>

            {/* Card 3: Branches Configured */}
            <div className="bg-white rounded-xl border border-slate-200/80 px-3 py-2 shadow-2xs flex flex-col justify-between hover:border-amber-200 transition-all min-h-[92px]">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                  <Award size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">BRANCHES CONFIGURED</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-base font-black text-slate-900">6</span>
                    <span className="text-[9.5px] font-bold text-slate-600">Branches</span>
                  </div>
                </div>
              </div>
              <div className="pt-1 border-t border-slate-50 flex justify-end">
                <button onClick={() => triggerToast('Navigating to Branches...')} className="text-[8.5px] font-bold text-[#2563EB] hover:underline flex items-center gap-0.5 cursor-pointer leading-none">
                  View branches →
                </button>
              </div>
            </div>

            {/* Card 4: Active Integrations */}
            <div className="bg-white rounded-xl border border-slate-200/80 px-3 py-2 shadow-2xs flex flex-col justify-between hover:border-blue-200 transition-all min-h-[92px]">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                  <Plug size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">ACTIVE INTEGRATIONS</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-base font-black text-slate-900">7</span>
                    <span className="text-[9.5px] font-bold text-slate-600">Integrations</span>
                  </div>
                </div>
              </div>
              <div className="pt-1 border-t border-slate-50 flex justify-end">
                <button onClick={() => setCurrentView('integrations')} className="text-[8.5px] font-bold text-[#2563EB] hover:underline flex items-center gap-0.5 cursor-pointer leading-none">
                  View integrations →
                </button>
              </div>
            </div>

            {/* Card 5: AI Subscription */}
            <div className="bg-white rounded-xl border border-slate-200/80 px-3 py-2 shadow-2xs flex flex-col justify-between hover:border-purple-200 transition-all min-h-[92px]">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                  <Cpu size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">AI SUBSCRIPTION</span>
                  <p className="text-base font-black text-emerald-600 mt-0.5 leading-tight">Active</p>
                  <p className="text-[8px] font-bold text-slate-400 leading-none">Pro Plan</p>
                </div>
              </div>
              <div className="pt-1 border-t border-slate-50 flex justify-end">
                <button onClick={() => setCurrentView('ai-configuration')} className="text-[8.5px] font-bold text-[#2563EB] hover:underline flex items-center gap-0.5 cursor-pointer leading-none">
                  View details →
                </button>
              </div>
            </div>

            {/* Card 6: System Health */}
            <div className="bg-white rounded-xl border border-slate-200/80 px-3 py-2 shadow-2xs flex flex-col justify-between hover:border-emerald-200 transition-all min-h-[92px]">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                  <ShieldCheck size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">SYSTEM HEALTH</span>
                  <p className="text-base font-black text-emerald-600 mt-0.5 leading-tight">Healthy</p>
                  <p className="text-[8px] font-semibold text-slate-400 leading-none">All systems operational</p>
                </div>
              </div>
              <div className="pt-1 border-t border-slate-50 flex justify-end">
                <button onClick={() => triggerToast('Viewing system health report...')} className="text-[8.5px] font-bold text-[#2563EB] hover:underline flex items-center gap-0.5 cursor-pointer leading-none">
                  View health report →
                </button>
              </div>
            </div>

          </div>

          {/* 2. MIDDLE SECTION (3 COLUMNS: SETUP CHECKLIST, RECENT ALERTS, QUICK SHORTCUTS) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* COLUMN 1: SETUP CHECKLIST */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">SETUP CHECKLIST</h3>
                  <button onClick={() => triggerToast('Viewing full checklist...')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                    View All →
                  </button>
                </div>

                <div className="space-y-2">
                  {[
                    { label: 'Company Profile', desc: 'Company information and branding', status: 'Complete', isDone: true, icon: <Building size={13} />, color: 'bg-[#EEF2FF] text-[#4F46E5]' },
                    { label: 'Users & Roles', desc: 'Add users and set permissions', status: 'Complete', isDone: true, icon: <Users size={13} />, color: 'bg-[#EEF2FF] text-[#4F46E5]' },
                    { label: 'Branches', desc: 'Configure branches and locations', status: 'Complete', isDone: true, icon: <MapPin size={13} />, color: 'bg-[#FFEDD5] text-[#EA580C]' },
                    { label: 'Integrations', desc: 'Connect third party applications', status: 'Complete', isDone: true, icon: <Plug size={13} />, color: 'bg-[#DBEAFE] text-[#2563EB]' },
                    { label: 'Financial Settings', desc: 'Taxes, currencies and payment terms', status: 'Complete', isDone: true, icon: <DollarSign size={13} />, color: 'bg-[#DCFCE7] text-[#16A34A]' },
                    { label: 'AI Configuration', desc: 'AI features and automation settings', status: 'In Progress', isDone: false, icon: <Cpu size={13} />, color: 'bg-[#FFEDD5] text-[#EA580C]' },
                    { label: 'Communication Settings', desc: 'Email, SMS and notifications', status: 'Complete', isDone: true, icon: <Mail size={13} />, color: 'bg-[#EEF2FF] text-[#4F46E5]' },
                    { label: 'Workflow Rules', desc: 'Automation and approval workflows', status: 'In Progress', isDone: false, icon: <Sliders size={13} />, color: 'bg-[#FFEDD5] text-[#EA580C]' },
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        if (item.label === 'Company Profile') setCurrentView('company-settings');
                        else if (item.label === 'Users & Roles') setCurrentView('users-permissions');
                        else if (item.label === 'Workflow Rules') setCurrentView('workflow-rules');
                        else if (item.label === 'AI Configuration') setCurrentView('ai-configuration');
                        else if (item.label === 'Integrations') setCurrentView('integrations');
                        else triggerToast(`Configuring ${item.label}...`);
                      }}
                      className="flex items-center justify-between py-1 px-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${item.color}`}>
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="text-[11px] font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors leading-tight">{item.label}</h4>
                          <p className="text-[9px] text-slate-400 font-medium leading-tight mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[8.5px] font-extrabold shrink-0 ${item.isDone ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FFEDD5] text-[#9A3412]'}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 mt-2.5">
                <button onClick={() => setCurrentView('company-settings')} className="text-[10px] font-extrabold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer">
                  Continue Setup →
                </button>
              </div>
            </div>

            {/* COLUMN 2: RECENT SYSTEM ALERTS */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">RECENT SYSTEM ALERTS</h3>
                  <button onClick={() => triggerToast('Viewing all alerts...')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                    View All →
                  </button>
                </div>

                <div className="space-y-2">
                  {[
                    { title: 'Incomplete Company Profile', desc: 'Add company logo and complete business details.', date: '30 May 2025', time: '09:30 AM', color: 'text-amber-600 bg-[#FFEDD5]', icon: <AlertTriangle size={13} /> },
                    { title: 'New User Registration', desc: 'John Davis has been added to the system.', date: '30 May 2025', time: '08:45 AM', color: 'text-purple-600 bg-[#F3E8FF]', icon: <UserPlus size={13} /> },
                    { title: 'Integration Sync Successful', desc: 'Xero integration synced successfully.', date: '30 May 2025', time: '07:20 AM', color: 'text-emerald-600 bg-[#DCFCE7]', icon: <CheckCircle2 size={13} /> },
                    { title: 'AI Load Creation Disabled', desc: 'AI Load Creation is not configured.', date: '29 May 2025', time: '04:15 PM', color: 'text-amber-600 bg-[#FFEDD5]', icon: <Clock size={13} /> },
                    { title: 'Invoice Reminder Automation', desc: 'Invoice reminder workflow is active.', date: '29 May 2025', time: '02:10 PM', color: 'text-blue-600 bg-[#DBEAFE]', icon: <Bell size={13} /> },
                    { title: 'Compliance Document Expiring', desc: '23 documents are expiring within 30 days.', date: '29 May 2025', time: '11:05 AM', color: 'text-rose-600 bg-rose-50', icon: <AlertTriangle size={13} /> },
                  ].map((alert, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-2 py-1 px-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${alert.color}`}>
                          {alert.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[11px] font-bold text-slate-900 leading-tight">{alert.title}</h4>
                          <p className="text-[9px] text-slate-500 font-medium leading-tight mt-0.5">{alert.desc}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 pl-1">
                        <span className="text-[8.5px] font-bold text-slate-600 block leading-tight">{alert.date}</span>
                        <span className="text-[8px] font-semibold text-slate-400 block leading-tight mt-0.5">{alert.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 mt-2.5">
                <button onClick={() => triggerToast('Opening alerts log...')} className="text-[10px] font-extrabold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer">
                  View all alerts →
                </button>
              </div>
            </div>

            {/* COLUMN 3: QUICK SHORTCUTS */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">QUICK SHORTCUTS</h3>
                  <button onClick={() => triggerToast('Viewing all settings...')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                    View all settings →
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Company Settings', desc: 'Manage company details', color: 'text-blue-600 bg-[#DBEAFE]', icon: <Building size={15} />, action: () => setCurrentView('company-settings') },
                    { label: 'Users & Permissions', desc: 'Manage users and roles', color: 'text-emerald-600 bg-[#DCFCE7]', icon: <Users size={15} />, action: () => setCurrentView('users-permissions') },
                    { label: 'Workflow Rules', desc: 'Create automation rules', color: 'text-amber-600 bg-[#FFEDD5]', icon: <Sliders size={15} />, action: () => setCurrentView('workflow-rules') },
                    { label: 'Integrations', desc: 'Manage integrations', color: 'text-blue-600 bg-[#DBEAFE]', icon: <Plug size={15} />, action: () => setCurrentView('integrations') },
                    { label: 'AI Configuration', desc: 'Configure AI features', color: 'text-purple-600 bg-[#F3E8FF]', icon: <Cpu size={15} />, action: () => setCurrentView('ai-configuration') },
                    { label: 'Notifications', desc: 'Configure notifications', color: 'text-blue-600 bg-[#DBEAFE]', icon: <Bell size={15} />, action: () => setCurrentView('notifications') },
                    { label: 'Security & Audit Logs', desc: 'View system activity', color: 'text-emerald-600 bg-[#DCFCE7]', icon: <Shield size={15} />, action: () => setCurrentView('security-audit-logs') },
                    { label: 'Subscription & Billing', desc: 'Manage subscription', color: 'text-purple-600 bg-[#F3E8FF]', icon: <CreditCard size={15} />, action: () => setCurrentView('subscription-billing') },
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={item.action}
                      className="p-2 bg-white hover:bg-blue-50/40 border border-slate-200/70 hover:border-blue-200 rounded-xl transition-all cursor-pointer flex items-start gap-2 group shadow-2xs min-h-[58px]"
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${item.color}`}>
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[10.5px] font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors leading-tight">{item.label}</h4>
                        <p className="text-[8.5px] text-slate-400 font-medium leading-tight mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 mt-2.5">
                <button onClick={() => triggerToast('Navigating to full settings map...')} className="text-[10px] font-extrabold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer">
                  View all settings →
                </button>
              </div>
            </div>

          </div>

          {/* 3. LOWER SECTION (3 COLUMNS) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* COLUMN 1: INTEGRATION STATUS */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">INTEGRATION STATUS</h3>
                  <button onClick={() => triggerToast('Viewing all integrations...')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                    View All →
                  </button>
                </div>

                <div className="space-y-2">
                  {[
                    { name: 'Xero', type: 'Accounting', status: 'Connected', sync: '30 May 09:10 AM', isGood: true, icon: <FileText size={12} className="text-blue-600" /> },
                    { name: 'Email Service', type: 'SMTP', status: 'Connected', sync: '30 May 09:05 AM', isGood: true, icon: <Mail size={12} className="text-emerald-600" /> },
                    { name: 'SMS Gateway', type: 'Text Messages', status: 'Connected', sync: '30 May 09:02 AM', isGood: true, icon: <MessageSquare size={12} className="text-emerald-600" /> },
                    { name: 'GPS Tracking', type: 'Telematics', status: 'Connected', sync: '30 May 08:58 AM', isGood: true, icon: <MapPin size={12} className="text-purple-600" /> },
                    { name: 'Payment Gateway', type: 'Stripe', status: 'Warning', sync: '29 May 11:20 PM', isGood: false, icon: <CreditCard size={12} className="text-amber-600" /> },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 px-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="text-[10.5px] font-bold text-slate-900">{item.name}</h4>
                            <span className="text-[8px] font-semibold text-slate-400">({item.type})</span>
                          </div>
                          <p className="text-[8.5px] text-slate-400 font-medium">Last sync: {item.sync}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${item.isGood ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FFEDD5] text-[#9A3412]'}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 mt-2.5">
                <button onClick={() => setCurrentView('integrations')} className="text-[10px] font-extrabold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer">
                  Manage integrations →
                </button>
              </div>
            </div>

            {/* COLUMN 2: USER ACTIVITY (THIS WEEK) */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">USER ACTIVITY (THIS WEEK)</h3>
                  <button onClick={() => triggerToast('Viewing activity report...')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                    View Report →
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50/70 p-1.5 rounded-lg border border-slate-100">
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Logins</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">256</p>
                    <p className="text-[8px] font-bold text-emerald-600">↑ 18.2%</p>
                  </div>
                  <div className="bg-slate-50/70 p-1.5 rounded-lg border border-slate-100">
                    <p className="text-[8px] font-bold text-slate-400 uppercase">New Users</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">4</p>
                    <p className="text-[8px] font-bold text-emerald-600">↑ 100%</p>
                  </div>
                  <div className="bg-slate-50/70 p-1.5 rounded-lg border border-slate-100">
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Role Changes</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">6</p>
                    <p className="text-[8px] font-bold text-emerald-600">↑ 20%</p>
                  </div>
                  <div className="bg-slate-50/70 p-1.5 rounded-lg border border-slate-100">
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Permission Changes</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">12</p>
                    <p className="text-[8px] font-bold text-emerald-600">↑ 33.3%</p>
                  </div>
                </div>

                {/* SVG Trendline Graphic */}
                <div className="mt-2 pt-1">
                  <svg className="w-full h-7 text-[#2563EB]" viewBox="0 0 300 40" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M0 35 Q 40 10, 80 25 T 160 15 T 240 30 T 300 5" fill="none" />
                  </svg>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 mt-2.5">
                <button onClick={() => triggerToast('Opening full activity log...')} className="text-[10px] font-extrabold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer">
                  View full activity report →
                </button>
              </div>
            </div>

            {/* COLUMN 3: SYSTEM OVERVIEW */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">SYSTEM OVERVIEW</h3>
                  <button onClick={() => triggerToast('Checking system health...')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                    View system health →
                  </button>
                </div>

                <div className="space-y-1.5 text-[10px] font-semibold">
                  <div className="flex justify-between items-center pb-1 border-b border-slate-50">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Database size={13} className="text-slate-400" />
                      <span>Database Status</span>
                    </div>
                    <span className="text-emerald-600 font-bold">Operational</span>
                  </div>
                  <div className="flex justify-between items-center pb-1 border-b border-slate-50">
                    <div className="flex items-center gap-2 text-slate-600">
                      <HardDrive size={13} className="text-slate-400" />
                      <span>Backup Status</span>
                    </div>
                    <span className="text-emerald-600 font-bold">Up to date</span>
                  </div>
                  <div className="flex justify-between items-center pb-1 border-b border-slate-50">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Activity size={13} className="text-slate-400" />
                      <span>Storage Usage</span>
                    </div>
                    <span className="text-slate-900 font-bold">42% Used</span>
                  </div>
                  <div className="flex justify-between items-center pb-1 border-b border-slate-50">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Server size={13} className="text-slate-400" />
                      <span>API Status</span>
                    </div>
                    <span className="text-emerald-600 font-bold">Operational</span>
                  </div>
                  <div className="flex justify-between items-center pb-1 border-b border-slate-50">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Shield size={13} className="text-slate-400" />
                      <span>System Version</span>
                    </div>
                    <span className="text-slate-900 font-bold">v2.4.1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock size={13} className="text-slate-400" />
                      <span>Last Updated</span>
                    </div>
                    <span className="text-slate-500 font-bold text-[9px]">30 May 2025 09:30 AM</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-3">
                <button onClick={() => triggerToast('Refreshing system diagnostics...')} className="text-xs font-extrabold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer">
                  View system health →
                </button>
              </div>
            </div>

          </div>

          {/* 4. DEVELOPER NOTES - SETTINGS DASHBOARD FOOTER BANNER */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 shadow-2xs text-left">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-5 rounded bg-[#2563EB] text-white font-mono text-[10px] font-bold flex items-center justify-center">
                &lt;/&gt;
              </div>
              <h3 className="text-xs font-black text-blue-950 uppercase tracking-wider">DEVELOPER NOTES – SETTINGS DASHBOARD</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">1. PURPOSE</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Central overview of system configuration and platform health.</li>
                  <li>• Quick access to key settings and actions.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">2. KEY FEATURES</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Setup checklist with completion status.</li>
                  <li>• System alerts and important notifications.</li>
                  <li>• Quick shortcuts to all settings modules.</li>
                  <li>• Integration and user activity overview.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">3. AUTOMATION & ALERTS</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Real-time alerts for issues and warnings.</li>
                  <li>• Incomplete setup notifications.</li>
                  <li>• Integration sync status updates.</li>
                  <li>• AI subscription status and usage.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">4. PERMISSIONS</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Admin: Full access to all settings.</li>
                  <li>• Managers: Limited access to relevant settings.</li>
                  <li>• Branch: View branch specific settings only.</li>
                  <li>• Users: No access to settings.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">5. DATA SOURCES</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• System configuration data.</li>
                  <li>• User and role management.</li>
                  <li>• Integration health and sync status.</li>
                  <li>• System logs and notifications.</li>
                </ul>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-blue-200/60 flex items-center justify-between text-[8.5px] text-slate-500 font-semibold">
              <div className="flex items-center gap-1.5">
                <RefreshCw size={10} className="text-[#2563EB] animate-spin-slow" />
                <span>All times shown in your local time (AEST) • Data auto-refreshes every 5 minutes</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
         VIEW 2: 13.2 COMPANY SETTINGS PAGE (Screenshot 2 Match)
         ========================================================================= */}
      {currentView === 'company-settings' && (
        <div className="space-y-4">

          {/* PAGE TITLE & ACTION BUTTONS HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  13.2 Company Settings
                </h1>
                <div className="w-5 h-5 rounded-md border border-purple-200 bg-purple-50 text-purple-600 flex items-center justify-center cursor-pointer">
                  <Bookmark size={11} />
                </div>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Manage company profile, branding, financial and operational defaults.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
              <button 
                onClick={handleRefreshCompanySettings} 
                disabled={isRefreshingCompanySettings}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFFFF] border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <RefreshCw size={13} className={`text-slate-500 ${isRefreshingCompanySettings ? 'animate-spin' : ''}`} /> 
                {isRefreshingCompanySettings ? 'Refreshing...' : 'Refresh'}
              </button>

              <button 
                onClick={handleExportCompanySettings} 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              >
                <Download size={13} className="text-slate-500" /> Export Settings
              </button>

              <button 
                onClick={handleSaveCompanySettings} 
                disabled={isSavingCompanySettings}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSavingCompanySettings ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />} 
                {isSavingCompanySettings ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* SUB-TAB NAVIGATION (7 TABS) */}
          <div className="flex items-center gap-6 border-b border-slate-200/80 overflow-x-auto pt-1">
            {[
              'Company Details', 'Branding', 'Financial & Tax', 
              'Operational Defaults', 'Payment Terms', 'Document Numbering', 'Other Preferences'
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  activeTab === tab 
                    ? 'border-[#2563EB] text-[#2563EB]' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB 1: COMPANY DETAILS */}
          {activeTab === 'Company Details' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* COLUMN 1: COMPANY DETAILS & TAX COMPLIANCE */}
              <div className="lg:col-span-6 space-y-4">
                
                {/* COMPANY DETAILS CARD */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    COMPANY DETAILS
                  </h3>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Company Name *</label>
                      <input 
                        type="text" 
                        value={companyDetails.companyName}
                        onChange={e => setCompanyDetails({...companyDetails, companyName: e.target.value})}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Trading Name</label>
                      <input 
                        type="text" 
                        value={companyDetails.tradingName}
                        onChange={e => setCompanyDetails({...companyDetails, tradingName: e.target.value})}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">ABN *</label>
                      <input 
                        type="text" 
                        value={companyDetails.abn}
                        onChange={e => setCompanyDetails({...companyDetails, abn: e.target.value})}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">ACN</label>
                      <input 
                        type="text" 
                        value={companyDetails.acn}
                        onChange={e => setCompanyDetails({...companyDetails, acn: e.target.value})}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Registered Address *</label>
                    <input 
                      type="text" 
                      value={companyDetails.registeredAddress}
                      onChange={e => setCompanyDetails({...companyDetails, registeredAddress: e.target.value})}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* City, State, Postcode, Country */}
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-3">
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">City *</label>
                      <input 
                        type="text" 
                        value={companyDetails.city}
                        onChange={e => setCompanyDetails({...companyDetails, city: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">State *</label>
                      <select 
                        value={companyDetails.state}
                        onChange={e => setCompanyDetails({...companyDetails, state: e.target.value})}
                        className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer"
                      >
                        <option value="NSW">NSW</option>
                        <option value="VIC">VIC</option>
                        <option value="QLD">QLD</option>
                        <option value="WA">WA</option>
                        <option value="SA">SA</option>
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Postcode *</label>
                      <input 
                        type="text" 
                        value={companyDetails.postcode}
                        onChange={e => setCompanyDetails({...companyDetails, postcode: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Country *</label>
                      <select 
                        value={companyDetails.country}
                        onChange={e => setCompanyDetails({...companyDetails, country: e.target.value})}
                        className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer"
                      >
                        <option value="Australia">Australia</option>
                        <option value="New Zealand">New Zealand</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3.5">
                    <div className="col-span-5">
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Primary Phone</label>
                      <input 
                        type="text" 
                        value={companyDetails.phone}
                        onChange={e => setCompanyDetails({...companyDetails, phone: e.target.value})}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div className="col-span-7">
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Email *</label>
                      <input 
                        type="email" 
                        value={companyDetails.email}
                        onChange={e => setCompanyDetails({...companyDetails, email: e.target.value})}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3.5">
                    <div className="col-span-7">
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Website</label>
                      <input 
                        type="text" 
                        value={companyDetails.website}
                        onChange={e => setCompanyDetails({...companyDetails, website: e.target.value})}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div className="col-span-5">
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Company Start Date</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value="01 Jan 2023"
                          readOnly
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer"
                        />
                        <Calendar size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Company Description</label>
                    <textarea 
                      rows={2}
                      value={companyDetails.description}
                      onChange={e => setCompanyDetails({...companyDetails, description: e.target.value})}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                    />
                  </div>

                </div>

                {/* TAX & COMPLIANCE CARD */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-3.5">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    TAX & COMPLIANCE
                  </h3>

                  <div className="grid grid-cols-3 gap-3.5 items-center">
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">GST Registered</label>
                      <button
                        type="button"
                        onClick={() => setTaxCompliance({...taxCompliance, gstRegistered: !taxCompliance.gstRegistered})}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <div className={`w-8 h-4 rounded-full transition-colors relative ${taxCompliance.gstRegistered ? 'bg-blue-600' : 'bg-slate-200'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full transition-transform absolute top-0.5 left-0.5 ${taxCompliance.gstRegistered ? 'translate-x-4' : ''}`} />
                        </div>
                        <span className="text-xs font-bold text-slate-900">{taxCompliance.gstRegistered ? 'Yes' : 'No'}</span>
                      </button>
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">GST Registration Date</label>
                      <div className="relative">
                        <input type="text" value="01 Jan 2023" readOnly className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                        <Calendar size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">TFN</label>
                      <input type="text" value={taxCompliance.tfn} onChange={e => setTaxCompliance({...taxCompliance, tfn: e.target.value})} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3.5 items-center pt-2 border-t border-slate-100">
                    <div>
                      <label className="text-[9.5px] font-bold text-slate-700 block mb-1">Pay As You Go (PAYG) Withholding</label>
                      <input type="text" value={taxCompliance.payg} onChange={e => setTaxCompliance({...taxCompliance, payg: e.target.value})} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="text-[9.5px] font-bold text-slate-700 block mb-1">Workers Compensation Insurer</label>
                      <button
                        type="button"
                        onClick={() => setTaxCompliance({...taxCompliance, workersComp: !taxCompliance.workersComp})}
                        className="flex items-center gap-2 cursor-pointer mt-1"
                      >
                        <div className={`w-8 h-4 rounded-full transition-colors relative ${taxCompliance.workersComp ? 'bg-blue-600' : 'bg-slate-200'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full transition-transform absolute top-0.5 left-0.5 ${taxCompliance.workersComp ? 'translate-x-4' : ''}`} />
                        </div>
                        <span className="text-xs font-bold text-slate-900">{taxCompliance.workersComp ? 'Yes' : 'No'}</span>
                      </button>
                    </div>
                    <div>
                      <label className="text-[9.5px] font-bold text-slate-700 block mb-1">Workers Compensation Policy No.</label>
                      <input type="text" value={taxCompliance.workersPolicy} onChange={e => setTaxCompliance({...taxCompliance, workersPolicy: e.target.value})} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Public Liability Insurer</label>
                      <input type="text" value={taxCompliance.publicLiability} onChange={e => setTaxCompliance({...taxCompliance, publicLiability: e.target.value})} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Public Liability Policy No.</label>
                      <input type="text" value={taxCompliance.publicPolicy} onChange={e => setTaxCompliance({...taxCompliance, publicPolicy: e.target.value})} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                  </div>

                </div>

              </div>

              {/* COLUMN 2: PRIMARY CONTACT, BUSINESS HOURS, DEFAULT BRANCH */}
              <div className="lg:col-span-3 space-y-4">
                
                {/* PRIMARY CONTACT CARD */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    PRIMARY CONTACT
                  </h3>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Contact Name *</label>
                    <input 
                      type="text" 
                      value={contactDetails.name}
                      onChange={e => setContactDetails({...contactDetails, name: e.target.value})}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Position</label>
                    <input 
                      type="text" 
                      value={contactDetails.position}
                      onChange={e => setContactDetails({...contactDetails, position: e.target.value})}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Phone *</label>
                    <input 
                      type="text" 
                      value={contactDetails.phone}
                      onChange={e => setContactDetails({...contactDetails, phone: e.target.value})}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Email *</label>
                    <input 
                      type="email" 
                      value={contactDetails.email}
                      onChange={e => setContactDetails({...contactDetails, email: e.target.value})}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                {/* BUSINESS HOURS CARD */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      BUSINESS HOURS
                    </h3>
                    <Info size={12} className="text-slate-400" />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Time Zone *</label>
                    <select 
                      value={businessHours.timeZone}
                      onChange={e => setBusinessHours({...businessHours, timeZone: e.target.value})}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer"
                    >
                      <option value="(AEST) Australia/Sydney">(AEST) Australia/Sydney</option>
                      <option value="(AWST) Australia/Perth">(AWST) Australia/Perth</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">Business Hours Start</label>
                      <select 
                        value={businessHours.start}
                        onChange={e => setBusinessHours({...businessHours, start: e.target.value})}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer"
                      >
                        <option value="07:00 AM">07:00 AM</option>
                        <option value="08:00 AM">08:00 AM</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">Business Hours End</label>
                      <select 
                        value={businessHours.end}
                        onChange={e => setBusinessHours({...businessHours, end: e.target.value})}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer"
                      >
                        <option value="05:00 PM">05:00 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Week Start Day</label>
                    <select 
                      value={businessHours.weekStart}
                      onChange={e => setBusinessHours({...businessHours, weekStart: e.target.value})}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>
                </div>

                {/* DEFAULT BRANCH CARD */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      DEFAULT BRANCH
                    </h3>
                    <Info size={12} className="text-slate-400" />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Default Branch *</label>
                    <select 
                      value={defaultBranch.name}
                      onChange={e => setDefaultBranch({...defaultBranch, name: e.target.value})}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer"
                    >
                      <option value="Sydney Head Office">Sydney Head Office</option>
                      <option value="Melbourne Depot">Melbourne Depot</option>
                    </select>
                  </div>

                  {/* Gray Branch Details Summary Card */}
                  <div className="text-[11px] space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-600 font-medium">
                    <p className="leading-snug">
                      <span className="font-bold text-slate-800">Address:</span> {defaultBranch.address}
                    </p>
                    <p className="leading-snug">
                      <span className="font-bold text-slate-800">Phone:</span> {defaultBranch.phone}
                    </p>
                    <p className="leading-snug break-all">
                      <span className="font-bold text-slate-800">Email:</span> {defaultBranch.email}
                    </p>
                  </div>
                </div>

              </div>

              {/* COLUMN 3: BRANDING & FINANCIAL SETTINGS */}
              <div className="lg:col-span-3 space-y-4">
                
                {/* COMPANY BRANDING CARD */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    COMPANY BRANDING
                  </h3>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block">Company Logo</label>
                    <p className="text-[9px] text-slate-400 font-semibold mb-2">Recommended size: 400x200px (PNG, JPG)</p>
                    
                    <div className="grid grid-cols-12 gap-2 items-center">
                      {/* Logo Preview Box */}
                      <div className="col-span-7 h-16 border border-slate-200 rounded-xl bg-white flex items-center justify-center p-2 shadow-2xs overflow-hidden">
                        {logoUrl ? (
                          <img src={logoUrl} alt="Company Logo" className="max-h-full max-w-full object-contain" />
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <Zap size={20} className="text-[#FFD400] fill-[#FFD400]" />
                            <span className="text-xl font-black text-slate-900 tracking-tight">Hero</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="col-span-5 space-y-1.5">
                        <button 
                          type="button"
                          onClick={() => logoInputRef.current && logoInputRef.current.click()}
                          className="flex items-center justify-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer w-full shadow-2xs transition-colors whitespace-nowrap"
                        >
                          <Upload size={10} /> Change Logo
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setLogoUrl(null);
                            triggerToast('Company logo removed');
                          }}
                          className="flex items-center justify-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-rose-600 hover:bg-rose-50 cursor-pointer w-full shadow-2xs transition-colors whitespace-nowrap"
                        >
                          <Trash2 size={10} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* BRAND COLOURS */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 items-end">
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1 whitespace-nowrap leading-tight h-4 flex items-end">
                        Primary Brand Colour
                      </label>
                      <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg p-1.5 bg-white relative">
                        <input 
                          type="color" 
                          value={branding.primary.length === 7 ? branding.primary : '#1E3ABA'} 
                          onChange={e => setBranding({...branding, primary: e.target.value.toUpperCase()})}
                          className="w-4 h-4 rounded border-0 cursor-pointer p-0 shrink-0" 
                        />
                        <input 
                          type="text" 
                          value={branding.primary} 
                          onChange={e => setBranding({...branding, primary: e.target.value})}
                          className="w-full text-[11px] font-bold text-slate-800 uppercase focus:outline-none min-w-0" 
                        />
                        <ChevronDown size={11} className="text-slate-400 pointer-events-none shrink-0" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1 whitespace-nowrap leading-tight h-4 flex items-end">
                        Secondary Colour
                      </label>
                      <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg p-1.5 bg-white relative">
                        <input 
                          type="color" 
                          value={branding.secondary.length === 7 ? branding.secondary : '#6356F1'} 
                          onChange={e => setBranding({...branding, secondary: e.target.value.toUpperCase()})}
                          className="w-4 h-4 rounded border-0 cursor-pointer p-0 shrink-0" 
                        />
                        <input 
                          type="text" 
                          value={branding.secondary} 
                          onChange={e => setBranding({...branding, secondary: e.target.value})}
                          className="w-full text-[11px] font-bold text-slate-800 uppercase focus:outline-none min-w-0" 
                        />
                        <ChevronDown size={11} className="text-slate-400 pointer-events-none shrink-0" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Accent Colour</label>
                    <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg p-1.5 bg-white w-1/2 relative">
                      <input 
                        type="color" 
                        value={branding.accent.length === 7 ? branding.accent : '#F59E0B'} 
                        onChange={e => setBranding({...branding, accent: e.target.value.toUpperCase()})}
                        className="w-4 h-4 rounded border-0 cursor-pointer p-0 shrink-0" 
                      />
                      <input 
                        type="text" 
                        value={branding.accent} 
                        onChange={e => setBranding({...branding, accent: e.target.value})}
                        className="w-full text-[11px] font-bold text-slate-800 uppercase focus:outline-none min-w-0" 
                      />
                      <ChevronDown size={11} className="text-slate-400 pointer-events-none shrink-0" />
                    </div>
                  </div>

                </div>

                {/* FINANCIAL SETTINGS CARD */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    FINANCIAL SETTINGS
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">Default Currency *</label>
                      <select value={financials.currency} onChange={e => setFinancials({...financials, currency: e.target.value})} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer">
                        <option value="AUD - Australian Dollar ($)">AUD - Australian Dollar ($)</option>
                        <option value="USD - US Dollar ($)">USD - US Dollar ($)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">Default Tax Rate (GST) *</label>
                      <select value={financials.taxRate} onChange={e => setFinancials({...financials, taxRate: e.target.value})} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer">
                        <option value="10%">10%</option>
                        <option value="15%">15%</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">Tax Calculation Method</label>
                      <select value={financials.method} onChange={e => setFinancials({...financials, method: e.target.value})} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer">
                        <option value="Exclusive">Exclusive</option>
                        <option value="Inclusive">Inclusive</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">Rounding</label>
                      <select value={financials.rounding} onChange={e => setFinancials({...financials, rounding: e.target.value})} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer">
                        <option value="2 Decimal Places">2 Decimal Places</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">Default Payment Terms</label>
                      <select value={financials.paymentTerms} onChange={e => setFinancials({...financials, paymentTerms: e.target.value})} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer">
                        <option value="30 Days">30 Days</option>
                        <option value="14 Days">14 Days</option>
                        <option value="7 Days">7 Days</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">Price List</label>
                      <select value={financials.priceList} onChange={e => setFinancials({...financials, priceList: e.target.value})} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer">
                        <option value="Standard Price List">Standard Price List</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block">Prices Include Tax</label>
                      <p className="text-[9px] text-slate-400 font-semibold">Enable if all prices include GST by default.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFinancials({...financials, pricesIncludeTax: !financials.pricesIncludeTax})}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                        financials.pricesIncludeTax ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 left-0.5 ${financials.pricesIncludeTax ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: BRANDING */}
          {activeTab === 'Branding' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-6 text-left">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#2563EB]" /> BRANDING & THEMING CONFIGURATION
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Configure company logos, brand color schemes, and email/document header templates.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase">Brand Color Palette</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Primary Theme Color</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={branding.primary.length === 7 ? branding.primary : '#1E3ABA'} onChange={e => setBranding({...branding, primary: e.target.value.toUpperCase()})} className="w-10 h-10 rounded-lg border-0 cursor-pointer shadow-3xs" />
                        <input type="text" value={branding.primary} onChange={e => setBranding({...branding, primary: e.target.value})} className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 w-36 uppercase" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Secondary Theme Color</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={branding.secondary.length === 7 ? branding.secondary : '#6356F1'} onChange={e => setBranding({...branding, secondary: e.target.value.toUpperCase()})} className="w-10 h-10 rounded-lg border-0 cursor-pointer shadow-3xs" />
                        <input type="text" value={branding.secondary} onChange={e => setBranding({...branding, secondary: e.target.value})} className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 w-36 uppercase" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Accent Highlight Color</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={branding.accent.length === 7 ? branding.accent : '#F59E0B'} onChange={e => setBranding({...branding, accent: e.target.value.toUpperCase()})} className="w-10 h-10 rounded-lg border-0 cursor-pointer shadow-3xs" />
                        <input type="text" value={branding.accent} onChange={e => setBranding({...branding, accent: e.target.value})} className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 w-36 uppercase" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase">Live Preview Box</h4>
                  <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                    <div className="p-4 rounded-xl text-white font-bold text-xs flex justify-between items-center shadow-xs" style={{ backgroundColor: branding.primary }}>
                      <span>Primary Header Banner</span>
                      <span className="px-2 py-0.5 rounded text-[10px]" style={{ backgroundColor: branding.accent, color: '#000' }}>Active Tag</span>
                    </div>
                    <button className="w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-xs" style={{ backgroundColor: branding.secondary }}>
                      Secondary Action Button
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FINANCIAL & TAX */}
          {activeTab === 'Financial & Tax' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-6 text-left">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#2563EB]" /> FINANCIAL & TAXATION DEFAULTS
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Manage global tax calculation methods, GST rules, default currency and price lists.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Default Currency *</label>
                  <select value={financials.currency} onChange={e => setFinancials({...financials, currency: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer">
                    <option value="AUD - Australian Dollar ($)">AUD - Australian Dollar ($)</option>
                    <option value="USD - US Dollar ($)">USD - US Dollar ($)</option>
                    <option value="NZD - NZ Dollar ($)">NZD - NZ Dollar ($)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Default Tax Rate (GST) *</label>
                  <select value={financials.taxRate} onChange={e => setFinancials({...financials, taxRate: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer">
                    <option value="10%">10% Standard GST</option>
                    <option value="15%">15% NZ GST</option>
                    <option value="0%">0% GST Free</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Tax Calculation Method</label>
                  <select value={financials.method} onChange={e => setFinancials({...financials, method: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer">
                    <option value="Exclusive">Tax Exclusive (Prices + GST)</option>
                    <option value="Inclusive">Tax Inclusive (GST included in price)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OPERATIONAL DEFAULTS */}
          {activeTab === 'Operational Defaults' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-6 text-left">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#2563EB]" /> OPERATIONAL & DISPATCH RULES
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Configure default fleet assignment rules, mandatory fatigue breaks, and speed limits.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Auto-Assign Drivers to Nearest Job</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Use GPS geolocation to auto-suggest nearest available driver.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOperationalDefaults({...operationalDefaults, autoAssignDrivers: !operationalDefaults.autoAssignDrivers})}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${operationalDefaults.autoAssignDrivers ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <span className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 left-0.5 ${operationalDefaults.autoAssignDrivers ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Max Driving Shift Hours</label>
                    <input 
                      type="text" 
                      value={operationalDefaults.maxDrivingHours}
                      onChange={e => setOperationalDefaults({...operationalDefaults, maxDrivingHours: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Mandatory Fatigue Break Policy</label>
                    <input 
                      type="text" 
                      value={operationalDefaults.breakMandatory}
                      onChange={e => setOperationalDefaults({...operationalDefaults, breakMandatory: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Telematics Speed Limit Alert</label>
                    <input 
                      type="text" 
                      value={operationalDefaults.speedLimitAlert}
                      onChange={e => setOperationalDefaults({...operationalDefaults, speedLimitAlert: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PAYMENT TERMS */}
          {activeTab === 'Payment Terms' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-6 text-left">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#2563EB]" /> PAYMENT TERMS & BANK DETAILS
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Configure default credit terms, late payment interest, and bank account remittance info.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Default Invoice Credit Period</label>
                    <select value={paymentTermsState.defaultCreditPeriod} onChange={e => setPaymentTermsState({...paymentTermsState, defaultCreditPeriod: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer">
                      <option value="7 Days">7 Days Net</option>
                      <option value="14 Days">14 Days Net</option>
                      <option value="30 Days">30 Days Net</option>
                      <option value="60 Days">60 Days Net</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Remittance Email Address</label>
                    <input 
                      type="email" 
                      value={paymentTermsState.remittanceEmail}
                      onChange={e => setPaymentTermsState({...paymentTermsState, remittanceEmail: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">BSB Number</label>
                      <input 
                        type="text" 
                        value={paymentTermsState.bsb}
                        onChange={e => setPaymentTermsState({...paymentTermsState, bsb: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Account Number</label>
                      <input 
                        type="text" 
                        value={paymentTermsState.accountNumber}
                        onChange={e => setPaymentTermsState({...paymentTermsState, accountNumber: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Bank Name</label>
                    <input 
                      type="text" 
                      value={paymentTermsState.bankName}
                      onChange={e => setPaymentTermsState({...paymentTermsState, bankName: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DOCUMENT NUMBERING */}
          {activeTab === 'Document Numbering' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-6 text-left">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Hash className="w-4 h-4 text-[#2563EB]" /> DOCUMENT SEQUENCING & NUMBERING
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Set auto-incrementing document prefixes and next serial numbers for Invoices, PODs, Quotes, and Consignments.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" /> Invoice Numbering
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Prefix</label>
                      <input type="text" value={docNumbering.invPrefix} onChange={e => setDocNumbering({...docNumbering, invPrefix: e.target.value})} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Next Number</label>
                      <input type="text" value={docNumbering.invNext} onChange={e => setDocNumbering({...docNumbering, invNext: e.target.value})} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" /> Proof of Delivery (POD) Numbering
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Prefix</label>
                      <input type="text" value={docNumbering.podPrefix} onChange={e => setDocNumbering({...docNumbering, podPrefix: e.target.value})} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Next Number</label>
                      <input type="text" value={docNumbering.podNext} onChange={e => setDocNumbering({...docNumbering, podNext: e.target.value})} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-purple-600" /> Quotation Numbering
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Prefix</label>
                      <input type="text" value={docNumbering.qtePrefix} onChange={e => setDocNumbering({...docNumbering, qtePrefix: e.target.value})} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Next Number</label>
                      <input type="text" value={docNumbering.qteNext} onChange={e => setDocNumbering({...docNumbering, qteNext: e.target.value})} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-600" /> Consignment Note Numbering
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Prefix</label>
                      <input type="text" value={docNumbering.conPrefix} onChange={e => setDocNumbering({...docNumbering, conPrefix: e.target.value})} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Next Number</label>
                      <input type="text" value={docNumbering.conNext} onChange={e => setDocNumbering({...docNumbering, conNext: e.target.value})} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: OTHER PREFERENCES */}
          {activeTab === 'Other Preferences' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-6 text-left">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#2563EB]" /> GLOBAL SYSTEM PREFERENCES
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Configure date/time formats, system units of measurement, and data backup retention rules.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Date Format</label>
                  <select value={otherPreferences.dateFormat} onChange={e => setOtherPreferences({...otherPreferences, dateFormat: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer">
                    <option value="DD/MM/YYYY">DD/MM/YYYY (Australian Standard)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (US Format)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Format)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Measurement Units</label>
                  <select value={otherPreferences.units} onChange={e => setOtherPreferences({...otherPreferences, units: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer">
                    <option value="Metric (km, kg, L)">Metric (km, kg, L)</option>
                    <option value="Imperial (mi, lbs, gal)">Imperial (mi, lbs, gal)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Audit Log Retention</label>
                  <select value={otherPreferences.auditLogRetention} onChange={e => setOtherPreferences({...otherPreferences, auditLogRetention: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer">
                    <option value="365 Days">365 Days (1 Year)</option>
                    <option value="730 Days">730 Days (2 Years)</option>
                    <option value="Permanent">Permanent Archival</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* DEVELOPER NOTES BANNER - 13.2 COMPANY SETTINGS */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 shadow-2xs text-left mt-6">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-5 rounded bg-[#2563EB] text-white font-mono text-[10px] font-bold flex items-center justify-center">
                &lt;/&gt;
              </div>
              <h3 className="text-xs font-black text-blue-950 uppercase tracking-wider">DEVELOPER NOTES – COMPANY SETTINGS</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">1. PURPOSE</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Central hub for company configuration.</li>
                  <li>• Controls branding, financial, and operational defaults.</li>
                  <li>• Applies to all modules and transactions.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">2. KEY FEATURES</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Company profile and contact details.</li>
                  <li>• Branding (logo and colours).</li>
                  <li>• Financial, tax and payment settings.</li>
                  <li>• Operational preferences and defaults.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">3. VALIDATION & RULES</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• ABN must be valid (11 digits).</li>
                  <li>• Email must be unique.</li>
                  <li>• GST rate based on country.</li>
                  <li>• Changes affect system-wide settings.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">4. PERMISSIONS</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Admin: Full access to all settings.</li>
                  <li>• Managers: View most settings.</li>
                  <li>• Branch: View branch-related settings only.</li>
                  <li>• Users: No access.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">5. DATA SOURCES</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• User input.</li>
                  <li>• System defaults.</li>
                  <li>• Integration settings.</li>
                  <li>• Subscription plan limitations.</li>
                </ul>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-blue-200/60 flex items-center justify-between text-[8.5px] text-slate-500 font-semibold">
              <div className="flex items-center gap-1.5">
                <RefreshCw size={10} className="text-[#2563EB] animate-spin-slow" />
                <span>All times shown in your local time (AEST) • Data auto-refreshes every 5 minutes</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
         VIEW 3: 13.3 USERS, ROLES & PERMISSIONS PAGE (Screenshot 2 Exact Match inside 1 file!)
         ========================================================================= */}
      {currentView === 'users-permissions' && (
        <div className="space-y-4">
          
          {/* PAGE TITLE & ACTION BUTTONS HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  13.3 Users, Roles & Permissions
                </h1>
                <div className="w-5 h-5 rounded-md border border-purple-200 bg-purple-50 text-purple-600 flex items-center justify-center cursor-pointer">
                  <Bookmark size={11} />
                </div>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Manage users, roles, permissions and access control across the platform.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
              <button 
                onClick={() => triggerToast('User list & security metrics refreshed!')} 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              >
                <RefreshCw size={13} className="text-slate-500" /> Refresh
              </button>
              <button 
                onClick={handleExportCSV} 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              >
                <Download size={13} className="text-slate-500" /> Export Report
              </button>
              <button 
                onClick={() => setIsAddModalOpen(true)} 
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Plus size={14} /> Add User
              </button>
            </div>
          </div>

          {/* SUB-TAB NAVIGATION (6 TABS) */}
          <div className="flex items-center gap-6 border-b border-slate-200/80 overflow-x-auto pt-1">
            {['Users', 'Roles', 'Permissions', 'Branch Access', 'Login & Security', 'Activity Log'].map((tab) => (
              <button
                key={tab}
                onClick={() => setUsersTab(tab)}
                className={`py-2 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  usersTab === tab 
                    ? 'border-[#2563EB] text-[#2563EB]' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB 1: USERS */}
          {usersTab === 'Users' && (
            <>
              {/* 1. TOP METRIC CARDS (ROW OF 6 CARDS) */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                
                {/* Card 1: Total Users */}
                <div className="bg-white rounded-xl border border-slate-200/80 px-3.5 py-2.5 shadow-2xs flex flex-col justify-between hover:border-blue-200 transition-all min-h-[92px]">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                      <Users size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">TOTAL USERS</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-base font-black text-slate-900">48</span>
                      </div>
                      <p className="text-[8.5px] font-extrabold text-emerald-600 leading-none mt-0.5">↑ 12.5% <span className="font-semibold text-slate-400">vs Last Month</span></p>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-slate-50 flex justify-end">
                    <button onClick={() => triggerToast('Showing all users...')} className="text-[8.5px] font-bold text-[#2563EB] hover:underline flex items-center gap-0.5 cursor-pointer leading-none">
                      View all users →
                    </button>
                  </div>
                </div>

                {/* Card 2: Active Users */}
                <div className="bg-white rounded-xl border border-slate-200/80 px-3.5 py-2.5 shadow-2xs flex flex-col justify-between hover:border-emerald-200 transition-all min-h-[92px]">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                      <UserCheck size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">ACTIVE USERS</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-base font-black text-slate-900">44</span>
                      </div>
                      <p className="text-[8.5px] font-extrabold text-emerald-600 leading-none mt-0.5">↑ 10.0% <span className="font-semibold text-slate-400">vs Last Month</span></p>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-slate-50 flex justify-end">
                    <button onClick={() => setSelectedStatus('Active')} className="text-[8.5px] font-bold text-[#2563EB] hover:underline flex items-center gap-0.5 cursor-pointer leading-none">
                      View active users →
                    </button>
                  </div>
                </div>

                {/* Card 3: Inactive Users */}
                <div className="bg-white rounded-xl border border-slate-200/80 px-3.5 py-2.5 shadow-2xs flex flex-col justify-between hover:border-rose-200 transition-all min-h-[92px]">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                      <UserX size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">INACTIVE USERS</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-base font-black text-slate-900">4</span>
                      </div>
                      <p className="text-[8.5px] font-extrabold text-rose-600 leading-none mt-0.5">↓ 20.0% <span className="font-semibold text-slate-400">vs Last Month</span></p>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-slate-50 flex justify-end">
                    <button onClick={() => setSelectedStatus('Inactive')} className="text-[8.5px] font-bold text-[#2563EB] hover:underline flex items-center gap-0.5 cursor-pointer leading-none">
                      View inactive users →
                    </button>
                  </div>
                </div>

                {/* Card 4: Pending Invites */}
                <div className="bg-white rounded-xl border border-slate-200/80 px-3.5 py-2.5 shadow-2xs flex flex-col justify-between hover:border-purple-200 transition-all min-h-[92px]">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                      <Mail size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">PENDING INVITES</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-base font-black text-slate-900">6</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-slate-50 flex justify-end">
                    <button onClick={() => triggerToast('Showing pending user invitations...')} className="text-[8.5px] font-bold text-[#2563EB] hover:underline flex items-center gap-0.5 cursor-pointer leading-none">
                      View pending invites →
                    </button>
                  </div>
                </div>

                {/* Card 5: Roles */}
                <div className="bg-white rounded-xl border border-slate-200/80 px-3.5 py-2.5 shadow-2xs flex flex-col justify-between hover:border-blue-200 transition-all min-h-[92px]">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                      <Shield size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">ROLES</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-base font-black text-slate-900">9</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-slate-50 flex justify-end">
                    <button onClick={() => setUsersTab('Roles')} className="text-[8.5px] font-bold text-[#2563EB] hover:underline flex items-center gap-0.5 cursor-pointer leading-none">
                      View all roles →
                    </button>
                  </div>
                </div>

                {/* Card 6: Permission Sets */}
                <div className="bg-white rounded-xl border border-slate-200/80 px-3.5 py-2.5 shadow-2xs flex flex-col justify-between hover:border-purple-200 transition-all min-h-[92px]">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                      <Key size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">PERMISSION SETS</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-base font-black text-slate-900">27</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-slate-50 flex justify-end">
                    <button onClick={() => setUsersTab('Permissions')} className="text-[8.5px] font-bold text-[#2563EB] hover:underline flex items-center gap-0.5 cursor-pointer leading-none">
                      View all permissions →
                    </button>
                  </div>
                </div>

              </div>

              {/* 2. FILTERS & SEARCH BAR */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
                
                {/* Search Input Box */}
                <div className="relative flex-1 min-w-[240px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, role or branch..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                  />
                </div>

                {/* Dropdown Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
                  >
                    <option value="All Roles">All Roles</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Dispatch Manager">Dispatch Manager</option>
                    <option value="Dispatcher">Dispatcher</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Warehouse Manager">Warehouse Manager</option>
                    <option value="Driver">Driver</option>
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
                  >
                    <option value="All Status">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>

                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
                  >
                    <option value="All Branches">All Branches</option>
                    <option value="Sydney">Sydney</option>
                    <option value="Melbourne">Melbourne</option>
                  </select>

                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-50">
                    <Calendar size={13} className="text-slate-400" />
                    <span>Joined: All Time</span>
                    <ChevronDown size={12} className="text-slate-400" />
                  </button>

                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-50">
                    <Filter size={13} className="text-slate-500" />
                    <span>Filters</span>
                  </button>

                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedRole('All Roles');
                      setSelectedStatus('All Status');
                      setSelectedBranch('All Branches');
                      triggerToast('Filters reset successfully');
                    }} 
                    className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 cursor-pointer"
                    title="Reset Filters"
                  >
                    <RefreshCw size={13} />
                  </button>
                </div>

              </div>

              {/* 3. MAIN SPLIT GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* LEFT COLUMN: USERS LIST TABLE */}
                <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
                  
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">USERS LIST</h3>
                    <button onClick={() => triggerToast('Showing all 48 users...')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                      View all users →
                    </button>
                  </div>

                  {/* Table Container */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200/80 text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                          <th className="py-2.5 px-3 whitespace-nowrap">User</th>
                          <th className="py-2.5 px-2 whitespace-nowrap">Role</th>
                          <th className="py-2.5 px-2 whitespace-nowrap">Branch Access</th>
                          <th className="py-2.5 px-2 whitespace-nowrap">Status</th>
                          <th className="py-2.5 px-2 whitespace-nowrap">Last Login</th>
                          <th className="py-2.5 px-2 whitespace-nowrap">Joined Date</th>
                          <th className="py-2.5 px-2 text-right whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map((user) => (
                          <tr 
                            key={user.id} 
                            onClick={() => setSelectedUser(user)}
                            className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${selectedUser.id === user.id ? 'bg-blue-50/60' : ''}`}
                          >
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-7 h-7 rounded-full ${user.avatarBg} text-white font-black text-[11px] flex items-center justify-center shrink-0 shadow-2xs`}>
                                  {user.avatar}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-bold text-slate-900 leading-tight text-xs whitespace-nowrap">{user.name}</h4>
                                  <p className="text-[10px] text-slate-400 font-medium leading-tight whitespace-nowrap">{user.email}</p>
                                </div>
                              </div>
                            </td>

                            <td className="py-2.5 px-2 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold whitespace-nowrap inline-block ${user.roleColor}`}>
                                {user.role}
                              </span>
                            </td>

                            <td className="py-2.5 px-2 text-slate-700 font-semibold text-[11px] whitespace-nowrap">
                              {user.branch}
                            </td>

                            <td className="py-2.5 px-2 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${user.status === 'Active' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-rose-100 text-rose-700'}`}>
                                {user.status}
                              </span>
                            </td>

                            <td className="py-2.5 px-2 text-slate-600 font-medium text-[10.5px] whitespace-nowrap">
                              {user.lastLogin}
                            </td>

                            <td className="py-2.5 px-2 text-slate-500 font-medium text-[10.5px] whitespace-nowrap">
                              {user.joined}
                            </td>

                            <td className="py-2.5 px-2 text-right relative">
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setActiveRowMenuId(activeRowMenuId === user.id ? null : user.id); 
                                }} 
                                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                              >
                                <MoreHorizontal size={14} />
                              </button>

                              {activeRowMenuId === user.id && (
                                <div 
                                  onClick={(e) => e.stopPropagation()} 
                                  className="absolute right-2 top-8 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1 w-44 text-left font-semibold text-xs space-y-0.5 animate-fade-in"
                                >
                                  <button onClick={() => handleOpenEditModal(user)} className="w-full px-3 py-1.5 hover:bg-blue-50 text-slate-800 hover:text-blue-600 flex items-center gap-2 cursor-pointer">
                                    <Edit size={13} className="text-slate-400" /> Edit User Details
                                  </button>
                                  <button onClick={() => { setActiveRowMenuId(null); triggerToast(`Password reset link sent to ${user.email}`); }} className="w-full px-3 py-1.5 hover:bg-blue-50 text-slate-800 hover:text-blue-600 flex items-center gap-2 cursor-pointer">
                                    <Key size={13} className="text-slate-400" /> Reset Password
                                  </button>
                                  <button onClick={() => handleToggleUserStatus(user)} className="w-full px-3 py-1.5 hover:bg-blue-50 text-slate-800 hover:text-blue-600 flex items-center gap-2 cursor-pointer">
                                    {user.status === 'Active' ? <UserX size={13} className="text-rose-500" /> : <UserCheck size={13} className="text-emerald-500" />}
                                    <span>{user.status === 'Active' ? 'Deactivate User' : 'Activate User'}</span>
                                  </button>
                                  <div className="border-t border-slate-100 my-1"></div>
                                  <button onClick={() => handleDeleteUser(user)} className="w-full px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer">
                                    <Trash2 size={13} /> Delete User
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
                    <span>Showing 1 to {filteredUsers.length} of {usersList.length} users</span>
                    
                    <div className="flex items-center gap-1">
                      <button className="px-2 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400">|‹</button>
                      <button className="px-2 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400">‹</button>
                      <button className="px-2.5 py-1 bg-[#2563EB] text-white font-bold rounded-md">1</button>
                      <button className="px-2.5 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700">2</button>
                      <button className="px-2.5 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700">3</button>
                      <button className="px-2.5 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700">4</button>
                      <button className="px-2.5 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700">5</button>
                      <button className="px-2 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700">›</button>
                      <button className="px-2 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700">›|</button>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN: USER DETAILS & ROLE SUMMARY CARDS */}
                <div className="lg:col-span-4 space-y-4">
                  
                  {/* CARD 1: USER DETAILS */}
                  <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3.5 text-left">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">USER DETAILS</h3>
                      <button onClick={() => handleOpenEditModal(selectedUser)} className="flex items-center gap-1 text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                        <Edit size={11} /> Edit User
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full ${selectedUser.avatarBg || 'bg-purple-600'} text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs`}>
                        {selectedUser.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black text-slate-900 leading-tight">{selectedUser.name}</h3>
                          <span className="px-2 py-0.2 rounded-md text-[9px] font-extrabold bg-[#DCFCE7] text-[#166534]">
                            {selectedUser.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-blue-600 font-medium leading-tight mt-0.5">{selectedUser.email}</p>
                        <p className="text-[10px] text-purple-700 font-bold leading-tight mt-0.5">{selectedUser.role}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs pt-1 border-t border-slate-100">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-500">Phone:</span>
                        <span className="font-bold text-slate-900">{selectedUser.phone}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-500">Branch Access:</span>
                        <span className="font-bold text-slate-900">{selectedUser.branch}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-500">Joined Date:</span>
                        <span className="font-bold text-slate-900">{selectedUser.joined}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-500">Last Login:</span>
                        <span className="font-bold text-slate-900">{selectedUser.lastLogin}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-500">Status:</span>
                        <span className="font-bold text-emerald-600">{selectedUser.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: ROLE & PERMISSIONS SUMMARY */}
                  <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3 text-left">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                      ROLE & PERMISSIONS SUMMARY
                    </h3>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-500">Role:</span>
                        <span className="font-bold text-slate-900">{selectedUser.role}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-500">Permission Set:</span>
                        <span className="font-bold text-slate-900">Full Access</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
                      <span className="font-bold text-slate-700 block mb-1">Key Permissions:</span>
                      <ul className="space-y-1 font-semibold text-slate-700">
                        <li className="flex items-center gap-1.5 text-emerald-700">
                          <Check size={13} className="text-emerald-600 shrink-0" /> Full system access
                        </li>
                        <li className="flex items-center gap-1.5 text-emerald-700">
                          <Check size={13} className="text-emerald-600 shrink-0" /> Manage settings & configuration
                        </li>
                        <li className="flex items-center gap-1.5 text-emerald-700">
                          <Check size={13} className="text-emerald-600 shrink-0" /> Manage users, roles & permissions
                        </li>
                        <li className="flex items-center gap-1.5 text-emerald-700">
                          <Check size={13} className="text-emerald-600 shrink-0" /> Access all reports and data
                        </li>
                        <li className="flex items-center gap-1.5 text-emerald-700">
                          <Check size={13} className="text-emerald-600 shrink-0" /> Financial and invoicing access
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100">
                      <button onClick={() => triggerToast('Viewing full permission matrix...')} className="text-[10.5px] font-extrabold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer">
                        View full permission set →
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </>
          )}

          {/* TAB 2: ROLES */}
          {usersTab === 'Roles' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-5 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#2563EB]" /> PREDEFINED & CUSTOM SYSTEM ROLES
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Configure role capabilities, user counts, and default security profiles.</p>
                </div>
                <button onClick={() => setIsCreateRoleModalOpen(true)} className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer">
                  <Plus size={13} /> Create Role
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {rolesList.map((roleItem) => (
                  <div key={roleItem.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold ${roleItem.color}`}>
                        {roleItem.name}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">{roleItem.users} Users</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-snug">{roleItem.desc}</p>
                    <div className="pt-2 border-t border-slate-200/60 flex justify-end">
                      <button onClick={() => handleOpenEditRoleModal(roleItem)} className="text-[10.5px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                        Edit Role →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PERMISSIONS */}
          {usersTab === 'Permissions' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-5 text-left">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#2563EB]" /> GRANULAR MODULE PERMISSION MATRIX
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Configure action-level permissions (View, Create, Edit, Delete, Export) across all platform modules.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase bg-slate-50/60">
                      <th className="py-2.5 px-3">Module Name</th>
                      <th className="py-2.5 px-3 text-center">View</th>
                      <th className="py-2.5 px-3 text-center">Create</th>
                      <th className="py-2.5 px-3 text-center">Edit</th>
                      <th className="py-2.5 px-3 text-center">Delete</th>
                      <th className="py-2.5 px-3 text-center">Export</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold">
                    {['Loads & Bookings', 'Drivers & Telematics', 'Vehicles & Fleet', 'Warehouse & Inventory', 'Finance & Invoicing', 'Analytics & Reports', 'Company Settings'].map((mod, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-bold text-slate-900">{mod}</td>
                        <td className="py-3 px-3 text-center"><input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" /></td>
                        <td className="py-3 px-3 text-center"><input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" /></td>
                        <td className="py-3 px-3 text-center"><input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" /></td>
                        <td className="py-3 px-3 text-center"><input type="checkbox" defaultChecked={idx < 2} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" /></td>
                        <td className="py-3 px-3 text-center"><input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: BRANCH ACCESS */}
          {usersTab === 'Branch Access' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-5 text-left">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2563EB]" /> BRANCH-LEVEL ACCESS RESTRICTIONS
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Restrict user visibility to specific depot branches or enable multi-branch access.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { branch: 'Sydney Head Office', users: '24 Assigned Users', code: 'SYD-01', manager: 'Sarah Mitchell' },
                  { branch: 'Melbourne Depot', users: '14 Assigned Users', code: 'MEL-02', manager: 'Brian Taylor' },
                  { branch: 'Brisbane Hub', users: '6 Assigned Users', code: 'BNE-03', manager: 'John Davis' },
                  { branch: 'Perth Depot', users: '4 Assigned Users', code: 'PER-04', manager: 'Ravi Wilson' }
                ].map((b, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{b.branch} <span className="text-[10px] text-slate-400 font-mono">({b.code})</span></h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{b.users} • Manager: {b.manager}</p>
                    </div>
                    <button onClick={() => triggerToast(`Managing access for ${b.branch}...`)} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                      Manage Access
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LOGIN & SECURITY */}
          {usersTab === 'Login & Security' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-5 text-left">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2563EB]" /> SYSTEM SECURITY & AUTHENTICATION POLICIES
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Configure multi-factor authentication, session timeout limits, and IP address restriction rules.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Enforce Mandatory 2FA for Admin Users</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Require authenticator app passcode on login.</p>
                    </div>
                    <button type="button" onClick={() => triggerToast('Toggled 2FA policy')} className="w-9 h-5 rounded-full bg-blue-600 relative cursor-pointer">
                      <span className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 right-0.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Inactivity Session Timeout</label>
                    <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer">
                      <option value="30 mins">30 Minutes (Recommended)</option>
                      <option value="60 mins">60 Minutes</option>
                      <option value="120 mins">120 Minutes</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Password Expiration Policy</label>
                    <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer">
                      <option value="90 days">90 Days</option>
                      <option value="180 days">180 Days</option>
                      <option value="Never">Never Expire</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Failed Login Lockout Limit</label>
                    <input type="text" defaultValue="5 Failed Attempts" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ACTIVITY LOG */}
          {usersTab === 'Activity Log' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-5 text-left">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#2563EB]" /> SECURITY AUDIT & ACTIVITY TRAIL
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Real-time audit log of user logins, role changes, and system configuration updates.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase bg-slate-50/60">
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">User</th>
                      <th className="py-2.5 px-3">Action Description</th>
                      <th className="py-2.5 px-3">IP Address</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {[
                      { time: '30 May 2025 09:15 AM', user: 'Sarah Mitchell', action: 'Updated Company Logo & Branding settings', ip: '192.168.1.10', status: 'Success' },
                      { time: '30 May 2025 08:45 AM', user: 'John Davis', action: 'Created new user account: Michael Kumar (Driver)', ip: '192.168.1.15', status: 'Success' },
                      { time: '30 May 2025 07:58 AM', user: 'Ravi Wilson', action: 'Changed dispatch branch assignment for Sydney Depot', ip: '192.168.1.22', status: 'Success' },
                      { time: '30 May 2025 07:20 AM', user: 'Amit Handa', action: 'Logged into Admin Portal', ip: '192.168.1.45', status: 'Success' },
                      { time: '29 May 2025 11:40 AM', user: 'Shane Cooper', action: 'Account status set to Inactive by Admin', ip: '192.168.1.10', status: 'System' }
                    ].map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">{log.time}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{log.user}</td>
                        <td className="py-2.5 px-3">{log.action}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{log.ip}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="px-2 py-0.5 rounded text-[9.5px] font-black bg-[#DCFCE7] text-[#166534]">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. DEVELOPER NOTES - USERS, ROLES & PERMISSIONS FOOTER BANNER */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 shadow-2xs text-left mt-6">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-5 rounded bg-[#2563EB] text-white font-mono text-[10px] font-bold flex items-center justify-center">
                &lt;/&gt;
              </div>
              <h3 className="text-xs font-black text-blue-950 uppercase tracking-wider">DEVELOPER NOTES – USERS, ROLES & PERMISSIONS</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">1. PURPOSE</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Centralised user and role management.</li>
                  <li>• Role-based access control (RBAC).</li>
                  <li>• Branch-level access restrictions.</li>
                  <li>• Audit all user and permission changes.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">2. KEY FEATURES</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• User list with search and filters.</li>
                  <li>• Create, edit, invite and deactivate users.</li>
                  <li>• Predefined and custom roles.</li>
                  <li>• Permission sets with granular control.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">3. PERMISSIONS MANAGEMENT</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Module-level permissions.</li>
                  <li>• Action-level permissions (View, Create, Edit, Delete).</li>
                  <li>• Data-level restrictions by branch.</li>
                  <li>• Custom permission sets.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">4. SECURITY & ACCESS</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Strong password and session policies.</li>
                  <li>• Optional 2FA for all admin users.</li>
                  <li>• Role change and login activity logs.</li>
                  <li>• Auto logout for inactive sessions.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">5. DATA SOURCES</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• User data and profiles.</li>
                  <li>• Roles and permission definitions.</li>
                  <li>• Branch and location data.</li>
                  <li>• Login and activity logs.</li>
                </ul>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-blue-200/60 flex items-center justify-between text-[8.5px] text-slate-500 font-semibold">
              <div className="flex items-center gap-1.5">
                <RefreshCw size={10} className="text-[#2563EB] animate-spin-slow" />
                <span>All times shown in your local time (AEST) • Data auto-refreshes every 5 minutes</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
         VIEW 4: 13.4 WORKFLOW & AUTOMATION RULES PAGE (Screenshot 2 Exact Match)
         ========================================================================= */}
      {currentView === 'workflow-rules' && (
        <div className="space-y-4">
          
          {/* PAGE TITLE & ACTION BUTTONS HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  13.4 Workflow & Automation Rules
                </h1>
                <div className="w-5 h-5 rounded-md border border-purple-200 bg-purple-50 text-purple-600 flex items-center justify-center cursor-pointer">
                  <Bookmark size={11} />
                </div>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Configure automation rules and workflows to streamline operations and notifications.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
              <button 
                onClick={() => triggerToast('Workflow rules refreshed!')} 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              >
                <RefreshCw size={13} className="text-slate-500" /> Refresh
              </button>
              <button 
                onClick={handleExportWorkflowRulesCSV} 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              >
                <Download size={13} className="text-slate-500" /> Export Rules
              </button>
              <button 
                onClick={() => setIsCreateWorkflowRuleModalOpen(true)} 
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Plus size={14} /> Create Rule
              </button>
            </div>
          </div>

          {/* SUB-TAB NAVIGATION (7 TABS) */}
          <div className="flex items-center gap-6 border-b border-slate-200/80 overflow-x-auto pt-1">
            {['Overview', 'Invoice Automation', 'Payment Reminders', 'Compliance Reminders', 'Load Status Actions', 'Customer Notifications', 'Approval Workflows'].map((tab) => (
              <button
                key={tab}
                onClick={() => setWorkflowTab(tab)}
                className={`py-2 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  workflowTab === tab 
                    ? 'border-[#2563EB] text-[#2563EB]' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TOP METRIC CARDS (ROW OF 6 CARDS MATCHING SCREENSHOT 2) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            
            {/* Card 1: ACTIVE RULES */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between hover:border-emerald-200 transition-all text-left">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                  <Users size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight block leading-none">ACTIVE RULES</span>
                  <span className="text-xl font-black text-slate-900 block mt-1 leading-none">{workflowRulesList.filter(r => r.status === 'Active').length * 4 + 4}</span>
                  <p className="text-[9px] font-extrabold text-emerald-600 leading-none mt-1">↑ 12.5% <span className="font-semibold text-slate-400">vs Last Month</span></p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-50 flex justify-end mt-2">
                <button onClick={() => setWorkflowStatusFilter('Active')} className="text-[9px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                  View active rules →
                </button>
              </div>
            </div>

            {/* Card 2: INACTIVE RULES */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between hover:border-orange-200 transition-all text-left">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                  <Clock size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight block leading-none">INACTIVE RULES</span>
                  <span className="text-xl font-black text-slate-900 block mt-1 leading-none">5</span>
                  <p className="text-[9px] font-extrabold text-rose-500 leading-none mt-1">↓ 16.7% <span className="font-semibold text-slate-400">vs Last Month</span></p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-50 flex justify-end mt-2">
                <button onClick={() => setWorkflowStatusFilter('Inactive')} className="text-[9px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                  View inactive rules →
                </button>
              </div>
            </div>

            {/* Card 3: RULE EXECUTIONS (THIS MONTH) */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between hover:border-purple-200 transition-all text-left">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F3E8FF] text-purple-600 flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                  <Cpu size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">RULE EXECUTIONS (THIS MONTH)</span>
                  <span className="text-xl font-black text-slate-900 block mt-1 leading-none">1,248</span>
                  <p className="text-[9px] font-extrabold text-emerald-600 leading-none mt-1">↑ 15.3% <span className="font-semibold text-slate-400">vs Last Month</span></p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-50 flex justify-end mt-2">
                <button onClick={() => triggerToast('Opening execution log...')} className="text-[9px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                  View execution log →
                </button>
              </div>
            </div>

            {/* Card 4: AUTOMATIONS SAVED (HRS) */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between hover:border-blue-200 transition-all text-left">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                  <Clock size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">AUTOMATIONS SAVED (HRS)</span>
                  <span className="text-xl font-black text-slate-900 block mt-1 leading-none">124.6</span>
                  <p className="text-[9px] font-extrabold text-emerald-600 leading-none mt-1">↑ 15.8% <span className="font-semibold text-slate-400">vs Last Month</span></p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-50 flex justify-end mt-2">
                <button onClick={() => triggerToast('Opening savings report...')} className="text-[9px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                  View savings report →
                </button>
              </div>
            </div>

            {/* Card 5: FAILED EXECUTIONS */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between hover:border-rose-200 transition-all text-left">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                  <AlertTriangle size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight block leading-none">FAILED EXECUTIONS</span>
                  <span className="text-xl font-black text-slate-900 block mt-1 leading-none">7</span>
                  <p className="text-[9px] font-extrabold text-emerald-600 leading-none mt-1">↓ 22.2% <span className="font-semibold text-slate-400">vs Last Month</span></p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-50 flex justify-end mt-2">
                <button onClick={() => triggerToast('Opening error log...')} className="text-[9px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                  View error log →
                </button>
              </div>
            </div>

            {/* Card 6: NOTIFICATIONS SENT */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between hover:border-amber-200 transition-all text-left">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                  <Bell size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight block leading-none">NOTIFICATIONS SENT</span>
                  <span className="text-xl font-black text-slate-900 block mt-1 leading-none">3,567</span>
                  <p className="text-[9px] font-extrabold text-emerald-600 leading-none mt-1">↑ 14.6% <span className="font-semibold text-slate-400">vs Last Month</span></p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-50 flex justify-end mt-2">
                <button onClick={() => triggerToast('Opening notifications log...')} className="text-[9px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                  View notifications →
                </button>
              </div>
            </div>

          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search rules by name or description..."
                value={workflowSearchQuery}
                onChange={(e) => setWorkflowSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <select
                value={workflowCategoryFilter}
                onChange={(e) => setWorkflowCategoryFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="All Categories">All Categories</option>
                <option value="Invoice Automation">Invoice Automation</option>
                <option value="Payment Reminders">Payment Reminders</option>
                <option value="Compliance Reminders">Compliance Reminders</option>
                <option value="Load Status Actions">Load Status Actions</option>
                <option value="Customer Notifications">Customer Notifications</option>
                <option value="Approval Workflows">Approval Workflows</option>
              </select>

              <select
                value={workflowStatusFilter}
                onChange={(e) => setWorkflowStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <select
                value={workflowTriggerFilter}
                onChange={(e) => setWorkflowTriggerFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="All Triggers">All Triggers</option>
                <option value="Load Status: Delivered">Load Status: Delivered</option>
                <option value="Invoice Due Date Passed">Invoice Due Date Passed</option>
                <option value="License Expiry 7 Days Before">License Expiry 7 Days Before</option>
              </select>

              <button 
                onClick={() => triggerToast('Filters applied')} 
                className="p-1.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                <Sliders size={14} />
              </button>
              <button 
                onClick={() => {
                  setWorkflowSearchQuery('');
                  setWorkflowCategoryFilter('All Categories');
                  setWorkflowStatusFilter('All Status');
                  setWorkflowTriggerFilter('All Triggers');
                }} 
                className="p-1.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* MAIN 2-COLUMN SPLIT GRID (AUTOMATION RULES TABLE + SIDE CARDS) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* LEFT COLUMN: AUTOMATION RULES TABLE (LG 8 COLS) */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs text-left space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">AUTOMATION RULES</h3>
                <button onClick={() => triggerToast('Viewing all 36 rules...')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                  View all rules →
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-tight bg-slate-50/50">
                      <th className="py-2 px-2 whitespace-nowrap">Rule Name</th>
                      <th className="py-2 px-2 whitespace-nowrap">Category</th>
                      <th className="py-2 px-2 whitespace-nowrap">Trigger</th>
                      <th className="py-2 px-2 whitespace-nowrap">Action</th>
                      <th className="py-2 px-2 whitespace-nowrap">Status</th>
                      <th className="py-2 px-2 whitespace-nowrap">Last Executed</th>
                      <th className="py-2 px-2 text-center whitespace-nowrap">Executions</th>
                      <th className="py-2 px-2 text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium">
                    {filteredWorkflowRules.map((rule) => (
                      <tr 
                        key={rule.id}
                        onClick={() => setSelectedWorkflowRule(rule)}
                        className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${selectedWorkflowRule.id === rule.id ? 'bg-blue-50/60 font-semibold' : ''}`}
                      >
                        <td className="py-2 px-2 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {renderRuleIcon(rule, false)}
                            <div className="min-w-0">
                              <div className="font-extrabold text-slate-900 text-[11px] leading-tight whitespace-nowrap">{rule.name}</div>
                              <div className="text-[9.5px] text-slate-400 font-medium leading-tight whitespace-nowrap truncate max-w-[180px]">{rule.desc}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-2 px-2 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold whitespace-nowrap ${rule.categoryColor}`}>
                            {rule.category}
                          </span>
                        </td>

                        <td className="py-2 px-2 text-slate-800 font-bold text-[10.5px] whitespace-nowrap">
                          {rule.trigger}
                        </td>

                        <td className="py-2 px-2 text-slate-600 font-medium text-[10.5px] whitespace-nowrap">
                          {rule.action}
                        </td>

                        <td className="py-2 px-2 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-md text-[9.5px] font-extrabold ${rule.status === 'Active' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-rose-100 text-rose-700'}`}>
                            {rule.status}
                          </span>
                        </td>

                        <td className="py-2 px-2 text-slate-600 font-medium text-[10px] whitespace-nowrap">
                          {rule.lastExecuted}
                        </td>

                        <td className="py-2 px-2 text-center font-bold text-slate-800 text-[10.5px] whitespace-nowrap">
                          {rule.executions}
                        </td>

                        <td className="py-2 px-2 text-right relative whitespace-nowrap">
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setActiveRuleRowMenuId(activeRuleRowMenuId === rule.id ? null : rule.id); 
                            }} 
                            className="p-1 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                          >
                            <MoreHorizontal size={14} />
                          </button>

                          {activeRuleRowMenuId === rule.id && (
                            <div 
                              onClick={(e) => e.stopPropagation()} 
                              className="absolute right-2 top-8 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1 w-44 text-left font-semibold text-xs space-y-0.5 animate-fade-in"
                            >
                              <button onClick={() => handleOpenEditWorkflowRuleModal(rule)} className="w-full px-3 py-1.5 hover:bg-blue-50 text-slate-800 hover:text-blue-600 flex items-center gap-2 cursor-pointer">
                                <Edit size={13} className="text-slate-400" /> Edit Rule
                              </button>
                              <button onClick={() => { setActiveRuleRowMenuId(null); triggerToast(`Testing execution of "${rule.name}"...`); }} className="w-full px-3 py-1.5 hover:bg-blue-50 text-slate-800 hover:text-blue-600 flex items-center gap-2 cursor-pointer">
                                <Cpu size={13} className="text-slate-400" /> Test Run Rule
                              </button>
                              <button onClick={() => handleToggleWorkflowRuleStatus(rule)} className="w-full px-3 py-1.5 hover:bg-blue-50 text-slate-800 hover:text-blue-600 flex items-center gap-2 cursor-pointer">
                                {rule.status === 'Active' ? <UserX size={13} className="text-rose-500" /> : <UserCheck size={13} className="text-emerald-500" />}
                                <span>{rule.status === 'Active' ? 'Deactivate Rule' : 'Activate Rule'}</span>
                              </button>
                              <div className="border-t border-slate-100 my-1"></div>
                              <button onClick={() => handleDeleteWorkflowRule(rule)} className="w-full px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer">
                                <Trash2 size={13} /> Delete Rule
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
                <span>Showing 1 to {filteredWorkflowRules.length} of 36 rules</span>
                
                <div className="flex items-center gap-1">
                  <button className="px-2 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400">|‹</button>
                  <button className="px-2 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400">‹</button>
                  <button className="px-2.5 py-1 bg-[#2563EB] text-white font-bold rounded-md">1</button>
                  <button className="px-2.5 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700">2</button>
                  <button className="px-2.5 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700">3</button>
                  <button className="px-2.5 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700">4</button>
                  <button className="px-2.5 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700">5</button>
                  <button className="px-2 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700">›</button>
                  <button className="px-2 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700">›|</button>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: RULE DETAILS & RECENT ACTIVITY CARDS (LG 4 COLS MATCHING SCREENSHOT 2) */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* CARD 1: RULE DETAILS */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3.5 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">RULE DETAILS</h3>
                  <button onClick={() => handleOpenEditWorkflowRuleModal(selectedWorkflowRule)} className="flex items-center gap-1 text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                    <Edit size={11} /> Edit Rule
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {renderRuleIcon(selectedWorkflowRule, true)}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 leading-tight">{selectedWorkflowRule.name}</h3>
                      <span className="px-2 py-0.2 rounded-md text-[9px] font-extrabold bg-[#DCFCE7] text-[#166534]">
                        {selectedWorkflowRule.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">{selectedWorkflowRule.desc}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-500">Category:</span>
                    <span className="font-bold text-slate-900">{selectedWorkflowRule.category}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-500">Trigger:</span>
                    <span className="font-bold text-slate-900">{selectedWorkflowRule.trigger}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-500">Action:</span>
                    <span className="font-bold text-slate-900">{selectedWorkflowRule.action}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-500">Created By:</span>
                    <span className="font-bold text-slate-900">{selectedWorkflowRule.createdBy}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-500">Created On:</span>
                    <span className="font-bold text-slate-900">{selectedWorkflowRule.createdOn}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-500">Last Modified:</span>
                    <span className="font-bold text-slate-900">{selectedWorkflowRule.lastModified}</span>
                  </div>
                </div>
              </div>

              {/* CARD 2: RECENT ACTIVITY */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">RECENT ACTIVITY</h3>
                  <button onClick={() => triggerToast('Viewing all activity...')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                    View all activity →
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-800 text-[11px]">Rule executed successfully</span>
                    </div>
                    <span className="text-[9.5px] font-bold text-slate-600 shrink-0">30 May 2025 09:15 AM</span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-800 text-[11px]">Invoice INV-1058 created</span>
                    </div>
                    <span className="text-[9.5px] font-bold text-slate-600 shrink-0">30 May 2025 09:15 AM</span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-800 text-[11px]">Accounts notified</span>
                    </div>
                    <span className="text-[9.5px] font-bold text-slate-600 shrink-0">30 May 2025 09:16 AM</span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={14} className="text-rose-500 shrink-0" />
                      <span className="font-bold text-rose-700 text-[11px]">Execution failed</span>
                    </div>
                    <span className="text-[9.5px] font-bold text-slate-600 shrink-0">29 May 2025 11:05 PM</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* DEVELOPER NOTES - WORKFLOW & AUTOMATION RULES FOOTER BANNER MATCHING SCREENSHOT 2 */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 shadow-2xs text-left mt-6">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-5 rounded bg-[#2563EB] text-white font-mono text-[10px] font-bold flex items-center justify-center">
                &lt;/&gt;
              </div>
              <h3 className="text-xs font-black text-blue-950 uppercase tracking-wider">DEVELOPER NOTES – WORKFLOW & AUTOMATION RULES</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">1. PURPOSE</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Configure and manage automation rules.</li>
                  <li>• Improve efficiency with smart workflows.</li>
                  <li>• Reduce manual tasks and errors.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">2. KEY FEATURES</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Rule creation with trigger & action.</li>
                  <li>• Enable/disable rules.</li>
                  <li>• Execution logs and performance.</li>
                  <li>• Time saving and analytics.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">3. RULE CATEGORIES</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Invoice Automation.</li>
                  <li>• Payment Reminders.</li>
                  <li>• Compliance Reminders.</li>
                  <li>• Load Status Actions.</li>
                  <li>• Customer Notifications.</li>
                  <li>• Approval Workflows.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">4. RULE COMPONENTS</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Trigger: Event or condition.</li>
                  <li>• Condition (optional).</li>
                  <li>• Action: Email, SMS, In-App, Create Record.</li>
                  <li>• Filters: Branch, Role, Date, etc.</li>
                  <li>• Run: Real-time or scheduled.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">5. DATA SOURCES</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Loads, Invoices, Drivers, Vehicles.</li>
                  <li>• Customers, Branches.</li>
                  <li>• Compliance, Maintenance.</li>
                  <li>• User and role data.</li>
                  <li>• System notifications.</li>
                </ul>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-blue-200/60 flex items-center justify-between text-[8.5px] text-slate-500 font-semibold">
              <div className="flex items-center gap-1.5">
                <RefreshCw size={10} className="text-[#2563EB] animate-spin-slow" />
                <span>All times shown in your local time (AEST) • Data auto-refreshes every 5 minutes</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
         VIEW 5: 13.5 AI CONFIGURATION PAGE
         ========================================================================= */}
      {currentView === 'ai-configuration' && (
        <div className="space-y-4 text-left">
          
          {/* PAGE TITLE & ACTION BUTTONS HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  13.5 AI Configuration
                </h1>
                <div className="w-5 h-5 rounded-md border border-purple-200 bg-purple-50 text-purple-600 flex items-center justify-center cursor-pointer hover:bg-purple-100 transition-colors">
                  <Bookmark size={11} />
                </div>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Configure AI features, models, data sources and automation preferences.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
              <button 
                onClick={() => triggerToast('AI Configuration refreshed!')} 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              >
                <RefreshCw size={13} className="text-slate-500" /> Refresh
              </button>
              <button 
                onClick={() => triggerToast('Exporting AI Configuration...')} 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              >
                <Download size={13} className="text-slate-500" /> Export Config
              </button>
              <button 
                onClick={() => triggerToast('AI Configuration changes saved successfully!')} 
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Save size={14} /> Save Changes
              </button>
            </div>
          </div>

          {/* SUB-TAB NAVIGATION (8 TABS) */}
          <div className="flex items-center gap-6 border-b border-slate-200/80 overflow-x-auto pt-1">
            {['Overview', 'Feature Settings', 'AI Models', 'Data Sources', 'Automation', 'AI Prompts & Templates', 'Usage & Limits', 'Logs & Monitoring'].map((tab) => (
              <button
                key={tab}
                onClick={() => setAiTab(tab)}
                className={`py-2 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  aiTab === tab 
                    ? 'border-[#2563EB] text-[#2563EB]' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TOP METRIC CARDS (ROW OF 6 CARDS MATCHING SCREENSHOT 2) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            
            {/* Card 1: AI FEATURES ENABLED */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between hover:border-purple-200 transition-all text-left">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F3E8FF] text-purple-600 flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                  <Cpu size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight block leading-none">AI FEATURES ENABLED</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-black text-slate-900 leading-none">12</span>
                    <span className="text-[10px] font-bold text-slate-500">of 18</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-50 flex justify-end mt-2">
                <button onClick={() => setAiTab('Feature Settings')} className="text-[9px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                  View all features →
                </button>
              </div>
            </div>

            {/* Card 2: AI REQUESTS (THIS MONTH) */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between hover:border-emerald-200 transition-all text-left">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                  <HardDrive size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">AI REQUESTS (THIS MONTH)</span>
                  <span className="text-xl font-black text-slate-900 block mt-1 leading-none">24,680</span>
                  <p className="text-[9px] font-extrabold text-emerald-600 leading-none mt-1">↑ 18.6% <span className="font-semibold text-slate-400">vs Last Month</span></p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-50 flex justify-end mt-2">
                <button onClick={() => setAiTab('Usage & Limits')} className="text-[9px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                  View usage report →
                </button>
              </div>
            </div>

            {/* Card 3: AUTOMATIONS RUN (THIS MONTH) */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between hover:border-amber-200 transition-all text-left">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                  <Zap size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">AUTOMATIONS RUN (THIS MONTH)</span>
                  <span className="text-xl font-black text-slate-900 block mt-1 leading-none">3,842</span>
                  <p className="text-[9px] font-extrabold text-emerald-600 leading-none mt-1">↑ 21.4% <span className="font-semibold text-slate-400">vs Last Month</span></p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-50 flex justify-end mt-2">
                <button onClick={() => setAiTab('Automation')} className="text-[9px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                  View automation log →
                </button>
              </div>
            </div>

            {/* Card 4: DATA SOURCES CONNECTED */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between hover:border-blue-200 transition-all text-left">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                  <Database size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">DATA SOURCES CONNECTED</span>
                  <span className="text-xl font-black text-slate-900 block mt-1 leading-none">8</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-50 flex justify-end mt-2">
                <button onClick={() => setAiTab('Data Sources')} className="text-[9px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                  View data sources →
                </button>
              </div>
            </div>

            {/* Card 5: AI ACCURACY (AVG THIS MONTH) */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between hover:border-rose-200 transition-all text-left">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                  <TrendingUp size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">AI ACCURACY (AVG THIS MONTH)</span>
                  <span className="text-xl font-black text-slate-900 block mt-1 leading-none">92.4%</span>
                  <p className="text-[9px] font-extrabold text-emerald-600 leading-none mt-1">↑ 4.2% <span className="font-semibold text-slate-400">vs Last Month</span></p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-50 flex justify-end mt-2">
                <button onClick={() => setAiTab('Logs & Monitoring')} className="text-[9px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                  View accuracy report →
                </button>
              </div>
            </div>

            {/* Card 6: AI HEALTH STATUS */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between hover:border-emerald-200 transition-all text-left">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                  <ShieldCheck size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">AI HEALTH STATUS</span>
                  <span className="text-xl font-black text-emerald-600 block mt-1 leading-none">Healthy</span>
                  <p className="text-[9px] font-semibold text-slate-400 leading-none mt-1">All systems operational</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-50 flex justify-end mt-2">
                <button onClick={() => triggerToast('Checking AI system health...')} className="text-[9px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                  View health report →
                </button>
              </div>
            </div>

          </div>

          {/* MAIN 2-COLUMN SPLIT GRID (AI FEATURE CONFIGURATION + RIGHT SIDE CARDS) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5 items-start">
            
            {/* LEFT COLUMN: AI FEATURE CONFIGURATION TABLE (XL 7 COLS) */}
            <div className="xl:col-span-7 bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-2.5 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">AI FEATURE CONFIGURATION</h3>
              </div>

              {/* Table */}
              <div className="w-full overflow-x-auto scrollbar-thin">
                <table className="w-full text-left border-collapse min-w-[680px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-extrabold text-[#1E1B4B] bg-slate-50/50">
                      <th className="py-2.5 px-2.5 whitespace-nowrap min-w-[170px]">Feature</th>
                      <th className="py-2.5 px-2.5 whitespace-nowrap min-w-[240px]">Description</th>
                      <th className="py-2.5 px-2.5 whitespace-nowrap min-w-[75px]">Status</th>
                      <th className="py-2.5 px-2.5 whitespace-nowrap min-w-[130px]">Model</th>
                      <th className="py-2.5 px-2.5 whitespace-nowrap min-w-[125px]">Confidence Threshold</th>
                      <th className="py-2.5 px-2 text-center whitespace-nowrap min-w-[65px]">Auto Execute</th>
                      <th className="py-2.5 px-1.5 text-right whitespace-nowrap min-w-[40px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium">
                    {aiFeaturesList.map((feat) => (
                      <tr 
                        key={feat.id}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="py-2.5 px-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${feat.iconBg}`}>
                              {feat.icon}
                            </div>
                            <span className="font-extrabold text-[#1E293B] text-[11px] leading-tight">{feat.name}</span>
                          </div>
                        </td>

                        <td className="py-2.5 px-2.5 whitespace-normal">
                          <div className="text-slate-500 font-medium text-[10px] leading-[1.45] w-[210px] line-clamp-2">
                            {feat.desc}
                          </div>
                        </td>

                        <td className="py-2.5 px-2.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold ${
                            feat.status === 'Enabled' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {feat.status}
                          </span>
                        </td>

                        <td className="py-2.5 px-2.5 text-slate-800 font-bold text-[10.5px] whitespace-nowrap">
                          {feat.model}
                        </td>

                        <td className="py-2.5 px-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-2 w-24">
                            <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-[#10B981] h-full rounded-full transition-all" 
                                style={{ width: `${feat.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] font-black text-slate-700 w-6 text-right">{feat.confidence}%</span>
                          </div>
                        </td>

                        <td className="py-2 px-1 text-center whitespace-nowrap">
                          <button
                            onClick={() => {
                              const updated = aiFeaturesList.map(f => f.id === feat.id ? { ...f, autoExecute: !f.autoExecute } : f);
                              setAiFeaturesList(updated);
                              triggerToast(`${feat.name} auto-execute set to ${!feat.autoExecute ? 'ON' : 'OFF'}`);
                            }}
                            className={`w-7.5 h-4 rounded-full transition-colors relative cursor-pointer inline-block align-middle ${
                              feat.autoExecute ? 'bg-[#2563EB]' : 'bg-slate-300'
                            }`}
                          >
                            <span className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${
                              feat.autoExecute ? 'left-4' : 'left-0.5'
                            }`}></span>
                          </button>
                        </td>

                        <td className="py-2 px-1 text-right whitespace-nowrap">
                          <button 
                            onClick={() => triggerToast(`Opening options for ${feat.name}...`)} 
                            className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-900 cursor-pointer"
                          >
                            <MoreHorizontal size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2.5 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                <span>Showing 1 to 8 of 12 features</span>
                
                <div className="flex items-center gap-1">
                  <button className="px-2 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400 text-xs">|‹</button>
                  <button className="px-2 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400 text-xs">‹</button>
                  <button className="px-2.5 py-0.5 bg-[#2563EB] text-white font-bold rounded-md text-xs">1</button>
                  <button className="px-2.5 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">2</button>
                  <button className="px-2 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">›</button>
                  <button className="px-2 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">›|</button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: AI MODEL MANAGEMENT + AI USAGE OVERVIEW (XL 5 COLS) */}
            <div className="xl:col-span-5 space-y-3.5">
              
              {/* TOP CARD: AI MODEL MANAGEMENT */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs text-left space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">AI MODEL MANAGEMENT</h3>
                  <button onClick={() => setAiTab('AI Models')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                    View all models →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[9.5px] font-black text-slate-400 uppercase tracking-tight bg-slate-50/50">
                        <th className="py-2 px-2 whitespace-nowrap">Model Name</th>
                        <th className="py-2 px-2 whitespace-nowrap">Provider</th>
                        <th className="py-2 px-2 whitespace-nowrap">Version</th>
                        <th className="py-2 px-2 whitespace-nowrap">Status</th>
                        <th className="py-2 px-2 text-right whitespace-nowrap">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium">
                      {aiModelsList.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-2 font-extrabold text-slate-900 text-[11px] whitespace-nowrap">{m.name}</td>
                          <td className="py-2.5 px-2 text-slate-600 text-[10px] whitespace-nowrap">{m.provider}</td>
                          <td className="py-2.5 px-2 text-slate-500 font-mono text-[10px] whitespace-nowrap">{m.version}</td>
                          <td className="py-2.5 px-2 whitespace-nowrap">
                            <span className="text-emerald-600 font-black text-[10px]">Active</span>
                          </td>
                          <td className="py-2.5 px-2 text-right text-slate-500 text-[10px] whitespace-nowrap">{m.lastUpdated}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-start">
                  <button onClick={() => setAiTab('AI Models')} className="text-[10px] font-extrabold text-[#2563EB] hover:underline cursor-pointer">
                    Manage AI models →
                  </button>
                </div>
              </div>

              {/* BOTTOM CARD: AI USAGE OVERVIEW (THIS MONTH) */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs text-left space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">AI USAGE OVERVIEW (THIS MONTH)</h3>
                  <button onClick={() => setAiTab('Usage & Limits')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">
                    View full analytics →
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  
                  {/* Donut Chart */}
                  <div className="relative w-[85px] h-[85px] flex-shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#E2E8F0" strokeWidth="18" />
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#2563EB" strokeWidth="18" strokeDasharray="282.7" strokeDashoffset="96" />
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#06B6D4" strokeWidth="18" strokeDasharray="282.7" strokeDashoffset="166" />
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#F59E0B" strokeWidth="18" strokeDasharray="282.7" strokeDashoffset="215" />
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#10B981" strokeWidth="18" strokeDasharray="282.7" strokeDashoffset="256" />
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#A855F7" strokeWidth="18" strokeDasharray="282.7" strokeDashoffset="278" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-black text-slate-900 leading-none">24,680</span>
                      <span className="text-[7px] font-bold text-slate-400 leading-tight mt-0.5">Total Requests</span>
                    </div>
                  </div>

                  {/* Legend List beside chart */}
                  <div className="flex-1 min-w-0 space-y-[4px]">
                    {[
                      { color: '#2563EB', label: 'Load Creation', val: '8,450 (34.2%)' },
                      { color: '#06B6D4', label: 'Document OCR', val: '6,120 (24.8%)' },
                      { color: '#F59E0B', label: 'Trailer Recommendation', val: '4,320 (17.5%)' },
                      { color: '#10B981', label: 'Payment Reminders', val: '3,650 (14.8%)' },
                      { color: '#A855F7', label: 'Other Features', val: '2,140 (8.7%)' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                          <span className="text-[8.5px] font-semibold text-slate-600 whitespace-nowrap">{item.label}</span>
                        </div>
                        <span className="text-[8.5px] font-bold text-slate-800 whitespace-nowrap ml-1">{item.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Right Stat Boxes — compact */}
                  <div className="flex-shrink-0 space-y-1 w-[108px]">
                    <div className="px-2 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-1 mb-0.5">
                        <div className="w-3 h-3 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                          <Check size={7} />
                        </div>
                        <span className="text-[8.5px] font-bold text-slate-500">Successful</span>
                      </div>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[12px] font-black text-slate-900 leading-none">22,846</span>
                        <span className="text-[8px] font-extrabold text-emerald-600">(92.6%)</span>
                      </div>
                    </div>

                    <div className="px-2 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-1 mb-0.5">
                        <div className="w-3 h-3 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle size={7} />
                        </div>
                        <span className="text-[8.5px] font-bold text-slate-500">Failed</span>
                      </div>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[12px] font-black text-slate-900 leading-none">1,834</span>
                        <span className="text-[8px] font-extrabold text-amber-600">(7.4%)</span>
                      </div>
                    </div>

                    <div className="px-2 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-1 mb-0.5">
                        <div className="w-3 h-3 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                          <Clock size={7} />
                        </div>
                        <span className="text-[8.5px] font-bold text-slate-500">Avg Response Time</span>
                      </div>
                      <span className="text-[12px] font-black text-slate-900 leading-none">2.4 sec</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>

          {/* DEVELOPER NOTES - AI CONFIGURATION FOOTER BANNER */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 shadow-2xs text-left">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-5 rounded bg-[#2563EB] text-white font-mono text-[10px] font-bold flex items-center justify-center">
                &lt;/&gt;
              </div>
              <h3 className="text-xs font-black text-blue-950 uppercase tracking-wider">DEVELOPER NOTES – AI CONFIGURATION</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">1. PURPOSE</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Central hub for AI and automation configuration.</li>
                  <li>• Enable/disable AI features and set preferences.</li>
                  <li>• Monitor usage, accuracy and system health.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">2. KEY FEATURES</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Toggle AI features on/off.</li>
                  <li>• Configure models and confidence thresholds.</li>
                  <li>• Set auto-execute rules and triggers.</li>
                  <li>• Track usage and performance metrics.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">3. AI MODELS</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Manage AI models and versions.</li>
                  <li>• Set default model per feature.</li>
                  <li>• Support multiple providers and models.</li>
                  <li>• Monitor model performance.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">4. AUTOMATION & RULES</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Define triggers, conditions and actions.</li>
                  <li>• Set schedules and dependencies.</li>
                  <li>• Enable/disable automation workflows.</li>
                  <li>• View execution logs and results.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">5. DATA & SECURITY</h4>
                <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">
                  <li>• Manage data sources and permissions.</li>
                  <li>• Ensure data privacy and compliance.</li>
                  <li>• Audit AI usage and configuration changes.</li>
                  <li>• Role-based access to AI settings.</li>
                </ul>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-blue-200/60 flex items-center justify-between text-[8.5px] text-slate-500 font-semibold">
              <div className="flex items-center gap-1.5">
                <RefreshCw size={10} className="text-[#2563EB] animate-spin-slow" />
                <span>All times shown in your local time (AEST) • Data auto-refreshes every 5 minutes</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
         VIEW 6: 13.6 INTEGRATIONS PAGE (Screenshot 2 Exact Match)
         ========================================================================= */}
      {currentView === 'integrations' && (
        <div className="space-y-4 text-left">

          {/* PAGE TITLE & ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">13.6 Integrations</h1>
                <div className="w-5 h-5 rounded-md border border-amber-200 bg-amber-50 text-amber-500 flex items-center justify-center cursor-pointer hover:bg-amber-100 transition-colors">
                  <Star size={11} />
                </div>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">Connect and manage third-party integrations and data synchronisation.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
              <button 
                onClick={handleRefreshIntegrations} 
                disabled={isRefreshingIntegrations}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <RefreshCw size={13} className={`text-slate-500 ${isRefreshingIntegrations ? 'animate-spin' : ''}`} /> 
                {isRefreshingIntegrations ? 'Refreshing...' : 'Refresh'}
              </button>

              <button 
                onClick={() => { setIntegrationsTab('Integration Logs'); triggerToast('Opening integration logs...'); }} 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              >
                <FileText size={13} className="text-slate-500" /> View Integration Logs
              </button>

              <button 
                onClick={() => setIsAddIntegrationModalOpen(true)} 
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Plus size={14} /> Add Integration
              </button>
            </div>
          </div>

          {/* SUB-TABS */}
          <div className="flex items-center gap-0 border-b border-slate-200/80 overflow-x-auto pt-1">
            {['Overview', 'Connected Integrations', 'Available Integrations', 'API & Webhooks', 'Data Sync', 'Integration Logs', 'Settings'].map((tab) => (
              <button key={tab} onClick={() => setIntegrationsTab(tab)}
                className={`py-2 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 focus:outline-none focus:ring-0 outline-none cursor-pointer ${
                  integrationsTab === tab ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}>{tab}</button>
            ))}
          </div>

          {/* ===== TAB CONTENT ===== */}
          {integrationsTab === 'Overview' && (
            <>
              {/* 6 METRIC CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { icon: <Link2 size={16} />, bg: 'bg-[#DBEAFE] text-[#2563EB]', border: 'hover:border-blue-200', label: 'CONNECTED INTEGRATIONS', value: '12', sub: '↑ 20.0%', subColor: 'text-emerald-600', subText: 'vs Last Month', link: 'View all integrations →', onClick: () => setIntegrationsTab('Connected Integrations') },
                  { icon: <Database size={16} />, bg: 'bg-[#DCFCE7] text-[#16A34A]', border: 'hover:border-emerald-200', label: 'DATA SYNCED TODAY', value: '1,248', sub: '↑ 15.3%', subColor: 'text-emerald-600', subText: 'vs Yesterday', link: 'View sync activity →', onClick: () => setIntegrationsTab('Data Sync') },
                  { icon: <AlertCircle size={16} />, bg: 'bg-rose-100 text-rose-600', border: 'hover:border-rose-200', label: 'FAILED SYNC (TODAY)', value: '6', valueColor: 'text-rose-600', sub: '↓ 25.0%', subColor: 'text-rose-600', subText: 'vs Yesterday', link: 'View error log →', onClick: () => triggerToast('Opening error log...') },
                  { icon: <Clock size={16} />, bg: 'bg-[#DBEAFE] text-[#2563EB]', border: 'hover:border-blue-200', label: 'LAST SYNC', value: '10:15 AM', sub: '30 May 2026', subColor: 'text-slate-400', link: 'View sync schedule →', onClick: () => triggerToast('Viewing sync schedule...') },
                  { icon: <Zap size={16} />, bg: 'bg-[#DCFCE7] text-[#16A34A]', border: 'hover:border-emerald-200', label: 'AUTO SYNC STATUS', value: 'Active', valueColor: 'text-emerald-600', sub: 'All automations running', subColor: 'text-slate-400', link: 'Manage schedules →', onClick: () => triggerToast('Managing schedules...') },
                  { icon: <ShieldCheck size={16} />, bg: 'bg-[#DCFCE7] text-[#16A34A]', border: 'hover:border-emerald-200', label: 'INTEGRATION HEALTH', value: 'Healthy', valueColor: 'text-emerald-600', sub: 'All systems operational', subColor: 'text-slate-400', link: 'View health report →', onClick: () => triggerToast('Viewing health report...') },
                ].map((card, i) => (
                  <div key={i} className={`bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between ${card.border} transition-all text-left`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-8 h-8 rounded-xl ${card.bg} flex items-center justify-center shrink-0 shadow-3xs mt-0.5`}>{card.icon}</div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">{card.label}</span>
                        <span className={`text-xl font-black block mt-1 leading-none ${card.valueColor || 'text-slate-900'}`}>{card.value}</span>
                        {card.sub && <p className={`text-[9px] font-extrabold leading-none mt-1 ${card.subColor}`}>{card.sub} <span className="font-semibold text-slate-400">{card.subText}</span></p>}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-50 flex justify-end mt-2">
                      <button onClick={card.onClick} className="text-[9px] font-bold text-[#2563EB] hover:underline cursor-pointer">{card.link}</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* SEARCH & FILTER ROW */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search integrations by name or category..." className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-300" />
                </div>
                <select className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white focus:outline-none cursor-pointer">
                  <option>All Categories</option><option>Accounting</option><option>GPS / Telematics</option><option>Compliance</option><option>Payments</option><option>Communication</option>
                </select>
                <select className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white focus:outline-none cursor-pointer">
                  <option>All Status</option><option>Connected</option><option>Limited</option><option>Disconnected</option>
                </select>
                <select className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white focus:outline-none cursor-pointer">
                  <option>All Sync Status</option><option>Synced</option><option>Syncing</option><option>Failed</option>
                </select>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"><Filter size={12} /> Filters</button>
                <button onClick={() => triggerToast('Refreshing...')} className="p-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"><RefreshCw size={13} className="text-slate-500" /></button>
              </div>

              {/* MAIN 2-COLUMN GRID */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5 items-start">
                {/* LEFT: INTEGRATIONS LIST */}
                <div className="xl:col-span-8 bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-2.5 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">INTEGRATIONS LIST</h3>
                    <button onClick={() => setIntegrationsTab('Connected Integrations')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">View all integrations →</button>
                  </div>
                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[640px]">
                      <thead>
                        <tr className="border-b border-slate-200 text-[10px] font-extrabold text-[#1E1B4B] bg-slate-50/50">
                          <th className="py-2 px-2 whitespace-nowrap">Integration</th>
                          <th className="py-2 px-2 whitespace-nowrap">Category</th>
                          <th className="py-2 px-2 whitespace-nowrap">Status</th>
                          <th className="py-2 px-2 whitespace-nowrap">Sync Status</th>
                          <th className="py-2 px-2 whitespace-nowrap">Last Sync</th>
                          <th className="py-2 px-2 whitespace-nowrap">Next Sync</th>
                          <th className="py-2 px-1.5 text-right whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { id:1, name:'Xero Accounting', desc:'Sync invoices, bills, payments & contacts', cat:'Accounting', sync:'Synced', last:'30 May 2025 10:16 AM', next:'30 May 2025 11:15 AM', color:'#1A73E8', letter:'X' },
                          { id:2, name:'MYOB Accounting', desc:'Sync financial data and contacts', cat:'Accounting', sync:'Synced', last:'30 May 2025 10:10 AM', next:'30 May 2025 10:45 AM', color:'#6B21A8', letter:'M' },
                          { id:3, name:'QuickBooks Online', desc:'Sync customers, invoices & payments', cat:'Accounting', sync:'Synced', last:'30 May 2025 10:10 AM', next:'30 May 2025 11:10 AM', color:'#16A34A', letter:'Q' },
                          { id:4, name:'Google Maps Platform', desc:'Maps, geocoding and route optimisation', cat:'Maps & Routing', sync:'Synced', last:'30 May 2025 10:10 AM', next:'30 May 2025 11:10 AM', color:'#EA4335', letter:'G' },
                          { id:5, name:'Samsara Telematics', desc:'GPS tracking and vehicle data', cat:'GPS / Telematics', sync:'Synced', last:'30 May 2025 10:12 AM', next:'30 May 2025 11:12 AM', color:'#0EA5E9', letter:'S' },
                          { id:6, name:'Geotab', desc:'Vehicle tracking and diagnostics', cat:'GPS / Telematics', sync:'Synced', last:'30 May 2025 10:10 AM', next:'30 May 2025 11:10 AM', color:'#6B7280', letter:'G' },
                          { id:7, name:'NHVR EWD', desc:'Driver work diary & fatigue data', cat:'Compliance', sync:'Synced', last:'30 May 2025 10:12 AM', next:'30 May 2025 11:12 AM', color:'#DC2626', letter:'N' },
                          { id:8, name:'Stripe Payments', desc:'Online payments and subscriptions', cat:'Payments', sync:'Synced', last:'30 May 2025 10:12 AM', next:'30 May 2025 11:10 AM', color:'#6366F1', letter:'S' },
                          { id:9, name:'Email Service (SendGrid)', desc:'Transactional emails and alerts', cat:'Communication', sync:'Syncing', last:'30 May 2025 10:15 AM', next:'30 May 2025 11:30 AM', color:'#0891B2', letter:'E' },
                          { id:10, name:'SMS Service (Twilio)', desc:'SMS notifications and alerts', cat:'Communication', sync:'Synced', last:'30 May 2025 10:11 AM', next:'30 May 2025 11:11 AM', color:'#DC2626', letter:'T' },
                        ].map((item) => (
                          <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                            <td className="py-2 px-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-white text-[9px] font-black" style={{ backgroundColor: item.color }}>{item.letter}</div>
                                <div>
                                  <div className="text-[10.5px] font-extrabold text-slate-900 leading-tight whitespace-nowrap">{item.name}</div>
                                  <div className="text-[8.5px] font-medium text-slate-400 leading-tight">{item.desc}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9.5px] font-semibold text-slate-600">{item.cat}</span></td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className="px-1.5 py-0.5 rounded-md text-[8.5px] font-extrabold bg-[#DCFCE7] text-[#166534]">Connected</span></td>
                            <td className="py-2 px-2 whitespace-nowrap">
                              {item.sync === 'Syncing' ? (
                                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span><span className="text-[9.5px] font-bold text-amber-600">Syncing</span></div>
                              ) : <span className="text-[9.5px] font-semibold text-slate-600">{item.sync}</span>}
                            </td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9px] font-semibold text-slate-500">{item.last}</span></td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9px] font-semibold text-slate-500">{item.next}</span></td>
                            <td className="py-2 px-1.5 text-right whitespace-nowrap">
                              <button onClick={() => triggerToast(`Managing ${item.name}...`)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-900 cursor-pointer"><MoreHorizontal size={13} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                    <span>Showing 1 to 10 of 12 integrations</span>
                    <div className="flex items-center gap-1">
                      <button className="px-2 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400 text-xs">|‹</button>
                      <button className="px-2 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400 text-xs">‹</button>
                      <button className="px-2.5 py-0.5 bg-[#2563EB] text-white font-bold rounded-md text-xs">1</button>
                      <button className="px-2.5 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">2</button>
                      <button className="px-2 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">›</button>
                      <button className="px-2 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">›|</button>
                    </div>
                  </div>
                </div>

                {/* RIGHT: INTEGRATION SUMMARY + TOP DATA SYNC + FAILED SYNC */}
                <div className="xl:col-span-4 space-y-3.5">
                  <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">INTEGRATION SUMMARY</h3>
                      <button className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">View full report →</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-[80px] h-[80px] flex-shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="28" fill="none" stroke="#E2E8F0" strokeWidth="13" />
                          <circle cx="40" cy="40" r="28" fill="none" stroke="#16A34A" strokeWidth="13" strokeDasharray="175.9" strokeDashoffset="14.7" />
                          <circle cx="40" cy="40" r="28" fill="none" stroke="#F59E0B" strokeWidth="13" strokeDasharray="175.9" strokeDashoffset="161.4" />
                          <circle cx="40" cy="40" r="28" fill="none" stroke="#EF4444" strokeWidth="13" strokeDasharray="175.9" strokeDashoffset="170" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[13px] font-black text-slate-900 leading-none">12</span>
                          <span className="text-[8px] font-bold text-slate-400">Total</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[{ color:'#16A34A', label:'Connected', count:'10', pct:'83.3%' }, { color:'#F59E0B', label:'Limited', count:'1', pct:'8.3%' }, { color:'#EF4444', label:'Disconnected', count:'1', pct:'8.3%' }].map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span><span className="text-[9px] font-semibold text-slate-600">{item.label}</span></div>
                            <div className="text-right"><span className="text-[11px] font-black text-slate-900">{item.count}</span><span className="text-[8.5px] font-semibold text-slate-400 ml-1">({item.pct})</span></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-1.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">TOP DATA SYNC (TODAY)</h3>
                      <button className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">View all activity →</button>
                    </div>
                    {[{ color:'#16A34A', label:'Invoices Sync', val:'766 records' }, { color:'#2563EB', label:'Driver Logs Sync', val:'312 records' }, { color:'#9333EA', label:'Vehicle Data Sync', val:'128 records' }, { color:'#F59E0B', label:'Payments Sync', val:'62 records' }].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span><span className="text-[10px] font-semibold text-slate-700">{item.label}</span></div>
                        <span className="text-[10px] font-bold text-slate-900">{item.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-1.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">FAILED SYNC (TODAY)</h3>
                      <button className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">View error log →</button>
                    </div>
                    {[{ name:'MYOB Accounting', reason:'Failed to sync 5 invoices', time:'08:45 AM' }, { name:'NHVR EWD', reason:'Authentication token expired', time:'07:20 AM' }, { name:'SMS Service (Twilio)', reason:'Failed to send 3 messages', time:'06:10 AM' }].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 py-1.5 border-b border-slate-50 last:border-0">
                        <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5"><AlertTriangle size={10} /></div>
                        <div className="flex-1 min-w-0"><div className="text-[10px] font-extrabold text-slate-900">{item.name}</div><div className="text-[9px] font-medium text-slate-500 leading-tight">{item.reason}</div></div>
                        <span className="text-[9px] font-semibold text-slate-400 whitespace-nowrap">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Other tab panels */}
          {integrationsTab === 'Connected Integrations' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <Link2 size={32} className="text-blue-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Connected Integrations</h3>
              <p className="text-xs text-slate-400 mt-1">Manage all 12 active connected integrations.</p>
              <button onClick={() => setIntegrationsTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {integrationsTab === 'Available Integrations' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <Plus size={32} className="text-emerald-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Available Integrations</h3>
              <p className="text-xs text-slate-400 mt-1">Browse and connect new third-party integrations.</p>
              <button onClick={() => setIntegrationsTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {integrationsTab === 'API & Webhooks' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <Server size={32} className="text-purple-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">API & Webhooks</h3>
              <p className="text-xs text-slate-400 mt-1">Configure API keys and webhook endpoints.</p>
              <button onClick={() => setIntegrationsTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {integrationsTab === 'Data Sync' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <Database size={32} className="text-emerald-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Data Sync</h3>
              <p className="text-xs text-slate-400 mt-1">Monitor and manage data synchronisation across all integrations.</p>
              <button onClick={() => setIntegrationsTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {integrationsTab === 'Integration Logs' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs text-left space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <FileText size={16} className="text-[#2563EB]" /> System Integration Audit Logs
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time log events, webhooks, and sync status for all third-party connectors.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => triggerToast('Logs refreshed!')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer">
                    <RefreshCw size={12} /> Refresh Logs
                  </button>
                  <button onClick={() => setIntegrationsTab('Overview')} className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer">
                    ← Back to Overview
                  </button>
                </div>
              </div>

              {/* LOGS TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-extrabold text-[#1E1B4B] bg-slate-50/50">
                      <th className="py-2.5 px-3 whitespace-nowrap">Timestamp</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Integration</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Event Type</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                      <th className="py-2.5 px-3">Message / Payload Details</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {[
                      { time: '30 May 2026 10:16 AM', name: 'Xero Accounting', event: 'Invoice.Sync', status: 'SUCCESS', statusBg: 'bg-emerald-100 text-emerald-700', details: 'Synced 24 sales invoices successfully', lat: '142ms' },
                      { time: '30 May 2026 10:15 AM', name: 'SendGrid Email', event: 'Email.Dispatch', status: 'SYNCING', statusBg: 'bg-amber-100 text-amber-700', details: 'Dispatching 18 POD notifications', lat: '310ms' },
                      { time: '30 May 2026 10:12 AM', name: 'Samsara Telematics', event: 'GPS.Telemetry', status: 'SUCCESS', statusBg: 'bg-emerald-100 text-emerald-700', details: 'Updated 45 vehicle GPS locations', lat: '88ms' },
                      { time: '30 May 2026 08:45 AM', name: 'MYOB Accounting', event: 'Customer.Sync', status: 'FAILED', statusBg: 'bg-rose-100 text-rose-700', details: 'OAuth token expired for MYOB API connection', lat: '1205ms' },
                      { time: '30 May 2026 07:20 AM', name: 'NHVR EWD', event: 'Driver.WorkDiary', status: 'FAILED', statusBg: 'bg-rose-100 text-rose-700', details: 'HTTP 401 Unauthorized - Re-authentication required', lat: '890ms' },
                      { time: '30 May 2026 06:10 AM', name: 'SMS Service (Twilio)', event: 'SMS.SendAlert', status: 'WARNING', statusBg: 'bg-amber-100 text-amber-700', details: 'Failed to send 3 SMS (invalid recipient phone numbers)', lat: '420ms' },
                    ].map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 text-[11px] font-semibold text-slate-500 whitespace-nowrap">{log.time}</td>
                        <td className="py-2.5 px-3 font-extrabold text-slate-900 whitespace-nowrap">{log.name}</td>
                        <td className="py-2.5 px-3 text-[11px] font-mono text-slate-600 whitespace-nowrap">{log.event}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${log.statusBg}`}>{log.status}</span>
                        </td>
                        <td className="py-2.5 px-3 text-[11px] font-medium text-slate-600">{log.details}</td>
                        <td className="py-2.5 px-3 text-[11px] font-mono text-slate-400 text-right whitespace-nowrap">{log.lat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {integrationsTab === 'Settings' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <Settings size={32} className="text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Integration Settings</h3>
              <p className="text-xs text-slate-400 mt-1">Configure global sync settings, retry policies and alerts.</p>
              <button onClick={() => setIntegrationsTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}

          {/* DEVELOPER NOTES FOOTER */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 shadow-2xs text-left">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-5 rounded bg-[#2563EB] text-white font-mono text-[10px] font-bold flex items-center justify-center">&lt;/&gt;</div>
              <h3 className="text-xs font-black text-blue-950 uppercase tracking-wider">DEVELOPER NOTES – INTEGRATIONS</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              {[
                { title:'1. PURPOSE', items:['Manage third-party integrations.','Monitor sync status and data flow.','Ensure secure and reliable connections.'] },
                { title:'2. KEY FEATURES', items:['Connect, configure and test integrations.','Real-time sync status and health-monitoring.','Auto-sync scheduling and manual sync.','Error handling and retry mechanisms.'] },
                { title:'3. CATEGORIES', items:['Accounting & Finance.','GPS / Telematics.','Compliance & EWD.','Payments.','Communication.'] },
                { title:'4. DATA & SYNC', items:['Two-way or one-way sync.','Field mapping and data validation.','Data sync to reduce API usage.','Sync logs and history.'] },
                { title:'5. SECURITY & ACCESS', items:['Secure OAuth2 authentication.','Encrypted data transmission.','Role-based integration management.','Audit log for all integration changes.'] },
                { title:'6. DATA SOURCES', items:['External system APIs.','Webhooks and real-time events.','Manual data import/export.','System configuration settings.'] },
              ].map((col, i) => (
                <div key={i}>
                  <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">{col.title}</h4>
                  <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">{col.items.map((item, j) => <li key={j}>• {item}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-blue-200/60 flex items-center justify-between text-[8.5px] text-slate-500 font-semibold">
              <div className="flex items-center gap-1.5">
                <RefreshCw size={10} className="text-[#2563EB] animate-spin-slow" />
                <span>All times shown in your local time (AEST) • Data auto-refreshes every 5 minutes</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
         VIEW 7: 13.7 NOTIFICATIONS & COMMUNICATION SETTINGS (Screenshot 2 Exact Match)
         ========================================================================= */}
      {currentView === 'notifications' && (
        <div className="space-y-4 text-left">
          {/* HEADER & ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">13.7 Notifications & Communication Settings</h1>
                <div className="w-5 h-5 rounded-md border border-amber-200 bg-amber-50 text-amber-500 flex items-center justify-center cursor-pointer hover:bg-amber-100 transition-colors">
                  <Star size={11} />
                </div>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">Configure notification channels, templates and communication preferences.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
              <button 
                onClick={handleRefreshNotifications} 
                disabled={isRefreshingNotifications}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <RefreshCw size={13} className={`text-slate-500 ${isRefreshingNotifications ? 'animate-spin' : ''}`} /> 
                {isRefreshingNotifications ? 'Refreshing...' : 'Refresh'}
              </button>

              <button 
                onClick={() => setIsTestNotificationModalOpen(true)} 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              >
                <Send size={13} className="text-slate-500" /> Test Notifications
              </button>

              <button 
                onClick={handleSaveNotifications} 
                disabled={isSavingNotifications}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSavingNotifications ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />} 
                {isSavingNotifications ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* SUB TABS */}
          <div className="flex items-center gap-0 border-b border-slate-200/80 overflow-x-auto pt-1">
            {['Overview', 'Notification Channels', 'Templates', 'Notification Rules', 'Recipient Groups', 'Communication Preferences', 'History & Logs'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setNotificationsTab(tab)}
                className={`py-2 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 focus:outline-none focus:ring-0 outline-none cursor-pointer ${
                  notificationsTab === tab ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ===== TAB CONTENT ===== */}
          {notificationsTab === 'Overview' && (
            <>
              {/* 6 METRIC CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { icon: <Mail size={16} />, bg: 'bg-[#DBEAFE] text-[#2563EB]', border: 'hover:border-blue-200', label: 'EMAILS SENT (THIS MONTH)', value: '24,680', sub: '↑ 18.5%', subColor: 'text-emerald-600', subText: 'vs Last Month', link: 'View email report →', onClick: () => triggerToast('Viewing email report...') },
                  { icon: <MessageSquare size={16} />, bg: 'bg-[#F3E8FF] text-[#9333EA]', border: 'hover:border-purple-200', label: 'SMS SENT (THIS MONTH)', value: '8,954', sub: '↑ 22.4%', subColor: 'text-emerald-600', subText: 'vs Last Month', link: 'View SMS report →', onClick: () => triggerToast('Viewing SMS report...') },
                  { icon: <Bell size={16} />, bg: 'bg-amber-100 text-amber-600', border: 'hover:border-amber-200', label: 'PUSH NOTIFICATIONS', value: '5,612', sub: '↑ 15.3%', subColor: 'text-emerald-600', subText: 'vs Last Month', link: 'View push report →', onClick: () => triggerToast('Viewing push report...') },
                  { icon: <Send size={16} />, bg: 'bg-[#EEF2FF] text-[#4F46E5]', border: 'hover:border-indigo-200', label: 'IN-APP MESSAGES', value: '3,245', sub: '↑ 12.1%', subColor: 'text-emerald-600', subText: 'vs Last Month', link: 'View in-app report →', onClick: () => triggerToast('Viewing in-app report...') },
                  { icon: <Users size={16} />, bg: 'bg-[#DBEAFE] text-[#2563EB]', border: 'hover:border-blue-200', label: 'ACTIVE RECIPIENT GROUPS', value: '18', link: 'View groups →', onClick: () => setNotificationsTab('Recipient Groups') },
                  { icon: <AlertTriangle size={16} />, bg: 'bg-rose-100 text-rose-600', border: 'hover:border-rose-200', label: 'FAILED DELIVERIES (TODAY)', value: '23', valueColor: 'text-rose-600', sub: '↓ 8.0%', subColor: 'text-rose-600', subText: 'vs Yesterday', link: 'View error log →', onClick: () => setNotificationsTab('History & Logs') },
                ].map((card, i) => (
                  <div key={i} className={`bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between ${card.border} transition-all text-left`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-8 h-8 rounded-xl ${card.bg} flex items-center justify-center shrink-0 shadow-3xs mt-0.5`}>{card.icon}</div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">{card.label}</span>
                        <span className={`text-xl font-black block mt-1 leading-none ${card.valueColor || 'text-slate-900'}`}>{card.value}</span>
                        {card.sub && <p className={`text-[9px] font-extrabold leading-none mt-1 ${card.subColor}`}>{card.sub} <span className="font-semibold text-slate-400">{card.subText}</span></p>}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-50 flex justify-end mt-2">
                      <button onClick={card.onClick} className="text-[9px] font-bold text-[#2563EB] hover:underline cursor-pointer">{card.link}</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* SEARCH & FILTER ROW */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search by name or keyword..." className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-300" />
                </div>
                <select className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white focus:outline-none cursor-pointer">
                  <option>All Channels</option><option>Email</option><option>SMS</option><option>Push Notifications</option><option>In-App Messages</option><option>WhatsApp</option><option>Webhooks</option>
                </select>
                <select className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white focus:outline-none cursor-pointer">
                  <option>All Status</option><option>Active</option><option>Inactive</option>
                </select>
                <select className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white focus:outline-none cursor-pointer">
                  <option>All Recipient Groups</option><option>Drivers</option><option>Customers</option><option>Dispatchers</option><option>Admins</option>
                </select>
                <select className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white focus:outline-none cursor-pointer">
                  <option>All Priorities</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
                </select>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"><Filter size={12} /> Filters</button>
                <button onClick={() => triggerToast('Refreshing...')} className="p-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"><RefreshCw size={13} className="text-slate-500" /></button>
              </div>

              {/* MAIN 2-COLUMN GRID */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5 items-start">
                
                {/* LEFT: NOTIFICATION CHANNELS + RECENT ACTIVITY (8 cols) */}
                <div className="xl:col-span-8 space-y-3.5">
                  {/* NOTIFICATION CHANNELS TABLE */}
                  <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-2.5 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">NOTIFICATION CHANNELS</h3>
                      <button onClick={() => triggerToast('Managing channels...')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">View all channels →</button>
                    </div>
                    <div className="w-full overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[640px]">
                        <thead>
                          <tr className="border-b border-slate-200 text-[10px] font-extrabold text-[#1E1B4B] bg-slate-50/50">
                            <th className="py-2 px-2 whitespace-nowrap">Channel</th>
                            <th className="py-2 px-2">Description</th>
                            <th className="py-2 px-2 whitespace-nowrap">Status</th>
                            <th className="py-2 px-2 whitespace-nowrap">Default</th>
                            <th className="py-2 px-2 whitespace-nowrap">Last Tested</th>
                            <th className="py-2 px-2 whitespace-nowrap">Success Rate</th>
                            <th className="py-2 px-1.5 text-right whitespace-nowrap">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {[
                            { id:1, name:'Email', desc:'Send email notifications and alerts', status:'Active', default:'Yes', last:'30 May 2025 09:15 AM', rate:'98.2%', pct:98, icon:<Mail size={13}/>, color:'bg-blue-100 text-blue-600' },
                            { id:2, name:'SMS', desc:'Send SMS text messages', status:'Active', default:'Yes', last:'30 May 2025 09:12 AM', rate:'96.4%', pct:96, icon:<MessageSquare size={13}/>, color:'bg-purple-100 text-purple-600' },
                            { id:3, name:'Push Notifications', desc:'Send push notifications to mobile apps', status:'Active', default:'Yes', last:'30 May 2025 09:10 AM', rate:'97.1%', pct:97, icon:<Bell size={13}/>, color:'bg-amber-100 text-amber-600' },
                            { id:4, name:'In-App Messages', desc:'Send in-app messages and alerts', status:'Active', default:'Yes', last:'30 May 2025 09:08 AM', rate:'100%', pct:100, icon:<Send size={13}/>, color:'bg-indigo-100 text-indigo-600' },
                            { id:5, name:'Voice Calls', desc:'Automated voice call notifications', status:'Inactive', default:'No', last:'-', rate:'-', pct:0, icon:<Phone size={13}/>, color:'bg-slate-100 text-slate-500' },
                            { id:6, name:'WhatsApp Business', desc:'Send WhatsApp messages', status:'Active', default:'No', last:'30 May 2025 09:05 AM', rate:'94.3%', pct:94, icon:<MessageSquare size={13}/>, color:'bg-emerald-100 text-emerald-600' },
                            { id:7, name:'Fax', desc:'Send fax notifications', status:'Inactive', default:'No', last:'-', rate:'-', pct:0, icon:<FileText size={13}/>, color:'bg-slate-100 text-slate-500' },
                            { id:8, name:'Webhooks', desc:'Send webhook events to external systems', status:'Active', default:'No', last:'30 May 2025 09:02 AM', rate:'99.1%', pct:99, icon:<Plug size={13}/>, color:'bg-teal-100 text-teal-600' },
                          ].map((ch) => (
                            <tr key={ch.id} className="hover:bg-blue-50/30 transition-colors">
                              <td className="py-2 px-2 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div className={`w-6 h-6 rounded-md ${ch.color} flex items-center justify-center shrink-0`}>{ch.icon}</div>
                                  <span className="text-[11px] font-extrabold text-slate-900">{ch.name}</span>
                                </div>
                              </td>
                              <td className="py-2 px-2"><span className="text-[9.5px] font-medium text-slate-500 leading-tight block">{ch.desc}</span></td>
                              <td className="py-2 px-2 whitespace-nowrap">
                                <span className={`px-1.5 py-0.5 rounded-md text-[8.5px] font-extrabold ${ch.status === 'Active' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-slate-100 text-slate-500'}`}>{ch.status}</span>
                              </td>
                              <td className="py-2 px-2 whitespace-nowrap">
                                <span className={`text-[9.5px] font-bold ${ch.default === 'Yes' ? 'text-emerald-600' : 'text-slate-400'}`}>{ch.default}</span>
                              </td>
                              <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9px] font-semibold text-slate-500">{ch.last}</span></td>
                              <td className="py-2 px-2 whitespace-nowrap">
                                {ch.rate !== '-' ? (
                                  <div className="flex items-center gap-2 min-w-[90px]">
                                    <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${ch.pct}%` }}></div>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-700">{ch.rate}</span>
                                  </div>
                                ) : <span className="text-[9px] font-semibold text-slate-400">-</span>}
                              </td>
                              <td className="py-2 px-1.5 text-right whitespace-nowrap">
                                <button onClick={() => triggerToast(`Configuring ${ch.name}...`)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-900 cursor-pointer"><MoreHorizontal size={13} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="pt-2 border-t border-slate-100 text-[10.5px] font-semibold text-slate-500">
                      Showing 1 to 8 of 8 channels
                    </div>
                  </div>

                  {/* RECENT NOTIFICATION ACTIVITY */}
                  <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">RECENT NOTIFICATION ACTIVITY</h3>
                      <button onClick={() => setNotificationsTab('History & Logs')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">View all activity →</button>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { icon: <Mail size={12}/>, title: 'Invoice INV-1058 created', channel: 'Email', channelBg: 'bg-blue-100 text-blue-700', recipient: 'Sent to 12 recipients', time: '30 May 2025 09:15 AM', status: 'Delivered', statusColor: 'text-emerald-600' },
                        { icon: <MessageSquare size={12}/>, title: 'Load LD-3921 arrived at pickup', channel: 'SMS', channelBg: 'bg-purple-100 text-purple-700', recipient: 'Sent to 1 driver', time: '30 May 2025 09:12 AM', status: 'Delivered', statusColor: 'text-emerald-600' },
                        { icon: <Bell size={12}/>, title: 'Load LD-3918 dispatched', channel: 'Push', channelBg: 'bg-amber-100 text-amber-700', recipient: 'Sent to 2 recipients', time: '30 May 2025 09:10 AM', status: 'Delivered', statusColor: 'text-emerald-600' },
                        { icon: <Send size={12}/>, title: 'Safety Check - Daily Reminder', channel: 'In-App', channelBg: 'bg-indigo-100 text-indigo-700', recipient: 'Sent to 25 users', time: '30 May 2025 09:08 AM', status: 'Delivered', statusColor: 'text-emerald-600' },
                        { icon: <AlertTriangle size={12}/>, title: 'Payment failed for INV-1045', channel: 'Email', channelBg: 'bg-blue-100 text-blue-700', recipient: 'Sent to 1 recipient', time: '30 May 2025 08:45 AM', status: 'Failed', statusColor: 'text-rose-600' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 rounded-lg border-b border-slate-50 last:border-0 transition-colors">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div className={`w-5 h-5 rounded-md ${item.channelBg} flex items-center justify-center shrink-0 mt-0.5`}>{item.icon}</div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-extrabold text-slate-900 truncate">{item.title}</span>
                                <span className={`px-1.5 py-0.2 rounded text-[8px] font-extrabold ${item.channelBg}`}>{item.channel}</span>
                              </div>
                              <span className="text-[9px] font-medium text-slate-400 block mt-0.5">{item.recipient}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[9px] font-semibold text-slate-500 block">{item.time}</span>
                            <span className={`text-[9px] font-black ${item.statusColor} block mt-0.5`}>{item.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: NOTIFICATION SUMMARY + QUICK SETTINGS + TOP RULES (4 cols) */}
                <div className="xl:col-span-4 space-y-3.5">
                  {/* NOTIFICATION SUMMARY */}
                  <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">NOTIFICATION SUMMARY</h3>
                      <button onClick={() => triggerToast('Viewing full analytics...')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">View full analytics →</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-[85px] h-[85px] flex-shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="28" fill="none" stroke="#E2E8F0" strokeWidth="13" />
                          <circle cx="40" cy="40" r="28" fill="none" stroke="#2563EB" strokeWidth="13" strokeDasharray="175.9" strokeDashoffset="73.7" />
                          <circle cx="40" cy="40" r="28" fill="none" stroke="#9333EA" strokeWidth="13" strokeDasharray="175.9" strokeDashoffset="138.9" />
                          <circle cx="40" cy="40" r="28" fill="none" stroke="#F59E0B" strokeWidth="13" strokeDasharray="175.9" strokeDashoffset="162.1" />
                          <circle cx="40" cy="40" r="28" fill="none" stroke="#4F46E5" strokeWidth="13" strokeDasharray="175.9" strokeDashoffset="175.5" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[12px] font-black text-slate-900 leading-none">42,491</span>
                          <span className="text-[7.5px] font-bold text-slate-400">Total Sent</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {[
                          { color:'#2563EB', label:'Email', count:'24,680', pct:'58.1%' },
                          { color:'#9333EA', label:'SMS', count:'8,954', pct:'21.1%' },
                          { color:'#F59E0B', label:'Push', count:'5,612', pct:'13.2%' },
                          { color:'#4F46E5', label:'In-App', count:'3,245', pct:'7.6%' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span><span className="text-[9px] font-semibold text-slate-600">{item.label}</span></div>
                            <div className="text-right"><span className="text-[10.5px] font-black text-slate-900">{item.count}</span><span className="text-[8px] font-semibold text-slate-400 ml-1">({item.pct})</span></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* QUICK SETTINGS */}
                  <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">QUICK SETTINGS</h3>
                      <button onClick={() => triggerToast('Editing quick settings...')} className="text-[10px] font-bold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer">
                        <Edit size={10}/> Edit Settings
                      </button>
                    </div>
                    <div className="space-y-1.5 text-[10px]">
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold"><Clock size={12} className="text-slate-400"/> Quiet Hours</div>
                        <span className="font-bold text-slate-900">10:00 PM - 06:00 AM</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold"><Globe size={12} className="text-slate-400"/> Time Zone</div>
                        <span className="font-bold text-slate-900">(AEST) Australia/Sydney</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold"><Bell size={12} className="text-slate-400"/> Weekend Notifications</div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black">On</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold"><AlertTriangle size={12} className="text-slate-400"/> System Alerts (Critical)</div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black">On</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold"><Mail size={12} className="text-slate-400"/> Marketing & Updates</div>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-black">Off</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold"><Calendar size={12} className="text-slate-400"/> Digest Summary (Daily)</div>
                        <span className="font-bold text-slate-900">07:00 AM</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold"><Globe size={12} className="text-slate-400"/> Language</div>
                        <span className="font-bold text-slate-900">English (Australia) ∨</span>
                      </div>
                    </div>
                  </div>

                  {/* TOP NOTIFICATION RULES */}
                  <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-1.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">TOP NOTIFICATION RULES</h3>
                      <button onClick={() => setNotificationsTab('Notification Rules')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">View all rules →</button>
                    </div>
                    {[
                      { icon: <Truck size={12}/>, label: 'Load Status Updates', val: '16,842 sent' },
                      { icon: <FileText size={12}/>, label: 'Invoice & Payment Notifications', val: '9,752 sent' },
                      { icon: <Users size={12}/>, label: 'Driver Alerts & Reminders', val: '6,321 sent' },
                      { icon: <ShieldCheck size={12}/>, label: 'Compliance & Document Expiry', val: '4,112 sent' },
                      { icon: <Zap size={12}/>, label: 'Maintenance & Service Reminders', val: '3,464 sent' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-2"><span className="text-slate-400">{item.icon}</span><span className="text-[10px] font-bold text-slate-800">{item.label}</span></div>
                        <span className="text-[9.5px] font-extrabold text-slate-900">{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* OTHER SUB-TAB PANELS */}
          {notificationsTab === 'Notification Channels' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <Mail size={32} className="text-blue-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Notification Channels</h3>
              <p className="text-xs text-slate-400 mt-1">Configure email, SMS, push notifications, voice, WhatsApp and webhooks.</p>
              <button onClick={() => setNotificationsTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {notificationsTab === 'Templates' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <FileText size={32} className="text-purple-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Notification Templates</h3>
              <p className="text-xs text-slate-400 mt-1">Customise message templates, dynamic variables and email themes.</p>
              <button onClick={() => setNotificationsTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {notificationsTab === 'Notification Rules' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <Sliders size={32} className="text-amber-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Notification Rules</h3>
              <p className="text-xs text-slate-400 mt-1">Setup automated triggers, conditions, and recipient schedules.</p>
              <button onClick={() => setNotificationsTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {notificationsTab === 'Recipient Groups' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <Users size={32} className="text-indigo-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Recipient Groups</h3>
              <p className="text-xs text-slate-400 mt-1">Manage driver, dispatcher, customer, and admin distribution groups.</p>
              <button onClick={() => setNotificationsTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {notificationsTab === 'Communication Preferences' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <Globe size={32} className="text-emerald-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Communication Preferences</h3>
              <p className="text-xs text-slate-400 mt-1">Configure company quiet hours, frequency caps, and default languages.</p>
              <button onClick={() => setNotificationsTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {notificationsTab === 'History & Logs' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <Clock size={32} className="text-rose-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Notification History & Logs</h3>
              <p className="text-xs text-slate-400 mt-1">Audit log of all sent, delivered, and failed notifications.</p>
              <button onClick={() => setNotificationsTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}

          {/* DEVELOPER NOTES FOOTER */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 shadow-2xs text-left">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-5 rounded bg-[#2563EB] text-white font-mono text-[10px] font-bold flex items-center justify-center">&lt;/&gt;</div>
              <h3 className="text-xs font-black text-blue-950 uppercase tracking-wider">DEVELOPER NOTES – NOTIFICATIONS & COMMUNICATION SETTINGS</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { title:'1. PURPOSE', items:['Central hub for all notification settings.','Configure channels, templates and rules.','Improve communication and user awareness.'] },
                { title:'2. KEY FEATURES', items:['Multi-channel notification support.','Custom templates and variables.','Rule-based notifications.','Recipient groups and preferences.'] },
                { title:'3. CHANNELS', items:['Email, SMS, Push, In-App, Voice, WhatsApp.','Configure channels, templates and rules.','Track delivery status and success rate.'] },
                { title:'4. NOTIFICATION RULES', items:['Event-based triggers.','Conditions, recipients and schedules.','Escalation and reminder rules.'] },
                { title:'5. DATA & SECURITY', items:['Secure message delivery.','Audit logs for all notifications.','Opt-in/out and quiet hours support.'] },
              ].map((col, i) => (
                <div key={i}>
                  <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">{col.title}</h4>
                  <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">{col.items.map((item, j) => <li key={j}>• {item}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-blue-200/60 flex items-center justify-between text-[8.5px] text-slate-500 font-semibold">
              <div className="flex items-center gap-1.5">
                <RefreshCw size={10} className="text-[#2563EB] animate-spin-slow" />
                <span>All times shown in your local time (AEST) • Data auto-refreshes every 5 minutes</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
         VIEW 8: 13.8 SECURITY & AUDIT LOGS (Screenshot 2 Exact Match)
         ========================================================================= */}
      {currentView === 'security-audit-logs' && (
        <div className="space-y-4 text-left">
          {/* HEADER & ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">13.8 Security & Audit Logs</h1>
                <div className="w-5 h-5 rounded-md border border-amber-200 bg-amber-50 text-amber-500 flex items-center justify-center cursor-pointer hover:bg-amber-100 transition-colors">
                  <Star size={11} />
                </div>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">Monitor system activity, review audit logs and manage security settings.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
              <button 
                onClick={handleRefreshSecurityLogs} 
                disabled={isRefreshingSecurityLogs}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <RefreshCw size={13} className={`text-slate-500 ${isRefreshingSecurityLogs ? 'animate-spin' : ''}`} /> 
                {isRefreshingSecurityLogs ? 'Refreshing...' : 'Refresh'}
              </button>

              <button 
                onClick={handleExportSecurityLogs} 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              >
                <Download size={13} className="text-slate-500" /> Export Logs
              </button>

              <button 
                onClick={() => setIsSecuritySettingsModalOpen(true)} 
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Lock size={14} /> Security Settings
              </button>
            </div>
          </div>

          {/* SUB TABS */}
          <div className="flex items-center gap-0 border-b border-slate-200/80 overflow-x-auto pt-1">
            {['Overview', 'Audit Logs', 'Login History', 'Security Events', 'Permission Changes', 'Data Access', 'Exports & Downloads', 'Blocked Actions', 'Settings'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setSecurityLogsTab(tab)}
                className={`py-2 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 focus:outline-none focus:ring-0 outline-none cursor-pointer ${
                  securityLogsTab === tab ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ===== TAB CONTENT ===== */}
          {securityLogsTab === 'Overview' && (
            <>
              {/* 6 METRIC CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { icon: <Shield size={16} />, bg: 'bg-[#DBEAFE] text-[#2563EB]', border: 'hover:border-blue-200', label: 'TOTAL EVENTS (THIS MONTH)', value: '24,680', sub: '↑ 18.6%', subColor: 'text-emerald-600', subText: 'vs Last Month', link: 'View audit logs →', onClick: () => setSecurityLogsTab('Audit Logs') },
                  { icon: <UserCheck size={16} />, bg: 'bg-[#DCFCE7] text-[#16A34A]', border: 'hover:border-emerald-200', label: 'LOGIN EVENTS (THIS MONTH)', value: '3,245', sub: '↑ 12.4%', subColor: 'text-emerald-600', subText: 'vs Last Month', link: 'View login history →', onClick: () => setSecurityLogsTab('Login History') },
                  { icon: <AlertTriangle size={16} />, bg: 'bg-rose-100 text-rose-600', border: 'hover:border-rose-200', label: 'SECURITY EVENTS (THIS MONTH)', value: '156', valueColor: 'text-rose-600', sub: '↓ 8.7%', subColor: 'text-rose-600', subText: 'vs Last Month', link: 'View security events →', onClick: () => setSecurityLogsTab('Security Events') },
                  { icon: <Lock size={16} />, bg: 'bg-[#DBEAFE] text-[#2563EB]', border: 'hover:border-blue-200', label: 'PERMISSION CHANGES', value: '89', sub: '↑ 15.3%', subColor: 'text-emerald-600', subText: 'vs Last Month', link: 'View permission changes →', onClick: () => setSecurityLogsTab('Permission Changes') },
                  { icon: <Download size={16} />, bg: 'bg-[#DBEAFE] text-[#2563EB]', border: 'hover:border-blue-200', label: 'DATA EXPORTS (THIS MONTH)', value: '42', sub: '↑ 9.8%', subColor: 'text-emerald-600', subText: 'vs Last Month', link: 'View exports →', onClick: () => setSecurityLogsTab('Exports & Downloads') },
                  { icon: <AlertCircle size={16} />, bg: 'bg-rose-100 text-rose-600', border: 'hover:border-rose-200', label: 'BLOCKED ACTIONS (THIS MONTH)', value: '27', valueColor: 'text-rose-600', sub: '↓ 12.9%', subColor: 'text-rose-600', subText: 'vs Last Month', link: 'View blocked actions →', onClick: () => setSecurityLogsTab('Blocked Actions') },
                ].map((card, i) => (
                  <div key={i} className={`bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between ${card.border} transition-all text-left`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-8 h-8 rounded-xl ${card.bg} flex items-center justify-center shrink-0 shadow-3xs mt-0.5`}>{card.icon}</div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">{card.label}</span>
                        <span className={`text-xl font-black block mt-1 leading-none ${card.valueColor || 'text-slate-900'}`}>{card.value}</span>
                        {card.sub && <p className={`text-[9px] font-extrabold leading-none mt-1 ${card.subColor}`}>{card.sub} <span className="font-semibold text-slate-400">{card.subText}</span></p>}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-50 flex justify-end mt-2">
                      <button onClick={card.onClick} className="text-[9px] font-bold text-[#2563EB] hover:underline cursor-pointer">{card.link}</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* SEARCH & FILTER ROW */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search by user, action, module or details..." className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-300" />
                </div>
                <select className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white focus:outline-none cursor-pointer">
                  <option>All Event Types</option><option>Login</option><option>Data Update</option><option>Permission Change</option><option>Data Export</option><option>Security Event</option><option>Trailer Swap</option><option>Data Delete</option><option>Blocked Action</option>
                </select>
                <select className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white focus:outline-none cursor-pointer">
                  <option>All Users</option><option>Sarah Mitchell</option><option>John Davis</option><option>Ravi Wilson</option><option>Amit Handa</option><option>Lisa Patel</option><option>Brian Taylor</option><option>Michael Kumar</option><option>Shane Cooper</option>
                </select>
                <select className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white focus:outline-none cursor-pointer">
                  <option>All Modules</option><option>Authentication</option><option>Loads</option><option>Users & Roles</option><option>Reports</option><option>Vehicles</option><option>Expenses</option>
                </select>
                <select className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white focus:outline-none cursor-pointer">
                  <option>All Outcomes</option><option>Success</option><option>Failed</option><option>Blocked</option>
                </select>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"><Calendar size={12} /> Joined: All Time</button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"><Filter size={12} /> Filters</button>
                <button onClick={handleRefreshSecurityLogs} className="p-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"><RefreshCw size={13} className="text-slate-500" /></button>
              </div>

              {/* MAIN 2-COLUMN GRID */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5 items-start">
                
                {/* LEFT: RECENT AUDIT LOGS TABLE (8 cols) */}
                <div className="xl:col-span-8 bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-2.5 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">RECENT AUDIT LOGS</h3>
                    <button onClick={() => setSecurityLogsTab('Audit Logs')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">View all logs →</button>
                  </div>
                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-slate-200 text-[10px] font-extrabold text-[#1E1B4B] bg-slate-50/50">
                          <th className="py-2 px-2 whitespace-nowrap">Time</th>
                          <th className="py-2 px-2 whitespace-nowrap">User</th>
                          <th className="py-2 px-2 whitespace-nowrap">Event Type</th>
                          <th className="py-2 px-2 whitespace-nowrap">Action</th>
                          <th className="py-2 px-2 whitespace-nowrap">Module</th>
                          <th className="py-2 px-2">Details</th>
                          <th className="py-2 px-2 whitespace-nowrap">IP Address</th>
                          <th className="py-2 px-2 whitespace-nowrap">Outcome</th>
                          <th className="py-2 px-1.5 text-right whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { time:'30 May 2025 09:15 AM', name:'Sarah Mitchell', email:'sarah.mitchell@herologistics.com.au', avatar:'SM', bg:'bg-purple-600', type:'Login', typeBg:'bg-blue-100 text-blue-700', action:'User Logged In', module:'Authentication', details:'Login via Web', ip:'203.26.45.12', outcome:'Success', outcomeColor:'text-emerald-600' },
                          { time:'30 May 2025 09:12 AM', name:'John Davis', email:'john.davis@herologistics.com.au', avatar:'JD', bg:'bg-blue-600', type:'Data Update', typeBg:'bg-teal-100 text-teal-700', action:'Updated Load LD-3981', module:'Loads', details:'Changed status to Dispatched', ip:'203.26.45.18', outcome:'Success', outcomeColor:'text-emerald-600' },
                          { time:'30 May 2025 09:10 AM', name:'Ravi Wilson', email:'ravi.wilson@herologistics.com.au', avatar:'RW', bg:'bg-amber-600', type:'Permission Change', typeBg:'bg-purple-100 text-purple-700', action:'Updated role permissions', module:'Users & Roles', details:'Role: Dispatcher Permissions modified', ip:'203.26.45.21', outcome:'Success', outcomeColor:'text-emerald-600' },
                          { time:'30 May 2025 09:05 AM', name:'Amit Handa', email:'amit.handa@herologistics.com.au', avatar:'AH', bg:'bg-teal-600', type:'Data Export', typeBg:'bg-blue-100 text-blue-700', action:'Exported Invoice Report', module:'Reports', details:'Report: Invoices Format: PDF', ip:'203.26.45.12', outcome:'Success', outcomeColor:'text-emerald-600' },
                          { time:'30 May 2025 08:58 AM', name:'Lisa Patel', email:'lisa.patel@herologistics.com.au', avatar:'LP', bg:'bg-indigo-600', type:'Security Event', typeBg:'bg-rose-100 text-rose-700', action:'Failed Login Attempt', module:'Authentication', details:'Invalid password', ip:'203.26.45.99', outcome:'Failed', outcomeColor:'text-rose-600' },
                          { time:'30 May 2025 08:50 AM', name:'Brian Taylor', email:'brian.taylor@herologistics.com.au', avatar:'BT', bg:'bg-orange-600', type:'Trailer Swap', typeBg:'bg-amber-100 text-amber-700', action:'Trailer swapped', module:'Vehicles', details:'Trailer TR-1045 swapped from Truck TRK-12', ip:'203.26.45.18', outcome:'Success', outcomeColor:'text-emerald-600' },
                          { time:'30 May 2025 08:45 AM', name:'Michael Kumar', email:'michael.kumar@herologistics.com.au', avatar:'MK', bg:'bg-emerald-600', type:'Data Delete', typeBg:'bg-orange-100 text-orange-700', action:'Deleted Expense Record', module:'Expenses', details:'Expense ID: EXP-7781', ip:'203.26.45.21', outcome:'Success', outcomeColor:'text-emerald-600' },
                          { time:'30 May 2025 08:30 AM', name:'Shane Cooper', email:'shane.cooper@herologistics.com.au', avatar:'SC', bg:'bg-blue-600', type:'Blocked Action', typeBg:'bg-amber-100 text-amber-700', action:'Blocked Unauthorized Export', module:'Reports', details:'Attempted to export restricted data', ip:'203.26.45.77', outcome:'Blocked', outcomeColor:'text-amber-600' },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                            <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9px] font-semibold text-slate-500">{row.time}</span></td>
                            <td className="py-2 px-2 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <div className={`w-5 h-5 rounded-full ${row.bg} text-white font-black text-[8px] flex items-center justify-center shrink-0`}>{row.avatar}</div>
                                <div>
                                  <div className="text-[10px] font-extrabold text-slate-900 leading-tight whitespace-nowrap">{row.name}</div>
                                  <div className="text-[8px] font-medium text-slate-400 leading-tight whitespace-nowrap">{row.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className={`px-1.5 py-0.2 rounded text-[8.5px] font-extrabold ${row.typeBg}`}>{row.type}</span></td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9.5px] font-bold text-slate-800 whitespace-nowrap">{row.action}</span></td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9px] font-semibold text-slate-500 whitespace-nowrap">{row.module}</span></td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9px] font-medium text-slate-600 leading-tight whitespace-nowrap">{row.details}</span></td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className="text-[8.5px] font-mono text-slate-400">{row.ip}</span></td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className={`text-[9.5px] font-black ${row.outcomeColor}`}>{row.outcome}</span></td>
                            <td className="py-2 px-1.5 text-right whitespace-nowrap">
                              <button onClick={() => triggerToast(`Viewing details for event: ${row.action}...`)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-900 cursor-pointer"><MoreHorizontal size={13} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                    <span>Showing 1 to 8 of 24,680 events</span>
                    <div className="flex items-center gap-1">
                      <button className="px-2 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400 text-xs">|‹</button>
                      <button className="px-2 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400 text-xs">‹</button>
                      <button className="px-2.5 py-0.5 bg-[#2563EB] text-white font-bold rounded-md text-xs">1</button>
                      <button className="px-2.5 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">2</button>
                      <button className="px-2.5 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">3</button>
                      <button className="px-2.5 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">4</button>
                      <button className="px-2.5 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">5</button>
                      <button className="px-2 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">›</button>
                      <button className="px-2 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">›|</button>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: EVENTS DONUT + SECURITY OVERVIEW + TOP USERS (4 cols) */}
                <div className="xl:col-span-4 space-y-3.5">
                  {/* EVENTS BY TYPE DONUT */}
                  <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">EVENTS BY TYPE (THIS MONTH)</h3>
                      <button onClick={() => triggerToast('Viewing full analytics...')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">View full analytics →</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-[85px] h-[85px] flex-shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="28" fill="none" stroke="#E2E8F0" strokeWidth="13" />
                          <circle cx="40" cy="40" r="28" fill="none" stroke="#2563EB" strokeWidth="13" strokeDasharray="175.9" strokeDashoffset="152.6" />
                          <circle cx="40" cy="40" r="28" fill="none" stroke="#16A34A" strokeWidth="13" strokeDasharray="175.9" strokeDashoffset="90.4" />
                          <circle cx="40" cy="40" r="28" fill="none" stroke="#F59E0B" strokeWidth="13" strokeDasharray="175.9" strokeDashoffset="75.1" />
                          <circle cx="40" cy="40" r="28" fill="none" stroke="#9333EA" strokeWidth="13" strokeDasharray="175.9" strokeDashoffset="74.4" />
                          <circle cx="40" cy="40" r="28" fill="none" stroke="#EF4444" strokeWidth="13" strokeDasharray="175.9" strokeDashoffset="73.3" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[12px] font-black text-slate-900 leading-none">24,680</span>
                          <span className="text-[7.5px] font-bold text-slate-400">Total Events</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-1.5 text-[9px]">
                        {[
                          { color:'#2563EB', label:'Login Events', count:'3,245', pct:'13.2%' },
                          { color:'#16A34A', label:'Data Updates', count:'8,724', pct:'35.4%' },
                          { color:'#F59E0B', label:'Data Exports', count:'2,156', pct:'8.7%' },
                          { color:'#9333EA', label:'Permission Changes', count:'89', pct:'0.4%' },
                          { color:'#EF4444', label:'Security Events', count:'156', pct:'0.6%' },
                          { color:'#64748B', label:'Other Events', count:'10,280', pct:'41.7%' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span><span className="font-semibold text-slate-600">{item.label}</span></div>
                            <div className="text-right"><span className="font-black text-slate-900">{item.count}</span><span className="font-semibold text-slate-400 ml-1">({item.pct})</span></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SECURITY OVERVIEW */}
                  <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">SECURITY OVERVIEW</h3>
                      <button onClick={() => triggerToast('Viewing security report...')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">View security report →</button>
                    </div>
                    <div className="space-y-1.5 text-[10px]">
                      {[
                        { label:'Failed Login Attempts', count:'86', color:'text-rose-600', icon:<AlertTriangle size={12} className="text-rose-500"/> },
                        { label:'Blocked Actions', count:'27', color:'text-amber-600', icon:<CheckCircle2 size={12} className="text-amber-500"/> },
                        { label:'Suspicious Activities', count:'15', color:'text-amber-600', icon:<Shield size={12} className="text-amber-500"/> },
                        { label:'Unusual Access Locations', count:'8', color:'text-amber-600', icon:<Globe size={12} className="text-amber-500"/> },
                      ].map((sec, i) => (
                        <div key={i} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">{sec.icon} {sec.label}</div>
                          <span className={`font-black text-xs ${sec.color}`}>{sec.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TOP ACTIVE USERS */}
                  <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-1.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">TOP ACTIVE USERS (THIS MONTH)</h3>
                      <button onClick={() => setCurrentView('users-permissions')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">View all users →</button>
                    </div>
                    {[
                      { avatar:'SM', bg:'bg-purple-600', name:'Sarah Mitchell', val:'1,248 events' },
                      { avatar:'JD', bg:'bg-blue-600', name:'John Davis', val:'986 events' },
                      { avatar:'RW', bg:'bg-amber-600', name:'Ravi Wilson', val:'842 events' },
                      { avatar:'AH', bg:'bg-teal-600', name:'Amit Handa', val:'756 events' },
                      { avatar:'BT', bg:'bg-orange-600', name:'Brian Taylor', val:'688 events' },
                    ].map((user, i) => (
                      <div key={i} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full ${user.bg} text-white font-black text-[8px] flex items-center justify-center shrink-0`}>{user.avatar}</div>
                          <span className="text-[10px] font-bold text-slate-800">{user.name}</span>
                        </div>
                        <span className="text-[9.5px] font-extrabold text-slate-900">{user.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* OTHER SUB-TAB PANELS */}
          {securityLogsTab === 'Audit Logs' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <Shield size={32} className="text-blue-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">System Audit Logs</h3>
              <p className="text-xs text-slate-400 mt-1">Review all 24,680 system events and user actions.</p>
              <button onClick={() => setSecurityLogsTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {securityLogsTab === 'Login History' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <UserCheck size={32} className="text-emerald-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Login History</h3>
              <p className="text-xs text-slate-400 mt-1">Track user login timestamps, IP addresses, and authentication outcomes.</p>
              <button onClick={() => setSecurityLogsTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {securityLogsTab === 'Security Events' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <AlertTriangle size={32} className="text-rose-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Security Events</h3>
              <p className="text-xs text-slate-400 mt-1">Monitor failed logins, password resets, and suspicious activity alerts.</p>
              <button onClick={() => setSecurityLogsTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {securityLogsTab === 'Permission Changes' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <Lock size={32} className="text-purple-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Permission Changes</h3>
              <p className="text-xs text-slate-400 mt-1">Audit log of all role modifications and privilege escalations.</p>
              <button onClick={() => setSecurityLogsTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {securityLogsTab === 'Data Access' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <Database size={32} className="text-blue-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Data Access Logs</h3>
              <p className="text-xs text-slate-400 mt-1">Track database queries, customer data access, and API requests.</p>
              <button onClick={() => setSecurityLogsTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {securityLogsTab === 'Exports & Downloads' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <Download size={32} className="text-indigo-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Exports & Downloads</h3>
              <p className="text-xs text-slate-400 mt-1">Audit history of all CSV, PDF, and report downloads.</p>
              <button onClick={() => setSecurityLogsTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {securityLogsTab === 'Blocked Actions' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <AlertCircle size={32} className="text-rose-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Blocked Actions</h3>
              <p className="text-xs text-slate-400 mt-1">View all unauthorized requests blocked by security policies.</p>
              <button onClick={() => setSecurityLogsTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {securityLogsTab === 'Settings' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <Settings size={32} className="text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Security & Retention Settings</h3>
              <p className="text-xs text-slate-400 mt-1">Configure log retention periods, 2FA requirements, and IP whitelisting.</p>
              <button onClick={() => setSecurityLogsTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}

          {/* DEVELOPER NOTES FOOTER */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 shadow-2xs text-left">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-5 rounded bg-[#2563EB] text-white font-mono text-[10px] font-bold flex items-center justify-center">&lt;/&gt;</div>
              <h3 className="text-xs font-black text-blue-950 uppercase tracking-wider">DEVELOPER NOTES – SECURITY & AUDIT LOGS</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { title:'1. PURPOSE', items:['Track and monitor all critical system activities.','Ensure data security and user accountability.','Support compliance and audit requirements.'] },
                { title:'2. KEY FEATURES', items:['Comprehensive audit logging.','Real-time security event detection.','Permission change tracking.','Data export and access monitoring.'] },
                { title:'3. EVENT CATEGORIES', items:['Authentication & Login events.','Data Create, Update, Delete.','Permission changes & role updates.','Data exports & downloads.','Security events & blocked actions.'] },
                { title:'4. SECURITY & ACCESS', items:['Role-based access to logs.','Admins can view all logs.','Users can view limited logs.','Logs are tamper-proof.'] },
                { title:'5. DATA RETENTION', items:['Logs retained for minimum 12 months.','Configurable retention period.','Older logs archived securely.','Export logs for compliance.'] },
              ].map((col, i) => (
                <div key={i}>
                  <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">{col.title}</h4>
                  <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">{col.items.map((item, j) => <li key={j}>• {item}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-blue-200/60 flex items-center justify-between text-[8.5px] text-slate-500 font-semibold">
              <div className="flex items-center gap-1.5">
                <RefreshCw size={10} className="text-[#2563EB] animate-spin-slow" />
                <span>All times shown in your local time (AEST) • Data auto-refreshes every 5 minutes</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
         VIEW 9: 13.9 SUBSCRIPTION & BILLING (Screenshot 2 Exact Match)
         ========================================================================= */}
      {currentView === 'subscription-billing' && (
        <div className="space-y-4 text-left">
          {/* HEADER & ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">13.9 Subscription & Billing</h1>
                <div className="w-5 h-5 rounded-md border border-amber-200 bg-amber-50 text-amber-500 flex items-center justify-center cursor-pointer hover:bg-amber-100 transition-colors">
                  <Star size={11} />
                </div>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">Manage your subscription plan, add-ons, billing, invoices and payment methods.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
              <button 
                onClick={handleRefreshBilling} 
                disabled={isRefreshingBilling}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <RefreshCw size={13} className={`text-slate-500 ${isRefreshingBilling ? 'animate-spin' : ''}`} /> 
                {isRefreshingBilling ? 'Refreshing...' : 'Refresh'}
              </button>

              <button 
                onClick={handleDownloadStatement} 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              >
                <Download size={13} className="text-slate-500" /> Download Statement
              </button>

              <button 
                onClick={() => setIsManageSubscriptionModalOpen(true)} 
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Crown size={14} /> Manage Subscription
              </button>
            </div>
          </div>

          {/* SUB TABS */}
          <div className="flex items-center gap-0 border-b border-slate-200/80 overflow-x-auto pt-1">
            {['Overview', 'Plan & Usage', 'Add-ons', 'Invoices', 'Payment Methods', 'Billing History', 'Quotes & Orders'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setBillingTab(tab)}
                className={`py-2 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 focus:outline-none focus:ring-0 outline-none cursor-pointer ${
                  billingTab === tab ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ===== TAB CONTENT ===== */}
          {billingTab === 'Overview' && (
            <>
              {/* 6 METRIC CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { icon: <Crown size={16} />, bg: 'bg-purple-100 text-purple-600', border: 'hover:border-purple-200', label: 'CURRENT PLAN', value: 'Hero Pro', link: 'View plan details →', onClick: () => setBillingTab('Plan & Usage') },
                  { icon: <Calendar size={16} />, bg: 'bg-[#DCFCE7] text-[#16A34A]', border: 'hover:border-emerald-200', label: 'BILLING CYCLE', value: 'Monthly', subText: 'Next billing: 30 Jun 2025', link: 'Change billing cycle →', onClick: () => setIsManageSubscriptionModalOpen(true) },
                  { icon: <DollarSign size={16} />, bg: 'bg-[#DBEAFE] text-[#2563EB]', border: 'hover:border-blue-200', label: 'AMOUNT DUE', value: '$0.00', subText: 'Paid up to 30 Jun 2025', link: 'View invoices →', onClick: () => setBillingTab('Invoices') },
                  { icon: <Activity size={16} />, bg: 'bg-amber-100 text-amber-600', border: 'hover:border-amber-200', label: 'USAGE STATUS', value: '76%', subText: 'Overall usage this month', link: 'View usage →', onClick: () => setBillingTab('Plan & Usage') },
                  { icon: <Users size={16} />, bg: 'bg-teal-100 text-teal-600', border: 'hover:border-teal-200', label: 'ACTIVE USERS', value: '24 / 50', subText: 'Users in your plan', link: 'Manage users →', onClick: () => setCurrentView('users-permissions') },
                  { icon: <Clock size={16} />, bg: 'bg-rose-100 text-rose-600', border: 'hover:border-rose-200', label: 'DAYS LEFT IN CYCLE', value: '18 days', subText: 'Until 30 Jun 2025', link: 'View billing schedule →', onClick: () => setBillingTab('Billing History') },
                ].map((card, i) => (
                  <div key={i} className={`bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between ${card.border} transition-all text-left`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-8 h-8 rounded-xl ${card.bg} flex items-center justify-center shrink-0 shadow-3xs mt-0.5`}>{card.icon}</div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight block leading-none">{card.label}</span>
                        <span className="text-xl font-black text-slate-900 block mt-1 leading-none">{card.value}</span>
                        {card.subText && <p className="text-[9px] font-semibold text-slate-400 leading-none mt-1">{card.subText}</p>}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-50 flex justify-end mt-2">
                      <button onClick={card.onClick} className="text-[9px] font-bold text-[#2563EB] hover:underline cursor-pointer">{card.link}</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* SUBSCRIPTION OVERVIEW (LEFT) + BILLING SUMMARY (RIGHT) OUTER GRID */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5 items-stretch text-left">
                
                {/* LEFT CONTAINER (8 COLS): SUBSCRIPTION OVERVIEW CARD WITH 3 SUB-SECTIONS */}
                <div className="xl:col-span-8 bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3.5 flex flex-col justify-between">
                  <div className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    SUBSCRIPTION OVERVIEW
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch flex-1">
                    
                    {/* SUB-COL 1: YOUR PLAN */}
                    <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">Your Plan</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase">Active</span>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 mt-1">Hero Pro</h2>
                        <p className="text-[10px] text-slate-500 font-medium mt-1 leading-relaxed">
                          Designed for growing logistics businesses with advanced features and automation.
                        </p>
                        
                        <div className="space-y-1.5 mt-3 text-[10px] font-bold text-slate-700">
                          <div className="flex items-center gap-1.5 text-emerald-600">✓ <span className="text-slate-800">Up to 50 users</span></div>
                          <div className="flex items-center gap-1.5 text-emerald-600">✓ <span className="text-slate-800">Advanced reporting & analytics</span></div>
                          <div className="flex items-center gap-1.5 text-emerald-600">✓ <span className="text-slate-800">AI features (add-on)</span></div>
                          <div className="flex items-center gap-1.5 text-emerald-600">✓ <span className="text-slate-800">Priority support</span></div>
                        </div>
                      </div>

                      <button onClick={() => triggerToast('Viewing plan features...')} className="w-full py-1.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#2563EB] hover:bg-slate-100 cursor-pointer shadow-2xs mt-3">
                        View Plan Features
                      </button>
                    </div>

                    {/* SUB-COL 2: PLAN USAGE (THIS MONTH) */}
                    <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                          <span className="text-[9.5px] font-black text-slate-900 uppercase tracking-wider">PLAN USAGE (THIS MONTH)</span>
                          <button onClick={() => setBillingTab('Plan & Usage')} className="text-[9px] font-bold text-[#2563EB] hover:underline cursor-pointer">View full usage →</button>
                        </div>

                        {[
                          { label: 'Users', val: '24 / 50 (48%)', pct: 48 },
                          { label: 'Loads', val: '1,240 / 2,000 (62%)', pct: 62 },
                          { label: 'Storage', val: '152 GB / 200 GB (76%)', pct: 76 },
                          { label: 'API Calls', val: '76,542 / 100,000 (77%)', pct: 77 },
                          { label: 'AI Requests (Add-on)', val: '8,450 / 15,000 (56%)', pct: 56 },
                        ].map((item, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-[9.5px] font-semibold">
                              <span className="text-slate-600">{item.label}</span>
                              <span className="font-extrabold text-slate-900">{item.val}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${item.pct}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SUB-COL 3: ADD-ONS */}
                    <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                          <span className="text-[9.5px] font-black text-slate-900 uppercase tracking-wider">ADD-ONS</span>
                          <button onClick={() => setBillingTab('Add-ons')} className="text-[9px] font-bold text-[#2563EB] hover:underline cursor-pointer">Manage Add-ons →</button>
                        </div>

                        {[
                          { icon: <Cpu size={14} />, iconBg: 'bg-purple-100 text-purple-600', name: 'Hero AI Add-on', price: '$199.00 / month', sub: '15,000 requests included', status: 'Active', statusBg: 'bg-emerald-100 text-emerald-700' },
                          { icon: <BarChart2 size={14} />, iconBg: 'bg-blue-100 text-blue-600', name: 'Advanced Reporting', price: '$99.00 / month', sub: 'Unlimited reports & dashboards', status: 'Active', statusBg: 'bg-emerald-100 text-emerald-700' },
                          { icon: <HardDrive size={14} />, iconBg: 'bg-amber-100 text-amber-600', name: 'Extra Storage (500GB)', price: '$49.00 / month', sub: '500 GB additional storage', status: 'Inactive', statusBg: 'bg-slate-200 text-slate-600' },
                          { icon: <MessageSquare size={14} />, iconBg: 'bg-emerald-100 text-emerald-600', name: 'SMS Notifications', price: '$29.00 / month', sub: '2,000 SMS credits / month', status: 'Active', statusBg: 'bg-emerald-100 text-emerald-700' },
                        ].map((addon, i) => (
                          <div key={i} className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-slate-200/70">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-md ${addon.iconBg} flex items-center justify-center shrink-0`}>{addon.icon}</div>
                              <div>
                                <div className="text-[10px] font-extrabold text-slate-900 leading-tight">{addon.name}</div>
                                <div className="text-[8.5px] font-semibold text-slate-500 leading-tight">{addon.price}</div>
                                <div className="text-[7.5px] font-medium text-slate-400 leading-tight">{addon.sub}</div>
                              </div>
                            </div>
                            <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase ${addon.statusBg}`}>{addon.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* RIGHT CONTAINER (4 COLS): BILLING SUMMARY CARD */}
                <div className="xl:col-span-4 bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between text-left space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">BILLING SUMMARY</h3>
                      <button onClick={handleDownloadStatement} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">View full statement →</button>
                    </div>

                    <div className="space-y-2.5 text-[11px] pt-1">
                      <div className="flex justify-between font-semibold text-slate-700"><span>Plan (Hero Pro)</span><span className="font-black text-slate-900">$499.00</span></div>
                      <div className="flex justify-between font-semibold text-slate-700"><span>Hero AI Add-on</span><span className="font-black text-slate-900">$199.00</span></div>
                      <div className="flex justify-between font-semibold text-slate-700"><span>Advanced Reporting</span><span className="font-black text-slate-900">$99.00</span></div>
                      <div className="flex justify-between font-semibold text-slate-700"><span>SMS Notifications</span><span className="font-black text-slate-900">$29.00</span></div>
                      <div className="flex justify-between font-semibold text-emerald-600"><span>Discount</span><span className="font-black">-$49.00</span></div>
                      <div className="pt-2 border-t border-slate-100 flex justify-between font-semibold text-slate-700"><span>Subtotal</span><span className="font-black text-slate-900">$777.00</span></div>
                      <div className="flex justify-between font-semibold text-slate-700"><span>GST (10%)</span><span className="font-black text-slate-900">$77.70</span></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 uppercase">Total (AUD)</span>
                    <span className="text-2xl font-black text-[#2563EB] leading-none">$854.70</span>
                  </div>
                </div>

              </div>

              {/* BOTTOM SECTION: RECENT INVOICES + PAYMENT METHOD (2-COLUMN GRID) */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5 items-start">
                
                {/* LEFT: RECENT INVOICES TABLE (8 cols) */}
                <div className="xl:col-span-8 bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-2.5 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">RECENT INVOICES</h3>
                    <button onClick={() => setBillingTab('Invoices')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">View all invoices →</button>
                  </div>
                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[650px]">
                      <thead>
                        <tr className="border-b border-slate-200 text-[10px] font-extrabold text-[#1E1B4B] bg-slate-50/50">
                          <th className="py-2 px-2 whitespace-nowrap">Invoice #</th>
                          <th className="py-2 px-2 whitespace-nowrap">Date</th>
                          <th className="py-2 px-2 whitespace-nowrap">Description</th>
                          <th className="py-2 px-2 whitespace-nowrap">Amount</th>
                          <th className="py-2 px-2 whitespace-nowrap">Status</th>
                          <th className="py-2 px-2 whitespace-nowrap">Payment Method</th>
                          <th className="py-2 px-2 text-center whitespace-nowrap">Download</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { inv:'INV-2025-0529', date:'29 May 2025', desc:'Monthly Subscription - May 2025', amt:'$854.70', status:'Paid', pm:'Visa •••• 4242' },
                          { inv:'INV-2025-0429', date:'29 Apr 2025', desc:'Monthly Subscription - April 2025', amt:'$854.70', status:'Paid', pm:'Visa •••• 4242' },
                          { inv:'INV-2025-0329', date:'29 Mar 2025', desc:'Monthly Subscription - March 2025', amt:'$854.70', status:'Paid', pm:'Visa •••• 4242' },
                          { inv:'INV-2025-0228', date:'28 Feb 2025', desc:'Monthly Subscription - February 2025', amt:'$854.70', status:'Paid', pm:'Visa •••• 4242' },
                          { inv:'INV-2025-0129', date:'29 Jan 2025', desc:'Monthly Subscription - January 2025', amt:'$854.70', status:'Paid', pm:'Visa •••• 4242' },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                            <td className="py-2 px-2 whitespace-nowrap"><span className="text-[10px] font-extrabold text-[#2563EB]">{row.inv}</span></td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9.5px] font-semibold text-slate-500">{row.date}</span></td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9.5px] font-bold text-slate-800 whitespace-nowrap">{row.desc}</span></td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className="text-[10px] font-black text-slate-900">{row.amt}</span></td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase">{row.status}</span></td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9px] font-medium text-slate-600">{row.pm}</span></td>
                            <td className="py-2 px-2 text-center whitespace-nowrap">
                              <button onClick={() => handleDownloadSingleInvoice(row.inv)} className="p-1 hover:bg-slate-100 text-slate-500 hover:text-[#2563EB] rounded-lg cursor-pointer">
                                <Download size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                    <span>Showing 1 to 5 of 12 invoices</span>
                    <div className="flex items-center gap-1">
                      <button className="px-2 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400 text-xs">|‹</button>
                      <button className="px-2 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400 text-xs">‹</button>
                      <button className="px-2.5 py-0.5 bg-[#2563EB] text-white font-bold rounded-md text-xs">1</button>
                      <button className="px-2.5 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">2</button>
                      <button className="px-2.5 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">3</button>
                      <button className="px-2 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">›</button>
                      <button className="px-2 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">›|</button>
                    </div>
                  </div>
                </div>

                {/* RIGHT: PAYMENT METHOD + NEXT BILLING (4 cols) */}
                <div className="xl:col-span-4 space-y-3.5">
                  {/* PAYMENT METHOD */}
                  <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">PAYMENT METHOD</h3>
                      <button onClick={() => setBillingTab('Payment Methods')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">Manage →</button>
                    </div>
                    
                    <div className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
                      <div className="flex items-center gap-2.5">
                        <div className="px-2 py-1 bg-[#1A1F71] text-white rounded font-extrabold text-[10px] tracking-wider italic">
                          VISA
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900">Visa ending in 4242</div>
                          <div className="text-[9px] font-semibold text-slate-400">Expires 04/27</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[8.5px] font-black uppercase">Primary</span>
                    </div>
                  </div>

                  {/* NEXT BILLING */}
                  <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">NEXT BILLING</h3>
                      <button onClick={() => setBillingTab('Billing History')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">View schedule →</button>
                    </div>
                    
                    <div className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                          <Calendar size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900">30 Jun 2025</div>
                          <div className="text-[10px] font-extrabold text-[#2563EB]">$854.70 (AUD)</div>
                          <div className="text-[8.5px] font-medium text-slate-400">Monthly subscription</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[8.5px] font-black uppercase">Paid Up</span>
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* OTHER SUB-TAB PANELS */}
          {billingTab === 'Plan & Usage' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <Crown size={32} className="text-purple-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Plan & Usage Details</h3>
              <p className="text-xs text-slate-400 mt-1">Detailed breakdown of active seats, API limits, and storage quotas.</p>
              <button onClick={() => setBillingTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {billingTab === 'Add-ons' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <Cpu size={32} className="text-blue-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Add-ons Catalog</h3>
              <p className="text-xs text-slate-400 mt-1">Browse, activate, or cancel AI features, extra storage, and SMS packages.</p>
              <button onClick={() => setBillingTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {billingTab === 'Invoices' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <Download size={32} className="text-indigo-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">All Tax Invoices</h3>
              <p className="text-xs text-slate-400 mt-1">Search, filter, and download tax invoices for accounting.</p>
              <button onClick={() => setBillingTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {billingTab === 'Payment Methods' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <CreditCard size={32} className="text-emerald-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Payment Methods</h3>
              <p className="text-xs text-slate-400 mt-1">Manage corporate credit cards, direct debit, and primary billing cards.</p>
              <button onClick={() => setBillingTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {billingTab === 'Billing History' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <Clock size={32} className="text-amber-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Billing History & Renewal Schedule</h3>
              <p className="text-xs text-slate-400 mt-1">Chronological history of subscription renewals and payment transactions.</p>
              <button onClick={() => setBillingTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}
          {billingTab === 'Quotes & Orders' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-2xs">
              <FileText size={32} className="text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-black text-slate-700">Enterprise Quotes & Custom Orders</h3>
              <p className="text-xs text-slate-400 mt-1">Review custom enterprise quotes and sales order agreements.</p>
              <button onClick={() => setBillingTab('Overview')} className="mt-3 px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer">← Back to Overview</button>
            </div>
          )}

          {/* DEVELOPER NOTES FOOTER */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 shadow-2xs text-left">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-5 rounded bg-[#2563EB] text-white font-mono text-[10px] font-bold flex items-center justify-center">&lt;/&gt;</div>
              <h3 className="text-xs font-black text-blue-950 uppercase tracking-wider">DEVELOPER NOTES – SUBSCRIPTION & BILLING</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { title:'1. PURPOSE', items:['Manage subscription plans and billing.','Track usage, invoices and payments.','Handle add-ons and upgrades.'] },
                { title:'2. KEY FEATURES', items:['Plan details and billing cycle.','Real-time usage with limits.','Add-ons management.','Invoice and payment history.','Payment method management.'] },
                { title:'3. BILLING COMPONENTS', items:['Plans, Users, Usage, Add-ons.','Invoices, Payments, Discounts.','Taxes, Currency, Billing cycle.','Quotes and Orders.'] },
                { title:'4. INTEGRATIONS', items:['Payment Gateway (Stripe/Adyen).','Accounting (Xero, MYOB, QBO).','Email for invoices & receipts.','Usage metering service.'] },
                { title:'5. SECURITY & DATA', items:['Secure payment tokenization.','PCI DSS compliant.','Audit trail for billing changes.','Data retention per compliance.'] },
              ].map((col, i) => (
                <div key={i}>
                  <h4 className="font-extrabold text-blue-900 mb-1 uppercase text-[8.5px] tracking-wider">{col.title}</h4>
                  <ul className="space-y-0.5 text-[9.5px] text-slate-600 font-medium">{col.items.map((item, j) => <li key={j}>• {item}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-blue-200/60 flex items-center justify-between text-[8.5px] text-slate-500 font-semibold">
              <div className="flex items-center gap-1.5">
                <RefreshCw size={10} className="text-[#2563EB] animate-spin-slow" />
                <span>All times shown in your local time (AEST) • Data auto-refreshes every 5 minutes</span>
              </div>
            </div>
          </div>

        </div>
      )}




      {/* =========================================================================
         ADD USER MODAL OVERLAY
         ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Add New System User</h3>
                  <p className="text-xs text-slate-500 font-medium">Create a new user account & set permission role.</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-black text-sm p-1 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. David Miller" 
                  value={newUserForm.name}
                  onChange={e => setNewUserForm({...newUserForm, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                <input 
                  type="email" 
                  required
                  placeholder="david.m@herologistics.com.au" 
                  value={newUserForm.email}
                  onChange={e => setNewUserForm({...newUserForm, email: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Role *</label>
                  <select 
                    value={newUserForm.role}
                    onChange={e => setNewUserForm({...newUserForm, role: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Dispatch Manager">Dispatch Manager</option>
                    <option value="Dispatcher">Dispatcher</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Warehouse Manager">Warehouse Manager</option>
                    <option value="Driver">Driver</option>
                    <option value="Customer User">Customer User</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Branch Access</label>
                  <select 
                    value={newUserForm.branch}
                    onChange={e => setNewUserForm({...newUserForm, branch: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="All Branches">All Branches</option>
                    <option value="Sydney">Sydney</option>
                    <option value="Melbourne">Melbourne</option>
                    <option value="Brisbane">Brisbane</option>
                    <option value="Perth">Perth</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="+61 400 123 456" 
                    value={newUserForm.phone}
                    onChange={e => setNewUserForm({...newUserForm, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Account Status</label>
                  <select 
                    value={newUserForm.status}
                    onChange={e => setNewUserForm({...newUserForm, status: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         EDIT USER MODAL OVERLAY
         ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Edit size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Edit User Details</h3>
                  <p className="text-xs text-slate-500 font-medium">Update account profile & role permissions.</p>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-black text-sm p-1 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required
                  value={editUserForm.name}
                  onChange={e => setEditUserForm({...editUserForm, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                <input 
                  type="email" 
                  required
                  value={editUserForm.email}
                  onChange={e => setEditUserForm({...editUserForm, email: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Role *</label>
                  <select 
                    value={editUserForm.role}
                    onChange={e => setEditUserForm({...editUserForm, role: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Dispatch Manager">Dispatch Manager</option>
                    <option value="Dispatcher">Dispatcher</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Warehouse Manager">Warehouse Manager</option>
                    <option value="Driver">Driver</option>
                    <option value="Customer User">Customer User</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Branch Access</label>
                  <select 
                    value={editUserForm.branch}
                    onChange={e => setEditUserForm({...editUserForm, branch: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="All Branches">All Branches</option>
                    <option value="Sydney">Sydney</option>
                    <option value="Melbourne">Melbourne</option>
                    <option value="Brisbane">Brisbane</option>
                    <option value="Perth">Perth</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={editUserForm.phone}
                    onChange={e => setEditUserForm({...editUserForm, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Account Status</label>
                  <select 
                    value={editUserForm.status}
                    onChange={e => setEditUserForm({...editUserForm, status: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         CREATE ROLE MODAL OVERLAY
         ========================================================================= */}
      {isCreateRoleModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Shield size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Create New System Role</h3>
                  <p className="text-xs text-slate-500 font-medium">Define role title, capabilities, and color badge theme.</p>
                </div>
              </div>
              <button onClick={() => setIsCreateRoleModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-black text-sm p-1 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateRoleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Role Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Safety Compliance Officer" 
                  value={newRoleForm.name}
                  onChange={e => setNewRoleForm({...newRoleForm, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Role Description</label>
                <textarea 
                  rows={2}
                  placeholder="Describe the primary responsibilities and access scope of this role..." 
                  value={newRoleForm.desc}
                  onChange={e => setNewRoleForm({...newRoleForm, desc: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Badge Color Theme</label>
                <select 
                  value={newRoleForm.colorTheme}
                  onChange={e => setNewRoleForm({...newRoleForm, colorTheme: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer"
                >
                  <option value="blue">Blue Badge</option>
                  <option value="purple">Purple Badge</option>
                  <option value="amber">Amber Badge</option>
                  <option value="teal">Teal Badge</option>
                  <option value="emerald">Emerald Badge</option>
                  <option value="orange">Orange Badge</option>
                  <option value="pink">Pink Badge</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsCreateRoleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         EDIT ROLE MODAL OVERLAY
         ========================================================================= */}
      {isEditRoleModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Edit size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Edit Role Configuration</h3>
                  <p className="text-xs text-slate-500 font-medium">Update role title and security description.</p>
                </div>
              </div>
              <button onClick={() => setIsEditRoleModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-black text-sm p-1 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleEditRoleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Role Title *</label>
                <input 
                  type="text" 
                  required
                  value={editRoleForm.name}
                  onChange={e => setEditRoleForm({...editRoleForm, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Role Description</label>
                <textarea 
                  rows={3}
                  value={editRoleForm.desc}
                  onChange={e => setEditRoleForm({...editRoleForm, desc: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditRoleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Save Role Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         CREATE WORKFLOW RULE MODAL OVERLAY
         ========================================================================= */}
      {isCreateWorkflowRuleModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Sliders size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Create Workflow Rule</h3>
                  <p className="text-xs text-slate-500 font-medium">Set automation trigger, action & conditions.</p>
                </div>
              </div>
              <button onClick={() => setIsCreateWorkflowRuleModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-black text-sm p-1 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateWorkflowRuleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Rule Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. POD Upload Notification" 
                  value={newWorkflowRuleForm.name}
                  onChange={e => setNewWorkflowRuleForm({...newWorkflowRuleForm, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea 
                  rows={2}
                  placeholder="Describe when and why this rule executes..." 
                  value={newWorkflowRuleForm.desc}
                  onChange={e => setNewWorkflowRuleForm({...newWorkflowRuleForm, desc: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select 
                    value={newWorkflowRuleForm.category}
                    onChange={e => setNewWorkflowRuleForm({...newWorkflowRuleForm, category: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="Invoice Automation">Invoice Automation</option>
                    <option value="Payment Reminders">Payment Reminders</option>
                    <option value="Compliance Reminders">Compliance Reminders</option>
                    <option value="Load Status Actions">Load Status Actions</option>
                    <option value="Customer Notifications">Customer Notifications</option>
                    <option value="Approval Workflows">Approval Workflows</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Trigger Event</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Load Status: Delivered" 
                    value={newWorkflowRuleForm.trigger}
                    onChange={e => setNewWorkflowRuleForm({...newWorkflowRuleForm, trigger: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Automated Action</label>
                <input 
                  type="text" 
                  placeholder="e.g. Create Invoice & Notify Accounts" 
                  value={newWorkflowRuleForm.action}
                  onChange={e => setNewWorkflowRuleForm({...newWorkflowRuleForm, action: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsCreateWorkflowRuleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Create Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         EDIT WORKFLOW RULE MODAL OVERLAY
         ========================================================================= */}
      {isEditWorkflowRuleModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Edit size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Edit Workflow Rule</h3>
                  <p className="text-xs text-slate-500 font-medium">Update automation trigger, action & settings.</p>
                </div>
              </div>
              <button onClick={() => setIsEditWorkflowRuleModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-black text-sm p-1 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleEditWorkflowRuleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Rule Name *</label>
                <input 
                  type="text" 
                  required
                  value={editWorkflowRuleForm.name}
                  onChange={e => setEditWorkflowRuleForm({...editWorkflowRuleForm, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea 
                  rows={2}
                  value={editWorkflowRuleForm.desc}
                  onChange={e => setEditWorkflowRuleForm({...editWorkflowRuleForm, desc: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select 
                    value={editWorkflowRuleForm.category}
                    onChange={e => setEditWorkflowRuleForm({...editWorkflowRuleForm, category: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="Invoice Automation">Invoice Automation</option>
                    <option value="Payment Reminders">Payment Reminders</option>
                    <option value="Compliance Reminders">Compliance Reminders</option>
                    <option value="Load Status Actions">Load Status Actions</option>
                    <option value="Customer Notifications">Customer Notifications</option>
                    <option value="Approval Workflows">Approval Workflows</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Trigger Event</label>
                  <input 
                    type="text" 
                    value={editWorkflowRuleForm.trigger}
                    onChange={e => setEditWorkflowRuleForm({...editWorkflowRuleForm, trigger: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Automated Action</label>
                <input 
                  type="text" 
                  value={editWorkflowRuleForm.action}
                  onChange={e => setEditWorkflowRuleForm({...editWorkflowRuleForm, action: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditWorkflowRuleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* =========================================================================
         ADD THIRD-PARTY INTEGRATION MODAL OVERLAY
         ========================================================================= */}
      {isAddIntegrationModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                  <Plug size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Add New Integration</h3>
                  <p className="text-xs text-slate-500 font-semibold">Connect third-party software, API or service to Hero Logistics.</p>
                </div>
              </div>
              <button onClick={() => setIsAddIntegrationModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-black text-sm p-1 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddIntegrationSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Integration Provider / System *</label>
                <select 
                  value={newIntegrationForm.provider}
                  onChange={e => setNewIntegrationForm({...newIntegrationForm, provider: e.target.value, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option>Xero Accounting</option>
                  <option>MYOB Accounting</option>
                  <option>QuickBooks Online</option>
                  <option>Google Maps Platform</option>
                  <option>Samsara Telematics</option>
                  <option>Geotab Telematics</option>
                  <option>NHVR EWD</option>
                  <option>Stripe Payments</option>
                  <option>SendGrid Email</option>
                  <option>Twilio SMS</option>
                  <option>Custom Webhook / API</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Connection Display Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Xero Primary Account" 
                  value={newIntegrationForm.name}
                  onChange={e => setNewIntegrationForm({...newIntegrationForm, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">Category</label>
                  <select 
                    value={newIntegrationForm.category}
                    onChange={e => setNewIntegrationForm({...newIntegrationForm, category: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option>Accounting</option>
                    <option>GPS / Telematics</option>
                    <option>Compliance</option>
                    <option>Payments</option>
                    <option>Communication</option>
                    <option>Maps & Routing</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">Sync Frequency</label>
                  <select 
                    value={newIntegrationForm.syncFrequency}
                    onChange={e => setNewIntegrationForm({...newIntegrationForm, syncFrequency: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option>Real-time (Webhooks)</option>
                    <option>Every 15 minutes</option>
                    <option>Hourly</option>
                    <option>Daily</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">API Key / Authorization Secret *</label>
                <input 
                  type="password" 
                  required
                  placeholder="e.g. live_sk_9837189a87f897x456" 
                  value={newIntegrationForm.apiKey}
                  onChange={e => setNewIntegrationForm({...newIntegrationForm, apiKey: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox"
                  id="autoSync"
                  checked={newIntegrationForm.autoSync}
                  onChange={e => setNewIntegrationForm({...newIntegrationForm, autoSync: e.target.checked})}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="autoSync" className="text-xs font-bold text-slate-700 cursor-pointer">Enable automatic background synchronization</label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddIntegrationModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Plug size={14} /> Connect Integration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* =========================================================================
         SEND TEST NOTIFICATION MODAL OVERLAY
         ========================================================================= */}
      {isTestNotificationModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                  <Send size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Send Test Notification</h3>
                  <p className="text-xs text-slate-500 font-semibold">Dispatch a test message across selected notification channels.</p>
                </div>
              </div>
              <button onClick={() => setIsTestNotificationModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-black text-sm p-1 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSendTestNotificationSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Notification Channel *</label>
                <select 
                  value={testNotificationForm.channel}
                  onChange={e => setTestNotificationForm({...testNotificationForm, channel: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option>Email</option>
                  <option>SMS</option>
                  <option>Push Notification</option>
                  <option>In-App Message</option>
                  <option>WhatsApp Business</option>
                  <option>Webhook Event</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Target Recipient Address / Phone / User ID *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. sarah.mitchell@herologistics.com.au or +61412345678" 
                  value={testNotificationForm.recipient}
                  onChange={e => setTestNotificationForm({...testNotificationForm, recipient: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Test Message Body</label>
                <textarea 
                  rows={3}
                  value={testNotificationForm.message}
                  onChange={e => setTestNotificationForm({...testNotificationForm, message: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsTestNotificationModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send size={14} /> Send Test Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* =========================================================================
         SECURITY SETTINGS MODAL OVERLAY
         ========================================================================= */}
      {isSecuritySettingsModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                  <Lock size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Security & Retention Settings</h3>
                  <p className="text-xs text-slate-500 font-semibold">Configure log retention policies and system security controls.</p>
                </div>
              </div>
              <button onClick={() => setIsSecuritySettingsModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-black text-sm p-1 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveSecuritySettingsSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Audit Log Retention Period *</label>
                <select 
                  value={securitySettingsForm.retentionDays}
                  onChange={e => setSecuritySettingsForm({...securitySettingsForm, retentionDays: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option>90 Days</option>
                  <option>180 Days</option>
                  <option>365 Days (Recommended)</option>
                  <option>730 Days (2 Years)</option>
                  <option>Indefinite / Permanent</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Inactivity Session Timeout</label>
                <select 
                  value={securitySettingsForm.sessionTimeout}
                  onChange={e => setSecuritySettingsForm({...securitySettingsForm, sessionTimeout: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option>15 Minutes</option>
                  <option>30 Minutes</option>
                  <option>1 Hour</option>
                  <option>4 Hours</option>
                  <option>Never Timeout</option>
                </select>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Require Two-Factor Authentication (2FA)</span>
                    <span className="text-[10px] text-slate-500 font-medium">Enforce 2FA for all administrative accounts</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={securitySettingsForm.twoFactorAuth}
                    onChange={e => setSecuritySettingsForm({...securitySettingsForm, twoFactorAuth: e.target.checked})}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">IP Whitelisting Restrictions</span>
                    <span className="text-[10px] text-slate-500 font-medium">Restrict API and admin access to approved corporate IP ranges</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={securitySettingsForm.ipWhitelisting}
                    onChange={e => setSecuritySettingsForm({...securitySettingsForm, ipWhitelisting: e.target.checked})}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Automated Security Alerts</span>
                    <span className="text-[10px] text-slate-500 font-medium">Email super admin on failed logins or suspicious export attempts</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={securitySettingsForm.auditAlerts}
                    onChange={e => setSecuritySettingsForm({...securitySettingsForm, auditAlerts: e.target.checked})}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsSecuritySettingsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Lock size={14} /> Save Security Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* =========================================================================
         MANAGE SUBSCRIPTION MODAL OVERLAY
         ========================================================================= */}
      {isManageSubscriptionModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Crown size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Manage Plan & Subscription</h3>
                  <p className="text-xs text-slate-500 font-semibold">Upgrade plan tiers, manage seat allocations & active add-ons.</p>
                </div>
              </div>
              <button onClick={() => setIsManageSubscriptionModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-black text-sm p-1 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveManageSubscriptionSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Subscription Tier *</label>
                <select 
                  value={manageSubscriptionForm.plan}
                  onChange={e => setManageSubscriptionForm({...manageSubscriptionForm, plan: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option>Hero Starter ($199/month)</option>
                  <option>Hero Business ($349/month)</option>
                  <option>Hero Pro ($499/month - Active)</option>
                  <option>Hero Enterprise ($999/month)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Billing Frequency</label>
                <select 
                  value={manageSubscriptionForm.billingCycle}
                  onChange={e => setManageSubscriptionForm({...manageSubscriptionForm, billingCycle: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option>Monthly Billing</option>
                  <option>Annual Billing (Save 20%)</option>
                </select>
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-xs font-extrabold text-slate-700 block">Included Add-on Packages</label>
                
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Hero AI Add-on ($199/mo)</span>
                    <span className="text-[10px] text-slate-500 font-medium">15,000 AI dispatch & document extraction requests</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={manageSubscriptionForm.aiAddon}
                    onChange={e => setManageSubscriptionForm({...manageSubscriptionForm, aiAddon: e.target.checked})}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Advanced Reporting ($99/mo)</span>
                    <span className="text-[10px] text-slate-500 font-medium">Custom analytics dashboards & scheduled PDF exports</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={manageSubscriptionForm.reportingAddon}
                    onChange={e => setManageSubscriptionForm({...manageSubscriptionForm, reportingAddon: e.target.checked})}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">SMS Notifications ($29/mo)</span>
                    <span className="text-[10px] text-slate-500 font-medium">2,000 automated SMS dispatch notifications</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={manageSubscriptionForm.smsAddon}
                    onChange={e => setManageSubscriptionForm({...manageSubscriptionForm, smsAddon: e.target.checked})}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsManageSubscriptionModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Crown size={14} /> Update Plan Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
