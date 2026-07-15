import React, { useState, useEffect } from 'react';
import { 
  FileText, Sliders, Layout, Globe, Mail, Lock, Folder, RotateCw, Shield, Database, 
  Play, Save, CheckCircle, X, Trash2, Eye, ShieldAlert, Settings, Plus 
} from 'lucide-react';

export default function WhiteLabel() {
  const [activeTab, setActiveTab] = useState('Domain Manager');
  const [previewTab, setPreviewTab] = useState('Portal UI');
  const [toast, setToast] = useState('');
  const [activeVersion, setActiveVersion] = useState('1.4.0');

  // Dynamic branding config state
  const [brandingForm, setBrandingForm] = useState({
    platformName: 'Logistics OS',
    portalName: 'Enterprise Tenant Portal',
    shortName: 'HeroLog',
    loaderGif: 'https://hero-mock-storage.s3.amazonaws.com/uploads/loader.gif',
    lightLogo: 'https://hero-mock-storage.s3.amazonaws.com/uploads/logo-light.png',
    darkLogo: 'https://hero-mock-storage.s3.amazonaws.com/uploads/logo-dark.png',
    favicon: 'https://hero-mock-storage.s3.amazonaws.com/uploads/favicon.ico',
    loginBg: 'https://hero-mock-storage.s3.amazonaws.com/uploads/login-bg.png',
    dashboardBg: 'https://hero-mock-storage.s3.amazonaws.com/uploads/dashboard-bg.png',
    emailLogo: 'https://hero-mock-storage.s3.amazonaws.com/uploads/email-logo.png',
    invoiceLogo: 'https://hero-mock-storage.s3.amazonaws.com/uploads/invoice-logo.png',
    manifestLogo: 'https://hero-mock-storage.s3.amazonaws.com/uploads/manifest-logo.png',
    fontFamily: 'Inter',
    typographyStyle: 'Modern Sans',
    buttonRadius: '16px (Glassmorphic)'
  });

  const [liveBranding, setLiveBranding] = useState({ ...brandingForm });

  // Themes state
  const [themes, setThemes] = useState([
    { name: 'Dark Glassmorphism', accent: '#0ea5e9', sidebar: '#111827', header: '#161F30', status: 'Published' },
    { name: 'Vibrant Ocean', accent: '#0284c7', sidebar: '#0f172a', header: '#1e293b', status: 'Draft' },
    { name: 'Emerald Forest', accent: '#10b981', sidebar: '#064e3b', header: '#022c22', status: 'Draft' }
  ]);
  const [newThemeName, setNewThemeName] = useState('');

  // Domains state
  const [domains, setDomains] = useState([
    { domain: 'tms.herologistics.com', mapsTo: 'ssl.herologistics.com', status: 'Active', expires: '12/31/2026', dns: 'Passed', health: 'Excellent', rules: 'Force HTTPS' },
    { domain: 'driver.herologistics.com', mapsTo: 'ssl.herologistics.com', status: 'Active', expires: '10/15/2026', dns: 'Passed', health: 'Good', rules: 'Force HTTPS' }
  ]);
  const [newDomainForm, setNewDomainForm] = useState({ domain: '', fallback: '', rule: 'Force HTTPS' });

  // Communications Sub-Tab config state
  const [commSubTab, setCommSubTab] = useState('Welcome Email');
  const [commEmailSubject, setCommEmailSubject] = useState('Welcome to your Logistics Ecosystem');
  const [commGreeting, setCommGreeting] = useState('Initialize your Tenant Admin Workspace');
  const [commMessageBody, setCommMessageBody] = useState(
    'Your tenant credentials have been provisioned on the secure isolated White Label node. Click the verification button below to set up your master authentication password and configure your dispatcher fleet layout details.'
  );
  const [testEmailAddress, setTestEmailAddress] = useState('admin@falconcarriers.com');
  const [testSmsPhone, setTestSmsPhone] = useState('+1 555-0199');

  // PDF Customizer state
  const [pdfHeader, setPdfHeader] = useState('HERO LOGISTICS ENTERPRISE SOLUTION');
  const [pdfFooter, setPdfFooter] = useState('Confidential Document • Page {page} of {total}');
  const [pdfWatermark, setPdfWatermark] = useState(true);
  const [pdfQrCode, setPdfQrCode] = useState(true);

  // Login & Override state
  const [loginGreeting, setLoginGreeting] = useState('Welcome to Enterprise Logistics OS');
  const [loginIllustration, setLoginIllustration] = useState('Global Logistics Net');
  const [loginSupportUrl, setLoginSupportUrl] = useState('https://support.herologistics.com');
  const [loginToggles, setLoginToggles] = useState({ driverApp: true, dispatcherPortal: true, customerPortal: true });

  // Deployment changelog state
  const [changelogText, setChangelogText] = useState('');
  const [releaseHistory, setReleaseHistory] = useState([
    { version: '1.4.0', build: '334', desc: 'Updated light logo and unified gradient builder.', date: '06/25/2026, 09:40:00 AM', status: 'Published' },
    { version: '1.3.0', build: '312', desc: 'Configured CNAME redirects for custom tenant portals.', date: '06/10/2026, 12:15:00 PM', status: 'Archived' }
  ]);

  // System Audit Trails state
  const [auditSearch, setAuditSearch] = useState('');
  const [auditFilter, setAuditFilter] = useState('All Actions');
  const [auditLogs, setAuditLogs] = useState([
    { title: 'Brand Color Updated', desc: 'Accent color changed from #2563eb to #0ea5e9.', date: '06/25/2026, 09:30:00 AM', operator: 'Super Admin', ip: '192.168.1.5', browser: 'Chrome 126.0', type: 'Config' },
    { title: 'SMTP Server Configured', desc: 'SMTP host redirected to SendGrid secure server.', date: '06/25/2026, 09:35:00 AM', operator: 'Super Admin', ip: '192.168.1.5', browser: 'Chrome 126.0', type: 'SMTP' }
  ]);

  // Security & Access state
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [adminReviewRequired, setAdminReviewRequired] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30 Minutes');
  const [allowedIps, setAllowedIps] = useState('192.168.1.1, 10.0.0.45, 172.16.23.10');
  const [developerKeys, setDeveloperKeys] = useState([
    { id: 1, name: 'Production Backend secret key', value: 'sk_live_... (hidden for security)', visible: false },
    { id: 2, name: 'Webhook dispatch triggers token', value: 'whsec_... (hidden for security)', visible: false }
  ]);
  const [newKeyName, setNewKeyName] = useState('');

  // API Integrations state
  const [apiIntegrations, setApiIntegrations] = useState([
    { name: 'Cloudflare Integration', status: 'Connected', health: 'Healthy' },
    { name: 'S3 Integration', status: 'Connected', health: 'Healthy' },
    { name: 'Sendgrid Integration', status: 'Verified', health: 'Healthy' },
    { name: 'Twilio Integration', status: 'Operational', health: 'Healthy' },
    { name: 'Stripe Integration', status: 'Active', health: 'Healthy' },
    { name: 'Firebase Integration', status: 'Not Connected', health: 'Unknown' }
  ]);

  const showNotification = (msg) => {
    setToast(msg);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sync templates on Communications Sub-Tab click
  const handleCommSubTabChange = (tab) => {
    setCommSubTab(tab);
    if (tab === 'Welcome Email') {
      setCommEmailSubject('Welcome to your Logistics Ecosystem');
      setCommGreeting('Initialize your Tenant Admin Workspace');
      setCommMessageBody('Your tenant credentials have been provisioned on the secure isolated White Label node. Click the verification button below to set up your master authentication password and configure your dispatcher fleet layout details.');
    } else if (tab === 'Reset Password') {
      setCommEmailSubject('Reset Your Password Link');
      setCommGreeting('Password Reset Request Received');
      setCommMessageBody('We received a request to reset your password. Click the button below to configure a new password for your white label administrator node. This link is valid for 1 hour.');
    } else if (tab === 'Driver Invitation') {
      setCommEmailSubject('Driver Onboarding Invitation');
      setCommGreeting('Welcome to our Driver Fleet');
      setCommMessageBody('You have been registered as an active driver. Please download the ELD Mobile application and sign in using these temporary credentials.');
    } else if (tab === 'Company Invitation') {
      setCommEmailSubject('Join our Shipper Network');
      setCommGreeting('Enterprise Onboarding Dispatch');
      setCommMessageBody('Welcome to the freight shipping pipeline. Click the invitation payload links to register your company and book active dispatch operations.');
    }
  };

  // Actions
  const handleSaveBranding = (e) => {
    e.preventDefault();
    setLiveBranding({ ...brandingForm });
    showNotification('Branding Configuration saved to local draft!');
  };

  const handleDiscardBranding = () => {
    setBrandingForm({ ...liveBranding });
    showNotification('Draft changes discarded.');
  };

  const handleCommitDraft = () => {
    setLiveBranding({ ...brandingForm });
    showNotification('Draft changes successfully committed to preview build.');
  };

  const handleSendTestEnvelope = (e) => {
    e.preventDefault();
    showNotification(`Test email successfully sent to ${testEmailAddress}!`);
  };

  const handleSendTestSms = (e) => {
    e.preventDefault();
    showNotification(`Test SMS successfully sent to ${testSmsPhone}!`);
  };

  const handleSavePDFLayout = (e) => {
    e.preventDefault();
    showNotification('PDF document custom layout saved successfully.');
  };

  const handleSaveLoginOptions = (e) => {
    e.preventDefault();
    showNotification('Login overrides and toggle matrix updated.');
  };

  // Compile S3 Build
  const handleCompileS3Build = (e) => {
    e.preventDefault();
    const parts = activeVersion.split('.');
    const nextPatch = parseInt(parts[2]) + 1;
    const nextVer = `${parts[0]}.${parts[1]}.${nextPatch}`;
    setActiveVersion(nextVer);

    const desc = changelogText || `Committed white label static adjustments.`;
    const newBuild = {
      version: nextVer,
      build: (Math.floor(Math.random() * 100) + 340).toString(),
      desc: desc,
      date: new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      status: 'Published'
    };

    setReleaseHistory(prev => [
      newBuild,
      ...prev.map(r => r.status === 'Published' ? { ...r, status: 'Archived' } : r)
    ]);
    setChangelogText('');
    showNotification(`Build Compiled & Deployed to S3 CDN (v${nextVer})`);
  };

  const handleRollback = (version) => {
    setActiveVersion(version);
    setReleaseHistory(prev => prev.map(r => r.version === version ? { ...r, status: 'Published' } : { ...r, status: 'Archived' }));
    showNotification(`Rolled back version to v${version} successfully.`);
  };

  // Theme actions
  const handlePublishTheme = (themeName) => {
    setThemes(prev => prev.map(t => t.name === themeName ? { ...t, status: 'Published' } : { ...t, status: 'Draft' }));
    showNotification(`Theme "${themeName}" published to platform.`);
  };

  const handleCloneTheme = (theme) => {
    const cloned = { ...theme, name: `${theme.name} (Copy)`, status: 'Draft' };
    setThemes([...themes, cloned]);
    showNotification(`Cloned theme "${theme.name}"`);
  };

  const handleDeleteTheme = (themeName) => {
    const target = themes.find(t => t.name === themeName);
    if (target && target.status === 'Published') {
      alert('Cannot delete the active published theme.');
      return;
    }
    setThemes(prev => prev.filter(t => t.name !== themeName));
    showNotification(`Theme "${themeName}" deleted.`);
  };

  const handleRegisterTheme = (e) => {
    e.preventDefault();
    if (!newThemeName) return;
    const newTheme = {
      name: newThemeName,
      accent: '#' + Math.floor(Math.random()*16777215).toString(16),
      sidebar: '#0f172a',
      header: '#1e293b',
      status: 'Draft'
    };
    setThemes([...themes, newTheme]);
    setNewThemeName('');
    showNotification(`Theme skin "${newThemeName}" registered.`);
  };

  // CNAME domains actions
  const handleRenewSSL = (domain) => {
    setDomains(prev => prev.map(d => d.domain === domain ? { ...d, expires: '12/31/2030' } : d));
    showNotification(`SSL Certificate for ${domain} renewed.`);
  };

  const handleRegisterDomain = (e) => {
    e.preventDefault();
    if (!newDomainForm.domain) return;
    const newRecord = {
      domain: newDomainForm.domain,
      mapsTo: 'ssl.herologistics.com',
      status: 'Active',
      expires: '06/30/2030',
      dns: 'Passed',
      health: 'Excellent',
      rules: newDomainForm.rule
    };
    setDomains([...domains, newRecord]);
    setNewDomainForm({ domain: '', fallback: '', rule: 'Force HTTPS' });
    showNotification(`Domain ${newDomainForm.domain} mapped & registered.`);
  };

  const handleExportReport = () => {
    const headers = ['Configuration Option', 'Value'];
    const rows = Object.entries(liveBranding);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'whitelabel_config_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('White Label configuration report exported.');
  };

  const handleExportAuditsCSV = () => {
    const headers = ['Action', 'Description', 'Timestamp', 'Operator', 'IP Address', 'Browser'];
    const rows = auditLogs.map(log => [
      log.title, log.desc, log.date, log.operator, log.ip, log.browser
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'system_audit_trails.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('System audit trails exported.');
  };

  const handleToggleKeyVisibility = (id) => {
    setDeveloperKeys(prev => prev.map(k => k.id === id ? { ...k, visible: !k.visible } : k));
  };

  const handleDeleteKey = (id) => {
    setDeveloperKeys(prev => prev.filter(k => k.id !== id));
    showNotification('Developer key deleted.');
  };

  const handleAddKey = (e) => {
    e.preventDefault();
    if (!newKeyName) return;
    const newKey = {
      id: Date.now(),
      name: newKeyName,
      value: 'api_key_hidden_for_security_' + Math.random().toString(36).substring(2),
      visible: false
    };
    setDeveloperKeys([...developerKeys, newKey]);
    setNewKeyName('');
    showNotification(`Secret key "${newKeyName}" registered.`);
  };

  const handleTestConnection = (name) => {
    setApiIntegrations(prev => prev.map(item => item.name === name ? { ...item, status: 'Testing...' } : item));
    showNotification(`Testing connection for ${name}...`);
    setTimeout(() => {
      setApiIntegrations(prev => prev.map(item => {
        if (item.name === name) {
          const isFirebase = name === 'Firebase Integration';
          return { 
             ...item, 
             status: isFirebase ? 'Not Connected' : name === 'Sendgrid Integration' ? 'Verified' : name === 'Twilio Integration' ? 'Operational' : name === 'Stripe Integration' ? 'Active' : 'Connected',
             health: isFirebase ? 'Unknown' : 'Healthy'
          };
        }
        return item;
      }));
      showNotification(`Connection for ${name} verified successfully.`);
    }, 1000);
  };

  const activeTheme = themes.find(t => t.status === 'Published') || themes[0];

  // 3-Row tab list to match screenshots exactly
  const row1 = [
    { id: 'Overview', label: 'Overview', icon: <FileText className="w-4.5 h-4.5" /> },
    { id: 'Brand Config', label: 'Brand Config', icon: <Sliders className="w-4.5 h-4.5" /> },
    { id: 'Theme Builder', label: 'Theme Builder', icon: <Layout className="w-4.5 h-4.5" /> },
    { id: 'Domain Manager', label: 'Domain Manager', icon: <Globe className="w-4.5 h-4.5" /> },
    { id: 'Communications', label: 'Communications', icon: <Mail className="w-4.5 h-4.5" /> }
  ];

  const row2 = [
    { id: 'PDF Customizer', label: 'PDF Customizer', icon: <FileText className="w-4.5 h-4.5" /> },
    { id: 'Login & Override', label: 'Login & Override', icon: <Lock className="w-4.5 h-4.5" /> },
    { id: 'Asset Library', label: 'Asset Library', icon: <Folder className="w-4.5 h-4.5" /> },
    { id: 'Deployment Timeline', label: 'Deployment Timeline', icon: <RotateCw className="w-4.5 h-4.5" /> }
  ];

  const row3 = [
    { id: 'Security & Access', label: 'Security & Access', icon: <Shield className="w-4.5 h-4.5" /> },
    { id: 'API Integrations', label: 'API Integrations', icon: <Database className="w-4.5 h-4.5" /> }
  ];

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 w-full font-sans text-left space-y-6 relative">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3.5 rounded-xl shadow-lg border border-slate-700/50 flex items-center gap-2.5 animate-slide-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">
            Super Admin • White Label
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Configure global licensing rules, audit tenant margins, and resolve support tickets.
          </p>
        </div>
        <button 
          onClick={handleExportReport}
          className="border border-slate-200 bg-white hover:bg-slate-50 text-yellow-500 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Export Report
        </button>
      </div>

      {/* Enterprise White Label Platform Banner */}
      <div className="bg-slate-400/90 dark:bg-slate-800 text-white rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-500 to-slate-400">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-white/10 rounded-2xl">
            <Settings className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h2 className="text-lg font-black leading-tight">Enterprise White Label Platform</h2>
            <p className="text-xs text-white/80 mt-1 font-medium">
              Customize branding layers, email SMTP relays, custom domains, and visual interfaces dynamically.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="bg-white text-slate-850 px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1">
            Active Version: <span className="text-yellow-600">{activeVersion}</span>
          </span>
          <span className="bg-white text-emerald-600 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider">
            Status: <span className="text-emerald-500">PUBLISHED</span>
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">ACTIVE WL CLIENTS</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">4</span>
          </div>
          <div className="text-[10px] font-bold text-emerald-500 mt-2">
            100% active coverage
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">ACTIVE CUSTOM DOMAINS</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">{domains.length}</span>
          </div>
          <div className="text-[10px] font-bold text-emerald-500 mt-2">
            SSL secure handshakes active
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">PENDING DEPLOYMENTS</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">0</span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 mt-2">
            Warnings pending review
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">BRANDING HEALTH SCORE</span>
            <span className="text-2xl font-black text-[#10B981] block mt-2">100%</span>
          </div>
          <div className="text-[10px] font-bold text-emerald-500 mt-2">
            All formats valid check
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">SSL STATUS</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">Active</span>
          </div>
          <div className="text-[10px] font-bold text-emerald-500 mt-2">
            Edge sync verified
          </div>
        </div>

        {/* Row 2 Grid Elements */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">ACTIVE THEME VERSION</span>
            <span className="text-2xl font-black text-[#F59E0B] block mt-2">v{activeVersion}</span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 mt-2">
            Skin: {activeTheme.name}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32 col-span-1 md:col-span-2">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">LAST DEPLOYMENT</span>
            <span className="text-lg md:text-xl font-black text-slate-900 block mt-3">
              {releaseHistory.find(r => r.status === 'Published')?.date || '06/25/2026, 09:40:00 AM'}
            </span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 mt-2">
            By Super Admin
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">FAILED DEPLOYMENTS</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">0</span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 mt-2">
            0 pipeline compiler errors
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">AUDIT EVENTS TODAY</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">2 Logs</span>
          </div>
          <div className="text-[10px] font-bold text-emerald-500 mt-2">
            All administrative modifications recorded
          </div>
        </div>
      </div>

      {/* Main Settings Tabs Bar divided into 3 rows exactly matching the screenshots */}
      <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-sm space-y-4">
        {/* Row 1 */}
        <div className="flex flex-wrap items-center gap-4">
          {row1.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 font-bold rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isActive 
                    ? 'bg-[#FFD400] text-black border-2 border-black font-extrabold shadow-sm' 
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Row 2 */}
        <div className="flex flex-wrap items-center gap-4">
          {row2.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 font-bold rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isActive 
                    ? 'bg-[#FFD400] text-black border-2 border-black font-extrabold shadow-sm' 
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Row 3 */}
        <div className="flex flex-wrap items-center gap-4">
          {row3.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 font-bold rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isActive 
                    ? 'bg-[#FFD400] text-black border-2 border-black font-extrabold shadow-sm' 
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration & Previews Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        {/* Left Hand: Active Configuration Panels */}
        <div className="lg:col-span-7 space-y-6">
          {activeTab === 'Overview' && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-800 mb-1">White Label Overview</h2>
                <p className="text-xs font-semibold text-slate-400">Status indicator reports, theme adoption charts, and platform security tools.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/20">
                  <h3 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-wider">THEME DISTRIBUTION</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Dark Theme', value: 60, color: 'bg-[#FFD400]' },
                      { name: 'Light Theme', value: 30, color: 'bg-emerald-500' },
                      { name: 'Auto System sync', value: 10, color: 'bg-indigo-500' }
                    ].map((row, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-650">
                          <span>{row.name}</span>
                          <span>{row.value}%</span>
                        </div>
                        <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`${row.color} h-full rounded-full`} style={{ width: `${row.value}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/20">
                  <h3 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-wider">BRANDING ADOPTION BY PLATFORM</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Company Portal', value: 100, color: 'bg-emerald-500' },
                      { name: 'Driver Mobile ELD', value: 85, color: 'bg-[#FFD400]' },
                      { name: 'Shipper Customer Portal', value: 90, color: 'bg-[#FFD400]' }
                    ].map((row, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-650">
                          <span>{row.name}</span>
                          <span>{row.value}%</span>
                        </div>
                        <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`${row.color} h-full rounded-full`} style={{ width: `${row.value}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/20 space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">BRANDING BUILD RELEASES HISTORY</h3>
                <div className="divide-y divide-slate-100 space-y-3">
                  {releaseHistory.map((release, idx) => (
                    <div key={idx} className="flex justify-between items-start pt-3 first:pt-0">
                      <div className="flex gap-2.5 items-start">
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0 mt-1"></span>
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-800">Build version {release.version} (Build #{release.build})</h4>
                          <p className="text-xs font-semibold text-slate-400 mt-1">{release.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{release.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Brand Config' && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-800 mb-1">Branding Config Identity</h2>
                <p className="text-xs font-semibold text-slate-400">Configure company name details, light/dark brand logos, typography, fonts, loader files and borders.</p>
              </div>

              <form onSubmit={handleSaveBranding} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Platform Name</label>
                  <input
                    type="text"
                    required
                    value={brandingForm.platformName}
                    onChange={(e) => setBrandingForm({ ...brandingForm, platformName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Portal Name</label>
                  <input
                    type="text"
                    required
                    value={brandingForm.portalName}
                    onChange={(e) => setBrandingForm({ ...brandingForm, portalName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Short Name abbreviation</label>
                  <input
                    type="text"
                    required
                    value={brandingForm.shortName}
                    onChange={(e) => setBrandingForm({ ...brandingForm, shortName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Loader Animation GIF (URL)</label>
                  <input
                    type="text"
                    value={brandingForm.loaderGif}
                    onChange={(e) => setBrandingForm({ ...brandingForm, loaderGif: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Company Logo (Light Theme URL)</label>
                  <input
                    type="text"
                    value={brandingForm.lightLogo}
                    onChange={(e) => setBrandingForm({ ...brandingForm, lightLogo: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Company Logo (Dark Theme URL)</label>
                  <input
                    type="text"
                    value={brandingForm.darkLogo}
                    onChange={(e) => setBrandingForm({ ...brandingForm, darkLogo: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Favicon shortcut (URL)</label>
                  <input
                    type="text"
                    value={brandingForm.favicon}
                    onChange={(e) => setBrandingForm({ ...brandingForm, favicon: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Login Screen Background URL</label>
                  <input
                    type="text"
                    value={brandingForm.loginBg}
                    onChange={(e) => setBrandingForm({ ...brandingForm, loginBg: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Dashboard Background URL</label>
                  <input
                    type="text"
                    value={brandingForm.dashboardBg}
                    onChange={(e) => setBrandingForm({ ...brandingForm, dashboardBg: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Email Branding Logo URL</label>
                  <input
                    type="text"
                    value={brandingForm.emailLogo}
                    onChange={(e) => setBrandingForm({ ...brandingForm, emailLogo: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Invoice Branding Logo URL</label>
                  <input
                    type="text"
                    value={brandingForm.invoiceLogo}
                    onChange={(e) => setBrandingForm({ ...brandingForm, invoiceLogo: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Manifest Branding Logo URL</label>
                  <input
                    type="text"
                    value={brandingForm.manifestLogo}
                    onChange={(e) => setBrandingForm({ ...brandingForm, manifestLogo: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Brand Font Family</label>
                  <select
                    value={brandingForm.fontFamily}
                    onChange={(e) => setBrandingForm({ ...brandingForm, fontFamily: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:border-[#FFD400] focus:outline-none text-slate-800 cursor-pointer"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Outfit">Outfit</option>
                    <option value="Roboto">Roboto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Typography Style</label>
                  <select
                    value={brandingForm.typographyStyle}
                    onChange={(e) => setBrandingForm({ ...brandingForm, typographyStyle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:border-[#FFD400] focus:outline-none text-slate-800 cursor-pointer"
                  >
                    <option value="Modern Sans">Modern Sans</option>
                    <option value="Serif">Serif</option>
                    <option value="Classic">Classic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Button Radius Option</label>
                  <select
                    value={brandingForm.buttonRadius}
                    onChange={(e) => setBrandingForm({ ...brandingForm, buttonRadius: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:border-[#FFD400] focus:outline-none text-slate-800 cursor-pointer"
                  >
                    <option value="16px (Glassmorphic)">16px (Glassmorphic)</option>
                    <option value="8px (Standard)">8px (Standard)</option>
                    <option value="4px (Subtle)">4px (Subtle)</option>
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2 flex justify-end gap-3.5 pt-4">
                  <button
                    type="button"
                    onClick={handleDiscardBranding}
                    className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Discard Draft
                  </button>
                  <button
                    type="submit"
                    className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Save Branding Configuration
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'Theme Builder' && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-800 mb-1">System Theme Builder</h2>
                <p className="text-xs font-semibold text-slate-400">Design unlimited platform themes, clone designs, and compare version layout variables.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {themes.map((theme, idx) => (
                  <div key={idx} className="border border-slate-150 rounded-2xl p-5 space-y-4 bg-white relative hover:shadow-xs transition-shadow">
                    <div className="flex justify-between items-center">
                      <h4 className="text-base font-extrabold text-slate-850">{theme.name}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        theme.status === 'Published' ? 'bg-[#E6F4EA] text-[#137333]' : 'bg-slate-100 text-slate-650'
                      }`}>
                        {theme.status}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-450 space-y-1 font-mono">
                      <div>Accent: <span className="text-sky-500">{theme.accent}</span></div>
                      <div>Sidebar: <span>{theme.sidebar}</span></div>
                      <div>Header: <span>{theme.header}</span></div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button 
                        onClick={() => handleCloneTheme(theme)}
                        className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-[10px] px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        Clone/Duplicate
                      </button>
                      {theme.status !== 'Published' && (
                        <button 
                          onClick={() => handlePublishTheme(theme.name)}
                          className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-[10px] px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                        >
                          Publish System
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteTheme(theme.name)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-500 p-2.5 rounded-xl border border-rose-100 transition-colors cursor-pointer ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Register Custom Theme Skin</h3>
                <form onSubmit={handleRegisterTheme} className="flex gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Enter custom theme name (e.g. Amber Minimalist)..."
                    value={newThemeName}
                    onChange={(e) => setNewThemeName(e.target.value)}
                    className="flex-grow px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800"
                  />
                  <button
                    type="submit"
                    className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Register Theme
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'Domain Manager' && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-800 mb-1">Domain & Routing Management</h2>
                <p className="text-xs font-semibold text-slate-400">Assign custom enterprise CNAME mappings, domain aliases, redirect paths, and activate SSL handshakes.</p>
              </div>

              <div className="space-y-4">
                {domains.map((dom, idx) => (
                  <div key={idx} className="border border-slate-150 rounded-2xl p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white">
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-extrabold text-slate-850">{dom.domain} <span className="text-xs text-slate-400 font-bold font-mono">CNAME maps to {dom.mapsTo}</span></h4>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold text-slate-450">
                        <span className="text-emerald-500 font-black">SSL: {dom.status} (Expires: {dom.expires})</span>
                        <span>DNS Check: <span className="text-emerald-500">{dom.dns}</span></span>
                        <span>Health: <span className="text-emerald-500 font-black">{dom.health}</span></span>
                        <span>Rules: {dom.rules}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleRenewSSL(dom.domain)}
                      className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0 self-end md:self-auto"
                    >
                      Renew SSL Certificate
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Add Custom Domain Record</h3>
                <form onSubmit={handleRegisterDomain} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Enter Custom Domain</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. tms.falconcarriers.com"
                        value={newDomainForm.domain}
                        onChange={(e) => setNewDomainForm({ ...newDomainForm, domain: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Enter Fallback Subdomain (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. portal.falconcarriers.com"
                        value={newDomainForm.fallback}
                        onChange={(e) => setNewDomainForm({ ...newDomainForm, fallback: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Routing Redirect Rule</label>
                    <select
                      value={newDomainForm.rule}
                      onChange={(e) => setNewDomainForm({ ...newDomainForm, rule: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:border-[#FFD400] focus:outline-none text-slate-800 cursor-pointer"
                    >
                      <option value="Force HTTPS">Force HTTPS</option>
                      <option value="Redirect HTTP to HTTPS">Redirect HTTP to HTTPS</option>
                      <option value="None">None</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Register Domain
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'Communications' && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-800 mb-1">Communications Engine Customizer</h2>
                <p className="text-xs font-semibold text-slate-400">Configure SMTP credentials and edit templates for invitations, dispatch notifications and welcome envelopes.</p>
              </div>

              {/* Horizontal sub-tabs */}
              <div className="flex gap-2 border-b border-slate-100 pb-3 flex-wrap">
                {['Welcome Email', 'Reset Password', 'Driver Invitation', 'Company Invitation'].map((sub) => (
                  <button
                    type="button"
                    key={sub}
                    onClick={() => handleCommSubTabChange(sub)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                      commSubTab === sub 
                        ? 'bg-slate-850 text-white font-extrabold' 
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Email Subject Header</label>
                  <input
                    type="text"
                    value={commEmailSubject}
                    onChange={(e) => setCommEmailSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-855"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Greeting Headline</label>
                  <input
                    type="text"
                    value={commGreeting}
                    onChange={(e) => setCommGreeting(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-855"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">HTML Message Content Body</label>
                  <textarea
                    rows="4"
                    value={commMessageBody}
                    onChange={(e) => setCommMessageBody(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-855 placeholder:text-slate-400 font-sans"
                  />
                </div>

                {/* Send Test Email target address */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="flex-grow">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Enter Test Email Target Address</label>
                    <input
                      type="email"
                      value={testEmailAddress}
                      onChange={(e) => setTestEmailAddress(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={handleSendTestEnvelope}
                    className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-black text-xs px-5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" /> Send Test Envelope
                  </button>
                </div>

                {/* Send Test SMS */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="flex-grow">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Enter Test SMS Target Telephone</label>
                    <input
                      type="text"
                      value={testSmsPhone}
                      onChange={(e) => setTestSmsPhone(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={handleSendTestSms}
                    className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-black text-xs px-5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" /> Send Test SMS
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'PDF Customizer' && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-800 mb-1">PDF Document customizer</h2>
                <p className="text-xs font-semibold text-slate-400">Design header, footers, logos, signature boxes, and QR codes placement parameters on documents.</p>
              </div>

              <form onSubmit={handleSavePDFLayout} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">PDF Document Custom Header Text</label>
                  <input
                    type="text"
                    value={pdfHeader}
                    onChange={(e) => setPdfHeader(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">PDF Document Custom Footer Text (Variables: &#123;page&#125;, &#123;total&#125;)</label>
                  <input
                    type="text"
                    value={pdfFooter}
                    onChange={(e) => setPdfFooter(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-150 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">Document Watermark</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Inject watermark on PODs & receipts.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={pdfWatermark}
                      onChange={(e) => setPdfWatermark(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  <div className="border border-slate-150 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">Verification QR Code</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Attach tracking links to manifests.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={pdfQrCode}
                      onChange={(e) => setPdfQrCode(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3.5 pt-4">
                  <button
                    type="button"
                    onClick={() => { setPdfHeader('HERO LOGISTICS ENTERPRISE SOLUTION'); setPdfFooter('Confidential Document • Page {page} of {total}'); showNotification('Defaults loaded.'); }}
                    className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> Save PDF Layout
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'Login & Override' && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-800 mb-1">Login Interface & Portals overrides</h2>
                <p className="text-xs font-semibold text-slate-400">Configure greeting messages, banner illustrations, and toggle tenant feature overlays.</p>
              </div>

              <form onSubmit={handleSaveLoginOptions} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Login Screen Greeting Text</label>
                  <input
                    type="text"
                    value={loginGreeting}
                    onChange={(e) => setLoginGreeting(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Login Page Illustration Type</label>
                    <select
                      value={loginIllustration}
                      onChange={(e) => setLoginIllustration(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:border-[#FFD400] focus:outline-none text-slate-800 cursor-pointer"
                    >
                      <option value="Global Logistics Net">Global Logistics Net</option>
                      <option value="Abstract Shapes">Abstract Shapes</option>
                      <option value="Minimalistic Grid">Minimalistic Grid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Support Help Center URL</label>
                    <input
                      type="text"
                      value={loginSupportUrl}
                      onChange={(e) => setLoginSupportUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                {/* Toggles Matrix */}
                <div className="border border-slate-150 rounded-2xl p-5 space-y-4 bg-white">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Portal Overrides Branding Toggles Matrix</h3>
                  <div className="flex flex-wrap gap-8 text-xs font-bold text-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={loginToggles.driverApp}
                        onChange={(e) => setLoginToggles({ ...loginToggles, driverApp: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>Driver App</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={loginToggles.dispatcherPortal}
                        onChange={(e) => setLoginToggles({ ...loginToggles, dispatcherPortal: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>Dispatcher Portal</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={loginToggles.customerPortal}
                        onChange={(e) => setLoginToggles({ ...loginToggles, customerPortal: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>Customer Portal</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3.5 pt-4">
                  <button
                    type="button"
                    onClick={() => { setLoginGreeting('Welcome to Enterprise Logistics OS'); showNotification('Defaults loaded.'); }}
                    className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> Save Login Options
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'Deployment Timeline' && (
            <div className="space-y-6 w-full">
              {/* Timeline Header Card */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg font-black text-slate-800 mb-1">Branding Deployment Pipeline</h2>
                  <p className="text-xs font-semibold text-slate-400">Package styling parameters and configs to compile a static web app distribution bundle and push to S3 CDN.</p>
                </div>

                <form onSubmit={handleCompileS3Build} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Release Modification Changelog Summary</label>
                    <textarea
                      rows="3"
                      required
                      placeholder="Detail the changes in this build (e.g. Unified portal theme, updated lights logos, redirected SMTP relays)..."
                      value={changelogText}
                      onChange={(e) => setChangelogText(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none placeholder:text-slate-400 font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs py-3.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 w-full text-center"
                  >
                    <Play className="w-4 h-4 fill-black" /> Compile static assets & Deploy Build to S3 CDN
                  </button>
                </form>
              </div>

              {/* Published Release Logs & Rollback Revisions */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-5">
                <h3 className="text-sm font-black text-slate-800">Published Release Logs & Rollback Revisions</h3>
                
                <div className="space-y-4">
                  {releaseHistory.map((rel, idx) => (
                    <div key={idx} className="border border-slate-150 rounded-2xl p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-extrabold text-slate-800">{rel.version}</h4>
                          <span className="bg-slate-105 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded">
                            Build #{rel.build}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            rel.status === 'Published' ? 'bg-[#E6F4EA] text-[#137333]' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {rel.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 font-semibold">{rel.desc}</p>
                        <div className="text-[10px] text-slate-400 font-bold">
                          {rel.date} • Released By System Root • Duration: 12s
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                        <button
                          type="button"
                          onClick={() => alert(`Build Diff Logs for v${rel.version}:\nNo file system modifications recorded.`)}
                          className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                        >
                          Diff Viewer
                        </button>
                        {rel.status !== 'Published' && (
                          <button
                            type="button"
                            onClick={() => handleRollback(rel.version)}
                            className="border border-amber-200 bg-white hover:bg-amber-50/20 text-[#CC7B00] font-extrabold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                          >
                            Rollback
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Audit Trails */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-5">
                <div className="flex justify-between items-center flex-wrap gap-2 pb-2">
                  <h3 className="text-sm font-black text-slate-800">System Audit Trails</h3>
                  <button
                    type="button"
                    onClick={handleExportAuditsCSV}
                    className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-750 font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Export Audits CSV
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Search action or details..."
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    className="flex-grow px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800"
                  />
                  <select
                    value={auditFilter}
                    onChange={(e) => setAuditFilter(e.target.value)}
                    className="px-3.5 py-2.5 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:border-[#FFD400] focus:outline-none text-slate-800 cursor-pointer min-w-[150px]"
                  >
                    <option value="All Actions">All Actions</option>
                    <option value="Config">Config</option>
                    <option value="SMTP">SMTP</option>
                  </select>
                </div>

                <div className="border border-slate-150 rounded-2xl overflow-hidden divide-y divide-slate-100">
                  {auditLogs
                    .filter(log => {
                      const matchesSearch = log.title.toLowerCase().includes(auditSearch.toLowerCase()) || 
                                            log.desc.toLowerCase().includes(auditSearch.toLowerCase());
                      const matchesFilter = auditFilter === 'All Actions' || log.type === auditFilter;
                      return matchesSearch && matchesFilter;
                    })
                    .map((log, idx) => (
                      <div key={idx} className="p-5 flex justify-between items-start gap-4 hover:bg-slate-50/30 transition-colors bg-white">
                        <div className="space-y-1.5 text-left">
                          <h4 className="text-sm font-extrabold text-slate-800">{log.title}</h4>
                          <p className="text-xs text-slate-650 font-semibold">{log.desc}</p>
                          <div className="text-[10px] text-slate-450 font-bold mt-1">
                            Operator: {log.operator} • IP: {log.ip} • Browser: {log.browser}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{log.date}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Security & Access' && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-800 mb-1">White Label Security</h2>
                <p className="text-xs font-semibold text-slate-400">Configure secure access restrictions, environmental variables secrets, allowed IP networks, and MFA enforcements.</p>
              </div>

              {/* MFA & CDN Policies Grid */}
              <div className="bg-slate-50/30 border border-slate-150 rounded-2xl p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-black text-slate-450 uppercase tracking-wider mb-3">MFA Enforcement Toggles</h3>
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={mfaEnforced}
                        onChange={(e) => setMfaEnforced(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-700">Enforce MFA for branding managers</span>
                    </label>
                  </div>

                  <div>
                    <h3 className="text-xs font-black text-slate-450 uppercase tracking-wider mb-3">Branding Deployment Approval Policy</h3>
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={adminReviewRequired}
                        onChange={(e) => setAdminReviewRequired(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-700">Super Admin review required before CDN release</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-5 border-t border-slate-150">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Session Timeout limits</label>
                    <select
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:border-[#FFD400] focus:outline-none text-slate-800 cursor-pointer"
                    >
                      <option value="30 Minutes">30 Minutes</option>
                      <option value="1 Hour">1 Hour</option>
                      <option value="4 Hours">4 Hours</option>
                      <option value="24 Hours">24 Hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Allowed IP networks (comma separated)</label>
                    <input
                      type="text"
                      value={allowedIps}
                      onChange={(e) => setAllowedIps(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Developer Secrets & Webhook Credentials */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-800">Developer Secrets & Webhook Credentials</h3>
                
                <div className="space-y-3">
                  {developerKeys.map((key) => (
                    <div key={key.id} className="border border-slate-150 rounded-2xl p-4 flex justify-between items-center gap-4 bg-white">
                      <div className="text-left">
                        <h4 className="text-xs font-extrabold text-slate-800">{key.name}</h4>
                        <p className="text-[10px] font-mono text-slate-500 mt-1 font-semibold">
                          {key.visible ? key.value : '••••••••••••••••••••••••••••••••••••••••'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleKeyVisibility(key.id)}
                          className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteKey(key.id)}
                          className="p-2 border border-rose-100 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100/70 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddKey} className="flex gap-3 pt-2">
                  <input
                    type="text"
                    required
                    placeholder="Add key name context (e.g. Stripe client secret)..."
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="flex-grow px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800"
                  />
                  <button
                    type="submit"
                    className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Add Key
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'API Integrations' && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-800 mb-1">White Label API Integrations</h2>
                <p className="text-xs font-semibold text-slate-400">Manage connection details, Stripe billing integration, Twilio, SendGrid, and AWS CDN status configurations.</p>
              </div>

              <div className="space-y-3">
                {apiIntegrations.map((item, idx) => (
                  <div key={idx} className="border border-slate-150 rounded-2xl p-5 flex justify-between items-center gap-4 bg-white hover:shadow-xs transition-shadow">
                    <div className="text-left">
                      <h4 className="text-sm font-extrabold text-slate-850">{item.name}</h4>
                      <div className="text-[10px] font-bold text-slate-450 mt-1.5 flex items-center gap-1">
                        <span>Status:</span>
                        <span className={`${
                          item.status === 'Testing...' 
                            ? 'text-yellow-600 animate-pulse' 
                            : item.status === 'Not Connected' 
                              ? 'text-rose-500' 
                              : 'text-[#10B981]'
                        } font-black`}>
                          {item.status}
                        </span>
                        <span className="mx-1">•</span>
                        <span>Health:</span>
                        <span className={`${
                          item.health === 'Healthy' 
                            ? 'text-[#10B981]' 
                            : item.health === 'Unknown' 
                              ? 'text-slate-400' 
                              : 'text-[#10B981]'
                        } font-black`}>
                          {item.health}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTestConnection(item.name)}
                      disabled={item.status === 'Testing...'}
                      className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <Play className="w-3 h-3 fill-slate-700 text-slate-700" /> Test Connection
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Asset Library' && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-800 mb-1">Asset Library Workspace</h2>
                <p className="text-xs font-semibold text-slate-400">View and manage uploaded images, background assets, documents, and logos.</p>
              </div>
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-6 text-center text-xs text-slate-500 font-bold flex items-center justify-center gap-2">
                <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0" />
                Asset Library sub-module is active and verified.
              </div>
            </div>
          )}
        </div>

        {/* Right Hand: Persistent Previews Workspace */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
              <Eye className="w-4.5 h-4.5 text-yellow-600" /> Live Previews Workspace
            </h3>
            
            <div className="flex gap-1.5">
              {['Portal UI', 'Email HTML', 'PDF Manifest', 'Login Panel'].map((pt) => (
                <button
                  key={pt}
                  onClick={() => setPreviewTab(pt)}
                  className={`px-3 py-1.5 font-bold rounded-lg text-[10px] transition-colors cursor-pointer border ${
                    previewTab === pt
                      ? 'border-[#FFD400] text-yellow-600 bg-yellow-50/10'
                      : 'border-slate-100 text-slate-400 bg-white hover:bg-slate-50/50'
                  }`}
                >
                  {pt}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Mock Window */}
          <div className="w-full bg-[#0F172A] border border-slate-900 rounded-2xl p-4 text-left font-sans text-white h-[360px] flex flex-col justify-between overflow-hidden shadow-inner relative">
            
            {previewTab === 'Portal UI' && (
              <>
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#00A3FF] flex items-center justify-center text-[10px] font-black text-white">H</span>
                    <span className="text-xs font-black text-white">{liveBranding.platformName}</span>
                  </div>
                  <span className="text-[9px] font-bold text-white/40 border border-white/10 px-2 py-0.5 rounded bg-white/5">
                    {liveBranding.shortName}
                  </span>
                </div>

                <div className="flex-grow flex gap-3 pt-3 overflow-hidden">
                  <div className="w-20 shrink-0 space-y-1 border-r border-white/5 pr-2">
                    <div className="bg-white/10 text-white text-[9px] font-black px-2 py-1 rounded-lg">Dashboard</div>
                    <div className="text-white/40 text-[9px] font-bold px-2 py-1 hover:bg-white/5 rounded-lg cursor-pointer">Loads</div>
                    <div className="text-white/40 text-[9px] font-bold px-2 py-1 hover:bg-white/5 rounded-lg cursor-pointer">Vehicles</div>
                  </div>

                  <div className="flex-grow space-y-3 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-white/50">{liveBranding.portalName}</span>
                      <button 
                        style={{ borderRadius: liveBranding.buttonRadius.includes('16px') ? '12px' : liveBranding.buttonRadius.includes('8px') ? '6px' : '2px' }}
                        className="bg-[#00A3FF] hover:bg-[#0091FF] text-white text-[9px] font-black px-3 py-1 transition-all"
                      >
                        Action Button
                      </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
                      <div className="text-[8px] font-black text-white/40 uppercase tracking-wider">MOCK OPERATIONS LOG</div>
                      <div className="flex justify-between items-center text-[9px] font-bold border-b border-white/5 pb-1">
                        <span>LO-9411</span>
                        <span className="text-emerald-400">Delivered</span>
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-bold">
                        <span>LO-4820</span>
                        <span className="text-[#FFAB00]">In Transit</span>
                      </div>
                    </div>

                    <div 
                      style={{ background: `linear-gradient(135deg, ${activeTheme.accent}, ${activeTheme.accent}aa)` }}
                      className="rounded-xl p-3 text-white space-y-1.5"
                    >
                      <h4 className="text-[10px] font-black uppercase">ENTERPRISE GROWTH</h4>
                      <p className="text-[8px] font-semibold text-white/80 leading-normal">
                        Unified logistics operations dashboard metrics tracker panel.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-[8px] font-bold text-white/35 pt-2 border-t border-white/5 flex justify-between">
                  <span>v{activeVersion}</span>
                  <span>Active Theme: {activeTheme.name}</span>
                </div>
              </>
            )}

            {previewTab === 'Email HTML' && (
              <div className="flex-grow flex flex-col justify-between text-slate-850 bg-white border border-slate-100 rounded-xl p-4 overflow-hidden h-full shadow-inner">
                <div className="space-y-2.5">
                  <div className="border-b border-slate-100 pb-2">
                    <div className="text-[9px] font-bold text-slate-400">From: <span className="text-slate-600 font-extrabold">notifications@herologistics.com</span></div>
                    <div className="text-[9px] font-bold text-slate-400 mt-0.5">Subject: <span className="text-slate-700 font-extrabold">{commEmailSubject}</span></div>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-black text-slate-900">{commGreeting}</h4>
                    <p className="text-[10px] text-slate-500 leading-normal font-medium">
                      {commMessageBody}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-[8px] font-bold text-slate-400">
                  <span>Powering logistics by {liveBranding.platformName}</span>
                  <span>Sent via secure SMTP relay</span>
                </div>
              </div>
            )}

            {previewTab === 'PDF Manifest' && (
              <div className="flex-grow flex flex-col justify-between text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-hidden h-full shadow-inner font-mono relative">
                {pdfWatermark && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none origin-center -rotate-45 font-sans font-black text-2xl text-slate-900 uppercase">
                    CONFIDENTIAL
                  </div>
                )}
                <div className="space-y-3">
                  <div className="border-b border-slate-200 pb-2 text-center">
                    <h3 className="text-xs font-black text-slate-900 tracking-wider uppercase">{pdfHeader}</h3>
                    <span className="text-[8px] text-slate-450 font-bold block mt-0.5">VERIFIED BY {liveBranding.shortName.toUpperCase()} OS</span>
                  </div>
                  <div className="space-y-1 text-[9px] text-slate-600 font-bold flex justify-between items-end">
                    <div className="space-y-1">
                      <div>MANIFEST ID: <span className="text-slate-900 font-extrabold">#MNF-9021-A</span></div>
                      <div>DATE ISSUED: <span>06/25/2026</span></div>
                      <div>CARRIER ID: <span>SWIFT-CARGO-EXP</span></div>
                    </div>
                    {pdfQrCode && (
                      <div className="w-12 h-12 bg-white border border-slate-250 p-1 flex items-center justify-center shrink-0">
                        <div className="w-full h-full bg-slate-800 grid grid-cols-3 gap-0.5 p-0.5 opacity-80">
                          <div className="bg-white"></div><div className="bg-slate-800"></div><div className="bg-white"></div>
                          <div className="bg-slate-800"></div><div className="bg-white"></div><div className="bg-slate-800"></div>
                          <div className="bg-white"></div><div className="bg-slate-800"></div><div className="bg-white"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-2 text-center text-[7px] font-bold text-slate-400">
                  {pdfFooter.replace('{page}', '1').replace('{total}', '1')}
                </div>
              </div>
            )}

            {previewTab === 'Login Panel' && (
              <div className="flex-grow flex flex-col items-center justify-center text-slate-850 bg-slate-100 rounded-xl p-5 overflow-hidden h-full relative" style={{ backgroundImage: `url(${liveBranding.loginBg})`, backgroundSize: 'cover' }}>
                <div className="bg-white/95 border border-slate-200/50 rounded-2xl p-4 shadow-md w-full max-w-[210px] text-center space-y-3">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-900">{loginGreeting}</h4>
                    <span className="text-[7px] text-slate-450 font-bold block mt-0.5">Illustration: {loginIllustration}</span>
                  </div>

                  <div className="space-y-1">
                    <input type="text" disabled placeholder="username" className="w-full px-2 py-1 text-[8px] bg-slate-50 border border-slate-200 rounded focus:outline-none" />
                    <input type="password" disabled placeholder="password" className="w-full px-2 py-1 text-[8px] bg-slate-50 border border-slate-200 rounded focus:outline-none" />
                  </div>

                  <div className="flex justify-center gap-1.5 text-[6px] font-bold text-slate-450">
                    {loginToggles.driverApp && <span>• Driver</span>}
                    {loginToggles.dispatcherPortal && <span>• Dispatcher</span>}
                    {loginToggles.customerPortal && <span>• Customer</span>}
                  </div>

                  <button className="w-full bg-[#FFD400] text-black text-[8px] font-extrabold py-1.5 rounded-lg shadow-sm">
                    Access Portal
                  </button>
                  <a href={loginSupportUrl} target="_blank" rel="noreferrer" className="text-[7px] font-black text-blue-500 block hover:underline">Help Center</a>
                </div>
              </div>
            )}
          </div>

          {/* Commit Draft button wrapper */}
          <div className="bg-slate-100 border border-slate-200/50 rounded-2xl p-4 flex justify-between items-center gap-4">
            <span className="text-[10px] font-bold text-slate-500">Modify preview attributes live using settings tabs.</span>
            <button 
              onClick={handleCommitDraft}
              className="bg-[#FFAB00] hover:bg-[#FFA000] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4" /> Commit Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
