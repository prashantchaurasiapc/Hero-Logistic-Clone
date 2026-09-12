import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, UserCheck, ShieldCheck, ArrowLeft, Check, AlertCircle, Loader2, Home, ChevronRight
} from 'lucide-react';
import api from '../../services/api';

export default function CreateCompany({ onBack, onCreated }) {
  const navigate = useNavigate();

  // Loading and Error state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [availablePlans, setAvailablePlans] = useState([]);

  // Form State containing ONLY the required fields, empty by default
  const [formData, setFormData] = useState({
    tenantName: '',
    adminEmail: '',
    adminPassword: '',
    planTier: '',
    tenantId: '',
    status: 'ACTIVE',
    accountManager: '',
    trialExpiry: ''
  });

  // Fetch subscription plans from backend API
  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await api.get('/subscription-plans');
        if (res.data?.success && Array.isArray(res.data.data)) {
          setAvailablePlans(res.data.data);
          if (res.data.data.length > 0) {
            setFormData(prev => ({ ...prev, planTier: res.data.data[0].name }));
          }
        }
      } catch (err) {
        console.error('Failed to load subscription plans:', err);
      }
    }
    loadPlans();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/admin/companies');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Field Validation
    if (!formData.tenantName.trim()) {
      setErrorMessage('Tenant Company Name is required.');
      return;
    }
    if (!formData.adminEmail.trim()) {
      setErrorMessage('Workspace Manager Email is required.');
      return;
    }
    if (!formData.adminPassword) {
      setErrorMessage('Workspace Manager Password is required.');
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name: formData.tenantName.trim(),
        adminEmail: formData.adminEmail.trim(),
        adminPassword: formData.adminPassword,
        planTier: formData.planTier || undefined,
        tenantId: formData.tenantId.trim() || undefined,
        status: formData.status,
        accountManager: formData.accountManager.trim() || null,
        trialExpiry: formData.status === 'TRIAL' && formData.trialExpiry ? formData.trialExpiry : null
      };

      const res = await api.post('/companys', payload);

      if (res.data?.success) {
        if (onCreated) {
          onCreated(res.data.data || payload);
        } else if (onBack) {
          onBack();
        } else {
          navigate('/admin/companies');
        }
      }
    } catch (err) {
      console.error('Failed to create company:', err);
      const serverMsg = err.response?.data?.error?.message || err.response?.data?.message || 'Error provisioning tenant. Please verify inputs.';
      setErrorMessage(serverMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 w-full text-left font-sans custom-scrollbar overflow-y-auto min-h-screen">
      
      {/* CSS Override to prevent browser autofill background blue highlighting */}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
          -webkit-text-fill-color: #1e293b !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      <div className="max-w-5xl mx-auto space-y-6">

        {/* TOP BREADCRUMB & HEADER BAR */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-2">
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <button onClick={handleBack} className="hover:text-slate-900 transition-colors cursor-pointer">
                Companies
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-800 font-bold">Create Company</span>
            </nav>

            {/* Page Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Create New Company
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Add a new company to the Hero Logistics platform.
            </p>
          </div>

          {/* Top Right Action Button */}
          <button
            type="button"
            onClick={handleBack}
            className="self-start md:self-auto bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>Back to Companies</span>
          </button>
        </div>

        {/* ERROR NOTIFICATION BANNER */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs font-bold flex items-start gap-3 shadow-xs animate-shake">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-extrabold text-rose-900">Provisioning Error</p>
              <p className="mt-0.5 leading-snug">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">

          {/* Dummy hidden inputs to hijack browser autofill */}
          <input type="text" name="fakeusernameremembered" style={{ display: 'none' }} tabIndex={-1} />
          <input type="password" name="fakepasswordremembered" style={{ display: 'none' }} tabIndex={-1} />

          {/* SECTION 1: TENANT IDENTITY */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Tenant Identity</h2>
                <p className="text-xs text-slate-400 font-medium">Basic identity details for the company workspace.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Tenant Company Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tenant Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="tenant_company_name_field"
                  autoComplete="off"
                  value={formData.tenantName}
                  onChange={e => handleChange('tenantName', e.target.value)}
                  placeholder="e.g. Titan Freightlines LLC"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Company ID (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Company ID <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="tenant_company_id_field"
                  autoComplete="off"
                  value={formData.tenantId}
                  onChange={e => handleChange('tenantId', e.target.value)}
                  placeholder="e.g. #TEN-001"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: WORKSPACE MANAGER CREDENTIALS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Workspace Administrator</h2>
                <p className="text-xs text-slate-400 font-medium">Initial admin account credentials for company login.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Workspace Manager Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Workspace Manager Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  name="new_workspace_manager_email_no_autofill"
                  autoComplete="new-email"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  value={formData.adminEmail}
                  onChange={e => handleChange('adminEmail', e.target.value)}
                  placeholder="e.g. admin@titan.com"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Workspace Manager Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Workspace Manager Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  name="new_workspace_manager_password_no_autofill"
                  autoComplete="new-password"
                  value={formData.adminPassword}
                  onChange={e => handleChange('adminPassword', e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: SUBSCRIPTION & ACCOUNT SETTINGS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Licensing & Provisioning</h2>
                <p className="text-xs text-slate-400 font-medium">Select plan tier, status, and account manager.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {/* License Plan Tier */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">License Plan Tier</label>
                <select
                  value={formData.planTier}
                  onChange={e => handleChange('planTier', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer transition-all"
                >
                  {availablePlans.length > 0 ? (
                    availablePlans.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))
                  ) : (
                    <>
                      <option value="Hero Pro">Hero Pro</option>
                      <option value="Starter Tier">Starter Tier</option>
                      <option value="Professional Tier">Professional Tier</option>
                      <option value="Enterprise Tier">Enterprise Tier</option>
                    </>
                  )}
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Status</label>
                <select
                  value={formData.status}
                  onChange={e => handleChange('status', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer transition-all"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PROVISIONING">PROVISIONING</option>
                  <option value="TRIAL">TRIAL</option>
                  <option value="HOLD">HOLD</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              {/* Account Manager (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Account Manager <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="tenant_account_manager_field"
                  autoComplete="off"
                  value={formData.accountManager}
                  onChange={e => handleChange('accountManager', e.target.value)}
                  placeholder="e.g. John Smith"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Trial Expiry Date (If Status is TRIAL) */}
              {formData.status === 'TRIAL' && (
                <div className="space-y-1.5 md:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Trial Expiry Date</label>
                  <input
                    type="date"
                    value={formData.trialExpiry}
                    onChange={e => handleChange('trialExpiry', e.target.value)}
                    className="w-full md:w-1/3 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM FORM ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 pb-12">
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs px-8 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Finalizing Setup...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Finalize Setup</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
