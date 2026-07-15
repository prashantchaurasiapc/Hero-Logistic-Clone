import React from 'react';
import './AccountsDashboard.css';

const AccountsDashboard = () => (
  <div className="accounts-dashboard">
    <div className="accounts-header">
      <h1 className="accounts-title">Accounts & Payroll &bull; Overview</h1>
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
        </div>
      </div>
      <div className="chart-card">
        <div className="chart-header-row"><span className="chart-title">VEHICLE MAINTENANCE</span><span className="chart-badge yellow">24% of expenses</span></div>
        <div className="chart-value">$3,820.00</div>
        <div className="mini-chart"><div className="bar-chart"><div className="bar" style={{ height: '0%' }}></div><div className="bar" style={{ height: '0%' }}></div><div className="bar" style={{ height: '0%' }}></div><div className="bar" style={{ height: '0%' }}></div><div className="bar" style={{ height: '60%' }}></div></div></div>
      </div>
    </div>
  </div>
);

export default AccountsDashboard;
