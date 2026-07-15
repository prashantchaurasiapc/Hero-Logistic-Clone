import React from 'react';
import './Dashboard.css';
import { FiPlus, FiRefreshCcw, FiShield, FiLock, FiEdit2, FiCheckCircle, FiMaximize, FiDownload } from 'react-icons/fi';
import { BsQrCodeScan } from 'react-icons/bs';

/* ============================================================
   ROLE-SPECIFIC DASHBOARD COMPONENTS
   ============================================================ */

/* ----- Super Admin Dashboard ----- */
const SuperAdminDashboard = () => {
  const StatCard = ({ title, value, desc, status, statusColor }) => (
    <div className="stat-card">
      <h3 className="stat-title">{title}</h3>
      <div className="stat-value">{value}</div>
      <div className="stat-footer">
        <span className="stat-desc">{desc}</span>
        <span className={`stat-status ${statusColor || ''}`}>{status}</span>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Super Admin • Overview</h1>
          <p className="page-subtitle">Configure global licensing rules, audit tenant margins, and resolve support tickets.</p>
        </div>
        <button className="export-btn">Export Report</button>
      </div>

      <div className="stats-grid stats-4">
        <StatCard title="ACTIVE COMPANIES" value="4" desc="SaaS instances online" status="Stable" />
        <StatCard title="TRIAL COMPANIES" value="2" desc="SaaS trial instances" status="+1 new" statusColor="text-green" />
        <StatCard title="PAID COMPANIES" value="3" desc="Subscribed paying contracts" status="Stable" />
        <StatCard title="MONTHLY REVENUE" value="$42,910" desc="Platform cash stream baseline" status="+8%" statusColor="text-green" />
        <StatCard title="FAILED PAYMENTS" value="1" desc="Payment gateway errors" status="0 alerts" />
        <StatCard title="SUPPORT TICKETS" value="2" desc="Requires administrative response" status="Alert" statusColor="text-red" />
        <StatCard title="ACTIVE USERS" value="118" desc="Active platform users pool" status="+3 active" statusColor="text-green" />
        <StatCard title="PLATFORM USAGE" value="14.2%" desc="AWS autoscaling node limits" status="Stable" />
      </div>

      <div className="dashboard-row">
        <div className="chart-section card">
          <h3 className="section-title">MRR Revenue Timeline (USD)</h3>
          <div className="chart-placeholder">
            <div className="chart-grid">
              <div className="grid-line"><span className="y-label">60000</span></div>
              <div className="grid-line"><span className="y-label">45000</span></div>
              <div className="grid-line"><span className="y-label">30000</span></div>
              <div className="grid-line"><span className="y-label">15000</span></div>
              <div className="grid-line"><span className="y-label">0</span></div>
            </div>
            <svg className="chart-line" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,90 Q15,60 30,60 T60,60 T85,55 L100,40" fill="none" stroke="#0ea5e9" strokeWidth="2" />
              <circle cx="0" cy="90" r="1.5" fill="#0ea5e9" />
              <circle cx="30" cy="60" r="1.5" fill="#0ea5e9" />
              <circle cx="60" cy="60" r="1.5" fill="#0ea5e9" />
              <circle cx="85" cy="55" r="1.5" fill="#0ea5e9" />
              <circle cx="100" cy="40" r="1.5" fill="#0ea5e9" />
            </svg>
            <div className="x-labels">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            </div>
          </div>
        </div>

        <div className="actions-section card">
          <h3 className="section-title">Platform Actions</h3>
          <p className="section-desc">Quick administrative platform workflows.</p>
          <div className="action-buttons">
            <button className="action-btn btn-orange"><FiPlus /> Add Company</button>
            <button className="action-btn btn-red"><FiShield /> Suspend Company</button>
            <button className="action-btn btn-teal"><FiRefreshCcw /> Reactivate Company</button>
            <button className="action-btn btn-blue"><FiLock /> Login As Company</button>
            <button className="action-btn btn-yellow"><FiPlus /> Create Plan</button>
            <button className="action-btn btn-blue2"><FiEdit2 /> Edit Plan</button>
            <button className="action-btn btn-purple"><FiShield /> Change Sub</button>
            <button className="action-btn btn-green"><FiCheckCircle /> Enable Feature</button>
          </div>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="table-section card">
          <div className="table-header">
            <div>
              <h3 className="section-title">Tenant Overview</h3>
              <p className="section-desc">Live summary of platform subscriber performance.</p>
            </div>
            <div className="table-controls">
              <div className="view-toggle">
                <span>COMPACT</span>
                <span className="active">DEFAULT</span>
                <span>RELAXED</span>
              </div>
              <button className="col-btn">COLUMNS</button>
            </div>
          </div>
          <table className="tenant-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>COMPANY</th>
                <th>SUBSCRIPTION PLAN</th>
                <th>STATUS</th>
                <th>ACTIVE USERS</th>
                <th>MONTHLY REVENUE</th>
                <th>TRIAL EXPIRY</th>
                <th>LAST LOGIN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="checkbox" /></td>
                <td><strong>Falcon Logistics LLC</strong></td>
                <td>Professional</td>
                <td><span className="status-badge success">ACTIVE</span></td>
                <td>12</td>
                <td className="text-green-dark"><strong>$8,500</strong></td>
                <td>N/A</td>
                <td>Today, 02:15 PM</td>
              </tr>
              <tr>
                <td><input type="checkbox" /></td>
                <td><strong>Swift Cargo Express</strong></td>
                <td>Starter</td>
                <td><span className="status-badge success">ACTIVE</span></td>
                <td>2</td>
                <td className="text-green-dark"><strong>$1,500</strong></td>
                <td>07/15/2026</td>
                <td>Yesterday, 04:30 PM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ----- Warehouse Dashboard ----- */
const WarehouseDashboard = () => (
  <div className="warehouse-dashboard">
    <div className="warehouse-header">
      <div className="warehouse-header-titles">
        <h1>Warehouse & Yard Workspace</h1>
        <p>Manage stock allocations, print asset tags, and spot load lanes.</p>
      </div>
      <div className="warehouse-header-actions">
        <button className="btn btn-yellow-wh">Car Carrying Yard</button>
        <button className="btn btn-white-wh">General Freight</button>
        <button className="btn btn-white-wh with-icon"><BsQrCodeScan /> Barcode Simulator</button>
        <button className="btn btn-white-yellow-wh with-icon"><FiPlus /> Manual Entry</button>
        <button className="btn btn-yellow-wh with-icon"><FiDownload /> Export Stock List</button>
      </div>
    </div>

    <div className="stats-grid stats-4">
      <div className="stat-card">
        <div className="stat-card-title">TOTAL STORED ASSETS</div>
        <div className="stat-card-value">4</div>
        <div className="stat-card-footer">
          <span className="footer-left">In active yard segregation</span>
          <span className="footer-right text-green">+3 new</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-card-title">OCCUPANCY LEVEL</div>
        <div className="stat-card-value">78%</div>
        <div className="progress-container">
          <div className="progress-bar"><div className="progress-fill" style={{ width: '78%' }}></div></div>
          <div className="progress-text">78%</div>
        </div>
        <div className="stat-card-footer">
          <span className="footer-left">Segregation capacity</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-card-title">LANES SPOTTED</div>
        <div className="stat-card-value">5 active</div>
        <div className="stat-card-footer">
          <span className="footer-left">Loading bay limits</span>
          <span className="footer-right">Normal</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-card-title">PENDING DISPATCHES</div>
        <div className="stat-card-value">3 Trucks</div>
        <div className="stat-card-footer">
          <span className="footer-left">Trailer staging queue</span>
          <span className="footer-right">3 ready</span>
        </div>
      </div>
    </div>

    <div className="warehouse-bottom-section">
      <h3 className="section-title">Zone Allocations & Limits</h3>
      <div className="zone-content">
        <div className="zone-cards">
          <div className="zone-card green-zone"><div className="zone-card-title">LANE A (PICKUP)</div><div className="zone-card-value">92%</div></div>
          <div className="zone-card green-zone"><div className="zone-card-title">LANE B (STAGING)</div><div className="zone-card-value">84%</div></div>
          <div className="zone-card yellow-zone"><div className="zone-card-title">HOLDING AREAS</div><div className="zone-card-value">45%</div></div>
          <div className="zone-card orange-zone"><div className="zone-card-title">BUNKER STORAGE</div><div className="zone-card-value">15%</div></div>
        </div>
        <div className="zone-chart-container">
          <div/*  */ className="zone-chart-title">CAPACITY ALLOCATION</div>
          <div className="doughnut-chart"></div>
          <div className="chart-legend">
            <span className="legend-item"><span className="dot dot-red"></span>Bunker</span>
            <span className="legend-item"><span className="dot dot-yellow"></span>Holding</span>
            <span className="legend-item"><span className="dot dot-blue"></span>Lane A</span>
            <span className="legend-item"><span className="dot dot-green"></span>Lane B</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ----- Yard Dashboard ----- */
const YardDashboard = () => (
  <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
    <div style={{ marginBottom: '32px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>Yard Attendant Dashboard</h1>
      <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Welcome to the Yard Attendant Portal. Select an action from the sidebar to begin.</p>
    </div>
    <div style={{
      backgroundColor: '#fff', borderRadius: '12px', padding: '48px', textAlign: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px dashed #e2e8f0'
    }}>
      <h2 style={{ fontSize: '18px', color: '#64748b', marginBottom: '16px' }}>Assigned Tasks Overview</h2>
      <p style={{ color: '#94a3b8' }}>You currently have no pending tasks. Check back later or start your work shift.</p>
    </div>
  </div>
);

/* ----- Accounts Dashboard ----- */
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

/* ----- Customer Dashboard ----- */
const CustomerDashboard = () => (
  <div className="customer-dashboard">
    <div className="customer-header-container">
      <div>
        <h1 className="customer-title">Customer Shipper Portal &bull; Overview</h1>
        <p className="customer-subtitle">Request load deliveries, audit invoices, download BOL papers, and track active route paths.</p>
      </div>
      <button className="contact-support-btn">Contact Support</button>
    </div>
    <div className="stats-grid stats-5">
      <div className="stat-card"><div className="stat-title">ACTIVE TRANSITS</div><div className="stat-value">0</div><div className="stat-footer"><span className="footer-left">Live GPS tracking coordi...</span><span className="footer-right dark">1 in<br/>transit</span></div></div>
      <div className="stat-card"><div className="stat-title">COMPLETED RUNS</div><div className="stat-value">1</div><div className="stat-footer"><span className="footer-left">Signed POD manifests</span><span className="footer-right green">No issues</span></div></div>
      <div className="stat-card"><div className="stat-title">AWAITING MATCH</div><div className="stat-value">0</div><div className="stat-footer"><span className="footer-left">Dispatcher queue pe...</span><span className="footer-right grey">Awaiting<br/>carrier</span></div></div>
      <div className="stat-card"><div className="stat-title">LEDGER BALANCE DUE</div><div className="stat-value">$0</div><div className="stat-footer"><span className="footer-left">Invoices outstanding bills Net 30 terms</span></div></div>
      <div className="stat-card"><div className="stat-title">TOTAL LOADS SHIPPED</div><div className="stat-value">4</div><div className="stat-footer"><span className="footer-left">All-time lifetime booki...</span><span className="footer-right green">Lifetime<br/>total</span></div></div>
    </div>
    <div className="map-section">
      <h2 className="map-title">Live Shipment Path Progress</h2>
      <p className="map-subtitle">Google map tracking dashboard.</p>
      <div className="map-placeholder"><div className="map-dot"></div></div>
    </div>
  </div>
);

/* ----- Simple Placeholder Dashboard ----- */
const PlaceholderDashboard = ({ title, subtitle }) => (
  <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
    <div style={{ marginBottom: '32px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>{title}</h1>
      <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>{subtitle}</p>
    </div>
    <div style={{
      backgroundColor: '#fff', borderRadius: '12px', padding: '48px', textAlign: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px dashed #e2e8f0'
    }}>
      <h2 style={{ fontSize: '18px', color: '#64748b', marginBottom: '16px' }}>Dashboard Overview</h2>
      <p style={{ color: '#94a3b8' }}>Select a menu item from the sidebar to get started.</p>
    </div>
  </div>
);

/* ============================================================
   MAIN DASHBOARD COMPONENT - Routes to correct dashboard by role
   ============================================================ */
const Dashboard = ({ role }) => {
  switch (role) {
    case 'super-admin':
      return <SuperAdminDashboard />;
    case 'warehouse':
      return <WarehouseDashboard />;
    case 'yard':
      return <YardDashboard />;
    case 'accounts':
      return <AccountsDashboard />;
    case 'customer':
      return <CustomerDashboard />;
    case 'sales':
      return <PlaceholderDashboard title="Sales Dashboard" subtitle="Manage leads, pipeline, and sales reports." />;
    case 'company-admin':
      return <PlaceholderDashboard title="Command Centre" subtitle="Company administration and fleet management." />;
    case 'dispatcher':
      return <PlaceholderDashboard title="Command Center" subtitle="Dispatch operations and fleet monitoring." />;
    case 'driver':
      return <PlaceholderDashboard title="Driver Dashboard" subtitle="View jobs, expenses, and contact dispatch." />;
    default:
      return <PlaceholderDashboard title="Dashboard" subtitle="Welcome to the platform." />;
  }
};

export default Dashboard;
