import React, { useState, useRef, useEffect, useCallback } from 'react';
import api from '../../services/api';
import {
  Building, Users, Award, Plug, Cpu, ShieldCheck, CheckCircle2, Clock,
  AlertTriangle, Mail, Sliders, DollarSign, CreditCard, Bell, Shield,
  ArrowUpRight, Activity, Database, RefreshCw, Bookmark, ChevronRight,
  ChevronDown, HelpCircle, Phone, MapPin, Globe, Save, Check, Zap,
  TrendingUp, BarChart2, Server, Lock, UserPlus, FileText, ArrowRight,
  HardDrive, Layers, CheckSquare, MessageSquare, AlertCircle, Upload,
  Trash2, Download, Info, Calendar, Palette, Hash, Settings, FileCheck,
  UserCheck, UserX, Key, Search, Plus, Edit, Filter, MoreHorizontal, Send,
  Link2, Star, Truck, Crown, Eye
} from 'lucide-react';

export default function CompanySettings() {
  const [currentView, setCurrentView] = useState('dashboard'); // Default to 13.1 Settings Dashboard
  const [billingTab, setBillingTab] = useState('Overview');
  const [securityLogsTab, setSecurityLogsTab] = useState('Overview');
  const [notificationsTab, setNotificationsTab] = useState('Overview');
  const [integrationsTab, setIntegrationsTab] = useState('Overview');
  const [isRefreshingIntegrations, setIsRefreshingIntegrations] = useState(false);
  const [isAddIntegrationModalOpen, setIsAddIntegrationModalOpen] = useState(false);
  const [isGenerateApiKeyModalOpen, setIsGenerateApiKeyModalOpen] = useState(false);
  const [isTestWebhookModalOpen, setIsTestWebhookModalOpen] = useState(false);
  const [newApiKeyForm, setNewApiKeyForm] = useState({ name: '', limit: '100,000 req/mo' });
  const [apiKeysList, setApiKeysList] = useState([]);

  // Payment Methods State
  const [isAddPaymentMethodModalOpen, setIsAddPaymentMethodModalOpen] = useState(false);
  const [paymentMethodsList, setPaymentMethodsList] = useState([
    {
      id: 1,
      type: 'Visa ending in 4242',
      cardHolder: 'Sarah Mitchell',
      cardNumber: '4242',
      expDate: '04/2027',
      isPrimary: true,
      note: 'Used for recurring monthly billing ($854.70 AUD).',
      badgeBg: 'bg-[#1A1F71]',
      badgeText: 'VISA'
    },
    {
      id: 2,
      type: 'MasterCard ending in 8819',
      cardHolder: 'Backup Card',
      cardNumber: '8819',
      expDate: '11/2026',
      isPrimary: false,
      note: 'Backup Card',
      badgeBg: 'bg-[#EB001B]',
      badgeText: 'MC'
    }
  ]);

  const [newPaymentMethodForm, setNewPaymentMethodForm] = useState({
    type: 'Credit / Debit Card',
    cardHolder: '',
    cardNumber: '',
    expMonth: '05',
    expYear: '2028',
    cvv: '',
    bankName: 'Commonwealth Bank of Australia',
    accountName: '',
    bsb: '',
    accountNumber: '',
    upiId: '',
    isPrimary: false
  });

  const handleMakePrimaryPaymentMethod = (id) => {
    setPaymentMethodsList(prev => prev.map(item => ({
      ...item,
      isPrimary: item.id === id,
      note: item.id === id ? 'Used for recurring monthly billing.' : 'Backup payment method'
    })));
    triggerToast('Payment method set as primary!');
  };

  const handleRemovePaymentMethod = (id) => {
    setPaymentMethodsList(prev => prev.filter(item => item.id !== id));
    triggerToast('Payment method removed successfully.');
  };

  const handleAddPaymentMethodSubmit = (e) => {
    e.preventDefault();
    const type = newPaymentMethodForm.type;
    
    let brand = 'Visa';
    let badgeBg = 'bg-[#1A1F71]';
    let badgeText = 'VISA';
    let last4 = '4242';
    let expDateStr = `${newPaymentMethodForm.expMonth}/${newPaymentMethodForm.expYear}`;
    let holderStr = newPaymentMethodForm.cardHolder || 'Cardholder';

    if (type === 'Credit / Debit Card') {
      const cleanNum = newPaymentMethodForm.cardNumber.replace(/\s+/g, '');
      if (!cleanNum || cleanNum.length < 4) {
        triggerToast('Please enter a valid card number');
        return;
      }
      last4 = cleanNum.slice(-4);
      if (cleanNum.startsWith('5') || cleanNum.startsWith('2')) {
        brand = 'MasterCard';
        badgeBg = 'bg-[#EB001B]';
        badgeText = 'MC';
      } else if (cleanNum.startsWith('3')) {
        brand = 'American Express';
        badgeBg = 'bg-[#006FCF]';
        badgeText = 'AMEX';
      } else {
        brand = 'Visa';
        badgeBg = 'bg-[#1A1F71]';
        badgeText = 'VISA';
      }
    } else if (type === 'Direct Debit (BSB)') {
      if (!newPaymentMethodForm.accountNumber) {
        triggerToast('Please enter account number');
        return;
      }
      brand = 'Direct Debit';
      badgeBg = 'bg-slate-900';
      badgeText = 'BANK';
      last4 = newPaymentMethodForm.accountNumber.slice(-4);
      expDateStr = `BSB ${newPaymentMethodForm.bsb || '062-000'}`;
      holderStr = newPaymentMethodForm.accountName || newPaymentMethodForm.bankName || 'Direct Debit Account';
    } else if (type === 'UPI / NetBanking') {
      if (!newPaymentMethodForm.upiId) {
        triggerToast('Please enter UPI ID');
        return;
      }
      brand = 'UPI Instant Pay';
      badgeBg = 'bg-emerald-700';
      badgeText = 'UPI';
      last4 = newPaymentMethodForm.upiId;
      expDateStr = 'Instant Pay Verified';
      holderStr = newPaymentMethodForm.upiId;
    }

    const isPrim = newPaymentMethodForm.isPrimary || paymentMethodsList.length === 0;

    const newMethod = {
      id: Date.now(),
      type: `${brand} ending in ${last4}`,
      cardHolder: holderStr,
      cardNumber: last4,
      expDate: expDateStr,
      isPrimary: isPrim,
      note: isPrim ? 'Used for recurring monthly billing.' : 'Backup payment method',
      badgeBg,
      badgeText
    };

    if (isPrim) {
      setPaymentMethodsList(prev => [
        newMethod,
        ...prev.map(p => ({ ...p, isPrimary: false, note: 'Backup payment method' }))
      ]);
    } else {
      setPaymentMethodsList(prev => [...prev, newMethod]);
    }

    setIsAddPaymentMethodModalOpen(false);
    setNewPaymentMethodForm({
      type: 'Credit / Debit Card',
      cardHolder: '',
      cardNumber: '',
      expMonth: '05',
      expYear: '2028',
      cvv: '',
      bankName: 'Commonwealth Bank of Australia',
      accountName: '',
      bsb: '',
      accountNumber: '',
      upiId: '',
      isPrimary: false
    });
    triggerToast(`Payment method "${brand}" added successfully!`);
  };

  const [newIntegrationForm, setNewIntegrationForm] = useState({
    providerName: 'Xero Accounting & Invoicing',
    name: 'Xero Accounting',
    category: 'Accounting',
    provider: 'Xero Accounting',
    apiKey: '',
    syncFrequency: 'Every 15 minutes',
    autoSync: true
  });

  const handleAddIntegrationSubmit = async (e) => {
    e.preventDefault();
    const targetProvider = newIntegrationForm.providerName || newIntegrationForm.provider || newIntegrationForm.name || 'Xero Accounting';
    if (!targetProvider) {
      triggerToast('Please select or enter an integration provider!');
      return;
    }

    try {
      await api.post('/company-integrations', {
        providerName: targetProvider,
        apiKey: newIntegrationForm.apiKey,
        status: 'CONNECTED'
      });

      setIsAddIntegrationModalOpen(false);
      triggerToast(`Integration "${targetProvider}" authorized & connected successfully!`);
      setNewIntegrationForm({
        providerName: 'Xero Accounting & Invoicing',
        name: 'Xero Accounting',
        category: 'Accounting',
        provider: 'Xero Accounting',
        apiKey: '',
        syncFrequency: 'Every 15 minutes',
        autoSync: true
      });
    } catch (err) {
      console.error('Error connecting integration:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error?.message || 'Failed to connect integration. Please try again.';
      triggerToast(errMsg);
    }
  };

  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] = useState(false);
  const [isAddNotificationRuleModalOpen, setIsAddNotificationRuleModalOpen] = useState(false);
  const [isCreateRecipientGroupModalOpen, setIsCreateRecipientGroupModalOpen] = useState(false);

  const [notificationTemplatesList, setNotificationTemplatesList] = useState([]);
  const [notificationRulesList, setNotificationRulesList] = useState([]);
  const [recipientGroupsList, setRecipientGroupsList] = useState([]);

  const [newTemplateForm, setNewTemplateForm] = useState({ title: '', channel: 'Email', preview: '' });
  const [newRuleForm, setNewRuleForm] = useState({ name: '', trigger: 'When Load status changes to DELIVERED', channels: 'SMS + Email', rec: 'Customer & Accounts', priority: 'High' });
  const [newGroupForm, setNewGroupForm] = useState({ name: '', count: '1 member', desc: '' });

  const handleCreateTemplateSubmit = async (e) => {
    e.preventDefault();
    if (!newTemplateForm.title || !newTemplateForm.title.trim()) {
      triggerToast('Please enter a Template Title');
      return;
    }

    try {
      const res = await api.post('/notification-templates', {
        title: newTemplateForm.title,
        channel: newTemplateForm.channel,
        preview: newTemplateForm.preview,
        body: newTemplateForm.preview,
        status: 'Active'
      });

      const created = res.data?.data || res.data;
      if (created && created.id) {
        const mapped = {
          id: created.id,
          title: created.title,
          channel: created.channel || 'Email',
          preview: created.body || created.preview || 'Custom template preview text...',
          status: created.status || 'Active'
        };
        setNotificationTemplatesList(prev => [mapped, ...prev]);
      }

      setNewTemplateForm({ title: '', channel: 'Email', preview: '' });
      setIsCreateTemplateModalOpen(false);
      triggerToast(`Template "${newTemplateForm.title}" created successfully!`);
    } catch (err) {
      console.error('Error creating notification template:', err);
      const errMsg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create template. Please try again.';
      triggerToast(errMsg);
    }
  };

  const handleAddNotificationRuleSubmit = async (e) => {
    e.preventDefault();
    if (!newRuleForm.name || !newRuleForm.name.trim()) {
      triggerToast('Please enter a Rule Name');
      return;
    }

    try {
      const res = await api.post('/notification-rules', {
        name: newRuleForm.name,
        trigger: newRuleForm.trigger,
        channels: newRuleForm.channels,
        rec: newRuleForm.rec,
        priority: newRuleForm.priority,
        status: 'Enabled'
      });

      const created = res.data?.data || res.data;
      if (created && created.id) {
        const mapped = {
          id: created.id,
          name: created.name,
          trigger: created.trigger,
          channels: created.channels || 'SMS + Email',
          rec: created.recipient || created.rec || 'Customer & Accounts',
          priority: created.priority || 'High',
          status: created.status || 'Enabled'
        };
        setNotificationRulesList(prev => [mapped, ...prev]);
      }

      setNewRuleForm({ name: '', trigger: 'When Load status changes to DELIVERED', channels: 'SMS + Email', rec: 'Customer & Accounts', priority: 'High' });
      setIsAddNotificationRuleModalOpen(false);
      triggerToast(`Notification Rule "${newRuleForm.name}" created & activated!`);
    } catch (err) {
      console.error('Error creating notification rule:', err);
      const errMsg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create notification rule.';
      triggerToast(errMsg);
    }
  };

  const handleCreateRecipientGroupSubmit = async (e) => {
    e.preventDefault();
    if (!newGroupForm.name || !newGroupForm.name.trim()) {
      triggerToast('Please enter a Group Name');
      return;
    }

    try {
      const res = await api.post('/recipient-groups', {
        name: newGroupForm.name,
        count: newGroupForm.count || '0 members',
        desc: newGroupForm.desc,
        description: newGroupForm.desc,
        status: 'Active'
      });

      const created = res.data?.data || res.data;
      if (created && created.id) {
        const mapped = {
          id: created.id,
          name: created.name,
          count: created.count || '0 members',
          desc: created.description || created.desc || 'Custom distribution group list.',
          status: created.status || 'Active'
        };
        setRecipientGroupsList(prev => [mapped, ...prev]);
      }

      setNewGroupForm({ name: '', count: '0 members', desc: '' });
      setIsCreateRecipientGroupModalOpen(false);
      triggerToast(`Recipient Group "${newGroupForm.name}" created successfully!`);
    } catch (err) {
      console.error('Error creating recipient group:', err);
      const errMsg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create recipient group.';
      triggerToast(errMsg);
    }
  };

  const [activeTab, setActiveTab] = useState('Company Details');
  const [usersTab, setUsersTab] = useState('Users');
  const [isMoreActionsDropdownOpen, setIsMoreActionsDropdownOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const logoInputRef = useRef(null);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleRefreshIntegrations = () => {
    setIsRefreshingIntegrations(true);
    triggerToast('Refreshing third-party integrations & API status...');
    setTimeout(() => {
      setIsRefreshingIntegrations(false);
      triggerToast('All 12 integrations & webhooks updated successfully!');
    }, 1000);
  };

  const handleGenerateApiKey = (e) => {
    e.preventDefault();
    if (!newApiKeyForm.name.trim()) {
      triggerToast('Please enter an API Key name');
      return;
    }
    const newKey = {
      id: Date.now(),
      name: newApiKeyForm.name,
      prefix: `hero_live_${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      limit: newApiKeyForm.limit,
      status: 'Active'
    };
    setApiKeysList([newKey, ...apiKeysList]);
    setNewApiKeyForm({ name: '', limit: '100,000 req/mo' });
    setIsGenerateApiKeyModalOpen(false);
    triggerToast(`API Key "${newKey.name}" generated successfully!`);
  };

  const handleRevokeKey = (keyId, keyName) => {
    setApiKeysList(apiKeysList.map(k => k.id === keyId ? { ...k, status: 'Revoked' } : k));
    triggerToast(`API Key "${keyName}" has been revoked.`);
  };




  const [companyIntegrationsList, setCompanyIntegrationsList] = useState([]);

  const [loadingSettings, setLoadingSettings] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    setupPercent: 0,
    usersCount: 0,
    branchesCount: 0,
    integrationsCount: 0,
    systemAlerts: [],
    userActivity: { logins: 0, newUsers: 0, roleChanges: 0, permissionChanges: 0 },
    lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  });

  const fetchCompanySettings = useCallback(async () => {
    setLoadingSettings(true);
    try {
      const [settingsRes, usersRes, rolesRes, auditRes, rulesRes, integrationsRes, aiModelsRes, templatesRes, notifRulesRes, recipientGroupsRes] = await Promise.allSettled([
        api.get('/company-admin/settings'),
        api.get('/users'),
        api.get('/custom-roles'),
        api.get('/company-admin/audit-logs'),
        api.get('/workflow-rules'),
        api.get('/company-integrations'),
        api.get('/ai-models'),
        api.get('/notification-templates'),
        api.get('/notification-rules'),
        api.get('/recipient-groups')
      ]);

      if (settingsRes.status === 'fulfilled') {
        const data = settingsRes.value.data?.data || settingsRes.value.data;
        const comp = data?.company || data;
        const statsData = data?.stats || {};
        
        const activeUsers = usersRes.status === 'fulfilled' 
          ? (Array.isArray(usersRes.value.data?.data) ? usersRes.value.data.data.length : 0)
          : 0;

        setDashboardStats({
          setupPercent: statsData.setupPercent || 0,
          usersCount: statsData.usersCount || activeUsers,
          branchesCount: comp?.branches ? comp.branches.length : (statsData.branchesCount || 0),
          integrationsCount: statsData.integrationsCount || 0,
          systemAlerts: [],
          userActivity: { logins: 0, newUsers: 0, roleChanges: 0, permissionChanges: 0 },
          lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        });

        if (comp) {
          setCompanyDetails(prev => ({
            ...prev,
            companyName: comp.name || '',
            phone: comp.phone || '',
            email: comp.email || '',
            registeredAddress: comp.address || '',
            website: comp.websiteUrl || ''
          }));

          if (comp.whiteLabelConfig) {
            setBranding(prev => ({
              ...prev,
              primary: comp.whiteLabelConfig.primaryBrandColor || prev.primary,
              secondary: comp.whiteLabelConfig.secondaryBrandColor || prev.secondary,
              accent: comp.whiteLabelConfig.accentBrandColor || prev.accent
            }));
          }

          if (comp.securityRetentionDays || comp.securitySessionTimeout) {
            setSecuritySettingsForm({
              retentionDays: comp.securityRetentionDays || '90 Days',
              sessionTimeout: comp.securitySessionTimeout || '30 Minutes',
              twoFactorAuth: comp.securityTwoFactorAuth !== undefined ? comp.securityTwoFactorAuth : true,
              ipWhitelisting: comp.securityIpWhitelisting !== undefined ? comp.securityIpWhitelisting : false,
              auditAlerts: comp.securityAuditAlerts !== undefined ? comp.securityAuditAlerts : true
            });
          }
        }
      }

      if (usersRes.status === 'fulfilled') {
        const uData = usersRes.value.data?.data || usersRes.value.data;
        const uList = Array.isArray(uData) ? uData : (uData.items || []);
        const formatRoleName = (r) => {
          if (!r) return 'Admin';
          if (r === 'COMPANY_ADMIN') return 'Admin';
          if (r === 'SUPER_ADMIN') return 'Super Admin';
          if (r === 'DISPATCHER') return 'Dispatcher';
          if (r === 'WAREHOUSE') return 'Warehouse Manager';
          if (r === 'ACCOUNTS') return 'Accounts';
          if (r === 'DRIVER') return 'Driver';
          if (r === 'CUSTOMER') return 'Customer User';
          return r;
        };

        const mappedUsers = uList.map((u, idx) => {
          const formattedRole = formatRoleName(u.role);
          return {
            id: u.id,
            name: u.name || `User ${idx + 1}`,
            email: u.email || '',
            role: formattedRole,
            roleColor: getRoleBadgeColor(formattedRole),
            branch: u.branch?.name || u.branch || 'Sydney',
            status: u.status === 'ACTIVE' || u.status === 'Active' ? 'Active' : 'Inactive',
            lastLogin: u.updatedAt ? new Date(u.updatedAt).toLocaleString() : 'Recently',
            joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '',
            phone: u.phone || '',
            avatar: (u.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
            avatarBg: 'bg-[#2563EB]'
          };
        });
        setUsersList(mappedUsers);
        setSelectedUser(prev => prev || mappedUsers[0] || null);
      } else {
        setUsersList([]);
      }

      if (rolesRes.status === 'fulfilled') {
        const rData = rolesRes.value.data?.data || rolesRes.value.data;
        const rList = Array.isArray(rData) ? rData : (rData.items || []);
        const mappedRoles = rList.map((r, idx) => ({
          id: r.id,
          name: r.name || 'Custom Role',
          users: r.users ? r.users.length : 0,
          desc: r.desc || 'Custom system permission role',
          color: 'bg-blue-100 text-blue-700 border-blue-200'
        }));
        setRolesList(mappedRoles);
      } else {
        setRolesList([]);
      }

      if (rulesRes.status === 'fulfilled') {
        const wfData = rulesRes.value.data?.data || rulesRes.value.data;
        const wfList = Array.isArray(wfData) ? wfData : (wfData.items || []);
        if (wfList.length > 0) {
          const mappedRules = wfList.map((r) => ({
            id: r.id,
            name: r.name,
            desc: r.description || r.desc || 'Automated workflow rule',
            category: r.category || 'Invoice Automation',
            categoryColor: getCategoryBadgeColor(r.category || 'Invoice Automation'),
            trigger: r.trigger || 'Load Status: Delivered',
            action: r.action || 'Create Invoice & Notify Accounts',
            status: r.status || 'Active',
            lastExecuted: r.lastExecuted || 'Never',
            executions: r.executions || 0,
            createdBy: r.createdBy || 'Sarah Mitchell',
            createdOn: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Today',
            lastModified: r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : 'Just Now'
          }));
          setWorkflowRulesList(mappedRules);
          setSelectedWorkflowRule(prev => prev || mappedRules[0] || null);
        }
      }

      if (integrationsRes && integrationsRes.status === 'fulfilled') {
        const intData = integrationsRes.value.data?.data || integrationsRes.value.data;
        const intList = Array.isArray(intData) ? intData : (intData.items || []);
        setCompanyIntegrationsList(intList);
      }

      if (aiModelsRes && aiModelsRes.status === 'fulfilled') {
        const mData = aiModelsRes.value.data?.data || aiModelsRes.value.data;
        const mList = Array.isArray(mData) ? mData : (mData.items || []);
        if (mList.length > 0) {
          const mappedModels = mList.map(m => ({
            id: m.id,
            name: m.name,
            provider: m.provider || 'OpenAI',
            version: m.version || 'v1.0',
            latency: m.latencySla || '120ms',
            cost: m.costRate || '$0.002 / 1k tokens',
            status: m.status || 'Active',
            lastUpdated: m.lastUpdated || (m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'Today')
          }));
          setAiModelsList(mappedModels);
        }
      }

      if (templatesRes && templatesRes.status === 'fulfilled') {
        const tData = templatesRes.value.data?.data || templatesRes.value.data;
        const tList = Array.isArray(tData) ? tData : (tData.items || []);
        if (tList.length > 0) {
          const mappedTpls = tList.map(t => ({
            id: t.id,
            title: t.title,
            channel: t.channel || 'Email',
            preview: t.body || t.preview || 'Custom template preview text...',
            status: t.status || 'Active'
          }));
          setNotificationTemplatesList(mappedTpls);
        }
      }

      if (notifRulesRes && notifRulesRes.status === 'fulfilled') {
        const nrData = notifRulesRes.value.data?.data || notifRulesRes.value.data;
        const nrList = Array.isArray(nrData) ? nrData : (nrData.items || []);
        if (nrList.length > 0) {
          const mappedNr = nrList.map(r => ({
            id: r.id,
            name: r.name,
            trigger: r.trigger,
            channels: r.channels || 'SMS + Email',
            rec: r.recipient || r.rec || 'Customer & Accounts',
            priority: r.priority || 'High',
            status: r.status || 'Enabled'
          }));
          setNotificationRulesList(mappedNr);
        }
      }

      if (recipientGroupsRes && recipientGroupsRes.status === 'fulfilled') {
        const rgData = recipientGroupsRes.value.data?.data || recipientGroupsRes.value.data;
        const rgList = Array.isArray(rgData) ? rgData : (rgData.items || []);
        if (rgList.length > 0) {
          const mappedRg = rgList.map(g => ({
            id: g.id,
            name: g.name,
            count: g.count || '0 members',
            desc: g.description || g.desc || 'Custom distribution group list.',
            status: g.status || 'Active'
          }));
          setRecipientGroupsList(mappedRg);
        }
      }

      if (auditRes.status === 'fulfilled') {
        const aData = auditRes.value.data?.data?.logs || auditRes.value.data?.logs;
        if (Array.isArray(aData)) {
          const mappedLogs = aData.map((a) => ({
            id: a.id,
            time: a.createdAt ? new Date(a.createdAt).toLocaleString() : '',
            name: a.operator || 'System',
            email: '',
            avatar: (a.operator || 'S').slice(0, 2).toUpperCase(),
            bg: 'bg-purple-600',
            type: 'System Event',
            typeBg: 'bg-blue-100 text-blue-700',
            action: a.action,
            module: 'Settings',
            details: a.action,
            ip: a.ipAddress || '127.0.0.1',
            outcome: 'Success',
            outcomeColor: 'text-emerald-600'
          }));
          setAuditLogsData(mappedLogs);
        } else {
          setAuditLogsData([]);
        }
      } else {
        setAuditLogsData([]);
      }
    } catch (err) {
      console.error('Error loading company settings:', err);
    } finally {
      setLoadingSettings(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanySettings();
  }, [fetchCompanySettings]);


  // Form State for 13.2 Company Settings
  const [companyDetails, setCompanyDetails] = useState({
    companyName: '',
    tradingName: '',
    abn: '',
    acn: '',
    registeredAddress: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    startDate: '',
    description: ''
  });

  const [contactDetails, setContactDetails] = useState({
    name: '',
    position: '',
    phone: '',
    email: ''
  });

  const [businessHours, setBusinessHours] = useState({
    timeZone: '(AEST) Australia/Sydney',
    start: '07:00 AM',
    end: '05:00 PM',
    weekStart: 'Monday'
  });

  const [defaultBranch, setDefaultBranch] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });

  const [taxCompliance, setTaxCompliance] = useState({
    gstRegistered: false,
    gstDate: '',
    tfn: '',
    payg: '',
    workersComp: false,
    workersPolicy: '',
    publicLiability: '',
    publicPolicy: ''
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

  const [usersList, setUsersList] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);

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

  const [rolesList, setRolesList] = useState([]);

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

  const [workflowRulesList, setWorkflowRulesList] = useState([]);

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
  const [activeAiFeatureMenuId, setActiveAiFeatureMenuId] = useState(null);
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
    { id: 1, name: 'GPT-4o (OpenAI)', provider: 'OpenAI', version: '4o-2024-05-13', latency: '320ms', cost: '$0.005 / 1k tokens', status: 'Active Default', lastUpdated: '28 May 2025' },
    { id: 2, name: 'Hero AI Custom v1.3', provider: 'Hero AI', version: 'v1.3.2-prod', latency: '88ms', cost: '$0.001 / 1k tokens', status: 'Active Default', lastUpdated: '20 May 2025' },
    { id: 3, name: 'Azure Form OCR', provider: 'Microsoft', version: 'v3.2.0', latency: '140ms', cost: '$0.002 / doc', status: 'Active Default', lastUpdated: '18 May 2025' },
    { id: 4, name: 'Hero AI Mini', provider: 'Hero AI', version: 'v1.1', latency: '65ms', cost: '$0.0005 / 1k tokens', status: 'Active', lastUpdated: '15 May 2025' },
  ]);

  const [isRegisterAiModelModalOpen, setIsRegisterAiModelModalOpen] = useState(false);
  const [newAiModelForm, setNewAiModelForm] = useState({
    name: '',
    provider: 'OpenAI',
    version: 'v1.0',
    latency: '120ms',
    cost: '$0.002 / 1k tokens'
  });

  const handleRegisterAiModelSubmit = async (e) => {
    e.preventDefault();
    if (!newAiModelForm.name || !newAiModelForm.name.trim()) {
      triggerToast('Please enter an AI Model name');
      return;
    }

    try {
      const res = await api.post('/ai-models', {
        name: newAiModelForm.name,
        provider: newAiModelForm.provider,
        version: newAiModelForm.version,
        latencySla: newAiModelForm.latency || '120ms',
        costRate: newAiModelForm.cost || '$0.002 / 1k tokens',
        status: 'Active'
      });

      const createdModel = res.data?.data || res.data;
      if (createdModel && createdModel.id) {
        const mappedModel = {
          id: createdModel.id,
          name: createdModel.name,
          provider: createdModel.provider || 'OpenAI',
          version: createdModel.version || 'v1.0',
          latency: createdModel.latencySla || '120ms',
          cost: createdModel.costRate || '$0.002 / 1k tokens',
          status: createdModel.status || 'Active',
          lastUpdated: createdModel.lastUpdated || 'Just now'
        };
        setAiModelsList(prev => [mappedModel, ...prev]);
      }

      setNewAiModelForm({ name: '', provider: 'OpenAI', version: 'v1.0', latency: '120ms', cost: '$0.002 / 1k tokens' });
      setIsRegisterAiModelModalOpen(false);
      triggerToast(`AI Model "${newAiModelForm.name}" registered & deployed successfully!`);
    } catch (err) {
      console.error('Error registering AI model:', err);
      const errMsg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to register AI model. Please try again.';
      triggerToast(errMsg);
    }
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
  const [selectedAuditLog, setSelectedAuditLog] = useState(null);
  const [openLogDropdownId, setOpenLogDropdownId] = useState(null);

  const [auditLogsData, setAuditLogsData] = useState([]);

  const handleDeleteAuditLog = (logId) => {
    if (window.confirm("Are you sure you want to delete this security audit log record?")) {
      setAuditLogsData(prev => prev.filter(item => item.id !== logId));
      triggerToast("Security log record deleted successfully!");
    }
  };

  const [editingAuditLog, setEditingAuditLog] = useState(null);
  const [editLogForm, setEditLogForm] = useState({
    action: '',
    module: '',
    details: '',
    outcome: 'Success'
  });

  const handleOpenEditAuditLogModal = (log) => {
    setEditingAuditLog(log);
    setEditLogForm({
      action: log.action || '',
      module: log.module || 'Authentication',
      details: log.details || '',
      outcome: log.outcome || 'Success'
    });
  };

  const handleSaveEditAuditLogSubmit = (e) => {
    e.preventDefault();
    if (!editingAuditLog) return;

    let outcomeColor = 'text-emerald-600';
    if (editLogForm.outcome === 'Failed') outcomeColor = 'text-rose-600';
    if (editLogForm.outcome === 'Blocked') outcomeColor = 'text-amber-600';

    setAuditLogsData(prev => prev.map(item => item.id === editingAuditLog.id ? {
      ...item,
      action: editLogForm.action,
      module: editLogForm.module,
      details: editLogForm.details,
      outcome: editLogForm.outcome,
      outcomeColor: outcomeColor
    } : item));

    setEditingAuditLog(null);
    triggerToast("Audit log record updated successfully!");
  };

  const [isSecuritySettingsModalOpen, setIsSecuritySettingsModalOpen] = useState(false);
  const [securitySettingsForm, setSecuritySettingsForm] = useState({
    retentionDays: '90 Days',
    twoFactorAuth: true,
    ipWhitelisting: false,
    sessionTimeout: '30 Minutes',
    auditAlerts: true
  });

  const handleSaveSecuritySettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/company-admin/security-settings', {
        retentionDays: securitySettingsForm.retentionDays,
        sessionTimeout: securitySettingsForm.sessionTimeout,
        twoFactorAuth: securitySettingsForm.twoFactorAuth,
        ipWhitelisting: securitySettingsForm.ipWhitelisting,
        auditAlerts: securitySettingsForm.auditAlerts
      });

      const updated = res.data?.data?.securitySettings || res.data?.securitySettings;
      if (updated) {
        setSecuritySettingsForm({
          retentionDays: updated.retentionDays || securitySettingsForm.retentionDays,
          sessionTimeout: updated.sessionTimeout || securitySettingsForm.sessionTimeout,
          twoFactorAuth: updated.twoFactorAuth !== undefined ? updated.twoFactorAuth : securitySettingsForm.twoFactorAuth,
          ipWhitelisting: updated.ipWhitelisting !== undefined ? updated.ipWhitelisting : securitySettingsForm.ipWhitelisting,
          auditAlerts: updated.auditAlerts !== undefined ? updated.auditAlerts : securitySettingsForm.auditAlerts
        });
      }

      setIsSecuritySettingsModalOpen(false);
      triggerToast('Security & Retention Settings saved successfully!');
    } catch (err) {
      console.error('Error saving security settings:', err);
      const errMsg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to save security settings.';
      triggerToast(errMsg);
    }
  };

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


  // Subscription & Billing State (13.9)
  const [isRefreshingBilling, setIsRefreshingBilling] = useState(false);
  const [isManageSubscriptionModalOpen, setIsManageSubscriptionModalOpen] = useState(false);
  const [billingData, setBillingData] = useState(null);
  const [billingDataLoading, setBillingDataLoading] = useState(false);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [isSubmittingSubscription, setIsSubmittingSubscription] = useState(false);
  const [manageSubscriptionForm, setManageSubscriptionForm] = useState({
    plan: '',
    planId: '',
    billingCycle: 'MONTHLY',
    userSeats: 50,
    aiAddon: false,
    reportingAddon: false,
    smsAddon: false
  });

  const fetchSubscriptionBilling = useCallback(async () => {
    try {
      setBillingDataLoading(true);
      const res = await api.get('/company-admin/subscription-billing');
      const data = res.data?.data || res.data;
      setBillingData(data);
      // Pre-fill modal form from live data
      if (data?.plan) {
        setManageSubscriptionForm(prev => ({
          ...prev,
          plan: data.plan.name,
          planId: data.plan.id,
          billingCycle: data.subscription?.billingPeriod || 'MONTHLY',
          aiAddon: data.addons?.find(a => a.name?.toLowerCase().includes('ai'))?.isEnabled || false,
          reportingAddon: data.addons?.find(a => a.name?.toLowerCase().includes('report'))?.isEnabled || false,
          smsAddon: data.addons?.find(a => a.name?.toLowerCase().includes('sms'))?.isEnabled || false,
        }));
      }
    } catch (err) {
      console.error('Failed to load subscription billing data:', err);
    } finally {
      setBillingDataLoading(false);
    }
  }, []);

  const fetchAvailablePlans = useCallback(async () => {
    try {
      const res = await api.get('/company-admin/subscription-billing/plans');
      const plans = res.data?.data || res.data || [];
      setAvailablePlans(plans);
      setManageSubscriptionForm(prev => ({
        ...prev,
        planId: prev.planId || plans[0]?.id || ''
      }));
    } catch (err) {
      console.error('Failed to load plans:', err);
    }
  }, []);

  useEffect(() => {
    if (currentView === 'subscription-billing') {
      fetchSubscriptionBilling();
      fetchAvailablePlans();
    }
  }, [currentView, fetchSubscriptionBilling, fetchAvailablePlans]);

  const handleRefreshBilling = async () => {
    setIsRefreshingBilling(true);
    triggerToast('Refreshing subscription plan & usage data...');
    await fetchSubscriptionBilling();
    setIsRefreshingBilling(false);
    triggerToast('Subscription & billing data updated!');
  };

  const handleDownloadStatement = () => {
    const records = billingData?.billingRecords || [];
    const headers = "InvoiceNumber,Date,Description,Amount,Tax,Status,PaymentMethod\n";
    const rows = records.map(r =>
      `"${r.invoiceNumber}","${r.date ? new Date(r.date).toLocaleDateString() : ''}","${r.planTierSnapshot || 'Subscription'}","$${r.amount?.toFixed(2)}","$${(r.taxAmount || 0).toFixed(2)}","${r.status}","${r.paymentMethod || ''}"` 
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `billing_statement_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    triggerToast('Billing statement downloaded successfully!');
  };

  const handleDownloadSingleInvoice = (inv) => {
    const invNum = typeof inv === 'string' ? inv : (inv.invoiceNumber || inv);
    const amt = inv.amount ? `$${Number(inv.amount).toFixed(2)}` : '';
    const tax = inv.taxAmount ? `$${Number(inv.taxAmount).toFixed(2)}` : '';
    const content = `Invoice Number: ${invNum}\nDate: ${inv.date ? new Date(inv.date).toLocaleDateString() : ''}\nPlan: ${inv.planTierSnapshot || 'Subscription'}\nAmount: ${amt}\nTax (10%): ${tax}\nStatus: ${inv.status || 'PAID'}\nPayment Method: ${inv.paymentMethod || ''}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invNum}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    triggerToast(`Invoice ${invNum} downloaded successfully!`);
  };

  const handleSaveManageSubscriptionSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingSubscription(true);
    const targetPlanId = manageSubscriptionForm.planId || billingData?.plan?.id || availablePlans[0]?.id;
    try {
      await api.put('/company-admin/subscription-billing/plan', {
        planId: targetPlanId || undefined,
        billingPeriod: manageSubscriptionForm.billingCycle,
        addonIds: [],
      });
      triggerToast('Subscription plan updated successfully!');
      setIsManageSubscriptionModalOpen(false);
      await fetchSubscriptionBilling();
    } catch (err) {
      triggerToast('Failed to update subscription. Please try again.');
      console.error('Subscription update error:', err);
    } finally {
      setIsSubmittingSubscription(false);
    }
  };

  // Company Settings 13.2 Handlers
  const [isRefreshingCompanySettings, setIsRefreshingCompanySettings] = useState(false);

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

  const handleCreateWorkflowRuleSubmit = async (e) => {
    e.preventDefault();
    if (!newWorkflowRuleForm.name) {
      triggerToast('Please enter a rule name!');
      return;
    }

    try {
      const res = await api.post('/workflow-rules', {
        name: newWorkflowRuleForm.name,
        desc: newWorkflowRuleForm.desc || 'Automated workflow rule',
        category: newWorkflowRuleForm.category,
        trigger: newWorkflowRuleForm.trigger,
        action: newWorkflowRuleForm.action,
        status: newWorkflowRuleForm.status
      });

      const createdData = res.data?.data || res.data;
      const newRule = {
        id: createdData.id || Date.now(),
        name: createdData.name || newWorkflowRuleForm.name,
        desc: createdData.description || newWorkflowRuleForm.desc || 'Automated workflow rule',
        category: createdData.category || newWorkflowRuleForm.category,
        categoryColor: getCategoryBadgeColor(createdData.category || newWorkflowRuleForm.category),
        trigger: createdData.trigger || newWorkflowRuleForm.trigger,
        action: createdData.action || newWorkflowRuleForm.action,
        status: createdData.status || newWorkflowRuleForm.status,
        lastExecuted: createdData.lastExecuted || 'Never',
        executions: createdData.executions || 0,
        createdBy: createdData.createdBy || 'Sarah Mitchell',
        createdOn: createdData.createdAt ? new Date(createdData.createdAt).toLocaleDateString() : 'Today',
        lastModified: 'Just Now'
      };

      setWorkflowRulesList(prev => [newRule, ...prev]);
      setSelectedWorkflowRule(newRule);
      setIsCreateWorkflowRuleModalOpen(false);
      setNewWorkflowRuleForm({ name: '', desc: '', category: 'Invoice Automation', trigger: 'Load Status: Delivered', action: 'Create Invoice & Notify Accounts', status: 'Active' });
      triggerToast(`Workflow Rule "${newRule.name}" created successfully!`);
    } catch (err) {
      console.error('Error creating workflow rule:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error?.message || 'Failed to create workflow rule. Please try again.';
      triggerToast(errMsg);
    }
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

  const handleEditWorkflowRuleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/workflow-rules/${editWorkflowRuleForm.id}`, {
        name: editWorkflowRuleForm.name,
        desc: editWorkflowRuleForm.desc,
        category: editWorkflowRuleForm.category,
        trigger: editWorkflowRuleForm.trigger,
        action: editWorkflowRuleForm.action,
        status: editWorkflowRuleForm.status
      });

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
          if (selectedWorkflowRule?.id === r.id) setSelectedWorkflowRule(item);
          return item;
        }
        return r;
      });

      setWorkflowRulesList(updated);
      setIsEditWorkflowRuleModalOpen(false);
      triggerToast('Workflow rule updated successfully!');
    } catch (err) {
      console.error('Error updating workflow rule:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error?.message || 'Failed to update workflow rule.';
      triggerToast(errMsg);
    }
  };

  const handleDeleteWorkflowRule = async (ruleObj) => {
    if (workflowRulesList.length <= 1) {
      triggerToast('Cannot delete the only remaining workflow rule!');
      return;
    }
    try {
      await api.delete(`/workflow-rules/${ruleObj.id}`);
      const updated = workflowRulesList.filter(r => r.id !== ruleObj.id);
      setWorkflowRulesList(updated);
      if (selectedWorkflowRule?.id === ruleObj.id) setSelectedWorkflowRule(updated[0]);
      setActiveRuleRowMenuId(null);
      triggerToast(`Rule "${ruleObj.name}" deleted.`);
    } catch (err) {
      console.error('Error deleting workflow rule:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error?.message || 'Failed to delete workflow rule.';
      triggerToast(errMsg);
    }
  };

  const handleToggleWorkflowRuleStatus = async (ruleObj) => {
    const newStatus = ruleObj.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await api.put(`/workflow-rules/${ruleObj.id}`, { status: newStatus });
      const updated = workflowRulesList.map(r => {
        if (r.id === ruleObj.id) {
          const item = { ...r, status: newStatus };
          if (selectedWorkflowRule?.id === r.id) setSelectedWorkflowRule(item);
          return item;
        }
        return r;
      });
      setWorkflowRulesList(updated);
      setActiveRuleRowMenuId(null);
      triggerToast(`Rule "${ruleObj.name}" status set to ${newStatus}.`);
    } catch (err) {
      console.error('Error toggling rule status:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error?.message || 'Failed to update status.';
      triggerToast(errMsg);
    }
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
      case 'Warehouse Manager': return 'bg-orange-100 text-orange-800';
      case 'Driver': return 'bg-emerald-100 text-emerald-800';
      case 'Customer User': return 'bg-pink-100 text-pink-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) {
      triggerToast('Please fill in required fields (Name & Email)');
      return;
    }

    try {
      const res = await api.post('/users', {
        name: newUserForm.name,
        email: newUserForm.email,
        role: newUserForm.role,
        branch: newUserForm.branch,
        phone: newUserForm.phone,
        status: newUserForm.status
      });

      const createdData = res.data?.data || res.data;
      const initials = (createdData.name || newUserForm.name).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US';
      const newEntry = {
        id: createdData.id || Date.now(),
        name: createdData.name || newUserForm.name,
        email: createdData.email || newUserForm.email,
        role: newUserForm.role,
        roleColor: getRoleBadgeColor(newUserForm.role),
        branch: newUserForm.branch || 'Sydney',
        status: newUserForm.status || 'Active',
        lastLogin: 'Never',
        joined: 'Just Now',
        phone: createdData.phone || newUserForm.phone || '+61 400 000 000',
        avatar: initials,
        avatarBg: 'bg-[#2563EB]'
      };

      setUsersList(prev => [newEntry, ...prev]);
      setSelectedUser(newEntry);
      setIsAddModalOpen(false);
      setNewUserForm({ name: '', email: '', role: 'Admin', branch: 'Sydney', status: 'Active', phone: '' });
      triggerToast(`User "${newEntry.name}" created successfully!`);
    } catch (err) {
      console.error('Error creating user:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error?.message || 'Failed to create user. Please try again.';
      triggerToast(errMsg);
    }
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

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/users/${editUserForm.id}`, {
        name: editUserForm.name,
        email: editUserForm.email,
        role: editUserForm.role,
        branch: editUserForm.branch,
        phone: editUserForm.phone,
        status: editUserForm.status
      });

      const initials = editUserForm.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US';

      const updatedList = usersList.map(u => {
        if (u.id === editUserForm.id) {
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
          if (selectedUser?.id === u.id) {
            setSelectedUser(updated);
          }
          return updated;
        }
        return u;
      });

      setUsersList(updatedList);
      setIsEditModalOpen(false);
      triggerToast('User details updated successfully!');
    } catch (err) {
      console.error('Error updating user:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error?.message || 'Failed to update user.';
      triggerToast(errMsg);
    }
  };

  const handleDeleteUser = async (userObj) => {
    if (usersList.length <= 1) {
      triggerToast('Cannot delete the only remaining user!');
      return;
    }
    try {
      await api.delete(`/users/${userObj.id}`);
      const updated = usersList.filter(u => u.id !== userObj.id);
      setUsersList(updated);
      if (selectedUser?.id === userObj.id) {
        setSelectedUser(updated[0]);
      }
      setActiveRowMenuId(null);
      triggerToast(`User "${userObj.name}" deleted.`);
    } catch (err) {
      console.error('Error deleting user:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error?.message || 'Failed to delete user.';
      triggerToast(errMsg);
    }
  };

  const handleToggleUserStatus = async (userObj) => {
    const newStatus = userObj.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await api.put(`/users/${userObj.id}`, { status: newStatus });
      const updated = usersList.map(u => {
        if (u.id === userObj.id) {
          const item = { ...u, status: newStatus };
          if (selectedUser?.id === u.id) setSelectedUser(item);
          return item;
        }
        return u;
      });
      setUsersList(updated);
      setActiveRowMenuId(null);
      triggerToast(`User "${userObj.name}" status updated to ${newStatus}.`);
    } catch (err) {
      console.error('Error updating status:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error?.message || 'Failed to update status.';
      triggerToast(errMsg);
    }
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
      <div className="flex flex-row flex-nowrap items-center justify-between gap-2 w-full overflow-visible relative z-20 whitespace-nowrap pb-1 sm:pb-0 pr-2 sm:pr-4">
        <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold text-[#2563EB] min-w-0 flex-1 truncate overflow-hidden max-w-[calc(100%-220px)] sm:max-w-none">
          <span onClick={() => setCurrentView('dashboard')} className="hover:underline cursor-pointer shrink-0">Home</span>
          <span className="text-[#2563EB] font-semibold shrink-0">›</span>
          <span onClick={() => setCurrentView('dashboard')} className="hover:underline cursor-pointer shrink-0">Settings</span>
          <span className="text-[#2563EB] font-semibold shrink-0">›</span>
          <span className="text-[#2563EB] font-bold truncate">
            {currentView === 'company-settings' ? 'Company Settings' : currentView === 'users-permissions' ? 'Users, Roles & Permissions' : currentView === 'workflow-rules' ? 'Workflow & Automation Rules' : currentView === 'ai-configuration' ? 'AI Configuration' : currentView === 'integrations' ? 'Integrations' : currentView === 'notifications' ? 'Notifications & Communication Settings' : currentView === 'security-audit-logs' ? 'Security & Audit Logs' : currentView === 'subscription-billing' ? 'Subscription & Billing' : 'Dashboard'}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-nowrap ml-auto pr-1">
          <button
            onClick={() => triggerToast('Opening Help & Support documentation...')}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#2563EB] hover:underline transition-colors cursor-pointer whitespace-nowrap"
          >
            <HelpCircle size={14} className="text-[#2563EB]" />
            <span className="hidden sm:inline">Need help?</span>
          </button>

          {/* Notification Bell with Red Badge 10 */}
          <div className="relative cursor-pointer shrink-0" onClick={() => triggerToast('10 new notifications')}>
            <Bell size={17} className="text-slate-700 hover:text-blue-600 transition-colors" />
            <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[8.5px] font-black px-1 py-0.2 rounded-full border border-white leading-none shadow-2xs">
              10
            </span>
          </div>

          {/* Avatar Circle SM */}
          <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-slate-900 text-white font-black text-[10px] sm:text-xs flex items-center justify-center shadow-xs cursor-pointer shrink-0" title="Sarah Mitchell (Super Admin)">
            SM
          </div>

          {/* More Actions Dropdown Button & Menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsMoreActionsDropdownOpen(!isMoreActionsDropdownOpen)}
              className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-700 bg-white border border-slate-200/90 px-2.5 sm:px-3 py-1 rounded-xl shadow-2xs hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>More Actions</span>
              <ChevronDown size={12} className={`text-slate-500 transition-transform ${isMoreActionsDropdownOpen ? 'rotate-180' : ''}`} />
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
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none">
                Settings Dashboard
              </h1>
              <div className="w-5 h-5 rounded-md border border-purple-200 bg-purple-50 text-purple-600 flex items-center justify-center cursor-pointer hover:bg-purple-100 transition-colors">
                <Bookmark size={11} />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              Manage system configuration, users, integrations and platform settings.
            </p>
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
                    <span className="text-base font-black text-slate-900">{dashboardStats.setupPercent}%</span>
                    <span className="text-[9.5px] font-bold text-emerald-600">Complete</span>
                  </div>
                </div>
              </div>
              <div className="mt-1">
                <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                  <div className="bg-[#2563EB] h-1 rounded-full transition-all" style={{ width: `${dashboardStats.setupPercent}%` }}></div>
                </div>
                <p className="text-[8px] font-semibold text-slate-400 mt-1 leading-none">Last updated: {dashboardStats.lastUpdated}</p>
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
                    <span className="text-base font-black text-slate-900">{usersList.length}</span>
                    <span className="text-[9.5px] font-bold text-slate-600">Users</span>
                  </div>
                  <p className="text-[8.5px] font-extrabold text-emerald-600 leading-none mt-0.5">0.0% <span className="font-semibold text-slate-400">vs Last Month</span></p>
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
                    <span className="text-base font-black text-slate-900">{dashboardStats.branchesCount}</span>
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
                    <span className="text-base font-black text-slate-900">{dashboardStats.integrationsCount}</span>
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
                    <p className="text-sm font-black text-slate-900 mt-0.5">{dashboardStats.userActivity.logins}</p>
                    <p className="text-[8px] font-bold text-emerald-600">0.0%</p>
                  </div>
                  <div className="bg-slate-50/70 p-1.5 rounded-lg border border-slate-100">
                    <p className="text-[8px] font-bold text-slate-400 uppercase">New Users</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">{dashboardStats.userActivity.newUsers}</p>
                    <p className="text-[8px] font-bold text-emerald-600">0.0%</p>
                  </div>
                  <div className="bg-slate-50/70 p-1.5 rounded-lg border border-slate-100">
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Role Changes</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">{dashboardStats.userActivity.roleChanges}</p>
                    <p className="text-[8px] font-bold text-emerald-600">0.0%</p>
                  </div>
                  <div className="bg-slate-50/70 p-1.5 rounded-lg border border-slate-100">
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Permission Changes</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">{dashboardStats.userActivity.permissionChanges}</p>
                    <p className="text-[8px] font-bold text-emerald-600">0.0%</p>
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
                    <span className="text-slate-500 font-bold text-[9px]">{dashboardStats.lastUpdated}</span>
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
                  Company Settings
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
          <div className="flex items-center gap-2 border-b border-slate-200/80 overflow-x-auto pb-3 pt-1 scrollbar-hide">
            {[
              'Company Details', 'Branding', 'Financial & Tax',
              'Operational Defaults', 'Payment Terms', 'Document Numbering', 'Other Preferences'
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 text-xs font-black whitespace-nowrap transition-all rounded-xl cursor-pointer outline-none focus:outline-none focus:ring-0 select-none ${activeTab === tab
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/60 font-bold'
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
                        onChange={e => setCompanyDetails({ ...companyDetails, companyName: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Trading Name</label>
                      <input
                        type="text"
                        value={companyDetails.tradingName}
                        onChange={e => setCompanyDetails({ ...companyDetails, tradingName: e.target.value })}
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
                        onChange={e => setCompanyDetails({ ...companyDetails, abn: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">ACN</label>
                      <input
                        type="text"
                        value={companyDetails.acn}
                        onChange={e => setCompanyDetails({ ...companyDetails, acn: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Registered Address *</label>
                    <input
                      type="text"
                      value={companyDetails.registeredAddress}
                      onChange={e => setCompanyDetails({ ...companyDetails, registeredAddress: e.target.value })}
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
                        onChange={e => setCompanyDetails({ ...companyDetails, city: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">State *</label>
                      <select
                        value={companyDetails.state}
                        onChange={e => setCompanyDetails({ ...companyDetails, state: e.target.value })}
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
                        onChange={e => setCompanyDetails({ ...companyDetails, postcode: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Country *</label>
                      <select
                        value={companyDetails.country}
                        onChange={e => setCompanyDetails({ ...companyDetails, country: e.target.value })}
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
                        onChange={e => setCompanyDetails({ ...companyDetails, phone: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div className="col-span-7">
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Email *</label>
                      <input
                        type="email"
                        value={companyDetails.email}
                        onChange={e => setCompanyDetails({ ...companyDetails, email: e.target.value })}
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
                        onChange={e => setCompanyDetails({ ...companyDetails, website: e.target.value })}
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
                      onChange={e => setCompanyDetails({ ...companyDetails, description: e.target.value })}
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
                        onClick={() => setTaxCompliance({ ...taxCompliance, gstRegistered: !taxCompliance.gstRegistered })}
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
                      <input type="text" value={taxCompliance.tfn} onChange={e => setTaxCompliance({ ...taxCompliance, tfn: e.target.value })} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3.5 items-center pt-2 border-t border-slate-100">
                    <div>
                      <label className="text-[9.5px] font-bold text-slate-700 block mb-1">Pay As You Go (PAYG) Withholding</label>
                      <input type="text" value={taxCompliance.payg} onChange={e => setTaxCompliance({ ...taxCompliance, payg: e.target.value })} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="text-[9.5px] font-bold text-slate-700 block mb-1">Workers Compensation Insurer</label>
                      <button
                        type="button"
                        onClick={() => setTaxCompliance({ ...taxCompliance, workersComp: !taxCompliance.workersComp })}
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
                      <input type="text" value={taxCompliance.workersPolicy} onChange={e => setTaxCompliance({ ...taxCompliance, workersPolicy: e.target.value })} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Public Liability Insurer</label>
                      <input type="text" value={taxCompliance.publicLiability} onChange={e => setTaxCompliance({ ...taxCompliance, publicLiability: e.target.value })} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Public Liability Policy No.</label>
                      <input type="text" value={taxCompliance.publicPolicy} onChange={e => setTaxCompliance({ ...taxCompliance, publicPolicy: e.target.value })} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
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
                      onChange={e => setContactDetails({ ...contactDetails, name: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Position</label>
                    <input
                      type="text"
                      value={contactDetails.position}
                      onChange={e => setContactDetails({ ...contactDetails, position: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Phone *</label>
                    <input
                      type="text"
                      value={contactDetails.phone}
                      onChange={e => setContactDetails({ ...contactDetails, phone: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Email *</label>
                    <input
                      type="email"
                      value={contactDetails.email}
                      onChange={e => setContactDetails({ ...contactDetails, email: e.target.value })}
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
                      onChange={e => setBusinessHours({ ...businessHours, timeZone: e.target.value })}
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
                        onChange={e => setBusinessHours({ ...businessHours, start: e.target.value })}
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
                        onChange={e => setBusinessHours({ ...businessHours, end: e.target.value })}
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
                      onChange={e => setBusinessHours({ ...businessHours, weekStart: e.target.value })}
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
                      onChange={e => setDefaultBranch({ ...defaultBranch, name: e.target.value })}
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
                          onChange={e => setBranding({ ...branding, primary: e.target.value.toUpperCase() })}
                          className="w-4 h-4 rounded border-0 cursor-pointer p-0 shrink-0"
                        />
                        <input
                          type="text"
                          value={branding.primary}
                          onChange={e => setBranding({ ...branding, primary: e.target.value })}
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
                          onChange={e => setBranding({ ...branding, secondary: e.target.value.toUpperCase() })}
                          className="w-4 h-4 rounded border-0 cursor-pointer p-0 shrink-0"
                        />
                        <input
                          type="text"
                          value={branding.secondary}
                          onChange={e => setBranding({ ...branding, secondary: e.target.value })}
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
                        onChange={e => setBranding({ ...branding, accent: e.target.value.toUpperCase() })}
                        className="w-4 h-4 rounded border-0 cursor-pointer p-0 shrink-0"
                      />
                      <input
                        type="text"
                        value={branding.accent}
                        onChange={e => setBranding({ ...branding, accent: e.target.value })}
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
                      <select value={financials.currency} onChange={e => setFinancials({ ...financials, currency: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer">
                        <option value="AUD - Australian Dollar ($)">AUD - Australian Dollar ($)</option>
                        <option value="USD - US Dollar ($)">USD - US Dollar ($)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">Default Tax Rate (GST) *</label>
                      <select value={financials.taxRate} onChange={e => setFinancials({ ...financials, taxRate: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer">
                        <option value="10%">10%</option>
                        <option value="15%">15%</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">Tax Calculation Method</label>
                      <select value={financials.method} onChange={e => setFinancials({ ...financials, method: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer">
                        <option value="Exclusive">Exclusive</option>
                        <option value="Inclusive">Inclusive</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">Rounding</label>
                      <select value={financials.rounding} onChange={e => setFinancials({ ...financials, rounding: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer">
                        <option value="2 Decimal Places">2 Decimal Places</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">Default Payment Terms</label>
                      <select value={financials.paymentTerms} onChange={e => setFinancials({ ...financials, paymentTerms: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer">
                        <option value="30 Days">30 Days</option>
                        <option value="14 Days">14 Days</option>
                        <option value="7 Days">7 Days</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">Price List</label>
                      <select value={financials.priceList} onChange={e => setFinancials({ ...financials, priceList: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer">
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
                      onClick={() => setFinancials({ ...financials, pricesIncludeTax: !financials.pricesIncludeTax })}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${financials.pricesIncludeTax ? 'bg-blue-600' : 'bg-slate-200'
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
                        <input type="color" value={branding.primary.length === 7 ? branding.primary : '#1E3ABA'} onChange={e => setBranding({ ...branding, primary: e.target.value.toUpperCase() })} className="w-10 h-10 rounded-lg border-0 cursor-pointer shadow-3xs" />
                        <input type="text" value={branding.primary} onChange={e => setBranding({ ...branding, primary: e.target.value })} className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 w-36 uppercase" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Secondary Theme Color</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={branding.secondary.length === 7 ? branding.secondary : '#6356F1'} onChange={e => setBranding({ ...branding, secondary: e.target.value.toUpperCase() })} className="w-10 h-10 rounded-lg border-0 cursor-pointer shadow-3xs" />
                        <input type="text" value={branding.secondary} onChange={e => setBranding({ ...branding, secondary: e.target.value })} className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 w-36 uppercase" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Accent Highlight Color</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={branding.accent.length === 7 ? branding.accent : '#F59E0B'} onChange={e => setBranding({ ...branding, accent: e.target.value.toUpperCase() })} className="w-10 h-10 rounded-lg border-0 cursor-pointer shadow-3xs" />
                        <input type="text" value={branding.accent} onChange={e => setBranding({ ...branding, accent: e.target.value })} className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 w-36 uppercase" />
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
                  <select value={financials.currency} onChange={e => setFinancials({ ...financials, currency: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer">
                    <option value="AUD - Australian Dollar ($)">AUD - Australian Dollar ($)</option>
                    <option value="USD - US Dollar ($)">USD - US Dollar ($)</option>
                    <option value="NZD - NZ Dollar ($)">NZD - NZ Dollar ($)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Default Tax Rate (GST) *</label>
                  <select value={financials.taxRate} onChange={e => setFinancials({ ...financials, taxRate: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer">
                    <option value="10%">10% Standard GST</option>
                    <option value="15%">15% NZ GST</option>
                    <option value="0%">0% GST Free</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Tax Calculation Method</label>
                  <select value={financials.method} onChange={e => setFinancials({ ...financials, method: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer">
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
                      onClick={() => setOperationalDefaults({ ...operationalDefaults, autoAssignDrivers: !operationalDefaults.autoAssignDrivers })}
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
                      onChange={e => setOperationalDefaults({ ...operationalDefaults, maxDrivingHours: e.target.value })}
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
                      onChange={e => setOperationalDefaults({ ...operationalDefaults, breakMandatory: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Telematics Speed Limit Alert</label>
                    <input
                      type="text"
                      value={operationalDefaults.speedLimitAlert}
                      onChange={e => setOperationalDefaults({ ...operationalDefaults, speedLimitAlert: e.target.value })}
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
                    <select value={paymentTermsState.defaultCreditPeriod} onChange={e => setPaymentTermsState({ ...paymentTermsState, defaultCreditPeriod: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer">
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
                      onChange={e => setPaymentTermsState({ ...paymentTermsState, remittanceEmail: e.target.value })}
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
                        onChange={e => setPaymentTermsState({ ...paymentTermsState, bsb: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Account Number</label>
                      <input
                        type="text"
                        value={paymentTermsState.accountNumber}
                        onChange={e => setPaymentTermsState({ ...paymentTermsState, accountNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Bank Name</label>
                    <input
                      type="text"
                      value={paymentTermsState.bankName}
                      onChange={e => setPaymentTermsState({ ...paymentTermsState, bankName: e.target.value })}
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
                      <input type="text" value={docNumbering.invPrefix} onChange={e => setDocNumbering({ ...docNumbering, invPrefix: e.target.value })} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Next Number</label>
                      <input type="text" value={docNumbering.invNext} onChange={e => setDocNumbering({ ...docNumbering, invNext: e.target.value })} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
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
                      <input type="text" value={docNumbering.podPrefix} onChange={e => setDocNumbering({ ...docNumbering, podPrefix: e.target.value })} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Next Number</label>
                      <input type="text" value={docNumbering.podNext} onChange={e => setDocNumbering({ ...docNumbering, podNext: e.target.value })} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
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
                      <input type="text" value={docNumbering.qtePrefix} onChange={e => setDocNumbering({ ...docNumbering, qtePrefix: e.target.value })} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Next Number</label>
                      <input type="text" value={docNumbering.qteNext} onChange={e => setDocNumbering({ ...docNumbering, qteNext: e.target.value })} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
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
                      <input type="text" value={docNumbering.conPrefix} onChange={e => setDocNumbering({ ...docNumbering, conPrefix: e.target.value })} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Next Number</label>
                      <input type="text" value={docNumbering.conNext} onChange={e => setDocNumbering({ ...docNumbering, conNext: e.target.value })} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" />
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
                  <select value={otherPreferences.dateFormat} onChange={e => setOtherPreferences({ ...otherPreferences, dateFormat: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer">
                    <option value="DD/MM/YYYY">DD/MM/YYYY (Australian Standard)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (US Format)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Format)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Measurement Units</label>
                  <select value={otherPreferences.units} onChange={e => setOtherPreferences({ ...otherPreferences, units: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer">
                    <option value="Metric (km, kg, L)">Metric (km, kg, L)</option>
                    <option value="Imperial (mi, lbs, gal)">Imperial (mi, lbs, gal)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Audit Log Retention</label>
                  <select value={otherPreferences.auditLogRetention} onChange={e => setOtherPreferences({ ...otherPreferences, auditLogRetention: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer">
                    <option value="365 Days">365 Days (1 Year)</option>
                    <option value="730 Days">730 Days (2 Years)</option>
                    <option value="Permanent">Permanent Archival</option>
                  </select>
                </div>
              </div>
            </div>
          )}



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
                  Users, Roles & Permissions
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
          <div className="flex items-center gap-2 border-b border-slate-200/80 overflow-x-auto pb-3 pt-1 scrollbar-hide">
            {['Users', 'Roles', 'Permissions', 'Branch Access', 'Login & Security', 'Activity Log'].map((tab) => (
              <button
                key={tab}
                onClick={() => setUsersTab(tab)}
                className={`px-3.5 py-1.5 text-xs font-black whitespace-nowrap transition-all rounded-xl cursor-pointer outline-none focus:outline-none focus:ring-0 select-none ${usersTab === tab
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/60 font-bold'
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
                        <span className="text-base font-black text-slate-900">{usersList.length}</span>
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
                        <span className="text-base font-black text-slate-900">{usersList.filter(u => u.status === "Active" || u.status === "ACTIVE").length}</span>
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
                        <span className="text-base font-black text-slate-900">{usersList.filter(u => u.status === "Inactive" || u.status === "INACTIVE").length}</span>
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
                        <span className="text-base font-black text-slate-900">{usersList.filter(u => u.status === "Pending" || u.status === "PENDING").length}</span>
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
                        <span className="text-base font-black text-slate-900">{rolesList.length}</span>
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
                        <span className="text-base font-black text-slate-900">{rolesList.length * 3}</span>
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
                  Workflow & Automation Rules
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
          <div className="flex items-center gap-2 border-b border-slate-200/80 overflow-x-auto pb-3 pt-1 scrollbar-hide">
            {['Overview', 'Invoice Automation', 'Payment Reminders', 'Compliance Reminders', 'Load Status Actions', 'Customer Notifications', 'Approval Workflows'].map((tab) => (
              <button
                key={tab}
                onClick={() => setWorkflowTab(tab)}
                className={`px-3.5 py-1.5 text-xs font-black whitespace-nowrap transition-all rounded-xl cursor-pointer outline-none focus:outline-none focus:ring-0 select-none ${workflowTab === tab
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/60 font-bold'
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
                  AI Configuration
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
          <div className="flex items-center gap-2 border-b border-slate-200/80 overflow-x-auto pb-3 pt-1 scrollbar-hide">
            {['Overview', 'Feature Settings', 'AI Models', 'Data Sources', 'Automation', 'AI Prompts & Templates', 'Usage & Limits', 'Logs & Monitoring'].map((tab) => (
              <button
                key={tab}
                onClick={() => setAiTab(tab)}
                className={`px-3.5 py-1.5 text-xs font-black whitespace-nowrap transition-all rounded-xl cursor-pointer outline-none focus:outline-none focus:ring-0 select-none ${aiTab === tab
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/60 font-bold'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ===== TAB CONTENT ===== */}
          {aiTab === 'Overview' && (
            <>
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
                        <span className="text-xl font-black text-slate-900 leading-none">0</span>
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
                      <span className="text-xl font-black text-slate-900 block mt-1 leading-none">0</span>
                      <p className="text-[9px] font-extrabold text-slate-400 leading-none mt-1">0.0% <span className="font-semibold text-slate-400">vs Last Month</span></p>
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
                      <span className="text-xl font-black text-slate-900 block mt-1 leading-none">0</span>
                      <p className="text-[9px] font-extrabold text-slate-400 leading-none mt-1">0.0% <span className="font-semibold text-slate-400">vs Last Month</span></p>
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
                      <span className="text-xl font-black text-slate-900 block mt-1 leading-none">0</span>
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
                      <span className="text-xl font-black text-slate-900 block mt-1 leading-none">0.0%</span>
                      <p className="text-[9px] font-extrabold text-slate-400 leading-none mt-1">0.0% <span className="font-semibold text-slate-400">vs Last Month</span></p>
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
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold ${feat.status === 'Enabled' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-rose-100 text-rose-700'
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
                                className={`w-7.5 h-4 rounded-full transition-colors relative cursor-pointer inline-block align-middle ${feat.autoExecute ? 'bg-[#2563EB]' : 'bg-slate-300'
                                  }`}
                              >
                                <span className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${feat.autoExecute ? 'left-4' : 'left-0.5'
                                  }`}></span>
                              </button>
                            </td>

                            <td className="py-2 px-1 text-right whitespace-nowrap relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveAiFeatureMenuId(activeAiFeatureMenuId === feat.id ? null : feat.id);
                                }}
                                className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-slate-200/80 bg-white hover:bg-slate-100 hover:border-slate-300 text-slate-500 hover:text-slate-900 transition-all cursor-pointer outline-none focus:outline-none focus:ring-0 select-none shadow-2xs"
                              >
                                <MoreHorizontal size={13} />
                              </button>

                              {/* 3-DOT INTERACTIVE ACTION DROPDOWN MENU */}
                              {activeAiFeatureMenuId === feat.id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setActiveAiFeatureMenuId(null)}
                                  />
                                  <div
                                    className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-1.5 text-left space-y-1 animate-in fade-in zoom-in-95 duration-100"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">FEATURE ACTIONS</span>
                                      <span className="text-xs font-black text-slate-900 truncate block">{feat.name}</span>
                                    </div>

                                    {/* Action 1: Toggle Status */}
                                    <button
                                      onClick={() => {
                                        const nextStatus = feat.status === 'Enabled' ? 'Disabled' : 'Enabled';
                                        setAiFeaturesList(aiFeaturesList.map(f => f.id === feat.id ? { ...f, status: nextStatus } : f));
                                        triggerToast(`${feat.name} is now ${nextStatus}!`);
                                        setActiveAiFeatureMenuId(null);
                                      }}
                                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                                    >
                                      <span className="flex items-center gap-2">
                                        <Zap size={13} className={feat.status === 'Enabled' ? 'text-rose-500' : 'text-emerald-500'} />
                                        {feat.status === 'Enabled' ? 'Disable Feature' : 'Enable Feature'}
                                      </span>
                                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${feat.status === 'Enabled' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {feat.status === 'Enabled' ? 'OFF' : 'ON'}
                                      </span>
                                    </button>

                                    {/* Action 2: Toggle Auto Execute */}
                                    <button
                                      onClick={() => {
                                        const nextAuto = !feat.autoExecute;
                                        setAiFeaturesList(aiFeaturesList.map(f => f.id === feat.id ? { ...f, autoExecute: nextAuto } : f));
                                        triggerToast(`${feat.name} Auto-Execute set to ${nextAuto ? 'ENABLED' : 'DISABLED'}`);
                                        setActiveAiFeatureMenuId(null);
                                      }}
                                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer transition-colors"
                                    >
                                      <Sliders size={13} className="text-blue-500" />
                                      <span>Toggle Auto-Execute ({feat.autoExecute ? 'ON' : 'OFF'})</span>
                                    </button>

                                    {/* Action 3: Increase Confidence Threshold */}
                                    <button
                                      onClick={() => {
                                        const nextConf = feat.confidence >= 95 ? 75 : feat.confidence + 5;
                                        setAiFeaturesList(aiFeaturesList.map(f => f.id === feat.id ? { ...f, confidence: nextConf } : f));
                                        triggerToast(`${feat.name} confidence threshold updated to ${nextConf}%`);
                                        setActiveAiFeatureMenuId(null);
                                      }}
                                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer transition-colors"
                                    >
                                      <CheckCircle2 size={13} className="text-emerald-500" />
                                      <span>Set Threshold ({feat.confidence}%)</span>
                                    </button>

                                    {/* Action 4: Switch Model */}
                                    <button
                                      onClick={() => {
                                        const models = ['GPT-4o', 'Hero AI Model v1.3', 'Azure OCR v3', 'Compliance AI v2.2'];
                                        const nextModel = models[(models.indexOf(feat.model) + 1) % models.length];
                                        setAiFeaturesList(aiFeaturesList.map(f => f.id === feat.id ? { ...f, model: nextModel } : f));
                                        triggerToast(`${feat.name} model switched to ${nextModel}`);
                                        setActiveAiFeatureMenuId(null);
                                      }}
                                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer transition-colors"
                                    >
                                      <Cpu size={13} className="text-purple-500" />
                                      <span>Switch AI Model ({feat.model})</span>
                                    </button>

                                    <div className="my-1 border-t border-slate-100" />

                                    {/* Action 5: View Logs */}
                                    <button
                                      onClick={() => {
                                        setAiTab('Logs & Monitoring');
                                        triggerToast(`Viewing AI audit logs for ${feat.name}...`);
                                        setActiveAiFeatureMenuId(null);
                                      }}
                                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#2563EB] hover:bg-blue-50 flex items-center gap-2 cursor-pointer transition-colors"
                                    >
                                      <FileText size={13} className="text-blue-500" />
                                      <span>View Feature Logs</span>
                                    </button>
                                  </div>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2.5 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                    <span>Showing 1 to {aiFeaturesList.length} of {aiFeaturesList.length} features</span>

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
                          {aiModelsList.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-4 text-center text-xs font-semibold text-slate-400">
                                No custom AI models registered yet. Click "+ Register AI Model" to add.
                              </td>
                            </tr>
                          ) : (
                            aiModelsList.map((m) => (
                              <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-2.5 px-2 font-extrabold text-slate-900 text-[11px] whitespace-nowrap">{m.name}</td>
                                <td className="py-2.5 px-2 text-slate-600 text-[10px] whitespace-nowrap">{m.provider}</td>
                                <td className="py-2.5 px-2 text-slate-500 font-mono text-[10px] whitespace-nowrap">{m.version}</td>
                                <td className="py-2.5 px-2 whitespace-nowrap">
                                  <span className="text-emerald-600 font-black text-[10px]">{m.status || 'Active'}</span>
                                </td>
                                <td className="py-2.5 px-2 text-right text-slate-500 text-[10px] whitespace-nowrap">{m.lastUpdated}</td>
                              </tr>
                            ))
                          )}
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
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-[10px] font-black text-slate-900 leading-none">0</span>
                          <span className="text-[7px] font-bold text-slate-400 leading-tight mt-0.5">Total Requests</span>
                        </div>
                      </div>

                      {/* Legend List beside chart */}
                      <div className="flex-1 min-w-0 space-y-[4px]">
                        {[
                          { color: '#2563EB', label: 'Load Creation', val: '0 (0.0%)' },
                          { color: '#06B6D4', label: 'Document OCR', val: '0 (0.0%)' },
                          { color: '#F59E0B', label: 'Trailer Recommendation', val: '0 (0.0%)' },
                          { color: '#10B981', label: 'Payment Reminders', val: '0 (0.0%)' },
                          { color: '#A855F7', label: 'Other Features', val: '0 (0.0%)' },
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
                            <span className="text-[12px] font-black text-slate-900 leading-none">0</span>
                            <span className="text-[8px] font-extrabold text-emerald-600">(0.0%)</span>
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
                            <span className="text-[12px] font-black text-slate-900 leading-none">0</span>
                            <span className="text-[8px] font-extrabold text-amber-600">(0.0%)</span>
                          </div>
                        </div>

                        <div className="px-2 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-1 mb-0.5">
                            <div className="w-3 h-3 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                              <Clock size={7} />
                            </div>
                            <span className="text-[8.5px] font-bold text-slate-500">Avg Response Time</span>
                          </div>
                          <span className="text-[12px] font-black text-slate-900 leading-none">0 ms</span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            </>
          )}

          {/* 13.5 SUB-TAB 2: FEATURE SETTINGS */}
          {aiTab === 'Feature Settings' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">AI FEATURE TOGGLES & CONFIDENCE CONTROLS</h3>
                    <p className="text-xs text-slate-500 font-medium">Enable or disable specific AI models, confidence auto-execute rules, and model routing.</p>
                  </div>
                  <button onClick={() => triggerToast('AI Feature Settings saved successfully!')} className="px-3.5 py-1.5 bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer">
                    Save Feature Settings
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'AI Load Matching & Dispatch', desc: 'Automatically match available trucks to unassigned loads based on route and capacity.', model: 'Hero AI v1.3', conf: 85, auto: true },
                    { title: 'OCR Consignment Document Extraction', desc: 'Scan paper consignment notes, fuel receipts and POD signatures automatically.', model: 'Azure OCR v3.2', conf: 90, auto: true },
                    { title: 'Smart Route Optimization', desc: 'Calculate optimal multi-stop highway routing to minimize fuel cost and transit time.', model: 'GPT-4o', conf: 80, auto: false },
                    { title: 'Driver Fatigue Predictor', desc: 'Analyze NHVR EWD logs to predict driver rest break requirements and fatigue risk.', model: 'Hero AI v2.2', conf: 92, auto: true },
                  ].map((feat, i) => (
                    <div key={i} className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-900">{feat.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${feat.auto ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {feat.auto ? 'Auto-Execute ON' : 'Manual Review'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 font-semibold text-slate-700">
                        <span>Model: <span className="font-bold text-slate-900">{feat.model}</span></span>
                        <span>Confidence Threshold: <span className="font-bold text-[#2563EB]">{feat.conf}%</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 13.5 SUB-TAB 3: AI MODELS */}
          {aiTab === 'AI Models' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">DEPLOYED AI MODEL REGISTRY</h3>
                    <p className="text-xs text-slate-500 font-medium">Manage AI model deployments, versions, latency SLA benchmarks, and costs.</p>
                  </div>
                  <button
                    onClick={() => setIsRegisterAiModelModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer"
                  >
                    <Plus size={14} /> + Register AI Model
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {aiModelsList.map((m) => (
                    <div key={m.id} className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-900">{m.name}</h4>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-extrabold text-[9px] rounded uppercase">{m.status}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Provider: <span className="font-bold text-slate-800">{m.provider}</span> • Version: <span className="font-mono font-bold text-slate-700">{m.version}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-semibold text-slate-600 pt-2 border-t border-slate-200/60">
                        <span>Latency: {m.latency}</span>
                        <span>Cost: {m.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 13.5 SUB-TAB 4: DATA SOURCES */}
          {aiTab === 'Data Sources' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">RAG VECTOR KNOWLEDGE BASES & DATA SOURCES</h3>
                  <p className="text-xs text-slate-500 font-medium">Connected data sources feeding the Hero AI route & compliance inference engine.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'NHVR Heavy Vehicle National Law DB', count: '1,450,200 vectors', status: '100% Synced', updated: 'Today 06:00 AM' },
                    { name: 'Australian Highway Route & Toll Matrix', count: '890,100 vectors', status: '100% Synced', updated: 'Today 04:30 AM' },
                    { name: 'Customer Rate Cards & Credit Terms Ledger', count: '342,000 vectors', status: '100% Synced', updated: 'Just now' },
                  ].map((ds, i) => (
                    <div key={i} className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{ds.name}</span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-extrabold text-[9px] rounded uppercase">{ds.status}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">{ds.count} • Last re-indexed: {ds.updated}</span>
                      </div>
                      <button onClick={() => triggerToast(`Re-indexing ${ds.name}...`)} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 cursor-pointer">
                        Re-Index Data
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 13.5 SUB-TAB 5: AUTOMATION */}
          {aiTab === 'Automation' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">AI AUTOMATION TRIGGERS & WORKFLOW RULES</h3>
                  <p className="text-xs text-slate-500 font-medium">Rules automatically executed when AI confidence scores exceed safety limits.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {[
                    { name: 'Auto-Dispatch High Confidence Loads', trigger: 'When Load created & AI match confidence > 90%', action: 'Assign truck & notify driver automatically', runs: '1,420 runs' },
                    { name: 'Auto-Flag Driver Fatigue Warning', trigger: 'When NHVR log predicts < 30m rest window', action: 'Send urgent SMS to Dispatcher & Driver', runs: '842 runs' },
                  ].map((rule, i) => (
                    <div key={i} className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-900">{rule.name}</h4>
                        <span className="text-[10px] font-bold text-[#2563EB]">{rule.runs}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium">⚡ Trigger: {rule.trigger}</p>
                      <p className="text-[11px] text-emerald-700 font-bold">🎯 Action: {rule.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 13.5 SUB-TAB 6: AI PROMPTS & TEMPLATES */}
          {aiTab === 'AI Prompts & Templates' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">SYSTEM PROMPTS & TEMPLATE SANDBOX</h3>
                  <p className="text-xs text-slate-500 font-medium">Customize LLM system instructions, variable placeholders, and output schemas.</p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] space-y-2">
                    <div className="text-amber-400 font-bold">// System Prompt: Hero Load Dispatcher v2.4</div>
                    <p className="text-slate-300 leading-relaxed text-[10.5px]">
                      &quot;You are Hero Logistics AI Assistant. Analyze origin &#123;origin&#125;, destination &#123;destination&#125;, weight &#123;weightKg&#125; kg, and driver fatigue hours. Return optimal trailer assignment in JSON schema.&quot;
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => triggerToast('Testing system prompt...')} className="px-3.5 py-1.5 bg-[#2563EB] text-white font-bold text-xs rounded-xl hover:bg-blue-700 cursor-pointer">
                      Test Run Prompt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 13.5 SUB-TAB 7: USAGE & LIMITS */}
          {aiTab === 'Usage & Limits' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">AI TOKEN METERING & MONTHLY QUOTAS</h3>
                  <p className="text-xs text-slate-500 font-medium">Track API token consumption, cost metrics, and monthly ceiling limits.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">MONTHLY TOKEN USAGE</span>
                    <div className="text-xl font-black text-slate-900">24,680 / 500,000</div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '4.9%' }}></div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">475,320 tokens remaining this month</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">ESTIMATED AI COST</span>
                    <div className="text-xl font-black text-emerald-600">$48.20 AUD</div>
                    <span className="text-[10px] font-semibold text-slate-500">$0.002 average cost per inference</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 13.5 SUB-TAB 8: LOGS & MONITORING (Screenshot Circle exact match) */}
          {aiTab === 'Logs & Monitoring' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">AI INFERENCE AUDIT LOGS & ACCURACY METRICS</h3>
                    <p className="text-xs text-slate-500 font-medium">Real-time log trail of all AI requests, model responses, latency, and confidence scores.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => triggerToast('Downloading Inference Logs (CSV)...')} className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs hover:bg-slate-50 cursor-pointer flex items-center gap-1.5">
                      <Download size={13} /> Export Logs (CSV)
                    </button>
                    <button onClick={() => triggerToast('Inference logs refreshed!')} className="px-3.5 py-1.5 bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer flex items-center gap-1.5">
                      <RefreshCw size={13} /> Refresh Logs
                    </button>
                  </div>
                </div>

                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-extrabold text-[#1E1B4B] bg-slate-50">
                        <th className="py-2.5 px-3 whitespace-nowrap">Timestamp</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">AI Feature</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">Model Deployed</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">Tokens (In / Out)</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">Latency</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">Confidence</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                      {[
                        { time: '30 May 2026 10:24 AM', feat: 'AI Load Matching', model: 'Hero AI v1.3', tokens: '420 / 120', lat: '88ms', conf: '94%', status: 'SUCCESS' },
                        { time: '30 May 2026 10:20 AM', feat: 'OCR Consignment Scan', model: 'Azure OCR v3.2', tokens: '850 / 310', lat: '140ms', conf: '98%', status: 'SUCCESS' },
                        { time: '30 May 2026 10:15 AM', feat: 'Route Optimization', model: 'GPT-4o', tokens: '1,200 / 450', lat: '320ms', conf: '82%', status: 'SUCCESS' },
                        { time: '30 May 2026 09:45 AM', feat: 'Fatigue Predictor', model: 'Hero AI v2.2', tokens: '310 / 90', lat: '65ms', conf: '96%', status: 'SUCCESS' },
                        { time: '30 May 2026 09:12 AM', feat: 'Rate Card Optimizer', model: 'GPT-4o', tokens: '1,500 / 200', lat: '510ms', conf: '74%', status: 'WARNING' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{row.time}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{row.feat}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-[#2563EB]">{row.model}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px]">{row.tokens}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px]">{row.lat}</td>
                          <td className="py-2.5 px-3 font-extrabold text-emerald-600">{row.conf}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase ${row.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}



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
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">Integrations</h1>
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
          <div className="flex items-center gap-2 border-b border-slate-200/80 overflow-x-auto pb-3 pt-1 scrollbar-hide">
            {['Overview', 'Connected Integrations', 'Available Integrations', 'API & Webhooks', 'Data Sync', 'Integration Logs', 'Settings'].map((tab) => (
              <button key={tab} onClick={() => setIntegrationsTab(tab)}
                className={`px-3.5 py-1.5 text-xs font-black whitespace-nowrap transition-all rounded-xl cursor-pointer outline-none focus:outline-none focus:ring-0 select-none ${integrationsTab === tab
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/60 font-bold'
                  }`}>{tab}</button>
            ))}
          </div>

          {/* ===== TAB CONTENT ===== */}
          {integrationsTab === 'Overview' && (
            <>
              {/* 6 METRIC CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { icon: <Link2 size={16} />, bg: 'bg-[#DBEAFE] text-[#2563EB]', border: 'hover:border-blue-200', label: 'CONNECTED INTEGRATIONS', value: companyIntegrationsList.length.toString(), sub: '0.0%', subColor: 'text-slate-400', subText: 'vs Last Month', link: 'View all integrations →', onClick: () => setIntegrationsTab('Connected Integrations') },
                  { icon: <Database size={16} />, bg: 'bg-[#DCFCE7] text-[#16A34A]', border: 'hover:border-emerald-200', label: 'DATA SYNCED TODAY', value: '0', sub: '0.0%', subColor: 'text-slate-400', subText: 'vs Yesterday', link: 'View sync activity →', onClick: () => setIntegrationsTab('Data Sync') },
                  { icon: <AlertCircle size={16} />, bg: 'bg-rose-100 text-rose-600', border: 'hover:border-rose-200', label: 'FAILED SYNC (TODAY)', value: '0', valueColor: 'text-slate-900', sub: '0.0%', subColor: 'text-slate-400', subText: 'vs Yesterday', link: 'View error log →', onClick: () => triggerToast('Opening error log...') },
                  { icon: <Clock size={16} />, bg: 'bg-[#DBEAFE] text-[#2563EB]', border: 'hover:border-blue-200', label: 'LAST SYNC', value: companyIntegrationsList.length > 0 ? 'Just Now' : '-', sub: companyIntegrationsList.length > 0 ? 'Today' : '-', subColor: 'text-slate-400', link: 'View sync schedule →', onClick: () => triggerToast('Viewing sync schedule...') },
                  { icon: <Zap size={16} />, bg: 'bg-[#DCFCE7] text-[#16A34A]', border: 'hover:border-emerald-200', label: 'AUTO SYNC STATUS', value: companyIntegrationsList.length > 0 ? 'Active' : 'Inactive', valueColor: companyIntegrationsList.length > 0 ? 'text-emerald-600' : 'text-slate-500', sub: companyIntegrationsList.length > 0 ? 'Automations active' : 'No active sync', subColor: 'text-slate-400', link: 'Manage schedules →', onClick: () => triggerToast('Managing schedules...') },
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
                        {companyIntegrationsList.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-xs font-semibold text-slate-400">
                              No connected integrations found (0). Click <button onClick={() => setIsAddIntegrationModalOpen(true)} className="font-bold text-[#2563EB] hover:underline cursor-pointer">+ Add Integration</button> to connect software.
                            </td>
                          </tr>
                        ) : (
                          companyIntegrationsList.map((item, idx) => (
                            <tr key={item.id || idx} className="hover:bg-blue-50/30 transition-colors">
                              <td className="py-2 px-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-white text-[9px] font-black bg-[#2563EB]">
                                    {(item.providerName || 'I').slice(0, 1).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="text-[10.5px] font-extrabold text-slate-900 leading-tight whitespace-nowrap">{item.providerName}</div>
                                    <div className="text-[8.5px] font-medium text-slate-400 leading-tight">{item.apiKey ? 'Connected via API Key / Secret' : 'Standard OAuth connector'}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9.5px] font-semibold text-slate-600">{item.integrationType === 'ACCOUNTING' ? 'Accounting' : item.integrationType === 'ELD' ? 'GPS / Telematics' : 'Custom'}</span></td>
                              <td className="py-2 px-2 whitespace-nowrap"><span className="px-1.5 py-0.5 rounded-md text-[8.5px] font-extrabold bg-[#DCFCE7] text-[#166534]">{item.status || 'Connected'}</span></td>
                              <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9.5px] font-semibold text-slate-600">Synced</span></td>
                              <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9px] font-semibold text-slate-500">{item.lastSync ? new Date(item.lastSync).toLocaleString() : 'Just Now'}</span></td>
                              <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9px] font-semibold text-slate-500">Continuous</span></td>
                              <td className="py-2 px-1.5 text-right whitespace-nowrap">
                                <button onClick={() => triggerToast(`Managing ${item.providerName}...`)} className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-slate-200/80 bg-white hover:bg-slate-100 hover:border-slate-300 text-slate-500 hover:text-slate-900 transition-all cursor-pointer outline-none focus:outline-none focus:ring-0 select-none shadow-2xs"><MoreHorizontal size={13} /></button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                    <span>Showing 1 to {companyIntegrationsList.length} of {companyIntegrationsList.length} integrations</span>
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
                          {companyIntegrationsList.length > 0 && (
                            <circle cx="40" cy="40" r="28" fill="none" stroke="#16A34A" strokeWidth="13" strokeDasharray="175.9" strokeDashoffset="0" />
                          )}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[13px] font-black text-slate-900 leading-none">{companyIntegrationsList.length}</span>
                          <span className="text-[8px] font-bold text-slate-400">Total</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[
                          { color: '#16A34A', label: 'Connected', count: companyIntegrationsList.filter(i => i.status !== 'NOT_CONNECTED').length.toString(), pct: companyIntegrationsList.length > 0 ? '100%' : '0%' },
                          { color: '#F59E0B', label: 'Limited', count: '0', pct: '0%' },
                          { color: '#EF4444', label: 'Disconnected', count: companyIntegrationsList.filter(i => i.status === 'NOT_CONNECTED').length.toString(), pct: '0%' }
                        ].map((item, i) => (
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
                    {[{ color: '#16A34A', label: 'Invoices Sync', val: '0 records' }, { color: '#2563EB', label: 'Driver Logs Sync', val: '0 records' }, { color: '#9333EA', label: 'Vehicle Data Sync', val: '0 records' }, { color: '#F59E0B', label: 'Payments Sync', val: '0 records' }].map((item, i) => (
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
                    <div className="py-3 text-center text-[10px] font-semibold text-slate-400">
                      No failed sync events today (0 errors).
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Other tab panels */}
          {/* 13.6 SUB-TAB 2: CONNECTED INTEGRATIONS */}
          {integrationsTab === 'Connected Integrations' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">CONNECTED THIRD-PARTY INTEGRATIONS ({companyIntegrationsList.length} ACTIVE)</h3>
                    <p className="text-xs text-slate-500 font-medium">Active OAuth connections, telematics sync streams, and financial connectors.</p>
                  </div>
                  <button onClick={() => setIsAddIntegrationModalOpen(true)} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer">
                    <Plus size={14} /> Connect New Service
                  </button>
                </div>

                {companyIntegrationsList.length === 0 ? (
                  <div className="py-12 text-center text-xs font-semibold text-slate-400">
                    No active connected integrations found (0). Click "+ Connect New Service" to add third-party tools.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {companyIntegrationsList.map((item, i) => (
                      <div key={item.id || i} className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white font-black text-xs flex items-center justify-center shadow-3xs">
                              {(item.providerName || 'I').slice(0, 1).toUpperCase()}
                            </div>
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[9px] font-extrabold uppercase">● {item.status || 'Connected'}</span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900">{item.providerName}</h4>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{item.integrationType === 'ACCOUNTING' ? 'Accounting & Invoicing' : item.integrationType === 'ELD' ? 'GPS & Telematics' : 'Custom Connector'}</span>
                          <p className="text-[11px] text-slate-500 font-medium mt-1.5 leading-relaxed">{item.apiKey ? 'Connected with secret key/OAuth token.' : 'Active integration link.'}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10.5px] font-semibold text-slate-600">
                          <span>Sync: Continuous</span>
                          <button onClick={() => triggerToast(`Configuring ${item.providerName} settings...`)} className="text-[#2563EB] font-bold hover:underline cursor-pointer">Settings →</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 13.6 SUB-TAB 3: AVAILABLE INTEGRATIONS */}
          {integrationsTab === 'Available Integrations' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">INTEGRATIONS MARKETPLACE & CATALOG</h3>
                  <p className="text-xs text-slate-500 font-medium">Discover and connect third-party enterprise ERP, CRM, and telematics systems.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {[
                    { name: 'SAP S/4HANA Logistics', cat: 'Enterprise ERP', desc: 'Bi-directional order sync, inventory management & financial ledger integration.', icon: '🏢' },
                    { name: 'Oracle NetSuite', cat: 'Enterprise ERP', desc: 'Real-time billing sync, customer accounts & general ledger posting.', icon: '⭕' },
                    { name: 'Shopify Logistics', cat: 'E-Commerce WMS', desc: 'Auto-import online store orders directly into Hero Freight Dispatcher.', icon: '🛍️' },
                    { name: 'Zapier Automation', cat: 'Workflow Automation', desc: 'Connect Hero Logistics to 5,000+ web apps via custom triggers.', icon: '⚡' },
                    { name: 'WhatsApp Business API', cat: 'Communication', desc: 'Send automated delivery updates & POD receipts directly on WhatsApp.', icon: '💬' },
                    { name: 'Teletrac Navman GPS', cat: 'GPS / Telematics', desc: 'Vehicle tracking, fuel consumption & FTC rebate tax reports.', icon: '🛰️' },
                  ].map((app, i) => (
                    <div key={i} className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className="text-2xl">{app.icon}</span>
                          <div>
                            <h4 className="text-sm font-black text-slate-900">{app.name}</h4>
                            <span className="text-[9.5px] font-extrabold text-[#2563EB] uppercase">{app.cat}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{app.desc}</p>
                      </div>
                      <button onClick={() => triggerToast(`Initiating setup wizard for ${app.name}...`)} className="w-full py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer">
                        Connect Integration
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 13.6 SUB-TAB 4: API & WEBHOOKS */}
          {integrationsTab === 'API & Webhooks' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">REST API KEYS & WEBHOOK ENDPOINTS</h3>
                    <p className="text-xs text-slate-500 font-medium">Manage developer API keys and real-time HTTP event webhooks.</p>
                  </div>
                  <button
                    onClick={() => setIsGenerateApiKeyModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer"
                  >
                    <Plus size={14} /> + Generate API Key
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Active API Keys ({apiKeysList.length})</h4>
                  <div className="border border-slate-200/80 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-[10px] font-extrabold text-[#1E1B4B] bg-slate-50">
                          <th className="py-2.5 px-3">Key Name</th>
                          <th className="py-2.5 px-3">API Token Prefix</th>
                          <th className="py-2.5 px-3">Created Date</th>
                          <th className="py-2.5 px-3">Rate Limit</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                        {apiKeysList.map((key) => (
                          <tr key={key.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-3 font-bold text-slate-900">{key.name}</td>
                            <td className="py-3 px-3 font-mono text-slate-500">{key.prefix}</td>
                            <td className="py-3 px-3 text-slate-500">{key.date}</td>
                            <td className="py-3 px-3">{key.limit}</td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 font-bold text-[9.5px] rounded ${key.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                }`}>
                                {key.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              {key.status === 'Active' ? (
                                <button
                                  onClick={() => handleRevokeKey(key.id, key.name)}
                                  className="text-rose-600 hover:underline font-bold cursor-pointer"
                                >
                                  Revoke
                                </button>
                              ) : (
                                <span className="text-slate-400 font-normal">Revoked</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Webhook Listeners</h4>
                  <div className="border border-slate-200/80 rounded-xl p-3.5 bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-xs">https://api.yourcompany.com/v1/webhooks/loads</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-bold text-[9px] rounded uppercase">load.created, load.delivered</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium block mt-1">Secret: whsec_88f92a... • Health: 100% (200 OK)</span>
                    </div>
                    <button
                      onClick={() => setIsTestWebhookModalOpen(true)}
                      className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                    >
                      Test Webhook
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 13.6 SUB-TAB 5: DATA SYNC */}
          {integrationsTab === 'Data Sync' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">DATA SYNCHRONISATION MATRIX & SCHEDULES</h3>
                    <p className="text-xs text-slate-500 font-medium">Configure auto-sync intervals, payload field mappings, and retry policies.</p>
                  </div>
                  <button onClick={() => triggerToast('Initiating full system data sync...')} className="px-3.5 py-1.5 bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer">
                    Sync All Data Now
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {[
                    { title: 'Accounting Auto-Sync', desc: 'Sync invoices & payments with Xero/MYOB.', freq: 'Every 15 Minutes', status: 'Enabled' },
                    { title: 'Telematics GPS Stream', desc: 'Stream live truck coordinates & speed.', freq: 'Real-time (10s)', status: 'Enabled' },
                    { title: 'NHVR Fatigue Compliance', desc: 'Fetch driver work/rest fatigue logs.', freq: 'Hourly at :00', status: 'Enabled' },
                  ].map((rule, i) => (
                    <div key={i} className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-900">{rule.title}</h4>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded uppercase">{rule.status}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{rule.desc}</p>
                      <div className="text-[10px] font-bold text-[#2563EB] pt-1">Frequency: {rule.freq}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 13.6 SUB-TAB 6: INTEGRATION LOGS */}
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
                        <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">{log.name}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-[#2563EB] whitespace-nowrap">{log.event}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap"><span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase ${log.statusBg}`}>{log.status}</span></td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">{log.details}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-[11px] text-slate-500 whitespace-nowrap">{log.lat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 13.6 SUB-TAB 7: SETTINGS */}
          {integrationsTab === 'Settings' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">INTEGRATION SECURITY & TIMEOUT SETTINGS</h3>
                  <p className="text-xs text-slate-500 font-medium">Configure global security policies, OAuth token lifetimes, and failure alert emails.</p>
                </div>

                <div className="space-y-3 max-w-2xl text-xs font-semibold text-slate-700">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div>
                      <span className="font-bold text-slate-900 block">Auto-Retry Failed Data Syncs</span>
                      <span className="text-[11px] text-slate-500 font-medium">Automatically retry failed API requests up to 3 times.</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#2563EB] cursor-pointer" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div>
                      <span className="font-bold text-slate-900 block">Email Alerts on Integration Failure</span>
                      <span className="text-[11px] text-slate-500 font-medium">Send instant email notification if an OAuth connection fails.</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#2563EB] cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          )}



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
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">Notifications & Communication Settings</h1>
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
          <div className="flex items-center gap-2 border-b border-slate-200/80 overflow-x-auto pb-3 pt-1 scrollbar-hide">
            {['Overview', 'Notification Channels', 'Templates', 'Notification Rules', 'Recipient Groups', 'Communication Preferences', 'History & Logs'].map((tab) => (
              <button
                key={tab}
                onClick={() => setNotificationsTab(tab)}
                className={`px-3.5 py-1.5 text-xs font-black whitespace-nowrap transition-all rounded-xl cursor-pointer outline-none focus:outline-none focus:ring-0 select-none ${notificationsTab === tab
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/60 font-bold'
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
                  { icon: <Mail size={16} />, bg: 'bg-[#DBEAFE] text-[#2563EB]', border: 'hover:border-blue-200', label: 'EMAILS SENT (THIS MONTH)', value: '0', sub: '0.0%', subColor: 'text-slate-400', subText: 'vs Last Month', link: 'View email report →', onClick: () => triggerToast('Viewing email report...') },
                  { icon: <MessageSquare size={16} />, bg: 'bg-[#F3E8FF] text-[#9333EA]', border: 'hover:border-purple-200', label: 'SMS SENT (THIS MONTH)', value: '0', sub: '0.0%', subColor: 'text-slate-400', subText: 'vs Last Month', link: 'View SMS report →', onClick: () => triggerToast('Viewing SMS report...') },
                  { icon: <Bell size={16} />, bg: 'bg-amber-100 text-amber-600', border: 'hover:border-amber-200', label: 'PUSH NOTIFICATIONS', value: '0', sub: '0.0%', subColor: 'text-slate-400', subText: 'vs Last Month', link: 'View push report →', onClick: () => triggerToast('Viewing push report...') },
                  { icon: <Send size={16} />, bg: 'bg-[#EEF2FF] text-[#4F46E5]', border: 'hover:border-indigo-200', label: 'IN-APP MESSAGES', value: '0', sub: '0.0%', subColor: 'text-slate-400', subText: 'vs Last Month', link: 'View in-app report →', onClick: () => triggerToast('Viewing in-app report...') },
                  { icon: <Users size={16} />, bg: 'bg-[#DBEAFE] text-[#2563EB]', border: 'hover:border-blue-200', label: 'ACTIVE RECIPIENT GROUPS', value: '0', link: 'View groups →', onClick: () => setNotificationsTab('Recipient Groups') },
                  { icon: <AlertTriangle size={16} />, bg: 'bg-rose-100 text-rose-600', border: 'hover:border-rose-200', label: 'FAILED DELIVERIES (TODAY)', value: '0', valueColor: 'text-slate-900', sub: '0.0%', subColor: 'text-slate-400', subText: 'vs Yesterday', link: 'View error log →', onClick: () => setNotificationsTab('History & Logs') },
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
                            { id: 1, name: 'Email', desc: 'Send email notifications and alerts', status: 'Active', default: 'Yes', last: '-', rate: '100%', pct: 100, icon: <Mail size={13} />, color: 'bg-blue-100 text-blue-600' },
                            { id: 2, name: 'SMS', desc: 'Send SMS text messages', status: 'Active', default: 'Yes', last: '-', rate: '100%', pct: 100, icon: <MessageSquare size={13} />, color: 'bg-purple-100 text-purple-600' },
                            { id: 3, name: 'Push Notifications', desc: 'Send push notifications to mobile apps', status: 'Active', default: 'Yes', last: '-', rate: '100%', pct: 100, icon: <Bell size={13} />, color: 'bg-amber-100 text-amber-600' },
                            { id: 4, name: 'In-App Messages', desc: 'Send in-app messages and alerts', status: 'Active', default: 'Yes', last: '-', rate: '100%', pct: 100, icon: <Send size={13} />, color: 'bg-indigo-100 text-indigo-600' },
                            { id: 5, name: 'Voice Calls', desc: 'Automated voice call notifications', status: 'Inactive', default: 'No', last: '-', rate: '-', pct: 0, icon: <Phone size={13} />, color: 'bg-slate-100 text-slate-500' },
                            { id: 6, name: 'WhatsApp Business', desc: 'Send WhatsApp messages', status: 'Active', default: 'No', last: '-', rate: '100%', pct: 100, icon: <MessageSquare size={13} />, color: 'bg-emerald-100 text-emerald-600' },
                            { id: 7, name: 'Fax', desc: 'Send fax notifications', status: 'Inactive', default: 'No', last: '-', rate: '-', pct: 0, icon: <FileText size={13} />, color: 'bg-slate-100 text-slate-500' },
                            { id: 8, name: 'Webhooks', desc: 'Send webhook events to external systems', status: 'Active', default: 'No', last: '-', rate: '100%', pct: 100, icon: <Plug size={13} />, color: 'bg-teal-100 text-teal-600' },
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
                                <button onClick={() => triggerToast(`Configuring ${ch.name}...`)} className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-slate-200/80 bg-white hover:bg-slate-100 hover:border-slate-300 text-slate-500 hover:text-slate-900 transition-all cursor-pointer outline-none focus:outline-none focus:ring-0 select-none shadow-2xs"><MoreHorizontal size={13} /></button>
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
                    <div className="py-6 text-center text-xs font-semibold text-slate-400">
                      No recent notification activity recorded (0 events).
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
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[12px] font-black text-slate-900 leading-none">0</span>
                          <span className="text-[7.5px] font-bold text-slate-400">Total Sent</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {[
                          { color: '#2563EB', label: 'Email', count: '0', pct: '0.0%' },
                          { color: '#9333EA', label: 'SMS', count: '0', pct: '0.0%' },
                          { color: '#F59E0B', label: 'Push', count: '0', pct: '0.0%' },
                          { color: '#4F46E5', label: 'In-App', count: '0', pct: '0.0%' },
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
                        <Edit size={10} /> Edit Settings
                      </button>
                    </div>
                    <div className="space-y-1.5 text-[10px]">
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold"><Clock size={12} className="text-slate-400" /> Quiet Hours</div>
                        <span className="font-bold text-slate-900">10:00 PM - 06:00 AM</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold"><Globe size={12} className="text-slate-400" /> Time Zone</div>
                        <span className="font-bold text-slate-900">(AEST) Australia/Sydney</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold"><Bell size={12} className="text-slate-400" /> Weekend Notifications</div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black">On</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold"><AlertTriangle size={12} className="text-slate-400" /> System Alerts (Critical)</div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black">On</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold"><Mail size={12} className="text-slate-400" /> Marketing & Updates</div>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-black">Off</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold"><Calendar size={12} className="text-slate-400" /> Digest Summary (Daily)</div>
                        <span className="font-bold text-slate-900">07:00 AM</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold"><Globe size={12} className="text-slate-400" /> Language</div>
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
                      { icon: <Truck size={12} />, label: 'Load Status Updates', val: '0 sent' },
                      { icon: <FileText size={12} />, label: 'Invoice & Payment Notifications', val: '0 sent' },
                      { icon: <Users size={12} />, label: 'Driver Alerts & Reminders', val: '0 sent' },
                      { icon: <ShieldCheck size={12} />, label: 'Compliance & Document Expiry', val: '0 sent' },
                      { icon: <Zap size={12} />, label: 'Maintenance & Service Reminders', val: '0 sent' },
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
          {/* 13.7 SUB-TAB 2: NOTIFICATION CHANNELS */}
          {notificationsTab === 'Notification Channels' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">NOTIFICATION DELIVERY CHANNELS & PROVIDERS</h3>
                    <p className="text-xs text-slate-500 font-medium">Configure active email gateways, SMS gateways, mobile push services, and webhooks.</p>
                  </div>
                  <button onClick={() => triggerToast('Testing all 8 notification channels...')} className="px-3.5 py-1.5 bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer">
                    Test All Channels
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {[
                    { name: 'SendGrid Email API', cat: 'Email Gateway', status: 'Active', usage: '24,680 / 50,000', icon: '📧', color: 'bg-blue-50 text-blue-600' },
                    { name: 'Twilio SMS Service', cat: 'SMS Gateway', status: 'Active', usage: '8,954 / 20,000', icon: '💬', color: 'bg-purple-50 text-purple-600' },
                    { name: 'Firebase Push Alerts', cat: 'Mobile Push', status: 'Active', usage: '5,612 / Unlimited', icon: '🔔', color: 'bg-amber-50 text-amber-600' },
                    { name: 'In-App Alert Center', cat: 'Internal Dispatch', status: 'Active', usage: '3,245 / Unlimited', icon: '📥', color: 'bg-emerald-50 text-emerald-600' },
                  ].map((ch, i) => (
                    <div key={i} className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{ch.icon}</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-black text-[9px] rounded uppercase">● {ch.status}</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-900">{ch.name}</h4>
                      <span className="text-[9.5px] font-extrabold text-slate-400 block">{ch.cat}</span>
                      <div className="pt-2 border-t border-slate-200/60 text-[10px] font-semibold text-slate-600 flex justify-between">
                        <span>Usage: {ch.usage}</span>
                        <button onClick={() => triggerToast(`Testing ${ch.name}...`)} className="text-[#2563EB] font-bold hover:underline cursor-pointer">Test →</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 13.7 SUB-TAB 3: TEMPLATES */}
          {notificationsTab === 'Templates' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">NOTIFICATION MESSAGE TEMPLATES ({notificationTemplatesList.length} TEMPLATES)</h3>
                    <p className="text-xs text-slate-500 font-medium">Customize automated customer emails, driver SMS, and POD receipts.</p>
                  </div>
                  <button
                    onClick={() => setIsCreateTemplateModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer"
                  >
                    <Plus size={14} /> + Create Template
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {notificationTemplatesList.length === 0 ? (
                    <div className="col-span-2 py-8 text-center text-xs font-semibold text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                      No custom notification templates created yet. Click &quot;+ Create Template&quot; to build your first template.
                    </div>
                  ) : (
                    notificationTemplatesList.map((tpl) => (
                      <div key={tpl.id} className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-900">{tpl.title}</h4>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-bold text-[9px] rounded uppercase">{tpl.channel}</span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/60 leading-relaxed whitespace-pre-wrap">{tpl.preview}</p>
                        <div className="flex justify-between items-center pt-1">
                          <button
                            onClick={async () => {
                              try {
                                if (tpl.id && typeof tpl.id === 'string' && tpl.id.includes('-')) {
                                  await api.delete(`/notification-templates/${tpl.id}`);
                                }
                                setNotificationTemplatesList(prev => prev.filter(t => t.id !== tpl.id));
                                triggerToast(`Template "${tpl.title}" deleted!`);
                              } catch (err) {
                                triggerToast('Failed to delete template');
                              }
                            }}
                            className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => triggerToast(`Editing template "${tpl.title}"...`)}
                            className="text-[10.5px] font-bold text-[#2563EB] hover:underline cursor-pointer"
                          >
                            Edit Template →
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 13.7 SUB-TAB 4: NOTIFICATION RULES */}
          {notificationsTab === 'Notification Rules' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">AUTOMATED NOTIFICATION RULES & TRIGGERS</h3>
                    <p className="text-xs text-slate-500 font-medium">Define automated event triggers, recipient rules, and channel routing.</p>
                  </div>
                  <button
                    onClick={() => setIsAddNotificationRuleModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer"
                  >
                    <Plus size={14} /> + Add Notification Rule
                  </button>
                </div>

                <div className="space-y-3">
                  {notificationRulesList.length === 0 ? (
                    <div className="py-8 text-center text-xs font-semibold text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                      No notification trigger rules active. Click &quot;+ Add Notification Rule&quot; to automate event triggers.
                    </div>
                  ) : (
                    notificationRulesList.map((rule) => (
                      <div key={rule.id} className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">{rule.name}</span>
                            <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase ${rule.priority === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>{rule.priority}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium block mt-1">⚡ Trigger: {rule.trigger} • Channels: {rule.channels} • Recipient: {rule.rec || rule.recipient || 'Customer & Accounts'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              try {
                                if (rule.id && typeof rule.id === 'string' && rule.id.includes('-')) {
                                  await api.delete(`/notification-rules/${rule.id}`);
                                }
                                setNotificationRulesList(prev => prev.filter(r => r.id !== rule.id));
                                triggerToast(`Rule "${rule.name}" deleted!`);
                              } catch (err) {
                                triggerToast('Failed to delete rule');
                              }
                            }}
                            className="px-2 py-1 text-[10px] font-bold text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                          >
                            Delete
                          </button>
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-lg">Active</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 13.7 SUB-TAB 5: RECIPIENT GROUPS */}
          {notificationsTab === 'Recipient Groups' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">RECIPIENT DISTRIBUTION GROUPS</h3>
                    <p className="text-xs text-slate-500 font-medium">Manage driver, dispatcher, customer, and finance distribution lists.</p>
                  </div>
                  <button
                    onClick={() => setIsCreateRecipientGroupModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer"
                  >
                    <Plus size={14} /> + Create Recipient Group
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
                  {recipientGroupsList.length === 0 ? (
                    <div className="col-span-4 py-8 text-center text-xs font-semibold text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                      No recipient groups created yet. Click &quot;+ Create Recipient Group&quot; to add a group.
                    </div>
                  ) : (
                    recipientGroupsList.map((grp) => (
                      <div key={grp.id} className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-900">{grp.name}</h4>
                          <button
                            onClick={async () => {
                              try {
                                if (grp.id && typeof grp.id === 'string' && grp.id.includes('-')) {
                                  await api.delete(`/recipient-groups/${grp.id}`);
                                }
                                setRecipientGroupsList(prev => prev.filter(g => g.id !== grp.id));
                                triggerToast(`Group "${grp.name}" deleted!`);
                              } catch (err) {
                                triggerToast('Failed to delete recipient group');
                              }
                            }}
                            className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                        <span className="text-[10px] font-bold text-[#2563EB] block">{grp.count}</span>
                        <p className="text-[11px] text-slate-500 font-medium">{grp.desc || grp.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 13.7 SUB-TAB 6: COMMUNICATION PREFERENCES */}
          {notificationsTab === 'Communication Preferences' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">GLOBAL COMMUNICATION PREFERENCES & QUIET HOURS</h3>
                  <p className="text-xs text-slate-500 font-medium">Configure company quiet hours, frequency capping, and timezone rules.</p>
                </div>

                <div className="space-y-3 max-w-2xl text-xs font-semibold text-slate-700">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div>
                      <span className="font-bold text-slate-900 block">Night Quiet Hours (10:00 PM - 06:00 AM)</span>
                      <span className="text-[11px] text-slate-500 font-medium">Suppress non-critical SMS & email notifications overnight.</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#2563EB] cursor-pointer" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div>
                      <span className="font-bold text-slate-900 block">Send Instant SMS for Critical Delays</span>
                      <span className="text-[11px] text-slate-500 font-medium">Bypass quiet hours if load delay exceeds 60 minutes.</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#2563EB] cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 13.7 SUB-TAB 7: HISTORY & LOGS */}
          {notificationsTab === 'History & Logs' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs text-left space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <FileText size={16} className="text-[#2563EB]" /> Notification Delivery Audit Trail
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time log trail of all sent, delivered, and failed notifications.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => triggerToast('Downloading Notification Audit Logs (CSV)...')} className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs hover:bg-slate-50 cursor-pointer flex items-center gap-1.5">
                    <Download size={13} /> Export Logs (CSV)
                  </button>
                  <button onClick={() => triggerToast('Notification logs refreshed!')} className="px-3.5 py-1.5 bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer flex items-center gap-1.5">
                    <RefreshCw size={13} /> Refresh Logs
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-extrabold text-[#1E1B4B] bg-slate-50">
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Recipient</th>
                      <th className="py-2.5 px-3">Channel</th>
                      <th className="py-2.5 px-3">Template / Subject</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {[
                      { time: '30 May 2026 10:15 AM', rec: 'Sarah Mitchell (Operations)', ch: 'Email', tpl: 'Consignment Created #LD-2041', status: 'DELIVERED', statusBg: 'bg-emerald-100 text-emerald-700', lat: '120ms' },
                      { time: '30 May 2026 10:12 AM', rec: '+61 412 345 678 (Driver John)', ch: 'SMS', tpl: 'Fatigue Break Warning', status: 'DELIVERED', statusBg: 'bg-emerald-100 text-emerald-700', lat: '450ms' },
                      { time: '30 May 2026 09:45 AM', rec: 'billing@autodeal.com.au', ch: 'Email', tpl: 'Tax Invoice INV-2025-0529', status: 'DELIVERED', statusBg: 'bg-emerald-100 text-emerald-700', lat: '180ms' },
                      { time: '30 May 2026 08:30 AM', rec: '+61 400 000 000 (Invalid Num)', ch: 'SMS', tpl: 'Load Delay Notice', status: 'FAILED', statusBg: 'bg-rose-100 text-rose-700', lat: '1200ms' },
                    ].map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{log.time}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{log.rec}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-[#2563EB]">{log.ch}</td>
                        <td className="py-2.5 px-3 text-slate-700">{log.tpl}</td>
                        <td className="py-2.5 px-3"><span className={`px-2 py-0.5 text-[9.5px] font-black rounded uppercase ${log.statusBg}`}>{log.status}</span></td>
                        <td className="py-2.5 px-3 text-right font-mono text-[11px] text-slate-500">{log.lat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}



        </div>
      )}

      {/* =========================================================================
         VIEW 8: 13.8 SECURITY & AUDIT LOGS (Screenshot 2 Exact Match)
         ========================================================================= */}
      {currentView === 'security-audit-logs' && (
        <div className="space-y-4 text-left relative">
          {openLogDropdownId && <div className="fixed inset-0 z-40" onClick={() => setOpenLogDropdownId(null)} />}
          {/* HEADER & ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">Security & Audit Logs</h1>
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
          <div className="flex items-center gap-2 border-b border-slate-200/80 overflow-x-auto pb-3 pt-1 scrollbar-hide">
            {['Overview', 'Audit Logs', 'Login History', 'Security Events', 'Permission Changes', 'Data Access', 'Exports & Downloads', 'Blocked Actions', 'Settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSecurityLogsTab(tab)}
                className={`px-3.5 py-1.5 text-xs font-black whitespace-nowrap transition-all rounded-xl cursor-pointer outline-none focus:outline-none focus:ring-0 select-none ${securityLogsTab === tab
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/60 font-bold'
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
                  { icon: <Shield size={16} />, bg: 'bg-[#DBEAFE] text-[#2563EB]', border: 'hover:border-blue-200', label: 'TOTAL EVENTS (THIS MONTH)', value: auditLogsData.length > 0 ? auditLogsData.length : '00', sub: auditLogsData.length > 0 ? '↑ 18.6%' : '0%', subColor: auditLogsData.length > 0 ? 'text-emerald-600' : 'text-slate-400', subText: 'vs Last Month', link: 'View audit logs →', onClick: () => setSecurityLogsTab('Audit Logs') },
                  { icon: <UserCheck size={16} />, bg: 'bg-[#DCFCE7] text-[#16A34A]', border: 'hover:border-emerald-200', label: 'LOGIN EVENTS (THIS MONTH)', value: auditLogsData.length > 0 ? auditLogsData.length : '00', sub: auditLogsData.length > 0 ? '↑ 12.4%' : '0%', subColor: auditLogsData.length > 0 ? 'text-emerald-600' : 'text-slate-400', subText: 'vs Last Month', link: 'View login history →', onClick: () => setSecurityLogsTab('Login History') },
                  { icon: <AlertTriangle size={16} />, bg: 'bg-rose-100 text-rose-600', border: 'hover:border-rose-200', label: 'SECURITY EVENTS (THIS MONTH)', value: auditLogsData.length > 0 ? auditLogsData.length : '00', valueColor: 'text-rose-600', sub: '0%', subColor: 'text-slate-400', subText: 'vs Last Month', link: 'View security events →', onClick: () => setSecurityLogsTab('Security Events') },
                  { icon: <Lock size={16} />, bg: 'bg-[#DBEAFE] text-[#2563EB]', border: 'hover:border-blue-200', label: 'PERMISSION CHANGES', value: auditLogsData.length > 0 ? auditLogsData.length : '00', sub: '0%', subColor: 'text-slate-400', subText: 'vs Last Month', link: 'View permission changes →', onClick: () => setSecurityLogsTab('Permission Changes') },
                  { icon: <Download size={16} />, bg: 'bg-[#DBEAFE] text-[#2563EB]', border: 'hover:border-blue-200', label: 'DATA EXPORTS (THIS MONTH)', value: auditLogsData.length > 0 ? auditLogsData.length : '00', sub: '0%', subColor: 'text-slate-400', subText: 'vs Last Month', link: 'View exports →', onClick: () => setSecurityLogsTab('Exports & Downloads') },
                  { icon: <AlertCircle size={16} />, bg: 'bg-rose-100 text-rose-600', border: 'hover:border-rose-200', label: 'BLOCKED ACTIONS (THIS MONTH)', value: auditLogsData.length > 0 ? auditLogsData.length : '00', valueColor: 'text-rose-600', sub: '0%', subColor: 'text-slate-400', subText: 'vs Last Month', link: 'View blocked actions →', onClick: () => setSecurityLogsTab('Blocked Actions') },
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
                        {auditLogsData.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-8 text-center text-xs font-semibold text-slate-400 bg-slate-50/50">
                              No security audit log events recorded yet.
                            </td>
                          </tr>
                        ) : (
                          auditLogsData.slice(0, 8).map((row, i) => (
                            <tr key={row.id || i} className="hover:bg-blue-50/30 transition-colors">
                              <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9px] font-semibold text-slate-500">{row.time}</span></td>
                              <td className="py-2 px-2 whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <div className={`w-5 h-5 rounded-full ${row.bg || 'bg-blue-600'} text-white font-black text-[8px] flex items-center justify-center shrink-0`}>{row.avatar || 'S'}</div>
                                  <div>
                                    <div className="text-[10px] font-extrabold text-slate-900 leading-tight whitespace-nowrap">{row.name}</div>
                                    <div className="text-[8px] font-medium text-slate-400 leading-tight whitespace-nowrap">{row.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-2 px-2 whitespace-nowrap"><span className={`px-1.5 py-0.2 rounded text-[8.5px] font-extrabold ${row.typeBg || 'bg-blue-100 text-blue-700'}`}>{row.type}</span></td>
                              <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9.5px] font-bold text-slate-800 whitespace-nowrap">{row.action}</span></td>
                              <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9px] font-semibold text-slate-500 whitespace-nowrap">{row.module}</span></td>
                              <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9px] font-medium text-slate-600 leading-tight whitespace-nowrap">{row.details}</span></td>
                              <td className="py-2 px-2 whitespace-nowrap"><span className="text-[8.5px] font-mono text-slate-400">{row.ip}</span></td>
                              <td className="py-2 px-2 whitespace-nowrap"><span className={`text-[9.5px] font-black ${row.outcomeColor || 'text-emerald-600'}`}>{row.outcome}</span></td>
                              <td className="py-2 px-1.5 text-right whitespace-nowrap relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenLogDropdownId(openLogDropdownId === `overview-${row.id}` ? null : `overview-${row.id}`);
                                  }}
                                  title="Actions Menu"
                                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer transition-colors border border-transparent"
                                >
                                  <MoreHorizontal size={14} />
                                </button>

                                {openLogDropdownId === `overview-${row.id}` && (
                                  <div
                                    className="absolute right-0 top-8 z-50 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 text-xs text-left animate-in fade-in duration-100"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      onClick={() => { setOpenLogDropdownId(null); setSelectedAuditLog(row); }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Eye size={13} className="text-blue-600" /> View Details
                                    </button>
                                    <button
                                      onClick={() => { setOpenLogDropdownId(null); handleOpenEditAuditLogModal(row); }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Edit size={13} className="text-amber-600" /> Edit Record
                                    </button>
                                    <div className="my-1 border-t border-slate-100"></div>
                                    <button
                                      onClick={() => { setOpenLogDropdownId(null); handleDeleteAuditLog(row.id); }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-rose-50 font-bold text-rose-600 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Trash2 size={13} className="text-rose-600" /> Delete Record
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                    <span>Showing {auditLogsData.length > 0 ? `1 to ${Math.min(8, auditLogsData.length)} of ${auditLogsData.length}` : '0 of 0'} events</span>
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
                          <span className="text-[12px] font-black text-slate-900 leading-none">{auditLogsData.length > 0 ? auditLogsData.length : '00'}</span>
                          <span className="text-[7.5px] font-bold text-slate-400">Total Events</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-1.5 text-[9px]">
                        {[
                          { color: '#2563EB', label: 'Login Events', count: auditLogsData.length > 0 ? auditLogsData.filter(l => l.type === 'Login' || l.type === 'Authentication').length : '00', pct: auditLogsData.length > 0 ? '13.2%' : '0%' },
                          { color: '#16A34A', label: 'Data Updates', count: auditLogsData.length > 0 ? auditLogsData.filter(l => l.type === 'Data Update').length : '00', pct: auditLogsData.length > 0 ? '35.4%' : '0%' },
                          { color: '#F59E0B', label: 'Data Exports', count: auditLogsData.length > 0 ? auditLogsData.filter(l => l.type === 'Data Export').length : '00', pct: auditLogsData.length > 0 ? '8.7%' : '0%' },
                          { color: '#9333EA', label: 'Permission Changes', count: auditLogsData.length > 0 ? auditLogsData.filter(l => l.type === 'Permission Change').length : '00', pct: auditLogsData.length > 0 ? '0.4%' : '0%' },
                          { color: '#EF4444', label: 'Security Events', count: auditLogsData.length > 0 ? auditLogsData.filter(l => l.type === 'Security Event').length : '00', pct: auditLogsData.length > 0 ? '0.6%' : '0%' },
                          { color: '#64748B', label: 'Other Events', count: auditLogsData.length > 0 ? auditLogsData.filter(l => !['Login', 'Authentication', 'Data Update', 'Data Export', 'Permission Change', 'Security Event'].includes(l.type)).length : '00', pct: auditLogsData.length > 0 ? '41.7%' : '0%' },
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
                        { label: 'Failed Login Attempts', count: auditLogsData.length > 0 ? '86' : '00', color: auditLogsData.length > 0 ? 'text-rose-600' : 'text-slate-400', icon: <AlertTriangle size={12} className="text-rose-500" /> },
                        { label: 'Blocked Actions', count: auditLogsData.length > 0 ? '27' : '00', color: auditLogsData.length > 0 ? 'text-amber-600' : 'text-slate-400', icon: <CheckCircle2 size={12} className="text-amber-500" /> },
                        { label: 'Suspicious Activities', count: auditLogsData.length > 0 ? '15' : '00', color: auditLogsData.length > 0 ? 'text-amber-600' : 'text-slate-400', icon: <Shield size={12} className="text-amber-500" /> },
                        { label: 'Unusual Access Locations', count: auditLogsData.length > 0 ? '8' : '00', color: auditLogsData.length > 0 ? 'text-amber-600' : 'text-slate-400', icon: <Globe size={12} className="text-amber-500" /> },
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
                    {auditLogsData.length === 0 ? (
                      <div className="py-4 text-center text-xs font-semibold text-slate-400">
                        No active users recorded.
                      </div>
                    ) : (
                      [
                        { avatar: 'SM', bg: 'bg-purple-600', name: 'Sarah Mitchell', val: '1,248 events' },
                        { avatar: 'JD', bg: 'bg-blue-600', name: 'John Davis', val: '986 events' },
                        { avatar: 'RW', bg: 'bg-amber-600', name: 'Ravi Wilson', val: '842 events' },
                        { avatar: 'AH', bg: 'bg-teal-600', name: 'Amit Handa', val: '756 events' },
                        { avatar: 'BT', bg: 'bg-orange-600', name: 'Brian Taylor', val: '688 events' },
                      ].map((user, i) => (
                        <div key={i} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full ${user.bg} text-white font-black text-[8px] flex items-center justify-center shrink-0`}>{user.avatar}</div>
                            <span className="text-[10px] font-bold text-slate-800">{user.name}</span>
                          </div>
                          <span className="text-[9.5px] font-extrabold text-slate-900">{user.val}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* OTHER SUB-TAB PANELS */}

          {/* 1. AUDIT LOGS TAB */}
          {securityLogsTab === 'Audit Logs' && (
            <div className="space-y-3.5 text-left">
              <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-tight">System Audit Logs</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Comprehensive audit trail of all 24,680 user and system transactions.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleExportSecurityLogs} className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer shadow-2xs">
                    <Download size={13} /> Export CSV
                  </button>
                  <button onClick={() => setSecurityLogsTab('Overview')} className="px-3 py-1.5 bg-[#2563EB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer shadow-xs">
                    ← Back to Overview
                  </button>
                </div>
              </div>

              {/* SEARCH & FILTERS */}
              <div className="flex items-center gap-2 flex-wrap bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search by user, action, module or details..." className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:border-blue-400" />
                </div>
                <select className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white">
                  <option>All Modules</option><option>Authentication</option><option>Loads</option><option>Users & Roles</option><option>Reports</option><option>Vehicles</option><option>Expenses</option>
                </select>
                <select className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white">
                  <option>All Outcomes</option><option>Success</option><option>Failed</option><option>Blocked</option>
                </select>
                <button onClick={handleRefreshSecurityLogs} className="p-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"><RefreshCw size={13} className="text-slate-500" /></button>
              </div>

              {/* TABLE */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs overflow-x-auto">
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
                    {auditLogsData.map((row, i) => (
                      <tr key={row.id || i} className="hover:bg-blue-50/30 transition-colors">
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
                        <td className="py-2 px-1.5 text-right whitespace-nowrap relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenLogDropdownId(openLogDropdownId === `audit-${row.id}` ? null : `audit-${row.id}`);
                            }}
                            title="Actions Menu"
                            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer transition-colors border border-transparent"
                          >
                            <MoreHorizontal size={14} />
                          </button>

                          {openLogDropdownId === `audit-${row.id}` && (
                            <div
                              className="absolute right-0 top-8 z-50 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 text-xs text-left animate-in fade-in duration-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => { setOpenLogDropdownId(null); setSelectedAuditLog(row); }}
                                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2 cursor-pointer"
                              >
                                <Eye size={13} className="text-blue-600" /> View Details
                              </button>
                              <button
                                onClick={() => { setOpenLogDropdownId(null); handleOpenEditAuditLogModal(row); }}
                                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2 cursor-pointer"
                              >
                                <Edit size={13} className="text-amber-600" /> Edit Record
                              </button>
                              <div className="my-1 border-t border-slate-100"></div>
                              <button
                                onClick={() => { setOpenLogDropdownId(null); handleDeleteAuditLog(row.id); }}
                                className="w-full text-left px-3 py-1.5 hover:bg-rose-50 font-bold text-rose-600 flex items-center gap-2 cursor-pointer"
                              >
                                <Trash2 size={13} className="text-rose-600" /> Delete Record
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 p-3 bg-white rounded-xl border border-slate-200/80 text-[11px] font-semibold text-slate-500 shadow-2xs">
                <span>Showing 1 to 10 of 24,680 events</span>
                        <div className="flex items-center gap-1">
                  <button className="px-2.5 py-0.5 bg-[#2563EB] text-white font-bold rounded-md text-xs">1</button>
                  <button className="px-2.5 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">2</button>
                  <button className="px-2.5 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">3</button>
                  <button className="px-2.5 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">4</button>
                  <button className="px-2 py-0.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 font-bold text-xs">›</button>
                </div>
              </div>
            </div>
          )}

          {/* 2. LOGIN HISTORY TAB */}
          {securityLogsTab === 'Login History' && (
            <div className="space-y-3.5 text-left">
              {/* TOP CARDS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[9px] font-black text-slate-400 uppercase">TOTAL LOGINS (THIS MONTH)</span>
                  <div className="text-xl font-black text-slate-900 mt-1">{auditLogsData.length > 0 ? '3,245' : '00'}</div>
                  <span className={`text-[9px] font-extrabold ${auditLogsData.length > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>{auditLogsData.length > 0 ? '↑ 12.4% vs Last Month' : '0%'}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[9px] font-black text-slate-400 uppercase">UNIQUE ACTIVE USERS</span>
                  <div className="text-xl font-black text-slate-900 mt-1">{auditLogsData.length > 0 ? '142' : '00'}</div>
                  <span className="text-[9px] font-semibold text-slate-400">Across Depots</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[9px] font-black text-slate-400 uppercase">FAILED LOGIN ATTEMPTS</span>
                  <div className="text-xl font-black text-rose-600 mt-1">{auditLogsData.length > 0 ? '86' : '00'}</div>
                  <span className={`text-[9px] font-extrabold ${auditLogsData.length > 0 ? 'text-rose-600' : 'text-slate-400'}`}>{auditLogsData.length > 0 ? '↓ 8.7% vs Last Month' : '0%'}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[9px] font-black text-slate-400 uppercase">ACTIVE SESSIONS NOW</span>
                  <div className="text-xl font-black text-emerald-600 mt-1">{auditLogsData.length > 0 ? '24 Live' : '00'}</div>
                  <span className="text-[9px] font-semibold text-slate-400">Web & Mobile Apps</span>
                </div>
              </div>

              {/* TABLE */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">LOGIN AUDIT TRAIL</h3>
                  <button onClick={() => setSecurityLogsTab('Overview')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">← Back to Overview</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-extrabold text-[#1E1B4B] bg-slate-50/50">
                        <th className="py-2 px-2">Timestamp</th>
                        <th className="py-2 px-2">User</th>
                        <th className="py-2 px-2">Login Method</th>
                        <th className="py-2 px-2">Device / Browser</th>
                        <th className="py-2 px-2">Location</th>
                        <th className="py-2 px-2">IP Address</th>
                        <th className="py-2 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {auditLogsData.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-xs font-semibold text-slate-400 bg-slate-50/50">
                            No login history recorded yet.
                          </td>
                        </tr>
                      ) : (
                        [
                          { time: '30 May 09:15 AM', name: 'Sarah Mitchell', method: 'Web App', device: 'Chrome / Windows 11', location: 'Sydney, NSW', ip: '203.26.45.12', status: 'Success', bg: 'bg-emerald-100 text-emerald-700' },
                          { time: '30 May 09:02 AM', name: 'John Davis', method: 'Mobile Driver App', device: 'iOS App 3.2.1', location: 'Melbourne, VIC', ip: '203.26.45.18', status: 'Success', bg: 'bg-emerald-100 text-emerald-700' },
                          { time: '30 May 08:58 AM', name: 'Lisa Patel', method: 'Web App', device: 'Firefox / MacOS', location: 'Brisbane, QLD', ip: '203.26.45.99', status: 'Failed (Bad Password)', bg: 'bg-rose-100 text-rose-700' },
                          { time: '30 May 08:45 AM', name: 'Ravi Wilson', method: 'Web App', device: 'Edge / Windows 10', location: 'Sydney, NSW', ip: '203.26.45.21', status: 'Success', bg: 'bg-emerald-100 text-emerald-700' },
                          { time: '30 May 08:12 AM', name: 'Amit Handa', method: 'API OAuth2', device: 'Automated Service Token', location: 'Sydney Depot Server', ip: '203.26.45.12', status: 'Success', bg: 'bg-emerald-100 text-emerald-700' },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-2 font-mono text-[10px] text-slate-500">{row.time}</td>
                            <td className="py-2.5 px-2 font-bold text-slate-900">{row.name}</td>
                            <td className="py-2.5 px-2 font-semibold text-slate-600">{row.method}</td>
                            <td className="py-2.5 px-2 font-medium text-slate-500">{row.device}</td>
                            <td className="py-2.5 px-2 font-semibold text-slate-700">{row.location}</td>
                            <td className="py-2.5 px-2 font-mono text-[10px] text-slate-400">{row.ip}</td>
                            <td className="py-2.5 px-2"><span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${row.bg}`}>{row.status}</span></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. SECURITY EVENTS TAB */}
          {securityLogsTab === 'Security Events' && (
            <div className="space-y-3.5 text-left">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl shadow-2xs">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-xs"><AlertTriangle size={16} /> Critical Security Events</div>
                  <div className="text-2xl font-black text-rose-900 mt-1">{auditLogsData.length > 0 ? '2 Active Alerts' : '00'}</div>
                  <p className="text-[10px] text-rose-600 font-medium mt-0.5">Requires immediate administrator review.</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl shadow-2xs">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-xs"><Shield size={16} /> Warnings & Threats</div>
                  <div className="text-2xl font-black text-amber-900 mt-1">{auditLogsData.length > 0 ? '15 Flagged' : '00'}</div>
                  <p className="text-[10px] text-amber-600 font-medium mt-0.5">Suspicious IP & login attempts.</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl shadow-2xs">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs"><CheckCircle2 size={16} /> Resolved Threats</div>
                  <div className="text-2xl font-black text-emerald-900 mt-1">{auditLogsData.length > 0 ? '139 Resolved' : '00'}</div>
                  <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Auto-blocked by firewall rules.</p>
                </div>
              </div>

              {/* SECURITY ALERTS LIST */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">SECURITY EVENT LOG</h3>
                  <button onClick={() => setSecurityLogsTab('Overview')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">← Back to Overview</button>
                </div>
                <div className="space-y-2.5">
                  {auditLogsData.length === 0 ? (
                    <div className="py-8 text-center text-xs font-semibold text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                      No security events logged yet.
                    </div>
                  ) : (
                    [
                      { title: 'Multiple Failed Login Attempts (5x)', severity: 'CRITICAL', bg: 'bg-rose-100 text-rose-700', desc: 'Account: sarah.mitchell@herologistics.com.au. 5 consecutive wrong passwords entered from IP 203.26.45.99.', time: '12 mins ago', action: 'Lock Account' },
                      { title: 'New Device Login Detected', severity: 'WARNING', bg: 'bg-amber-100 text-amber-700', desc: 'User John Davis logged in from an unrecognized device (Macintosh OS X) in Brisbane QLD.', time: '1 hour ago', action: 'Verify User' },
                      { title: 'API Secret Key Regenerated', severity: 'INFO', bg: 'bg-blue-100 text-blue-700', desc: 'Admin Ravi Wilson regenerated Production Fleet Sync API key.', time: '3 hours ago', action: 'View Log' },
                    ].map((evt, i) => (
                      <div key={i} className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black ${evt.bg}`}>{evt.severity}</span>
                            <h4 className="text-xs font-bold text-slate-900">{evt.title}</h4>
                            <span className="text-[10px] text-slate-400 font-medium">• {evt.time}</span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium">{evt.desc}</p>
                        </div>
                        <button onClick={() => triggerToast(`Action executed: ${evt.action}`)} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs shrink-0">{evt.action}</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. PERMISSION CHANGES TAB */}
          {securityLogsTab === 'Permission Changes' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">ROLE & PERMISSION CHANGE AUDIT</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Log of all privilege modifications and access level assignments.</p>
                </div>
                <button onClick={() => setSecurityLogsTab('Overview')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">← Back to Overview</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-extrabold text-[#1E1B4B] bg-slate-50/50">
                      <th className="py-2 px-2">Timestamp</th>
                      <th className="py-2 px-2">Modified By</th>
                      <th className="py-2 px-2">Target Role</th>
                      <th className="py-2 px-2">Action</th>
                      <th className="py-2 px-2">Details of Change</th>
                      <th className="py-2 px-2">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {auditLogsData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-xs font-semibold text-slate-400 bg-slate-50/50">
                          No permission changes recorded yet.
                        </td>
                      </tr>
                    ) : (
                      [
                        { time: '30 May 09:10 AM', by: 'Ravi Wilson', role: 'Dispatcher', action: 'Granted Export Rights', details: 'Added permissions: export_reports, download_pod', ip: '203.26.45.21' },
                        { time: '28 May 04:30 PM', by: 'Sarah Mitchell', role: 'Fleet Manager', action: 'Revoked Settings Access', details: 'Removed permission: company_settings_edit', ip: '203.26.45.12' },
                        { time: '25 May 11:15 AM', by: 'Sarah Mitchell', role: 'Accountant', action: 'Created New Role', details: 'Created custom role: Senior Accountant with full invoicing rights', ip: '203.26.45.12' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-2 font-mono text-[10px] text-slate-500">{row.time}</td>
                          <td className="py-2.5 px-2 font-bold text-slate-900">{row.by}</td>
                          <td className="py-2.5 px-2"><span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-bold">{row.role}</span></td>
                          <td className="py-2.5 px-2 font-bold text-slate-800">{row.action}</td>
                          <td className="py-2.5 px-2 font-medium text-slate-600">{row.details}</td>
                          <td className="py-2.5 px-2 font-mono text-[10px] text-slate-400">{row.ip}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. DATA ACCESS TAB */}
          {securityLogsTab === 'Data Access' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">DATA ACCESS & READ LOGS</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Tracking sensitive database queries, customer data reads, and API payloads.</p>
                </div>
                <button onClick={() => setSecurityLogsTab('Overview')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">← Back to Overview</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-extrabold text-[#1E1B4B] bg-slate-50/50">
                      <th className="py-2 px-2">Timestamp</th>
                      <th className="py-2 px-2">User / API</th>
                      <th className="py-2 px-2">Resource Accessed</th>
                      <th className="py-2 px-2">Access Type</th>
                      <th className="py-2 px-2">Records Touched</th>
                      <th className="py-2 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {auditLogsData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-xs font-semibold text-slate-400 bg-slate-50/50">
                          No data access records found.
                        </td>
                      </tr>
                    ) : (
                      [
                        { time: '30 May 09:14 AM', user: 'Amit Handa', res: 'Customer Billing & Tax Files', type: 'Bulk Read Query', records: '1,240 rows', status: 'Authorized' },
                        { time: '30 May 09:05 AM', user: 'Live Fleet API Token', res: 'GPS Telematics Stream', type: 'REST API Sync', records: '48 trucks', status: 'Authorized' },
                        { time: '30 May 08:40 AM', user: 'Sarah Mitchell', res: 'Driver Medical Clearances', type: 'Single Record View', records: '1 record', status: 'Authorized' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-2 font-mono text-[10px] text-slate-500">{row.time}</td>
                          <td className="py-2.5 px-2 font-bold text-slate-900">{row.user}</td>
                          <td className="py-2.5 px-2 font-bold text-slate-800">{row.res}</td>
                          <td className="py-2.5 px-2 font-semibold text-blue-600">{row.type}</td>
                          <td className="py-2.5 px-2 font-medium text-slate-600">{row.records}</td>
                          <td className="py-2.5 px-2"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-extrabold">{row.status}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. EXPORTS & DOWNLOADS TAB */}
          {securityLogsTab === 'Exports & Downloads' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">EXPORTS & FILE DOWNLOAD LOGS</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Audit history of all generated PDF reports, CSV dumps, and financial exports.</p>
                </div>
                <button onClick={() => setSecurityLogsTab('Overview')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">← Back to Overview</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-extrabold text-[#1E1B4B] bg-slate-50/50">
                      <th className="py-2 px-2">Timestamp</th>
                      <th className="py-2 px-2">User</th>
                      <th className="py-2 px-2">Report Name</th>
                      <th className="py-2 px-2">Format</th>
                      <th className="py-2 px-2">Size</th>
                      <th className="py-2 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {auditLogsData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-xs font-semibold text-slate-400 bg-slate-50/50">
                          No export or download records found.
                        </td>
                      </tr>
                    ) : (
                      [
                        { time: '30 May 09:05 AM', user: 'Amit Handa', name: 'Tax_Invoices_May2025.pdf', fmt: 'PDF', size: '2.4 MB', status: 'Completed' },
                        { time: '30 May 08:30 AM', user: 'Shane Cooper', name: 'Fleet_Maintenance_Audit.csv', fmt: 'CSV', size: '540 KB', status: 'Blocked (Restricted)' },
                        { time: '29 May 05:12 PM', user: 'Sarah Mitchell', name: 'Driver_Fatigue_Logbook.xlsx', fmt: 'Excel', size: '1.1 MB', status: 'Completed' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-2 font-mono text-[10px] text-slate-500">{row.time}</td>
                          <td className="py-2.5 px-2 font-bold text-slate-900">{row.user}</td>
                          <td className="py-2.5 px-2 font-bold text-slate-800">{row.name}</td>
                          <td className="py-2.5 px-2 font-bold text-purple-600">{row.fmt}</td>
                          <td className="py-2.5 px-2 font-medium text-slate-500">{row.size}</td>
                          <td className="py-2.5 px-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${row.status.includes('Completed') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{row.status}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. BLOCKED ACTIONS TAB */}
          {securityLogsTab === 'Blocked Actions' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">SECURITY BLOCKED ACTIONS</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Log of all requests blocked by role policies, firewalls, and security guards.</p>
                </div>
                <button onClick={() => setSecurityLogsTab('Overview')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">← Back to Overview</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-extrabold text-[#1E1B4B] bg-slate-50/50">
                      <th className="py-2 px-2">Timestamp</th>
                      <th className="py-2 px-2">User / IP</th>
                      <th className="py-2 px-2">Attempted Action</th>
                      <th className="py-2 px-2">Blocked Policy</th>
                      <th className="py-2 px-2">Severity</th>
                      <th className="py-2 px-2">Action Taken</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {auditLogsData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-xs font-semibold text-slate-400 bg-slate-50/50">
                          No blocked actions recorded yet.
                        </td>
                      </tr>
                    ) : (
                      [
                        { time: '30 May 08:30 AM', user: 'Shane Cooper (203.26.45.77)', action: 'Export Restricted Payroll', policy: 'Policy #4: Non-Finance Export Restriction', severity: 'HIGH', status: 'Blocked & Flagged' },
                        { time: '29 May 02:40 PM', user: 'Unknown IP (185.220.101.5)', action: 'Brute Force API Login', policy: 'Rate Limit: Max 5 req/min', severity: 'CRITICAL', status: 'IP Banned (24h)' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-2 font-mono text-[10px] text-slate-500">{row.time}</td>
                          <td className="py-2.5 px-2 font-bold text-slate-900">{row.user}</td>
                          <td className="py-2.5 px-2 font-bold text-slate-800">{row.action}</td>
                          <td className="py-2.5 px-2 font-medium text-slate-600">{row.policy}</td>
                          <td className="py-2.5 px-2"><span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[9px] font-black">{row.severity}</span></td>
                          <td className="py-2.5 px-2"><span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[9px] font-extrabold">{row.status}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. SETTINGS TAB */}
          {securityLogsTab === 'Settings' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs text-left space-y-4 max-w-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Security & Log Retention Settings</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Configure audit data retention rules, authentication policies, and alert limits.</p>
                </div>
                <button onClick={() => setSecurityLogsTab('Overview')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">← Back to Overview</button>
              </div>

              <form onSubmit={handleSaveSecuritySettingsSubmit} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Audit Log Retention Period</label>
                  <select
                    value={securitySettingsForm.retentionDays}
                    onChange={e => setSecuritySettingsForm({ ...securitySettingsForm, retentionDays: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-slate-800 bg-white focus:outline-none focus:border-blue-400 font-sans"
                  >
                    <option value="90 Days">90 Days</option>
                    <option value="180 Days">180 Days</option>
                    <option value="365 Days">365 Days (1 Year - Compliance Standard)</option>
                    <option value="7 Years">7 Years (Financial & Transport NHVR Requirement)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-b border-slate-100">
                  <div>
                    <label className="font-bold text-slate-800 block">Enforce Two-Factor Authentication (2FA)</label>
                    <span className="text-[11px] text-slate-500">Require 2FA code via SMS / Authenticator for all admin users.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={securitySettingsForm.twoFactorAuth}
                    onChange={e => setSecuritySettingsForm({ ...securitySettingsForm, twoFactorAuth: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Session Idle Timeout</label>
                  <select
                    value={securitySettingsForm.sessionTimeout}
                    onChange={e => setSecuritySettingsForm({ ...securitySettingsForm, sessionTimeout: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-slate-800 bg-white focus:outline-none focus:border-blue-400 font-sans"
                  >
                    <option value="15 Minutes">15 Minutes</option>
                    <option value="30 Minutes">30 Minutes (Recommended)</option>
                    <option value="1 Hour">1 Hour</option>
                    <option value="4 Hours">4 Hours</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <div>
                    <label className="font-bold text-slate-800 block">Security Alert Notifications</label>
                    <span className="text-[11px] text-slate-500">Receive instant email alerts on critical failed logins & blocked actions.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={securitySettingsForm.auditAlerts}
                    onChange={e => setSecuritySettingsForm({ ...securitySettingsForm, auditAlerts: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button type="submit" className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer">
                    Save Security Settings
                  </button>
                </div>
              </form>
            </div>
          )}



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
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">Subscription & Billing</h1>
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
          <div className="flex items-center gap-2 border-b border-slate-200/80 overflow-x-auto pb-3 pt-1 scrollbar-hide">
            {['Overview', 'Plan & Usage', 'Add-ons', 'Invoices', 'Payment Methods', 'Billing History', 'Quotes & Orders'].map((tab) => (
              <button
                key={tab}
                onClick={() => setBillingTab(tab)}
                className={`px-3.5 py-1.5 text-xs font-black whitespace-nowrap transition-all rounded-xl cursor-pointer outline-none focus:outline-none focus:ring-0 select-none ${billingTab === tab
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/60 font-bold'
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
                  {
                    icon: <Crown size={16} />, bg: 'bg-purple-100 text-purple-600', border: 'hover:border-purple-200',
                    label: 'CURRENT PLAN',
                    value: billingDataLoading ? '—' : (billingData?.plan?.name || 'No Plan'),
                    link: 'View plan details →', onClick: () => setBillingTab('Plan & Usage')
                  },
                  {
                    icon: <Calendar size={16} />, bg: 'bg-[#DCFCE7] text-[#16A34A]', border: 'hover:border-emerald-200',
                    label: 'BILLING CYCLE',
                    value: billingDataLoading ? '—' : (billingData?.subscription?.billingPeriod === 'ANNUALLY' ? 'Annual' : 'Monthly'),
                    subText: billingData?.subscription?.nextBillingDate ? `Next billing: ${new Date(billingData.subscription.nextBillingDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}` : '',
                    link: 'Change billing cycle →', onClick: () => setIsManageSubscriptionModalOpen(true)
                  },
                  {
                    icon: <DollarSign size={16} />, bg: 'bg-[#DBEAFE] text-[#2563EB]', border: 'hover:border-blue-200',
                    label: 'AMOUNT DUE',
                    value: billingDataLoading ? '—' : `$${(billingData?.subscription?.amountDue || 0).toFixed(2)}`,
                    subText: billingData?.subscription?.nextBillingDate ? `Due: ${new Date(billingData.subscription.nextBillingDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}` : 'No amount due',
                    link: 'View invoices →', onClick: () => setBillingTab('Invoices')
                  },
                  {
                    icon: <Activity size={16} />, bg: 'bg-amber-100 text-amber-600', border: 'hover:border-amber-200',
                    label: 'USAGE STATUS',
                    value: billingDataLoading ? '—' : `${billingData?.usage?.overallUsagePercent || 0}%`,
                    subText: 'Overall usage this month',
                    link: 'View usage →', onClick: () => setBillingTab('Plan & Usage')
                  },
                  {
                    icon: <Users size={16} />, bg: 'bg-teal-100 text-teal-600', border: 'hover:border-teal-200',
                    label: 'ACTIVE USERS',
                    value: billingDataLoading ? '—' : `${billingData?.usage?.activeUsers || 0} / ${billingData?.usage?.userLimit || 0}`,
                    subText: 'Users in your plan',
                    link: 'Manage users →', onClick: () => setCurrentView('users-permissions')
                  },
                  {
                    icon: <Clock size={16} />, bg: 'bg-rose-100 text-rose-600', border: 'hover:border-rose-200',
                    label: 'DAYS LEFT IN CYCLE',
                    value: billingDataLoading ? '—' : (billingData?.subscription?.daysLeftInCycle != null ? `${billingData.subscription.daysLeftInCycle} days` : '—'),
                    subText: billingData?.subscription?.nextBillingDate ? `Until ${new Date(billingData.subscription.nextBillingDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}` : '',
                    link: 'View billing schedule →', onClick: () => setBillingTab('Billing History')
                  },
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

                        {billingDataLoading ? (
                          <div className="py-2 text-center text-[10px] font-semibold text-slate-400">Loading usage data...</div>
                        ) : [
                          { label: 'Users', val: `${billingData?.usage?.activeUsers || 0} / ${billingData?.usage?.userLimit || 0}`, pct: billingData?.usage?.userLimit > 0 ? Math.round((billingData.usage.activeUsers / billingData.usage.userLimit) * 100) : 0 },
                          { label: 'Monthly Loads', val: `${billingData?.usage?.monthlyLoads || 0}`, pct: 0 },
                          { label: 'Storage', val: `${billingData?.usage?.storageUsedGB || 0} GB / ${billingData?.usage?.storageLimitGB || 0} GB`, pct: billingData?.usage?.storageLimitGB > 0 ? Math.round((billingData.usage.storageUsedGB / billingData.usage.storageLimitGB) * 100) : 0 },
                          { label: 'API Calls', val: `${(billingData?.usage?.apiCallsThisMonth || 0).toLocaleString()} / ${(billingData?.usage?.apiLimit || 0).toLocaleString()}`, pct: billingData?.usage?.apiLimit > 0 ? Math.round((billingData.usage.apiCallsThisMonth / billingData.usage.apiLimit) * 100) : 0 },
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

                        {billingDataLoading ? (
                          <div className="py-2 text-center text-[10px] font-semibold text-slate-400">Loading add-ons...</div>
                        ) : (billingData?.addons?.length || 0) === 0 ? (
                          <div className="py-2 text-center text-[10px] font-semibold text-slate-400">No add-ons configured for this plan.</div>
                        ) : billingData.addons.map((addon, i) => (
                          <div key={i} className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-slate-200/70">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center shrink-0"><Cpu size={14} /></div>
                              <div>
                                <div className="text-[10px] font-extrabold text-slate-900 leading-tight">{addon.name}</div>
                                <div className="text-[7.5px] font-medium text-slate-400 leading-tight">{addon.description || ''}</div>
                              </div>
                            </div>
                            <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase ${addon.isEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{addon.isEnabled ? 'Active' : 'Inactive'}</span>
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
                      {billingDataLoading ? (
                        <div className="py-3 text-center text-[10px] font-semibold text-slate-400">Loading billing summary...</div>
                      ) : billingData?.plan ? (
                        <>
                          <div className="flex justify-between font-semibold text-slate-700"><span>Plan ({billingData.plan.name})</span><span className="font-black text-slate-900">${(billingData.plan.monthlyPrice || 0).toFixed(2)}</span></div>
                          {billingData.addons?.filter(a => a.isEnabled).map((addon, i) => (
                            <div key={i} className="flex justify-between font-semibold text-slate-700"><span>{addon.name}</span><span className="font-black text-slate-900">Active</span></div>
                          ))}
                          {(billingData.subscription?.discountApplied || 0) > 0 && (
                            <div className="flex justify-between font-semibold text-emerald-600"><span>Discount</span><span className="font-black">-${billingData.subscription.discountApplied.toFixed(2)}</span></div>
                          )}
                          <div className="pt-2 border-t border-slate-100 flex justify-between font-semibold text-slate-700"><span>Amount Due</span><span className="font-black text-slate-900">${(billingData.subscription?.amountDue || 0).toFixed(2)}</span></div>
                        </>
                      ) : (
                        <div className="py-3 text-center text-[10px] font-semibold text-slate-400">No billing summary available. No active plan found.</div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 uppercase">Total (AUD)</span>
                    <span className="text-2xl font-black text-[#2563EB] leading-none">${(billingData?.subscription?.amountDue || 0).toFixed(2)}</span>
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
                        {billingDataLoading ? (
                          <tr><td colSpan={7} className="py-8 text-center text-[10px] font-semibold text-slate-400">Loading invoices...</td></tr>
                        ) : (billingData?.billingRecords?.length || 0) === 0 ? (
                          <tr><td colSpan={7} className="py-8 text-center text-[10px] font-semibold text-slate-400">No invoices found. Invoices will appear here once your first billing cycle completes.</td></tr>
                        ) : billingData.billingRecords.slice(0, 5).map((row, i) => (
                          <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                            <td className="py-2 px-2 whitespace-nowrap"><span className="text-[10px] font-extrabold text-[#2563EB]">{row.invoiceNumber || '—'}</span></td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9.5px] font-semibold text-slate-500">{row.date ? new Date(row.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span></td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9.5px] font-bold text-slate-800 whitespace-nowrap">{row.planTierSnapshot || 'Subscription'}</span></td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className="text-[10px] font-black text-slate-900">${(row.amount || 0).toFixed(2)}</span></td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${row.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : row.status === 'OVERDUE' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{row.status}</span></td>
                            <td className="py-2 px-2 whitespace-nowrap"><span className="text-[9px] font-medium text-slate-600">{row.paymentMethod || '—'}</span></td>
                            <td className="py-2 px-2 text-center whitespace-nowrap">
                              <button onClick={() => handleDownloadSingleInvoice(row)} className="p-1 hover:bg-slate-100 text-slate-500 hover:text-[#2563EB] rounded-lg cursor-pointer">
                                <Download size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                    <span>Showing {Math.min(5, billingData?.billingRecords?.length || 0)} of {billingData?.billingRecords?.length || 0} recent invoices</span>
                    <button onClick={() => setBillingTab('Invoices')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">View all invoices →</button>
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

                    {billingDataLoading ? (
                      <div className="py-3 text-center text-[10px] font-semibold text-slate-400">Loading payment method...</div>
                    ) : billingData?.paymentMethod?.cardLast4 ? (
                      <div className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
                        <div className="flex items-center gap-2.5">
                          <div className="px-2 py-1 bg-[#1A1F71] text-white rounded font-extrabold text-[10px] tracking-wider italic">
                            {billingData.paymentMethod.cardBrand?.toUpperCase() || 'CARD'}
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900">{billingData.paymentMethod.cardBrand || 'Card'} ending in {billingData.paymentMethod.cardLast4}</div>
                            {billingData.paymentMethod.cardExpiry && <div className="text-[9px] font-semibold text-slate-400">Expires {billingData.paymentMethod.cardExpiry}</div>}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[8.5px] font-black uppercase">Primary</span>
                      </div>
                    ) : (
                      <div className="py-3 text-center text-[10px] font-semibold text-slate-400">No payment method on file. Please add a payment method.</div>
                    )}
                  </div>

                  {/* NEXT BILLING */}
                  <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs text-left space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">NEXT BILLING</h3>
                      <button onClick={() => setBillingTab('Billing History')} className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">View schedule →</button>
                    </div>

                  </div>
                </div>

              </div>
            </>
          )}

          {/* 13.9 SUB-TAB 2: PLAN & USAGE */}
          {billingTab === 'Plan & Usage' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">ACTIVE PLAN & RESOURCE USAGE</h3>
                    <p className="text-xs text-slate-500 font-medium">Real-time seat consumption, API limits, and storage quotas for Hero Pro plan.</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black rounded-full uppercase">Hero Pro Plan Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
                  {billingDataLoading ? (
                    <div className="col-span-4 py-6 text-center text-[10px] font-semibold text-slate-400">Loading usage metrics...</div>
                  ) : [
                    {
                      label: 'USER SEATS',
                      val: `${billingData?.usage?.activeUsers || 0} / ${billingData?.usage?.userLimit || 0}`,
                      pct: billingData?.usage?.userLimit > 0 ? Math.round((billingData.usage.activeUsers / billingData.usage.userLimit) * 100) : 0,
                      color: 'bg-blue-500',
                      note: billingData?.usage?.userLimit > 0 ? `${billingData.usage.userLimit - billingData.usage.activeUsers} seats available` : '—'
                    },
                    {
                      label: 'MONTHLY LOADS',
                      val: `${(billingData?.usage?.monthlyLoads || 0).toLocaleString()}`,
                      pct: 0,
                      color: 'bg-emerald-500',
                      note: 'Loads created this month'
                    },
                    {
                      label: 'CLOUD STORAGE',
                      val: `${billingData?.usage?.storageUsedGB || 0} GB / ${billingData?.usage?.storageLimitGB || 0} GB`,
                      pct: billingData?.usage?.storageLimitGB > 0 ? Math.round((billingData.usage.storageUsedGB / billingData.usage.storageLimitGB) * 100) : 0,
                      color: 'bg-purple-500',
                      note: billingData?.usage?.storageLimitGB > 0 ? `${billingData.usage.storageLimitGB - billingData.usage.storageUsedGB} GB remaining` : '—'
                    },
                    {
                      label: 'API REQUESTS',
                      val: `${(billingData?.usage?.apiCallsThisMonth || 0).toLocaleString()} / ${(billingData?.usage?.apiLimit || 0).toLocaleString()}`,
                      pct: billingData?.usage?.apiLimit > 0 ? Math.round((billingData.usage.apiCallsThisMonth / billingData.usage.apiLimit) * 100) : 0,
                      color: 'bg-amber-500',
                      note: billingData?.usage?.apiLimit > 0 ? `${(billingData.usage.apiLimit - billingData.usage.apiCallsThisMonth).toLocaleString()} calls remaining` : '—'
                    },
                  ].map((metric, i) => (
                    <div key={i} className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        <span>{metric.label}</span>
                        <span className="text-slate-900 font-extrabold">{metric.pct}%</span>
                      </div>
                      <div className="text-lg font-black text-slate-900">{metric.val}</div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${metric.color} rounded-full`} style={{ width: `${metric.pct}%` }}></div>
                      </div>
                      <span className="text-[9.5px] font-semibold text-slate-500 block">{metric.note}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="border border-slate-200/80 rounded-xl p-4 bg-white space-y-3">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">INCLUDED PLAN ENTITLEMENTS</h4>
                    <div className="space-y-2 text-xs font-semibold text-slate-700">
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"><span>Full Dispatch & Fleet Operations</span><span className="text-emerald-600 font-bold">✓ Included</span></div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"><span>Driver App & Pre-start Checklists</span><span className="text-emerald-600 font-bold">✓ Included</span></div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"><span>Live GPS Fleet Tracking Map</span><span className="text-emerald-600 font-bold">✓ Included</span></div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"><span>Xero & QuickBooks Accounting Sync</span><span className="text-emerald-600 font-bold">✓ Included</span></div>
                    </div>
                  </div>
                  <div className="border border-slate-200/80 rounded-xl p-4 bg-white space-y-3">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">USAGE ALERTS & NOTIFICATIONS</h4>
                    <div className="space-y-2 text-xs font-medium text-slate-600">
                      {billingData?.usage?.storageLimitGB > 0 && billingData.usage.storageUsedGB / billingData.usage.storageLimitGB > 0.7 ? (
                        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="font-bold text-amber-900 block">Cloud Storage at {Math.round((billingData.usage.storageUsedGB / billingData.usage.storageLimitGB) * 100)}% Capacity</span>
                            <span className="text-[10px] text-amber-700">Consider upgrading storage add-on before reaching {billingData.usage.storageLimitGB} GB.</span>
                          </div>
                          <button onClick={() => setBillingTab('Add-ons')} className="px-2.5 py-1 bg-amber-600 text-white font-bold text-[10px] rounded-lg shrink-0">Upgrade</button>
                        </div>
                      ) : null}
                      {billingData?.usage?.apiLimit > 0 ? (
                        <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="font-bold text-blue-900 block">API Rate Limit {billingData.usage.apiCallsThisMonth / billingData.usage.apiLimit > 0.8 ? 'Warning' : 'Healthy'}</span>
                            <span className="text-[10px] text-blue-700">{billingData.usage.apiCallsThisMonth.toLocaleString()} of {billingData.usage.apiLimit.toLocaleString()} API calls used this month.</span>
                          </div>
                          <span className={`px-2 py-0.5 font-bold text-[9px] rounded uppercase ${billingData.usage.apiCallsThisMonth / billingData.usage.apiLimit > 0.8 ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{billingData.usage.apiCallsThisMonth / billingData.usage.apiLimit > 0.8 ? 'Warning' : 'Normal'}</span>
                        </div>
                      ) : (
                        <div className="py-4 text-center text-[10px] font-semibold text-slate-400">No usage alerts at this time.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 13.9 SUB-TAB 3: ADD-ONS */}
          {billingTab === 'Add-ons' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">ADD-ONS & FEATURE MODULES CATALOG</h3>
                    <p className="text-xs text-slate-500 font-medium">Activate extra AI capabilities, SMS bundles, storage, and telematics modules.</p>
                  </div>
                  <span className="text-xs font-bold text-slate-500">3 Active Add-ons ($327.00/mo)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {billingDataLoading ? (
                    <div className="col-span-3 py-8 text-center text-[10px] font-semibold text-slate-400">Loading add-ons...</div>
                  ) : (billingData?.addons?.length || 0) === 0 ? (
                    <div className="col-span-3 py-8 text-center text-[10px] font-semibold text-slate-400">No add-ons configured for this plan. Contact support to enable add-ons.</div>
                  ) : billingData.addons.map((addon, i) => (
                    <div key={i} className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-[#2563EB] flex items-center justify-center shadow-3xs"><Cpu size={20} /></div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${addon.isEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{addon.isEnabled ? 'Active' : 'Inactive'}</span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900">{addon.name}</h4>
                        <p className="text-[11px] text-slate-500 font-medium mt-1.5 leading-relaxed">{addon.description || ''}</p>
                      </div>
                      <button
                        onClick={() => triggerToast(`${addon.isEnabled ? 'Deactivated' : 'Activated'} ${addon.name} successfully!`)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-3xs ${addon.isEnabled ? 'bg-white border border-slate-200 text-rose-600 hover:bg-rose-50' : 'bg-[#2563EB] text-white hover:bg-blue-700'}`}
                      >
                        {addon.isEnabled ? 'Manage / Deactivate' : 'Activate Add-on'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 13.9 SUB-TAB 4: INVOICES */}
          {billingTab === 'Invoices' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">ALL TAX INVOICES & STATEMENTS</h3>
                    <p className="text-xs text-slate-500 font-medium">Download tax invoices for monthly subscription and add-on charges.</p>
                  </div>
                  <button onClick={handleDownloadStatement} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer">
                    <Download size={13} /> Export All Invoices (Zip)
                  </button>
                </div>

                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-extrabold text-[#1E1B4B] bg-slate-50">
                        <th className="py-2.5 px-3 whitespace-nowrap">Invoice #</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">Billing Date</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">Description</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">Subtotal</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">GST (10%)</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">Total Amount</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                        <th className="py-2.5 px-3 text-center whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                      {billingDataLoading ? (
                        <tr><td colSpan={8} className="py-8 text-center text-[10px] font-semibold text-slate-400">Loading invoices...</td></tr>
                      ) : (billingData?.billingRecords?.length || 0) === 0 ? (
                        <tr><td colSpan={8} className="py-8 text-center text-[10px] font-semibold text-slate-400">No invoices found. Invoices will appear here once your subscription billing cycle completes.</td></tr>
                      ) : billingData.billingRecords.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3 font-bold text-[#2563EB]">{row.invoiceNumber || '—'}</td>
                          <td className="py-3 px-3 text-slate-500">{row.date ? new Date(row.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                          <td className="py-3 px-3 font-bold text-slate-900">{row.planTierSnapshot || 'Subscription'}</td>
                      <td className="py-3 px-3">${((row.amount || 0) - (row.taxAmount || 0)).toFixed(2)}</td>
                          <td className="py-3 px-3 text-slate-500">${(row.taxAmount || 0).toFixed(2)}</td>
                          <td className="py-3 px-3 font-black text-slate-900">${(row.amount || 0).toFixed(2)}</td>
                          <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${row.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{row.status}</span></td>
                          <td className="py-3 px-3 text-center">
                            <button onClick={() => handleDownloadSingleInvoice(row)} className="p-1.5 bg-slate-100 hover:bg-blue-50 hover:text-[#2563EB] rounded-lg transition-colors cursor-pointer">
                              <Download size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {/* 13.9 SUB-TAB 5: PAYMENT METHODS */}
          {billingTab === 'Payment Methods' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">SAVED PAYMENT METHODS</h3>
                    <p className="text-xs text-slate-500 font-medium">Manage credit cards, direct debit accounts, and instant payment options for monthly auto-billing.</p>
                  </div>
                  <button onClick={() => setIsAddPaymentMethodModalOpen(true)} className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-700 active:scale-95 transition-all cursor-pointer">
                    <CreditCard size={14} /> + Add Payment Method
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethodsList.map((method) => (
                    <div
                      key={method.id}
                      className={`border rounded-xl p-4 space-y-3 relative transition-all ${
                        method.isPrimary
                          ? 'border-blue-300 bg-blue-50/40 shadow-2xs'
                          : 'border-slate-200/80 bg-slate-50/40 hover:bg-slate-50'
                      }`}
                    >
                      {method.isPrimary && (
                        <span className="absolute top-4 right-4 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded-full">
                          Primary
                        </span>
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`px-2.5 py-1 text-white rounded font-extrabold text-xs italic tracking-wider shadow-2xs ${method.badgeBg}`}>
                          {method.badgeText}
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900">{method.type}</h4>
                          <span className="text-xs text-slate-500 font-medium">
                            {method.expDate.startsWith('BSB') || method.expDate.includes('Verified') ? method.expDate : `Expires ${method.expDate}`} • {method.cardHolder}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-slate-200/60">
                        {method.isPrimary ? (
                          <span className="text-xs text-slate-600 font-medium">
                            {method.note}
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleMakePrimaryPaymentMethod(method.id)}
                              className="text-[#2563EB] hover:underline cursor-pointer"
                            >
                              Make Primary
                            </button>
                            <button
                              onClick={() => handleRemovePaymentMethod(method.id)}
                              className="text-rose-600 hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {paymentMethodsList.length === 0 && (
                    <div className="col-span-2 p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                      <CreditCard className="mx-auto mb-2 opacity-50" size={32} />
                      <p className="text-xs font-bold">No saved payment methods found.</p>
                      <button
                        onClick={() => setIsAddPaymentMethodModalOpen(true)}
                        className="mt-3 text-xs text-[#2563EB] font-bold hover:underline cursor-pointer"
                      >
                        + Add a payment method now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 13.9 SUB-TAB 6: BILLING HISTORY */}
          {billingTab === 'Billing History' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">BILLING HISTORY & RENEWAL SCHEDULE</h3>
                  <p className="text-xs text-slate-500 font-medium">Complete chronological log of subscription cycles, charges, and plan renewals.</p>
                </div>

                <div className="space-y-3 text-xs font-medium text-slate-700">
                  {[
                    { date: '29 May 2025, 09:00 AM', title: 'Monthly Renewal Charge Processed', desc: 'Auto-billed $854.70 AUD to Visa ending in 4242. Status: Paid.', type: 'RENEWAL', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                    { date: '29 Apr 2025, 09:00 AM', title: 'Monthly Renewal Charge Processed', desc: 'Auto-billed $854.70 AUD to Visa ending in 4242. Status: Paid.', type: 'RENEWAL', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                    { date: '15 Apr 2025, 02:30 PM', title: 'Hero AI Add-on Activated', desc: 'Added Hero AI Dispatch module ($199.00/mo) to active subscription.', type: 'ADD-ON', color: 'text-blue-700 bg-blue-50 border-blue-200' },
                    { date: '29 Mar 2025, 09:00 AM', title: 'Monthly Renewal Charge Processed', desc: 'Auto-billed $655.70 AUD to Visa ending in 4242. Status: Paid.', type: 'RENEWAL', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                  ].map((log, i) => (
                    <div key={i} className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900">{log.title}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[8.5px] font-extrabold uppercase border ${log.color}`}>{log.type}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{log.desc}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap shrink-0">{log.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 13.9 SUB-TAB 7: QUOTES & ORDERS */}
          {billingTab === 'Quotes & Orders' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">ENTERPRISE QUOTES & CUSTOM ORDERS</h3>
                  <p className="text-xs text-slate-500 font-medium">Custom enterprise agreement proposals and sales order quotes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">Enterprise SLA Agreement (Quote #Q-2025-091)</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-extrabold text-[9px] rounded uppercase">Active Contract</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Custom 24/7 dedicated dispatch line & 100 User License Bundle.</p>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-900">$1,499.00 / month</span>
                      <button onClick={() => triggerToast('Downloading Quote #Q-2025-091 PDF...')} className="text-[#2563EB] hover:underline cursor-pointer">Download Contract →</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}



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
                  onChange={e => setNewUserForm({ ...newUserForm, name: e.target.value })}
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
                  onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Role *</label>
                  <select
                    value={newUserForm.role}
                    onChange={e => setNewUserForm({ ...newUserForm, role: e.target.value })}
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
                    onChange={e => setNewUserForm({ ...newUserForm, branch: e.target.value })}
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
                    onChange={e => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Account Status</label>
                  <select
                    value={newUserForm.status}
                    onChange={e => setNewUserForm({ ...newUserForm, status: e.target.value })}
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
                  onChange={e => setEditUserForm({ ...editUserForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editUserForm.email}
                  onChange={e => setEditUserForm({ ...editUserForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Role *</label>
                  <select
                    value={editUserForm.role}
                    onChange={e => setEditUserForm({ ...editUserForm, role: e.target.value })}
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
                    onChange={e => setEditUserForm({ ...editUserForm, branch: e.target.value })}
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
                    onChange={e => setEditUserForm({ ...editUserForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Account Status</label>
                  <select
                    value={editUserForm.status}
                    onChange={e => setEditUserForm({ ...editUserForm, status: e.target.value })}
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
                  onChange={e => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Role Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the primary responsibilities and access scope of this role..."
                  value={newRoleForm.desc}
                  onChange={e => setNewRoleForm({ ...newRoleForm, desc: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Badge Color Theme</label>
                <select
                  value={newRoleForm.colorTheme}
                  onChange={e => setNewRoleForm({ ...newRoleForm, colorTheme: e.target.value })}
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
                  onChange={e => setEditRoleForm({ ...editRoleForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Role Description</label>
                <textarea
                  rows={3}
                  value={editRoleForm.desc}
                  onChange={e => setEditRoleForm({ ...editRoleForm, desc: e.target.value })}
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
                  onChange={e => setNewWorkflowRuleForm({ ...newWorkflowRuleForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe when and why this rule executes..."
                  value={newWorkflowRuleForm.desc}
                  onChange={e => setNewWorkflowRuleForm({ ...newWorkflowRuleForm, desc: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newWorkflowRuleForm.category}
                    onChange={e => setNewWorkflowRuleForm({ ...newWorkflowRuleForm, category: e.target.value })}
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
                    onChange={e => setNewWorkflowRuleForm({ ...newWorkflowRuleForm, trigger: e.target.value })}
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
                  onChange={e => setNewWorkflowRuleForm({ ...newWorkflowRuleForm, action: e.target.value })}
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
                  onChange={e => setEditWorkflowRuleForm({ ...editWorkflowRuleForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editWorkflowRuleForm.desc}
                  onChange={e => setEditWorkflowRuleForm({ ...editWorkflowRuleForm, desc: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={editWorkflowRuleForm.category}
                    onChange={e => setEditWorkflowRuleForm({ ...editWorkflowRuleForm, category: e.target.value })}
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
                    onChange={e => setEditWorkflowRuleForm({ ...editWorkflowRuleForm, trigger: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Automated Action</label>
                <input
                  type="text"
                  value={editWorkflowRuleForm.action}
                  onChange={e => setEditWorkflowRuleForm({ ...editWorkflowRuleForm, action: e.target.value })}
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
                  onChange={e => setNewIntegrationForm({ ...newIntegrationForm, provider: e.target.value, name: e.target.value })}
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
                  onChange={e => setNewIntegrationForm({ ...newIntegrationForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newIntegrationForm.category}
                    onChange={e => setNewIntegrationForm({ ...newIntegrationForm, category: e.target.value })}
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
                    onChange={e => setNewIntegrationForm({ ...newIntegrationForm, syncFrequency: e.target.value })}
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
                  onChange={e => setNewIntegrationForm({ ...newIntegrationForm, apiKey: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="autoSync"
                  checked={newIntegrationForm.autoSync}
                  onChange={e => setNewIntegrationForm({ ...newIntegrationForm, autoSync: e.target.checked })}
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
                  onChange={e => setTestNotificationForm({ ...testNotificationForm, channel: e.target.value })}
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
                  onChange={e => setTestNotificationForm({ ...testNotificationForm, recipient: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Test Message Body</label>
                <textarea
                  rows={3}
                  value={testNotificationForm.message}
                  onChange={e => setTestNotificationForm({ ...testNotificationForm, message: e.target.value })}
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
                  onChange={e => setSecuritySettingsForm({ ...securitySettingsForm, retentionDays: e.target.value })}
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
                  onChange={e => setSecuritySettingsForm({ ...securitySettingsForm, sessionTimeout: e.target.value })}
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
                    onChange={e => setSecuritySettingsForm({ ...securitySettingsForm, twoFactorAuth: e.target.checked })}
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
                    onChange={e => setSecuritySettingsForm({ ...securitySettingsForm, ipWhitelisting: e.target.checked })}
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
                    onChange={e => setSecuritySettingsForm({ ...securitySettingsForm, auditAlerts: e.target.checked })}
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
                  value={manageSubscriptionForm.planId}
                  onChange={e => {
                    const selected = availablePlans.find(p => p.id === e.target.value);
                    setManageSubscriptionForm({ ...manageSubscriptionForm, planId: e.target.value, plan: selected?.name || '' });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {availablePlans.length === 0 ? (
                    <option value="">{manageSubscriptionForm.plan || 'Loading available plans...'}</option>
                  ) : availablePlans.map(plan => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} (${(plan.monthlyPrice || 0).toFixed(0)}/month){billingData?.plan?.id === plan.id ? ' — Active' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Billing Frequency</label>
                <select
                  value={manageSubscriptionForm.billingCycle}
                  onChange={e => setManageSubscriptionForm({ ...manageSubscriptionForm, billingCycle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="MONTHLY">Monthly Billing</option>
                  <option value="ANNUALLY">Annual Billing (Save 20%)</option>
                </select>
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-xs font-extrabold text-slate-700 block">Included Add-on Packages</label>

                {(billingData?.addons?.length || 0) > 0 ? (
                  billingData.addons.map((addon, idx) => {
                    const addonKey = addon.name?.toLowerCase().includes('ai') ? 'aiAddon'
                      : addon.name?.toLowerCase().includes('report') ? 'reportingAddon'
                      : addon.name?.toLowerCase().includes('sms') ? 'smsAddon' : null;
                    return (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{addon.name}</span>
                          <span className="text-[10px] text-slate-500 font-medium">{addon.description || ''}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={addonKey ? (manageSubscriptionForm[addonKey] ?? addon.isEnabled) : addon.isEnabled}
                          onChange={e => addonKey && setManageSubscriptionForm({ ...manageSubscriptionForm, [addonKey]: e.target.checked })}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Hero AI Add-on ($199/mo)</span>
                        <span className="text-[10px] text-slate-500 font-medium">15,000 AI dispatch &amp; document extraction requests</span>
                      </div>
                      <input type="checkbox" checked={manageSubscriptionForm.aiAddon} onChange={e => setManageSubscriptionForm({ ...manageSubscriptionForm, aiAddon: e.target.checked })} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Advanced Reporting ($99/mo)</span>
                        <span className="text-[10px] text-slate-500 font-medium">Custom analytics dashboards &amp; scheduled PDF exports</span>
                      </div>
                      <input type="checkbox" checked={manageSubscriptionForm.reportingAddon} onChange={e => setManageSubscriptionForm({ ...manageSubscriptionForm, reportingAddon: e.target.checked })} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">SMS Notifications ($29/mo)</span>
                        <span className="text-[10px] text-slate-500 font-medium">2,000 automated SMS dispatch notifications</span>
                      </div>
                      <input type="checkbox" checked={manageSubscriptionForm.smsAddon} onChange={e => setManageSubscriptionForm({ ...manageSubscriptionForm, smsAddon: e.target.checked })} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    </div>
                  </>
                )}
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
                  disabled={isSubmittingSubscription}
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                >
                  <Crown size={14} /> {isSubmittingSubscription ? 'Updating...' : 'Update Plan Subscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         13.6 GENERATE API KEY MODAL
         ========================================================================= */}
      {isGenerateApiKeyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                  <Key size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Generate New API Key</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Create a REST API bearer token for developer integration.</p>
                </div>
              </div>
              <button
                onClick={() => setIsGenerateApiKeyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateApiKey} className="space-y-3.5">
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">API Key Description Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile Warehouse Scanner API Key"
                  value={newApiKeyForm.name}
                  onChange={(e) => setNewApiKeyForm({ ...newApiKeyForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Monthly Rate Limit Quota</label>
                <select
                  value={newApiKeyForm.limit}
                  onChange={(e) => setNewApiKeyForm({ ...newApiKeyForm, limit: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none cursor-pointer font-medium"
                >
                  <option value="50,000 req/mo">50,000 requests / month</option>
                  <option value="100,000 req/mo">100,000 requests / month (Standard)</option>
                  <option value="500,000 req/mo">500,000 requests / month (Enterprise)</option>
                  <option value="Unlimited">Unlimited Requests</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 font-semibold space-y-1">
                <span className="font-bold block">🔒 Security Notice</span>
                <p className="text-[10px] leading-relaxed text-amber-700">Keep API keys secret. Do not share them in public repositories or client-side web applications.</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGenerateApiKeyModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Key size={14} /> Generate Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         13.6 TEST WEBHOOK MODAL
         ========================================================================= */}
      {isTestWebhookModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Zap size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Test Webhook Delivery</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Sending mock HTTP POST payload to target listener endpoint.</p>
                </div>
              </div>
              <button
                onClick={() => setIsTestWebhookModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] space-y-1.5 overflow-x-auto">
                <div className="text-emerald-400 font-bold">POST /v1/webhooks/loads HTTP/1.1</div>
                <div className="text-slate-400 text-[10px]">Host: api.yourcompany.com</div>
                <div className="text-slate-400 text-[10px]">Content-Type: application/json</div>
                <div className="text-slate-400 text-[10px]">X-Hero-Signature: sha256=9f8a3b...</div>
                <pre className="text-blue-300 text-[10px] pt-1 font-mono">
                  &#123;<br />
                  &nbsp;&nbsp;&quot;event&quot;: &quot;load.delivered&quot;,<br />
                  &nbsp;&nbsp;&quot;loadId&quot;: &quot;LD-9920&quot;,<br />
                  &nbsp;&nbsp;&quot;status&quot;: &quot;DELIVERED&quot;,<br />
                  &nbsp;&nbsp;&quot;timestamp&quot;: &quot;2026-07-25T18:30:00.000Z&quot;,<br />
                  &nbsp;&nbsp;&quot;podSigned&quot;: true<br />
                  &#125;
                </pre>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-emerald-900 block">Response: 200 OK</span>
                  <span className="text-[10px] font-semibold text-emerald-700">Payload accepted successfully in 42ms.</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-200 text-emerald-800 text-[9px] font-black uppercase rounded">Success</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => triggerToast('Re-sending test webhook...')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Re-send Payload
              </button>
              <button
                onClick={() => setIsTestWebhookModalOpen(false)}
                className="px-5 py-2 bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-700 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT LOG DETAILS MODAL */}
      {selectedAuditLog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedAuditLog(null)}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 space-y-4 text-left font-sans" onClick={e => e.stopPropagation()}>
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold shrink-0">
                  <Shield size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900">Event Audit Record</h3>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${selectedAuditLog.typeBg || 'bg-blue-100 text-blue-700'}`}>{selectedAuditLog.type || 'System Event'}</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-medium">Log ID: <span className="font-mono font-bold text-slate-700">LOG-{Date.now().toString().slice(-6)}</span> • {selectedAuditLog.time}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* BODY DETAILS */}
            <div className="space-y-3 text-xs">
              {/* USER CARD */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full ${selectedAuditLog.bg || 'bg-purple-600'} text-white font-black text-xs flex items-center justify-center shrink-0`}>
                    {selectedAuditLog.avatar || 'SM'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 leading-tight">{selectedAuditLog.name || 'Sarah Mitchell'}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">{selectedAuditLog.email || 'sarah.mitchell@herologistics.com.au'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black uppercase text-slate-400 block">IP Address</span>
                  <span className="font-mono text-xs font-bold text-slate-700">{selectedAuditLog.ip || '203.26.45.12'}</span>
                </div>
              </div>

              {/* ACTION METRICS GRID */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase block">Executed Action</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{selectedAuditLog.action}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase block">Target Module</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{selectedAuditLog.module}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg col-span-2">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase block">Event Description & Details</span>
                  <span className="font-semibold text-slate-700 mt-0.5 block">{selectedAuditLog.details}</span>
                </div>
              </div>

              {/* JSON PAYLOAD INSPECTOR */}
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">RAW JSON PAYLOAD AUDIT TRACE</span>
                <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[10px] space-y-1 overflow-x-auto max-h-[140px] overflow-y-auto">
                  <span className="text-emerald-400 font-bold">// HTTP Request Transaction Details</span><br />
                  <span className="text-purple-300">&#123;</span><br />
                  &nbsp;&nbsp;&quot;event_id&quot;: &quot;evt_8849201&quot;,<br />
                  &nbsp;&nbsp;&quot;timestamp&quot;: &quot;{selectedAuditLog.time}&quot;,<br />
                  &nbsp;&nbsp;&quot;actor&quot;: &#123; &quot;name&quot;: &quot;{selectedAuditLog.name}&quot;, &quot;email&quot;: &quot;{selectedAuditLog.email}&quot; &#125;,<br />
                  &nbsp;&nbsp;&quot;action&quot;: &quot;{selectedAuditLog.action}&quot;,<br />
                  &nbsp;&nbsp;&quot;module&quot;: &quot;{selectedAuditLog.module}&quot;,<br />
                  &nbsp;&nbsp;&quot;ip_address&quot;: &quot;{selectedAuditLog.ip}&quot;,<br />
                  &nbsp;&nbsp;&quot;outcome&quot;: &quot;{selectedAuditLog.outcome}&quot;,<br />
                  &nbsp;&nbsp;&quot;session_id&quot;: &quot;sess_live_994021&quot;<br />
                  <span className="text-purple-300">&#125;</span>
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText?.(selectedAuditLog.ip || '203.26.45.12');
                  triggerToast(`Copied IP ${selectedAuditLog.ip} to clipboard!`);
                }}
                className="px-3 py-1.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
              >
                Copy IP Address
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerToast(`Log record for ${selectedAuditLog.action} exported as JSON.`);
                    setSelectedAuditLog(null);
                  }}
                  className="px-4 py-1.5 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-900 cursor-pointer"
                >
                  Export Payload
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAuditLog(null)}
                  className="px-4 py-1.5 bg-[#2563EB] text-white font-bold text-xs rounded-xl hover:bg-blue-700 cursor-pointer shadow-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT AUDIT LOG MODAL */}
      {editingAuditLog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in" onClick={() => setEditingAuditLog(null)}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left font-sans" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
                  <Edit size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Edit Audit Log Record</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Modify record metadata for LOG-{editingAuditLog.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingAuditLog(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditAuditLogSubmit} className="space-y-3.5 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-full ${editingAuditLog.bg || 'bg-purple-600'} text-white font-black text-[10px] flex items-center justify-center shrink-0`}>
                  {editingAuditLog.avatar || 'SM'}
                </div>
                <div>
                  <span className="font-bold text-slate-900 block leading-tight">{editingAuditLog.name}</span>
                  <span className="text-[10px] text-slate-500">{editingAuditLog.email} • {editingAuditLog.time}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Action Description *</label>
                <input
                  type="text"
                  required
                  value={editLogForm.action}
                  onChange={e => setEditLogForm({ ...editLogForm, action: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">System Module</label>
                  <select
                    value={editLogForm.module}
                    onChange={e => setEditLogForm({ ...editLogForm, module: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 bg-white focus:outline-none focus:border-blue-400 font-sans"
                  >
                    <option value="Authentication">Authentication</option>
                    <option value="Loads">Loads</option>
                    <option value="Users & Roles">Users & Roles</option>
                    <option value="Reports">Reports</option>
                    <option value="Vehicles">Vehicles</option>
                    <option value="Expenses">Expenses</option>
                    <option value="Settings">Settings</option>
                    <option value="Integrations">Integrations</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Outcome Status</label>
                  <select
                    value={editLogForm.outcome}
                    onChange={e => setEditLogForm({ ...editLogForm, outcome: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 bg-white focus:outline-none focus:border-blue-400 font-sans"
                  >
                    <option value="Success">Success</option>
                    <option value="Failed">Failed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Event Details / Notes</label>
                <textarea
                  rows={3}
                  value={editLogForm.details}
                  onChange={e => setEditLogForm({ ...editLogForm, details: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400 font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAuditLog(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer font-sans"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         13.6 ADD INTEGRATION MODAL
         ========================================================================= */}
      {isAddIntegrationModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                  <Plug size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Connect New Integration</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Link third-party software connectors to Hero Logistics.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddIntegrationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleAddIntegrationSubmit}
              className="space-y-3.5"
            >
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Select Integration Provider *</label>
                <select
                  value={newIntegrationForm.providerName}
                  onChange={e => setNewIntegrationForm({ ...newIntegrationForm, providerName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none cursor-pointer font-medium"
                >
                  <option value="Xero Accounting & Invoicing">Xero Accounting & Invoicing</option>
                  <option value="MYOB AccountRight">MYOB AccountRight</option>
                  <option value="QuickBooks Online">QuickBooks Online</option>
                  <option value="Samsara Telematics GPS">Samsara Telematics GPS</option>
                  <option value="NHVR Electronic Work Diary">NHVR Electronic Work Diary</option>
                  <option value="Stripe Payment Gateway">Stripe Payment Gateway</option>
                  <option value="Twilio SMS Notifications">Twilio SMS Notifications</option>
                  <option value="SendGrid Email API">SendGrid Email API</option>
                  <option value="Custom Webhook Listener">Custom Webhook Listener</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">API Secret Key / OAuth Token *</label>
                <input
                  type="password"
                  required
                  placeholder="Paste OAuth token or API secret key..."
                  value={newIntegrationForm.apiKey}
                  onChange={e => setNewIntegrationForm({ ...newIntegrationForm, apiKey: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                />
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
                  <Plug size={14} /> Authorize & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         13.5 REGISTER AI MODEL MODAL
         ========================================================================= */}
      {isRegisterAiModelModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Cpu size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Register New AI Model</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Deploy an LLM or OCR model into Hero AI Registry.</p>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterAiModelModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterAiModelSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Model Name & Identifier *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Claude 3.5 Sonnet (Anthropic)"
                  value={newAiModelForm.name}
                  onChange={(e) => setNewAiModelForm({ ...newAiModelForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">Provider *</label>
                  <select
                    value={newAiModelForm.provider}
                    onChange={(e) => setNewAiModelForm({ ...newAiModelForm, provider: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="OpenAI">OpenAI</option>
                    <option value="Anthropic">Anthropic</option>
                    <option value="Microsoft">Microsoft Azure</option>
                    <option value="Hero AI">Hero AI Custom</option>
                    <option value="Meta">Meta Llama</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">Version *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. v3.5"
                    value={newAiModelForm.version}
                    onChange={(e) => setNewAiModelForm({ ...newAiModelForm, version: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">Target Latency SLA</label>
                  <input
                    type="text"
                    placeholder="e.g. 120ms"
                    value={newAiModelForm.latency}
                    onChange={(e) => setNewAiModelForm({ ...newAiModelForm, latency: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">Cost Rate</label>
                  <input
                    type="text"
                    placeholder="e.g. $0.003 / 1k tokens"
                    value={newAiModelForm.cost}
                    onChange={(e) => setNewAiModelForm({ ...newAiModelForm, cost: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterAiModelModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Cpu size={14} /> Register Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         13.7 CREATE TEMPLATE MODAL
         ========================================================================= */}
      {isCreateTemplateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Create Notification Template</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Build custom email/SMS template with dynamic placeholders.</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateTemplateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTemplateSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Template Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delivery Confirmation SMS"
                  value={newTemplateForm.title}
                  onChange={(e) => setNewTemplateForm({ ...newTemplateForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Delivery Channel</label>
                <select
                  value={newTemplateForm.channel}
                  onChange={(e) => setNewTemplateForm({ ...newTemplateForm, channel: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none cursor-pointer font-medium"
                >
                  <option value="Email">Email Only</option>
                  <option value="SMS">SMS Only</option>
                  <option value="SMS & Email">SMS & Email</option>
                  <option value="Push Notifications">Push Notifications</option>
                  <option value="In-App Messages">In-App Messages</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Template Content Body</label>
                <textarea
                  rows={3}
                  placeholder="Dear {customer_name}, your load #{load_id} is out for delivery..."
                  value={newTemplateForm.preview}
                  onChange={(e) => setNewTemplateForm({ ...newTemplateForm, preview: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateTemplateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <FileText size={14} /> Create Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         13.7 ADD NOTIFICATION RULE MODAL
         ========================================================================= */}
      {isAddNotificationRuleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Zap size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Add Notification Trigger Rule</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Automate alerts based on system events & status changes.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddNotificationRuleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNotificationRuleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Rule Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Overdue POD Customer Alert"
                  value={newRuleForm.name}
                  onChange={(e) => setNewRuleForm({ ...newRuleForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Event Trigger</label>
                <select
                  value={newRuleForm.trigger}
                  onChange={(e) => setNewRuleForm({ ...newRuleForm, trigger: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none cursor-pointer font-medium"
                >
                  <option>When Load status changes to DELIVERED</option>
                  <option>When Driver reaches 11h 30m work threshold</option>
                  <option>When Invoice status changes to ISSUED</option>
                  <option>When Vehicle Maintenance is due</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">Channels</label>
                  <select
                    value={newRuleForm.channels}
                    onChange={(e) => setNewRuleForm({ ...newRuleForm, channels: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="SMS + Email">SMS + Email</option>
                    <option value="SMS + Push">SMS + Push</option>
                    <option value="Email Only">Email Only</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={newRuleForm.priority}
                    onChange={(e) => setNewRuleForm({ ...newRuleForm, priority: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddNotificationRuleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Zap size={14} /> Activate Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         13.7 CREATE RECIPIENT GROUP MODAL
         ========================================================================= */}
      {isCreateRecipientGroupModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Create Recipient Group</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Group contacts for mass broadcast notifications.</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateRecipientGroupModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRecipientGroupSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Group Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brisbane Yard Supervisors"
                  value={newGroupForm.name}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Operational contacts for QLD depots."
                  value={newGroupForm.desc}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, desc: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateRecipientGroupModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Users size={14} /> Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         ADD PAYMENT METHOD MODAL
         ========================================================================= */}
      {isAddPaymentMethodModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 text-left relative my-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md font-bold">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Add Payment Method</h3>
                  <p className="text-xs text-slate-500 font-medium">Add card or bank account for automated recurring subscription billing.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddPaymentMethodModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPaymentMethodSubmit} className="space-y-4">
              {/* Payment Type Selection Tabs */}
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1.5">Payment Method Type</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                  {[
                    { id: 'Credit / Debit Card', label: 'Card', icon: CreditCard },
                    { id: 'Direct Debit (BSB)', label: 'Direct Debit', icon: Building },
                    { id: 'UPI / NetBanking', label: 'UPI / VPA', icon: Zap }
                  ].map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = newPaymentMethodForm.type === tab.id;
                    return (
                      <button
                        type="button"
                        key={tab.id}
                        onClick={() => setNewPaymentMethodForm({ ...newPaymentMethodForm, type: tab.id })}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white text-[#2563EB] shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <IconComponent size={13} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CARD TYPE FIELDS */}
              {newPaymentMethodForm.type === 'Credit / Debit Card' && (
                <>
                  {/* Visual Card Preview */}
                  <div className="bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-900 text-white rounded-xl p-4 shadow-lg space-y-4 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-6 bg-amber-400/90 rounded-md border border-amber-300/40 flex items-center justify-center">
                        <div className="w-5 h-4 border border-amber-600/50 rounded-xs grid grid-cols-2 gap-0.5 p-0.5">
                          <div className="bg-amber-600/30"></div>
                          <div className="bg-amber-600/30"></div>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 bg-white/10 rounded font-black text-xs italic tracking-widest uppercase backdrop-blur-xs">
                        {newPaymentMethodForm.cardNumber.startsWith('5') || newPaymentMethodForm.cardNumber.startsWith('2')
                          ? 'MASTERCARD'
                          : newPaymentMethodForm.cardNumber.startsWith('3')
                          ? 'AMEX'
                          : 'VISA'}
                      </span>
                    </div>

                    <div className="font-mono text-base tracking-[0.2em] font-extrabold text-center py-1">
                      {newPaymentMethodForm.cardNumber
                        ? newPaymentMethodForm.cardNumber.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()
                        : '•••• •••• •••• 4242'}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-slate-300 uppercase">
                      <div>
                        <div className="text-[8px] text-slate-400 font-sans tracking-normal">CARDHOLDER</div>
                        <div className="font-bold text-white truncate max-w-[180px]">
                          {newPaymentMethodForm.cardHolder || 'SARAH MITCHELL'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[8px] text-slate-400 font-sans tracking-normal">EXPIRES</div>
                        <div className="font-bold text-white">
                          {newPaymentMethodForm.expMonth}/{newPaymentMethodForm.expYear}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Cardholder Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Mitchell"
                      value={newPaymentMethodForm.cardHolder}
                      onChange={(e) => setNewPaymentMethodForm({ ...newPaymentMethodForm, cardHolder: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Card Number *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="4242 4242 4242 4242"
                        value={newPaymentMethodForm.cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
                          setNewPaymentMethodForm({ ...newPaymentMethodForm, cardNumber: val });
                        }}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                      />
                      <div className="absolute right-3 top-2.5 text-slate-400">
                        <CreditCard size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs font-extrabold text-slate-700 block mb-1">Exp Month</label>
                      <select
                        value={newPaymentMethodForm.expMonth}
                        onChange={(e) => setNewPaymentMethodForm({ ...newPaymentMethodForm, expMonth: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none cursor-pointer font-medium"
                      >
                        {['01','02','03','04','05','06','07','08','09','10','11','12'].map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-slate-700 block mb-1">Exp Year</label>
                      <select
                        value={newPaymentMethodForm.expYear}
                        onChange={(e) => setNewPaymentMethodForm({ ...newPaymentMethodForm, expYear: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none cursor-pointer font-medium"
                      >
                        {['2025','2026','2027','2028','2029','2030','2031','2032','2033','2034','2035'].map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-slate-700 block mb-1">CVV / CVC *</label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          maxLength={4}
                          placeholder="123"
                          value={newPaymentMethodForm.cvv}
                          onChange={(e) => setNewPaymentMethodForm({ ...newPaymentMethodForm, cvv: e.target.value.replace(/\D/g, '') })}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                        />
                        <div className="absolute right-2.5 top-2.5 text-slate-400">
                          <Lock size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* DIRECT DEBIT FIELDS */}
              {newPaymentMethodForm.type === 'Direct Debit (BSB)' && (
                <>
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Account Holder Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hero Logistics Pty Ltd"
                      value={newPaymentMethodForm.accountName}
                      onChange={(e) => setNewPaymentMethodForm({ ...newPaymentMethodForm, accountName: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Bank Name</label>
                    <select
                      value={newPaymentMethodForm.bankName}
                      onChange={(e) => setNewPaymentMethodForm({ ...newPaymentMethodForm, bankName: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none cursor-pointer font-medium"
                    >
                      <option value="Commonwealth Bank of Australia">Commonwealth Bank of Australia</option>
                      <option value="ANZ Bank">ANZ Bank</option>
                      <option value="Westpac Banking Corporation">Westpac Banking Corporation</option>
                      <option value="National Australia Bank (NAB)">National Australia Bank (NAB)</option>
                      <option value="Macquarie Bank">Macquarie Bank</option>
                      <option value="Bendigo Bank">Bendigo Bank</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-extrabold text-slate-700 block mb-1">BSB Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="062-000"
                        maxLength={7}
                        value={newPaymentMethodForm.bsb}
                        onChange={(e) => setNewPaymentMethodForm({ ...newPaymentMethodForm, bsb: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-extrabold text-slate-700 block mb-1">Account Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="1234 5678"
                        maxLength={12}
                        value={newPaymentMethodForm.accountNumber}
                        onChange={(e) => setNewPaymentMethodForm({ ...newPaymentMethodForm, accountNumber: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* UPI FIELDS */}
              {newPaymentMethodForm.type === 'UPI / NetBanking' && (
                <>
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">UPI ID / Virtual Payment Address (VPA) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. company@okaxis or 9876543210@upi"
                      value={newPaymentMethodForm.upiId}
                      onChange={(e) => setNewPaymentMethodForm({ ...newPaymentMethodForm, upiId: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Accepts Google Pay, PhonePe, Paytm, BHIM, or any bank UPI handle.</p>
                  </div>
                </>
              )}

              {/* Primary Method Checkbox */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newPaymentMethodForm.isPrimary}
                    onChange={(e) => setNewPaymentMethodForm({ ...newPaymentMethodForm, isPrimary: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="text-xs font-bold text-slate-700">Set as primary payment method for recurring monthly billing</span>
                </label>
              </div>

              {/* Security Badge Notice */}
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 text-[11px] text-slate-600 font-medium">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                <span>Encrypted with 256-bit SSL encryption. PCI-DSS Level 1 Compliant.</span>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPaymentMethodModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <CreditCard size={14} /> Add Payment Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
