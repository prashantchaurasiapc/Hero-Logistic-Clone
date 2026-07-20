import React, { useState } from 'react';

const GstPayg = () => {
  const [activeQuarter, setActiveQuarter] = useState('Q1');
  const [toast, setToast] = useState(null);

  const quarters = [
    { id: 'Q1', label: 'Q1 (Jan-Mar)' },
    { id: 'Q2', label: 'Q2 (Apr-Jun)' },
    { id: 'Q3', label: 'Q3 (Jul-Sep)' },
    { id: 'Q4', label: 'Q4 (Oct-Dec)' }
  ];

  const handleQuarterChange = (q) => {
    setActiveQuarter(q.id);
    setToast(`Tax period filtered: ${q.label}`);
    // Auto hide toast after 4 seconds
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div style={S.container}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
            Accounts &amp; Payroll <span className="text-slate-400 text-xl mx-1">•</span> Tax
          </h1>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">
            Review invoice factoring, disburse driver paychecks, and analyze margins.
          </p>
        </div>
      </div>

      {/* Top Filter Bar */}
      <div style={S.filterBar}>
        <div style={S.quarterGroup}>
          {quarters.map((q) => {
            const isActive = activeQuarter === q.id;
            return (
              <button
                key={q.id}
                onClick={() => handleQuarterChange(q)}
                style={{
                  ...S.quarterBtn,
                  border: isActive ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
                  color: isActive ? '#0f172a' : '#475569',
                  fontWeight: isActive ? '800' : '600'
                }}
              >
                {q.label}
              </button>
            );
          })}
        </div>
        
        <button 
          onClick={() => {
            setToast('Tax report export initiated.');
            setTimeout(() => setToast(null), 4000);
          }}
          style={S.exportBtn}
        >
          Export Tax Report
        </button>
      </div>

      {/* Content Cards */}
      <div style={S.cardsGrid}>
        {/* GST Summary Card */}
        <div className="gst-summary-card" style={S.card}>
          <h2 style={S.cardTitle}>GST Summary (Goods &amp; Services Tax)</h2>
          
          <div style={S.cardBody}>
            <div style={S.row}>
              <span style={S.labelMuted}>Total Revenue Sales (GST Inc)</span>
              <span style={S.valBlack}>$48,250.00</span>
            </div>
            
            <div style={S.divider} />
            
            <div style={S.row}>
              <span style={S.labelMuted}>GST Collected on Invoices (10%)</span>
              <span style={S.valSlateBlue}>$4,825.00</span>
            </div>
            
            <div style={S.divider} />
            
            <div style={S.row}>
              <span style={S.labelRed}>GST Paid on Fleet Purchases (10%)</span>
              <span style={S.valRed}>$2,140.00</span>
            </div>
            
            <div style={S.divider} />
            
            <div style={{ ...S.row, marginTop: 12 }}>
              <span style={S.labelTotalGold}>Net GST Refundable/Payable</span>
              <span style={S.valTotalGold}>$2,685.00 <span style={S.dueText}>due</span></span>
            </div>
          </div>
        </div>

        {/* PAYG Summary Card */}
        <div className="gst-summary-card" style={S.card}>
          <h2 style={S.cardTitle}>PAYG Summary (Pay As You Go Tax)</h2>
          
          <div style={S.cardBody}>
            <div style={S.row}>
              <span style={S.labelMuted}>Gross Employee Wages paid</span>
              <span style={S.valBlack}>$12,400.00</span>
            </div>
            
            <div style={S.divider} />
            
            <div style={S.row}>
              <span style={S.labelMuted}>PAYG Tax Withheld from Salaries</span>
              <span style={S.valGoldSmall}>$2,840.00</span>
            </div>
            
            <div style={S.divider} />
            
            <div style={S.row}>
              <span style={S.labelMuted}>Superannuation Employer contributions (11.5%)</span>
              <span style={S.valBlack}>$1,426.00</span>
            </div>
            
            <div style={S.divider} />
            
            <div style={{ ...S.row, marginTop: 12 }}>
              <span style={S.labelTotalGold}>Total PAYG Remittance Liabilities</span>
              <span style={S.valTotalGold}>$4,266.00 <span style={S.dueText}>due</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <div className="settings-toast" style={S.toastContainer}>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 16
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
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: '16px 24px',
    border: '1px solid #e2e8f0',
    marginBottom: 24,
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
    flexWrap: 'wrap',
    gap: 16
  },
  quarterGroup: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  quarterBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 12.5,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
    boxSizing: 'border-box'
  },
  exportBtn: {
    backgroundColor: '#FFCC00',
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    fontSize: 12.5,
    fontWeight: '800',
    cursor: 'pointer',
    padding: '9px 18px',
    transition: 'all 0.15s ease-in-out',
    outline: 'none'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 24
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: '32px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 24px 0'
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    gap: 12
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    width: '100%'
  },
  labelMuted: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600'
  },
  valBlack: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '800',
    fontFamily: 'monospace',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },
  valSlateBlue: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '800',
    fontFamily: 'monospace',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },
  labelRed: {
    fontSize: 13,
    color: '#f87171',
    fontWeight: '600'
  },
  valRed: {
    fontSize: 13,
    color: '#f87171',
    fontWeight: '800',
    fontFamily: 'monospace',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },
  valGoldSmall: {
    fontSize: 13,
    color: '#d97706',
    fontWeight: '800',
    fontFamily: 'monospace',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },
  labelTotalGold: {
    fontSize: 15,
    color: '#d97706',
    fontWeight: '800'
  },
  valTotalGold: {
    fontSize: 15,
    color: '#d97706',
    fontWeight: '800',
    fontFamily: 'monospace',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },
  dueText: {
    fontSize: 13,
    color: '#d97706',
    fontWeight: '700',
    fontFamily: "'Outfit', 'Inter', sans-serif",
    whiteSpace: 'nowrap'
  },
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

export default GstPayg;
