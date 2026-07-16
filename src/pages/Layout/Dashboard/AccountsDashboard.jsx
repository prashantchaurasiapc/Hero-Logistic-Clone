import React, { useState } from 'react';
import './AccountsDashboard.css';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

<<<<<<< HEAD
const AccountsDashboard = () => (
  <div className="accounts-dashboard">
    <div className="accounts-header">
      <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">Accounts & Payroll &bull; Overview</h1>
      <p className="accounts-subtitle">Review invoice factoring, disburse driver paychecks, and analyze margins.</p>
    </div>
    <div className="stats-grid stats-4">
      <div className="stat-card"><div className="stat-title">FACTORED FUNDING</div><div className="stat-value">$12,400.00</div><div className="stat-footer"><span className="footer-left">Active invoice reserves</span><span className="footer-right grey">Factored</span></div></div>
      <div className="stat-card"><div className="stat-title">DRIVER PAYROLL</div><div className="stat-value">2 Pending</div><div className="stat-footer"><span className="footer-left">Awaiting payment runs</span><span className="footer-right grey">$3,310 paid</span></div></div>
      <div className="stat-card"><div className="stat-title">OUTSTANDING INVOICES</div><div className="stat-value">$0.00</div><div className="stat-footer"><span className="footer-left">Open balances ledger</span><span className="footer-right green">Awaiting Customer</span></div></div>
      <div className="stat-card"><div className="stat-title">NET PROFIT MARGIN</div><div className="stat-value">$-3,430.00</div><div className="stat-footer"><span className="footer-left">Margin: -26.8%</span><span className="footer-right green">Revenue: $12,790</span></div></div>
      <div className="stat-card"><div className="stat-title">TOTAL REVENUE</div><div className="stat-value">$12,790.00</div><div className="stat-footer"><span className="footer-left">From paid shipper invoices</span><span className="footer-right green">Revenue</span></div></div>
      <div className="stat-card"><div className="stat-title">TOTAL EXPENSES</div><div className="stat-value">$16,220.00</div><div className="stat-footer"><span className="footer-left">Payroll + Fuel + Maintenance</span><span className="footer-right grey">Costs</span></div></div>
      <div className="stat-card"><div className="stat-title">GROSS PROFIT</div><div className="stat-value">$7,630.00</div><div className="stat-footer"><span className="footer-left">After labour costs</span><span className="footer-right green">Before overheads</span></div></div>
      <div className="stat-card"><div className="stat-title">CONTRACTOR PAY</div><div className="stat-value">$1,850.00</div><div className="stat-footer"><span className="footer-left">Subcontractor settlements</span><span className="footer-right grey">Brokerage costs</span></div></div>
    </div>
    <div className="quick-actions-section">
      <span className="quick-actions-label">QUICK ACTIONS:</span>
      <button className="action-btn btn-primary">+ New Invoice</button>
      <button className="action-btn btn-secondary">Raise Credit Note</button>
      <button className="action-btn btn-secondary">Submit Factoring</button>
      <button className="action-btn btn-secondary">Record Payment</button>
      <button className="action-btn btn-danger">Write Off Bad Debt</button>
      <button className="action-btn btn-secondary">Run Payroll</button>
    </div>
    <div className="charts-grid">
      <div className="chart-card">
        <div className="chart-header-row"><span className="chart-title">FUEL COST CATEGORY</span><span className="chart-badge red">26% of expenses</span></div>
        <div className="chart-value">$4,290.00</div>
        <div className="mini-chart"><div className="bar-chart"><div className="bar" style={{ height: '20%' }}></div><div className="bar" style={{ height: '0%' }}></div><div className="bar" style={{ height: '0%' }}></div><div className="bar" style={{ height: '0%' }}></div><div className="bar" style={{ height: '20%' }}></div></div></div>
      </div>
      <div className="chart-card">
        <div className="chart-header-row"><span className="chart-title">DRIVER WAGES & PAYROLL</span><span className="chart-badge yellow">20% of expenses</span></div>
        <div className="chart-value">$3,310.00</div>
        <div className="mini-chart">
          <svg width="100%" height="80" viewBox="0 0 100 40" preserveAspectRatio="none">
            <polyline fill="none" stroke="#0ea5e9" strokeWidth="2" points="0,35 20,30 40,32 60,20 80,25 100,30" />
          </svg>
=======
/* ─── Data ─── */
const FUEL_DATA = [
  { month: 'Jan', value: 1200 }, { month: 'Feb', value: 1800 },
  { month: 'Mar', value: 1900 }, { month: 'Apr', value: 2100 },
  { month: 'Current', value: 4290 },
];
const WAGES_DATA = [
  { month: 'Jan', value: 2900 }, { month: 'Feb', value: 3100 },
  { month: 'Mar', value: 3400 }, { month: 'Apr', value: 3600 },
  { month: 'Current', value: 3310 },
];
const MAINT_DATA = [
  { month: 'Jan', value: 800 }, { month: 'Feb', value: 900 },
  { month: 'Mar', value: 1000 }, { month: 'Apr', value: 1100 },
  { month: 'Current', value: 3820 },
];
const WEEKLY_DATA = [
  { week: 'Wk 1', value: 11000 }, { week: 'Wk 2', value: 15000 },
  { week: 'Wk 3', value: 13000 }, { week: 'Wk 4', value: 16000 },
  { week: 'Wk 5', value: 22000 }, { week: 'Current', value: 12000 },
];

const LEDGER_CATEGORIES = ['Shipper Invoice Inflow', 'Driver Payroll Payout', 'Invoice Factoring Margin'];

const AccountsDashboard = () => {
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [ledgerForm, setLedgerForm] = useState({ payee: '', amount: '', category: LEDGER_CATEGORIES[0] });
  const [showCategoryDrop, setShowCategoryDrop] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleRecordPayment = () => { setShowLedgerModal(true); };
  const handleCreditNote = () => { showToast('Credit note raised and applied to customer account.'); };
  const handleWriteOff = () => { showToast('Bad debt written off and flagged in ledger.'); };

  const handleLedgerSubmit = () => {
    setShowLedgerModal(false);
    setLedgerForm({ payee: '', amount: '', category: LEDGER_CATEGORIES[0] });
    showToast('Financial ledger entry recorded successfully.');
  };

  return (
    <div className="accounts-dashboard">
      {/* Header */}
      <div className="accounts-header">
        <div>
          <h1 className="accounts-title">Accounts &amp; Payroll &bull; Overview</h1>
          <p className="accounts-subtitle">Review invoice factoring, disburse driver paychecks, and analyze margins.</p>
>>>>>>> af5a521e950d110422b1f67913a26878ade0ce54
        </div>
      </div>

      {/* KPI Row 1 */}
      <div className="stats-grid stats-4">
        <div className="stat-card"><div className="stat-title">FACTORED FUNDING</div><div className="stat-value">$12,400.00</div><div className="stat-footer"><span className="footer-left">Active invoice reserves</span><span className="footer-right grey">Factored</span></div></div>
        <div className="stat-card"><div className="stat-title">DRIVER PAYROLL</div><div className="stat-value">2 Pending</div><div className="stat-footer"><span className="footer-left">Awaiting payment runs</span><span className="footer-right green">$3,310 paid</span></div></div>
        <div className="stat-card"><div className="stat-title">OUTSTANDING INVOICES</div><div className="stat-value">$0.00</div><div className="stat-footer"><span className="footer-left">Open balances ledger</span><span className="footer-right" style={{color:'#eab308'}}>Awaiting Customer</span></div></div>
        <div className="stat-card"><div className="stat-title">NET PROFIT MARGIN</div><div className="stat-value">$-3,430.00</div><div className="stat-footer"><span className="footer-left">Margin: -26.8%</span><span className="footer-right green">Revenue: $12,790</span></div></div>
      </div>

      {/* KPI Row 2 */}
      <div className="stats-grid stats-4">
        <div className="stat-card"><div className="stat-title">TOTAL REVENUE</div><div className="stat-value">$12,790.00</div><div className="stat-footer"><span className="footer-left">From paid shipper invoices</span><span className="footer-right green">Revenue</span></div></div>
        <div className="stat-card"><div className="stat-title">TOTAL EXPENSES</div><div className="stat-value">$16,220.00</div><div className="stat-footer"><span className="footer-left">Payroll + Fuel + Maintenance</span><span className="footer-right" style={{color:'#ef4444'}}>Costs</span></div></div>
        <div className="stat-card"><div className="stat-title">GROSS PROFIT</div><div className="stat-value">$7,630.00</div><div className="stat-footer"><span className="footer-left">After labour costs</span><span className="footer-right" style={{color:'#eab308'}}>Before overheads</span></div></div>
        <div className="stat-card"><div className="stat-title">CONTRACTOR PAY</div><div className="stat-value">$1,850.00</div><div className="stat-footer"><span className="footer-left">Subcontractor settlements</span><span className="footer-right grey">Brokerage costs</span></div></div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <span className="quick-actions-label">QUICK ACTIONS:</span>
        <button className="action-btn btn-primary" onClick={() => setShowLedgerModal(true)}>+ New Invoice</button>
        <button className="action-btn btn-secondary" onClick={handleCreditNote}>Raise Credit Note</button>
        <button className="action-btn btn-secondary">Submit Factoring</button>
        <button className="action-btn btn-secondary" onClick={() => showToast('Manual payment record logged to ledger.')}>Record Payment</button>
        <button className="action-btn btn-danger" onClick={handleWriteOff}>Write Off Bad Debt</button>
        <button className="action-btn btn-secondary">Run Payroll</button>
      </div>

      {/* Expense Charts */}
      <div className="charts-grid">
        {/* Fuel Cost */}
        <div className="chart-card">
          <div className="chart-header-row">
            <span className="chart-title">FUEL COST CATEGORY</span>
            <span className="chart-badge red">26% of expenses</span>
          </div>
          <div className="chart-value">$4,290.00</div>
          <div style={{height:120}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FUEL_DATA} barCategoryGap="30%">
                <XAxis dataKey="month" tick={{fontSize:10,fill:'#94a3b8',fontWeight:600}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{borderRadius:8,fontSize:12}} formatter={v=>[`$${v.toLocaleString()}`,'']}/>
                <Bar dataKey="value" fill="#3b82f6" radius={[4,4,0,0]} barSize={28}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Driver Wages */}
        <div className="chart-card">
          <div className="chart-header-row">
            <span className="chart-title">DRIVER WAGES &amp; PAYROLL</span>
            <span className="chart-badge" style={{color:'#16a34a'}}>20% of expenses</span>
          </div>
          <div className="chart-value">$3,310.00</div>
          <div style={{height:120}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WAGES_DATA}>
                <XAxis dataKey="month" tick={{fontSize:10,fill:'#94a3b8',fontWeight:600}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false} domain={['dataMin-200','dataMax+200']}/>
                <Tooltip contentStyle={{borderRadius:8,fontSize:12}} formatter={v=>[`$${v.toLocaleString()}`,'']}/>
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5} dot={{r:4,fill:'#3b82f6',stroke:'#fff',strokeWidth:2}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Maintenance */}
        <div className="chart-card">
          <div className="chart-header-row">
            <span className="chart-title">VEHICLE MAINTENANCE</span>
            <span className="chart-badge" style={{color:'#16a34a'}}>24% of expenses</span>
          </div>
          <div className="chart-value">$3,820.00</div>
          <div style={{height:120}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MAINT_DATA} barCategoryGap="30%">
                <XAxis dataKey="month" tick={{fontSize:10,fill:'#94a3b8',fontWeight:600}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{borderRadius:8,fontSize:12}} formatter={v=>[`$${v.toLocaleString()}`,'']}/>
                <Bar dataKey="value" fill="#3b82f6" radius={[4,4,0,0]} barSize={28}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weekly Net Cash Inflow */}
      <div className="chart-card" style={{marginTop:24}}>
        <div style={{fontSize:16,fontWeight:800,color:'#0f172a',marginBottom:20}}>Weekly Net Cash Inflow (USD)</div>
        <div style={{height:240}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={WEEKLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="week" tick={{fontSize:12,fill:'#94a3b8',fontWeight:600}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={v=>v.toLocaleString()}/>
              <Tooltip contentStyle={{borderRadius:10,border:'1px solid #e2e8f0',fontSize:12}} formatter={v=>[`$${v.toLocaleString()}`,'']} labelStyle={{fontWeight:700}}/>
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5} dot={{r:5,fill:'#3b82f6',stroke:'#fff',strokeWidth:2}} activeDot={{r:7,fill:'#3b82f6'}} name="value"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Record Financial Ledger Modal */}
      {showLedgerModal && (
        <>
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',zIndex:998,backdropFilter:'blur(2px)'}} onClick={()=>setShowLedgerModal(false)}/>
          <div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#fff',borderRadius:16,padding:'32px 36px',zIndex:999,width:500,maxWidth:'90vw',boxShadow:'0 25px 60px rgba(0,0,0,0.2)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:28}}>
              <h2 style={{fontSize:20,fontWeight:800,color:'#0f172a',margin:0}}>Record Financial Ledger entry</h2>
              <button onClick={()=>setShowLedgerModal(false)} style={{background:'none',border:'none',fontSize:22,color:'#64748b',cursor:'pointer',padding:4,lineHeight:1}}>✕</button>
            </div>

            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:11,fontWeight:800,color:'#334155',letterSpacing:'0.8px',marginBottom:8,textTransform:'uppercase'}}>PAYEE / BILLING CUSTOMER NAME</label>
              <input
                type="text"
                placeholder="e.g. Memphis Shippers Inc"
                value={ledgerForm.payee}
                onChange={e=>setLedgerForm({...ledgerForm,payee:e.target.value})}
                style={{width:'100%',padding:'14px 16px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit',color:'#0f172a',background:'#fff'}}
              />
            </div>

            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:11,fontWeight:800,color:'#334155',letterSpacing:'0.8px',marginBottom:8,textTransform:'uppercase'}}>TRANSACTION AMOUNT (USD)</label>
              <input
                type="text"
                placeholder="e.g. 1420.00"
                value={ledgerForm.amount}
                onChange={e=>setLedgerForm({...ledgerForm,amount:e.target.value})}
                style={{width:'100%',padding:'14px 16px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit',color:'#0f172a',background:'#fff'}}
              />
            </div>

            <div style={{marginBottom:28,position:'relative'}}>
              <label style={{display:'block',fontSize:11,fontWeight:800,color:'#334155',letterSpacing:'0.8px',marginBottom:8,textTransform:'uppercase'}}>LEDGER CATEGORY TYPE</label>
              <select
                value={ledgerForm.category}
                onChange={e=>setLedgerForm({...ledgerForm,category:e.target.value})}
                style={{width:'100%',padding:'14px 16px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit',color:'#0f172a',background:'#fff',WebkitAppearance:'none',MozAppearance:'none',appearance:'none',backgroundImage:'url("data:image/svg+xml;utf8,<svg fill=\'%2364748b\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>")',backgroundRepeat:'no-repeat',backgroundPosition:'right 16px center',cursor:'pointer'}}
                onFocus={e => e.target.style.border = '2px solid #FFCC00'}
                onBlur={e => e.target.style.border = '1.5px solid #e2e8f0'}
              >
                {LEDGER_CATEGORIES.map((cat,i)=>(
                  <option key={i} value={cat} style={{color:'#0f172a'}}>{cat}</option>
                ))}
              </select>
            </div>

            <div style={{marginTop:24}}>
              <button onClick={handleLedgerSubmit} style={{width:'100%',padding:'14px 20px',border:'none',borderRadius:10,background:'#FFCC00',fontSize:15,fontWeight:800,cursor:'pointer',color:'#000',textAlign:'center'}}>Save Financial Entry</button>
            </div>
          </div>
        </>
      )}

      {/* Toast Notification */}
      {toast && (
        <div style={{position:'fixed',bottom:80,right:32,background:'#ecfdf5',border:'1px solid #a7f3d0',borderRadius:12,padding:'14px 20px',display:'flex',alignItems:'center',gap:10,zIndex:1000,boxShadow:'0 8px 24px rgba(0,0,0,0.1)',maxWidth:420,animation:'slideIn 0.3s ease'}}>
          <span style={{color:'#10b981',fontSize:20}}>✓</span>
          <span style={{fontSize:14,fontWeight:600,color:'#065f46',flex:1}}>{toast}</span>
          <button onClick={()=>setToast(null)} style={{background:'none',border:'none',fontSize:16,color:'#64748b',cursor:'pointer',padding:0,lineHeight:1}}>✕</button>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AccountsDashboard;
