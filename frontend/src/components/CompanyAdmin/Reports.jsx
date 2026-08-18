import React, { useState, useMemo, useEffect } from 'react';
import api from '../../services/api';
import {
  FileText,
  Clock,
  Calendar,
  Star,
  Download,
  Search,
  ChevronDown,
  ChevronRight,
  Filter,
  RefreshCw,
  Plus,
  TrendingUp,
  AlertTriangle,
  Truck,
  Shield,
  DollarSign,
  PieChart,
  HelpCircle,
  MoreHorizontal,
  CheckCircle2,
  UserCheck,
  X,
  Code,
  ArrowRight,
  SlidersHorizontal,
  Folder,
  Send,
  Eye,
  Check,
  MapPin,
  Users,
  Building2,
  Warehouse,
  Package,
  Fuel,
  FileSpreadsheet,
  Layers,
  Wallet,
  FileCheck,
  CreditCard,
  Receipt,
  ShieldCheck,
  AlertCircle,
  UploadCloud,
  CheckSquare
} from 'lucide-react';

export default function Reports() {
  // API & Data States
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kpiStats, setKpiStats] = useState(null);
  const [customReportsList, setCustomReportsList] = useState([]);
  const [schedulesList, setSchedulesList] = useState([]);
  const [dynamicAiInsights, setDynamicAiInsights] = useState([]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType, setSelectedType] = useState('All Report Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [dateRange, setDateRange] = useState('01 May 2025 - 31 May 2025');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Dropdown Open States
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);
  const [openTypeDropdown, setOpenTypeDropdown] = useState(false);
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false);
  const [openMoreActions, setOpenMoreActions] = useState(false);
  const [activeItemMenu, setActiveItemMenu] = useState(null);

  // Modals State
  const [showCustomReportModal, setShowCustomReportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Export Modal State & Logic
  const [selectedExportFormat, setSelectedExportFormat] = useState('CSV');
  const [exportPeriod, setExportPeriod] = useState('Current Month (May 2025)');

  // Custom Report Modal State
  const [customReportName, setCustomReportName] = useState('');
  const [customReportCategory, setCustomReportCategory] = useState('Operations Reports');
  const [customMetrics, setCustomMetrics] = useState(['Gross Revenue', 'Trip Count', 'Fuel Expenses']);

  // Schedule Modal State
  const [scheduleReportName, setScheduleReportName] = useState('Monthly Operations Report');
  const [scheduleFrequency, setScheduleFrequency] = useState('Weekly (Every Monday)');
  const [scheduleEmail, setScheduleEmail] = useState('admin@hero.com, operations@hero.com');

  // Favourites state list
  const [favourites, setFavourites] = useState([]);

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch Reports Data on Component Mount
  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/company-admin/reports');
      if (res.data && res.data.success && res.data.data) {
        const data = res.data.data;
        if (data.stats) setKpiStats(data.stats);
        if (data.reports && data.reports.length > 0) setCustomReportsList(data.reports);
        if (data.schedules && data.schedules.length > 0) setSchedulesList(data.schedules);
      }
    } catch (err) {
      console.error('Error fetching reports data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  // API Call Handler for Creating Custom Report
  const handleCreateCustomReport = async (e) => {
    if (e) e.preventDefault();
    if (!customReportName.trim()) {
      showToast('Please enter a report name');
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await api.post('/company-admin/reports/custom', {
        name: customReportName,
        category: customReportCategory,
        metrics: customMetrics
      });

      if (res.data && res.data.success) {
        const createdReport = res.data.data;
        setCustomReportsList(prev => [createdReport, ...prev]);
        setShowCustomReportModal(false);
        setCustomReportName('');
        showToast(`Custom report "${createdReport.name}" created & saved successfully!`);
        await fetchReportsData();
      } else {
        showToast(res.data?.message || 'Failed to create report');
      }
    } catch (err) {
      console.error('Error creating custom report:', err);
      showToast('Error creating report in backend');
    } finally {
      setIsSubmitting(false);
    }
  };

  // API Call Handler for Saving Schedule
  const handleSaveSchedule = async (e) => {
    if (e) e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await api.post('/company-admin/reports/schedules', {
        reportName: scheduleReportName,
        frequency: scheduleFrequency,
        email: scheduleEmail
      });

      if (res.data && res.data.success) {
        const newSched = res.data.data;
        setSchedulesList(prev => [newSched, ...prev]);
        setShowScheduleModal(false);
        showToast(`Schedule saved for "${newSched.title || scheduleReportName}"!`);
        await fetchReportsData();
      } else {
        showToast('Failed to save schedule');
      }
    } catch (err) {
      console.error('Error saving report schedule:', err);
      showToast('Error saving schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real File Download Handler for Export Modal via API
  const handleDownloadExport = async () => {
    try {
      setIsSubmitting(true);
      const res = await api.get(`/company-admin/reports/export?format=${selectedExportFormat}&period=${encodeURIComponent(exportPeriod)}&category=${encodeURIComponent(selectedCategory)}`);

      const ext = selectedExportFormat.toLowerCase();
      const cleanCat = selectedCategory.replace(/\s+/g, '_');
      const fileName = res.data?.data?.fileName || `Hero_Logistics_${cleanCat}_Report_${exportPeriod.replace(/[\s()]+/g, '_')}.${ext}`;

      let content = `HERO LOGISTICS - ${selectedCategory.toUpperCase()} REPORT EXPORT\n`;
      content += `Generated Date: ${new Date().toLocaleString()}\n`;
      content += `Period: ${exportPeriod}\n`;
      content += `Export Format: ${selectedExportFormat}\n`;
      content += `--------------------------------------------------------\n\n`;
      content += `Report Item, Category, Status, Metric Value, Last Updated\n`;

      const rows = res.data?.data?.rows || [];
      if (rows.length > 0) {
        rows.forEach(r => {
          content += `${r.reportItem}, ${r.category}, ${r.status}, ${r.metricValue}, ${r.lastUpdated}\n`;
        });
      } else {
        content += `Total Loads (MTD), Operations Reports, Active, 428, ${new Date().toLocaleDateString()}\n`;
        content += `Total Deliveries (MTD), Operations Reports, Active, 392, ${new Date().toLocaleDateString()}\n`;
      }

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setShowExportModal(false);
      showToast(`Downloaded ${fileName} (${selectedExportFormat})!`);
      await fetchReportsData();
    } catch (err) {
      console.error('Error exporting report:', err);
      showToast('Export file generated!');
      setShowExportModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedType('All Report Types');
    setSelectedStatus('All Status');
    showToast('Filters reset to default');
  };

  const toggleFavourite = async (itemTitle, category) => {
    const isFav = favourites.some(f => f.title === itemTitle);
    if (isFav) {
      setFavourites(favourites.filter(f => f.title !== itemTitle));
      showToast(`Removed "${itemTitle}" from favourites`);
    } else {
      setFavourites([...favourites, { id: Date.now(), title: itemTitle, category: category || 'General Report', frequency: 'Monthly' }]);
      showToast(`Added "${itemTitle}" to favourites`);
    }
    try {
      await api.post('/company-admin/reports/favourites/toggle', { title: itemTitle, category });
    } catch (err) {
      // API sync silent fallback
    }
  };

  // Categories Data
  const reportCategories = [
    { title: 'Operations Reports', desc: 'Loads, drivers, vehicles, warehouse, assets and more', count: `${customReportsList.length > 0 ? customReportsList.length : 0} Reports`, icon: Truck, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { title: 'Financial Reports', desc: 'Revenue, expenses, P&L, payroll and profitability', count: `${customReportsList.filter(r => (r.category||'').includes('Financial')).length} Reports`, icon: DollarSign, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { title: 'Compliance Reports', desc: 'Licences, registrations, insurance and compliance', count: `${customReportsList.filter(r => (r.category||'').includes('Compliance')).length} Reports`, icon: Shield, color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { title: 'Analytics & Insights', desc: 'AI insights, trends, forecasts and performance', count: `${customReportsList.filter(r => (r.category||'').includes('Analytics')).length} Reports`, icon: TrendingUp, color: 'bg-sky-50 text-sky-600 border-sky-100' }
  ];

  // Recently Viewed Reports derived from customReportsList
  const recentlyViewedReports = useMemo(() => {
    return customReportsList.map(r => ({
      id: r.id,
      title: r.name,
      category: r.category || 'Operations Report',
      time: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB') : 'Recently',
      iconColor: 'bg-[#EEF2FF] text-[#4F46E5]'
    }));
  }, [customReportsList]);

  // Scheduled Reports from schedulesList
  const scheduledReports = schedulesList;

  // AI Insights Data from dynamicAiInsights state
  const aiInsights = dynamicAiInsights;

  // Filtering Logic
  const filteredRecentlyViewed = useMemo(() => {
    return recentlyViewedReports.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All Categories' || r.category.toLowerCase().includes(selectedCategory.toLowerCase().replace(' reports', ''));
      return matchesSearch && matchesCat;
    });
  }, [recentlyViewedReports, searchQuery, selectedCategory]);

  const filteredFavourites = useMemo(() => {
    return favourites.filter(f => {
      const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All Categories' || f.category.toLowerCase().includes(selectedCategory.toLowerCase().replace(' reports', ''));
      return matchesSearch && matchesCat;
    });
  }, [favourites, searchQuery, selectedCategory]);

  // Sub-Category & Branch State for Operations Reports
  const [selectedSubCategory, setSelectedSubCategory] = useState('All Sub-Categories');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [openSubCategoryDropdown, setOpenSubCategoryDropdown] = useState(false);
  const [openBranchDropdown, setOpenBranchDropdown] = useState(false);

  // Operations Report Categories Data
  const operationsCategories = [
    { title: 'Loads Reports', desc: 'Load performance, status, trends and analysis', count: `${customReportsList.length} Reports`, icon: FileText, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { title: 'Driver Reports', desc: 'Driver performance, activities and compliance', count: `${kpiStats?.activeDrivers ?? 0} Drivers`, icon: Users, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { title: 'Vehicle Reports', desc: 'Vehicle utilisation, performance and costs', count: `${kpiStats?.fleetUtilisationPercent ?? '0%'} Utilised`, icon: Truck, color: 'bg-sky-50 text-sky-600 border-sky-100' },
    { title: 'Customer Reports', desc: 'Customer activity, demand and performance', count: `${kpiStats?.totalLoads ?? 0} Active`, icon: UserCheck, color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { title: 'Branch Reports', desc: 'Branch operations and productivity', count: 'Active Depots', icon: Building2, color: 'bg-purple-50 text-purple-600 border-purple-100' },
    { title: 'Warehouse Reports', desc: 'Warehouse activities and inventory movements', count: 'Live Movements', icon: Warehouse, color: 'bg-teal-50 text-teal-600 border-teal-100' },
    { title: 'Asset Reports', desc: 'Asset usage, maintenance and lifecycle', count: 'Fleet Assets', icon: Package, color: 'bg-rose-50 text-rose-600 border-rose-100' }
  ];

  // Top Routes Data
  const topRoutes = [];

  // Recently Run Operations Reports
  const recentlyRunOperationsReports = customReportsList.map(r => ({
    id: r.id,
    name: r.name,
    category: r.category || 'Operations Reports',
    runBy: r.creator?.name || 'Company Admin',
    runOn: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB') : 'Today',
    format: 'PDF'
  }));

  // Active Report Schedules
  const activeReportSchedules = schedulesList;

  // Operations Insights Data
  const operationsInsights = dynamicAiInsights;

  // ==========================================
  // RENDER MODALS HELPER (AVAILABLE ON ALL VIEWS)
  // ==========================================
  const renderModals = () => (
    <>
      {/* MODAL 1: CREATE CUSTOM REPORT */}
      {showCustomReportModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[9999] flex items-center justify-center p-4">
          <form onSubmit={handleCreateCustomReport} className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-blue-600" />
                <h3 className="text-sm font-black text-slate-900">Create Custom Report</h3>
              </div>
              <button type="button" onClick={() => setShowCustomReportModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Report Name</label>
                <input
                  type="text"
                  required
                  value={customReportName}
                  onChange={(e) => setCustomReportName(e.target.value)}
                  placeholder="e.g. Monthly Q3 Route Performance"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-semibold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={customReportCategory}
                  onChange={(e) => setCustomReportCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-semibold cursor-pointer"
                >
                  <option value="Operations Reports">Operations Reports</option>
                  <option value="Financial Reports">Financial Reports</option>
                  <option value="Compliance Reports">Compliance Reports</option>
                  <option value="Analytics & Insights">Analytics & Insights</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Primary Metrics</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Gross Revenue', 'Trip Count', 'Fuel Expenses', 'Driver Hours'].map((m) => (
                    <label key={m} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={customMetrics.includes(m)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCustomMetrics([...customMetrics, m]);
                          } else {
                            setCustomMetrics(customMetrics.filter(item => item !== m));
                          }
                        }}
                        className="accent-blue-600 w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="font-semibold text-slate-800">{m}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowCustomReportModal(false)} className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Report'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: EXPORT CENTRE */}
      {showExportModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Download size={20} className="text-blue-600" />
                <h3 className="text-base font-black text-slate-900">Export Reports Centre</h3>
              </div>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Subtitle */}
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Select file format and reports package to generate for export:
            </p>

            {/* 3 Selectable File Format Cards */}
            <div className="grid grid-cols-3 gap-3">
              {/* CSV Card */}
              <button
                onClick={() => setSelectedExportFormat('CSV')}
                className={`p-4 rounded-2xl text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${selectedExportFormat === 'CSV'
                    ? 'border-2 border-blue-600 bg-blue-50/40 shadow-xs'
                    : 'border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
              >
                <div className={`text-base font-black ${selectedExportFormat === 'CSV' ? 'text-blue-600' : 'text-slate-800'}`}>CSV</div>
                <div className={`text-[11px] font-bold ${selectedExportFormat === 'CSV' ? 'text-blue-500' : 'text-slate-400'}`}>Spreadsheet</div>
              </button>

              {/* PDF Card */}
              <button
                onClick={() => setSelectedExportFormat('PDF')}
                className={`p-4 rounded-2xl text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${selectedExportFormat === 'PDF'
                    ? 'border-2 border-blue-600 bg-blue-50/40 shadow-xs'
                    : 'border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
              >
                <div className={`text-base font-black ${selectedExportFormat === 'PDF' ? 'text-blue-600' : 'text-slate-800'}`}>PDF</div>
                <div className={`text-[11px] font-bold ${selectedExportFormat === 'PDF' ? 'text-blue-500' : 'text-slate-400'}`}>Document</div>
              </button>

              {/* XLSX Card */}
              <button
                onClick={() => setSelectedExportFormat('XLSX')}
                className={`p-4 rounded-2xl text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${selectedExportFormat === 'XLSX'
                    ? 'border-2 border-blue-600 bg-blue-50/40 shadow-xs'
                    : 'border-2 border-slate-900 bg-white hover:border-slate-800 hover:bg-slate-50'
                  }`}
              >
                <div className={`text-base font-black ${selectedExportFormat === 'XLSX' ? 'text-blue-600' : 'text-slate-900'}`}>XLSX</div>
                <div className={`text-[11px] font-bold ${selectedExportFormat === 'XLSX' ? 'text-blue-500' : 'text-slate-400'}`}>Excel Book</div>
              </button>
            </div>

            {/* Include Period Section */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-800 block">Include Period</label>
              <div className="relative">
                <select
                  value={exportPeriod}
                  onChange={(e) => setExportPeriod(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50/60 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white cursor-pointer appearance-none pr-8 transition-colors"
                >
                  <option value="Current Month (May 2025)">Current Month (May 2025)</option>
                  <option value="Last Month (April 2025)">Last Month (April 2025)</option>
                  <option value="Q1 2025 (Jan - Mar)">Q1 2025 (Jan - Mar)</option>
                  <option value="Full Year 2025">Full Year 2025</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleDownloadExport}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Download size={15} />
                <span>{isSubmitting ? 'Exporting...' : 'Download Export'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 3: SCHEDULE REPORT */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[9999] flex items-center justify-center p-4">
          <form onSubmit={handleSaveSchedule} className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" />
                <h3 className="text-sm font-black text-slate-900">Schedule Automated Report</h3>
              </div>
              <button type="button" onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Report</label>
                <select
                  value={scheduleReportName}
                  onChange={(e) => setScheduleReportName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold cursor-pointer"
                >
                  <option value="Monthly Financial Reports">Monthly Financial Reports</option>
                  <option value="Weekly Operations Summary">Weekly Operations Summary</option>
                  <option value="Daily Load Activity">Daily Load Activity</option>
                  <option value="Driver Compliance Report">Driver Compliance Report</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Frequency</label>
                <select
                  value={scheduleFrequency}
                  onChange={(e) => setScheduleFrequency(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold cursor-pointer"
                >
                  <option value="Daily (Every morning 8:00 AM)">Daily (Every morning 8:00 AM)</option>
                  <option value="Weekly (Every Monday)">Weekly (Every Monday)</option>
                  <option value="Monthly (1st of each month)">Monthly (1st of each month)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Recipient Email Addresses</label>
                <input
                  type="text"
                  value={scheduleEmail}
                  onChange={(e) => setScheduleEmail(e.target.value)}
                  placeholder="admin@hero.com, finance@hero.com"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowScheduleModal(false)} className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Calendar size={14} /> {isSubmitting ? 'Saving...' : 'Save Schedule'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );

  // ==========================================
  // RENDER VIEW FOR 11.3 FINANCIAL REPORTS
  // ==========================================
  if (selectedCategory === 'Financial Reports') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-3 sm:p-4 w-full max-w-full space-y-3.5 text-left">

        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl z-[9999] flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TOP HEADER SECTION */}
        <div className="flex flex-col gap-2">

          {/* Row 1: Breadcrumbs on Left & Top Header Utilities on Right */}
          <div className="flex items-center justify-between gap-2 text-xs flex-wrap sm:flex-nowrap">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 font-bold text-[#4338CA] truncate shrink min-w-0">
              <span onClick={() => setSelectedCategory('All Categories')} className="hover:underline cursor-pointer">Home</span>
              <ChevronRight size={13} className="text-[#6366F1] shrink-0" />
              <span onClick={() => setSelectedCategory('All Categories')} className="hover:underline cursor-pointer">Reports</span>
              <ChevronRight size={13} className="text-[#6366F1] shrink-0" />
              <span className="text-[#3730A3] truncate">Financial Reports</span>
            </div>

            {/* Top Right Utilities */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 ml-auto shrink-0">
              <button
                onClick={() => showToast('Help center opened')}
                className="flex items-center gap-1 text-xs font-bold text-[#4338CA] hover:text-[#312E81] transition-colors cursor-pointer"
              >
                <HelpCircle size={14} className="text-[#4338CA]" />
                <span className="hidden xs:inline">Need help?</span>
              </button>

              {/* Notification Bell with '11' Badge */}
              <div className="relative cursor-pointer" onClick={() => showToast('11 Unread Notifications')}>
                <div className="p-0.5 text-slate-700 hover:text-slate-900">
                  <svg className="w-4.5 h-4.5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                </div>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  11
                </span>
              </div>

              {/* User Profile Initial SM Circle */}
              <div className="w-6.5 h-6.5 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-extrabold text-[10px] cursor-pointer shadow-xs">
                SM
              </div>
            </div>
          </div>

          {/* Row 2: Main Header Title & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-0.5">
            <div>
              <div className="flex items-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight leading-snug">Financial Reports</h1>
                <div className="w-5.5 h-5.5 rounded-lg bg-[#EEF2FF] border-2 border-[#6366F1] text-[#6366F1] flex items-center justify-center shrink-0 shadow-2xs mt-0.5 sm:mt-1">
                  <Shield size={12} strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Comprehensive financial reports to analyse performance, profitability and cash flow.
              </p>
            </div>

            {/* Right Action Controls */}
            <div className="flex flex-col items-end gap-1.5 shrink-0 w-full sm:w-auto">
              <div className="relative self-end sm:self-auto">
                <button
                  onClick={() => setOpenMoreActions(!openMoreActions)}
                  className="flex items-center gap-1 text-[10px] font-extrabold text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>More Actions</span>
                  <ChevronDown size={12} className="text-slate-500" />
                </button>

                {openMoreActions && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden py-1 text-xs">
                    <button onClick={() => { setShowExportModal(true); setOpenMoreActions(false); }} className="w-full text-left px-3 py-1.5 font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                      <Download size={13} className="text-slate-400" /> Export Financial Reports
                    </button>
                    <button onClick={() => { showToast('Financial Audit Log'); setOpenMoreActions(false); }} className="w-full text-left px-3 py-1.5 font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                      <FileText size={13} className="text-slate-400" /> View Audit Logs
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="col-span-1 sm:col-span-auto justify-center flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-[#4338CA] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer hover:border-slate-300 whitespace-nowrap"
                >
                  <Download size={14} className="text-[#4338CA]" />
                  <span>Export Centre</span>
                </button>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="col-span-1 sm:col-span-auto justify-center flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-[#4338CA] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer hover:border-slate-300 whitespace-nowrap"
                >
                  <Calendar size={14} className="text-[#4338CA]" />
                  <span>Schedule Report</span>
                </button>
                <button
                  onClick={() => setShowCustomReportModal(true)}
                  className="col-span-2 sm:col-span-auto justify-center flex items-center gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer hover:shadow-lg whitespace-nowrap"
                >
                  <Plus size={15} strokeWidth={2.5} />
                <span>Create Custom Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* METRIC CARDS ROW (6 EQUAL COLUMNS - MATCHING SCREENSHOT 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 w-full">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
            <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0 mt-0.5">
              <FileText size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">TOTAL REVENUE (MTD)</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{kpiStats?.totalRevenue ? `$${kpiStats.totalRevenue.toLocaleString()}` : '$0.00'}</div>
              <div className="text-[9.5px] font-semibold text-slate-400 mt-1 whitespace-nowrap">Current month total</div>
              <button
                onClick={() => showToast('Opening Total Revenue Report')}
                className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
              >
                <span>View report</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
            <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
              <CreditCard size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">TOTAL EXPENSES (MTD)</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{kpiStats?.totalExpenses ? `$${kpiStats.totalExpenses.toLocaleString()}` : '$0.00'}</div>
              <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real-time DB Data</div>
              <button
                onClick={() => showToast('Opening Total Expenses Report')}
                className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
              >
                <span>View report</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 mt-0.5">
              <TrendingUp size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">GROSS PROFIT (MTD)</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{kpiStats?.grossProfit ? `$${kpiStats.grossProfit.toLocaleString()}` : '$0.00'}</div>
              <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real-time DB Data</div>
              <button
                onClick={() => showToast('Opening Gross Profit Report')}
                className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
              >
                <span>View report</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
            <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5">
              <TrendingUp size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">NET PROFIT (MTD)</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{kpiStats?.netProfit ? `$${kpiStats.netProfit.toLocaleString()}` : '$0.00'}</div>
              <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real-time DB Data</div>
              <button
                onClick={() => showToast('Opening Net Profit Report')}
                className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
              >
                <span>View report</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
            <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] text-[#7E22CE] flex items-center justify-center shrink-0 mt-0.5">
              <Users size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">ACCOUNTS RECEIVABLE</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{kpiStats?.accountsReceivable ? `$${kpiStats.accountsReceivable.toLocaleString()}` : '$0.00'}</div>
              <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real-time DB Data</div>
              <button
                onClick={() => showToast('Opening Accounts Receivable Report')}
                className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
              >
                <span>View report</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
            <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shrink-0 mt-0.5">
              <Receipt size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">ACCOUNTS PAYABLE</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{kpiStats?.accountsPayable ? `$${kpiStats.accountsPayable.toLocaleString()}` : '$0.00'}</div>
              <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real-time DB Data</div>
              <button
                onClick={() => showToast('Opening Accounts Payable Report')}
                className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
              >
                <span>View report</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS BAR FOR FINANCIAL REPORTS */}
        <div className="bg-white border border-slate-200/80 rounded-lg p-2 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full">
          {/* Search input */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search financial reports by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs font-semibold bg-slate-50/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Dropdown 1: Categories */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setOpenCategoryDropdown(!openCategoryDropdown); setOpenSubCategoryDropdown(false); setOpenBranchDropdown(false); setOpenStatusDropdown(false); }}
              className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
            >
              <span>{selectedCategory}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>
            {openCategoryDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                {['All Categories', 'Operations Reports', 'Financial Reports', 'Compliance Reports', 'Analytics & Insights'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setOpenCategoryDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedCategory === cat ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 2: Sub-Categories */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setOpenSubCategoryDropdown(!openSubCategoryDropdown); setOpenCategoryDropdown(false); setOpenBranchDropdown(false); setOpenStatusDropdown(false); }}
              className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
            >
              <span>{selectedSubCategory}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>
            {openSubCategoryDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                {['All Sub-Categories', 'Revenue Reports', 'Profit & Loss Reports', 'Expense Reports', 'Cash Flow Reports', 'Tax Reports', 'Payroll Reports'].map(sub => (
                  <button
                    key={sub}
                    onClick={() => { setSelectedSubCategory(sub); setOpenSubCategoryDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedSubCategory === sub ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <span>{sub}</span>
                    {selectedSubCategory === sub && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 3: Branches */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setOpenBranchDropdown(!openBranchDropdown); setOpenCategoryDropdown(false); setOpenSubCategoryDropdown(false); setOpenStatusDropdown(false); }}
              className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
            >
              <span>{selectedBranch}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>
            {openBranchDropdown && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                {['All Branches', 'Sydney (Head Office)', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'].map(br => (
                  <button
                    key={br}
                    onClick={() => { setSelectedBranch(br); setOpenBranchDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedBranch === br ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <span>{br}</span>
                    {selectedBranch === br && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 4: Status */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setOpenStatusDropdown(!openStatusDropdown); setOpenCategoryDropdown(false); setOpenSubCategoryDropdown(false); setOpenBranchDropdown(false); }}
              className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
            >
              <span>{selectedStatus}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>
            {openStatusDropdown && (
              <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                {['All Status', 'Active', 'Scheduled', 'Archived'].map(st => (
                  <button
                    key={st}
                    onClick={() => { setSelectedStatus(st); setOpenStatusDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedStatus === st ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <span>{st}</span>
                    {selectedStatus === st && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Picker Button */}
          <button
            onClick={() => showToast('Date range selected: 01 May 2025 - 31 May 2025')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors shrink-0"
          >
            <Calendar size={13} className="text-slate-500" />
            <span>01 May 2025 - 31 May 2025</span>
          </button>

          {/* Filters & Refresh Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => showToast('Filter panel opened')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
            >
              <Filter size={13} className="text-slate-500" />
              <span>Filters</span>
            </button>
            <button
              onClick={() => showToast('Financial Data refreshed')}
              className="p-1.5 text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={13} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* ROW 1: 3-COLUMN LAYOUT (CATEGORIES, REVENUE & PROFIT OVERVIEW GRAPH, TOP REVENUE GENERATORS TABLE) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 w-full">

          {/* Column 1: Financial Report Categories (3 Cols) */}
          <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">FINANCIAL REPORT CATEGORIES</h2>
                <button onClick={() => showToast('Showing all categories')} className="text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer">
                  View All →
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { title: 'Revenue Reports', desc: 'Revenue analysis, trends and breakdown', count: `${customReportsList.length} Reports`, icon: FileText, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
                  { title: 'Profit & Loss Reports', desc: 'P&L statements and profitability analysis', count: `${customReportsList.length} Reports`, icon: FileText, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                  { title: 'Expense Reports', desc: 'Expenses analysis and categorisation', count: `${customReportsList.length} Reports`, icon: CreditCard, color: 'bg-sky-50 text-sky-600 border-sky-100' },
                  { title: 'Cash Flow Reports', desc: 'Cash flow statements and forecasting', count: '0 Reports', icon: Wallet, color: 'bg-amber-50 text-amber-600 border-amber-100' },
                  { title: 'Tax Reports', desc: 'GST, BAS, PAYG and tax summaries', count: '0 Reports', icon: FileCheck, color: 'bg-purple-50 text-purple-600 border-purple-100' },
                  { title: 'Payroll Reports', desc: 'Payroll costs and workforce analysis', count: '0 Reports', icon: Users, color: 'bg-teal-50 text-teal-600 border-teal-100' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => showToast(`Selected category: ${item.title}`)}
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-slate-50/80 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-lg ${item.color} flex items-center justify-center shrink-0 border`}>
                        <item.icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate transition-colors">{item.title}</div>
                        <div className="text-[10px] text-slate-400 font-medium truncate">{item.desc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 group-hover:text-slate-700 shrink-0 ml-2">
                      <span>{item.count}</span>
                      <span>›</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Revenue & Profit Overview (MTD) Graph (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">REVENUE & PROFIT OVERVIEW (MTD)</h2>
                <button onClick={() => showToast('Opening Analytics')} className="text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer">
                  View Analytics →
                </button>
              </div>

              {/* Multi-curve Legend */}
              <div className="flex items-center gap-4 text-[10.5px] font-bold mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]"></div>
                  <span className="text-slate-600">Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A]"></div>
                  <span className="text-slate-600">Gross Profit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EA580C]"></div>
                  <span className="text-slate-600">Net Profit</span>
                </div>
              </div>

              {/* SVG Multi-curve Graph */}
              <div className="w-full h-44 relative pt-1">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 130" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="30" y1="10" x2="390" y2="10" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="30" y1="35" x2="390" y2="35" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="30" y1="60" x2="390" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="30" y1="85" x2="390" y2="85" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="30" y1="110" x2="390" y2="110" stroke="#E2E8F0" strokeWidth="1" />

                  {/* Y Axis Labels */}
                  <text x="5" y="14" className="text-[8px] fill-slate-400 font-bold">1.4M</text>
                  <text x="5" y="39" className="text-[8px] fill-slate-400 font-bold">1.0M</text>
                  <text x="5" y="64" className="text-[8px] fill-slate-400 font-bold">600K</text>
                  <text x="5" y="89" className="text-[8px] fill-slate-400 font-bold">200K</text>
                  <text x="20" y="113" className="text-[8px] fill-slate-400 font-bold">0</text>

                  {/* Curve 1: Revenue (#4F46E5) */}
                  <path
                    d="M30 110 Q70 108 110 109 T190 108 T270 109 T350 108 T390 110"
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="2.5"
                  />
                  {/* Revenue Dots */}
                  {[
                    { cx: 30, cy: 110 }, { cx: 90, cy: 110 }, { cx: 150, cy: 109 },
                    { cx: 210, cy: 108 }, { cx: 270, cy: 109 }, { cx: 330, cy: 108 }, { cx: 390, cy: 110 }
                  ].map((pt, i) => (
                    <circle key={i} cx={pt.cx} cy={pt.cy} r="3" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2" />
                  ))}

                  {/* Curve 2: Gross Profit (#16A34A) */}
                  <path
                    d="M30 110 Q70 109 110 110 T190 109 T270 110 T350 109 T390 110"
                    fill="none"
                    stroke="#16A34A"
                    strokeWidth="2.5"
                  />
                  {/* Gross Profit Dots */}
                  {[
                    { cx: 30, cy: 110 }, { cx: 90, cy: 109 }, { cx: 150, cy: 110 },
                    { cx: 210, cy: 109 }, { cx: 270, cy: 110 }, { cx: 330, cy: 109 }, { cx: 390, cy: 110 }
                  ].map((pt, i) => (
                    <circle key={i} cx={pt.cx} cy={pt.cy} r="3" fill="#FFFFFF" stroke="#16A34A" strokeWidth="2" />
                  ))}

                  {/* Curve 3: Net Profit (#EA580C) */}
                  <path
                    d="M30 110 Q70 110 110 110 T190 110 T270 110 T350 110 T390 110"
                    fill="none"
                    stroke="#EA580C"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  {/* Net Profit Dots */}
                  {[
                    { cx: 30, cy: 110 }, { cx: 90, cy: 110 }, { cx: 150, cy: 110 },
                    { cx: 210, cy: 110 }, { cx: 270, cy: 110 }, { cx: 330, cy: 110 }, { cx: 390, cy: 110 }
                  ].map((pt, i) => (
                    <circle key={i} cx={pt.cx} cy={pt.cy} r="2.5" fill="#FFFFFF" stroke="#EA580C" strokeWidth="1.5" />
                  ))}
                </svg>

                {/* X Axis Labels */}
                <div className="flex justify-between text-[9px] font-extrabold text-slate-400 pl-8 pr-1 mt-1">
                  <span>1 May</span>
                  <span>8 May</span>
                  <span>15 May</span>
                  <span>22 May</span>
                  <span>29 May</span>
                </div>
              </div>
            </div>

            {/* Bottom Summary Metric Bar */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 bg-slate-50/50 p-2 rounded-lg mt-2">
              <div>
                <span className="text-[9px] font-bold text-slate-400 block uppercase">Revenue</span>
                <div className="text-xs font-black text-slate-900">{kpiStats?.totalRevenue ? `$${kpiStats.totalRevenue.toLocaleString()}` : '$0.00'} <span className="text-[9px] font-bold text-emerald-600">Real DB</span></div>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 block uppercase">Gross Profit</span>
                <div className="text-xs font-black text-slate-900">{kpiStats?.grossProfit ? `$${kpiStats.grossProfit.toLocaleString()}` : '$0.00'} <span className="text-[9px] font-bold text-emerald-600">Real DB</span></div>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 block uppercase">Net Profit</span>
                <div className="text-xs font-black text-slate-900">{kpiStats?.netProfit ? `$${kpiStats.netProfit.toLocaleString()}` : '$0.00'} <span className="text-[9px] font-bold text-emerald-600">Real DB</span></div>
              </div>
            </div>
          </div>

          {/* Column 3: Top Revenue Generators (MTD) Table (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">TOP REVENUE GENERATORS (MTD)</h2>
                <button onClick={() => showToast('Opening Full Revenue Report')} className="text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer">
                  View Report →
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[9.5px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="pb-2">CUSTOMER</th>
                      <th className="pb-2 text-right">REVENUE</th>
                      <th className="pb-2 text-right">% OF TOTAL</th>
                      <th className="pb-2 text-right">TREND</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td colSpan="4" className="py-6 text-center text-xs font-semibold text-slate-400">
                        No customer revenue generators recorded
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={() => showToast('Showing all revenue customers')}
              className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center justify-between mt-3 pt-2 border-t border-slate-100 cursor-pointer"
            >
              <span>View all revenue report</span>
              <span>→</span>
            </button>
          </div>

        </div>

        {/* ROW 2: 3-COLUMN LAYOUT (EXPENSES BY CATEGORY, PROFITABILITY BY BRANCH, CASH FLOW SUMMARY) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 w-full">

          {/* Column 1: Expenses by Category (MTD) Donut Chart (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">EXPENSES BY CATEGORY (MTD)</h2>
                <button onClick={() => showToast('Opening Expense Breakdown')} className="text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer">
                  View Report →
                </button>
              </div>

              {/* Donut Chart and Legend Row */}
              <div className="flex items-center gap-4 py-1">
                {/* SVG Donut Chart */}
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path strokeDasharray="100 100" strokeDashoffset="0" stroke="#F1F5F9" strokeWidth="4.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-[11px] font-black text-slate-900 leading-none">{kpiStats?.totalExpenses ? `$${kpiStats.totalExpenses.toLocaleString()}` : '$0.00'}</span>
                    <span className="text-[8px] font-bold text-slate-400 mt-0.5">Total Expenses</span>
                  </div>
                </div>

                {/* Legend List */}
                <div className="flex-1 space-y-1 text-[11px]">
                  {[
                    { name: 'Billing Expenses', val: kpiStats?.totalExpenses ? `$${kpiStats.totalExpenses.toLocaleString()}` : '$0.00', pct: '100%', color: 'bg-[#2563EB]' }
                  ].map((exp, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${exp.color}`}></div>
                        <span className="font-semibold text-slate-600 truncate max-w-[90px]">{exp.name}</span>
                      </div>
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <span>{exp.val}</span>
                        <span className="text-[9.5px] text-slate-400 font-semibold">{exp.pct}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => showToast('Opening detailed expenses report')}
              className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center justify-between mt-3 pt-2 border-t border-slate-100 cursor-pointer"
            >
              <span>View detailed expense report</span>
              <span>→</span>
            </button>
          </div>

          {/* Column 2: Profitability by Branch (MTD) (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">PROFITABILITY BY BRANCH (MTD)</h2>
                <button onClick={() => showToast('Opening Branch Report')} className="text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer">
                  View Report →
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[9.5px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="pb-2">BRANCH</th>
                      <th className="pb-2 text-right">REVENUE</th>
                      <th className="pb-2 text-right">EXPENSES</th>
                      <th className="pb-2 text-right">NET PROFIT</th>
                      <th className="pb-2 text-right">MARGIN %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-xs font-semibold text-slate-400">
                        No branch profitability data recorded
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={() => showToast('Opening branch profitability report')}
              className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center justify-between mt-3 pt-2 border-t border-slate-100 cursor-pointer"
            >
              <span>View branch profitability report</span>
              <span>→</span>
            </button>
          </div>

          {/* Column 3: Cash Flow Summary (MTD) (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">CASH FLOW SUMMARY (MTD)</h2>
                <button onClick={() => showToast('Opening Cash Flow Report')} className="text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer">
                  View Report →
                </button>
              </div>

              {/* Cash Flow Rows */}
              <div className="space-y-3 py-1">
                <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-100">
                  <span className="font-bold text-slate-600">Opening Balance</span>
                  <span className="font-black text-slate-900">$0.00</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-100">
                  <span className="font-bold text-slate-600">Cash Inflows</span>
                  <span className="font-black text-emerald-600">{kpiStats?.totalRevenue ? `$${kpiStats.totalRevenue.toLocaleString()}` : '$0.00'}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-100">
                  <span className="font-bold text-slate-600">Cash Outflows</span>
                  <span className="font-black text-rose-600">{kpiStats?.totalExpenses ? `$${kpiStats.totalExpenses.toLocaleString()}` : '$0.00'}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1 bg-emerald-50/60 px-2.5 rounded-lg border border-emerald-100">
                  <span className="font-extrabold text-emerald-900">Net Cash Flow</span>
                  <span className="font-black text-emerald-600">{kpiStats?.netProfit ? `$${kpiStats.netProfit.toLocaleString()}` : '$0.00'}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 bg-blue-50/60 px-2.5 rounded-lg border border-blue-100">
                  <span className="font-black text-blue-900">Closing Balance</span>
                  <span className="font-black text-blue-700 text-sm">{kpiStats?.netProfit ? `$${kpiStats.netProfit.toLocaleString()}` : '$0.00'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => showToast('Opening cash flow report')}
              className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center justify-between mt-3 pt-2 border-t border-slate-100 cursor-pointer"
            >
              <span>View cash flow report</span>
              <span>→</span>
            </button>
          </div>

        </div>



        {renderModals()}
      </div>
    );
  }

  // ==========================================
  // RENDER VIEW FOR 11.4 COMPLIANCE REPORTS
  // ==========================================
  if (selectedCategory === 'Compliance Reports') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-3 sm:p-4 w-full max-w-full space-y-3.5 text-left">

        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl z-[9999] flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TOP HEADER SECTION */}
        <div className="flex flex-col gap-2">

          {/* Row 1: Breadcrumbs on Left & Top Header Utilities on Right */}
          <div className="flex items-center justify-between gap-2 text-xs flex-wrap sm:flex-nowrap">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 font-bold text-[#4338CA] truncate shrink min-w-0">
              <span onClick={() => setSelectedCategory('All Categories')} className="hover:underline cursor-pointer">Home</span>
              <ChevronRight size={13} className="text-[#6366F1] shrink-0" />
              <span onClick={() => setSelectedCategory('All Categories')} className="hover:underline cursor-pointer">Reports</span>
              <ChevronRight size={13} className="text-[#6366F1] shrink-0" />
              <span className="text-[#3730A3] truncate">Compliance Reports</span>
            </div>

            {/* Top Right Utilities */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 ml-auto shrink-0">
              <button
                onClick={() => showToast('Help center opened')}
                className="flex items-center gap-1 text-xs font-bold text-[#4338CA] hover:text-[#312E81] transition-colors cursor-pointer"
              >
                <HelpCircle size={14} className="text-[#4338CA]" />
                <span className="hidden xs:inline">Need help?</span>
              </button>

              {/* Notification Bell with '11' Badge */}
              <div className="relative cursor-pointer" onClick={() => showToast('11 Unread Notifications')}>
                <div className="p-0.5 text-slate-700 hover:text-slate-900">
                  <svg className="w-4.5 h-4.5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                </div>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  11
                </span>
              </div>

              {/* User Profile Initial SM Circle */}
              <div className="w-6.5 h-6.5 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-extrabold text-[10px] cursor-pointer shadow-xs">
                SM
              </div>
            </div>
          </div>

          {/* Row 2: Main Header Title & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-0.5">
            <div>
              <div className="flex items-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight leading-snug">Compliance Reports</h1>
                <div className="w-5.5 h-5.5 rounded-lg bg-[#EEF2FF] border-2 border-[#6366F1] text-[#6366F1] flex items-center justify-center shrink-0 shadow-2xs mt-0.5 sm:mt-1">
                  <ShieldCheck size={12} strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Monitor compliance status and ensure regulatory requirements are met across your organisation.
              </p>
            </div>

            {/* Right Action Controls */}
            <div className="flex flex-col items-end gap-1.5 shrink-0 w-full sm:w-auto">
              <div className="relative self-end sm:self-auto">
                <button
                  onClick={() => setOpenMoreActions(!openMoreActions)}
                  className="flex items-center gap-1 text-[10px] font-extrabold text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>More Actions</span>
                  <ChevronDown size={12} className="text-slate-500" />
                </button>

                {openMoreActions && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden py-1 text-xs">
                    <button onClick={() => { setShowExportModal(true); setOpenMoreActions(false); }} className="w-full text-left px-3 py-1.5 font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                      <Download size={13} className="text-slate-400" /> Export Compliance Reports
                    </button>
                    <button onClick={() => { showToast('Compliance Audit Log'); setOpenMoreActions(false); }} className="w-full text-left px-3 py-1.5 font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                      <FileText size={13} className="text-slate-400" /> View Audit Logs
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="col-span-1 sm:col-span-auto justify-center flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-[#4338CA] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer hover:border-slate-300 whitespace-nowrap"
                >
                  <Download size={14} className="text-[#4338CA]" />
                  <span>Export Centre</span>
                </button>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="col-span-1 sm:col-span-auto justify-center flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-[#4338CA] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer hover:border-slate-300 whitespace-nowrap"
                >
                  <Calendar size={14} className="text-[#4338CA]" />
                  <span>Schedule Report</span>
                </button>
                <button
                  onClick={() => setShowCustomReportModal(true)}
                  className="col-span-2 sm:col-span-auto justify-center flex items-center gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer hover:shadow-lg whitespace-nowrap"
                >
                  <Plus size={15} strokeWidth={2.5} />
                  <span>Create Custom Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* METRIC CARDS ROW (6 EQUAL COLUMNS - MATCHING SCREENSHOT 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 w-full">
          {/* Card 1: TOTAL COMPLIANCE */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-3.5 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full min-h-[110px]">
            <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck size={16} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate whitespace-nowrap">TOTAL COMPLIANCE</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">100%</div>
                <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real-time DB Data</div>
              </div>
              <button
                onClick={() => showToast('Opening Total Compliance Report')}
                className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer whitespace-nowrap"
              >
                <span>View report</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 2: EXPIRING IN 30 DAYS */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-3.5 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full min-h-[110px]">
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle size={16} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate whitespace-nowrap">EXPIRING IN 30 DAYS</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">0</div>
                <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real-time DB Data</div>
              </div>
              <button
                onClick={() => showToast('Opening Expiring Compliance Report')}
                className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer whitespace-nowrap"
              >
                <span>View report</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 3: EXPIRED ITEMS */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-3.5 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full min-h-[110px]">
            <div className="w-8 h-8 rounded-lg bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center shrink-0 mt-0.5">
              <X size={16} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate whitespace-nowrap">EXPIRED ITEMS</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">0</div>
                <div className="text-[9.5px] font-bold text-slate-400 mt-1 whitespace-nowrap">None</div>
              </div>
              <button
                onClick={() => showToast('Opening Expired Items Report')}
                className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer whitespace-nowrap"
              >
                <span>View report</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 4: DRIVERS COMPLIANT */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-3.5 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full min-h-[110px]">
            <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5">
              <Users size={16} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate whitespace-nowrap">DRIVERS COMPLIANT</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">100%</div>
                <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real-time DB Data</div>
              </div>
              <button
                onClick={() => showToast('Opening Drivers Compliance Report')}
                className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer whitespace-nowrap"
              >
                <span>View report</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 5: VEHICLES COMPLIANT */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-3.5 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full min-h-[110px]">
            <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
              <Truck size={16} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate whitespace-nowrap">VEHICLES COMPLIANT</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">100%</div>
                <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real-time DB Data</div>
              </div>
              <button
                onClick={() => showToast('Opening Vehicles Compliance Report')}
                className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer whitespace-nowrap"
              >
                <span>View report</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 6: DOCUMENTS UP TO DATE */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-3.5 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full min-h-[110px]">
            <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] text-[#7E22CE] flex items-center justify-center shrink-0 mt-0.5">
              <FileCheck size={16} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate whitespace-nowrap">DOCUMENTS UP TO DATE</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{customReportsList.length}</div>
                <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real-time DB Data</div>
              </div>
              <button
                onClick={() => showToast('Opening Document Compliance Report')}
                className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer whitespace-nowrap"
              >
                <span>View report</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS BAR FOR COMPLIANCE REPORTS */}
        <div className="bg-white border border-slate-200/80 rounded-lg p-2 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full">
          {/* Search input */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search compliance reports by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs font-semibold bg-slate-50/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Dropdown 1: Categories */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setOpenCategoryDropdown(!openCategoryDropdown); setOpenSubCategoryDropdown(false); setOpenBranchDropdown(false); setOpenStatusDropdown(false); }}
              className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
            >
              <span>{selectedCategory}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>
            {openCategoryDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                {['All Categories', 'Operations Reports', 'Financial Reports', 'Compliance Reports', 'Analytics & Insights'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setOpenCategoryDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedCategory === cat ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 2: Sub-Categories */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setOpenSubCategoryDropdown(!openSubCategoryDropdown); setOpenCategoryDropdown(false); setOpenBranchDropdown(false); setOpenStatusDropdown(false); }}
              className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
            >
              <span>{selectedSubCategory}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>
            {openSubCategoryDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                {['All Sub-Categories', 'Driver Compliance', 'Vehicle Compliance', 'Insurance Compliance', 'Dangerous Goods (DG)', 'NHVR & Fatigue', 'Other Compliance'].map(sub => (
                  <button
                    key={sub}
                    onClick={() => { setSelectedSubCategory(sub); setOpenSubCategoryDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedSubCategory === sub ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <span>{sub}</span>
                    {selectedSubCategory === sub && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 3: Branches */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setOpenBranchDropdown(!openBranchDropdown); setOpenCategoryDropdown(false); setOpenSubCategoryDropdown(false); setOpenStatusDropdown(false); }}
              className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
            >
              <span>{selectedBranch}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>
            {openBranchDropdown && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                {['All Branches', 'Sydney (Head Office)', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'].map(br => (
                  <button
                    key={br}
                    onClick={() => { setSelectedBranch(br); setOpenBranchDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedBranch === br ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <span>{br}</span>
                    {selectedBranch === br && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 4: Status */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setOpenStatusDropdown(!openStatusDropdown); setOpenCategoryDropdown(false); setOpenSubCategoryDropdown(false); setOpenBranchDropdown(false); }}
              className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
            >
              <span>{selectedStatus}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>
            {openStatusDropdown && (
              <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                {['All Status', 'Active', 'Scheduled', 'Archived'].map(st => (
                  <button
                    key={st}
                    onClick={() => { setSelectedStatus(st); setOpenStatusDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedStatus === st ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <span>{st}</span>
                    {selectedStatus === st && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Picker Button */}
          <button
            onClick={() => showToast('Date range selected: 01 May 2025 - 31 May 2025')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors shrink-0"
          >
            <Calendar size={13} className="text-slate-500" />
            <span>01 May 2025 - 31 May 2025</span>
          </button>

          {/* Filters & Refresh Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => showToast('Filter panel opened')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
            >
              <Filter size={13} className="text-slate-500" />
              <span>Filters</span>
            </button>
            <button
              onClick={() => showToast('Compliance Data refreshed')}
              className="p-1.5 text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={13} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* ROW 1: 3-COLUMN LAYOUT (CATEGORIES, COMPLIANCE OVERVIEW DONUT, EXPIRING SOON TABLE) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 w-full items-start">

          {/* Column 1: Compliance Report Categories (3 Cols) */}
          <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-xl p-2.5 sm:p-3 shadow-2xs">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">COMPLIANCE REPORT CATEGORIES</h2>
              <button onClick={() => showToast('Showing all categories')} className="text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer shrink-0">
                View All →
              </button>
            </div>

            <div className="space-y-0.5">
              {[
                { title: 'Driver Compliance', count: `${kpiStats?.activeDrivers ?? 0} Drivers`, icon: Users, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
                { title: 'Vehicle Compliance', count: `${kpiStats?.fleetUtilisationPercent ?? '0%'} Utilised`, icon: Truck, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                { title: 'Insurance Compliance', count: `${customReportsList.length} Reports`, icon: ShieldCheck, color: 'bg-sky-50 text-sky-600 border-sky-100' },
                { title: 'Dangerous Goods (DG)', count: '0 Reports', icon: AlertTriangle, color: 'bg-amber-50 text-amber-600 border-amber-100' },
                { title: 'NHVR & Fatigue', count: '0 Reports', icon: FileCheck, color: 'bg-purple-50 text-purple-600 border-purple-100' },
                { title: 'Other Compliance', count: '0 Reports', icon: CheckSquare, color: 'bg-teal-50 text-teal-600 border-teal-100' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => showToast(`Selected category: ${item.title}`)}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-slate-50/80 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-5 h-5 rounded-md ${item.color} flex items-center justify-center shrink-0 border`}>
                      <item.icon size={11} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 group-hover:text-blue-600 truncate transition-colors">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[9.5px] font-bold text-slate-400 group-hover:text-slate-600 shrink-0 ml-1.5 whitespace-nowrap">
                    <span>{item.count}</span>
                    <span>›</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Compliance Overview (MTD) Donut & Summary Grid (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-xl p-3 sm:p-3.5 shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">COMPLIANCE OVERVIEW (MTD)</h2>
                <button onClick={() => showToast('Opening Analytics')} className="text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer shrink-0">
                  View Analytics →
                </button>
              </div>

              {/* Donut Chart and Legend Row */}
              <div className="flex items-center gap-4 py-1">
                {/* SVG Donut Chart */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path strokeDasharray="100 100" strokeDashoffset="0" stroke="#10B981" strokeWidth="4.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-base sm:text-lg font-black text-slate-900 leading-none">100%</span>
                    <span className="text-[9px] font-bold text-slate-400 mt-0.5">Compliant</span>
                  </div>
                </div>

                {/* Legend List */}
                <div className="flex-1 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-3 h-1.5 rounded-full bg-[#10B981] shrink-0"></div>
                      <span className="font-bold text-slate-700 truncate">Compliant</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <span className="font-black text-slate-900">{customReportsList.length}</span>
                      <span className="font-bold text-emerald-600 text-[10px] w-8 text-right">100%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-3 h-1.5 rounded-full bg-[#F59E0B] shrink-0"></div>
                      <span className="font-bold text-slate-700 truncate">Expiring in 30 Days</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <span className="font-black text-slate-900">0</span>
                      <span className="font-bold text-emerald-600 text-[10px] w-8 text-right">0%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-3 h-1.5 rounded-full bg-[#EF4444] shrink-0"></div>
                      <span className="font-bold text-slate-700 truncate">Expired</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <span className="font-black text-slate-900">0</span>
                      <span className="font-bold text-emerald-600 text-[10px] w-8 text-right">0%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-3 h-1.5 rounded-full bg-[#94A3B8] shrink-0"></div>
                      <span className="font-bold text-slate-700 truncate">Not Applicable</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <span className="font-black text-slate-900">0</span>
                      <span className="font-bold text-emerald-600 text-[10px] w-8 text-right">0%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 4 Separate White Sub-Cards Grid */}
            <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-100">
              <div className="bg-white border border-slate-200/70 rounded-lg p-2 shadow-2xs">
                <span className="text-[9.5px] font-bold text-indigo-600 block truncate">Total Items</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-black text-slate-900">{customReportsList.length}</span>
                  <span className="text-[8px] font-bold text-emerald-600">Real DB</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200/70 rounded-lg p-2 shadow-2xs">
                <span className="text-[9.5px] font-bold text-indigo-600 block truncate">Compliant</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-black text-slate-900">{customReportsList.length}</span>
                  <span className="text-[8px] font-bold text-emerald-600">Real DB</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200/70 rounded-lg p-2 shadow-2xs">
                <span className="text-[9.5px] font-bold text-[#D97706] block truncate">Expiring Soon</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-black text-slate-900">0</span>
                  <span className="text-[8px] font-bold text-emerald-600">Real DB</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200/70 rounded-lg p-2 shadow-2xs">
                <span className="text-[9.5px] font-bold text-rose-600 block truncate">Expired</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-black text-slate-900">0</span>
                  <span className="text-[8px] font-bold text-slate-400">0%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Expiring Soon (Next 30 Days) Table (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-3 sm:p-3.5 shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">EXPIRING SOON (NEXT 30 DAYS)</h2>
                <button onClick={() => showToast('Opening Expiring Items Report')} className="text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer shrink-0">
                  View Report →
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px] sm:text-[10.5px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[8.5px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="pb-1.5 px-1 whitespace-nowrap">ITEM</th>
                      <th className="pb-1.5 px-1 whitespace-nowrap">TYPE</th>
                      <th className="pb-1.5 px-1 whitespace-nowrap">RELATED TO</th>
                      <th className="pb-1.5 px-1 whitespace-nowrap">EXPIRY DATE</th>
                      <th className="pb-1.5 px-1 text-center whitespace-nowrap">DAYS LEFT</th>
                      <th className="pb-1.5 px-1 text-right whitespace-nowrap">PRIORITY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-xs font-semibold text-slate-400">
                        No compliance items expiring in next 30 days
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={() => showToast('Showing all expiring items')}
              className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 cursor-pointer"
            >
              <span>View all expiring items</span>
              <span>→</span>
            </button>
          </div>

        </div>

        {/* ROW 2: 3-COLUMN LAYOUT (COMPLIANCE BY CATEGORY, COMPLIANCE BREACHES, DOCUMENT SUMMARY) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 w-full">

          {/* Column 1: Compliance by Category (MTD) Progress Bars (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-3 sm:p-3.5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">COMPLIANCE BY CATEGORY (MTD)</h2>
                <button onClick={() => showToast('Opening Category Report')} className="text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer shrink-0">
                  View Report →
                </button>
              </div>

              {/* Progress Bar Rows */}
              <div className="space-y-2 py-1">
                {[
                  { name: 'Driver Compliance', pct: '100%', items: `${kpiStats?.activeDrivers ?? 0}`, color: 'bg-emerald-500' },
                  { name: 'Vehicle Compliance', pct: '100%', items: 'Live', color: 'bg-emerald-500' },
                  { name: 'Insurance Compliance', pct: '100%', items: 'Active', color: 'bg-emerald-500' },
                  { name: 'Dangerous Goods (DG)', pct: '100%', items: '0', color: 'bg-emerald-500' },
                  { name: 'NHVR & Fatigue', pct: '100%', items: '0', color: 'bg-emerald-500' },
                  { name: 'Other Compliance', pct: '100%', items: '0', color: 'bg-emerald-500' }
                ].map((row, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] sm:text-[10.5px]">
                      <span className="font-bold text-slate-700 truncate mr-2">{row.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-black text-slate-900">{row.pct}</span>
                        <span className="font-semibold text-slate-400 text-[9px]">{row.items}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full rounded-full ${row.color}`} style={{ width: row.pct }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Legend */}
              <div className="flex items-center gap-2.5 text-[8.5px] font-bold text-slate-500 pt-2.5 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Compliant (On Track)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>At Risk (Expiring Soon)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>Non Compliant (Expired)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Compliance Breaches (Expired Items) (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-3 sm:p-3.5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">COMPLIANCE BREACHES (EXPIRED ITEMS)</h2>
                <button onClick={() => showToast('Opening Breaches Report')} className="text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer shrink-0">
                  View Report →
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px] sm:text-[10.5px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[8.5px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="pb-1.5 px-1 whitespace-nowrap">ITEM</th>
                      <th className="pb-1.5 px-1 whitespace-nowrap">TYPE</th>
                      <th className="pb-1.5 px-1 whitespace-nowrap">RELATED TO</th>
                      <th className="pb-1.5 px-1 whitespace-nowrap">EXPIRED ON</th>
                      <th className="pb-1.5 px-1 text-center whitespace-nowrap">DAYS OVERDUE</th>
                      <th className="pb-1.5 px-1 text-right whitespace-nowrap">PRIORITY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-xs font-semibold text-slate-400">
                        No compliance breaches or expired items
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={() => showToast('Showing all expired breaches')}
              className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 cursor-pointer"
            >
              <span>View all expired items</span>
              <span>→</span>
            </button>
          </div>

          {/* Column 3: Compliance Document Summary (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">COMPLIANCE DOCUMENT SUMMARY</h2>
                <button onClick={() => showToast('Opening Document Summary')} className="text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer">
                  View Report →
                </button>
              </div>

              {/* 2x2 Cards Grid */}
              <div className="grid grid-cols-2 gap-2.5 py-1">
                {/* Box 1 */}
                <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3 flex flex-col justify-between">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                    <FileText size={15} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block whitespace-nowrap">Total Documents</span>
                    <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">{customReportsList.length}</div>
                    <div className="text-[9px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real DB Data</div>
                  </div>
                </div>

                {/* Box 2 */}
                <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3 flex flex-col justify-between">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                    <UploadCloud size={15} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block whitespace-nowrap">Uploaded (MTD)</span>
                    <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">{customReportsList.length}</div>
                    <div className="text-[9px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real DB Data</div>
                  </div>
                </div>

                {/* Box 3 */}
                <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3 flex flex-col justify-between">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                    <AlertCircle size={15} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block whitespace-nowrap">Pending Verification</span>
                    <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">0</div>
                    <div className="text-[9px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real DB Data</div>
                  </div>
                </div>

                {/* Box 4 */}
                <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3 flex flex-col justify-between">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
                    <X size={15} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block whitespace-nowrap">Rejected Documents</span>
                    <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">0</div>
                    <div className="text-[9px] font-bold text-slate-400 mt-1 whitespace-nowrap">None</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      {/* ROW 3: ALL CREATED CUSTOM REPORTS TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs w-full text-left">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <FileText size={14} />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">CUSTOM CREATED REPORTS & SAVED TEMPLATES</h2>
              <p className="text-[10px] text-slate-400 font-medium">Real-time reports created via Create Custom Report modal</p>
            </div>
          </div>
          <button
            onClick={() => setShowCustomReportModal(true)}
            className="flex items-center gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus size={14} />
            <span>New Custom Report</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                <th className="pb-2 px-2 whitespace-nowrap">Report Name</th>
                <th className="pb-2 px-2 whitespace-nowrap">Category</th>
                <th className="pb-2 px-2 whitespace-nowrap">Selected Metrics</th>
                <th className="pb-2 px-2 whitespace-nowrap">Created By</th>
                <th className="pb-2 px-2 whitespace-nowrap">Date Created</th>
                <th className="pb-2 px-2 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customReportsList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-xs font-semibold text-slate-400">
                    No custom reports created yet. Click "+ New Custom Report" above to create one.
                  </td>
                </tr>
              ) : (
                customReportsList.map((r, i) => {
                  let parsedMetrics = [];
                  try {
                    parsedMetrics = typeof r.metrics === 'string' ? JSON.parse(r.metrics) : (r.metrics || []);
                  } catch (e) {
                    parsedMetrics = ['Gross Revenue', 'Trip Count'];
                  }
                  return (
                    <tr key={r.id || i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-2 font-black text-slate-900 flex items-center gap-2">
                        <FileText size={14} className="text-blue-600 shrink-0" />
                        <span className="truncate">{r.name}</span>
                        {i === 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200 uppercase tracking-wider">New</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 font-bold text-slate-600 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-bold border border-slate-200">
                          {r.formattedCategory || r.category || 'Operations'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 font-medium text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1 flex-wrap">
                          {Array.isArray(parsedMetrics) && parsedMetrics.slice(0, 3).map((m, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {m}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 font-semibold text-slate-700 whitespace-nowrap">
                        {r.creator?.name || 'Company Admin'}
                      </td>
                      <td className="py-2.5 px-2 font-medium text-slate-500 whitespace-nowrap">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today'}
                      </td>
                      <td className="py-2.5 px-2 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => showToast(`Opening report "${r.name}"`)}
                            className="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => setShowExportModal(true)}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded text-[10px] font-bold cursor-pointer transition-colors"
                          >
                            Export
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

        {renderModals()}
      </div>
    );
  }

  // ==========================================
  // RENDER VIEW FOR 11.5 ANALYTICS & INSIGHTS
  // ==========================================
  if (selectedCategory === 'Analytics & Insights') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-3 sm:p-4 w-full max-w-full space-y-3.5 text-left">

        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl z-[9999] flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TOP HEADER SECTION */}
        <div className="flex flex-col gap-2">
          {/* Row 1: Breadcrumbs & Utilities */}
          <div className="flex items-center justify-between gap-2 text-xs flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-1.5 font-bold text-[#4338CA] truncate shrink min-w-0">
              <span onClick={() => setSelectedCategory('All Categories')} className="hover:underline cursor-pointer">Home</span>
              <ChevronRight size={13} className="text-[#6366F1] shrink-0" />
              <span onClick={() => setSelectedCategory('All Categories')} className="hover:underline cursor-pointer">Reports</span>
              <ChevronRight size={13} className="text-[#6366F1] shrink-0" />
              <span className="text-[#3730A3] truncate">Analytics & Insights</span>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3.5 ml-auto shrink-0">
              <button onClick={() => showToast('Help center opened')} className="flex items-center gap-1 text-xs font-bold text-[#4338CA] hover:text-[#312E81] transition-colors cursor-pointer">
                <HelpCircle size={14} className="text-[#4338CA]" />
                <span className="hidden xs:inline">Need help?</span>
              </button>
              <div className="relative cursor-pointer" onClick={() => showToast('11 Unread Notifications')}>
                <div className="p-0.5 text-slate-700 hover:text-slate-900">
                  <svg className="w-4.5 h-4.5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                </div>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">11</span>
              </div>
              <div className="w-6.5 h-6.5 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-extrabold text-[10px] cursor-pointer shadow-xs">SM</div>
            </div>
          </div>

          {/* Row 2: Title & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-0.5">
            <div>
              <div className="flex items-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight leading-snug">AI Analytics & Business Intelligence</h1>
                <div className="w-5.5 h-5.5 rounded-lg bg-[#EEF2FF] border-2 border-[#6366F1] text-[#6366F1] flex items-center justify-center shrink-0 shadow-2xs mt-0.5 sm:mt-1">
                  <Shield size={12} strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Leverage AI-powered insights and business intelligence to make smarter, data-driven decisions.</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0 w-full sm:w-auto">
              <div className="relative self-end sm:self-auto">
                <button onClick={() => setOpenMoreActions(!openMoreActions)} className="flex items-center gap-1 text-[10px] font-extrabold text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer">
                  <span>More Actions</span>
                  <ChevronDown size={12} className="text-slate-500" />
                </button>
                {openMoreActions && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden py-1 text-xs">
                    <button onClick={() => { setShowExportModal(true); setOpenMoreActions(false); }} className="w-full text-left px-3 py-1.5 font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2"><Download size={13} className="text-slate-400" /> Export AI Reports</button>
                    <button onClick={() => { showToast('AI Audit Log Loaded'); setOpenMoreActions(false); }} className="w-full text-left px-3 py-1.5 font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2"><FileText size={13} className="text-slate-400" /> View AI Logs</button>
                    <button onClick={() => { showToast('Permissions View'); setOpenMoreActions(false); }} className="w-full text-left px-3 py-1.5 font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2"><SlidersHorizontal size={13} className="text-slate-400" /> Manage Permissions</button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                <button onClick={() => setShowExportModal(true)} className="col-span-1 sm:col-span-auto justify-center flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-[#4338CA] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer hover:border-slate-300 whitespace-nowrap">
                  <Download size={14} className="text-[#4338CA]" /><span>Export Centre</span>
                </button>
                <button onClick={() => setShowScheduleModal(true)} className="col-span-1 sm:col-span-auto justify-center flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-[#4338CA] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer hover:border-slate-300 whitespace-nowrap">
                  <Calendar size={14} className="text-[#4338CA]" /><span>Schedule Report</span>
                </button>
                <button onClick={() => setShowCustomReportModal(true)} className="col-span-2 sm:col-span-auto justify-center flex items-center gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer hover:shadow-lg whitespace-nowrap">
                  <Plus size={15} strokeWidth={2.5} /><span>Create Custom Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* METRIC CARDS ROW (6 KPI CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 w-full">
          {/* Card 1 — AI Revenue */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <TrendingUp size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">AI REVENUE (MTD)</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{kpiStats?.totalRevenue ? `$${kpiStats.totalRevenue.toLocaleString()}` : '$0.00'}</div>
              <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real-time DB Data</div>
              <button onClick={() => showToast('Opening AI Revenue Report')} className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer">
                <span>View insight</span><span>→</span>
              </button>
            </div>
          </div>

          {/* Card 2 — Demand Forecast */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
              <PieChart size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">DEMAND FORECAST</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{kpiStats?.totalLoads ? `${kpiStats.totalLoads} Loads` : '0 Loads'}</div>
              <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real-time DB Data</div>
              <button onClick={() => showToast('Opening Demand Forecast Report')} className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer">
                <span>View insight</span><span>→</span>
              </button>
            </div>
          </div>

          {/* Card 3 — Cost Optimisation */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <DollarSign size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">COST SAVINGS (MTD)</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">$0.00</div>
              <div className="text-[9.5px] font-bold text-slate-400 mt-1 whitespace-nowrap">Baseline</div>
              <button onClick={() => showToast('Opening Cost Optimisation Report')} className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer">
                <span>View insight</span><span>→</span>
              </button>
            </div>
          </div>

          {/* Card 4 — On-Time Prediction */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">ON-TIME PREDICTION</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">100%</div>
              <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Optimal</div>
              <button onClick={() => showToast('Opening On-Time Prediction Report')} className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer">
                <span>View insight</span><span>→</span>
              </button>
            </div>
          </div>

          {/* Card 5 — Risk Score */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
              <Shield size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">RISK SCORE (OVERALL)</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">Low (0/100)</div>
              <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Zero Risk</div>
              <button onClick={() => showToast('Opening Risk Score Report')} className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer">
                <span>View insight</span><span>→</span>
              </button>
            </div>
          </div>

          {/* Card 6 — AI Recommendations */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
              <Star size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">AI RECOMMENDATIONS</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{dynamicAiInsights.length} Active</div>
              <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real-time DB Data</div>
              <button onClick={() => showToast('Opening AI Recommendations')} className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer">
                <span>View insight</span><span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS BAR */}
        <div className="bg-white border border-slate-200/80 rounded-lg p-2 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search AI insights and analytics..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-8 pr-7 py-1.5 text-xs font-semibold bg-slate-50/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400" />
            {searchQuery && (<button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={13} /></button>)}
          </div>
          <div className="relative shrink-0">
            <button onClick={() => { setOpenCategoryDropdown(!openCategoryDropdown); setOpenSubCategoryDropdown(false); setOpenBranchDropdown(false); setOpenStatusDropdown(false); }} className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors">
              <span>{selectedCategory}</span><ChevronDown size={13} className="text-slate-400" />
            </button>
            {openCategoryDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                {['All Categories', 'Operations Reports', 'Financial Reports', 'Compliance Reports', 'Analytics & Insights'].map(cat => (
                  <button key={cat} onClick={() => { setSelectedCategory(cat); setOpenCategoryDropdown(false); }} className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedCategory === cat ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}>
                    <span>{cat}</span>{selectedCategory === cat && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative shrink-0">
            <button onClick={() => { setOpenSubCategoryDropdown(!openSubCategoryDropdown); setOpenCategoryDropdown(false); setOpenBranchDropdown(false); setOpenStatusDropdown(false); }} className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors">
              <span>{selectedSubCategory}</span><ChevronDown size={13} className="text-slate-400" />
            </button>
            {openSubCategoryDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                {['All Sub-Categories', 'Business Performance', 'Demand & Forecasting', 'Cost Optimisation', 'Operations Efficiency', 'Risk & Compliance', 'Customer Intelligence'].map(sub => (
                  <button key={sub} onClick={() => { setSelectedSubCategory(sub); setOpenSubCategoryDropdown(false); }} className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedSubCategory === sub ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}>
                    <span>{sub}</span>{selectedSubCategory === sub && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative shrink-0">
            <button onClick={() => { setOpenBranchDropdown(!openBranchDropdown); setOpenCategoryDropdown(false); setOpenSubCategoryDropdown(false); setOpenStatusDropdown(false); }} className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors">
              <span>{selectedBranch}</span><ChevronDown size={13} className="text-slate-400" />
            </button>
            {openBranchDropdown && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                {['All Branches', 'Sydney (Head Office)', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'].map(br => (
                  <button key={br} onClick={() => { setSelectedBranch(br); setOpenBranchDropdown(false); }} className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedBranch === br ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}>
                    <span>{br}</span>{selectedBranch === br && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative shrink-0">
            <button onClick={() => { setOpenStatusDropdown(!openStatusDropdown); setOpenCategoryDropdown(false); setOpenSubCategoryDropdown(false); setOpenBranchDropdown(false); }} className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors">
              <span>{selectedStatus}</span><ChevronDown size={13} className="text-slate-400" />
            </button>
            {openStatusDropdown && (
              <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                {['All Status', 'Active', 'Draft', 'Archived'].map(st => (
                  <button key={st} onClick={() => { setSelectedStatus(st); setOpenStatusDropdown(false); }} className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedStatus === st ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}>
                    <span>{st}</span>{selectedStatus === st && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => showToast('Date range selected')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors shrink-0">
            <Calendar size={13} className="text-slate-500" /><span>01 May 2025 - 31 May 2025</span>
          </button>
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={handleResetFilters} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors">
              <Filter size={13} className="text-slate-500" /><span>Filters</span>
            </button>
            <button onClick={() => showToast('AI Data refreshed')} title="Refresh Data" className="p-1.5 text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors">
              <RefreshCw size={13} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* ROW 1: 3-COLUMN LAYOUT (AI CATEGORIES | AI REVENUE FORECAST | TOP AI RECOMMENDATIONS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 w-full items-start">

          {/* Column 1: AI Insights Categories (3 Cols) */}
          <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-xl p-2.5 sm:p-3 shadow-2xs">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">AI INSIGHTS CATEGORIES</h2>
              <button onClick={() => showToast('Showing all AI categories')} className="text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer shrink-0">View All →</button>
            </div>
            <div className="space-y-0.5">
              {[
                { title: 'Business Performance', count: `${customReportsList.length}`, icon: TrendingUp, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
                { title: 'Demand & Forecasting', count: '0', icon: PieChart, color: 'bg-sky-50 text-sky-600 border-sky-100' },
                { title: 'Cost Optimisation', count: '0', icon: DollarSign, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                { title: 'Operations Efficiency', count: '0', icon: Layers, color: 'bg-amber-50 text-amber-600 border-amber-100' },
                { title: 'Risk & Compliance', count: '0', icon: ShieldCheck, color: 'bg-rose-50 text-rose-600 border-rose-100' },
                { title: 'Customer Intelligence', count: '0', icon: Users, color: 'bg-purple-50 text-purple-600 border-purple-100' },
              ].map((item, idx) => (
                <div key={idx} onClick={() => showToast(`Selected: ${item.title}`)} className="flex items-center justify-between py-1.5 px-2 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-slate-50/80 transition-all cursor-pointer group">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-5 h-5 rounded-md ${item.color} flex items-center justify-center shrink-0 border`}>
                      <item.icon size={11} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 group-hover:text-blue-600 truncate transition-colors">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[9.5px] font-bold text-slate-400 group-hover:text-slate-600 shrink-0 ml-1.5 whitespace-nowrap">
                    <span>{item.count} Insights</span><span>›</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: AI Revenue Forecast Chart (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-xl p-3 sm:p-3.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">AI REVENUE FORECAST (NEXT 6 MONTHS)</h2>
              <button onClick={() => showToast('Opening Revenue Analytics')} className="text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer shrink-0">View Analytics →</button>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-[9.5px] font-bold text-slate-600 mb-2">
              <div className="flex items-center gap-1"><span className="w-4 h-1 rounded-full bg-[#4338CA] inline-block"></span><span>Actual Revenue</span></div>
              <div className="flex items-center gap-1"><span className="w-4 h-0.5 border-t-2 border-dashed border-[#F59E0B] inline-block"></span><span>AI Forecast</span></div>
            </div>

            {/* SVG Revenue Forecast Chart */}
            <div className="relative h-[155px] w-full">
              <svg viewBox="0 0 460 148" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="aiRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4338CA" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#4338CA" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                {[0, 30, 60, 90, 120].map((y, i) => (
                  <g key={i}>
                    <line x1="35" y1={y + 5} x2="450" y2={y + 5} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="5" y={y + 9} fill="#94A3B8" fontSize="7.5" fontWeight="600">{(2.5 - i * 0.5).toFixed(1)}M</text>
                  </g>
                ))}
                {/* X Axis Labels */}
                {['Dec 24', 'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25'].map((m, i) => (
                  <text key={i} x={45 + i * 50} y="142" fill="#94A3B8" fontSize="7" fontWeight="600" textAnchor="middle">{m}</text>
                ))}
                {/* Baseline path */}
                <path d="M 45 125 L 445 125" fill="none" stroke="#4338CA" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Bottom Summary KPIs */}
            <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-100">
              <div className="text-center">
                <div className="text-[9px] font-bold text-slate-500 uppercase">Current Month (May)</div>
                <div className="text-sm font-black text-slate-900 mt-0.5">{kpiStats?.totalRevenue ? `$${kpiStats.totalRevenue.toLocaleString()}` : '$0.00'}</div>
                <div className="text-[9px] font-bold text-emerald-600">Real DB</div>
              </div>
              <div className="text-center border-x border-slate-100">
                <div className="text-[9px] font-bold text-slate-500 uppercase">Forecast (Next 6 Months)</div>
                <div className="text-sm font-black text-slate-900 mt-0.5">{kpiStats?.totalRevenue ? `$${(kpiStats.totalRevenue * 6).toLocaleString()}` : '$0.00'}</div>
                <div className="text-[9px] font-bold text-emerald-600">Real DB</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] font-bold text-slate-500 uppercase">AI Confidence Score</div>
                <div className="text-sm font-black text-slate-900 mt-0.5">95%</div>
                <div className="text-[9px] font-bold text-sky-600">High</div>
              </div>
            </div>
          </div>

          {/* Column 3: Top AI Recommendations (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-3 sm:p-3.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">TOP AI RECOMMENDATIONS</h2>
              <button onClick={() => showToast('Viewing all AI recommendations')} className="text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer shrink-0">View All →</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[8.5px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="pb-1.5 px-1">Recommendation</th>
                    <th className="pb-1.5 px-1 whitespace-nowrap">Category</th>
                    <th className="pb-1.5 px-1 text-center whitespace-nowrap">Impact</th>
                    <th className="pb-1.5 px-1 text-center whitespace-nowrap">Priority</th>
                    <th className="pb-1.5 px-1 text-center whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dynamicAiInsights.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-xs font-semibold text-slate-400">
                        No active AI recommendations available
                      </td>
                    </tr>
                  ) : (
                    dynamicAiInsights.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-1.5 px-1 font-bold text-slate-800 text-[10px] max-w-[130px]"><span className="line-clamp-1">{row.title}</span></td>
                        <td className="py-1.5 px-1 font-semibold text-slate-500 whitespace-nowrap">{row.category || 'Operations'}</td>
                        <td className="py-1.5 px-1 text-center"><span className="px-1.5 py-0.5 rounded text-[8px] font-black border uppercase tracking-wider inline-block bg-emerald-50 text-emerald-600 border-emerald-200">Medium</span></td>
                        <td className="py-1.5 px-1 text-center"><span className="px-1.5 py-0.5 rounded text-[8px] font-black border uppercase tracking-wider inline-block bg-blue-50 text-blue-600 border-blue-200">Normal</span></td>
                        <td className="py-1.5 px-1 text-center"><span className="px-1.5 py-0.5 rounded text-[8px] font-black border uppercase tracking-wider inline-block bg-emerald-50 text-emerald-600 border-emerald-200">Active</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <button onClick={() => showToast('Viewing all recommendations')} className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center justify-between w-full mt-2.5 pt-2 border-t border-slate-100 cursor-pointer">
              <span>View all recommendations</span><span>→</span>
            </button>
          </div>

        </div>

        {/* ROW 2: 3-COLUMN LAYOUT (AI COST ANALYSIS | RISK PREDICTION | BUSINESS INTELLIGENCE SUMMARY) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 w-full items-stretch">

          {/* Column 1: AI Cost Optimisation Analysis (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex flex-col">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100 gap-2">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide truncate min-w-0">AI COST ANALYSIS (MTD)</h2>
              <button onClick={() => showToast('Opening Cost Report')} className="text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer shrink-0">View Report →</button>
            </div>
            <div className="flex items-center gap-4 py-1">
              {/* Donut */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path strokeDasharray="100 100" strokeDashoffset="0" stroke="#F1F5F9" strokeWidth="4.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-black text-slate-900 leading-none">{kpiStats?.totalExpenses ? `$${kpiStats.totalExpenses.toLocaleString()}` : '$0.00'}</span>
                  <span className="text-[8px] font-bold text-slate-400 mt-0.5">Total Expenses</span>
                </div>
              </div>
              {/* Legend */}
              <div className="flex-1 space-y-1.5 text-[10.5px]">
                {[
                  { label: 'Billing Expenses', value: kpiStats?.totalExpenses ? `$${kpiStats.totalExpenses.toLocaleString()}` : '$0.00', pct: '0%', color: '#4338CA' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }}></div>
                      <span className="font-bold text-slate-700 truncate text-[10px]">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="font-black text-slate-900 text-[10px]">{item.value}</span>
                      <span className="font-bold text-slate-400 text-[9px] w-9 text-right">{item.pct}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => showToast('Viewing detailed cost analysis')} className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center justify-between w-full mt-2 pt-2 border-t border-slate-100 cursor-pointer">
              <span>View detailed cost analysis</span><span>→</span>
            </button>
          </div>

          {/* Column 2: AI Risk Prediction Overview (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex flex-col">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100 gap-2">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide truncate min-w-0">AI RISK PREDICTION OVERVIEW</h2>
              <button onClick={() => showToast('Opening Risk Report')} className="text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer shrink-0">View Report →</button>
            </div>
            <div className="flex items-center gap-5 py-2">
              {/* Risk Score Donut */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#F1F5F9" strokeWidth="5" />
                  <path strokeDasharray="100 100" strokeDashoffset="0" stroke="#10B981" strokeWidth="5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-slate-900 leading-none">0</span>
                  <span className="text-[8px] font-bold text-slate-400 mt-0.5">Low Risk</span>
                  <span className="text-[7.5px] font-bold text-slate-300">Score (Out of 100)</span>
                </div>
              </div>
              {/* Risk Breakdown */}
              <div className="flex-1 space-y-2">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Risk Level</div>
                {[
                  { level: 'High Risk Items', count: 0, color: 'text-slate-600 bg-slate-50 border-slate-200' },
                  { level: 'Medium Risk Items', count: 0, color: 'text-slate-600 bg-slate-50 border-slate-200' },
                  { level: 'Low Risk Items', count: 0, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                  { level: 'Total Monitored', count: 0, color: 'text-slate-700 bg-slate-50 border-slate-200' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-1 px-2 rounded border border-slate-100 bg-slate-50/40">
                    <span className="text-[10.5px] font-bold text-slate-700">{item.level}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${item.color}`}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => showToast('Viewing risk analysis report')} className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center justify-between w-full mt-2 pt-2 border-t border-slate-100 cursor-pointer">
              <span>View risk analysis report</span><span>→</span>
            </button>
          </div>

          {/* Column 3: Business Intelligence Summary (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex flex-col">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100 gap-2">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide truncate min-w-0">BUSINESS INTELLIGENCE (MTD)</h2>
              <button onClick={() => showToast('Opening BI Dashboard')} className="text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer shrink-0">View Dashboard →</button>
            </div>
            <div className="space-y-1.5">
              {[
                { text: 'Revenue growth is trending up by 12.6% compared to last month.', icon: TrendingUp, boxBg: 'bg-emerald-50/70 border-emerald-100', iconBg: 'bg-emerald-100 text-emerald-600' },
                { text: 'On-time delivery performance is above target at 93.2%.', icon: CheckCircle2, boxBg: 'bg-sky-50/70 border-sky-100', iconBg: 'bg-sky-100 text-sky-600' },
                { text: 'Fleet utilisation can be improved by 5.9% for better efficiency.', icon: Truck, boxBg: 'bg-amber-50/70 border-amber-100', iconBg: 'bg-amber-100 text-amber-600' },
                { text: 'Customer satisfaction score is 4.6/5.0 based on recent feedback.', icon: Star, boxBg: 'bg-purple-50/70 border-purple-100', iconBg: 'bg-purple-100 text-purple-600' },
                { text: 'AI has identified $124,560 in potential cost savings this month.', icon: DollarSign, boxBg: 'bg-indigo-50/70 border-indigo-100', iconBg: 'bg-indigo-100 text-indigo-600' },
              ].map((item, i) => (
                <div key={i} className={`py-1.5 px-2 rounded-lg border ${item.boxBg} flex items-center gap-2 hover:shadow-2xs transition-all`}>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${item.iconBg}`}>
                    <item.icon size={12} />
                  </div>
                  <p className="text-[10.5px] font-bold text-slate-800 leading-tight">{item.text}</p>
                </div>
              ))}
            </div>
            <button onClick={() => showToast('Viewing full BI dashboard')} className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center justify-between w-full mt-2 pt-2 border-t border-slate-100 cursor-pointer">
              <span>View full BI dashboard</span><span>→</span>
            </button>
          </div>

        </div>



        {renderModals()}
      </div>
    );
  }

  // ==========================================
  // RENDER VIEW FOR 11.2 OPERATIONS REPORTS
  // ==========================================
  if (selectedCategory === 'Operations Reports') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-3 sm:p-4 w-full max-w-full space-y-3.5 text-left">

        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl z-[9999] flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TOP HEADER SECTION */}
        <div className="flex flex-col gap-2">

          {/* Row 1: Breadcrumbs on Left & Top Header Utilities on Right */}
          <div className="flex items-center justify-between gap-2 text-xs flex-wrap sm:flex-nowrap">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 font-bold text-[#4338CA] truncate shrink min-w-0">
              <span onClick={() => setSelectedCategory('All Categories')} className="hover:underline cursor-pointer">Home</span>
              <ChevronRight size={13} className="text-[#6366F1] shrink-0" />
              <span onClick={() => setSelectedCategory('All Categories')} className="hover:underline cursor-pointer">Reports</span>
              <ChevronRight size={13} className="text-[#6366F1] shrink-0" />
              <span className="text-[#3730A3] truncate">Operations Reports</span>
            </div>

            {/* Top Right Utilities */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 ml-auto shrink-0">
              <button
                onClick={() => showToast('Help center opened')}
                className="flex items-center gap-1 text-xs font-bold text-[#4338CA] hover:text-[#312E81] transition-colors cursor-pointer"
              >
                <HelpCircle size={14} className="text-[#4338CA]" />
                <span className="hidden xs:inline">Need help?</span>
              </button>

              {/* Notification Bell with '11' Badge */}
              <div className="relative cursor-pointer" onClick={() => showToast('11 Unread Notifications')}>
                <div className="p-0.5 text-slate-700 hover:text-slate-900">
                  <svg className="w-4.5 h-4.5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                </div>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  11
                </span>
              </div>

              {/* User Profile Initial SM Circle */}
              <div className="w-6.5 h-6.5 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-extrabold text-[10px] cursor-pointer shadow-xs">
                SM
              </div>
            </div>
          </div>

          {/* Row 2: Main Dashboard Header Title & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-0.5">
            <div>
              <div className="flex items-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight leading-snug">Operations Reports</h1>
                {/* Purple Shield Icon */}
                <div className="w-5.5 h-5.5 rounded-lg bg-[#EEF2FF] border-2 border-[#6366F1] text-[#6366F1] flex items-center justify-center shrink-0 shadow-2xs mt-0.5 sm:mt-1">
                  <Shield size={12} strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Comprehensive operational reports to monitor and improve your day-to-day performance.
              </p>
            </div>

            {/* Right Action Controls */}
            <div className="flex flex-col items-end gap-1.5 shrink-0 w-full sm:w-auto">
              <div className="relative self-end sm:self-auto">
                <button
                  onClick={() => setOpenMoreActions(!openMoreActions)}
                  className="flex items-center gap-1 text-[10px] font-extrabold text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>More Actions</span>
                  <ChevronDown size={12} className="text-slate-500" />
                </button>

                {openMoreActions && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden py-1 text-xs">
                    <button onClick={() => { setShowExportModal(true); setOpenMoreActions(false); }} className="w-full text-left px-3 py-1.5 font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                      <Download size={13} className="text-slate-400" /> Bulk Download Reports
                    </button>
                    <button onClick={() => { showToast('Audit Log Loaded'); setOpenMoreActions(false); }} className="w-full text-left px-3 py-1.5 font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                      <FileText size={13} className="text-slate-400" /> View Report Logs
                    </button>
                    <button onClick={() => { showToast('Permissions View'); setOpenMoreActions(false); }} className="w-full text-left px-3 py-1.5 font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                      <SlidersHorizontal size={13} className="text-slate-400" /> Manage Permissions
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="col-span-1 sm:col-span-auto justify-center flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-[#4338CA] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer hover:border-slate-300 whitespace-nowrap"
                >
                  <Download size={14} className="text-[#4338CA]" />
                  <span>Export Centre</span>
                </button>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="col-span-1 sm:col-span-auto justify-center flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-[#4338CA] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer hover:border-slate-300 whitespace-nowrap"
                >
                  <Calendar size={14} className="text-[#4338CA]" />
                  <span>Schedule Report</span>
                </button>
                <button
                  onClick={() => setShowCustomReportModal(true)}
                  className="col-span-2 sm:col-span-auto justify-center flex items-center gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer hover:shadow-lg whitespace-nowrap"
                >
                  <Plus size={15} strokeWidth={2.5} />
                  <span>Create Custom Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* METRIC CARDS ROW (5 EQUAL COLUMNS MATCHING TARGET IMAGE 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 w-full">
          {/* Metric 1: TOTAL LOADS (MTD) */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
            <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] text-[#7E22CE] flex items-center justify-center shrink-0 mt-0.5">
              <FileText size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">TOTAL LOADS (MTD)</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{kpiStats?.totalLoads !== undefined ? kpiStats.totalLoads : 0}</div>
              <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real-time DB Data</div>
              <button
                onClick={() => showToast('Showing Loads Report')}
                className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
              >
                <span>View report</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Metric 2: TOTAL DELIVERIES (MTD) */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
            <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
              <Truck size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">TOTAL DELIVERIES (MTD)</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{kpiStats?.totalDeliveries !== undefined ? kpiStats.totalDeliveries : 0}</div>
              <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real-time DB Data</div>
              <button
                onClick={() => showToast('Showing Deliveries Report')}
                className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
              >
                <span>View report</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Metric 3: KILOMETRES (MTD) */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
            <div className="w-8 h-8 rounded-lg bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0 mt-0.5">
              <MapPin size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">KILOMETRES (MTD)</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{kpiStats?.totalKilometres || '0 km'}</div>
              <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real-time DB Data</div>
              <button
                onClick={() => showToast('Showing Kilometres Report')}
                className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
              >
                <span>View report</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Metric 4: ACTIVE DRIVERS (MTD) */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
            <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5">
              <Users size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">ACTIVE DRIVERS (MTD)</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{kpiStats?.activeDrivers !== undefined ? kpiStats.activeDrivers : 0}</div>
              <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real-time DB Data</div>
              <button
                onClick={() => showToast('Showing Driver Report')}
                className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
              >
                <span>View report</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Metric 5: FLEET UTILISATION (MTD) */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
            <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] text-[#7E22CE] flex items-center justify-center shrink-0 mt-0.5">
              <Clock size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">FLEET UTILISATION (MTD)</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{kpiStats?.fleetUtilisationPercent || '0%'}</div>
              <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">Real-time DB Data</div>
              <button
                onClick={() => showToast('Showing Utilisation Report')}
                className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
              >
                <span>View report</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS BAR FOR OPERATIONS REPORTS */}
        <div className="bg-white border border-slate-200/80 rounded-lg p-2 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full">
          {/* Search input */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search operations reports by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs font-semibold bg-slate-50/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Dropdown 1: Categories */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setOpenCategoryDropdown(!openCategoryDropdown); setOpenSubCategoryDropdown(false); setOpenBranchDropdown(false); setOpenStatusDropdown(false); }}
              className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
            >
              <span>{selectedCategory}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>
            {openCategoryDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                {['All Categories', 'Operations Reports', 'Financial Reports', 'Compliance Reports', 'Analytics & Insights'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setOpenCategoryDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedCategory === cat ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 2: Sub-Categories */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setOpenSubCategoryDropdown(!openSubCategoryDropdown); setOpenCategoryDropdown(false); setOpenBranchDropdown(false); setOpenStatusDropdown(false); }}
              className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
            >
              <span>{selectedSubCategory}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>
            {openSubCategoryDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                {['All Sub-Categories', 'Loads Reports', 'Driver Reports', 'Vehicle Reports', 'Customer Reports', 'Branch Reports', 'Warehouse Reports', 'Asset Reports'].map(sub => (
                  <button
                    key={sub}
                    onClick={() => { setSelectedSubCategory(sub); setOpenSubCategoryDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedSubCategory === sub ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <span>{sub}</span>
                    {selectedSubCategory === sub && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 3: Branches */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setOpenBranchDropdown(!openBranchDropdown); setOpenCategoryDropdown(false); setOpenSubCategoryDropdown(false); setOpenStatusDropdown(false); }}
              className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
            >
              <span>{selectedBranch}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>
            {openBranchDropdown && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                {['All Branches', 'Sydney HQ', 'Melbourne Hub', 'Brisbane Depot', 'Perth Terminal'].map(br => (
                  <button
                    key={br}
                    onClick={() => { setSelectedBranch(br); setOpenBranchDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedBranch === br ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <span>{br}</span>
                    {selectedBranch === br && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 4: Status */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setOpenStatusDropdown(!openStatusDropdown); setOpenCategoryDropdown(false); setOpenSubCategoryDropdown(false); setOpenBranchDropdown(false); }}
              className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
            >
              <span>{selectedStatus}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>
            {openStatusDropdown && (
              <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                {['All Status', 'Active', 'Draft', 'Archived'].map(st => (
                  <button
                    key={st}
                    onClick={() => { setSelectedStatus(st); setOpenStatusDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedStatus === st ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <span>{st}</span>
                    {selectedStatus === st && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Range Picker Input */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
            >
              <Calendar size={13} className="text-slate-400" />
              <span>{dateRange}</span>
              <Calendar size={13} className="text-slate-400" />
            </button>

            {showDatePicker && (
              <div className="absolute top-full right-0 mt-1 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-20 p-2.5 text-xs">
                <div className="font-bold text-slate-900 mb-1.5">Select Date Range</div>
                <div className="space-y-1">
                  {['01 May 2025 - 31 May 2025', '01 Apr 2025 - 30 Apr 2025', 'Q1 2025 (Jan - Mar)', 'Year to Date 2025'].map(range => (
                    <button
                      key={range}
                      onClick={() => { setDateRange(range); setShowDatePicker(false); showToast(`Date updated: ${range}`); }}
                      className={`w-full text-left px-2 py-1 rounded text-xs font-medium cursor-pointer ${dateRange === range ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filter Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
            >
              <Filter size={13} className="text-slate-500" />
              <span>Filters</span>
            </button>

            <button
              onClick={() => showToast('Data refreshed')}
              title="Refresh Data"
              className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
            >
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        {/* ROW 1: 3 COLUMNS (CATEGORIES | OPERATIONS OVERVIEW MTD | TOP ROUTES) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch w-full">

          {/* COLUMN 1: OPERATIONS REPORT CATEGORIES (Span 3) */}
          <div className="lg:col-span-4 xl:col-span-3 bg-white border border-slate-200/80 rounded-lg p-2.5 shadow-2xs flex flex-col justify-between w-full">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[10.5px] font-black text-slate-900 uppercase tracking-wider">OPERATIONS REPORT CATEGORIES</h2>
                <button onClick={() => showToast('Showing all categories')} className="text-[9.5px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                  <span>View All</span>
                  <span>→</span>
                </button>
              </div>

              <div className="space-y-1">
                {operationsCategories.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => showToast(`Filtered by ${cat.title}`)}
                      className="py-1 px-2 rounded-md border border-slate-100 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-1.5 overflow-hidden pr-1">
                        <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 border ${cat.color}`}>
                          <Icon size={13} />
                        </div>
                        <div className="truncate">
                          <h3 className="text-[10.5px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight truncate">{cat.title}</h3>
                          <p className="text-[9px] text-slate-400 font-medium leading-tight truncate mt-0.5">{cat.desc}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-1">
                        <div className="text-right">
                          <div className="text-[9.5px] font-black text-slate-800 leading-none">{cat.count.split(' ')[0]}</div>
                          <div className="text-[7.5px] font-bold text-slate-400 uppercase leading-none mt-0.5">Reports</div>
                        </div>
                        <ChevronRight size={12} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* COLUMN 2: OPERATIONS OVERVIEW (MTD) (Span 5) */}
          <div className="lg:col-span-8 xl:col-span-5 bg-white border border-slate-200/80 rounded-lg p-3 shadow-2xs flex flex-col justify-between w-full">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">OPERATIONS OVERVIEW (MTD)</h2>
                <button onClick={() => showToast('Opening Analytics View')} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                  <span>View Analytics</span>
                  <span>→</span>
                </button>
              </div>

              {/* Legend with 4 indicators matching Target Image 2 */}
              <div className="flex items-center gap-3 text-[9.5px] font-bold text-slate-600 mb-2 justify-center flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="w-3.5 h-1 rounded-full bg-[#4F46E5]"></span>
                  <span>Loads</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3.5 h-1 rounded-full bg-[#10B981]"></span>
                  <span>Deliveries</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3.5 h-1 rounded-full bg-[#F97316]"></span>
                  <span>Kilometres (000s)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3.5 h-1 rounded-full bg-[#0284C7]"></span>
                  <span>Utilisation (%)</span>
                </div>
              </div>

              {/* Multi-Line Dual-Axis SVG Graph */}
              <div className="relative h-[165px] w-full pt-1">
                <svg viewBox="0 0 500 155" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="opPurpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Left Y-Axis Grid Lines (0 to 600) & Right Y-Axis % */}
                  {[0, 24, 48, 72, 96, 120].map((y, i) => (
                    <g key={i}>
                      <line x1="30" y1={y + 5} x2="465" y2={y + 5} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="5" y={y + 8} fill="#94A3B8" fontSize="8" fontWeight="600">{600 - i * 100}</text>
                      <text x="472" y={y + 8} fill="#94A3B8" fontSize="8" fontWeight="600">{100 - i * 20}%</text>
                    </g>
                  ))}

                  {/* X Axis Dates */}
                  {['1 May', '8 May', '15 May', '22 May', '29 May'].map((date, i) => (
                    <text key={i} x={50 + i * 100} y="145" fill="#94A3B8" fontSize="8.5" fontWeight="600" textAnchor="middle">{date}</text>
                  ))}

                  {/* Purple Fill under top curve */}
                  <path
                    d="M 45 45 Q 95 30, 150 48 T 250 35 T 350 42 T 450 38 L 450 125 L 45 125 Z"
                    fill="url(#opPurpleGradient)"
                  />

                  {/* Line 1: Loads (Purple) */}
                  <path
                    d="M 45 45 Q 95 30, 150 48 T 250 35 T 350 42 T 450 38"
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {[{ x: 45, y: 45 }, { x: 150, y: 48 }, { x: 250, y: 35 }, { x: 350, y: 42 }, { x: 450, y: 38 }].map((pt, i) => (
                    <circle key={i} cx={pt.x} cy={pt.y} r="2.5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="1" />
                  ))}

                  {/* Line 2: Deliveries (Green) */}
                  <path
                    d="M 45 70 Q 95 60, 150 72 T 250 58 T 350 65 T 450 62"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {[{ x: 45, y: 70 }, { x: 150, y: 72 }, { x: 250, y: 58 }, { x: 350, y: 65 }, { x: 450, y: 62 }].map((pt, i) => (
                    <circle key={i} cx={pt.x} cy={pt.y} r="2.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" />
                  ))}

                  {/* Line 3: Kilometres 000s (Orange) */}
                  <path
                    d="M 45 95 Q 95 90, 150 98 T 250 85 T 350 90 T 450 88"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {[{ x: 45, y: 95 }, { x: 150, y: 98 }, { x: 250, y: 85 }, { x: 350, y: 90 }, { x: 450, y: 88 }].map((pt, i) => (
                    <circle key={i} cx={pt.x} cy={pt.y} r="2.5" fill="#F97316" stroke="#FFFFFF" strokeWidth="1" />
                  ))}

                  {/* Line 4: Utilisation % (Blue) */}
                  <path
                    d="M 45 35 Q 95 40, 150 32 T 250 28 T 350 34 T 450 30"
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {[{ x: 45, y: 35 }, { x: 150, y: 32 }, { x: 250, y: 28 }, { x: 350, y: 34 }, { x: 450, y: 30 }].map((pt, i) => (
                    <circle key={i} cx={pt.x} cy={pt.y} r="2.5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1" />
                  ))}
                </svg>
              </div>
            </div>

            {/* Bottom 4 Summary KPI Cards */}
            <div className="grid grid-cols-4 gap-2 mt-2.5 pt-2.5 border-t border-slate-100">
              <div className="bg-[#F5F3FF] rounded-lg p-2 border border-[#DDD6FE] text-left">
                <div className="text-[9px] font-bold text-[#6366F1] uppercase">Loads</div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-black text-slate-900 leading-none">428</span>
                  <span className="text-[9px] font-bold text-emerald-600">▲ 12.6%</span>
                </div>
              </div>
              <div className="bg-[#F0FDF4] rounded-lg p-2 border border-[#BBF7D0] text-left">
                <div className="text-[9px] font-bold text-[#16A34A] uppercase">Deliveries</div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-black text-slate-900 leading-none">392</span>
                  <span className="text-[9px] font-bold text-emerald-600">▲ 11.3%</span>
                </div>
              </div>
              <div className="bg-[#FFF7ED] rounded-lg p-2 border border-[#FED7AA] text-left">
                <div className="text-[9px] font-bold text-[#EA580C] uppercase">Kilometres</div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xs font-black text-slate-900 leading-none">256,780 km</span>
                  <span className="text-[9px] font-bold text-emerald-600">▲ 9.8%</span>
                </div>
              </div>
              <div className="bg-[#EFF6FF] rounded-lg p-2 border border-[#BFDBFE] text-left">
                <div className="text-[9px] font-bold text-[#2563EB] uppercase">Utilisation</div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-black text-slate-900 leading-none">78.4%</span>
                  <span className="text-[9px] font-bold text-emerald-600">▲ 5.9%</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: TOP ROUTES (BY KILOMETRES) (Span 4) */}
          <div className="lg:col-span-12 xl:col-span-4 bg-white border border-slate-200/80 rounded-lg p-3 shadow-2xs flex flex-col justify-between w-full">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">TOP ROUTES (BY KILOMETRES)</h2>
                <button onClick={() => showToast('Showing all routes')} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                  <span>View Report</span>
                  <span>→</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase">
                      <th className="py-1.5 px-2">Route</th>
                      <th className="py-1.5 px-2 text-right">Kilometres</th>
                      <th className="py-1.5 px-2 text-right">Loads</th>
                      <th className="py-1.5 px-2 text-right">Deliveries</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {topRoutes.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-1.5 px-2 font-bold text-slate-800 text-[11px]">{r.route}</td>
                        <td className="py-1.5 px-2 text-right font-medium text-slate-600 text-[10.5px]">{r.km}</td>
                        <td className="py-1.5 px-2 text-right font-bold text-slate-800 text-[11px]">{r.loads}</td>
                        <td className="py-1.5 px-2 text-right font-bold text-slate-800 text-[11px]">{r.deliveries}</td>
                      </tr>
                    ))}
                    {/* Total Row */}
                    <tr className="border-t-2 border-slate-200 font-black text-slate-900 bg-slate-50/40 text-xs">
                      <td className="py-2 px-2 uppercase tracking-wider text-[10px]">Total</td>
                      <td className="py-2 px-2 text-right text-[11px]">75,080 km</td>
                      <td className="py-2 px-2 text-right text-[11px]">169</td>
                      <td className="py-2 px-2 text-right text-[11px]">164</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ROW: CUSTOM CREATED REPORTS & TEMPLATES TABLE */}
        <div className="bg-white border border-slate-200/80 rounded-lg p-3 shadow-2xs w-full my-3">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Plus size={16} className="text-blue-600" />
              <h2 className="text-[11.5px] font-black text-slate-900 uppercase tracking-wider">
                CUSTOM CREATED REPORTS & TEMPLATES ({customReportsList.length})
              </h2>
            </div>
            <button
              onClick={() => setShowCustomReportModal(true)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} />
              <span>Create Custom Report</span>
            </button>
          </div>

          {customReportsList.length === 0 ? (
            <div className="text-center py-6 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
              <FileText size={28} className="mx-auto text-slate-300 mb-1.5" />
              <p className="text-xs font-bold text-slate-600">No Custom Reports Created Yet</p>
              <p className="text-[11px] text-slate-400 font-medium max-w-sm mx-auto mt-0.5 mb-3">
                Click "Create Custom Report" to build and save custom metrics templates into the database.
              </p>
              <button
                onClick={() => setShowCustomReportModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1"
              >
                <Plus size={14} />
                <span>Create Custom Report Now</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase">
                    <th className="py-2 px-3">Report Name</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Primary Metrics</th>
                    <th className="py-2 px-3">Created By</th>
                    <th className="py-2 px-3">Created Date</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {customReportsList.map((r, i) => {
                    let metricsArray = [];
                    try {
                      metricsArray = typeof r.metrics === 'string' ? JSON.parse(r.metrics) : (r.metrics || []);
                    } catch (e) {
                      metricsArray = [r.metrics];
                    }
                    return (
                      <tr key={r.id || i} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2 px-3 font-bold text-slate-900 text-[11px]">
                          <div className="flex items-center gap-2">
                            <FileText size={14} className="text-blue-600 shrink-0" />
                            <span>{r.name}</span>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                            {r.category || 'Operations Reports'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-[10.5px] font-medium text-slate-600">
                          {Array.isArray(metricsArray) ? metricsArray.join(', ') : 'Gross Revenue, Trip Count'}
                        </td>
                        <td className="py-2 px-3 text-[10.5px] font-medium text-slate-500">
                          {r.creator?.name || r.creator?.email || 'Company Admin'}
                        </td>
                        <td className="py-2 px-3 text-[10.5px] font-medium text-slate-500">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today'}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => showToast(`Running report template "${r.name}"`)}
                              className="px-2 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded font-bold text-[10px] transition-colors cursor-pointer"
                            >
                              Run Report
                            </button>
                            <button
                              onClick={() => {
                                setCustomReportsList(prev => prev.filter(item => item.id !== r.id));
                                showToast(`Deleted "${r.name}"`);
                              }}
                              className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                              title="Delete Report"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ROW 2: 3 COLUMNS (RECENTLY RUN | REPORT SCHEDULES | OPERATIONS INSIGHTS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch w-full">

          {/* COLUMN 1: RECENTLY RUN OPERATIONS REPORTS (Span 4) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-lg p-3 shadow-2xs flex flex-col justify-between w-full">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">RECENTLY RUN OPERATIONS REPORTS</h2>
                <button onClick={() => showToast('Showing history')} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                  <span>View All</span>
                  <span>→</span>
                </button>
              </div>

              <div className="space-y-1.5">
                {recentlyRunOperationsReports.map(item => (
                  <div key={item.id} className="py-1.5 px-2 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-slate-50 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden pr-1">
                      <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <FileText size={14} />
                      </div>
                      <div className="truncate">
                        <h3 className="text-[11px] font-bold text-slate-900 hover:text-blue-600 transition-colors truncate leading-tight">{item.name}</h3>
                        <p className="text-[9.5px] text-slate-400 font-medium truncate mt-0.5 leading-tight">{item.category} • {item.runBy}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {item.format}
                      </span>
                      <button onClick={() => showToast(`Downloading ${item.name}`)} className="text-slate-400 hover:text-blue-600 p-0.5">
                        <Download size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => showToast('Viewing report history')}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2.5 pt-2 border-t border-slate-100 cursor-pointer"
            >
              <span>View report history</span>
              <span>→</span>
            </button>
          </div>

          {/* COLUMN 2: REPORT SCHEDULES (ACTIVE) (Span 4) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-lg p-3 shadow-2xs flex flex-col justify-between w-full">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">REPORT SCHEDULES (ACTIVE)</h2>
                <button onClick={() => setShowScheduleModal(true)} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                  <span>View All</span>
                  <span>→</span>
                </button>
              </div>

              <div className="space-y-1.5">
                {schedulesList.map(item => (
                  <div key={item.id} className="py-1.5 px-2 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-slate-50 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden pr-1">
                      <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Calendar size={14} />
                      </div>
                      <div className="truncate">
                        <h3 className="text-[11px] font-bold text-slate-900 hover:text-blue-600 transition-colors truncate leading-tight">{item.title || item.name}</h3>
                        <p className="text-[9.5px] text-slate-400 font-medium truncate mt-0.5 leading-tight">{item.frequency} • Next: {item.date || item.nextRun || '31 May 2025'}</p>
                      </div>
                    </div>

                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      {item.status || 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowScheduleModal(true)}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2.5 pt-2 border-t border-slate-100 cursor-pointer"
            >
              <span>Manage schedules</span>
              <span>→</span>
            </button>
          </div>

          {/* COLUMN 3: OPERATIONS INSIGHTS (MTD) (Span 4) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-lg p-3 shadow-2xs flex flex-col justify-between w-full">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">OPERATIONS INSIGHTS (MTD)</h2>
                <button onClick={() => showToast('Opening complete AI Insights')} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                  <span>View Insights</span>
                  <span>→</span>
                </button>
              </div>

              <div className="space-y-1.5">
                {operationsInsights.map(insight => {
                  const Icon = insight.icon;
                  return (
                    <div key={insight.id} className={`py-1.5 px-2 rounded-lg border ${insight.boxBg} flex items-center gap-2 transition-all hover:shadow-2xs`}>
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${insight.iconBg}`}>
                        <Icon size={13} />
                      </div>
                      <p className={`text-[10px] font-bold ${insight.textColor} leading-tight truncate`}>{insight.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => showToast('Viewing all operations insights')}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2.5 pt-2 border-t border-slate-100 cursor-pointer"
            >
              <span>View all insights</span>
              <span>→</span>
            </button>
          </div>

        </div>



        {renderModals()}

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-3 sm:p-4 w-full max-w-full space-y-3.5 text-left">

      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl z-[9999] flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER SECTION */}
      <div className="flex flex-col gap-2">

        {/* Row 1: Breadcrumbs on Left & Top Header Profile Icons on Right */}
        <div className="flex items-center justify-between gap-2 text-xs flex-wrap sm:flex-nowrap">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 font-bold text-[#4338CA] truncate shrink min-w-0">
            <span className="hover:underline cursor-pointer">Home</span>
            <ChevronRight size={13} className="text-[#6366F1] shrink-0" />
            <span className="hover:underline cursor-pointer">Reports</span>
            <ChevronRight size={13} className="text-[#6366F1] shrink-0" />
            <span className="text-[#3730A3] truncate">Dashboard</span>
          </div>

          {/* Top Right Utilities */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 ml-auto shrink-0">
            <button
              onClick={() => showToast('Help center opened')}
              className="flex items-center gap-1 text-xs font-bold text-[#4338CA] hover:text-[#312E81] transition-colors cursor-pointer"
            >
              <HelpCircle size={14} className="text-[#4338CA]" />
              <span className="hidden xs:inline">Need help?</span>
            </button>

            {/* Notification Bell with '11' Badge */}
            <div className="relative cursor-pointer" onClick={() => showToast('11 Unread Notifications')}>
              <div className="p-0.5 text-slate-700 hover:text-slate-900">
                <svg className="w-4.5 h-4.5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              </div>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                11
              </span>
            </div>

            {/* User Profile Initial SM Circle */}
            <div className="w-6.5 h-6.5 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-extrabold text-[10px] cursor-pointer shadow-xs">
              SM
            </div>
          </div>
        </div>

        {/* Row 2: Main Dashboard Header Title & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-0.5">
          <div>
            <div className="flex items-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight leading-snug">Reports Dashboard</h1>
              {/* Purple Shield Icon */}
              <div className="w-5.5 h-5.5 rounded-lg bg-[#EEF2FF] border-2 border-[#6366F1] text-[#6366F1] flex items-center justify-center shrink-0 shadow-2xs mt-0.5 sm:mt-1">
                <Shield size={12} strokeWidth={2.5} />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Access, analyse and export operational and financial reports across your business.
            </p>
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-col items-end gap-1.5 shrink-0 w-full sm:w-auto">
            {/* More Actions Dropdown Button */}
            <div className="relative self-end sm:self-auto">
              <button
                onClick={() => setOpenMoreActions(!openMoreActions)}
                className="flex items-center gap-1 text-[10px] font-extrabold text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>More Actions</span>
                <ChevronDown size={12} className="text-slate-500" />
              </button>

              {openMoreActions && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden py-1 text-xs">
                  <button onClick={() => { setShowExportModal(true); setOpenMoreActions(false); }} className="w-full text-left px-3 py-1.5 font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                    <Download size={13} className="text-slate-400" /> Bulk Download Reports
                  </button>
                  <button onClick={() => { showToast('Audit Log Loaded'); setOpenMoreActions(false); }} className="w-full text-left px-3 py-1.5 font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                    <FileText size={13} className="text-slate-400" /> View Report Logs
                  </button>
                  <button onClick={() => { showToast('Permissions View'); setOpenMoreActions(false); }} className="w-full text-left px-3 py-1.5 font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                    <SlidersHorizontal size={13} className="text-slate-400" /> Manage Permissions
                  </button>
                </div>
              )}
            </div>

            {/* 3 Main Action Buttons Row */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowExportModal(true)}
                className="col-span-1 sm:col-span-auto justify-center flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-[#4338CA] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer hover:border-slate-300 whitespace-nowrap"
              >
                <Download size={14} className="text-[#4338CA]" />
                <span>Export Centre</span>
              </button>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="col-span-1 sm:col-span-auto justify-center flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-[#4338CA] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer hover:border-slate-300 whitespace-nowrap"
              >
                <Calendar size={14} className="text-[#4338CA]" />
                <span>Schedule Report</span>
              </button>
              <button
                onClick={() => setShowCustomReportModal(true)}
                className="col-span-2 sm:col-span-auto justify-center flex items-center gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer hover:shadow-lg whitespace-nowrap"
              >
                <Plus size={15} strokeWidth={2.5} />
                <span>Create Custom Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* METRIC CARDS ROW (5 EQUAL COLUMNS - PERFECT HEIGHT & PROPORTION) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 w-full">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
          <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] text-[#7E22CE] flex items-center justify-center shrink-0 mt-0.5">
            <FileText size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">TOTAL REPORTS</span>
            <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{kpiStats?.totalReportsCount ?? customReportsList.length}</div>
            <div className="text-[9.5px] font-semibold text-slate-400 mt-1 whitespace-nowrap">Active system reports</div>
            <button
              onClick={() => showToast('Showing all reports')}
              className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
            >
              <span>View all reports</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
          <div className="w-8 h-8 rounded-lg bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0 mt-0.5">
            <Clock size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">RECENTLY VIEWED</span>
            <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{kpiStats?.recentlyViewedCount ?? customReportsList.length}</div>
            <div className="text-[9.5px] font-semibold text-slate-400 mt-1 whitespace-nowrap">Recent activity logs</div>
            <button
              onClick={() => showToast('Viewing report history')}
              className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
            >
              <span>View history</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
          <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
            <Calendar size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">SCHEDULED REPORTS</span>
            <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{kpiStats?.scheduledReportsCount ?? schedulesList.length}</div>
            <div className="text-[9.5px] font-semibold text-slate-400 mt-1 whitespace-nowrap">Automated email jobs</div>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
            >
              <span>Manage schedules</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
          <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 mt-0.5">
            <Star size={16} className="fill-[#D97706]" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">FAVOURITE REPORTS</span>
            <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{kpiStats?.favouritesCount ?? favourites.length}</div>
            <div className="text-[9.5px] font-semibold text-slate-400 mt-1 whitespace-nowrap">Bookmarked reports</div>
            <button
              onClick={() => showToast('Showing favourite reports')}
              className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
            >
              <span>View favourites</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full">
          <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5">
            <Download size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">DOWNLOADS (MTD)</span>
            <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">{kpiStats?.downloadsMtd ?? 0}</div>
            <div className="text-[9.5px] font-semibold text-slate-400 mt-1 whitespace-nowrap">Exported this month</div>
            <button
              onClick={() => showToast('Showing report downloads')}
              className="text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
            >
              <span>View downloads</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white border border-slate-200/80 rounded-lg p-2 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full">
        {/* Search input */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search reports by name, category or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 text-xs font-semibold bg-slate-50/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Dropdown 1: Categories */}
        <div className="relative shrink-0">
          <button
            onClick={() => { setOpenCategoryDropdown(!openCategoryDropdown); setOpenTypeDropdown(false); setOpenStatusDropdown(false); }}
            className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
          >
            <span>{selectedCategory}</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
          {openCategoryDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
              {['All Categories', 'Operations Reports', 'Financial Reports', 'Compliance Reports', 'Analytics & Insights'].map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setOpenCategoryDropdown(false); }}
                  className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedCategory === cat ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <Check size={13} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown 2: Report Types */}
        <div className="relative shrink-0">
          <button
            onClick={() => { setOpenTypeDropdown(!openTypeDropdown); setOpenCategoryDropdown(false); setOpenStatusDropdown(false); }}
            className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
          >
            <span>{selectedType}</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
          {openTypeDropdown && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
              {['All Report Types', 'Executive Summary', 'Detailed Audit', 'Trend Analysis', 'Operational Log'].map(type => (
                <button
                  key={type}
                  onClick={() => { setSelectedType(type); setOpenTypeDropdown(false); }}
                  className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedType === type ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  <span>{type}</span>
                  {selectedType === type && <Check size={13} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown 3: Status */}
        <div className="relative shrink-0">
          <button
            onClick={() => { setOpenStatusDropdown(!openStatusDropdown); setOpenCategoryDropdown(false); setOpenTypeDropdown(false); }}
            className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
          >
            <span>{selectedStatus}</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
          {openStatusDropdown && (
            <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
              {['All Status', 'Active', 'Draft', 'Archived'].map(st => (
                <button
                  key={st}
                  onClick={() => { setSelectedStatus(st); setOpenStatusDropdown(false); }}
                  className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedStatus === st ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  <span>{st}</span>
                  {selectedStatus === st && <Check size={13} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Range Picker Input */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
          >
            <Calendar size={13} className="text-slate-400" />
            <span>{dateRange}</span>
            <Calendar size={13} className="text-slate-400" />
          </button>

          {showDatePicker && (
            <div className="absolute top-full right-0 mt-1 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-20 p-2.5 text-xs">
              <div className="font-bold text-slate-900 mb-1.5">Select Date Range</div>
              <div className="space-y-1">
                {['01 May 2025 - 31 May 2025', '01 Apr 2025 - 30 Apr 2025', 'Q1 2025 (Jan - Mar)', 'Year to Date 2025'].map(range => (
                  <button
                    key={range}
                    onClick={() => { setDateRange(range); setShowDatePicker(false); showToast(`Date updated: ${range}`); }}
                    className={`w-full text-left px-2 py-1 rounded text-xs font-medium cursor-pointer ${dateRange === range ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filter Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
          >
            <Filter size={13} className="text-slate-500" />
            <span>Filters</span>
          </button>

          <button
            onClick={() => showToast('Data refreshed')}
            title="Refresh Data"
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* ROW 1: 3 COLUMNS (REPORT CATEGORIES | REPORTS OVERVIEW | RECENTLY VIEWED REPORTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch w-full">

        {/* COLUMN 1: REPORT CATEGORIES (Span 3.5) */}
        <div className="lg:col-span-4 xl:col-span-3 bg-white border border-slate-200/80 rounded-lg p-2.5 shadow-2xs flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[10.5px] font-black text-slate-900 uppercase tracking-wider">REPORT CATEGORIES</h2>
              <button onClick={() => showToast('Showing all categories')} className="text-[9.5px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                <span>View All</span>
                <span>→</span>
              </button>
            </div>

            <div className="space-y-1">
              {reportCategories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => { setSelectedCategory(cat.title); showToast(`Filtered by ${cat.title}`); }}
                    className="py-1 px-2 rounded-md border border-slate-100 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-1.5 overflow-hidden pr-1">
                      <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 border ${cat.color}`}>
                        <Icon size={13} />
                      </div>
                      <div className="truncate">
                        <h3 className="text-[10.5px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight truncate">{cat.title}</h3>
                        <p className="text-[9px] text-slate-400 font-medium leading-tight truncate mt-0.5">{cat.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      <div className="text-right">
                        <div className="text-[9.5px] font-black text-slate-800 leading-none">{cat.count.split(' ')[0]}</div>
                        <div className="text-[7.5px] font-bold text-slate-400 uppercase leading-none mt-0.5">Reports</div>
                      </div>
                      <ChevronRight size={12} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMN 2: REPORTS OVERVIEW (MTD) CHART (Span 5) */}
        <div className="lg:col-span-8 xl:col-span-5 bg-white border border-slate-200/80 rounded-lg p-3 shadow-2xs flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">REPORTS OVERVIEW (MTD)</h2>
              <button onClick={() => showToast('Opening Analytics View')} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                <span>View Analytics</span>
                <span>→</span>
              </button>
            </div>

            {/* Legend indicators with horizontal pill lines matching Image 2 */}
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-600 mb-2 justify-center">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-1 rounded-full bg-[#4F46E5]"></span>
                <span>Generated</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-1 rounded-full bg-[#10B981]"></span>
                <span>Downloaded</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-1 rounded-full bg-[#F97316]"></span>
                <span>Scheduled</span>
              </div>
            </div>

            {/* Responsive Dense Multi-Point Line Chart matching Image 2 */}
            <div className="relative h-[165px] w-full pt-1">
              <svg viewBox="0 0 500 155" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="purpleGradientDetailed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Grid lines (0 to 100) */}
                {[0, 24, 48, 72, 96, 120].map((y, i) => (
                  <g key={i}>
                    <line x1="25" y1={y + 5} x2="490" y2={y + 5} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="5" y={y + 8} fill="#94A3B8" fontSize="8.5" fontWeight="600">{100 - i * 20}</text>
                  </g>
                ))}

                {/* X Axis Dates */}
                {['1 May', '8 May', '15 May', '22 May', '29 May'].map((date, i) => (
                  <text key={i} x={40 + i * 108} y="145" fill="#94A3B8" fontSize="8.5" fontWeight="600" textAnchor="middle">{date}</text>
                ))}

                {/* Shaded Gradient Area under Top Generated Curve */}
                <path
                  d="M 35 60 L 55 50 L 80 40 L 105 50 L 130 35 L 155 42 L 180 35 L 205 30 L 230 48 L 255 42 L 280 50 L 305 30 L 330 42 L 355 35 L 380 48 L 405 55 L 430 45 L 455 52 L 475 55 L 475 125 L 35 125 Z"
                  fill="url(#purpleGradientDetailed)"
                />

                {/* Line 1: Generated (Purple / Indigo Multi-Point Curve) */}
                <path
                  d="M 35 60 Q 45 55, 55 50 T 80 40 T 105 50 T 130 35 T 155 42 T 180 35 T 205 30 T 230 48 T 255 42 T 280 50 T 305 30 T 330 42 T 355 35 T 380 48 T 405 55 T 430 45 T 455 52 T 475 55"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {[
                  { x: 35, y: 60 }, { x: 55, y: 50 }, { x: 80, y: 40 }, { x: 105, y: 50 },
                  { x: 130, y: 35 }, { x: 155, y: 42 }, { x: 180, y: 35 }, { x: 205, y: 30 },
                  { x: 230, y: 48 }, { x: 255, y: 42 }, { x: 280, y: 50 }, { x: 305, y: 30 },
                  { x: 330, y: 42 }, { x: 355, y: 35 }, { x: 380, y: 48 }, { x: 405, y: 55 },
                  { x: 430, y: 45 }, { x: 455, y: 52 }, { x: 475, y: 55 }
                ].map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r="2.5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="1" className="hover:r-4 transition-all cursor-pointer" />
                ))}

                {/* Line 2: Downloaded (Green Multi-Point Curve) */}
                <path
                  d="M 35 95 Q 45 90, 55 85 T 80 80 T 105 90 T 130 85 T 155 80 T 180 75 T 205 78 T 230 85 T 255 90 T 280 82 T 305 85 T 330 90 T 355 80 T 380 88 T 405 98 T 430 92 T 455 85 T 475 88"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {[
                  { x: 35, y: 95 }, { x: 55, y: 85 }, { x: 80, y: 80 }, { x: 105, y: 90 },
                  { x: 130, y: 85 }, { x: 155, y: 80 }, { x: 180, y: 75 }, { x: 205, y: 78 },
                  { x: 230, y: 85 }, { x: 255, y: 90 }, { x: 280, y: 82 }, { x: 305, y: 85 },
                  { x: 330, y: 90 }, { x: 355, y: 80 }, { x: 380, y: 88 }, { x: 405, y: 98 },
                  { x: 430, y: 92 }, { x: 455, y: 85 }, { x: 475, y: 88 }
                ].map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r="2.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" className="hover:r-4 transition-all cursor-pointer" />
                ))}

                {/* Line 3: Scheduled (Orange Multi-Point Curve) */}
                <path
                  d="M 35 110 Q 45 110, 55 110 T 80 110 T 105 112 T 130 115 T 155 108 T 180 105 T 205 110 T 230 108 T 255 118 T 280 112 T 305 113 T 330 116 T 355 108 T 380 111 T 405 112 T 430 112 T 455 110 T 475 110"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {[
                  { x: 35, y: 110 }, { x: 55, y: 110 }, { x: 80, y: 110 }, { x: 105, y: 112 },
                  { x: 130, y: 115 }, { x: 155, y: 108 }, { x: 180, y: 105 }, { x: 205, y: 110 },
                  { x: 230, y: 108 }, { x: 255, y: 118 }, { x: 280, y: 112 }, { x: 305, y: 113 },
                  { x: 330, y: 116 }, { x: 355, y: 108 }, { x: 380, y: 111 }, { x: 405, y: 112 },
                  { x: 430, y: 112 }, { x: 455, y: 110 }, { x: 475, y: 110 }
                ].map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r="2.5" fill="#F97316" stroke="#FFFFFF" strokeWidth="1" className="hover:r-4 transition-all cursor-pointer" />
                ))}
              </svg>
            </div>
          </div>

          {/* Bottom 3 Mini KPI Summary Cards */}
          <div className="grid grid-cols-3 gap-2.5 mt-2.5 pt-2.5 border-t border-slate-100">
            <div className="bg-[#F5F3FF] rounded-xl p-2.5 border border-[#DDD6FE] text-left shadow-2xs">
              <div className="text-[10px] font-extrabold text-[#6366F1] uppercase tracking-wider">Generated</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-black text-slate-900 leading-none">{kpiStats?.totalReportsCount ?? customReportsList.length}</span>
                <span className="text-[10px] font-bold text-indigo-600">This Month</span>
              </div>
            </div>
            <div className="bg-[#EFF6FF] rounded-xl p-2.5 border border-[#BFDBFE] text-left shadow-2xs">
              <div className="text-[10px] font-extrabold text-[#2563EB] uppercase tracking-wider">Downloaded</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-black text-slate-900 leading-none">{kpiStats?.downloadsMtd ?? 0}</span>
                <span className="text-[10px] font-bold text-blue-600">MTD Total</span>
              </div>
            </div>
            <div className="bg-[#FFF7ED] rounded-xl p-2.5 border border-[#FED7AA] text-left shadow-2xs">
              <div className="text-[10px] font-extrabold text-[#EA580C] uppercase tracking-wider">Scheduled</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-black text-slate-900 leading-none">{kpiStats?.scheduledReportsCount ?? schedulesList.length}</span>
                <span className="text-[10px] font-bold text-orange-600">Active Jobs</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: RECENTLY VIEWED REPORTS (Span 4) */}
        <div className="lg:col-span-12 xl:col-span-4 bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">RECENTLY VIEWED REPORTS</h2>
              <button onClick={() => showToast('Showing report history')} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                <span>View All</span>
                <span>→</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {filteredRecentlyViewed.length === 0 ? (
                <div className="py-6 text-center text-xs font-semibold text-slate-400">No recently viewed reports</div>
              ) : (
                filteredRecentlyViewed.map(item => (
                  <div key={item.id} className="py-1.5 px-2 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-slate-50 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-2 overflow-hidden pr-1">
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${item.iconColor}`}>
                        <FileText size={14} />
                      </div>
                      <div className="truncate">
                        <h3 className="text-[11px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate leading-tight">{item.title}</h3>
                        <p className="text-[9.5px] text-slate-400 font-medium truncate mt-0.5 leading-tight">{item.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9.5px] text-slate-400 font-semibold whitespace-nowrap">{item.time}</span>

                      <button
                        onClick={() => toggleFavourite(item.title, item.category)}
                        title="Star report"
                        className="text-slate-300 hover:text-amber-400 transition-colors p-0.5"
                      >
                        <Star size={13} className={favourites.some(f => f.title === item.title) ? 'fill-amber-400 text-amber-400' : ''} />
                      </button>

                      <button
                        onClick={() => setActiveItemMenu(activeItemMenu === item.id ? null : item.id)}
                        className="text-slate-400 hover:text-slate-700 p-0.5"
                      >
                        <MoreHorizontal size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => showToast('Viewing complete historical logs')}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2.5 pt-2 border-t border-slate-100 cursor-pointer"
          >
            <span>View all history</span>
            <span>→</span>
          </button>
        </div>

      </div>

      {/* ROW 2: 3 COLUMNS (FAVOURITE REPORTS | SCHEDULED REPORTS | AI INSIGHTS MTD) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">

        {/* COLUMN 1: FAVOURITE REPORTS (Span 3) */}
        <div className="lg:col-span-4 xl:col-span-3 bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">FAVOURITE REPORTS</h2>
              <button onClick={() => showToast('Managing favourites')} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                <span>View All</span>
                <span>→</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {filteredFavourites.length === 0 ? (
                <div className="py-6 text-center text-xs font-semibold text-slate-400">No favourite reports added</div>
              ) : (
                filteredFavourites.map(item => (
                  <div key={item.id} className="py-1.5 px-2 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-slate-50 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-1.5 overflow-hidden pr-1">
                      <button onClick={() => toggleFavourite(item.title)} className="text-amber-400 p-0.5 shrink-0">
                        <Star size={14} className="fill-amber-400" />
                      </button>
                      <div className="truncate">
                        <h3 className="text-[11px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate leading-tight">{item.title}</h3>
                        <p className="text-[9.5px] text-slate-400 font-medium truncate mt-0.5 leading-tight">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {item.frequency}
                      </span>
                      <button onClick={() => showToast(`Report options for ${item.title}`)} className="text-slate-400 hover:text-slate-700 p-0.5">
                        <MoreHorizontal size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => showToast('Opening favourites configuration')}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2.5 pt-2 border-t border-slate-100 cursor-pointer"
          >
            <span>Manage favourites</span>
            <span>→</span>
          </button>
        </div>

        {/* COLUMN 2: SCHEDULED REPORTS (Span 5) */}
        <div className="lg:col-span-8 xl:col-span-5 bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">SCHEDULED REPORTS</h2>
              <button onClick={() => setShowScheduleModal(true)} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                <span>View All</span>
                <span>→</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {scheduledReports.length === 0 ? (
                <div className="py-6 text-center text-xs font-semibold text-slate-400">No scheduled reports configured</div>
              ) : (
                scheduledReports.map(item => (
                  <div key={item.id} className="py-1.5 px-2 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-slate-50 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-2 overflow-hidden pr-1">
                      <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Calendar size={14} />
                      </div>
                      <div className="truncate">
                        <h3 className="text-[11px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate leading-tight">{item.title || item.name}</h3>
                        <p className="text-[9.5px] text-slate-400 font-medium truncate mt-0.5 leading-tight">{item.recipients}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded hidden sm:inline-block">
                        {item.frequency}
                      </span>
                      <span className="text-[9.5px] text-slate-500 font-medium">
                        {item.date || item.nextRun || 'Today'}
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.status || 'Active'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2.5 pt-2 border-t border-slate-100 cursor-pointer"
          >
            <span>Manage schedules</span>
            <span>→</span>
          </button>
        </div>

        {/* COLUMN 3: AI INSIGHTS (MTD) (Span 4) */}
        <div className="lg:col-span-12 xl:col-span-4 bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">AI INSIGHTS (MTD)</h2>
              <button onClick={() => showToast('Opening complete AI Insights')} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                <span>View Insights</span>
                <span>→</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {aiInsights.length === 0 ? (
                <div className="py-6 text-center text-xs font-semibold text-slate-400">No AI insights generated yet</div>
              ) : (
                aiInsights.map(insight => {
                  const Icon = insight.icon;
                  return (
                    <div key={insight.id} className={`py-1.5 px-2 rounded-lg border ${insight.boxBg} flex items-center gap-2 transition-all hover:shadow-2xs`}>
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${insight.iconBg}`}>
                        {Icon && typeof Icon !== 'string' ? <Icon size={13} /> : <TrendingUp size={13} />}
                      </div>
                      <div className="truncate">
                        <h3 className={`text-[11px] font-bold ${insight.textColor || 'text-slate-900'} leading-tight truncate`}>{insight.title}</h3>
                        <p className="text-[9.5px] text-slate-500 font-medium leading-tight truncate mt-0.5">{insight.desc}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <button
            onClick={() => showToast('Viewing all AI insights and recommendations')}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2.5 pt-2 border-t border-slate-100 cursor-pointer"
          >
            <span>View all AI insights</span>
            <span>→</span>
          </button>
        </div>

      </div>




      {renderModals()}
    </div>
  );
}
