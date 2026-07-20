import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { CheckCircle } from 'lucide-react';

export default function Billing() {
  const [activeTab, setActiveTab] = useState('INVOICES');
  const [toast, setToast] = useState('');

  // Show Toast Helper
  const showNotification = (msg) => {
    setToast(msg);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // KPI Metrics data
  const metrics = [
    { name: 'TOTAL REVENUE', value: '$2,57,460', desc: 'Cumulative 6-month rev...', change: '+12%', isPositive: true },
    { name: 'MONTHLY MRR', value: '$42,910', desc: 'Current monthly baseline', change: '+8%', isPositive: true },
    { name: 'PAID INVOICES', value: '4', desc: 'Successfully collected', change: 'Stable', isPositive: false },
    { name: 'UNPAID INVOICES', value: '1', desc: 'Awaiting payment', change: 'Alert', isPositive: true, isAlert: true },
    { name: 'FAILED PAYMENTS', value: '1', desc: 'Gateway errors', change: '0 issues', isPositive: false },
    { name: 'REFUNDS ISSUED', value: '0', desc: 'Dispute resolutions', change: 'Clean', isPositive: false }
  ];

  // Monthly Revenue Trend chart data
  const revenueTrendData = [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 28000 },
    { name: 'Mar', value: 28000 },
    { name: 'Apr', value: 30000 },
    { name: 'May', value: 30000 },
    { name: 'Jun', value: 42000 }
  ];

  // Invoices list database
  const initialInvoices = [
    { id: '#INV-1001A', company: 'Falcon Logistics LLC', plan: 'Professional', amount: 8500.00, status: 'Paid', date: '06/12/2026' },
    { id: '#INV-1002A', company: 'Falcon Logistics LLC', plan: 'Professional', amount: 4200.00, status: 'Sent', date: '06/15/2026' },
    { id: '#INV-1003A', company: 'Falcon Logistics LLC', plan: 'Professional', amount: 3100.00, status: 'Draft', date: '06/20/2026' },
    { id: '#INV-1004A', company: 'Falcon Logistics LLC', plan: 'Professional', amount: 5000.00, status: 'Overdue', date: '05/10/2026' },
    { id: '#INV-1002A', company: 'Swift Cargo Express', plan: 'Starter', amount: 1500.00, status: 'Paid', date: '06/19/2026' },
    { id: '#INV-1002B', company: 'Swift Cargo Express', plan: 'Starter', amount: 1500.00, status: 'Paid', date: '05/19/2026' },
    { id: '#INV-1002C', company: 'Swift Cargo Express', plan: 'Starter', amount: 1500.00, status: 'Paid', date: '04/19/2026' },
    { id: '#INV-1003A', company: 'Global Shipping Solutions', plan: 'Enterprise', amount: 28000.00, status: 'Paid', date: '06/01/2026' },
    { id: '#INV-1003B', company: 'Global Shipping Solutions', plan: 'Enterprise', amount: 28000.00, status: 'Paid', date: '05/01/2026' },
    { id: '#INV-1003C', company: 'Global Shipping Solutions', plan: 'Enterprise', amount: 28000.00, status: 'Paid', date: '04/01/2026' },
    { id: '#INV-1003D', company: 'Global Shipping Solutions', plan: 'Enterprise', amount: 28000.00, status: 'Paid', date: '03/01/2026' },
    { id: '#INV-1003E', company: 'Global Shipping Solutions', plan: 'Enterprise', amount: 28000.00, status: 'Paid', date: '02/01/2026' },
    { id: '#INV-1004A', company: 'Texas Hotshot Carriers', plan: 'Starter', amount: 1500.00, status: 'Unpaid', date: '05/20/2026' },
    { id: '#INV-1005A', company: 'Apex Logistics LLC', plan: 'Professional', amount: 4910.00, status: 'Paid', date: '06/19/2026' }
  ];

  const [invoices, setInvoices] = useState(initialInvoices);

  // Tab Filtering logic
  const getFilteredData = () => {
    switch (activeTab) {
      case 'PAYMENTS':
        return invoices.filter(inv => inv.status === 'Paid');
      case 'FAILED PAYMENTS':
        return invoices.filter(inv => inv.status === 'Failed' || inv.status === 'Overdue' || inv.status === 'Unpaid');
      case 'TAX / GST SUMMARY':
        return invoices;
      case 'INVOICES':
      default:
        return invoices;
    }
  };

  // Real PDF Generator function
  const handleDownloadPDF = (invoice) => {
    const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 595.27 841.89] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 500 >>
stream
BT
/F1 20 Tf
70 750 Td
(HERO LOGISTICS - INVOICE ${invoice.id}) Tj
/F2 12 Tf
0 -40 Td
(Company: ${invoice.company}) Tj
0 -20 Td
(Plan Tier: ${invoice.plan}) Tj
0 -20 Td
(Amount: $${invoice.amount.toFixed(2)}) Tj
0 -20 Td
(Due Date: ${invoice.date}) Tj
0 -20 Td
(Status: ${invoice.status}) Tj
0 -40 Td
(Thank you for your business!) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000056 00000 n
0000000111 00000 n
0000000282 00000 n
trailer
<< /Size 5 /Root 1 0 R >>
startxref
420
%%EOF`;

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${invoice.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification(`Invoice ${invoice.id} downloaded successfully as PDF!`);
  };

  // Real CSV Export function
  const handleExportCSV = () => {
    const headers = ['Invoice ID', 'Company', 'Plan', 'Amount', 'Status', 'Date'];
    const rows = invoices.map(inv => [inv.id, inv.company, inv.plan, inv.amount, inv.status, inv.date]);
    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'billing_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Billing records exported successfully as CSV!');
  };

  // Real PDF Report Generator
  const handleExportPDFReport = () => {
    const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 595.27 841.89] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 600 >>
stream
BT
/F1 20 Tf
70 750 Td
(HERO LOGISTICS - BILLING REPORT) Tj
/F2 12 Tf
0 -40 Td
(Total Revenue: $2,57,460) Tj
0 -20 Td
(Monthly MRR: $42,910) Tj
0 -20 Td
(Paid Invoices: 4) Tj
0 -20 Td
(Unpaid Invoices: 1) Tj
0 -20 Td
(Report Type: Overall platform summary) Tj
0 -20 Td
(Generated on: ${new Date().toLocaleDateString()}) Tj
0 -40 Td
(Hero Logistics Platforms Admin Registry) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000056 00000 n
0000000111 00000 n
0000000282 00000 n
trailer
<< /Size 5 /Root 1 0 R >>
startxref
420
%%EOF`;

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Billing-Report.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('Billing Report downloaded successfully as PDF!');
  };

  // Real Tax Report Generator
  const handleExportTaxReport = () => {
    const headers = ['Invoice ID', 'Company', 'Base Amount', 'GST (18%)', 'Total Amount', 'Date'];
    const rows = invoices.map(inv => {
      const base = inv.amount * 0.82;
      const gst = inv.amount * 0.18;
      return [inv.id, inv.company, base.toFixed(2), gst.toFixed(2), inv.amount.toFixed(2), inv.date];
    });
    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'tax_gst_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Tax / GST Report exported successfully as CSV!');
  };

  const handleRegenerate = (id) => {
    // Regenerating randomly updates dates and raises a notification
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        return {
          ...inv,
          date: new Date().toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
          })
        };
      }
      return inv;
    }));
    showNotification(`Invoice ${id} regenerated successfully with new metadata!`);
  };

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
            Super Admin • Billing
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Configure global licensing rules, audit tenant margins, and resolve support tickets.
          </p>
        </div>
        <button
          onClick={handleExportPDFReport}
          className="w-full sm:w-auto border border-slate-200 bg-white hover:bg-slate-50 text-yellow-500 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Export Report
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
            <div>
              <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">{m.name}</span>
              <span className="text-2xl font-black text-slate-900 block mt-2">{m.value}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold mt-2">
              <span className="text-slate-400">{m.desc}</span>
              <span className={m.isAlert ? 'text-rose-500 font-extrabold' : m.isPositive ? 'text-emerald-500 font-extrabold' : 'text-slate-400'}>
                {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Trend Line Chart (Full Width) */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs w-full">
        <h2 className="text-sm font-black text-slate-800 mb-6">Monthly Revenue Trend (USD)</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} domain={[0, 60000]} ticks={[0, 15000, 30000, 45000, 60000]} />
              <Tooltip cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#00A3FF"
                strokeWidth={3}
                dot={{ fill: '#00A3FF', stroke: '#ffffff', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-wrap gap-2">
        {['INVOICES', 'PAYMENTS', 'FAILED PAYMENTS', 'TAX / GST SUMMARY'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-black rounded-lg text-xs transition-colors cursor-pointer border ${activeTab === tab
                ? 'bg-[#FFD400] text-black border-[#FFD400]'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Data Table */}
      <div className="bg-white border border-slate-100 rounded-2xl lg:p-6 p-4 shadow-xs w-full">
        <div className="overflow-x-auto lg:overflow-visible custom-scrollbar">
          <table className="w-full text-left border-collapse block lg:table">
            <thead className="hidden lg:table-header-group">
              <tr className="border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="pb-4 font-black">INVOICE ID</th>
                <th className="pb-4 font-black">COMPANY</th>
                <th className="pb-4 font-black">PLAN TIER</th>
                <th className="pb-4 font-black">AMOUNT</th>
                <th className="pb-4 font-black">STATUS</th>
                <th className="pb-4 font-black">DUE DATE</th>
                <th className="pb-4 text-right pr-0 font-black">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700 block lg:table-row-group">
              {getFilteredData().map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/10 block lg:table-row border border-slate-100 lg:border-none rounded-xl lg:rounded-none mb-4 lg:mb-0 bg-white lg:bg-transparent shadow-sm lg:shadow-none p-4 lg:p-0">
                  <td className="flex lg:table-cell justify-between items-center py-2 lg:py-4 border-b border-slate-50 lg:border-none before:content-['INVOICE_ID'] before:font-bold before:text-[10px] before:text-slate-400 lg:before:hidden before:uppercase">
                    <span className="text-slate-500">{row.id}</span>
                  </td>
                  <td className="flex lg:table-cell justify-between items-center py-2 lg:py-4 border-b border-slate-50 lg:border-none before:content-['COMPANY'] before:font-bold before:text-[10px] before:text-slate-400 lg:before:hidden before:uppercase text-right lg:text-left">
                    <span className="font-extrabold text-slate-800">{row.company}</span>
                  </td>
                  <td className="flex lg:table-cell justify-between items-center py-2 lg:py-4 border-b border-slate-50 lg:border-none before:content-['PLAN_TIER'] before:font-bold before:text-[10px] before:text-slate-400 lg:before:hidden before:uppercase text-right lg:text-left">
                    <span className="text-slate-500">{row.plan}</span>
                  </td>
                  {activeTab === 'TAX / GST SUMMARY' ? (
                    <>
                      <td className="flex lg:table-cell justify-between items-center py-2 lg:py-4 border-b border-slate-50 lg:border-none before:content-['BASE_AMOUNT'] before:font-bold before:text-[10px] before:text-slate-400 lg:before:hidden before:uppercase text-right lg:text-left">
                        <span className="text-slate-800 font-extrabold">${(row.amount * 0.82).toFixed(2)} Base</span>
                      </td>
                      <td className="flex lg:table-cell justify-between items-center py-2 lg:py-4 border-b border-slate-50 lg:border-none before:content-['GST'] before:font-bold before:text-[10px] before:text-slate-400 lg:before:hidden before:uppercase text-right lg:text-left">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px]">
                          18% GST ($ {(row.amount * 0.18).toFixed(2)})
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="flex lg:table-cell justify-between items-center py-2 lg:py-4 border-b border-slate-50 lg:border-none before:content-['AMOUNT'] before:font-bold before:text-[10px] before:text-slate-400 lg:before:hidden before:uppercase text-right lg:text-left">
                        <span className="text-emerald-500 font-extrabold">${row.amount.toFixed(2)}</span>
                      </td>
                      <td className="flex lg:table-cell justify-between items-center py-2 lg:py-4 border-b border-slate-50 lg:border-none before:content-['STATUS'] before:font-bold before:text-[10px] before:text-slate-400 lg:before:hidden before:uppercase text-right lg:text-left">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${row.status === 'Paid' ? 'bg-[#E6F4EA] text-[#137333]' :
                            row.status === 'Sent' ? 'bg-[#FEF7E0] text-[#B06000]' :
                              row.status === 'Draft' ? 'bg-slate-100 text-slate-600' :
                                'bg-[#FCE8E6] text-[#C5221F]'
                          }`}>
                          {row.status}
                        </span>
                      </td>
                    </>
                  )}
                  <td className="flex lg:table-cell justify-between items-center py-2 lg:py-4 border-b border-slate-50 lg:border-none before:content-['DUE_DATE'] before:font-bold before:text-[10px] before:text-slate-400 lg:before:hidden before:uppercase text-right lg:text-left">
                    <span className="text-slate-400 font-semibold">{row.date}</span>
                  </td>
                  <td className="flex lg:table-cell justify-between items-center py-2 lg:py-4 lg:border-none before:content-['ACTIONS'] before:font-bold before:text-[10px] before:text-slate-400 lg:before:hidden before:uppercase pt-4 lg:pt-0 pb-2 lg:pb-0 text-right lg:text-left">
                    <div className="flex justify-end gap-2 items-center">
                      <button
                        onClick={() => handleDownloadPDF(row)}
                        className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-[10px] px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleRegenerate(row.id)}
                        className="border border-[#FFD400] bg-white hover:bg-slate-50 text-[#CC7B00] font-extrabold text-[10px] px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        Regenerate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Export Row */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs w-full flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-xs font-bold text-slate-500">Export billing records:</span>
        <div className="flex flex-wrap justify-center md:justify-end gap-3 w-full md:w-auto">
          <button
            onClick={handleExportPDFReport}
            className="w-full sm:w-auto border border-slate-200 bg-white hover:bg-slate-50 text-yellow-500 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            PDF Report
          </button>
          <button
            onClick={handleExportCSV}
            className="w-full sm:w-auto border border-slate-200 bg-white hover:bg-slate-50 text-yellow-500 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            CSV Export
          </button>
          <button
            onClick={handleExportTaxReport}
            className="w-full sm:w-auto border border-slate-200 bg-white hover:bg-slate-50 text-yellow-500 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Tax Report
          </button>
        </div>
      </div>
    </div>
  );
}
