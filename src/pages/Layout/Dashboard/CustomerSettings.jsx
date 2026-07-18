import React, { useState, useRef } from 'react';
import './CustomerDashboard.css';

// SVG Icons for Tabs
const ProfileIcon = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? '#b45309' : '#64748b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const BrandingIcon = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? '#b45309' : '#64748b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path>
    <path d="M7.5 10.5C8.32843 10.5 9 9.82843 9 9C9 8.17157 8.32843 7.5 7.5 7.5C6.67157 7.5 6 8.17157 6 9C6 9.82843 6.67157 10.5 7.5 10.5Z"></path>
    <path d="M11.5 7.5C12.3284 7.5 13 6.82843 13 6C13 5.17157 12.3284 4.5 11.5 4.5C10.6716 4.5 10 5.17157 10 6C10 6.82843 10.6716 7.5 11.5 7.5Z"></path>
    <path d="M16.5 9.5C17.3284 9.5 18 8.82843 18 8C18 7.17157 17.3284 6.5 16.5 6.5C15.6716 6.5 15 7.17157 15 8C15 8.82843 15.6716 9.5 16.5 9.5Z"></path>
    <path d="M6 15C6 13.9 7 13 8 13H16C17 13 18 13.9 18 15V17C18 18.1 17 19 16 19H8C7 19 6 18.1 6 17V15Z"></path>
  </svg>
);

const HoursIcon = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? '#b45309' : '#64748b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const BillingIcon = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? '#b45309' : '#64748b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="2" y1="10" x2="22" y2="10"></line>
  </svg>
);

const WhiteLabelIcon = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? '#b45309' : '#64748b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const NicheIcon = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? '#b45309' : '#64748b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    <rect x="9" y="9" width="6" height="6"></rect>
    <line x1="9" y1="1" x2="9" y2="4"></line>
    <line x1="15" y1="1" x2="15" y2="4"></line>
    <line x1="9" y1="20" x2="9" y2="23"></line>
    <line x1="15" y1="20" x2="15" y2="23"></line>
    <line x1="20" y1="9" x2="23" y2="9"></line>
    <line x1="20" y1="15" x2="23" y2="15"></line>
    <line x1="1" y1="9" x2="4" y2="9"></line>
    <line x1="1" y1="15" x2="4" y2="15"></line>
  </svg>
);

const GpsIcon = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? '#b45309' : '#64748b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
  </svg>
);

const IntegrationIcon = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? '#b45309' : '#64748b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path>
  </svg>
);

const TemplatesIcon = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? '#b45309' : '#64748b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const LogsIcon = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? '#b45309' : '#64748b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

// Gear Icon for Audit Logs Columns visibility
const GearIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

// CSV Download Icon
const DownloadIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

// Custom Checkbox Component
const CustomCheckbox = ({ checked, onChange }) => (
  <div
    onClick={onChange}
    style={{
      width: 16,
      height: 16,
      borderRadius: 4,
      border: checked ? '2px solid #0066cc' : '2px solid #cbd5e1',
      backgroundColor: checked ? '#0066cc' : '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      boxSizing: 'border-box',
      userSelect: 'none'
    }}
  >
    {checked && (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    )}
  </div>
);

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange }) => (
  <div
    onClick={onChange}
    style={{
      width: 40,
      height: 22,
      borderRadius: 11,
      backgroundColor: checked ? '#FFCC00' : '#cbd5e1',
      display: 'flex',
      alignItems: 'center',
      padding: 2,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box'
    }}
  >
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        backgroundColor: '#ffffff',
        transform: checked ? 'translateX(18px)' : 'translateX(0)',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
      }}
    />
  </div>
);

const CustomerSettings = () => {
  // Active Tab State
  const [activeTab, setActiveTab] = useState('profile');

  // Form Fields: Company Profile
  const [companyName, setCompanyName] = useState('Hero Logistics Ltd');
  const [regNumber, setRegNumber] = useState('ABN 48 901 029 421');
  const [adminEmail, setAdminEmail] = useState('admin@herologistics.com');

  // Form Fields: Branding & Theme
  const [themeColor, setThemeColor] = useState('default');
  const [logoFile, setLogoFile] = useState(null);

  // Form Fields: Business Hours
  const [hoursState, setHoursState] = useState({
    monFri: { open: true, time: '08:00 AM - 06:00 PM' },
    sat: { open: true, time: '09:00 AM - 02:00 PM' },
    sun: { open: false, time: 'closed' }
  });

  // Form Fields: White Labeling
  const [customDomain, setCustomDomain] = useState('logistics.herologistics.com');
  const [welcomeHeader, setWelcomeHeader] = useState('Hero Logistics Operate System');
  const [hideBrandingLabels, setHideBrandingLabels] = useState(false);

  // Form Fields: Logistics Niche Configurations
  const [nichesState, setNichesState] = useState({
    carCarrying: { checked: true, title: 'Car Carrying & Transport', desc: 'Enables VIN / Rego details, booking yard lanes, and active regulators.' },
    generalFreight: { checked: true, title: 'General Freight', desc: 'Enables loose goods, dimensions, cargo weight, and dry bins.' },
    dangerousGoods: { checked: true, title: 'Dangerous Goods (HAZMAT)', desc: 'Enables UN Class, Hazchem chemical codes, and trailer placards.' }
  });
  const [defaultNiche, setDefaultNiche] = useState('Car Carrying');

  // Form Fields: GPS API Connections
  const [gpsProviders, setGpsProviders] = useState([
    { id: 'trakka', name: 'Trakka Telematics', status: 'Connected', badgeColor: '#d1fae5', textColor: '#047857', apiKey: '****************3981' },
    { id: 'geotab', name: 'Geotab ELD API', status: 'Connected', badgeColor: '#d1fae5', textColor: '#047857', apiKey: '****************7742' },
    { id: 'teletrac', name: 'Teletrac Navman', status: 'Disconnected', badgeColor: '#fee2e2', textColor: '#ef4444', apiKey: 'No API key configured' }
  ]);

  // Form Fields: Accounting Integration
  const [accountingIntegrations, setAccountingIntegrations] = useState([
    { id: 'xero', name: 'Xero Accounting', status: 'Connected', badgeColor: '#d1fae5', textColor: '#047857', syncLog: '10 min ago' },
    { id: 'quickbooks', name: 'QuickBooks Online', status: 'Disconnected', badgeColor: '#fee2e2', textColor: '#ef4444', syncLog: 'Never' }
  ]);

  // Form Fields: Security Audit Logs Table
  const [auditLogs, setAuditLogs] = useState([
    { id: 'LOG-1001', timestamp: '2026-07-16 18:41:20', userNode: 'Node-Admin', event: 'Invoice INV-8912 downloaded as PDF.', ipAddress: '192.168.1.50', status: 'Success' },
    { id: 'LOG-1002', timestamp: '2026-07-16 18:32:05', userNode: 'Node-Admin', event: 'Admin updated Business Hours (Saturday schedule change).', ipAddress: '192.168.1.50', status: 'Success' },
    { id: 'LOG-1003', timestamp: '2026-07-16 17:59:12', userNode: 'Node-Billing', event: 'Billing address modified (Visa ending in 8812 verified).', ipAddress: '192.168.1.99', status: 'Success' },
    { id: 'LOG-1004', timestamp: '2026-07-16 15:10:45', userNode: 'Node-Admin', event: 'Registered domain modified to: logistics.herologistics.com.', ipAddress: '192.168.1.50', status: 'Success' }
  ]);

  // Audit Logs Table Configuration States
  const [logDensity, setLogDensity] = useState('RELAXED');
  const [showLogColsDropdown, setShowLogColsDropdown] = useState(false);
  const [visibleLogCols, setVisibleLogCols] = useState({
    timestamp: false,
    userNode: false,
    event: false,
    ipAddress: false,
    authStatus: true // Only Auth Status visible initially matching fifth screenshot
  });
  const [selectedLogIds, setSelectedLogIds] = useState([]);

  // UI States
  const [toast, setToast] = useState(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportDescription, setSupportDescription] = useState('');

  const fileInputRef = useRef(null);

  // Trigger Toast Notification
  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Trigger file upload dialog
  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  // Handle logo file change
  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      triggerToast(`Logo "${e.target.files[0].name}" loaded successfully.`);
    }
  };

  // Drag and Drop handlers for logo
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setLogoFile(e.dataTransfer.files[0]);
      triggerToast(`Logo "${e.dataTransfer.files[0].name}" dropped successfully.`);
    }
  };

  // Save changes handler
  const handleSaveSettings = (e, msg) => {
    if (e) e.preventDefault();
    triggerToast(msg || 'Settings saved successfully.');
  };

  // Submit Support Modal Drawer
  const handleSupportSubmit = (e) => {
    e.preventDefault();
    triggerToast('Support ticket submitted successfully.');
    setShowSupportModal(false);
    setSupportSubject('');
    setSupportDescription('');
  };

  // Audit Logs Select Row
  const handleSelectLog = (id) => {
    setSelectedLogIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Audit Logs Select All
  const handleSelectAllLogs = () => {
    if (selectedLogIds.length === auditLogs.length) {
      setSelectedLogIds([]);
    } else {
      setSelectedLogIds(auditLogs.map(l => l.id));
    }
  };

  // Audit Logs CSV Exporter
  const handleExportLogsCSV = () => {
    const selectedLogs = auditLogs.filter(l => selectedLogIds.includes(l.id));
    if (selectedLogs.length === 0) return;

    const headers = [];
    if (visibleLogCols.timestamp) headers.push('Timestamp');
    if (visibleLogCols.userNode) headers.push('User Node');
    if (visibleLogCols.event) headers.push('Event Action Description');
    if (visibleLogCols.ipAddress) headers.push('IP Address');
    if (visibleLogCols.authStatus) headers.push('Auth Status');

    const useFallback = headers.length === 0;
    const finalHeaders = useFallback
      ? ['Timestamp', 'User Node', 'Event Action Description', 'IP Address', 'Auth Status']
      : headers;

    const csvRows = [finalHeaders.join(',')];

    for (const log of selectedLogs) {
      const row = [];
      if (useFallback || visibleLogCols.timestamp) row.push(`"${log.timestamp}"`);
      if (useFallback || visibleLogCols.userNode) row.push(`"${log.userNode}"`);
      if (useFallback || visibleLogCols.event) row.push(`"${log.event.replace(/"/g, '""')}"`);
      if (useFallback || visibleLogCols.ipAddress) row.push(`"${log.ipAddress}"`);
      if (useFallback || visibleLogCols.authStatus) row.push(`"${log.status}"`);
      csvRows.push(row.join(','));
    }

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `security_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('Security audit logs CSV exported.');
  };

  // Logs table cell padding sizes based on active density
  const getLogDensityPadding = () => {
    switch (logDensity) {
      case 'COMPACT':
        return { padding: '8px 12px', fontSize: '11px' };
      case 'DEFAULT':
        return { padding: '12px 16px', fontSize: '12px' };
      case 'RELAXED':
      default:
        return { padding: '16px 20px', fontSize: '12.5px' };
    }
  };

  const logPadding = getLogDensityPadding();

  // Render Panel content depending on selected tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={(e) => handleSaveSettings(e, 'Profile settings saved successfully.')} style={S.formCard}>
            <h2 style={S.panelTitle}>Company Profile Settings</h2>

            <div style={S.fieldGroup}>
              <label style={S.fieldLabel}>REGISTERED COMPANY NAME</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={S.input}
                required
              />
            </div>

            <div style={S.fieldGroup}>
              <label style={S.fieldLabel}>CORPORATE REGISTRATION NUMBER</label>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                style={S.input}
                required
              />
            </div>

            <div style={S.fieldGroup}>
              <label style={S.fieldLabel}>CORPORATE ADMIN EMAIL</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                style={S.input}
                required
              />
            </div>

            {/* Platform Membership card */}
            <div style={S.membershipCard}>
              <div style={S.membershipHeader}>
                <span style={S.membershipLabel}>PLATFORM MEMBERSHIP SUBSCRIPTION</span>
              </div>
              <div style={S.membershipBody}>
                <div>
                  <h3 style={S.membershipPlanName}>Enterprise Tier Plan</h3>
                  <p style={S.membershipSubtext}>Your next billing cycle date: 07/20/2026 (Monthly invoice card: visa-8812)</p>
                </div>
                <span style={S.membershipStatus}>Active</span>
              </div>
            </div>

            <button type="submit" style={S.submitBtn}>Save Profile Settings</button>
          </form>
        );

      case 'branding':
        return (
          <form onSubmit={(e) => handleSaveSettings(e, 'Branding and theme applied successfully.')} style={S.formCard}>
            <h2 style={S.panelTitle}>Company Branding &amp; Custom Theme</h2>
            <p style={S.panelSubtitle}>Customize the workspace color palette, layout mode, and upload your official company logo.</p>

            {/* Primary Workspace Color Picker */}
            <div style={S.colorPickerSection}>
              <label style={S.fieldLabel}>PRIMARY WORKSPACE THEME COLOR</label>
              <div style={S.colorCirclesRow}>
                {[
                  { id: 'default', color: '#FFCC00', name: 'Default' },
                  { id: 'purple', color: '#8B5CF6', name: 'Purple' },
                  { id: 'green', color: '#10B981', name: 'Green' },
                  { id: 'orange', color: '#F97316', name: 'Orange' },
                  { id: 'blue', color: '#3B82F6', name: 'Blue' }
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setThemeColor(item.id)}
                    style={S.colorCircleWrapper}
                  >
                    <div
                      style={{
                        ...S.colorCircle,
                        backgroundColor: item.color,
                        boxShadow: themeColor === item.id
                          ? `0 0 0 2.5px #ffffff, 0 0 0 5px ${item.color}`
                          : '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    />
                    <span style={S.colorCircleName}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Area */}
            <div style={S.uploadSection}>
              <label style={S.fieldLabel}>COMPANY LOGO UPLOAD</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <div
                onClick={handleUploadAreaClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={S.uploadBox}
              >
                <span style={{ fontSize: 24, marginBottom: 8 }}>🏢</span>
                <span style={S.uploadBoxTitle}>
                  {logoFile ? `File: ${logoFile.name}` : 'Click or drag logo file here'}
                </span>
                <span style={S.uploadBoxSub}>Supports SVG, PNG, JPG up to 5MB</span>
              </div>
            </div>

            <button type="submit" style={S.submitBtn}>Apply Branding &amp; Themes</button>
          </form>
        );

      case 'hours':
        return (
          <form onSubmit={(e) => handleSaveSettings(e, 'Default business hours saved successfully.')} style={S.formCard}>
            <h2 style={S.panelTitle}>Default Terminal Business Hours</h2>
            <p style={S.panelSubtitle}>Establish base operating hours across company depots. Individual depots can override these in Branch Settings.</p>

            <div style={S.hoursRowsContainer}>
              {/* Monday - Friday */}
              <div style={S.hoursRow}>
                <div>
                  <h3 style={S.hoursRowTitle}>Monday - Friday</h3>
                  <p style={S.hoursRowTime}>08:00 AM - 06:00 PM</p>
                </div>
                <div style={S.hoursRowRight}>
                  <span style={{ ...S.hoursRowStatus, color: hoursState.monFri.open ? '#10b981' : '#ef4444' }}>
                    {hoursState.monFri.open ? 'Open' : 'Closed'}
                  </span>
                  <ToggleSwitch
                    checked={hoursState.monFri.open}
                    onChange={() => setHoursState(prev => ({ ...prev, monFri: { ...prev.monFri, open: !prev.monFri.open } }))}
                  />
                </div>
              </div>

              {/* Saturday */}
              <div style={S.hoursRow}>
                <div>
                  <h3 style={S.hoursRowTitle}>Saturday</h3>
                  <p style={S.hoursRowTime}>09:00 AM - 02:00 PM</p>
                </div>
                <div style={S.hoursRowRight}>
                  <span style={{ ...S.hoursRowStatus, color: hoursState.sat.open ? '#10b981' : '#ef4444' }}>
                    {hoursState.sat.open ? 'Open' : 'Closed'}
                  </span>
                  <ToggleSwitch
                    checked={hoursState.sat.open}
                    onChange={() => setHoursState(prev => ({ ...prev, sat: { ...prev.sat, open: !prev.sat.open } }))}
                  />
                </div>
              </div>

              {/* Sunday */}
              <div style={S.hoursRow}>
                <div>
                  <h3 style={S.hoursRowTitle}>Sunday</h3>
                  <p style={S.hoursRowTime}>closed</p>
                </div>
                <div style={S.hoursRowRight}>
                  <span style={{ ...S.hoursRowStatus, color: hoursState.sun.open ? '#10b981' : '#ef4444' }}>
                    {hoursState.sun.open ? 'Open' : 'Closed'}
                  </span>
                  <ToggleSwitch
                    checked={hoursState.sun.open}
                    onChange={() => setHoursState(prev => ({ ...prev, sun: { ...prev.sun, open: !prev.sun.open } }))}
                  />
                </div>
              </div>
            </div>

            <button type="submit" style={S.submitBtn}>Save Default Hours</button>
          </form>
        );

      case 'billing':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Upper Panel */}
            <div style={S.gpsPanelCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 style={S.panelTitle}>Billing &amp; Subscription Management</h2>
                <span style={S.billingBadge}>Enterprise Tier</span>
              </div>
              <p style={S.panelSubtitle}>Manage plan subscription levels, invoices, and active payment cards.</p>

              {/* Double summary cards */}
              <div style={S.billingSummaryRow}>
                <div style={S.billingSummaryBox}>
                  <div style={S.fieldLabel}>ACTIVE PAYMENT METHOD</div>
                  <div style={S.billingCardRow}>
                    <span style={S.visaLogo}>Visa</span>
                    <div>
                      <h4 style={S.billingCardText}>Visa ending in 8812</h4>
                      <p style={S.billingCardSub}>Expires 09/2029</p>
                    </div>
                  </div>
                  <span style={S.updateCardLink} onClick={() => triggerToast('Update billing flow triggered.')}>Update Card Details &rarr;</span>
                </div>

                <div style={S.billingSummaryBox}>
                  <div style={S.fieldLabel}>SUBSCRIPTION USAGE</div>
                  <div style={S.usageItemsList}>
                    <div style={S.usageItem}>
                      <span style={S.usageLabel}>depots count</span>
                      <span style={S.usageVal}>2 / Unlimited</span>
                    </div>
                    <div style={S.usageItem}>
                      <span style={S.usageLabel}>users count</span>
                      <span style={S.usageVal}>12 / Unlimited</span>
                    </div>
                    <div style={S.usageItem}>
                      <span style={S.usageLabel}>monthly invoice value</span>
                      <span style={{ ...S.usageVal, color: '#b45309', fontWeight: '800' }}>$499.00 / mo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoices registry panel */}
            <div style={S.gpsPanelCard}>
              <h2 style={S.panelTitle}>BILLING INVOICES REGISTRY</h2>
              <div style={S.invoicesList}>
                {[
                  { id: 'INV-89112', date: 'Jun 20, 2026', amount: '$499.00' },
                  { id: 'INV-88029', date: 'May 20, 2026', amount: '$499.00' },
                  { id: 'INV-87002', date: 'Apr 20, 2026', amount: '$499.00' }
                ].map((inv) => (
                  <div key={inv.id} style={S.invoiceRow}>
                    <div>
                      <h4 style={S.invoiceRowTitle}>Invoice #{inv.id}</h4>
                      <p style={S.invoiceRowSub}>{inv.date}</p>
                    </div>
                    <div style={S.invoiceRowRight}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, marginRight: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: '700', color: '#ffffff' }}>{inv.amount}</span>
                        <span style={{ fontSize: 9, fontWeight: '700', color: '#cbd5e1', letterSpacing: '0.5px' }}>PAID</span>
                      </div>
                      <button
                        onClick={() => triggerToast(`Downloading PDF invoice: ${inv.id}`)}
                        style={S.invoicePdfBtn}
                      >
                        PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'whiteLabel':
        return (
          <form onSubmit={(e) => handleSaveSettings(e, 'White labeling configurations saved successfully.')} style={S.formCard}>
            <h2 style={S.panelTitle}>White Label &amp; Domain Setup</h2>
            <p style={S.panelSubtitle}>Customize the system workspace to match your own brand name and host it on your custom domain URL hostname.</p>

            <div style={S.fieldGroup}>
              <label style={S.fieldLabel}>CUSTOM DOMAIN HOSTNAME</label>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                style={S.input}
                required
              />
            </div>

            <div style={S.fieldGroup}>
              <label style={S.fieldLabel}>LOGIN SCREEN WELCOME HEADER TITLE</label>
              <input
                type="text"
                value={welcomeHeader}
                onChange={(e) => setWelcomeHeader(e.target.value)}
                style={S.input}
                required
              />
            </div>

            {/* Checkbox block */}
            <div style={S.fieldGroup}>
              <label style={S.fieldLabel}>BRAND THEME OPTIONS</label>
              <div style={S.brandOptionBox}>
                <span>Hide Hero Logistics branding labels</span>
                <input
                  type="checkbox"
                  checked={hideBrandingLabels}
                  onChange={(e) => setHideBrandingLabels(e.target.checked)}
                  style={S.checkbox}
                />
              </div>
            </div>

            <button type="submit" style={S.submitBtn}>Save White Labeling Setup</button>
          </form>
        );

      case 'niche':
        return (
          <form onSubmit={(e) => handleSaveSettings(e, 'Niche setup saved successfully.')} style={S.formCard}>
            <h2 style={S.panelTitle}>Logistics Niche Configurations</h2>
            <p style={S.panelSubtitle}>Configure active niches. Toggling off a niche hides related fields and tables across all dispatch dashboards.</p>

            <div style={S.hoursRowsContainer}>
              {/* Car Carrying */}
              <div style={S.hoursRow}>
                <div style={{ flex: 1, paddingRight: 10 }}>
                  <h3 style={S.hoursRowTitle}>{nichesState.carCarrying.title}</h3>
                  <p style={{ ...S.hoursRowTime, color: '#94a3b8' }}>{nichesState.carCarrying.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={nichesState.carCarrying.checked}
                  onChange={(e) => setNichesState(prev => ({ ...prev, carCarrying: { ...prev.carCarrying, checked: e.target.checked } }))}
                  style={S.checkbox}
                />
              </div>

              {/* General Freight */}
              <div style={S.hoursRow}>
                <div style={{ flex: 1, paddingRight: 10 }}>
                  <h3 style={S.hoursRowTitle}>{nichesState.generalFreight.title}</h3>
                  <p style={{ ...S.hoursRowTime, color: '#94a3b8' }}>{nichesState.generalFreight.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={nichesState.generalFreight.checked}
                  onChange={(e) => setNichesState(prev => ({ ...prev, generalFreight: { ...prev.generalFreight, checked: e.target.checked } }))}
                  style={S.checkbox}
                />
              </div>

              {/* Dangerous Goods */}
              <div style={S.hoursRow}>
                <div style={{ flex: 1, paddingRight: 10 }}>
                  <h3 style={S.hoursRowTitle}>{nichesState.dangerousGoods.title}</h3>
                  <p style={{ ...S.hoursRowTime, color: '#94a3b8' }}>{nichesState.dangerousGoods.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={nichesState.dangerousGoods.checked}
                  onChange={(e) => setNichesState(prev => ({ ...prev, dangerousGoods: { ...prev.dangerousGoods, checked: e.target.checked } }))}
                  style={S.checkbox}
                />
              </div>
            </div>

            <div style={S.fieldGroup}>
              <label style={S.fieldLabel}>DEFAULT NICHE SELECTION</label>
              <select
                value={defaultNiche}
                onChange={(e) => setDefaultNiche(e.target.value)}
                style={S.select}
              >
                <option value="Car Carrying">Car Carrying</option>
                <option value="General Freight">General Freight</option>
                <option value="Dangerous Goods">Dangerous Goods</option>
              </select>
            </div>

            <button type="submit" style={S.submitBtn}>Save Niche Setup</button>
          </form>
        );

      case 'gps':
        return (
          <div style={S.gridOuterContainer}>
            <div style={S.gpsPanelCard}>
              <h2 style={S.panelTitle}>GPS Providers &amp; ELD Integrations</h2>

              <div style={S.gpsProvidersList}>
                {gpsProviders.map((prov) => (
                  <div key={prov.id} style={S.gpsRow}>
                    <div style={S.gpsRowLeft}>
                      <div style={S.gpsNameHeader}>
                        <h4 style={S.gpsNameText}>{prov.name}</h4>
                        <span
                          style={{
                            ...S.gpsBadge,
                            backgroundColor: prov.badgeColor,
                            color: prov.textColor
                          }}
                        >
                          {prov.status}
                        </span>
                      </div>
                      <p style={S.gpsSubText}>API Key: {prov.apiKey}</p>
                    </div>

                    <div style={S.gpsRowRight}>
                      <button
                        onClick={() => triggerToast(`Editing key credentials for: ${prov.name}`)}
                        style={S.editApiKeyTextBtn}
                      >
                        Edit API Key
                      </button>
                      {prov.status === 'Connected' && (
                        <button
                          onClick={() => triggerToast(`${prov.name} integration link tested successfully.`)}
                          style={S.testLinkBtn}
                        >
                          Test Link
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'accounting':
        return (
          <div style={S.gridOuterContainer}>
            <div style={S.gpsPanelCard}>
              <h2 style={S.panelTitle}>Cloud Accounting Integrations</h2>

              <div style={S.gpsProvidersList}>
                {accountingIntegrations.map((acc) => (
                  <div key={acc.id} style={S.gpsRow}>
                    <div style={S.gpsRowLeft}>
                      <div style={S.gpsNameHeader}>
                        <h4 style={S.gpsNameText}>{acc.name}</h4>
                        <span
                          style={{
                            ...S.gpsBadge,
                            backgroundColor: acc.badgeColor,
                            color: acc.textColor
                          }}
                        >
                          {acc.status}
                        </span>
                      </div>
                      <p style={S.gpsSubText}>Last synced ledger logs: {acc.syncLog}</p>
                    </div>

                    <div style={S.gpsRowRight}>
                      {acc.status === 'Connected' ? (
                        <>
                          <button
                            onClick={() => triggerToast(`${acc.name} synchronization initiated.`)}
                            style={S.syncNowBtn}
                          >
                            Sync Invoices Now
                          </button>
                          <button
                            onClick={() => triggerToast(`Disconnected ${acc.name} ledger.`)}
                            style={S.disconnectBtn}
                          >
                            Disconnect
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => triggerToast(`Redirecting to authentication portal for: ${acc.name}`)}
                          style={S.authLinkBtn}
                        >
                          Authenticate Link
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'templates':
        return (
          <div style={S.gridOuterContainer}>
            <div style={S.gpsPanelCard}>
              <h2 style={S.panelTitle}>System SMS &amp; Email Notification Templates</h2>

              <div style={S.gpsProvidersList}>
                {[
                  {
                    id: 'invReceipt',
                    title: 'Shipper Invoice Receipt Email',
                    type: 'EMAIL',
                    desc: 'Subject: Hero Logistics Invoice [Invoice ID] for [Customer]'
                  },
                  {
                    id: 'jobDispatch',
                    title: 'Driver Job Dispatch SMS',
                    type: 'SMS',
                    desc: 'Body: Hero Alert: New Job [Load ID] assigned to you. Report to [Pickup].'
                  },
                  {
                    id: 'podConfirm',
                    title: 'POD Confirmation Email',
                    type: 'EMAIL',
                    desc: 'Subject: Hero Proof-of-Delivery: Job [Load ID] complete.'
                  }
                ].map((temp) => (
                  <div key={temp.id} style={S.gpsRow}>
                    <div style={S.gpsRowLeft}>
                      <div style={S.gpsNameHeader}>
                        <h4 style={S.gpsNameText}>{temp.title}</h4>
                      </div>
                      <p style={S.gpsSubText}>{temp.desc}</p>
                    </div>

                    <div style={S.gpsRowRight}>
                      <span style={S.templateTypeBadge}>{temp.type}</span>
                      <button
                        onClick={() => triggerToast(`Opening template editor for: ${temp.title}`)}
                        style={S.editApiKeyTextBtn}
                      >
                        Edit Template
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'logs':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={S.tablePanelCard}>
              {/* Header controls row */}
              <div style={S.leftHeader}>
                <div style={S.leftHeaderLeft}>
                  <h2 style={S.leftTitle}>Company SaaS Security Audit Logs</h2>
                  {/* Selected count with CSV Download */}
                  {selectedLogIds.length > 0 && (
                    <div style={S.selectedActions}>
                      <span style={S.selectedText}>{selectedLogIds.length} SELECTED</span>
                      <button onClick={handleExportLogsCSV} style={S.csvBtn}>
                        <DownloadIcon />
                        CSV Export
                      </button>
                    </div>
                  )}
                </div>

                <div style={S.leftHeaderRight}>
                  {/* Density toggle buttons */}
                  <div style={S.densityWrapper}>
                    {['COMPACT', 'DEFAULT', 'RELAXED'].map((d) => (
                      <button
                        key={d}
                        onClick={() => setLogDensity(d)}
                        style={{
                          ...S.densityBtn,
                          backgroundColor: logDensity === d ? '#FFCC00' : 'transparent',
                          color: logDensity === d ? '#000000' : '#64748b',
                          fontWeight: logDensity === d ? '800' : '600'
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  {/* Columns Selector Button */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setShowLogColsDropdown(prev => !prev)}
                      style={{
                        ...S.columnsBtn,
                        borderColor: showLogColsDropdown ? '#ffcc00' : '#cbd5e1',
                        boxShadow: showLogColsDropdown ? '0 0 0 2px rgba(255, 204, 0, 0.2)' : 'none'
                      }}
                    >
                      <GearIcon />
                      COLUMNS
                    </button>

                    {/* Dropdown for Columns Visibility */}
                    {showLogColsDropdown && (
                      <div className="columns-dropdown-panel" style={S.dropdownMenu}>
                        <div style={S.dropdownHeader}>COLUMN VISIBILITY</div>

                        <label style={S.dropdownItem}>
                          <input
                            type="checkbox"
                            checked={visibleLogCols.timestamp}
                            onChange={() => setVisibleLogCols(prev => ({ ...prev, timestamp: !prev.timestamp }))}
                            style={S.dropdownCheckbox}
                          />
                          Timestamp
                        </label>

                        <label style={S.dropdownItem}>
                          <input
                            type="checkbox"
                            checked={visibleLogCols.userNode}
                            onChange={() => setVisibleLogCols(prev => ({ ...prev, userNode: !prev.userNode }))}
                            style={S.dropdownCheckbox}
                          />
                          User Node
                        </label>

                        <label style={S.dropdownItem}>
                          <input
                            type="checkbox"
                            checked={visibleLogCols.event}
                            onChange={() => setVisibleLogCols(prev => ({ ...prev, event: !prev.event }))}
                            style={S.dropdownCheckbox}
                          />
                          Event Action Description
                        </label>

                        <label style={S.dropdownItem}>
                          <input
                            type="checkbox"
                            checked={visibleLogCols.ipAddress}
                            onChange={() => setVisibleLogCols(prev => ({ ...prev, ipAddress: !prev.ipAddress }))}
                            style={S.dropdownCheckbox}
                          />
                          IP Address
                        </label>

                        <label style={S.dropdownItem}>
                          <input
                            type="checkbox"
                            checked={visibleLogCols.authStatus}
                            onChange={() => setVisibleLogCols(prev => ({ ...prev, authStatus: !prev.authStatus }))}
                            style={S.dropdownCheckbox}
                          />
                          Auth Status
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Table Container */}
              <div style={S.tableWrapper}>
                <table style={S.table}>
                  <thead style={S.thead}>
                    <tr>
                      <th style={{ ...S.th, ...logPadding, width: 40 }}>
                        <CustomCheckbox
                          checked={auditLogs.length > 0 && selectedLogIds.length === auditLogs.length}
                          onChange={handleSelectAllLogs}
                        />
                      </th>
                      {visibleLogCols.timestamp && <th style={{ ...S.th, ...logPadding }}>TIMESTAMP</th>}
                      {visibleLogCols.userNode && <th style={{ ...S.th, ...logPadding }}>USER NODE</th>}
                      {visibleLogCols.event && <th style={{ ...S.th, ...logPadding }}>EVENT ACTION DESCRIPTION</th>}
                      {visibleLogCols.ipAddress && <th style={{ ...S.th, ...logPadding }}>IP ADDRESS</th>}
                      {visibleLogCols.authStatus && <th style={{ ...S.th, ...logPadding }}>AUTH STATUS</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => {
                      const isChecked = selectedLogIds.includes(log.id);
                      return (
                        <tr
                          key={log.id}
                          style={{
                            ...S.tr,
                            backgroundColor: isChecked ? '#fffbeb' : '#ffffff',
                            borderBottom: '1px solid #f1f5f9'
                          }}
                        >
                          <td style={{ ...S.td, ...logPadding, width: 40 }}>
                            <CustomCheckbox
                              checked={isChecked}
                              onChange={() => handleSelectLog(log.id)}
                            />
                          </td>
                          {visibleLogCols.timestamp && (
                            <td style={{ ...S.td, ...logPadding, color: '#64748b' }}>
                              {log.timestamp}
                            </td>
                          )}
                          {visibleLogCols.userNode && (
                            <td style={{ ...S.td, ...logPadding, fontWeight: '700', color: '#0f172a' }}>
                              {log.userNode}
                            </td>
                          )}
                          {visibleLogCols.event && (
                            <td style={{ ...S.td, ...logPadding, color: '#334155', fontWeight: '500' }}>
                              {log.event}
                            </td>
                          )}
                          {visibleLogCols.ipAddress && (
                            <td style={{ ...S.td, ...logPadding, color: '#64748b' }}>
                              {log.ipAddress}
                            </td>
                          )}
                          {visibleLogCols.authStatus && (
                            <td style={{ ...S.td, ...logPadding }}>
                              <span style={S.successStatusRow}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10" fill="#ecfdf5"></circle>
                                  <polyline points="16 9 11 14 8 11"></polyline>
                                </svg>
                                Success
                              </span>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="customer-dashboard" style={{ display: 'flex', flexDirection: 'column', boxSizing: 'border-box', padding: '16px 20px', width: '100%', maxWidth: 'none', minHeight: 'calc(100vh - 125px)' }}>
      {/* Header Panel */}
      <div className="customer-header-container" style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>⚙️</span>
          <div>
            <h1 className="customer-title" style={{ fontSize: '20px', fontWeight: '800' }}>Settings</h1>
            <p className="customer-subtitle" style={{ fontSize: '12.5px', marginTop: '2px' }}>Configure company defaults, connect ELD/accounting APIs, and view security audit registries.</p>
          </div>
        </div>
        <button onClick={() => setShowSupportModal(true)} className="contact-support-btn" style={{ fontSize: '12px', padding: '6px 14px' }}>Contact Support</button>
      </div>

      {/* Tabs Navigation Row */}
      <div style={S.tabsRow}>
        {[
          { id: 'profile', name: 'Company Profile', icon: (a) => <ProfileIcon active={a} /> },
          { id: 'branding', name: 'Branding & Theme', icon: (a) => <BrandingIcon active={a} /> },
          { id: 'hours', name: 'Business Hours', icon: (a) => <HoursIcon active={a} /> },
          { id: 'billing', name: 'Billing & Plans', icon: (a) => <BillingIcon active={a} /> },
          { id: 'whiteLabel', name: 'White Labeling', icon: (a) => <WhiteLabelIcon active={a} /> },
          { id: 'niche', name: 'Niche Configuration', icon: (a) => <NicheIcon active={a} /> },
          { id: 'gps', name: 'GPS Providers', icon: (a) => <GpsIcon active={a} /> },
          { id: 'accounting', name: 'Accounting Integration', icon: (a) => <IntegrationIcon active={a} /> },
          { id: 'templates', name: 'Notification Templates', icon: (a) => <TemplatesIcon active={a} /> },
          { id: 'logs', name: 'System Audit Logs', icon: (a) => <LogsIcon active={a} /> }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...S.tabItem,
                color: isActive ? '#b45309' : '#64748b',
                borderBottom: isActive ? '2px solid #FFCC00' : '2px solid transparent'
              }}
            >
              {tab.icon(isActive)}
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Tab panel main area */}
      <div style={S.panelContainer}>
        {renderTabContent()}
      </div>

      {/* Support Drawer Modal */}
      {showSupportModal && (
        <div style={S.modalOverlay} onClick={() => setShowSupportModal(false)}>
          <div style={S.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <h2 style={S.modalTitle}>Shipper Help Desk &amp; Ticket Center</h2>
              <button onClick={() => setShowSupportModal(false)} style={S.closeBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={S.modalBody}>
                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>SUBJECT HEADING</label>
                  <input
                    type="text"
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                    placeholder="e.g. Settings system inquiry"
                    style={S.input}
                    required
                  />
                </div>

                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>PROBLEM DESCRIPTION</label>
                  <textarea
                    value={supportDescription}
                    onChange={(e) => setSupportDescription(e.target.value)}
                    placeholder="Please provide specific details..."
                    style={S.textarea}
                    required
                  />
                </div>
              </div>

              <div style={S.modalFooter}>
                <button type="button" onClick={() => setShowSupportModal(false)} style={S.btnCancel}>Cancel</button>
                <button type="submit" style={S.btnSubmit}>Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast popup */}
      {toast && (
        <div style={S.toastContainer}>
          <div style={S.toastIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span style={S.toastText}>{toast}</span>
          <button onClick={() => setToast(null)} style={S.toastCloseBtn}>✕</button>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

/* Styles Object */
const S = {
  tabsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: 4,
    flexShrink: 0
  },
  tabItem: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 12.5,
    fontWeight: '700',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all 0.15s ease',
    outline: 'none',
    boxSizing: 'border-box'
  },
  panelContainer: {
    flex: 1,
    marginTop: 16,
    boxSizing: 'border-box'
  },
  formCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '24px 28px',
    maxWidth: 520,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    boxSizing: 'border-box',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  gpsPanelCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '24px 28px',
    maxWidth: 'none',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    boxSizing: 'border-box',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  tablePanelCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '16px 20px',
    maxWidth: 'none',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    boxSizing: 'border-box',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  gridOuterContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  panelTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  panelSubtitle: {
    fontSize: 11,
    color: '#64748b',
    margin: '0 0 8px 0',
    lineHeight: '1.45',
    fontWeight: '500'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '0.5px'
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    fontSize: 13,
    color: '#334155',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease'
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    fontSize: 13,
    color: '#334155',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff'
  },
  textarea: {
    width: '100%',
    height: 100,
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    fontSize: 13,
    color: '#334155',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'none',
    transition: 'border-color 0.15s ease'
  },
  checkbox: {
    cursor: 'pointer',
    accentColor: '#0066cc',
    width: 16,
    height: 16
  },
  submitBtn: {
    marginTop: 10,
    backgroundColor: '#FFCC00',
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    padding: '10px 16px',
    fontSize: 13,
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
    textAlign: 'center'
  },
  // Company Profile specific styles
  membershipCard: {
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: 14,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    boxSizing: 'border-box'
  },
  membershipHeader: {
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: 6
  },
  membershipLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '0.5px'
  },
  membershipBody: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  membershipPlanName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  membershipSubtext: {
    fontSize: 10,
    color: '#64748b',
    margin: '4px 0 0 0',
    fontWeight: '500'
  },
  membershipStatus: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f172a'
  },
  // Branding & Theme specific styles
  colorPickerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  colorCirclesRow: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap'
  },
  colorCircleWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    cursor: 'pointer'
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    transition: 'all 0.15s ease'
  },
  colorCircleName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b'
  },
  uploadSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  uploadBox: {
    border: '1.5px dashed #cbd5e1',
    borderRadius: 12,
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: '#f8fafc',
    transition: 'all 0.15s ease',
    boxSizing: 'border-box'
  },
  uploadBoxTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155'
  },
  uploadBoxSub: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500'
  },
  // Business Hours specific styles
  hoursRowsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 10
  },
  hoursRow: {
    backgroundColor: '#475569', // Dark grey background like mockup
    borderRadius: 8,
    padding: '12px 18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#ffffff',
    boxSizing: 'border-box',
    flexWrap: 'wrap',
    gap: 10
  },
  hoursRowTitle: {
    fontSize: 13,
    fontWeight: '800',
    margin: 0
  },
  hoursRowTime: {
    fontSize: 10,
    color: '#cbd5e1',
    margin: '4px 0 0 0',
    fontWeight: '600',
    lineHeight: '1.4'
  },
  hoursRowRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 14
  },
  hoursRowStatus: {
    fontSize: 11,
    fontWeight: '800'
  },
  // Billing specific styles
  billingBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10b981',
    backgroundColor: '#ecfdf5',
    padding: '4px 12px',
    borderRadius: 20
  },
  billingSummaryRow: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap'
  },
  billingSummaryBox: {
    flex: 1,
    minWidth: 200,
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    boxSizing: 'border-box'
  },
  billingCardRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  visaLogo: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    padding: '8px 12px',
    fontSize: 13,
    fontWeight: '800',
    color: '#1a1f71',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
  },
  billingCardText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  billingCardSub: {
    fontSize: 10,
    color: '#64748b',
    margin: '2px 0 0 0'
  },
  updateCardLink: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#b45309',
    cursor: 'pointer',
    alignSelf: 'flex-start'
  },
  usageItemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },
  usageItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 11.5
  },
  usageLabel: {
    color: '#64748b',
    fontWeight: '600'
  },
  usageVal: {
    color: '#0f172a',
    fontWeight: '800'
  },
  invoicesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  invoiceRow: {
    backgroundColor: '#7b8b9a',
    borderRadius: 12,
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#ffffff',
    boxSizing: 'border-box',
    flexWrap: 'wrap',
    gap: 10
  },
  invoiceRowTitle: {
    fontSize: 13,
    fontWeight: '800',
    margin: 0
  },
  invoiceRowSub: {
    fontSize: 10,
    color: '#cbd5e1',
    margin: '4px 0 0 0',
    fontWeight: '600'
  },
  invoiceRowRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap'
  },
  invoicePaidText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff'
  },
  invoicePdfBtn: {
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 16px',
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '700',
    cursor: 'pointer',
    outline: 'none',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  // White Labeling specific styles
  brandOptionBox: {
    backgroundColor: '#475569',
    borderRadius: 8,
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
    boxSizing: 'border-box'
  },
  // GPS & Integrations general list styles
  gpsProvidersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 10
  },
  gpsRow: {
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '12px 18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
    flexWrap: 'wrap',
    gap: 10
  },
  gpsRowLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  gpsNameHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  gpsNameText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  gpsBadge: {
    fontSize: 9.5,
    fontWeight: '800',
    padding: '2px 8px',
    borderRadius: 12
  },
  gpsSubText: {
    fontSize: 10.5,
    color: '#64748b',
    fontWeight: '600',
    margin: 0
  },
  gpsRowRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap'
  },
  editApiKeyTextBtn: {
    background: 'none',
    border: 'none',
    color: '#475569',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: 11,
    padding: 0
  },
  testLinkBtn: {
    backgroundColor: '#FFCC00',
    border: 'none',
    borderRadius: 6,
    padding: '4px 12px',
    fontSize: 11,
    fontWeight: '800',
    cursor: 'pointer',
    color: '#000000',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  // Accounting row styles
  syncNowBtn: {
    backgroundColor: '#FFCC00',
    border: 'none',
    borderRadius: 6,
    padding: '4px 12px',
    fontSize: 11,
    fontWeight: '800',
    cursor: 'pointer',
    color: '#000000'
  },
  disconnectBtn: {
    backgroundColor: '#fee2e2',
    border: 'none',
    borderRadius: 6,
    padding: '4px 12px',
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '800',
    cursor: 'pointer'
  },
  authLinkBtn: {
    backgroundColor: '#FFCC00',
    border: 'none',
    borderRadius: 6,
    padding: '4px 12px',
    fontSize: 11,
    fontWeight: '800',
    cursor: 'pointer',
    color: '#000000'
  },
  templateTypeBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    padding: '2px 6px',
    borderRadius: 4,
    marginRight: 6
  },
  // Audit Logs Table specific styles
  leftHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    flexShrink: 0
  },
  leftHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap'
  },
  leftTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  selectedActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fffbeb',
    border: '1px solid #fde047',
    borderRadius: 8,
    padding: '4px 10px',
    animation: 'slideIn 0.2s ease'
  },
  selectedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#b45309'
  },
  csvBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #fde047',
    borderRadius: 6,
    padding: '3px 10px',
    color: '#b45309',
    fontSize: 10.5,
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    outline: 'none',
    boxSizing: 'border-box'
  },
  leftHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap'
  },
  densityWrapper: {
    display: 'flex',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 2
  },
  densityBtn: {
    border: 'none',
    borderRadius: 6,
    padding: '4px 10px',
    fontSize: 9.5,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none'
  },
  columnsBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    padding: '5px 12px',
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.15s ease'
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    marginTop: 6,
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
    padding: 12,
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    minWidth: 160,
    boxSizing: 'border-box'
  },
  dropdownHeader: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748b',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: 6,
    marginBottom: 4,
    letterSpacing: '0.5px'
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 11.5,
    color: '#334155',
    fontWeight: '600',
    cursor: 'pointer',
    userSelect: 'none'
  },
  dropdownCheckbox: {
    cursor: 'pointer',
    accentColor: '#0066cc',
    width: 14,
    height: 14
  },
  tableWrapper: {
    flex: 1,
    overflowY: 'auto',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    backgroundColor: '#ffffff'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  thead: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 1
  },
  th: {
    fontWeight: '700',
    color: '#475569',
    fontSize: 11,
    letterSpacing: '0.2px'
  },
  tr: {
    transition: 'background-color 0.15s ease'
  },
  td: {
    color: '#334155',
    verticalAlign: 'middle',
    boxSizing: 'border-box'
  },
  successStatusRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    color: '#1e293b',
    fontWeight: '600'
  },
  // Modal Drawer styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 1000,
    fontFamily: "'Outfit', 'Inter', sans-serif"
  },
  modalContent: {
    backgroundColor: '#ffffff',
    height: '100%',
    width: '100%',
    maxWidth: 450,
    boxShadow: '-10px 0 25px -5px rgba(0, 0, 0, 0.1), -5px 0 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    borderLeft: '1px solid #e2e8f0',
    borderRadius: '16px 0 0 16px',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  modalHeader: {
    padding: '24px 28px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background-color 0.15s ease'
  },
  modalBody: {
    padding: '28px',
    flex: 1
  },
  modalFooter: {
    padding: '20px 28px 28px 28px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    borderTop: '1px solid #f1f5f9'
  },
  btnCancel: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    border: '1px solid #cbd5e1',
    borderRadius: 30,
    padding: '10px 24px',
    fontSize: 13,
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  btnSubmit: {
    backgroundColor: '#FFCC00',
    color: '#000000',
    border: 'none',
    borderRadius: 30,
    padding: '10px 28px',
    fontSize: 13,
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(255, 204, 0, 0.35)',
    transition: 'all 0.15s ease'
  },
  // Toast styles
  toastContainer: {
    position: 'fixed',
    bottom: 40,
    right: 32,
    backgroundColor: '#ecfdf5',
    border: '1px solid #a7f3d0',
    borderRadius: 12,
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    zIndex: 1100,
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
    maxWidth: 420,
    animation: 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  toastIcon: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    width: 22,
    height: 22,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  toastText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#065f46',
    flex: 1
  },
  toastCloseBtn: {
    background: 'none',
    border: 'none',
    fontSize: 16,
    color: '#64748b',
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1
  }
};

export default CustomerSettings;
