import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, Wallet, Briefcase, DollarSign, Percent, 
  Download, ChevronRight, Activity, PieChart as PieChartIcon, Info
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export default function Pnl() {
  const [financialYear, setFinancialYear] = useState('FY 2025/26');
  const [period, setPeriod] = useState('May 2026');
  const [comparison, setComparison] = useState('Apr 2026');
  const [showPercentage, setShowPercentage] = useState(true);
  const [activeTab, setActiveTab] = useState('P&L Statement');

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

  // KPI Data
  const kpis = [
    { title: 'Net Profit (This Period)', value: currNetProfit, change: npChange, isPp: false, icon: <Activity className="text-emerald-500" size={20}/>, bg: 'bg-emerald-50' },
    { title: 'Total Revenue', value: currRev, change: revChange, isPp: false, icon: <Wallet className="text-blue-500" size={20}/>, bg: 'bg-blue-50' },
    { title: 'Total Expenses', value: currTotalExpenses, change: expChange, isPp: false, icon: <Briefcase className="text-amber-500" size={20}/>, bg: 'bg-amber-50' },
    { title: 'Gross Profit', value: currGrossProfit, change: gpChange, isPp: false, icon: <DollarSign className="text-purple-500" size={20}/>, bg: 'bg-purple-50' },
    { title: 'Gross Profit Margin', value: currGpMargin, change: gpMarginChange, isPp: true, icon: <Percent className="text-sky-500" size={20}/>, bg: 'bg-sky-50' },
  ];

  const formatCurrency = (val) => `$${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  const formatPercent = (val) => `${val.toFixed(1)}%`;

  // Trend Chart Data
  const trendChartData = [
    { name: 'Jul', profit: 32000 },
    { name: 'Aug', profit: 34000 },
    { name: 'Sep', profit: 38000 },
    { name: 'Oct', profit: 42000 },
    { name: 'Nov', profit: 46000 },
    { name: 'Dec', profit: 44000 },
    { name: 'Jan', profit: 48000 },
    { name: 'Feb', profit: 51000 },
    { name: 'Mar', profit: 54000 },
    { name: 'Apr', profit: 60000 },
    { name: 'May', profit: 68950 },
  ];

  // Pie Chart Data
  const pieData = [
    { name: 'Cost of Sales', value: currCogs, color: '#10b981' }, // emerald
    { name: 'Operating Expenses', value: currOpex, color: '#3b82f6' }, // blue
    { name: 'Gross Profit', value: currGrossProfit, color: '#f59e0b' }, // amber
    { name: 'Net Profit', value: currNetProfit, color: '#a855f7', hidden: true }, // Not in the main ring but in legend perhaps? Wait, screenshot shows 3 segments.
  ].filter(x => !x.hidden);

  const TableRow = ({ label, curr, comp, isTotal = false }) => {
    const changeAbs = curr - comp;
    const changePct = calcChange(curr, comp);
    const isPositiveChange = changePct > 0;
    // In P&L, increased revenue is green, increased expense is red.
    // For simplicity, we just color the % change based on whether it's positive or negative.
    // Actually, in screenshot, % change is green for revenue, red for expenses? 
    // Screenshot: Freight Income 13.9% is Green. Driver Costs 10.8% is Red.
    // We can pass a flag `isExpense` to flip the color.
    return (
      <tr className={`border-b ${isTotal ? 'border-blue-100 bg-blue-50/20 font-bold text-blue-600' : 'border-slate-100 hover:bg-slate-50'} transition-colors`}>
        <td className={`px-4 py-3 text-xs ${isTotal ? 'font-bold' : 'font-medium text-slate-700'}`}>{label}</td>
        <td className="px-4 py-3 text-xs text-right font-semibold">{formatCurrency(curr)}</td>
        <td className="px-4 py-3 text-xs text-right font-medium text-slate-500">{formatCurrency(comp)}</td>
        <td className="px-4 py-3 text-xs text-right font-medium text-slate-500">{formatCurrency(changeAbs)}</td>
        {showPercentage && (
          <td className={`px-4 py-3 text-xs text-right font-bold ${changePct > 0 ? (isTotal === 'expense' ? 'text-rose-500' : 'text-emerald-500') : (isTotal === 'expense' ? 'text-emerald-500' : 'text-rose-500')}`}>
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
        <td className={`px-4 py-3 text-xs ${isTotal ? 'font-bold' : 'font-medium text-slate-700'}`}>{label}</td>
        <td className="px-4 py-3 text-xs text-right font-semibold">{formatCurrency(curr)}</td>
        <td className="px-4 py-3 text-xs text-right font-medium text-slate-500">{formatCurrency(comp)}</td>
        <td className="px-4 py-3 text-xs text-right font-medium text-slate-500">{formatCurrency(changeAbs)}</td>
        {showPercentage && (
          <td className={`px-4 py-3 text-xs text-right font-bold ${changePct > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
            {formatPercent(changePct)}
          </td>
        )}
      </tr>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] text-slate-800 font-sans overflow-y-auto w-full">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 flex-shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">P&L</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">View profit and loss statement for your business.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="px-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${kpi.bg}`}>
                {kpi.icon}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{kpi.title}</p>
              <div className="text-xl font-black text-slate-900 mb-2">
                {kpi.isPp ? formatPercent(kpi.value) : formatCurrency(kpi.value)}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium justify-between">
                <div className="flex items-center gap-1">
                  <span className={`flex items-center gap-0.5 font-bold ${kpi.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {kpi.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(kpi.change).toFixed(1)}{kpi.isPp ? ' pp' : '%'}
                  </span>
                  <span className="text-slate-400">vs {comparison}</span>
                </div>
                <button className="text-blue-600 hover:underline">View details →</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* LEFT COLUMN: P&L Statement (Spans 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
            
            {/* Tabs */}
            <div className="flex px-6 pt-2 border-b border-slate-200 gap-8">
              {['P&L Statement', 'Monthly Trend', 'Comparison', 'YTD Overview'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 border-b-2 text-sm font-bold transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'P&L Statement' ? (
              <div className="p-6">
                {/* Filters Row */}
                <div className="flex items-center gap-4 mb-6 flex-wrap">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Financial Year</label>
                    <select 
                      value={financialYear}
                      onChange={(e) => setFinancialYear(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none"
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
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none"
                    >
                      {Object.keys(db).map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Comparison</label>
                    <select 
                      value={comparison}
                      onChange={(e) => setComparison(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none"
                    >
                      {Object.keys(db).map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1 ml-auto">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider opacity-0">Toggle</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-600">Show Percentage</span>
                      <button 
                        onClick={() => setShowPercentage(!showPercentage)}
                        className={`w-10 h-5 rounded-full p-0.5 transition-colors ${showPercentage ? 'bg-blue-600' : 'bg-slate-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${showPercentage ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider opacity-0">Export</label>
                    <button className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                      <Download size={14} className="text-slate-500" /> Export
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-200">
                        <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-1/3">Category</th>
                        <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">{period}<br/><span className="lowercase font-medium">(This Period)</span></th>
                        <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">{comparison}<br/><span className="lowercase font-medium">(Last Period)</span></th>
                        <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">$ Change</th>
                        {showPercentage && <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">% Change</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Revenue */}
                      <tr><td colSpan={showPercentage ? 5 : 4} className="px-4 py-3 text-xs font-bold text-slate-900 bg-slate-50">Revenue</td></tr>
                      <TableRow label="Freight Income" curr={currentData.revenue.freight} comp={compData.revenue.freight} />
                      <TableRow label="Surcharges & Fuel Recovery" curr={currentData.revenue.surcharges} comp={compData.revenue.surcharges} />
                      <TableRow label="Other Income" curr={currentData.revenue.other} comp={compData.revenue.other} />
                      <TableRow label="Total Revenue" curr={currRev} comp={compRev} isTotal={true} />
                      
                      {/* Cost of Sales */}
                      <tr><td colSpan={showPercentage ? 5 : 4} className="px-4 py-3 text-xs font-bold text-slate-900 bg-slate-50 mt-2 block w-full">Cost of Sales</td></tr>
                      <ExpenseRow label="Driver Costs" curr={currentData.cogs.driver} comp={compData.cogs.driver} />
                      <ExpenseRow label="Fuel Costs" curr={currentData.cogs.fuel} comp={compData.cogs.fuel} />
                      <ExpenseRow label="Contractor Costs" curr={currentData.cogs.contractor} comp={compData.cogs.contractor} />
                      <ExpenseRow label="Vehicle Costs" curr={currentData.cogs.vehicle} comp={compData.cogs.vehicle} />
                      <ExpenseRow label="Tolls & Road Charges" curr={currentData.cogs.tolls} comp={compData.cogs.tolls} />
                      <ExpenseRow label="Other Direct Costs" curr={currentData.cogs.other} comp={compData.cogs.other} />
                      <ExpenseRow label="Total Cost of Sales" curr={currCogs} comp={compCogs} isTotal={true} />

                      {/* Gross Profit */}
                      <tr className="border-b-2 border-slate-200 bg-emerald-50/30">
                        <td className="px-4 py-4 text-xs font-bold text-emerald-700">Gross Profit</td>
                        <td className="px-4 py-4 text-xs text-right font-bold text-emerald-700">{formatCurrency(currGrossProfit)}</td>
                        <td className="px-4 py-4 text-xs text-right font-bold text-emerald-700">{formatCurrency(compGrossProfit)}</td>
                        <td className="px-4 py-4 text-xs text-right font-bold text-emerald-700">{formatCurrency(currGrossProfit - compGrossProfit)}</td>
                        {showPercentage && <td className="px-4 py-4 text-xs text-right font-bold text-emerald-700">{formatPercent(gpChange)}</td>}
                      </tr>

                      {/* Operating Expenses */}
                      <tr><td colSpan={showPercentage ? 5 : 4} className="px-4 py-3 text-xs font-bold text-slate-900 bg-slate-50 mt-2 block w-full">Operating Expenses</td></tr>
                      <ExpenseRow label="Administration Expenses" curr={currentData.opex.admin} comp={compData.opex.admin} />
                      <ExpenseRow label="Marketing Expenses" curr={currentData.opex.marketing} comp={compData.opex.marketing} />
                      <ExpenseRow label="Depreciation" curr={currentData.opex.depreciation} comp={compData.opex.depreciation} />
                      <ExpenseRow label="Other Expenses" curr={currentData.opex.other} comp={compData.opex.other} />
                      <ExpenseRow label="Total Operating Expenses" curr={currOpex} comp={compOpex} isTotal={true} />

                      {/* Net Profit */}
                      <tr className="border-b-2 border-slate-200 bg-emerald-100/50">
                        <td className="px-4 py-5 text-sm font-black text-emerald-800">Net Profit</td>
                        <td className="px-4 py-5 text-sm text-right font-black text-emerald-800">{formatCurrency(currNetProfit)}</td>
                        <td className="px-4 py-5 text-sm text-right font-black text-emerald-800">{formatCurrency(compNetProfit)}</td>
                        <td className="px-4 py-5 text-sm text-right font-black text-emerald-800">{formatCurrency(currNetProfit - compNetProfit)}</td>
                        {showPercentage && <td className="px-4 py-5 text-sm text-right font-black text-emerald-800">{formatPercent(npChange)}</td>}
                      </tr>

                    </tbody>
                  </table>
                  
                  <div className="mt-4 text-[10px] text-slate-400 font-medium">
                    All amounts are in AUD <Info size={10} className="inline ml-1 mb-0.5" />
                  </div>
                </div>
              </div>
            ) : (
               <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 space-y-4">
                 <PieChartIcon size={32} className="text-slate-300" />
                 <p className="text-sm font-medium">Detailed view for <span className="text-slate-700 font-bold">{activeTab}</span> is not populated in this demo.</p>
               </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Charts & Insights */}
        <div className="flex flex-col gap-6">
          
          {/* Net Profit Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 mb-1">Net Profit (This Period)</h3>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl font-black text-slate-900">{formatCurrency(currNetProfit)}</span>
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
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 mb-6">P&L Summary (This Period)</h3>
            
            <div className="flex items-center gap-6">
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
              
              <div className="flex flex-col gap-3 flex-1">
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
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 mb-4">Key Ratios (This Period)</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-medium text-slate-700">Gross Profit Margin</span>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-900">{formatPercent(currGpMargin)}</span>
                  <span className={`w-12 text-right font-bold ${gpMarginChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {gpMarginChange > 0 ? '↑' : '↓'} {Math.abs(gpMarginChange).toFixed(1)} pp
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-medium text-slate-700">Net Profit Margin</span>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-900">{formatPercent(currNpMargin)}</span>
                  <span className={`w-12 text-right font-bold ${currNpMargin - (compRev > 0 ? (compNetProfit/compRev)*100 : 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {currNpMargin - (compRev > 0 ? (compNetProfit/compRev)*100 : 0) > 0 ? '↑' : '↓'} {Math.abs(currNpMargin - (compRev > 0 ? (compNetProfit/compRev)*100 : 0)).toFixed(1)} pp
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span className="font-medium text-slate-700">Expense to Revenue</span>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-900">{formatPercent((currTotalExpenses/currRev)*100)}</span>
                  <span className={`w-12 text-right font-bold ${((currTotalExpenses/currRev)*100) - ((compTotalExpenses/compRev)*100) >= 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {((currTotalExpenses/currRev)*100) - ((compTotalExpenses/compRev)*100) > 0 ? '↑' : '↓'} {Math.abs(((currTotalExpenses/currRev)*100) - ((compTotalExpenses/compRev)*100)).toFixed(1)} pp
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-[10px] font-bold text-slate-700">
                <TrendingUp size={12} className="text-slate-400"/> View Monthly Trend
              </button>
              <button className="flex items-center justify-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-[10px] font-bold text-slate-700">
                <Activity size={12} className="text-slate-400"/> Compare Periods
              </button>
              <button className="col-span-2 flex items-center justify-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-[10px] font-bold text-slate-700">
                <Download size={12} className="text-slate-400"/> Export P&L Report
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
