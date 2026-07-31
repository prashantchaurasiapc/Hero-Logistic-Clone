import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, Wallet, Briefcase, DollarSign, Percent, 
  Download, ChevronRight, Activity, PieChart as PieChartIcon, Info, CheckCircle2,
  Calendar, Layers, BarChart3
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

export default function Pnl() {
  const [financialYear, setFinancialYear] = useState('FY 2025/26');
  const [period, setPeriod] = useState('May 2026');
  const [comparison, setComparison] = useState('Apr 2026');
  const [showPercentage, setShowPercentage] = useState(true);
  const [activeTab, setActiveTab] = useState('P&L Statement');
  const [toastMessage, setToastMessage] = useState(null);

  // --- MOCK DATA ---
  // Data for May 2026
  const dataMay2026 = {
    revenue: { freight: 468200, surcharges: 28650, other: 15580 },
    cogs: { driver: 228650, fuel: 96820, contractor: 48750, vehicle: 32450, tolls: 8430, other: 5540 },
    opex: { admin: 11850, marketing: 4280, depreciation: 3960, other: 2750 }
  };
  // Data for Apr 2026
  const dataApr2026 = {
    revenue: { freight: 410850, surcharges: 25480, other: 13730 },
    cogs: { driver: 206410, fuel: 87560, contractor: 43120, vehicle: 29840, tolls: 7520, other: 4810 },
    opex: { admin: 10820, marketing: 3680, depreciation: 3960, other: 2540 }
  };
  // Data for Mar 2026
  const dataMar2026 = {
    revenue: { freight: 390000, surcharges: 24000, other: 12000 },
    cogs: { driver: 195000, fuel: 85000, contractor: 40000, vehicle: 28000, tolls: 7000, other: 4500 },
    opex: { admin: 10500, marketing: 3500, depreciation: 3960, other: 2400 }
  };

  const db = {
    'May 2026': dataMay2026,
    'Apr 2026': dataApr2026,
    'Mar 2026': dataMar2026
  };

  // Safe fallback if selected month doesn't exist
  const currentData = db[period] || db['May 2026'];
  const compData = db[comparison] || db['Apr 2026'];

  // Helper to sum objects
  const sumObj = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

  // Compute Current Period Totals
  const currRev = sumObj(currentData.revenue);
  const currCogs = sumObj(currentData.cogs);
  const currOpex = sumObj(currentData.opex);
  const currGrossProfit = currRev - currCogs;
  const currTotalExpenses = currCogs + currOpex;
  const currNetProfit = currGrossProfit - currOpex;
  const currGpMargin = currRev > 0 ? (currGrossProfit / currRev) * 100 : 0;
  const currNpMargin = currRev > 0 ? (currNetProfit / currRev) * 100 : 0;

  // Compute Comparison Period Totals
  const compRev = sumObj(compData.revenue);
  const compCogs = sumObj(compData.cogs);
  const compOpex = sumObj(compData.opex);
  const compGrossProfit = compRev - compCogs;
  const compTotalExpenses = compCogs + compOpex;
  const compNetProfit = compGrossProfit - compOpex;
  const compGpMargin = compRev > 0 ? (compGrossProfit / compRev) * 100 : 0;

  // Percentage changes
  const calcChange = (curr, comp) => comp === 0 ? 0 : ((curr - comp) / comp) * 100;
  
  const npChange = calcChange(currNetProfit, compNetProfit);
  const revChange = calcChange(currRev, compRev);
  const expChange = calcChange(currTotalExpenses, compTotalExpenses);
  const gpChange = calcChange(currGrossProfit, compGrossProfit);
  const gpMarginChange = currGpMargin - compGpMargin; // pp change

  // KPI Data - Compact Sizing
  const kpis = [
    { title: 'Net Profit (This Period)', value: currNetProfit, change: npChange, isPp: false, icon: <Activity className="text-emerald-500" size={16}/>, bg: 'bg-emerald-50' },
    { title: 'Total Revenue', value: currRev, change: revChange, isPp: false, icon: <Wallet className="text-blue-500" size={16}/>, bg: 'bg-blue-50' },
    { title: 'Total Expenses', value: currTotalExpenses, change: expChange, isPp: false, icon: <Briefcase className="text-amber-500" size={16}/>, bg: 'bg-amber-50' },
    { title: 'Gross Profit', value: currGrossProfit, change: gpChange, isPp: false, icon: <DollarSign className="text-purple-500" size={16}/>, bg: 'bg-purple-50' },
    { title: 'Gross Profit Margin', value: currGpMargin, change: gpMarginChange, isPp: true, icon: <Percent className="text-sky-500" size={16}/>, bg: 'bg-sky-50' },
  ];

  const formatCurrency = (val) => `$${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  const formatPercent = (val) => `${val.toFixed(1)}%`;

  // CSV Export Handler
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `P&L Report - ${activeTab} (${financialYear})\n\n`;

    if (activeTab === 'P&L Statement') {
      csvContent += "Category,This Period (" + period + "),Last Period (" + comparison + "),$ Change,% Change\n";
      csvContent += `Freight Income,${currentData.revenue.freight},${compData.revenue.freight},${currentData.revenue.freight - compData.revenue.freight},${calcChange(currentData.revenue.freight, compData.revenue.freight).toFixed(2)}%\n`;
      csvContent += `Surcharges & Fuel Recovery,${currentData.revenue.surcharges},${compData.revenue.surcharges},${currentData.revenue.surcharges - compData.revenue.surcharges},${calcChange(currentData.revenue.surcharges, compData.revenue.surcharges).toFixed(2)}%\n`;
      csvContent += `Other Income,${currentData.revenue.other},${compData.revenue.other},${currentData.revenue.other - compData.revenue.other},${calcChange(currentData.revenue.other, compData.revenue.other).toFixed(2)}%\n`;
      csvContent += `TOTAL REVENUE,${currRev},${compRev},${currRev - compRev},${revChange.toFixed(2)}%\n\n`;
      csvContent += `Driver Costs,${currentData.cogs.driver},${compData.cogs.driver},${currentData.cogs.driver - compData.cogs.driver},${calcChange(currentData.cogs.driver, compData.cogs.driver).toFixed(2)}%\n`;
      csvContent += `Fuel Costs,${currentData.cogs.fuel},${compData.cogs.fuel},${currentData.cogs.fuel - compData.cogs.fuel},${calcChange(currentData.cogs.fuel, compData.cogs.fuel).toFixed(2)}%\n`;
      csvContent += `TOTAL COST OF SALES,${currCogs},${compCogs},${currCogs - compCogs},${calcChange(currCogs, compCogs).toFixed(2)}%\n`;
      csvContent += `GROSS PROFIT,${currGrossProfit},${compGrossProfit},${currGrossProfit - compGrossProfit},${gpChange.toFixed(2)}%\n`;
      csvContent += `NET PROFIT,${currNetProfit},${compNetProfit},${currNetProfit - compNetProfit},${npChange.toFixed(2)}%\n`;
    } else if (activeTab === 'Monthly Trend') {
      csvContent += "Month,Revenue,Cost of Sales,Gross Profit,Operating Expenses,Net Profit,Net Margin\n";
      monthlyTrendTableData.forEach(m => {
        csvContent += `${m.month},${m.revenue},${m.cogs},${m.grossProfit},${m.opex},${m.netProfit},${m.margin}%\n`;
      });
    } else if (activeTab === 'Comparison') {
      csvContent += "Metric,May 2026,Apr 2026,Mar 2026,Variance (May vs Apr),Variance %\n";
      comparisonData.forEach(row => {
        csvContent += `${row.metric},${row.may},${row.apr},${row.mar},${row.varDollar},${row.varPct}%\n`;
      });
    } else {
      csvContent += "Category,YTD Actual,YTD Target,Variance $,Variance %,Status\n";
      ytdOverviewData.forEach(row => {
        csvContent += `${row.category},${row.actual},${row.target},${row.variance},${row.pct}%,${row.status}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Pnl_${activeTab.replace(/\s+/g, '_')}_${financialYear.replace(/\//g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`Exported ${activeTab} statement successfully!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Trend Chart Data
  const trendChartData = [
    { name: 'Jul', profit: 32000, revenue: 380000, cogs: 310000 },
    { name: 'Aug', profit: 34000, revenue: 395000, cogs: 322000 },
    { name: 'Sep', profit: 38000, revenue: 410000, cogs: 334000 },
    { name: 'Oct', profit: 42000, revenue: 425000, cogs: 345000 },
    { name: 'Nov', profit: 46000, revenue: 440000, cogs: 356000 },
    { name: 'Dec', profit: 44000, revenue: 435000, cogs: 353000 },
    { name: 'Jan', profit: 48000, revenue: 450000, cogs: 364000 },
    { name: 'Feb', profit: 51000, revenue: 460000, cogs: 371000 },
    { name: 'Mar', profit: 54000, revenue: 426000, cogs: 350000 },
    { name: 'Apr', profit: 60000, revenue: 450060, cogs: 370330 },
    { name: 'May', profit: 68950, revenue: 512430, cogs: 420640 },
  ];

  // Data for Tab 2: Monthly Trend Table
  const monthlyTrendTableData = [
    { month: 'Jul 2025', revenue: 380000, cogs: 310000, grossProfit: 70000, opex: 38000, netProfit: 32000, margin: 8.4 },
    { month: 'Aug 2025', revenue: 395000, cogs: 322000, grossProfit: 73000, opex: 39000, netProfit: 34000, margin: 8.6 },
    { month: 'Sep 2025', revenue: 410000, cogs: 334000, grossProfit: 76000, opex: 38000, netProfit: 38000, margin: 9.3 },
    { month: 'Oct 2025', revenue: 425000, cogs: 345000, grossProfit: 80000, opex: 38000, netProfit: 42000, margin: 9.9 },
    { month: 'Nov 2025', revenue: 440000, cogs: 356000, grossProfit: 84000, opex: 38000, netProfit: 46000, margin: 10.5 },
    { month: 'Dec 2025', revenue: 435000, cogs: 353000, grossProfit: 82000, opex: 38000, netProfit: 44000, margin: 10.1 },
    { month: 'Jan 2026', revenue: 450000, cogs: 364000, grossProfit: 86000, opex: 38000, netProfit: 48000, margin: 10.7 },
    { month: 'Feb 2026', revenue: 460000, cogs: 371000, grossProfit: 89000, opex: 38000, netProfit: 51000, margin: 11.1 },
    { month: 'Mar 2026', revenue: 426000, cogs: 350000, grossProfit: 76000, opex: 22000, netProfit: 54000, margin: 12.7 },
    { month: 'Apr 2026', revenue: 450060, cogs: 370330, grossProfit: 79730, opex: 19730, netProfit: 60000, margin: 13.3 },
    { month: 'May 2026', revenue: 512430, cogs: 420640, grossProfit: 91790, opex: 22840, netProfit: 68950, margin: 13.5 }
  ];

  // Data for Tab 3: Period Comparison
  const comparisonData = [
    { metric: 'Total Revenue', may: 512430, apr: 450060, mar: 426000, varDollar: 62370, varPct: 13.9, isGood: true },
    { metric: 'Freight Income', may: 468200, apr: 410850, mar: 390000, varDollar: 57350, varPct: 13.9, isGood: true },
    { metric: 'Surcharges & Recovery', may: 28650, apr: 25480, mar: 24000, varDollar: 3170, varPct: 12.4, isGood: true },
    { metric: 'Cost of Sales (COGS)', may: 420640, apr: 370330, mar: 350000, varDollar: 50310, varPct: 13.6, isGood: false },
    { metric: 'Driver Wages & Subcontractors', may: 228650, apr: 206410, mar: 195000, varDollar: 22240, varPct: 10.8, isGood: false },
    { metric: 'Fuel Costs', may: 96820, apr: 87560, mar: 85000, varDollar: 9260, varPct: 10.6, isGood: false },
    { metric: 'Gross Profit', may: 91790, apr: 79730, mar: 76000, varDollar: 12060, varPct: 15.1, isGood: true },
    { metric: 'Operating Expenses', may: 22840, apr: 19730, mar: 19730, varDollar: 3110, varPct: 15.8, isGood: false },
    { metric: 'Net Profit', may: 68950, apr: 60000, mar: 54000, varDollar: 8950, varPct: 14.9, isGood: true },
  ];

  // Data for Tab 4: YTD Overview
  const ytdOverviewData = [
    { category: 'Gross Freight Revenue', actual: 4850000, target: 4650000, variance: 200000, pct: 4.3, status: 'Exceeded Target', color: 'emerald' },
    { category: 'Fuel Surcharges & Fees', actual: 298000, target: 280000, variance: 18000, pct: 6.4, status: 'Exceeded Target', color: 'emerald' },
    { category: 'Driver Payroll & Contractors', actual: 2420000, target: 2350000, variance: -70000, pct: -2.9, status: 'Slightly Over Budget', color: 'amber' },
    { category: 'Fuel & Fleet Running Costs', actual: 1020000, target: 980000, variance: -40000, pct: -4.0, status: 'Controlled Variance', color: 'slate' },
    { category: 'Maintenance & Repairs', actual: 340000, target: 360000, variance: 20000, pct: 5.5, status: 'Under Budget', color: 'emerald' },
    { category: 'Admin & General Opex', actual: 538000, target: 550000, variance: 12000, pct: 2.2, status: 'On Target', color: 'blue' },
  ];

  // Pie Chart Data
  const pieData = [
    { name: 'Cost of Sales', value: currCogs, color: '#10b981' },
    { name: 'Operating Expenses', value: currOpex, color: '#3b82f6' },
    { name: 'Gross Profit', value: currGrossProfit, color: '#f59e0b' },
  ];

  const TableRow = ({ label, curr, comp, isTotal = false }) => {
    const changeAbs = curr - comp;
    const changePct = calcChange(curr, comp);
    return (
      <tr className={`border-b ${isTotal ? 'border-blue-100 bg-blue-50/20 font-bold text-blue-600' : 'border-slate-100 hover:bg-slate-50'} transition-colors`}>
        <td className={`px-4 py-2.5 text-xs ${isTotal ? 'font-bold' : 'font-medium text-slate-700'}`}>{label}</td>
        <td className="px-4 py-2.5 text-xs text-right font-semibold">{formatCurrency(curr)}</td>
        <td className="px-4 py-2.5 text-xs text-right font-medium text-slate-500">{formatCurrency(comp)}</td>
        <td className="px-4 py-2.5 text-xs text-right font-medium text-slate-500">{formatCurrency(changeAbs)}</td>
        {showPercentage && (
          <td className={`px-4 py-2.5 text-xs text-right font-bold ${changePct > 0 ? (isTotal === 'expense' ? 'text-rose-500' : 'text-emerald-500') : (isTotal === 'expense' ? 'text-emerald-500' : 'text-rose-500')}`}>
            {formatPercent(changePct)}
          </td>
        )}
      </tr>
    );
  };

  const ExpenseRow = ({ label, curr, comp, isTotal = false }) => {
    const changeAbs = curr - comp;
    const changePct = calcChange(curr, comp);
    return (
      <tr className={`border-b ${isTotal ? 'border-slate-200 bg-slate-50 font-bold text-blue-600' : 'border-slate-100 hover:bg-slate-50'} transition-colors`}>
        <td className={`px-4 py-2.5 text-xs ${isTotal ? 'font-bold' : 'font-medium text-slate-700'}`}>{label}</td>
        <td className="px-4 py-2.5 text-xs text-right font-semibold">{formatCurrency(curr)}</td>
        <td className="px-4 py-2.5 text-xs text-right font-medium text-slate-500">{formatCurrency(comp)}</td>
        <td className="px-4 py-2.5 text-xs text-right font-medium text-slate-500">{formatCurrency(changeAbs)}</td>
        {showPercentage && (
          <td className={`px-4 py-2.5 text-xs text-right font-bold ${changePct > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
            {formatPercent(changePct)}
          </td>
        )}
      </tr>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] text-slate-800 font-sans overflow-y-auto w-full relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="px-3 sm:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4 flex-shrink-0">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">P&L</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">View profit and loss statement for your business.</p>
      </div>

      {/* KPI Cards Grid - Mobile Responsive */}
      <div className="px-3 sm:px-8 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 mb-5 flex-shrink-0">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-xl p-3 sm:p-3.5 shadow-sm border border-slate-200/60 flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between mb-1.5">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${kpi.bg}`}>
                {kpi.icon}
              </div>
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 truncate">{kpi.title}</p>
              <div className="text-base sm:text-lg font-black text-slate-900 mb-1 truncate">
                {kpi.isPp ? formatPercent(kpi.value) : formatCurrency(kpi.value)}
              </div>
              <div className="flex items-center justify-between text-[10px] font-medium gap-1 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className={`flex items-center gap-0.5 font-bold ${kpi.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {kpi.change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {Math.abs(kpi.change).toFixed(1)}{kpi.isPp ? ' pp' : '%'}
                  </span>
                  <span className="text-slate-400 hidden xs:inline">vs {comparison}</span>
                </div>
                <button onClick={() => { setActiveTab('P&L Statement'); }} className="text-blue-600 hover:underline cursor-pointer text-[9px] font-bold">Details →</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="px-3 sm:px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 flex-1">
        
        {/* LEFT COLUMN: Main Tabs Container (Spans 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
            
            {/* Tabs Header */}
            <div className="flex px-3 sm:px-6 pt-2 border-b border-slate-200 gap-3 sm:gap-8 overflow-x-auto scrollbar-hide">
              {['P&L Statement', 'Monthly Trend', 'Comparison', 'YTD Overview'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB 1: P&L STATEMENT */}
            {activeTab === 'P&L Statement' && (
              <div className="p-3 sm:p-6">
                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
                  <div className="grid grid-cols-1 xs:grid-cols-3 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Financial Year</label>
                      <select 
                        value={financialYear}
                        onChange={(e) => setFinancialYear(e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 font-medium focus:outline-none cursor-pointer w-full"
                      >
                        <option>FY 2025/26</option>
                        <option>FY 2024/25</option>
                      </select>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Period</label>
                      <select 
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 font-medium focus:outline-none cursor-pointer w-full"
                      >
                        {Object.keys(db).map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Comparison</label>
                      <select 
                        value={comparison}
                        onChange={(e) => setComparison(e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 font-medium focus:outline-none cursor-pointer w-full"
                      >
                        {Object.keys(db).map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-600">Show Percentage</span>
                      <button 
                        onClick={() => setShowPercentage(!showPercentage)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${showPercentage ? 'bg-blue-600' : 'bg-slate-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${showPercentage ? 'translate-x-4' : 'translate-x-0'}`}></div>
                      </button>
                    </div>
                    
                    <button 
                      onClick={handleExportCSV}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 font-medium hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Download size={14} className="text-slate-500" /> Export
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
                  <table className="min-w-[650px] w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="border-b-2 border-slate-200 bg-slate-50">
                        <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-1/3">Category</th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">{period}<br/><span className="lowercase font-medium">(This Period)</span></th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">{comparison}<br/><span className="lowercase font-medium">(Last Period)</span></th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">$ Change</th>
                        {showPercentage && <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">% Change</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Revenue */}
                      <tr><td colSpan={showPercentage ? 5 : 4} className="px-4 py-2.5 text-xs font-bold text-slate-900 bg-slate-100/70">Revenue</td></tr>
                      <TableRow label="Freight Income" curr={currentData.revenue.freight} comp={compData.revenue.freight} />
                      <TableRow label="Surcharges & Fuel Recovery" curr={currentData.revenue.surcharges} comp={compData.revenue.surcharges} />
                      <TableRow label="Other Income" curr={currentData.revenue.other} comp={compData.revenue.other} />
                      <TableRow label="Total Revenue" curr={currRev} comp={compRev} isTotal={true} />
                      
                      {/* Cost of Sales */}
                      <tr><td colSpan={showPercentage ? 5 : 4} className="px-4 py-2.5 text-xs font-bold text-slate-900 bg-slate-100/70">Cost of Sales</td></tr>
                      <ExpenseRow label="Driver Costs" curr={currentData.cogs.driver} comp={compData.cogs.driver} />
                      <ExpenseRow label="Fuel Costs" curr={currentData.cogs.fuel} comp={compData.cogs.fuel} />
                      <ExpenseRow label="Contractor Costs" curr={currentData.cogs.contractor} comp={compData.cogs.contractor} />
                      <ExpenseRow label="Vehicle Costs" curr={currentData.cogs.vehicle} comp={compData.cogs.vehicle} />
                      <ExpenseRow label="Tolls & Road Charges" curr={currentData.cogs.tolls} comp={compData.cogs.tolls} />
                      <ExpenseRow label="Other Direct Costs" curr={currentData.cogs.other} comp={compData.cogs.other} />
                      <ExpenseRow label="Total Cost of Sales" curr={currCogs} comp={compCogs} isTotal={true} />

                      {/* Gross Profit */}
                      <tr className="border-b-2 border-slate-200 bg-emerald-50/40">
                        <td className="px-4 py-3.5 text-xs font-bold text-emerald-700">Gross Profit</td>
                        <td className="px-4 py-3.5 text-xs text-right font-bold text-emerald-700">{formatCurrency(currGrossProfit)}</td>
                        <td className="px-4 py-3.5 text-xs text-right font-bold text-emerald-700">{formatCurrency(compGrossProfit)}</td>
                        <td className="px-4 py-3.5 text-xs text-right font-bold text-emerald-700">{formatCurrency(currGrossProfit - compGrossProfit)}</td>
                        {showPercentage && <td className="px-4 py-3.5 text-xs text-right font-bold text-emerald-700">{formatPercent(gpChange)}</td>}
                      </tr>

                      {/* Operating Expenses */}
                      <tr><td colSpan={showPercentage ? 5 : 4} className="px-4 py-2.5 text-xs font-bold text-slate-900 bg-slate-100/70">Operating Expenses</td></tr>
                      <ExpenseRow label="Administration Expenses" curr={currentData.opex.admin} comp={compData.opex.admin} />
                      <ExpenseRow label="Marketing Expenses" curr={currentData.opex.marketing} comp={compData.opex.marketing} />
                      <ExpenseRow label="Depreciation" curr={currentData.opex.depreciation} comp={compData.opex.depreciation} />
                      <ExpenseRow label="Other Expenses" curr={currentData.opex.other} comp={compData.opex.other} />
                      <ExpenseRow label="Total Operating Expenses" curr={currOpex} comp={compOpex} isTotal={true} />

                      {/* Net Profit */}
                      <tr className="border-b-2 border-slate-200 bg-emerald-100/60">
                        <td className="px-4 py-4 text-xs sm:text-sm font-black text-emerald-800">Net Profit</td>
                        <td className="px-4 py-4 text-xs sm:text-sm text-right font-black text-emerald-800">{formatCurrency(currNetProfit)}</td>
                        <td className="px-4 py-4 text-xs sm:text-sm text-right font-black text-emerald-800">{formatCurrency(compNetProfit)}</td>
                        <td className="px-4 py-4 text-xs sm:text-sm text-right font-black text-emerald-800">{formatCurrency(currNetProfit - compNetProfit)}</td>
                        {showPercentage && <td className="px-4 py-4 text-xs sm:text-sm text-right font-black text-emerald-800">{formatPercent(npChange)}</td>}
                      </tr>

                    </tbody>
                  </table>
                </div>
                
                <div className="mt-3 text-[10px] text-slate-400 font-medium flex items-center justify-between flex-wrap gap-2">
                  <span>All amounts are in AUD <Info size={10} className="inline ml-1 mb-0.5" /></span>
                  <span>Financial Year: {financialYear}</span>
                </div>
              </div>
            )}

            {/* TAB 2: MONTHLY TREND */}
            {activeTab === 'Monthly Trend' && (
              <div className="p-3 sm:p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Monthly P&L Trend ({financialYear})</h3>
                    <p className="text-xs text-slate-500 font-medium">Month-by-month financial performance breakdown</p>
                  </div>
                  <button 
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Download size={13} className="text-slate-500" /> Export Monthly Trend
                  </button>
                </div>

                {/* Trend Table */}
                <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
                  <table className="min-w-[650px] w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Month</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Revenue</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">COGS</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Gross Profit</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Opex</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Net Profit</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Net Margin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {monthlyTrendTableData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-2.5 text-xs font-bold text-slate-900">{row.month}</td>
                          <td className="px-4 py-2.5 text-xs font-semibold text-slate-700 text-right">{formatCurrency(row.revenue)}</td>
                          <td className="px-4 py-2.5 text-xs font-medium text-slate-600 text-right">{formatCurrency(row.cogs)}</td>
                          <td className="px-4 py-2.5 text-xs font-bold text-emerald-600 text-right">{formatCurrency(row.grossProfit)}</td>
                          <td className="px-4 py-2.5 text-xs font-medium text-slate-600 text-right">{formatCurrency(row.opex)}</td>
                          <td className="px-4 py-2.5 text-xs font-black text-slate-900 text-right">{formatCurrency(row.netProfit)}</td>
                          <td className="px-4 py-2.5 text-xs font-bold text-blue-600 text-right">{row.margin}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: COMPARISON */}
            {activeTab === 'Comparison' && (
              <div className="p-3 sm:p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Multi-Period Comparison</h3>
                    <p className="text-xs text-slate-500 font-medium">Side-by-side variance analysis for recent periods</p>
                  </div>
                  <button 
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Download size={13} className="text-slate-500" /> Export Comparison
                  </button>
                </div>

                <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
                  <table className="min-w-[650px] w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Financial Line Item</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">May 2026</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Apr 2026</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Mar 2026</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Variance ($)</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Variance (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {comparisonData.map((row, idx) => (
                        <tr key={idx} className={`hover:bg-slate-50 transition-colors ${row.metric.includes('Total') || row.metric.includes('Profit') ? 'bg-slate-50/70 font-bold' : ''}`}>
                          <td className="px-4 py-3 text-xs font-semibold text-slate-900">{row.metric}</td>
                          <td className="px-4 py-3 text-xs font-bold text-slate-900 text-right">{formatCurrency(row.may)}</td>
                          <td className="px-4 py-3 text-xs font-medium text-slate-600 text-right">{formatCurrency(row.apr)}</td>
                          <td className="px-4 py-3 text-xs font-medium text-slate-600 text-right">{formatCurrency(row.mar)}</td>
                          <td className="px-4 py-3 text-xs font-semibold text-slate-700 text-right">{formatCurrency(row.varDollar)}</td>
                          <td className={`px-4 py-3 text-xs font-bold text-right ${row.isGood ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {row.varPct > 0 ? '+' : ''}{row.varPct}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: YTD OVERVIEW */}
            {activeTab === 'YTD Overview' && (
              <div className="p-3 sm:p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Year-to-Date Financial Overview ({financialYear})</h3>
                    <p className="text-xs text-slate-500 font-medium">Cumulative performance vs annual targets</p>
                  </div>
                  <button 
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Download size={13} className="text-slate-500" /> Export YTD Overview
                  </button>
                </div>

                {/* YTD Summary Cards */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-xl p-3.5 flex flex-col">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">YTD Revenue</span>
                    <span className="text-lg sm:text-xl font-black text-slate-900 mt-1">$5,148,000.00</span>
                    <span className="text-xs font-bold text-emerald-600 mt-1">↑ +4.3% vs Target</span>
                  </div>
                  <div className="bg-blue-50/50 border border-blue-200/60 rounded-xl p-3.5 flex flex-col">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">YTD Gross Profit</span>
                    <span className="text-lg sm:text-xl font-black text-slate-900 mt-1">$982,000.00</span>
                    <span className="text-xs font-bold text-blue-600 mt-1">19.1% Gross Margin</span>
                  </div>
                  <div className="bg-purple-50/50 border border-purple-200/60 rounded-xl p-3.5 flex flex-col xs:col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">YTD Net Profit</span>
                    <span className="text-lg sm:text-xl font-black text-slate-900 mt-1">$578,950.00</span>
                    <span className="text-xs font-bold text-purple-600 mt-1">11.2% Net Margin</span>
                  </div>
                </div>

                {/* YTD Table */}
                <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
                  <table className="min-w-[650px] w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Financial Line Item</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">YTD Actual</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">YTD Target</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Variance ($)</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Variance (%)</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ytdOverviewData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-xs font-bold text-slate-900">{row.category}</td>
                          <td className="px-4 py-3 text-xs font-bold text-slate-900 text-right">{formatCurrency(row.actual)}</td>
                          <td className="px-4 py-3 text-xs font-medium text-slate-600 text-right">{formatCurrency(row.target)}</td>
                          <td className="px-4 py-3 text-xs font-semibold text-slate-700 text-right">{formatCurrency(row.variance)}</td>
                          <td className={`px-4 py-3 text-xs font-bold text-right ${row.pct >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {row.pct > 0 ? '+' : ''}{row.pct}%
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : row.color === 'amber' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                              {row.status}
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
        </div>

        {/* RIGHT COLUMN: Charts & Insights */}
        <div className="flex flex-col gap-6">
          
          {/* Net Profit Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 sm:p-6 flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 mb-1">Net Profit (This Period)</h3>
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-lg sm:text-xl font-black text-slate-900">{formatCurrency(currNetProfit)}</span>
              <span className={`flex items-center gap-0.5 text-xs font-bold ${npChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {npChange >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>} {Math.abs(npChange).toFixed(1)}% <span className="text-slate-400 font-medium ml-1">vs {comparison}</span>
              </span>
            </div>
            
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendChartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} tickFormatter={(val) => `$${val/1000}k`} />
                  <RechartsTooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Profit']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#10b981' }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* P&L Summary (Donut Chart) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 sm:p-6 flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 mb-4 sm:mb-6">P&L Summary (This Period)</h3>
            
            <div className="flex flex-col xs:flex-row items-center justify-center gap-4 sm:gap-6">
              <div className="relative w-32 h-32 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-slate-500">Total Revenue</span>
                  <span className="text-xs font-black text-slate-900">{formatCurrency(currRev)}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2.5 sm:gap-3 flex-1 w-full xs:w-auto">
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1 bg-emerald-500"></span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-700">Cost of Sales</span>
                    <span className="text-[9px] text-slate-500">{((currCogs/currRev)*100).toFixed(1)}% ({formatCurrency(currCogs)})</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1 bg-blue-500"></span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-700">Operating Expenses</span>
                    <span className="text-[9px] text-slate-500">{((currOpex/currRev)*100).toFixed(1)}% ({formatCurrency(currOpex)})</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1 bg-amber-500"></span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-700">Gross Profit</span>
                    <span className="text-[9px] text-slate-500">{((currGrossProfit/currRev)*100).toFixed(1)}% ({formatCurrency(currGrossProfit)})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Ratios */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 sm:p-6 flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 mb-4">Key Ratios (This Period)</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-medium text-slate-700">Gross Profit Margin</span>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="font-bold text-slate-900">{formatPercent(currGpMargin)}</span>
                  <span className={`w-12 text-right font-bold ${gpMarginChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {gpMarginChange > 0 ? '↑' : '↓'} {Math.abs(gpMarginChange).toFixed(1)} pp
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-medium text-slate-700">Net Profit Margin</span>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="font-bold text-slate-900">{formatPercent(currNpMargin)}</span>
                  <span className={`w-12 text-right font-bold ${currNpMargin - (compRev > 0 ? (compNetProfit/compRev)*100 : 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {currNpMargin - (compRev > 0 ? (compNetProfit/compRev)*100 : 0) > 0 ? '↑' : '↓'} {Math.abs(currNpMargin - (compRev > 0 ? (compNetProfit/compRev)*100 : 0)).toFixed(1)} pp
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span className="font-medium text-slate-700">Expense to Revenue</span>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="font-bold text-slate-900">{formatPercent((currTotalExpenses/currRev)*100)}</span>
                  <span className={`w-12 text-right font-bold ${((currTotalExpenses/currRev)*100) - ((compTotalExpenses/compRev)*100) >= 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {((currTotalExpenses/currRev)*100) - ((compTotalExpenses/compRev)*100) > 0 ? '↑' : '↓'} {Math.abs(((currTotalExpenses/currRev)*100) - ((compTotalExpenses/compRev)*100)).toFixed(1)} pp
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 sm:p-6 flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <button 
                onClick={() => setActiveTab('Monthly Trend')}
                className="flex items-center justify-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-[10px] font-bold text-slate-700 cursor-pointer"
              >
                <TrendingUp size={12} className="text-slate-400"/> View Monthly Trend
              </button>
              <button 
                onClick={() => setActiveTab('Comparison')}
                className="flex items-center justify-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-[10px] font-bold text-slate-700 cursor-pointer"
              >
                <Activity size={12} className="text-slate-400"/> Compare Periods
              </button>
              <button 
                onClick={handleExportCSV}
                className="col-span-2 flex items-center justify-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-[10px] font-bold text-slate-700 cursor-pointer"
              >
                <Download size={12} className="text-slate-400"/> Export P&L Report
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
