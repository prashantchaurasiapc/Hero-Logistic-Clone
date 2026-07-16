import React, { useState, useEffect } from 'react';
import { 
  Shield, Plus, Search, CheckCircle, X, ChevronDown, ChevronRight, 
  Download, Filter, Settings, FileText, ArrowRight, Trash2
} from 'lucide-react';

export default function FeatureAccess() {
  const [activeTab, setActiveTab] = useState('Dynamic Features Matrix');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState('');

  // Configure / Licensing Policy Drawer State
  const [showConfigureDrawer, setShowConfigureDrawer] = useState(false);
  const [configureFeature, setConfigureFeature] = useState(null);
  const [configureTab, setConfigureTab] = useState('Overview');
  const [showBumpForm, setShowBumpForm] = useState(true);

  // Modal Wizard State
  const [modalStep, setModalStep] = useState(1);
  const [newFeatName, setNewFeatName] = useState('');
  const [newFeatId, setNewFeatId] = useState('');
  const [newFeatDesc, setNewFeatDesc] = useState('');
  const [newFeatCategory, setNewFeatCategory] = useState('Platform');
  const [newFeatLicensing, setNewFeatLicensing] = useState('Core');

  // Group Accordion States (Open by default, Billing closed by default)
  const [accordions, setAccordions] = useState({
    Platform: true,
    Operations: true,
    Fleet: true,
    Drivers: true,
    Dispatch: true,
    Loads: true,
    Administration: true,
    API: true,
    'Developer Tools': true,
    Billing: false,
    CRM: true,
    'Customer Portal': true,
    Tracking: true
  });

  // Features list state grouped or categorized (exactly matching all screenshots)
  const [features, setFeatures] = useState([
    { 
      id: 'feat-base-shell', 
      name: 'Admin Panel Base Shell', 
      version: 'v1.0.0', 
      desc: 'Global navigation, theme styling engines, and...', 
      fullDesc: 'Global navigation, theme styling engines, and sidebar layouts.',
      category: 'Platform', 
      requiredModules: 'Platform Base',
      apiLoad: '120,000 requests',
      storage: '0.5 GB',
      footprint: 'Low',
      plans: { Starter: true, Pro: true, Enterprise: true, Custom: true }, 
      addon: 'No', 
      licensing: 'Core', 
      status: 'Enabled', 
      usage: 1420, 
      companies: 5 
    },
    { 
      id: 'feat-rbac', 
      name: 'Role-Based Access Controllers', 
      version: 'v1.0.0', 
      desc: 'Custom operator/dispatcher permissions, adm...', 
      fullDesc: 'Custom operator/dispatcher permissions, admin role matrices, and access policies.',
      category: 'Platform', 
      requiredModules: 'Platform Base',
      apiLoad: '85,000 requests',
      storage: '0.3 GB',
      footprint: 'Low',
      plans: { Starter: true, Pro: true, Enterprise: true, Custom: true }, 
      addon: 'No', 
      licensing: 'Core', 
      status: 'Enabled', 
      usage: 1500, 
      companies: 5 
    },
    { 
      id: 'feat-ops-map', 
      name: 'Interactive Operations Map', 
      version: 'v1.2.0', 
      desc: 'Real-time coordinate plotting for routes, deliv...', 
      fullDesc: 'Real-time coordinate plotting for routes, delivery stops, and fleet movement visualization.',
      dependsOn: 'feat-gps-pings',
      category: 'Operations', 
      requiredModules: 'GPS Tracking',
      apiLoad: '210,000 requests',
      storage: '2.1 GB',
      footprint: 'Medium',
      plans: { Starter: true, Pro: true, Enterprise: true, Custom: true }, 
      addon: 'No', 
      licensing: 'Core', 
      status: 'Enabled', 
      usage: 940, 
      companies: 4 
    },
    { 
      id: 'feat-fleet-logs', 
      name: 'Fleet Asset Maintenance Logs', 
      version: 'v1.0.0', 
      desc: 'Vehicles, trailers, registrations, inspections an...', 
      fullDesc: 'Vehicles, trailers, registrations, inspections and maintenance scheduling logs.',
      category: 'Fleet', 
      requiredModules: 'Fleet Management',
      apiLoad: '95,000 requests',
      storage: '4.8 GB',
      footprint: 'Low',
      plans: { Starter: true, Pro: true, Enterprise: true, Custom: true }, 
      addon: 'No', 
      licensing: 'Core', 
      status: 'Enabled', 
      usage: 880, 
      companies: 4 
    },
    { 
      id: 'feat-drivers-eld', 
      name: 'ELD Driver Log Profiles', 
      version: 'v1.1.0', 
      desc: 'Compliance, training, licenses, drug screening...', 
      fullDesc: 'Compliance, training, licenses, drug screening, and ELD trainer logs.',
      dependsOn: 'feat-fleet-logs',
      category: 'Drivers', 
      requiredModules: 'Driver Management',
      apiLoad: '75,000 requests',
      storage: '18.5 GB',
      footprint: 'Low',
      plans: { Starter: true, Pro: true, Enterprise: true, Custom: true }, 
      addon: 'No', 
      licensing: 'Core', 
      status: 'Enabled', 
      usage: 1100, 
      companies: 5 
    },
    { 
      id: 'feat-dispatch-board', 
      name: 'Dispatch Scheduling Board', 
      version: 'v1.3.0', 
      desc: 'Drag & drop load assignments, driver scheduli...', 
      fullDesc: 'Drag & drop load assignments, driver scheduling, and live dispatch board.',
      dependsOn: 'feat-drivers-eld',
      category: 'Dispatch', 
      requiredModules: 'Dispatch Core',
      apiLoad: '140,000 requests',
      storage: '3.2 GB',
      footprint: 'Medium',
      plans: { Starter: true, Pro: true, Enterprise: true, Custom: true }, 
      addon: 'No', 
      licensing: 'Core', 
      status: 'Enabled', 
      usage: 780, 
      companies: 5 
    },
    { 
      id: 'feat-load-registry', 
      name: 'Load Booking Registry', 
      version: 'v1.0.0', 
      desc: 'Loads registry, route confirmation logs, BOL, a...', 
      fullDesc: 'Loads registry, route confirmation logs, BOL, and carrier contract storage.',
      category: 'Loads', 
      requiredModules: 'Load Management',
      apiLoad: '160,000 requests',
      storage: '5.5 GB',
      footprint: 'Low',
      plans: { Starter: true, Pro: true, Enterprise: true, Custom: true }, 
      addon: 'No', 
      licensing: 'Core', 
      status: 'Enabled', 
      usage: 1200, 
      companies: 5 
    },
    { 
      id: 'feat-white-labeling', 
      name: 'White-Label Brand Theme Configurations', 
      version: 'v1.0.0', 
      desc: 'Admin styling settings parameters (branded p...', 
      fullDesc: 'Admin styling settings parameters for branded portal themes and custom logo integrations.',
      category: 'Administration', 
      requiredModules: 'Theme Engine',
      apiLoad: '30,000 requests',
      storage: '1.2 GB',
      footprint: 'Low',
      plans: { Starter: false, Pro: false, Enterprise: true, Custom: true }, 
      addon: 'No', 
      licensing: 'Premium', 
      status: 'Enabled', 
      usage: 220, 
      companies: 3 
    },
    { 
      id: 'feat-developer-sandbox', 
      name: 'Developer Sandbox Credentials Access', 
      version: 'v1.0.0', 
      desc: 'Generate developer credentials sandbox API k...', 
      fullDesc: 'Generate developer credentials, sandbox API keys, and test environment access.',
      category: 'API', 
      requiredModules: 'API Gateway',
      apiLoad: '50,000 requests',
      storage: '0.8 GB',
      footprint: 'Low',
      plans: { Starter: false, Pro: false, Enterprise: true, Custom: true }, 
      addon: 'No', 
      licensing: 'Enterprise Only', 
      status: 'Enabled', 
      usage: 150, 
      companies: 1 
    },
    { 
      id: 'feat-dev-debug', 
      name: 'Live Application Event Debug Logs Logger', 
      version: 'v1.0.0', 
      desc: 'Developer debug console logging REST API ca...', 
      fullDesc: 'Developer debug console logging, REST API call tracing, and event pipeline monitoring.',
      dependsOn: 'feat-api-gateway',
      category: 'Developer Tools', 
      requiredModules: 'API Gateway',
      apiLoad: '25,000 requests',
      storage: '2.4 GB',
      footprint: 'Low',
      plans: { Starter: false, Pro: false, Enterprise: true, Custom: true }, 
      addon: 'No', 
      licensing: 'Enterprise Only', 
      status: 'Enabled', 
      usage: 130, 
      companies: 1 
    },
    { 
      id: 'feat-billing-ledger', 
      name: 'Billing Ledger Gateway', 
      version: 'v1.0.0', 
      desc: 'Financial invoices processing queues.', 
      fullDesc: 'Financial invoices processing queues, payment gateway webhooks, and ledger reconciliation.',
      category: 'Billing', 
      requiredModules: 'Billing Engine',
      apiLoad: '90,000 requests',
      storage: '3.6 GB',
      footprint: 'Low',
      plans: { Starter: true, Pro: true, Enterprise: true, Custom: true }, 
      addon: 'No', 
      licensing: 'Core', 
      status: 'Enabled', 
      usage: 710, 
      companies: 5 
    },
    { 
      id: 'feat-crm-leads', 
      name: 'CRM Leads Sales Tracker', 
      version: 'v1.0.0', 
      desc: 'Prospect trackers, conversions trackers, and d...', 
      fullDesc: 'Prospect trackers, conversion pipelines, deal logs and sales performance dashboards.',
      category: 'CRM', 
      requiredModules: 'CRM Engine',
      apiLoad: '45,000 requests',
      storage: '1.8 GB',
      footprint: 'Low',
      plans: { Starter: true, Pro: true, Enterprise: true, Custom: true }, 
      addon: 'No', 
      licensing: 'Core', 
      status: 'Enabled', 
      usage: 380, 
      companies: 5 
    },
    { 
      id: 'feat-cust-portal', 
      name: 'Shipper Customer Gateway', 
      version: 'v1.1.0', 
      desc: 'Customer load booking screens, shipment trac...', 
      fullDesc: 'Customer load booking screens, shipment tracking, and self-service support portal.',
      category: 'Customer Portal', 
      requiredModules: 'Portal Engine',
      apiLoad: '65,000 requests',
      storage: '2.9 GB',
      footprint: 'Low',
      plans: { Starter: false, Pro: true, Enterprise: true, Custom: true }, 
      addon: 'No', 
      licensing: 'Premium', 
      status: 'Enabled', 
      usage: 490, 
      companies: 4 
    },
    { 
      id: 'feat-tracking-gateway', 
      name: 'Real-time GPS Tracking Gateway', 
      version: 'v1.0.0', 
      desc: 'High-frequency GPS ping coordinate pipelines.', 
      fullDesc: 'High-frequency GPS ping coordinate pipelines, geofencing alerts, and live map feeds.',
      category: 'Tracking', 
      requiredModules: 'GPS Engine',
      apiLoad: '350,000 requests',
      storage: '7.2 GB',
      footprint: 'Medium',
      plans: { Starter: true, Pro: true, Enterprise: true, Custom: true }, 
      addon: 'No', 
      licensing: 'Core', 
      status: 'Enabled', 
      usage: 1800, 
      companies: 5 
    }
  ]);

  // Audit Center logs
  const [auditLogs, setAuditLogs] = useState([
    { 
      action: 'Feature Enabled', 
      details: 'Admin Panel Base Shell enabled for all plans.', 
      reason: 'Core module deployment', 
      timestamp: '06/20/2026, 09:00:00 AM', 
      operator: 'System Root', 
      ip: '192.168.1.1' 
    },
    { 
      action: 'Feature Updated', 
      details: 'Operations Map upgraded to v1.2.0.', 
      reason: 'Performance upgrade', 
      timestamp: '06/22/2026, 11:30:00 AM', 
      operator: 'Alex W.', 
      ip: '192.168.1.1' 
    },
    { 
      action: 'Company Override Created', 
      details: 'Manual override enabled for Swift Cargo Express on Payroll module.', 
      reason: 'Partner promotion extension', 
      timestamp: '06/24/2026, 02:45:00 PM', 
      operator: 'Super Admin', 
      ip: '192.168.1.5' 
    }
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

  const handleTogglePlan = (id, plan) => {
    setFeatures(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          plans: { ...f.plans, [plan]: !f.plans[plan] }
        };
      }
      return f;
    }));
    showNotification(`Plan mapping updated for ${id}.`);
  };

  const handleStatusChange = (id, newStatus) => {
    setFeatures(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
    showNotification(`Feature gate "${id}" set to ${newStatus}.`);
  };

  const handleAccordionToggle = (category) => {
    setAccordions(prev => ({ ...prev, [category]: !prev[category] }));
  };

  // Actions Callbacks (Configure, Clone, Delete)
  const handleConfigure = (feat) => {
    setConfigureFeature(feat);
    setConfigureTab('Overview');
    setShowConfigureDrawer(true);
  };

  const handleClone = (feat) => {
    const cloneId = `${feat.id}-clone-${Math.floor(Math.random() * 1000)}`;
    const clonedFeature = {
      ...feat,
      id: cloneId,
      name: `${feat.name} (Clone)`,
      usage: 0,
      companies: 0
    };
    setFeatures(prev => [...prev, clonedFeature]);
    
    // Add audit log
    const newAudit = {
      action: 'Feature Cloned',
      details: `Feature gate ${feat.name} cloned to ${clonedFeature.name}.`,
      reason: 'Feature replication',
      timestamp: new Date().toLocaleString(),
      operator: 'Super Admin',
      ip: '192.168.1.5'
    };
    setAuditLogs([newAudit, ...auditLogs]);
    showNotification(`Cloned "${feat.name}" successfully!`);
  };

  const handleDelete = (featId, featName) => {
    if (window.confirm(`Are you sure you want to delete feature gate "${featName}"?`)) {
      setFeatures(prev => prev.filter(f => f.id !== featId));
      // Add audit log
      const newAudit = {
        action: 'Feature Deleted',
        details: `Feature gate ${featName} (${featId}) permanently removed.`,
        reason: 'Deprecation cleanup',
        timestamp: new Date().toLocaleString(),
        operator: 'Super Admin',
        ip: '192.168.1.5'
      };
      setAuditLogs([newAudit, ...auditLogs]);
      showNotification(`Deleted "${featName}".`);
    }
  };

  const handleCreateFeatureSubmit = (e) => {
    e.preventDefault();
    if (!newFeatName || !newFeatId) {
      showNotification('Feature Name and ID are required.');
      return;
    }
    const cleanId = newFeatId.startsWith('feat-') ? newFeatId : `feat-${newFeatId}`;
    const newFeature = {
      id: cleanId,
      name: newFeatName,
      version: 'v1.0.0',
      desc: newFeatDesc || 'No description provided.',
      category: newFeatCategory,
      plans: { Starter: true, Pro: true, Enterprise: true, Custom: true },
      addon: 'No',
      licensing: newFeatLicensing,
      status: 'Enabled',
      usage: 0,
      companies: 0
    };
    setFeatures([...features, newFeature]);
    
    // Add audit log
    const newAudit = {
      action: 'Feature Created',
      details: `Feature gate ${newFeature.name} registered.`,
      reason: 'Manual registration wizard',
      timestamp: new Date().toLocaleString(),
      operator: 'Super Admin',
      ip: '192.168.1.5'
    };
    setAuditLogs([newAudit, ...auditLogs]);

    setShowAddModal(false);
    setNewFeatName('');
    setNewFeatId('');
    setNewFeatDesc('');
    setModalStep(1);
    showNotification(`Feature "${newFeatName}" created successfully.`);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Licensing', 'Status', 'Usage', 'Companies'];
    const rows = features.map(f => [f.id, f.name, f.category, f.licensing, f.status, f.usage, f.companies]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'feature_access_matrix.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Feature matrix exported.');
  };

  const handleExportAudits = () => {
    const headers = ['Action Type', 'Audit Details', 'Reason', 'Timestamp', 'Operator', 'IP Address'];
    const rows = auditLogs.map(log => [log.action, log.details, log.reason, log.timestamp, log.operator, log.ip]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'feature_modification_audits.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Audit modification logs exported.');
  };

  // Filter features based on search query
  const filteredFeatures = features.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group names array
  const categoriesList = [
    'Platform', 'Operations', 'Fleet', 'Drivers', 'Dispatch', 'Loads',
    'Administration', 'API', 'Developer Tools', 'Billing', 
    'CRM', 'Customer Portal', 'Tracking'
  ];

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 space-y-6 overflow-y-auto w-full text-left font-sans relative custom-scrollbar">
      
      {/* Scrollbar CSS Overrides (using standard light blue/lavender grey for thumb, transparent track) */}
      <style>{`
        /* Webkit scrollbar stylings */
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

        /* Generic scrollbar for cross browser */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
      `}</style>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg border border-slate-700/50 z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-5 bg-white -mx-6 px-6 -mt-6 pt-6">
        <div>
          <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
            Super Admin <span className="text-slate-300">•</span> Feature Access
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Configure global licensing rules, audit tenant margins, and resolve support tickets.
          </p>
        </div>
        <button 
          onClick={() => {
            const dataReport = `Total Features: ${features.length}\nActive: ${features.filter(f => f.status === 'Enabled').length}`;
            alert(`SaaS Feature Access Matrix telemetry:\n\n${dataReport}`);
            showNotification('Access Report compiled.');
          }}
          className="border border-amber-200 hover:bg-amber-50/30 text-yellow-600 bg-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          Export Report
        </button>
      </div>

      {/* 8 Metric KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total Licensed Features</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">24</span>
          </div>
          <span className="text-[10px] font-bold text-[#10B981] mt-2 block">+2 templates added today</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Active Features</span>
            <span className="text-2xl font-black text-[#10B981] block mt-1.5">24</span>
          </div>
          <span className="text-[10px] font-bold text-slate-455 mt-2 block">0 features inactive</span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Premium Tier Modules</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">6</span>
          </div>
          <span className="text-[10px] font-bold text-amber-555 mt-2 block">3 Enterprise only</span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Premium License Adopters</span>
            <span className="text-2xl font-black text-amber-600 block mt-1.5">3 Companies</span>
          </div>
          <span className="text-[10px] font-bold text-[#10B981] mt-2 block">CAC Payback: 10.4 months</span>
        </div>

        {/* Metric 5 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Beta Modules</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">0</span>
          </div>
          <span className="text-[10px] font-bold text-amber-500 mt-2 block">Feedback loops operational</span>
        </div>

        {/* Metric 6 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">License Utilization</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">88.2%</span>
          </div>
          <span className="text-[10px] font-bold text-[#10B981] mt-2 block">Optimal subscription density</span>
        </div>

        {/* Metric 7 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Assigned Today</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">4 Actions</span>
          </div>
          <span className="text-[10px] font-bold text-[#10B981] mt-2 block">Zero provisioning failures</span>
        </div>

        {/* Metric 8 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Updated This Month</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">6 Features</span>
          </div>
          <span className="text-[10px] font-bold text-[#10B981] mt-2 block">SaaS registry version: v2.4.0</span>
        </div>
      </div>

      {/* Main Workspace Navigation Container */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
        
        {/* Horizontal Navigation Tabs (Exactly matching designs) */}
        <div className="flex flex-wrap gap-3">
          {[
            { id: 'Dynamic Features Matrix', label: 'Dynamic Features Matrix', icon: Shield },
            { id: 'Feature Usage Analytics', label: 'Feature Usage Analytics', icon: Settings },
            { id: 'Security & Audit Center', label: 'Security & Audit Center', icon: FileText }
          ].map((tb) => {
            const Icon = tb.icon;
            const isActive = activeTab === tb.id;
            return (
              <button
                key={tb.id}
                onClick={() => setActiveTab(tb.id)}
                className={`flex items-center gap-2 px-5 py-3 font-extrabold text-xs rounded-xl transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#FFD400] text-black border-black border-2 shadow-xs'
                    : 'bg-[#64748B]/10 hover:bg-[#64748B]/20 text-[#334155] border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#334155]'}`} />
                {tb.label}
              </button>
            );
          })}
        </div>

        {/* Tab content 1: Dynamic Features Matrix */}
        {activeTab === 'Dynamic Features Matrix' && (
          <div className="space-y-6">
            
            {/* Toolbar Action row */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-grow max-w-xl">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search features name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800"
                  />
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    showNotification('Search filters cleared.');
                  }}
                  className="flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-655 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5" /> Filter Matrix
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => showNotification('Columns list is optimized for standard admin dashboard view.')}
                    className="flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-655 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Columns Visibility <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="border border-amber-255 bg-white hover:bg-amber-50/10 text-yellow-600 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalStep(1);
                    setShowAddModal(true);
                  }}
                  className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create Feature
                </button>
              </div>
            </div>

            {/* Categorized features list with accordion layout matching all Screenshots */}
            <div className="space-y-4">
              {categoriesList.map((category) => {
                const isAccordionOpen = accordions[category];
                const catFeatures = filteredFeatures.filter(f => f.category.toLowerCase() === category.toLowerCase());
                
                return (
                  <div key={category} className="border border-slate-150 rounded-2xl overflow-hidden bg-white">
                    {/* Category Group Header Card */}
                    <div 
                      onClick={() => handleAccordionToggle(category)}
                      className="bg-[#F8FAFC] px-5 py-4 flex justify-between items-center cursor-pointer border-b border-slate-100 hover:bg-slate-100/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {isAccordionOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                        <span className="text-xs font-black text-slate-800 uppercase tracking-wider">{category} CATEGORY</span>
                        <span className="bg-slate-200 text-slate-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          {catFeatures.length} features
                        </span>
                      </div>
                      <button
                        type="button"
                        className="text-[10px] font-black text-amber-600 uppercase tracking-wider hover:underline"
                      >
                        Toggle Panel
                      </button>
                    </div>

                    {/* Features Table inside Accordion */}
                    {isAccordionOpen && (
                      <div className="overflow-x-auto custom-scrollbar">
                        <table className="text-left border-collapse table-fixed min-w-[1550px] w-[1550px]">
                          <thead>
                            <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/50">
                              <th className="py-3 px-5 text-center w-[50px] min-w-[50px] max-w-[50px]">
                                <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                              </th>
                              <th className="py-3 px-4 font-black w-[220px] min-w-[220px] max-w-[220px]">Feature Name</th>
                              <th className="py-3 px-4 font-black w-[300px] min-w-[300px] max-w-[300px]">Description</th>
                              <th className="py-3 px-2 text-center font-black w-[70px] min-w-[70px] max-w-[70px]">Starter</th>
                              <th className="py-3 px-2 text-center font-black w-[70px] min-w-[70px] max-w-[70px]">Pro</th>
                              <th className="py-3 px-2 text-center font-black w-[80px] min-w-[80px] max-w-[80px]">Enterprise</th>
                              <th className="py-3 px-2 text-center font-black w-[70px] min-w-[70px] max-w-[70px]">Custom</th>
                              <th className="py-3 px-4 text-center font-black w-[70px] min-w-[70px] max-w-[70px]">Add-on</th>
                              <th className="py-3 px-4 font-black w-[110px] min-w-[110px] max-w-[110px]">Licensing</th>
                              <th className="py-3 px-4 font-black w-[110px] min-w-[110px] max-w-[110px]">Status</th>
                              <th className="py-3 px-4 text-right font-black w-[100px] min-w-[100px] max-w-[100px]">Usage Count</th>
                              <th className="py-3 px-5 text-right font-black w-[90px] min-w-[90px] max-w-[90px]">Companies</th>
                              <th className="py-3 px-5 text-center font-black w-[180px] min-w-[180px] max-w-[180px]">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                            {catFeatures.length === 0 ? (
                              <tr>
                                <td colSpan="13" className="py-8 text-center text-slate-400 font-semibold bg-white w-full">
                                  No features matched filters in this category.
                                </td>
                              </tr>
                            ) : (
                              catFeatures.map((feat) => (
                                <tr key={feat.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                                  <td className="py-4 px-5 text-center w-[50px] min-w-[50px] max-w-[50px]">
                                    <input type="checkbox" className="w-4 h-4 rounded cursor-pointer text-blue-600 focus:ring-blue-500" />
                                  </td>
                                  <td className="py-4 px-4 w-[220px] min-w-[220px] max-w-[220px] whitespace-nowrap truncate">
                                    <span className="font-extrabold text-slate-900 block truncate">{feat.name}</span>
                                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5 font-mono truncate">
                                      {feat.id} <span className="text-slate-300 font-sans font-medium">• {feat.version}</span>
                                    </span>
                                  </td>
                                  <td className="py-4 px-4 w-[300px] min-w-[300px] max-w-[300px]">
                                    <div className="w-[300px] pr-4">
                                      <p className="text-slate-655 font-semibold leading-normal line-clamp-2">{feat.desc}</p>
                                      {feat.dependsOn && (
                                        <span className="text-amber-500 text-[10px] font-bold block mt-1">
                                          Depends: {feat.dependsOn}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-4 px-2 text-center w-[70px] min-w-[70px] max-w-[70px]">
                                    <input
                                      type="checkbox"
                                      checked={feat.plans.Starter}
                                      onChange={() => handleTogglePlan(feat.id, 'Starter')}
                                      className="w-4 h-4 rounded text-[#00A3FF] focus:ring-[#00A3FF] cursor-pointer"
                                    />
                                  </td>
                                  <td className="py-4 px-2 text-center w-[70px] min-w-[70px] max-w-[70px]">
                                    <input
                                      type="checkbox"
                                      checked={feat.plans.Pro}
                                      onChange={() => handleTogglePlan(feat.id, 'Pro')}
                                      className="w-4 h-4 rounded text-[#00A3FF] focus:ring-[#00A3FF] cursor-pointer"
                                    />
                                  </td>
                                  <td className="py-4 px-2 text-center w-[80px] min-w-[80px] max-w-[80px]">
                                    <input
                                      type="checkbox"
                                      checked={feat.plans.Enterprise}
                                      onChange={() => handleTogglePlan(feat.id, 'Enterprise')}
                                      className="w-4 h-4 rounded text-[#00A3FF] focus:ring-[#00A3FF] cursor-pointer"
                                    />
                                  </td>
                                  <td className="py-4 px-2 text-center w-[70px] min-w-[70px] max-w-[70px]">
                                    <input
                                      type="checkbox"
                                      checked={feat.plans.Custom}
                                      onChange={() => handleTogglePlan(feat.id, 'Custom')}
                                      className="w-4 h-4 rounded text-[#00A3FF] focus:ring-[#00A3FF] cursor-pointer"
                                    />
                                  </td>
                                  <td className="py-4 px-4 text-center w-[70px] min-w-[70px] max-w-[70px] font-semibold text-slate-500 whitespace-nowrap">
                                    {feat.addon}
                                  </td>
                                  <td className="py-4 px-4 w-[110px] min-w-[110px] max-w-[110px] font-extrabold text-slate-750 whitespace-nowrap truncate">
                                    {feat.licensing}
                                  </td>
                                  <td className="py-4 px-4 w-[110px] min-w-[110px] max-w-[110px] whitespace-nowrap">
                                    <select
                                      value={feat.status}
                                      onChange={(e) => handleStatusChange(feat.id, e.target.value)}
                                      className="px-2 py-1 border border-slate-200 bg-white font-extrabold text-[11px] rounded-lg text-slate-800 focus:outline-none focus:border-[#FFD400] cursor-pointer"
                                    >
                                      <option value="Enabled">Enabled</option>
                                      <option value="Disabled">Disabled</option>
                                      <option value="Maintenance">Maintenance</option>
                                    </select>
                                  </td>
                                  <td className="py-4 px-4 text-right w-[100px] min-w-[100px] max-w-[100px] font-black text-slate-900 whitespace-nowrap">
                                    {feat.usage}
                                  </td>
                                  <td className="py-4 px-5 text-right w-[90px] min-w-[90px] max-w-[90px] font-black text-slate-900 whitespace-nowrap">
                                    {feat.companies}
                                  </td>
                                  <td className="py-4 px-5 w-[180px] min-w-[180px] max-w-[180px] whitespace-nowrap text-center">
                                    <div className="flex items-center gap-1.5 justify-center">
                                      <button
                                        type="button"
                                        onClick={() => handleConfigure(feat)}
                                        className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-extrabold text-[11px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                      >
                                        Configure
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleClone(feat)}
                                        className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-extrabold text-[11px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                      >
                                        Clone
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDelete(feat.id, feat.name)}
                                        className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs p-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center shadow-xs"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab content 2: Feature Usage Analytics */}
        {activeTab === 'Feature Usage Analytics' && (
          <div className="space-y-6">
            
            {/* Grid Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Adoption rates card */}
              <div className="bg-white border border-slate-150 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-black text-slate-800">Dynamic Feature Adoption Rates</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Admin Panel Base Shell', pct: 100 },
                    { label: 'Interactive Operations Map', pct: 85 },
                    { label: 'Fleet Asset Maintenance Logs', pct: 95 },
                    { label: 'ELD Driver Log Profiles', pct: 98 },
                    { label: 'Dispatch Scheduling Board', pct: 90 },
                    { label: 'Load Booking Registry', pct: 99 }
                  ].map((ad, idx) => (
                    <div key={idx} className="space-y-1.5 text-left">
                      <div className="flex justify-between text-xs font-black">
                        <span className="text-slate-700">{ad.label}</span>
                        <span className="text-amber-600">{ad.pct}% adoption</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${ad.pct}%` }} 
                          className="bg-[#FFD400] h-full rounded-full"
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* License utilization card */}
              <div className="bg-white border border-slate-150 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-black text-slate-800">License Utilization Index</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Warehouse Stock Slots Layout', pct: 50 },
                    { label: 'Driver Payroll & Expense Factorings', pct: 72 },
                    { label: 'Financial Performance Analytics', pct: 65 },
                    { label: 'Customer Invoice Generation', pct: 98 },
                    { label: 'CRM Leads Sales Tracker', pct: 90 },
                    { label: 'Shipper Customer Gateway', pct: 70 }
                  ].map((ut, idx) => (
                    <div key={idx} className="space-y-1.5 text-left">
                      <div className="flex justify-between text-xs font-black">
                        <span className="text-slate-700">{ut.label}</span>
                        <span className="text-[#10B981]">{ut.pct}% utilization</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${ut.pct}%` }} 
                          className="bg-[#10B981] h-full rounded-full"
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Unused or Deprecated SaaS features card */}
            <div className="bg-white border border-slate-150 rounded-2xl p-6 space-y-4">
              <div className="text-left">
                <h3 className="text-sm font-black text-slate-800">Unused or Deprecated SaaS Features</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">The following modules have zero active usage and are recommended for deprecation scans.</p>
              </div>

              <div className="border border-slate-150 rounded-2xl overflow-hidden bg-[#F8FAFC]/50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/80">
                      <th className="py-3 px-5 font-black">Feature</th>
                      <th className="py-3 px-4 font-black">Licensing Type</th>
                      <th className="py-3 px-4 font-black">Category</th>
                      <th className="py-3 px-4 text-center font-black">Usage Count</th>
                      <th className="py-3 px-5 text-right font-black">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-400 font-bold text-xs bg-white">
                        No deprecated feature nodes or zombie gates detected in system registry.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab content 3: Security & Audit Center */}
        {activeTab === 'Security & Audit Center' && (
          <div className="space-y-4 bg-white">
            
            {/* Audits table header and export */}
            <div className="flex justify-between items-center pb-2">
              <h3 className="text-sm font-black text-slate-855 uppercase tracking-wider">Feature Modification Logs</h3>
              <button
                type="button"
                onClick={handleExportAudits}
                className="border border-amber-250 bg-white hover:bg-amber-50/15 text-yellow-600 font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Export Audits
              </button>
            </div>

            {/* Audit list container */}
            <div className="border border-slate-150 rounded-2xl overflow-hidden bg-[#F8FAFC]/40">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/80">
                    <th className="py-4 px-5 font-black">Action Type</th>
                    <th className="py-4 px-4 font-black">Audit Details</th>
                    <th className="py-4 px-4 font-black">Reason</th>
                    <th className="py-4 px-4 font-black">Timestamp</th>
                    <th className="py-4 px-4 font-black">Operator</th>
                    <th className="py-4 px-5 text-right font-black">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700 bg-white">
                  {auditLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-5 font-extrabold text-slate-900 whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="py-4 px-4 text-slate-655 max-w-[280px] font-semibold leading-normal">
                        {log.details}
                      </td>
                      <td className="py-4 px-4 italic font-semibold text-amber-555 whitespace-nowrap">
                        {log.reason}
                      </td>
                      <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-4 px-4 text-amber-600 font-black whitespace-nowrap">
                        {log.operator}
                      </td>
                      <td className="py-4 px-5 text-right text-slate-500 font-semibold whitespace-nowrap">
                        {log.ip}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Multi-step Register Feature Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in text-left">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-800">Register SaaS Licensed Feature</h3>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step indicators */}
            <div className="px-6 py-3 bg-[#F8FAFC] border-b border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>STEP {modalStep} OF 3</span>
              <span className="text-[#FFD400]">METADATA</span>
            </div>

            {/* Form Content */}
            <form onSubmit={handleCreateFeatureSubmit} className="p-6 space-y-5 text-xs font-semibold text-slate-700">
              {modalStep === 1 ? (
                <>
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Feature Name</label>
                      <input
                        type="text"
                        required
                        value={newFeatName}
                        onChange={(e) => setNewFeatName(e.target.value)}
                        placeholder="e.g. Real-Time Tracking"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none text-slate-800 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Unique Feature ID</label>
                      <input
                        type="text"
                        required
                        value={newFeatId}
                        onChange={(e) => setNewFeatId(e.target.value)}
                        placeholder="e.g. feat-gps-tracking"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none text-slate-800 text-xs font-bold font-mono"
                      />
                    </div>
                  </div>

                  <div className="text-left">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Feature Description</label>
                    <textarea
                      rows="3"
                      value={newFeatDesc}
                      onChange={(e) => setNewFeatDesc(e.target.value)}
                      placeholder="Detailed purpose description of feature..."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none text-slate-800 text-xs font-semibold placeholder:text-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Category</label>
                      <select
                        value={newFeatCategory}
                        onChange={(e) => setNewFeatCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                      >
                        <option value="Platform">Platform</option>
                        <option value="Operations">Operations</option>
                        <option value="Fleet">Fleet</option>
                        <option value="Drivers">Drivers</option>
                        <option value="Dispatch">Dispatch</option>
                        <option value="Loads">Loads</option>
                        <option value="Administration">Administration</option>
                        <option value="API">API</option>
                        <option value="Developer Tools">Developer Tools</option>
                        <option value="Billing">Billing</option>
                        <option value="CRM">CRM</option>
                        <option value="Customer Portal">Customer Portal</option>
                        <option value="Tracking">Tracking</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Licensing Type</label>
                      <select
                        value={newFeatLicensing}
                        onChange={(e) => setNewFeatLicensing(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                      >
                        <option value="Core">Core System</option>
                        <option value="Premium">Premium Option</option>
                        <option value="Add-on">Optional Add-on</option>
                        <option value="Enterprise Only">Enterprise Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newFeatName || !newFeatId) {
                          showNotification('Please fill Feature Name and ID.');
                          return;
                        }
                        setModalStep(2);
                      }}
                      className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      Next Step <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              ) : modalStep === 2 ? (
                <>
                  <div className="space-y-4 text-left">
                    <h4 className="font-extrabold text-slate-800">Plan Default Entitlements</h4>
                    <p className="text-slate-455 font-semibold text-[11px] leading-normal">
                      Toggle which tenant subscriptions will automatically gain access to this gate upon registration.
                    </p>

                    <div className="space-y-3 bg-[#F8FAFC] border border-slate-150 rounded-2xl p-4">
                      {['Starter', 'Pro', 'Enterprise', 'Custom'].map((pln) => (
                        <label key={pln} className="flex items-center gap-3 cursor-pointer select-none">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-650 cursor-pointer" />
                          <div>
                            <span className="text-xs font-black text-slate-855 block">{pln} tier</span>
                            <span className="text-[10px] text-slate-400 font-bold block">Entitle nodes under {pln} subscription profiles.</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100 mt-4">
                    <button
                      type="button"
                      onClick={() => setModalStep(1)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalStep(3)}
                      className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      Next Step <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4 text-center py-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 text-center">
                      <h4 className="font-black text-slate-800 text-sm">Ready to Register Gate Control</h4>
                      <p className="text-slate-455 font-semibold text-[11px] leading-normal max-w-sm mx-auto">
                        This will dispatch live overrides telemetry across 18 tenant clusters. Check parameters before saving.
                      </p>
                    </div>

                    <div className="bg-[#F8FAFC] border border-slate-150 rounded-2xl p-4 text-left space-y-2 text-[11px] font-bold">
                      <div className="flex justify-between"><span className="text-slate-400">ID:</span><span className="font-mono text-slate-800">{newFeatId}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Name:</span><span className="text-slate-800">{newFeatName}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Category:</span><span className="text-slate-800">{newFeatCategory}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Licensing:</span><span className="text-slate-800">{newFeatLicensing}</span></div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100 mt-4">
                    <button
                      type="button"
                      onClick={() => setModalStep(2)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Confirm & Save Gate
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
      {/* Licensing Policy Configure Right-Side Drawer */}
      {showConfigureDrawer && configureFeature && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            onClick={() => setShowConfigureDrawer(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col z-10 text-left">

            {/* Header */}
            <div className="flex justify-between items-start px-6 py-5 border-b border-slate-100 bg-white">
              <div className="pr-3">
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">Licensing Policy: {configureFeature.name}</h3>
              </div>
              <button
                onClick={() => setShowConfigureDrawer(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-50 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 px-6 pt-4 pb-2 border-b border-slate-100">
              {['Overview', 'Company Overrides', 'Analytics', 'Versioning'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setConfigureTab(tab)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                    configureTab === tab
                      ? 'bg-[#FFD400] text-black border-black border-2 font-black'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Scrollable Tab Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 custom-scrollbar">

              {/* ── OVERVIEW TAB ── */}
              {configureTab === 'Overview' && (
                <div className="space-y-3">
                  {/* Description */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">DESCRIPTION</p>
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">{configureFeature.fullDesc || configureFeature.desc}</p>
                  </div>

                  {/* 2-col grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">LICENSING CATEGORY</p>
                      <p className="text-sm font-black text-slate-900">{configureFeature.category}</p>
                    </div>
                    <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">REQUIRED MODULES</p>
                      <p className="text-sm font-black text-slate-900">{configureFeature.requiredModules || `${configureFeature.category} Base`}</p>
                    </div>
                    <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">EST. MONTHLY API LOAD</p>
                      <p className="text-sm font-black text-amber-500">{configureFeature.apiLoad || `${(configureFeature.usage * 68).toLocaleString()} requests`}</p>
                    </div>
                    <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">STORAGE CAPACITY SIZE</p>
                      <p className="text-sm font-black text-emerald-500">{configureFeature.storage || `${(configureFeature.companies * 3.7).toFixed(1)} GB`}</p>
                    </div>
                    <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">PERFORMANCE FOOTPRINT</p>
                      <p className="text-sm font-black text-slate-900">{configureFeature.footprint || (configureFeature.usage > 1000 ? 'Medium' : 'Low')}</p>
                    </div>
                    <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">LICENSING TIER TYPE</p>
                      <p className="text-sm font-black text-slate-900">{configureFeature.licensing}</p>
                    </div>
                  </div>

                  {/* Feature Dependencies — always shown */}
                  <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/50">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">FEATURE DEPENDENCIES MATRIX</p>
                    {configureFeature.dependsOn ? (
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                        🔗 {configureFeature.dependsOn}
                      </span>
                    ) : (
                      <p className="text-xs text-slate-500 font-semibold italic">No active dependencies mapped.</p>
                    )}
                  </div>
                </div>
              )}

              {/* ── COMPANY OVERRIDES TAB ── */}
              {configureTab === 'Company Overrides' && (
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-2xl p-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">ASSIGNED COMPANY MANUAL OVERRIDES</p>
                    <p className="text-xs text-slate-500 font-semibold italic">No company override rules active for this feature.</p>
                  </div>

                  <div className="border border-slate-700 rounded-2xl p-5 space-y-3 bg-slate-700">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-wider">CREATE TENANT ACCESS OVERRIDE</p>
                    <select className="w-full px-3 py-2.5 border border-slate-500 bg-slate-600 text-white font-semibold text-xs rounded-xl focus:outline-none focus:border-[#FFD400] cursor-pointer">
                      <option>-- Select Tenant Workspace --</option>
                      <option>Apex Logistics LLC</option>
                      <option>Falcon Logistics LLC</option>
                      <option>Swift Cargo Express</option>
                      <option>Global Shipping Solutions</option>
                    </select>
                    <div className="grid grid-cols-2 gap-2">
                      <select className="px-3 py-2.5 border border-slate-500 bg-slate-600 text-white font-semibold text-xs rounded-xl focus:outline-none cursor-pointer">
                        <option>Force Enabled</option>
                        <option>Force Disabled</option>
                      </select>
                      <select className="px-3 py-2.5 border border-slate-500 bg-slate-600 text-white font-semibold text-xs rounded-xl focus:outline-none cursor-pointer">
                        <option>Manual Admin Override</option>
                        <option>Billing Exception</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., Billing exception, Beta tester group..."
                      className="w-full px-3 py-2.5 border border-slate-500 bg-slate-600 text-white placeholder:text-slate-400 font-semibold text-xs rounded-xl focus:outline-none"
                    />
                    <button
                      onClick={() => showNotification(`Override rule created for ${configureFeature.name}.`)}
                      className="w-full bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-sm py-3 rounded-2xl transition-all cursor-pointer"
                    >
                      Create Override Rule
                    </button>
                  </div>
                </div>
              )}

              {/* ── ANALYTICS TAB ── */}
              {configureTab === 'Analytics' && (
                <div className="space-y-4">
                  {/* KPI Row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border border-slate-200 rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-bold text-slate-400 mb-1">Adoption</p>
                      <p className="text-lg font-black text-slate-900">{Math.min(98, Math.round((configureFeature.companies / 5) * 100))}%</p>
                    </div>
                    <div className="border border-slate-200 rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-bold text-slate-400 mb-1">MoM Growth</p>
                      <p className="text-lg font-black text-emerald-500">+2.1%</p>
                    </div>
                    <div className="border border-slate-200 rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-bold text-slate-400 mb-1">Utilization</p>
                      <p className="text-lg font-black text-emerald-500">{Math.min(99, Math.round(configureFeature.usage / 20))}%</p>
                    </div>
                  </div>

                  {/* Revenue Estimate */}
                  <div className="border border-slate-200 rounded-2xl p-4 space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ESTIMATED FEATURE REVENUE</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-600">Monthly Yield:</span>
                      <span className="text-sm font-black text-slate-900">${(configureFeature.companies * 40).toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold">Calculated as: Companies Using x weighted premium features value.</p>
                  </div>
                </div>
              )}

              {/* ── VERSIONING TAB ── */}
              {configureTab === 'Versioning' && (
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">RELEASE VERSION LOGS</p>
                    <button 
                      onClick={() => setShowBumpForm(true)}
                      className="bg-[#FFD400] hover:bg-[#F2C900] text-slate-900 font-bold text-xs px-4 py-2 rounded-xl shadow-[0_2px_10px_rgba(255,212,0,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>+</span> Bump Version
                    </button>
                  </div>

                  {/* Bump Version Form */}
                  {showBumpForm && (
                    <div className="border border-slate-200 rounded-[1.25rem] p-4 bg-white space-y-4">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">TARGET VERSION STRING</p>
                        <input 
                          type="text" 
                          placeholder="e.g. 1.2.0" 
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#FFD400] transition-colors placeholder:text-slate-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">CHANGE LOG DESCRIPTION</p>
                        <input 
                          type="text" 
                          placeholder="e.g. Bug fixes and performance boost..." 
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#FFD400] transition-colors placeholder:text-slate-400"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-1">
                        <button 
                          onClick={() => setShowBumpForm(false)}
                          className="px-5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shadow-sm"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => { setShowBumpForm(false); showNotification('Version bumped successfully'); }}
                          className="px-5 py-2 text-xs font-bold text-slate-900 bg-[#FFD400] hover:bg-[#F2C900] rounded-xl shadow-[0_2px_10px_rgba(255,212,0,0.3)] transition-colors cursor-pointer"
                        >
                          Bump Version
                        </button>
                      </div>
                    </div>
                  )}

                  {/* History Item */}
                  <div className="border border-slate-200 rounded-[1.25rem] p-5 bg-white space-y-2.5 shadow-sm">
                    <div>
                      <p className="text-[13px] font-black text-slate-800">Version v1.0.0</p>
                      <p className="font-mono text-[9px] text-slate-400 font-semibold mt-1 uppercase tracking-wider">Published by System Root on 01/10/2026</p>
                    </div>
                    <p className="text-xs font-semibold text-slate-500">Initial base template release.</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
