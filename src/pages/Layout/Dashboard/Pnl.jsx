import React, { useState } from 'react';

const Pnl = () => {
  const [activeBtn, setActiveBtn] = useState(null);
  const [toast, setToast] = useState(null);

  const showToastMsg = (id, msg) => {
    setActiveBtn(id);
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div style={S.container}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
            Accounts &amp; Payroll <span className="text-slate-400 text-xl mx-1">•</span> P&amp;L
          </h1>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">
            Review invoice factoring, disburse driver paychecks, and analyze margins.
          </p>
        </div>
      </div>

      {/* Main Ledger Card */}
      <div style={S.card}>
        <div style={S.topSection}>
          <div style={S.titleBlock}>
            <h2 style={S.cardTitle}>Profit &amp; Loss (P&amp;L) Ledger Statement</h2>
            <p style={S.cardSubtitle}>
              Review revenue streams, employee payroll,<br/>
              contractor pay, fuel cards, and vehicle costing.
            </p>
          </div>

          <div style={S.actionsWrap}>
            {/* Action Pills */}
            <button 
              onClick={() => showToastMsg('view-pnl', 'Viewing Profit & Loss Statement.')}
              style={{ ...S.btnSolidGold, border: activeBtn === 'view-pnl' ? '2px solid #0f172a' : 'none' }}
            >
              View P&amp;L
            </button>
            <button 
              onClick={() => showToastMsg('review-gst', 'GST BAS tax sheet compiled.')}
              style={{ ...S.btnOutline, border: activeBtn === 'review-gst' ? '2px solid #0f172a' : '1px solid #e2e8f0' }}
            >
              Review GST
            </button>
            <button 
              onClick={() => showToastMsg('review-payg', 'PAYG payroll withholding sheets audited.')}
              style={{ ...S.btnOutline, border: activeBtn === 'review-payg' ? '2px solid #0f172a' : '1px solid #e2e8f0' }}
            >
              Review PAYG
            </button>
            <button 
              onClick={() => showToastMsg('review-expense', 'Auditing pending operational expense receipts.')}
              style={{ ...S.btnOutline, border: activeBtn === 'review-expense' ? '2px solid #0f172a' : '1px solid #e2e8f0' }}
            >
              Review Expense
            </button>
            <button 
              onClick={() => showToastMsg('approve-expense', 'Expense receipt approved.')}
              style={{ ...S.btnSolidGold, border: activeBtn === 'approve-expense' ? '2px solid #0f172a' : 'none' }}
            >
              Approve Expense
            </button>
            <button 
              onClick={() => showToastMsg('approve-ai', 'AI OCR receipt scan confirmed.')}
              style={{ ...S.btnSolidEmerald, border: activeBtn === 'approve-ai' ? '2px solid #0f172a' : 'none' }}
            >
              Approve AI Receipt
            </button>
            <button 
              onClick={() => showToastMsg('reject-ai', 'AI OCR receipt rejected.')}
              style={{ ...S.btnSolidRose, border: activeBtn === 'reject-ai' ? '2px solid #0f172a' : 'none' }}
            >
              Reject AI Receipt
            </button>
            
            {/* Second Row of Pills */}
            <button 
              onClick={() => showToastMsg('process-contractor', 'Processing contractor settlements.')}
              style={{ ...S.btnSolidGold, border: activeBtn === 'process-contractor' ? '2px solid #0f172a' : 'none' }}
            >
              Process Contractor Pay
            </button>
            <button 
              onClick={() => showToastMsg('process-employee', 'Processing employee payroll.')}
              style={{ ...S.btnSolidGold, border: activeBtn === 'process-employee' ? '2px solid #0f172a' : 'none' }}
            >
              Process Employee Pay
            </button>
            <button 
              onClick={() => showToastMsg('export-payroll', 'Exporting payroll data.')}
              style={{ ...S.btnOutline, border: activeBtn === 'export-payroll' ? '2px solid #0f172a' : '1px solid #e2e8f0' }}
            >
              Export Payroll
            </button>
            <button 
              onClick={() => showToastMsg('view-load', 'Viewing Load Profit metrics.')}
              style={{ ...S.btnOutline, border: activeBtn === 'view-load' ? '2px solid #0f172a' : '1px solid #e2e8f0' }}
            >
              View Load Profit
            </button>
            <button 
              onClick={() => showToastMsg('view-vehicle', 'Viewing Vehicle Costs ledger.')}
              style={{ ...S.btnOutline, border: activeBtn === 'view-vehicle' ? '2px solid #0f172a' : '1px solid #e2e8f0' }}
            >
              View Vehicle Costs
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div style={S.metricsGrid}>
          {/* Dynamic Revenue */}
          <div className="hover-card" style={S.metricCard}>
            <div style={S.metricLabel}>DYNAMIC REVENUE</div>
            <div style={S.metricValue}>$12,790.00</div>
            
            <div style={S.progressWrapper}>
              <div style={S.progressBarTrack}>
                <div style={{ ...S.progressBarFill, width: '100%' }}></div>
              </div>
            </div>
            
            <div style={S.metricFooter}>
              <span style={S.footerLabel}>Progress</span>
              <span style={S.footerPercent}>100%</span>
            </div>
            <div style={S.footerSub}>Paid shipper invoices</div>
          </div>

          {/* Total Expenses */}
          <div className="hover-card" style={S.metricCard}>
            <div style={S.metricLabel}>TOTAL EXPENSES</div>
            <div style={S.metricValue}>$16,220.00</div>
            
            <div style={S.progressWrapper}>
              <div style={S.progressBarTrack}>
                <div style={{ ...S.progressBarFill, width: '75%' }}></div>
              </div>
            </div>
            
            <div style={S.metricFooter}>
              <span style={S.footerLabel}>Progress</span>
              <span style={S.footerPercent}>75%</span>
            </div>
            <div style={S.footerSub}>Payroll, Fuel, Maintenance</div>
          </div>

          {/* Gross Margin */}
          <div className="hover-card" style={S.metricCard}>
            <div style={S.metricLabel}>GROSS MARGIN</div>
            <div style={S.metricValue}>$7,630.00</div>
            
            <div style={S.progressWrapper}>
              <div style={S.progressBarTrack}>
                <div style={{ ...S.progressBarFill, width: '85%' }}></div>
              </div>
            </div>
            
            <div style={S.metricFooter}>
              <span style={S.footerLabel}>Progress</span>
              <span style={S.footerPercent}>85%</span>
            </div>
            <div style={S.footerSub}>Trips profitability</div>
          </div>

          {/* Net Profit Margin */}
          <div className="hover-card" style={S.metricCard}>
            <div style={S.metricLabel}>NET PROFIT MARGIN</div>
            <div style={S.metricValue}>$-3,430.00</div>
            
            <div style={S.progressWrapper}>
              <div style={S.progressBarTrack}>
                <div style={{ ...S.progressBarFill, width: '95%' }}></div>
              </div>
            </div>
            
            <div style={S.metricFooter}>
              <span style={S.footerLabel}>Progress</span>
              <span style={S.footerPercent}>95%</span>
            </div>
            <div style={S.footerSub}>Margin: -26.8%</div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <div style={S.toastContainer}>
          <div style={S.toastIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <span style={S.toastText}>{toast}</span>
          <button onClick={() => setToast(null)} style={S.toastCloseBtn}>✕</button>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .hover-card {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04) !important;
          border-color: #cbd5e1 !important;
        }
      `}</style>
    </div>
  );
};

/* ─── Styles Object ─── */
const S = {
  container: {
    padding: '24px 32px',
    backgroundColor: '#f8fafc',
    minHeight: '100%',
    fontFamily: 'Inter, Outfit, sans-serif'
  },
  header: {
    marginBottom: 24
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 6px 0',
    letterSpacing: '-0.5px'
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#64748b',
    margin: 0
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: '32px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)'
  },
  topSection: {
    display: 'flex',
    gap: 32,
    marginBottom: 40,
    flexWrap: 'wrap'
  },
  titleBlock: {
    minWidth: 260
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 8px 0'
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748b',
    margin: 0,
    lineHeight: 1.5,
    fontWeight: '500'
  },
  actionsWrap: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'flex-start'
  },
  // Button Base
  btnBase: {
    borderRadius: 30,
    fontSize: 11,
    fontWeight: '800',
    padding: '6px 12px',
    cursor: 'pointer',
    transition: 'all 0.1s ease',
    boxSizing: 'border-box'
  },
  btnOutline: {
    backgroundColor: '#ffffff',
    color: '#334155',
    borderRadius: 30,
    fontSize: 11,
    fontWeight: '800',
    padding: '6px 12px',
    cursor: 'pointer',
    transition: 'all 0.1s ease',
    boxSizing: 'border-box'
  },
  btnSolidGold: {
    backgroundColor: '#FFCC00',
    color: '#000000',
    borderRadius: 30,
    fontSize: 11,
    fontWeight: '800',
    padding: '6px 12px',
    cursor: 'pointer',
    transition: 'all 0.1s ease',
    boxSizing: 'border-box',
    boxShadow: '0 4px 10px rgba(255, 204, 0, 0.3)'
  },
  btnSolidEmerald: {
    backgroundColor: '#10b981',
    color: '#000000',
    borderRadius: 30,
    fontSize: 11,
    fontWeight: '800',
    padding: '6px 12px',
    cursor: 'pointer',
    transition: 'all 0.1s ease',
    boxSizing: 'border-box',
    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
  },
  btnSolidRose: {
    backgroundColor: '#f43f5e',
    color: '#000000',
    borderRadius: 30,
    fontSize: 11,
    fontWeight: '800',
    padding: '6px 12px',
    cursor: 'pointer',
    transition: 'all 0.1s ease',
    boxSizing: 'border-box',
    boxShadow: '0 4px 10px rgba(244, 63, 94, 0.3)'
  },
  // Metrics Grid
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 20
  },
  metricCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: '16px 20px',
    border: '1px solid #f1f5f9'
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 8
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-1px',
    marginBottom: 16
  },
  progressWrapper: {
    marginBottom: 8
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFCC00',
    borderRadius: 2
  },
  metricFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8'
  },
  footerPercent: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b'
  },
  footerSub: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748b'
  },
  // Toast
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
    gap: 12,
    zIndex: 1000,
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
    maxWidth: 420,
    animation: 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  toastIcon: {
    color: '#10b981',
    display: 'flex',
    alignItems: 'center'
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

export default Pnl;
