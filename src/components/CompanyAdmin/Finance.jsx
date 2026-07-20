import React, { useState } from 'react';
import { 
  TrendingUp, 
  AlertCircle, 
  TrendingDown, 
  DollarSign, 
  BarChart2, 
  FileText, 
  Clock, 
  Plus, 
  ChevronDown,
  Droplet,
  Users,
  Wrench,
  CreditCard,
  X
} from 'lucide-react';

export default function Finance() {
  const [activeTab, setActiveTab] = useState('pnl');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('This Quarter');
  const [isPeriodMenuOpen, setIsPeriodMenuOpen] = useState(false);

  const handleDownloadInvoice = (invoiceId, client, amount) => {
    const element = document.createElement("a");
    const content = `----------------------------------------\nHERO LOGISTICS - INVOICE RECEIPT\n----------------------------------------\nInvoice ID: ${invoiceId}\nClient: ${client}\nAmount: ${amount}\nDate: ${new Date().toLocaleDateString()}\nStatus: PAID\n\nThank you for your business!\n----------------------------------------`;
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${invoiceId}-receipt.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleNewInvoice = () => {
    setShowInvoiceModal(true);
  };

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    setShowInvoiceModal(false);
    setActiveTab('invoices');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto bg-[#FAFAFA] min-h-screen text-left flex flex-col space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-1">Finance & P&L</h1>
          <p className="text-gray-500 text-[13px]">Revenue, expenses & profitability dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setIsPeriodMenuOpen(!isPeriodMenuOpen)} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
              {selectedPeriod} <ChevronDown size={14} />
            </button>
            
            {isPeriodMenuOpen && (
               <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                  {['This Month', 'This Quarter', 'This Year', 'All Time'].map((period) => (
                     <div
                       key={period}
                       onClick={() => { setSelectedPeriod(period); setIsPeriodMenuOpen(false); }}
                       className={`px-4 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-gray-50 transition-colors ${selectedPeriod === period ? 'text-black bg-gray-50' : 'text-gray-600'}`}
                     >
                        {period}
                     </div>
                  ))}
               </div>
            )}
          </div>
          <button onClick={handleNewInvoice} className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-[13px] font-bold transition-colors shadow-sm cursor-pointer">
            <Plus size={14} strokeWidth={3} /> New Invoice
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-[#E6F9F1] rounded-lg text-[#00D47E]">
              <TrendingUp size={18} strokeWidth={2.5} />
            </div>
            <span className="text-[#00D47E] bg-[#E6F9F1] px-2 py-0.5 rounded text-[10px] font-bold">+14.2%</span>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 mt-4">Total Revenue</h3>
            <div className="text-2xl font-bold text-gray-900 tracking-tight leading-none">$60,200</div>
            <p className="text-[11px] text-gray-400 font-medium mt-1">Collected (Paid)</p>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-[#FFF4E5] rounded-lg text-[#FF9800]">
              <AlertCircle size={18} strokeWidth={2.5} />
            </div>
            <span className="text-[#FF9800] bg-[#FFF4E5] px-2 py-0.5 rounded text-[10px] font-bold">+2.1%</span>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 mt-4">Pending / Owed</h3>
            <div className="text-2xl font-bold text-gray-900 tracking-tight leading-none">$192,000</div>
            <p className="text-[11px] text-gray-400 font-medium mt-1">Unpaid + Overdue</p>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-[#FFEFEF] rounded-lg text-[#F44336]">
              <TrendingDown size={18} strokeWidth={2.5} />
            </div>
            <span className="text-[#F44336] bg-[#FFEFEF] px-2 py-0.5 rounded text-[10px] font-bold">+4.1%</span>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 mt-4">Total Expenses</h3>
            <div className="text-2xl font-bold text-gray-900 tracking-tight leading-none">$858,200</div>
            <p className="text-[11px] text-gray-400 font-medium mt-1">Operational Costs</p>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-[#F0F4FF] rounded-lg text-[#3B82F6]">
              <DollarSign size={18} strokeWidth={2.5} />
            </div>
            <span className="text-[#00D47E] bg-[#E6F9F1] px-2 py-0.5 rounded text-[10px] font-bold">+9.8%</span>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 mt-4">Net Profit</h3>
            <div className="text-2xl font-bold text-gray-900 tracking-tight leading-none">$0</div>
            <p className="text-[11px] text-gray-400 font-medium mt-1">-1325.6% Margin</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-200 mt-2">
        <button 
          onClick={() => setActiveTab('pnl')}
          className={`flex items-center gap-2 pb-3 border-b-2 text-[13px] font-bold transition-colors ${activeTab === 'pnl' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
        >
          <BarChart2 size={16} strokeWidth={2.5} /> P&L Breakdown
        </button>
        <button 
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-2 pb-3 border-b-2 text-[13px] font-bold transition-colors ${activeTab === 'invoices' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
        >
          <FileText size={16} strokeWidth={2.5} /> Invoices
        </button>
        <button 
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 pb-3 border-b-2 text-[13px] font-bold transition-colors ${activeTab === 'audit' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
        >
          <Clock size={16} strokeWidth={2.5} /> Audit Trail
        </button>
      </div>

      {activeTab === 'pnl' && (
        <>
          {/* Breakdown Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-2">
        
        {/* Revenue Breakdown */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
          <div className="p-6 pb-4">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-[#00D47E]"></div>
              <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">Revenue Breakdown</h2>
            </div>

            <div className="flex flex-col gap-6 flex-grow">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[13px] font-bold text-gray-900">Tech Solutions</div>
                  <div className="text-[11px] text-gray-400 font-medium mt-0.5">INV-1022 • 2 loads</div>
                </div>
                <div className="text-[13px] font-bold text-[#00D47E]">$12,200</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[13px] font-bold text-gray-900">Smith Motors</div>
                  <div className="text-[11px] text-gray-400 font-medium mt-0.5">INV-1020 • 3 loads</div>
                </div>
                <div className="text-[13px] font-bold text-[#00D47E]">$28,800</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[13px] font-bold text-gray-900">EV Fleet Co</div>
                  <div className="text-[11px] text-gray-400 font-medium mt-0.5">INV-1019 • 2 loads</div>
                </div>
                <div className="text-[13px] font-bold text-[#00D47E]">$19,200</div>
              </div>
            </div>
          </div>
          
          <div className="mt-auto p-4 pt-6">
             <div className="bg-[#00D47E] rounded-xl p-4 flex justify-between items-center text-white shadow-[0_4px_12px_rgba(0,212,126,0.2)]">
                <span className="text-[13px] font-bold">Total Revenue</span>
                <span className="text-[16px] font-bold tracking-tight">$60,200</span>
             </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
          <div className="p-6 pb-4">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-[#F44336]"></div>
              <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">Expense Breakdown</h2>
            </div>

            <div className="flex flex-col gap-6 flex-grow">
              <div className="flex justify-between items-center">
                <div className="flex items-start gap-3">
                  <div className="text-gray-300 mt-0.5"><Droplet size={16} strokeWidth={2} /></div>
                  <div>
                    <div className="text-[13px] font-bold text-gray-900">Fuel & AdBlue</div>
                    <div className="text-[11px] text-gray-400 font-medium mt-0.5">21% of total spend</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-[#F44336]">+4.1%</span>
                   <span className="text-[13px] font-bold text-gray-900 w-16 text-right">$184,200</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-start gap-3">
                  <div className="text-gray-300 mt-0.5"><Users size={16} strokeWidth={2} /></div>
                  <div>
                    <div className="text-[13px] font-bold text-gray-900">Driver Wages</div>
                    <div className="text-[11px] text-gray-400 font-medium mt-0.5">61% of total spend</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-[#F44336]">+2.3%</span>
                   <span className="text-[13px] font-bold text-gray-900 w-16 text-right">$521,000</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-start gap-3">
                  <div className="text-gray-300 mt-0.5"><Wrench size={16} strokeWidth={2} /></div>
                  <div>
                    <div className="text-[13px] font-bold text-gray-900">Maintenance</div>
                    <div className="text-[11px] text-gray-400 font-medium mt-0.5">10% of total spend</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-[#00D47E]">-1.2%</span>
                   <span className="text-[13px] font-bold text-gray-900 w-16 text-right">$89,400</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-start gap-3">
                  <div className="text-gray-300 mt-0.5"><FileText size={16} strokeWidth={2} /></div>
                  <div>
                    <div className="text-[13px] font-bold text-gray-900">Depot / Storage</div>
                    <div className="text-[11px] text-gray-400 font-medium mt-0.5">5% of total spend</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-[#F44336]">+0.8%</span>
                   <span className="text-[13px] font-bold text-gray-900 w-16 text-right">$42,000</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-start gap-3">
                  <div className="text-gray-300 mt-0.5"><CreditCard size={16} strokeWidth={2} /></div>
                  <div>
                    <div className="text-[13px] font-bold text-gray-900">Tolls & Levies</div>
                    <div className="text-[11px] text-gray-400 font-medium mt-0.5">3% of total spend</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-[#F44336]">+1.1%</span>
                   <span className="text-[13px] font-bold text-gray-900 w-16 text-right">$21,600</span>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-auto p-4 pt-6">
             <div className="bg-[#0B0F19] rounded-xl p-4 flex justify-between items-center text-white shadow-lg">
                <span className="text-[13px] font-bold">Total Expenses</span>
                <span className="text-[16px] font-bold tracking-tight">$858,200</span>
             </div>
          </div>
        </div>

      </div>
        
          {/* Bottom Summary Bar */}
          <div className="bg-[#0B0F19] rounded-[20px] p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2 shadow-lg">
             <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Net Profit (This Quarter)</h3>
                <div className="text-[28px] font-bold text-[#FFD400] tracking-tight leading-none mb-1">$0</div>
                <p className="text-[10px] text-gray-400 font-medium">-1325.6% profit margin - Revenue – Expenses</p>
             </div>
             <div className="flex gap-10 sm:gap-16">
                <div className="text-right">
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Revenue</div>
                   <div className="text-[16px] font-bold text-[#00D47E] tracking-tight">$60,200</div>
                </div>
                <div className="text-right">
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Expenses</div>
                   <div className="text-[16px] font-bold text-[#F44336] tracking-tight">$858,200</div>
                </div>
             </div>
          </div>
        </>
      )}

      {activeTab === 'invoices' && (
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 flex flex-col p-6 mt-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[13px] font-bold text-gray-900">All Invoices</h2>
            <span className="text-[11px] font-semibold text-gray-500">5 entries</span>
          </div>

          <div className="overflow-x-auto custom-scrollbar w-full">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[650px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left w-[15%]">INVOICE ID</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left w-[25%]">CLIENT</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center w-[15%]">DATE</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center w-[15%]">AMOUNT</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center w-[15%]">STATUS</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right w-[15%]">ACTION</th>
                </tr>
              </thead>
              <tbody className="text-[12px]">
                <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-bold text-gray-900 text-left">INV-1022</td>
                  <td className="py-4 font-medium text-gray-700 text-left">Tech Solutions</td>
                  <td className="py-4 font-medium text-gray-500 text-center">08/28/2026</td>
                  <td className="py-4 font-bold text-gray-900 text-center">$12,200</td>
                  <td className="py-4 text-center">
                    <span className="bg-[#E6F9F1] text-[#00D47E] px-2.5 py-1 rounded-md text-[10px] font-bold">Paid</span>
                  </td>
                  <td className="py-4 text-right">
                    <button onClick={() => handleDownloadInvoice('INV-1022', 'Tech Solutions', '$12,200')} className="text-[#3B82F6] font-bold hover:underline text-[11px] cursor-pointer">Download</button>
                  </td>
                </tr>
                <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-bold text-gray-900 text-left">INV-1020</td>
                  <td className="py-4 font-medium text-gray-700 text-left">Smith Motors</td>
                  <td className="py-4 font-medium text-gray-500 text-center">08/27/2026</td>
                  <td className="py-4 font-bold text-gray-900 text-center">$28,800</td>
                  <td className="py-4 text-center">
                    <span className="bg-[#E6F9F1] text-[#00D47E] px-2.5 py-1 rounded-md text-[10px] font-bold">Paid</span>
                  </td>
                  <td className="py-4 text-right">
                    <button onClick={() => handleDownloadInvoice('INV-1020', 'Smith Motors', '$28,800')} className="text-[#3B82F6] font-bold hover:underline text-[11px] cursor-pointer">Download</button>
                  </td>
                </tr>
                <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-bold text-gray-900 text-left">INV-1019</td>
                  <td className="py-4 font-medium text-gray-700 text-left">EV Fleet Co</td>
                  <td className="py-4 font-medium text-gray-500 text-center">08/26/2026</td>
                  <td className="py-4 font-bold text-gray-900 text-center">$19,200</td>
                  <td className="py-4 text-center">
                    <span className="bg-[#E6F9F1] text-[#00D47E] px-2.5 py-1 rounded-md text-[10px] font-bold">Paid</span>
                  </td>
                  <td className="py-4 text-right">
                    <button onClick={() => handleDownloadInvoice('INV-1019', 'EV Fleet Co', '$19,200')} className="text-[#3B82F6] font-bold hover:underline text-[11px] cursor-pointer">Download</button>
                  </td>
                </tr>
                <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-bold text-gray-900 text-left">INV-1025</td>
                  <td className="py-4 font-medium text-gray-700 text-left">Alpha Holdings</td>
                  <td className="py-4 font-medium text-gray-500 text-center">08/24/2026</td>
                  <td className="py-4 font-bold text-gray-900 text-center">$45,000</td>
                  <td className="py-4 text-center">
                    <span className="bg-[#FFF4E5] text-[#FF9800] px-2.5 py-1 rounded-md text-[10px] font-bold">Pending</span>
                  </td>
                  <td className="py-4 text-right">
                    <button onClick={() => handleDownloadInvoice('INV-1025', 'Alpha Holdings', '$45,000')} className="text-[#3B82F6] font-bold hover:underline text-[11px] cursor-pointer">Download</button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-bold text-gray-900 text-left">INV-1026</td>
                  <td className="py-4 font-medium text-gray-700 text-left">Logistics Group</td>
                  <td className="py-4 font-medium text-gray-500 text-center">08/23/2026</td>
                  <td className="py-4 font-bold text-gray-900 text-center">$147,000</td>
                  <td className="py-4 text-center">
                    <span className="bg-[#FFEFEF] text-[#F44336] px-2.5 py-1 rounded-md text-[10px] font-bold">Overdue</span>
                  </td>
                  <td className="py-4 text-right">
                    <button onClick={() => handleDownloadInvoice('INV-1026', 'Logistics Group', '$147,000')} className="text-[#3B82F6] font-bold hover:underline text-[11px] cursor-pointer">Download</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 flex flex-col p-6 mt-2">
          <h2 className="text-[13px] font-bold text-gray-900 mb-6">Financial Activity Log</h2>
          
          <div className="flex flex-col gap-6">
             <div className="flex gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FFD400] flex-shrink-0"></div>
                <div>
                   <div className="text-[12px] font-bold text-gray-900 mb-0.5">Invoice INV-1022 marked as PAID</div>
                   <div className="text-[11px] font-medium text-gray-400">10 mins ago • Approved by Sarah Mitchell</div>
                </div>
             </div>
             
             <div className="flex gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FFD400] flex-shrink-0"></div>
                <div>
                   <div className="text-[12px] font-bold text-gray-900 mb-0.5">New Invoice draft INV-1026 created</div>
                   <div className="text-[11px] font-medium text-gray-400">1 hour ago • Assigned to Alpha Holdings</div>
                </div>
             </div>
             
             <div className="flex gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FFD400] flex-shrink-0"></div>
                <div>
                   <div className="text-[12px] font-bold text-gray-900 mb-0.5">Expense claim approved: Fuel Voucher EXP-902</div>
                   <div className="text-[11px] font-medium text-gray-400">3 hours ago • Approved by Accounts Dept</div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* New Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 flex justify-center">
           <div className="bg-white rounded-lg shadow-2xl w-full max-w-[480px] overflow-hidden flex flex-col mt-16 mb-auto">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                 <h2 className="text-[16px] font-bold text-gray-900">Create New Invoice</h2>
                 <button onClick={() => setShowInvoiceModal(false)} className="text-gray-400 hover:text-gray-900 hover:bg-gray-50 p-1.5 rounded-full transition-colors cursor-pointer">
                    <X size={18} strokeWidth={2.5} />
                 </button>
              </div>
              
              <form onSubmit={handleCreateInvoice} className="flex flex-col">
                 <div className="p-6 flex flex-col gap-5 bg-white">
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Client Name</label>
                       <input type="text" required placeholder="e.g. Acme Corporation" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1E64D9] focus:ring-1 focus:ring-[#1E64D9] transition-colors" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="flex flex-col gap-1.5">
                          <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Amount ($)</label>
                          <input type="number" required placeholder="0.00" min="0" step="0.01" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1E64D9] focus:ring-1 focus:ring-[#1E64D9] transition-colors" />
                       </div>
                       <div className="flex flex-col gap-1.5">
                          <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Due Date</label>
                          <input type="date" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-900 focus:outline-none focus:border-[#1E64D9] focus:ring-1 focus:ring-[#1E64D9] transition-colors" />
                       </div>
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                       <textarea rows="3" placeholder="Enter invoice description..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1E64D9] focus:ring-1 focus:ring-[#1E64D9] transition-colors resize-none"></textarea>
                    </div>
                 </div>
                 
                 <div className="px-6 py-5 bg-[#F8FAFC] border-t border-gray-100 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowInvoiceModal(false)} className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
                       Cancel
                    </button>
                    <button type="submit" className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-black bg-[#FFD400] hover:bg-[#F0C800] transition-colors shadow-sm cursor-pointer">
                       Create Invoice
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}
