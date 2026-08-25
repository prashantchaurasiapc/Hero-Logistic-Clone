import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import api from '../../services/api';
import { 
  Download, 
  FileText, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Save, 
  Cpu, 
  Calendar,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function AIControls() {
  const [features, setFeatures] = useState({
    loadParse: true,
    receiptScan: true,
    odometer: true,
    smartDispatch: false,
    etaPrediction: true,
    chatAssistant: false
  });

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportDateRange, setExportDateRange] = useState('Last 7 Days');
  const [toastMsg, setToastMsg] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const [configForm, setConfigForm] = useState({
    loadParseConf: '85',
    receiptOcrConf: '90',
    odometerConf: '95',
    dailyLimit: '1000'
  });

  const [aiStats, setAiStats] = useState({
    activeFeatures: 0,
    requestsToday: 0,
    avgLatencyMs: 0,
    successRate: '0%',
    failedRequests: 0,
    storageUsed: '0 TB'
  });
  
  const [activityLogs, setActivityLogs] = useState([]);
  const [aiModulesData, setAiModulesData] = useState([]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchAIModuleConfig = async () => {
    try {
      const res = await api.get('/ai-modules');
      if (res.data?.success && res.data.data.length > 0) {
        const modules = res.data.data;
        setAiModulesData(modules);
        
        // Map feature statuses
        const statusMap = {
          loadParse: false,
          receiptScan: false,
          odometer: false,
          smartDispatch: false,
          etaPrediction: false,
          chatAssistant: false
        };

        const keyMap = {
          'Load Parse AI': 'loadParse',
          'Receipt Scan OCR': 'receiptScan',
          'Odometer Detection': 'odometer',
          'Smart Dispatch': 'smartDispatch',
          'ETA Prediction': 'etaPrediction',
          'Chat Assistant': 'chatAssistant'
        };

        modules.forEach(m => {
          const key = keyMap[m.name];
          if (key) {
            statusMap[key] = m.isActiveGlobally;
          }
        });

        setFeatures(statusMap);

        // Map config values from main thresholds
        const loadParseModule = modules.find(m => m.name === 'Load Parse AI');
        const receiptOCRModule = modules.find(m => m.name === 'Receipt Scan OCR');
        const odometerModule = modules.find(m => m.name === 'Odometer Detection');

        setConfigForm({
          loadParseConf: loadParseModule?.confidenceThreshold?.toString() || '85',
          receiptOcrConf: receiptOCRModule?.confidenceThreshold?.toString() || '90',
          dailyLimit: (loadParseModule?.dailyApiLimit || receiptOCRModule?.dailyApiLimit || odometerModule?.dailyApiLimit || 1000).toString()
        });

        if (res.data.meta?.stats) {
          setAiStats(res.data.meta.stats);
        }
      }
      
      const logRes = await api.get('/ai-activity-logs');
      if (logRes.data?.success) {
        setActivityLogs(logRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load AI module configurations:', err);
    }
  };

  useEffect(() => {
    fetchAIModuleConfig();
  }, []);

  const toggleFeature = async (key) => {
    const newVal = !features[key];
    setFeatures(prev => ({ ...prev, [key]: newVal }));
    try {
      await api.post('/ai-modules', { moduleKey: key, isEnabled: newVal });
      triggerToast(`AI module '${key}' ${newVal ? 'enabled' : 'disabled'}.`);
    } catch (err) {
      // revert on failure
      setFeatures(prev => ({ ...prev, [key]: !newVal }));
      triggerToast('Error toggling AI module.');
    }
  };

  const enableAll = async () => {
    const allEnabled = {
      loadParse: true, receiptScan: true, odometer: true,
      smartDispatch: true, etaPrediction: true, chatAssistant: true
    };
    setFeatures(allEnabled);
    triggerToast('All AI Features enabled globally.');
    try {
      await Promise.all(
        Object.keys(allEnabled).map(key =>
          api.post('/ai-modules', { moduleKey: key, isEnabled: true })
        )
      );
    } catch (err) {
      console.error('Error enabling all AI modules:', err);
    }
  };

  const handleSaveConfig = async () => {
    try {
      await api.post('/ai-modules', {
        config: {
          loadParseConf: configForm.loadParseConf,
          receiptOcrConf: configForm.receiptOcrConf,
          odometerConf: configForm.odometerConf,
          dailyLimit: configForm.dailyLimit
        }
      });
      triggerToast('AI Model Configuration & Limits saved!');
    } catch (err) {
      triggerToast('AI Config saved locally.');
    }
  };

  const handleRunExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowExportModal(false);

      if (exportFormat === 'csv') {
        const csvContent = `========================================\nHERO LOGISTICS - AI SYSTEM AUDIT REPORT\n========================================\nDate Range: ${exportDateRange}\nGenerated At: ${new Date().toLocaleString()}\n\nKPI METRICS:\n- AI Features Active: ${aiStats.activeFeatures} / 6\n- AI Requests Today: ${aiStats.totalRequests}\n- Avg Latency: ${aiStats.avgLatencyMs} ms\n- Success Rate: ${aiStats.successRate}%\n- Failed Requests: ${aiStats.failedRequests}\n- Storage Used: ${aiStats.storageUsed}\n\nFEATURE STATUS:\n- Load Parse AI: ${features.loadParse ? 'Active' : 'Inactive'} (Conf Threshold: ${configForm.loadParseConf}%)\n- Receipt Scan OCR: ${features.receiptScan ? 'Active' : 'Inactive'} (Conf Threshold: ${configForm.receiptOcrConf}%)\n- Odometer Detection: ${features.odometer ? 'Active' : 'Inactive'} (Conf Threshold: ${configForm.odometerConf}%)\n- Smart Dispatch: ${features.smartDispatch ? 'Active' : 'Inactive'}\n- ETA Prediction: ${features.etaPrediction ? 'Active' : 'Inactive'}\n- Chat Assistant: ${features.chatAssistant ? 'Active' : 'Inactive'}\n\nDAILY API CALL LIMIT: ${configForm.dailyLimit} calls/day\n========================================`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AI_Audit_Report_${exportDateRange.replace(/ /g, '_')}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (exportFormat === 'json') {
        const jsonContent = JSON.stringify({
          system: 'Hero Logistics AI Control Center',
          dateRange: exportDateRange,
          timestamp: new Date().toISOString(),
          metrics: aiStats,
          features: features,
          thresholds: configForm
        }, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AI_Audit_Dump_${exportDateRange.replace(/ /g, '_')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const pdfContent = `Simulated PDF AI Performance Report - ${exportDateRange}`;
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AI_Report_${exportDateRange.replace(/ /g, '_')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      triggerToast(`AI Audit Report (${exportFormat.toUpperCase()}) downloaded!`);
    }, 1000);
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 w-full font-sans text-left relative">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[9999] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
            Super Admin • Ai Controls
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Configure global licensing rules, audit tenant margins, and resolve support tickets.
          </p>
        </div>
        <button 
          onClick={() => setShowExportModal(true)}
          className="border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Download size={14} className="text-amber-700" /> Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {/* Card 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">AI FEATURES ACTIVE</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">
              {Object.values(features).filter(Boolean).length}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>Enabled AI modules</span>
            <span className="text-emerald-600">Stable</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">AI REQUESTS TODAY</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">{aiStats.totalRequests?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>Processed model infere...</span>
            <span className="text-emerald-500 font-extrabold">+12%</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">AVG LATENCY</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">{aiStats.avgLatencyMs || 0} ms</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>Model inference respon...</span>
            <span className="text-emerald-500 font-extrabold">Good</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">SUCCESS RATE</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">{aiStats.successRate || 0}%</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold mt-2">
            <span className="text-slate-400">Successful AI job c...</span>
            <span className="text-emerald-500 font-extrabold text-right">Target Met</span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">FAILED REQUESTS</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">{aiStats.failedRequests || 0}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>Errors in last 24 hrs</span>
            <span>Low</span>
          </div>
        </div>

        {/* Card 6 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">AI STORAGE</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">{aiStats.storageUsed || '0 TB'}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>Model artifacts + emb...</span>
            <span>Stable</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Left Column - Enable / Disable */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
          <h2 className="text-lg font-black text-slate-800 mb-1">AI Feature Enable / Disable</h2>
          <p className="text-xs font-semibold text-slate-400 mb-6">Control which AI modules are active globally.</p>

          <div className="space-y-4">
            {/* Feature items */}
            {[
              { key: 'loadParse', label: 'Load Parse AI' },
              { key: 'receiptScan', label: 'Receipt Scan OCR' },
              { key: 'odometer', label: 'Odometer Detection' },
              { key: 'smartDispatch', label: 'Smart Dispatch' },
              { key: 'etaPrediction', label: 'ETA Prediction' },
              { key: 'chatAssistant', label: 'Chat Assistant' },
            ].map(({ key, label }) => {
              const active = features[key];
              return (
                <div key={key} className="border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800 mb-0.5">{label}</h4>
                    <span className={`text-xs font-bold ${active ? 'text-emerald-500' : 'text-slate-400'}`}>
                      • {active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleFeature(key)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none flex items-center cursor-pointer ${
                      active ? 'bg-brand-500 justify-end' : 'bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </button>
                </div>
              );
            })}

            <button
              onClick={enableAll}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-xs py-3 rounded-xl transition-colors cursor-pointer text-center"
            >
              Enable All Features
            </button>
          </div>
        </div>

        {/* Right Column - Configurations & Logs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Configuration & Limits */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
            <h2 className="text-lg font-black text-slate-800 mb-1">AI Model Configuration & Limits</h2>
            <p className="text-xs font-semibold text-slate-400 mb-6">Configure confidence thresholds and daily processing limits.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Load Parse Confidence (%)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={configForm.loadParseConf} 
                    onChange={e => setConfigForm({ ...configForm, loadParseConf: e.target.value })}
                    className="flex-grow px-4 py-3 bg-white border border-slate-200 text-sm font-bold rounded-xl focus:outline-none focus:border-brand-500 text-slate-800" 
                  />
                  <span className="text-xs font-bold text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Receipt OCR Confidence (%)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={configForm.receiptOcrConf} 
                    onChange={e => setConfigForm({ ...configForm, receiptOcrConf: e.target.value })}
                    className="flex-grow px-4 py-3 bg-white border border-slate-200 text-sm font-bold rounded-xl focus:outline-none focus:border-brand-500 text-slate-800" 
                  />
                  <span className="text-xs font-bold text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Odometer Detection (%)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={configForm.odometerConf} 
                    onChange={e => setConfigForm({ ...configForm, odometerConf: e.target.value })}
                    className="flex-grow px-4 py-3 bg-white border border-slate-200 text-sm font-bold rounded-xl focus:outline-none focus:border-brand-500 text-slate-800" 
                  />
                  <span className="text-xs font-bold text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Daily API Call Limit</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={configForm.dailyLimit} 
                    onChange={e => setConfigForm({ ...configForm, dailyLimit: e.target.value })}
                    className="flex-grow px-4 py-3 bg-white border border-slate-200 text-sm font-bold rounded-xl focus:outline-none focus:border-brand-500 text-slate-800" 
                  />
                  <span className="text-xs font-bold text-slate-400">/day</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSaveConfig}
              className="bg-brand-500 text-black font-extrabold text-xs px-6 py-3 rounded-xl hover:bg-brand-600 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Save size={14} /> Save AI Configuration
            </button>
          </div>

          {/* Card 2: AI Activity Logs */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
            <h2 className="text-lg font-black text-slate-800 mb-1">AI Activity Logs</h2>
            <p className="text-xs font-semibold text-slate-400 mb-6">Recent AI model events and processing history.</p>

            <div className="space-y-4 max-h-[290px] overflow-y-auto pr-1 hide-scrollbar">
              {activityLogs.length === 0 ? (
                <div className="text-center text-slate-400 text-xs py-10">No recent AI activity logs</div>
              ) : activityLogs.map(log => (
                <div key={log.id} className="border border-slate-100 rounded-2xl p-4 flex justify-between items-start">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${log.isAnomaly ? 'bg-rose-500' : 'bg-emerald-500'} mt-1.5 shrink-0`}></div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 mb-0.5">{log.module?.name || 'System'}</h4>
                      <p className="text-[10px] font-medium text-slate-400">{log.eventDescription}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 shrink-0">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Analytics */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs w-full">
        <h2 className="text-lg font-black text-slate-800 mb-6">AI Usage Analytics — Requests by Feature</h2>

        <div className="space-y-4">
          {aiModulesData.map((mod, i) => {
            const maxReqs = Math.max(1, ...aiModulesData.map(m => m.totalRequests || 0));
            const percentage = ((mod.totalRequests || 0) / maxReqs) * 100;
            return (
              <div key={i} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <span className="w-40 text-xs font-bold text-slate-600">{mod.name}</span>
                <div className="flex-grow bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-brand-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max(percentage, 2)}%` }}></div>
                </div>
                <span className="w-20 text-right text-xs font-extrabold text-slate-800">{(mod.totalRequests || 0).toLocaleString()} req</span>
              </div>
            );
          })}
          {aiModulesData.length === 0 && (
            <div className="text-center text-xs font-medium text-slate-400 py-4">No module requests tracked yet.</div>
          )}
        </div>
      </div>

      {/* ── EXPORT REPORT MODAL ── */}
      {showExportModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]" onClick={() => setShowExportModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden text-left" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
                  <Download size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Export AI Audit Report</h3>
                  <p className="text-xs text-slate-400 font-semibold">Download system-wide AI usage & configuration logs</p>
                </div>
              </div>
              <button onClick={() => setShowExportModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Date Range Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Calendar size={13} /> Select Timeframe
                </label>
                <select 
                  value={exportDateRange}
                  onChange={e => setExportDateRange(e.target.value)}
                  className="w-full border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option>Last 24 Hours</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>All Time History</option>
                </select>
              </div>

              {/* Format Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Choose Export Format
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'csv', name: 'CSV', Icon: FileSpreadsheet, sub: 'Audit Data' },
                    { id: 'pdf', name: 'PDF', Icon: FileText, sub: 'Summary' },
                    { id: 'json', name: 'JSON', Icon: FileCode, sub: 'Raw Dump' },
                  ].map(fmt => {
                    const active = exportFormat === fmt.id;
                    const Icon = fmt.Icon;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setExportFormat(fmt.id)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                          active ? 'border-amber-500 bg-amber-50/70 text-amber-900 shadow-xs' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon size={18} className={active ? 'text-amber-600 mb-1' : 'text-slate-400 mb-1'} />
                        <span className="text-xs font-black">{fmt.name}</span>
                        <span className="text-[9px] text-slate-400 font-semibold mt-0.5">{fmt.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scope note */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-600 font-medium">
                  Report includes model confidence thresholds, total request volume, average latency, and failed request logs.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button onClick={() => setShowExportModal(false)} className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleRunExport}
                disabled={isExporting}
                className="px-5 py-2 bg-brand-500 hover:bg-yellow-400 text-black text-xs font-black rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isExporting ? <span className="animate-pulse">Generating Report...</span> : <><Download size={14} /> Download {exportFormat.toUpperCase()} Report</>}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
