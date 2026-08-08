import React, { useState } from 'react';
import { Search, DollarSign, Edit3, Check, Save, Download, Settings, RefreshCw, X, Shield, Building2, UserCheck, Plus, Sliders } from 'lucide-react';
import './WarehouseDashboard.css';

const MOCK_COMPANIES = [
  { id: 'COMP-01', name: 'Hero Logistics HQ' },
  { id: 'COMP-02', name: 'Hero Logistics Victoria' },
  { id: 'COMP-03', name: 'Hero Logistics NSW' },
  { id: 'COMP-04', name: 'Hero Logistics Queensland' }
];

const MOCK_CUSTOMERS = [
  { id: 'CUST-101', name: 'Toyota Australia', code: 'ACC-TYT-01' },
  { id: 'CUST-102', name: 'Global Retail Corp', code: 'ACC-GRC-02' },
  { id: 'CUST-103', name: 'Linfox Logistics', code: 'ACC-LFX-03' },
  { id: 'CUST-104', name: 'FastGoods LLC', code: 'ACC-FGL-04' },
  { id: 'CUST-105', name: 'DHL Supply Chain', code: 'ACC-DHL-05' },
  { id: 'CUST-106', name: 'Coca-Cola Amatil', code: 'ACC-CCA-06' }
];

const INITIAL_CUSTOMER_PRICING = [
  {
    id: 'PRC-101',
    companyName: 'Hero Logistics HQ',
    customerName: 'Toyota Australia',
    accountCode: 'ACC-TYT-01',
    pricingMode: 'By Kilometer', // 'By Load' | 'By Kilometer'
    baseRate: 3.85, // $ per KM or $ per Load
    minCharge: 450.00,
    fuelSurchargePct: 12.5,
    tollsIncluded: true,
    effectiveDate: '2026-01-01',
    status: 'ACTIVE'
  },
  {
    id: 'PRC-102',
    companyName: 'Hero Logistics Victoria',
    customerName: 'Global Retail Corp',
    accountCode: 'ACC-GRC-02',
    pricingMode: 'By Load',
    baseRate: 1250.00,
    minCharge: 800.00,
    fuelSurchargePct: 10.0,
    tollsIncluded: false,
    effectiveDate: '2026-02-15',
    status: 'ACTIVE'
  },
  {
    id: 'PRC-103',
    companyName: 'Hero Logistics HQ',
    customerName: 'Linfox Logistics',
    accountCode: 'ACC-LFX-03',
    pricingMode: 'By Kilometer',
    baseRate: 4.20,
    minCharge: 500.00,
    fuelSurchargePct: 14.0,
    tollsIncluded: true,
    effectiveDate: '2026-03-01',
    status: 'ACTIVE'
  },
  {
    id: 'PRC-104',
    companyName: 'Hero Logistics NSW',
    customerName: 'FastGoods LLC',
    accountCode: 'ACC-FGL-04',
    pricingMode: 'By Load',
    baseRate: 950.00,
    minCharge: 600.00,
    fuelSurchargePct: 8.5,
    tollsIncluded: false,
    effectiveDate: '2026-01-10',
    status: 'ACTIVE'
  },
  {
    id: 'PRC-105',
    companyName: 'Hero Logistics HQ',
    customerName: 'DHL Supply Chain',
    accountCode: 'ACC-DHL-05',
    pricingMode: 'By Kilometer',
    baseRate: 3.95,
    minCharge: 480.00,
    fuelSurchargePct: 11.0,
    tollsIncluded: true,
    effectiveDate: '2026-04-01',
    status: 'ACTIVE'
  }
];

export default function CustomerPricing() {
  const [pricingList, setPricingList] = useState(INITIAL_CUSTOMER_PRICING);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // For Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Top Form Quick Selection State
  const [selectedCompany, setSelectedCompany] = useState('Hero Logistics HQ');
  const [selectedCustomer, setSelectedCustomer] = useState('Toyota Australia');
  const [topPricingMode, setTopPricingMode] = useState('By Kilometer');
  const [topBaseRate, setTopBaseRate] = useState('3.85');
  const [topMinCharge, setTopMinCharge] = useState('450.00');
  const [topFuelPct, setTopFuelPct] = useState('12.5');

  // Form State inside Edit Modal
  const [editForm, setEditForm] = useState({
    companyName: '',
    customerName: '',
    pricingMode: 'By Load',
    baseRate: '',
    minCharge: '',
    fuelSurchargePct: '',
    tollsIncluded: true
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Handler when Customer is selected in top dropdown
  const handleCustomerSelectChange = (custName) => {
    setSelectedCustomer(custName);
    const existing = pricingList.find(p => p.customerName === custName);
    if (existing) {
      setSelectedCompany(existing.companyName);
      setTopPricingMode(existing.pricingMode);
      setTopBaseRate(existing.baseRate.toString());
      setTopMinCharge(existing.minCharge.toString());
      setTopFuelPct(existing.fuelSurchargePct.toString());
    }
  };

  // Quick Top Save/Update Handler
  const handleTopSaveUpdate = (e) => {
    if (e) e.preventDefault();
    if (!selectedCustomer) {
      alert('Please select a Customer!');
      return;
    }

    const existingIndex = pricingList.findIndex(p => p.customerName === selectedCustomer);
    const custObj = MOCK_CUSTOMERS.find(c => c.name === selectedCustomer);
    const code = custObj ? custObj.code : `ACC-${selectedCustomer.slice(0, 3).toUpperCase()}-99`;

    if (existingIndex >= 0) {
      // Update existing
      const updated = [...pricingList];
      updated[existingIndex] = {
        ...updated[existingIndex],
        companyName: selectedCompany,
        pricingMode: topPricingMode,
        baseRate: parseFloat(topBaseRate) || 0,
        minCharge: parseFloat(topMinCharge) || 0,
        fuelSurchargePct: parseFloat(topFuelPct) || 0
      };
      setPricingList(updated);
      showToast(`Updated pricing rule for ${selectedCustomer} (${topPricingMode} - $${topBaseRate}).`);
    } else {
      // Add new pricing rule
      const newRule = {
        id: `PRC-${Date.now()}`,
        companyName: selectedCompany,
        customerName: selectedCustomer,
        accountCode: code,
        pricingMode: topPricingMode,
        baseRate: parseFloat(topBaseRate) || 0,
        minCharge: parseFloat(topMinCharge) || 0,
        fuelSurchargePct: parseFloat(topFuelPct) || 0,
        tollsIncluded: true,
        effectiveDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE'
      };
      setPricingList([newRule, ...pricingList]);
      showToast(`Saved new pricing rule for ${selectedCustomer} (${topPricingMode}).`);
    }
  };

  const handleOpenEditModal = (item) => {
    setSelectedItem(item);
    setEditForm({
      companyName: item.companyName,
      customerName: item.customerName,
      pricingMode: item.pricingMode,
      baseRate: item.baseRate.toString(),
      minCharge: item.minCharge.toString(),
      fuelSurchargePct: item.fuelSurchargePct.toString(),
      tollsIncluded: item.tollsIncluded
    });
    setIsEditModalOpen(true);
  };

  const handleSaveModalPricing = (e) => {
    if (e) e.preventDefault();
    if (!selectedItem) return;

    const updatedList = pricingList.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          companyName: editForm.companyName,
          customerName: editForm.customerName,
          pricingMode: editForm.pricingMode,
          baseRate: parseFloat(editForm.baseRate) || item.baseRate,
          minCharge: parseFloat(editForm.minCharge) || item.minCharge,
          fuelSurchargePct: parseFloat(editForm.fuelSurchargePct) || item.fuelSurchargePct,
          tollsIncluded: editForm.tollsIncluded
        };
      }
      return item;
    });

    setPricingList(updatedList);
    setIsEditModalOpen(false);
    showToast(`Updated pricing rule for ${editForm.customerName} (${editForm.pricingMode}).`);
  };

  const handleExportCSV = () => {
    const headers = ['Account Code', 'Company Name', 'Customer Name', 'Pricing Mode', 'Base Rate ($)', 'Min Charge ($)', 'Fuel Surcharge (%)', 'Tolls Included'];
    const rows = pricingList.map(item => [
      item.accountCode,
      item.companyName,
      item.customerName,
      item.pricingMode,
      item.baseRate,
      item.minCharge,
      `${item.fuelSurchargePct}%`,
      item.tollsIncluded ? 'YES' : 'NO'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customer_pricing_matrix.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Customer pricing matrix exported to CSV.');
  };

  const filteredPricing = pricingList.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    return !q || 
      item.customerName.toLowerCase().includes(q) || 
      item.companyName.toLowerCase().includes(q) ||
      item.accountCode.toLowerCase().includes(q) ||
      item.pricingMode.toLowerCase().includes(q);
  });

  return (
    <div style={S.container}>
      {/* Page Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.pageTitle}>Customer Pricing Management</h1>
          <p style={S.pageSubtitle}>Configure company &amp; customer-wise freight pricing modes (By Load vs By Kilometer), base amounts, and surcharges.</p>
        </div>

        <button onClick={handleExportCSV} style={S.btnExport}>
          <Download size={15} />
          <span>Export Pricing Matrix</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statLabel}>CONFIGURED CUSTOMERS</span>
          <span style={S.statValue}>{pricingList.length}</span>
          <span style={S.statSub}>Active client companies</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statLabel}>BY LOAD PRICING</span>
          <span style={S.statValue}>{pricingList.filter(p => p.pricingMode === 'By Load').length}</span>
          <span style={S.statSub}>Flat load rates</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statLabel}>BY KILOMETER PRICING</span>
          <span style={S.statValue}>{pricingList.filter(p => p.pricingMode === 'By Kilometer').length}</span>
          <span style={S.statSub}>Distance-based rates</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statLabel}>AVG DISTANCE RATE</span>
          <span style={S.statValue}>$4.00/km</span>
          <span style={S.statSub}>Per kilometer avg</span>
        </div>
      </div>

      {/* Quick Configure & Edit Section Card */}
      <div style={S.configureCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <Sliders size={18} style={{ color: 'var(--primary-color)' }} />
          <h2 style={{ fontSize: 16, fontWeight: '800', color: '#0f172a', margin: 0 }}>
            Configure &amp; Edit Customer Pricing Rule
          </h2>
        </div>

        <form onSubmit={handleTopSaveUpdate} style={S.configForm}>
          {/* Row 1: Company & Customer Selectors */}
          <div style={S.configRow}>
            <div style={S.fieldCol}>
              <label style={S.label}>1. SELECT COMPANY</label>
              <select
                value={selectedCompany}
                onChange={e => setSelectedCompany(e.target.value)}
                style={S.selectInput}
              >
                {MOCK_COMPANIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={S.fieldCol}>
              <label style={S.label}>2. SELECT CUSTOMER</label>
              <select
                value={selectedCustomer}
                onChange={e => handleCustomerSelectChange(e.target.value)}
                style={S.selectInput}
              >
                {MOCK_CUSTOMERS.map(c => (
                  <option key={c.id} value={c.name}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Pricing Type Segment & Rates */}
          <div style={S.configRow}>
            <div style={S.fieldCol}>
              <label style={S.label}>3. PRICING TYPE</label>
              <div style={S.segmentedRow}>
                <button
                  type="button"
                  onClick={() => setTopPricingMode('By Load')}
                  style={{
                    ...S.segmentedBtn,
                    backgroundColor: topPricingMode === 'By Load' ? 'var(--primary-color)' : '#ffffff',
                    color: topPricingMode === 'By Load' ? '#0f172a' : '#64748b',
                    border: topPricingMode === 'By Load' ? '1.5px solid #000000' : '1px solid #cbd5e1'
                  }}
                >
                  📦 By Load (Flat Rate)
                </button>
                <button
                  type="button"
                  onClick={() => setTopPricingMode('By Kilometer')}
                  style={{
                    ...S.segmentedBtn,
                    backgroundColor: topPricingMode === 'By Kilometer' ? 'var(--primary-color)' : '#ffffff',
                    color: topPricingMode === 'By Kilometer' ? '#0f172a' : '#64748b',
                    border: topPricingMode === 'By Kilometer' ? '1.5px solid #000000' : '1px solid #cbd5e1'
                  }}
                >
                  🗺️ By Kilometer (Per KM)
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, flex: 2 }}>
              <div>
                <label style={S.label}>{topPricingMode === 'By Load' ? 'RATE / LOAD ($)' : 'RATE / KM ($)'}</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Rate amount"
                  value={topBaseRate}
                  onChange={e => setTopBaseRate(e.target.value)}
                  style={S.input}
                  required
                />
              </div>

              <div>
                <label style={S.label}>MIN CHARGE ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Min charge"
                  value={topMinCharge}
                  onChange={e => setTopMinCharge(e.target.value)}
                  style={S.input}
                  required
                />
              </div>

              <div>
                <label style={S.label}>FUEL SURCHARGE (%)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Fuel %"
                  value={topFuelPct}
                  onChange={e => setTopFuelPct(e.target.value)}
                  style={S.input}
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="submit" style={S.btnSaveTop}>
              <Save size={16} />
              <span>Save / Update Customer Pricing</span>
            </button>
          </div>
        </form>
      </div>

      {/* Main Table Card */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div>
            <h2 style={S.cardTitle}>Customer Pricing Matrix Table</h2>
            <p style={S.cardSubtitle}>List of all company and customer pricing rules used by Booking Summary.</p>
          </div>

          {/* Search Box */}
          <div style={S.searchWrapper}>
            <Search size={16} style={S.searchIcon} />
            <input
              type="text"
              placeholder="Search customer, company, pricing mode..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={S.searchInput}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={S.clearBtn}>
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Pricing Data Grid Table */}
        <div style={S.tableContainer}>
          <table style={S.table}>
            <thead style={S.thead}>
              <tr>
                <th style={S.th}>ACCOUNT CODE</th>
                <th style={S.th}>COMPANY NAME</th>
                <th style={S.th}>CUSTOMER NAME</th>
                <th style={S.th}>PRICING TYPE</th>
                <th style={S.th}>BASE AMOUNT</th>
                <th style={S.th}>MIN CHARGE</th>
                <th style={S.th}>FUEL SURCHARGE</th>
                <th style={S.th}>TOLLS</th>
                <th style={{ ...S.th, textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredPricing.length === 0 ? (
                <tr>
                  <td colSpan="9" style={S.emptyTd}>
                    No customer pricing records found matching "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredPricing.map((row) => (
                  <tr key={row.id} style={S.tr}>
                    <td style={{ ...S.td, ...S.tdMono }}>{row.accountCode}</td>
                    <td style={{ ...S.td, color: '#475569', fontWeight: '600' }}>{row.companyName}</td>
                    <td style={{ ...S.td, fontWeight: '800', color: '#0f172a' }}>{row.customerName}</td>
                    <td style={S.td}>
                      <span style={{
                        ...S.modeBadge,
                        backgroundColor: row.pricingMode === 'By Load' ? '#eff6ff' : '#f0fdf4',
                        color: row.pricingMode === 'By Load' ? '#2563eb' : '#16a34a',
                        borderColor: row.pricingMode === 'By Load' ? '#bfdbfe' : '#bbf7d0'
                      }}>
                        {row.pricingMode === 'By Load' ? '📦 By Load (Flat)' : '🗺️ By Kilometer'}
                      </span>
                    </td>
                    <td style={{ ...S.td, fontWeight: '800', color: '#0f172a' }}>
                      {row.pricingMode === 'By Load' 
                        ? `$${row.baseRate.toFixed(2)} / load`
                        : `$${row.baseRate.toFixed(2)} / KM`
                      }
                    </td>
                    <td style={{ ...S.td, color: '#475569', fontWeight: '600' }}>
                      ${row.minCharge.toFixed(2)}
                    </td>
                    <td style={{ ...S.td, color: '#b45309', fontWeight: '700' }}>
                      +{row.fuelSurchargePct}%
                    </td>
                    <td style={S.td}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: row.tollsIncluded ? '#047857' : '#64748b',
                        backgroundColor: row.tollsIncluded ? '#ecfdf5' : '#f1f5f9',
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}>
                        {row.tollsIncluded ? '✓ Included' : 'Separate'}
                      </span>
                    </td>
                    <td style={{ ...S.td, textAlign: 'center' }}>
                      <button
                        onClick={() => handleOpenEditModal(row)}
                        style={S.btnEditPricing}
                      >
                        <Edit3 size={13} />
                        <span>Edit Pricing</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Customer Pricing Modal */}
      {isEditModalOpen && selectedItem && (
        <div style={S.modalOverlay} onClick={() => setIsEditModalOpen(false)}>
          <div style={S.modalContent} onClick={e => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <div>
                <h3 style={S.modalTitle}>Edit Customer Pricing — {selectedItem.customerName}</h3>
                <span style={S.modalSub}>{selectedItem.accountCode} &bull; {selectedItem.companyName}</span>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} style={S.modalCloseBtn}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModalPricing} style={S.modalBody}>
              {/* Company & Customer Selectors */}
              <div style={S.grid2}>
                <div>
                  <label style={S.label}>COMPANY NAME</label>
                  <select
                    value={editForm.companyName}
                    onChange={e => setEditForm({ ...editForm, companyName: e.target.value })}
                    style={S.selectInput}
                  >
                    {MOCK_COMPANIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={S.label}>CUSTOMER NAME</label>
                  <select
                    value={editForm.customerName}
                    onChange={e => setEditForm({ ...editForm, customerName: e.target.value })}
                    style={S.selectInput}
                  >
                    {MOCK_CUSTOMERS.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing Mode Selector */}
              <label style={S.label}>PRICING TYPE</label>
              <div style={S.segmentedRow}>
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, pricingMode: 'By Load' })}
                  style={{
                    ...S.segmentedBtn,
                    backgroundColor: editForm.pricingMode === 'By Load' ? 'var(--primary-color)' : '#ffffff',
                    color: editForm.pricingMode === 'By Load' ? '#0f172a' : '#64748b',
                    border: editForm.pricingMode === 'By Load' ? '1.5px solid #000000' : '1px solid #cbd5e1'
                  }}
                >
                  📦 By Load (Flat Rate)
                </button>
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, pricingMode: 'By Kilometer' })}
                  style={{
                    ...S.segmentedBtn,
                    backgroundColor: editForm.pricingMode === 'By Kilometer' ? 'var(--primary-color)' : '#ffffff',
                    color: editForm.pricingMode === 'By Kilometer' ? '#0f172a' : '#64748b',
                    border: editForm.pricingMode === 'By Kilometer' ? '1.5px solid #000000' : '1px solid #cbd5e1'
                  }}
                >
                  🗺️ By Kilometer (Per KM)
                </button>
              </div>

              {/* Base Rate & Minimum Charge */}
              <div style={S.grid2}>
                <div>
                  <label style={S.label}>
                    {editForm.pricingMode === 'By Load' ? 'BASE AMOUNT PER LOAD ($)' : 'BASE AMOUNT PER KM ($)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder={editForm.pricingMode === 'By Load' ? 'e.g. 1250.00' : 'e.g. 3.85'}
                    value={editForm.baseRate}
                    onChange={e => setEditForm({ ...editForm, baseRate: e.target.value })}
                    style={S.input}
                    required
                  />
                </div>
                <div>
                  <label style={S.label}>MINIMUM LOAD CHARGE ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 450.00"
                    value={editForm.minCharge}
                    onChange={e => setEditForm({ ...editForm, minCharge: e.target.value })}
                    style={S.input}
                    required
                  />
                </div>
              </div>

              {/* Fuel Surcharge & Toll Policy */}
              <div style={S.grid2}>
                <div>
                  <label style={S.label}>FUEL SURCHARGE (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 12.5"
                    value={editForm.fuelSurchargePct}
                    onChange={e => setEditForm({ ...editForm, fuelSurchargePct: e.target.value })}
                    style={S.input}
                  />
                </div>
                <div>
                  <label style={S.label}>TOLL FEES POLICY</label>
                  <label style={S.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={editForm.tollsIncluded}
                      onChange={e => setEditForm({ ...editForm, tollsIncluded: e.target.checked })}
                      style={S.checkbox}
                    />
                    <span>Include toll fees in base rate</span>
                  </label>
                </div>
              </div>

              <div style={S.infoBox}>
                ℹ️ Booking Summary will automatically use these rates to calculate estimated fares when bookings are created for {editForm.customerName}.
              </div>

              {/* Save Button */}
              <button type="submit" style={S.btnSaveModal}>
                <Save size={16} />
                <span>Save / Update Customer Pricing</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div style={S.toastContainer}>
          <div style={S.toastIcon}>✓</div>
          <span style={S.toastText}>{toast}</span>
          <button onClick={() => setToast(null)} style={S.toastCloseBtn}>✕</button>
        </div>
      )}
    </div>
  );
}

/* ─── Styles Object ─── */
const S = {
  container: {
    padding: '24px 32px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif",
    textAlign: 'left'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 16
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 8px 0'
  },
  pageSubtitle: {
    fontSize: 13.5,
    color: '#64748b',
    margin: 0
  },
  btnExport: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: 12,
    padding: '10px 18px',
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 16,
    marginBottom: 24
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: '20px 24px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '0.8px',
    marginBottom: 12
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6
  },
  statSub: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600'
  },
  configureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    border: '1.5px solid #cbd5e1',
    padding: '24px 28px',
    marginBottom: 24,
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
  },
  configForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  configRow: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap'
  },
  fieldCol: {
    flex: 1,
    minWidth: 220
  },
  selectInput: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 12,
    border: '1.5px solid #cbd5e1',
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    backgroundColor: '#ffffff',
    outline: 'none',
    marginTop: 6
  },
  btnSaveTop: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'var(--primary-color)',
    color: '#0f172a',
    border: 'none',
    borderRadius: 12,
    padding: '12px 24px',
    fontSize: 13,
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(255, 212, 0, 0.25)'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    border: '1px solid #e2e8f0',
    padding: '28px 32px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 16
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 4px 0'
  },
  cardSubtitle: {
    fontSize: 12.5,
    color: '#64748b',
    margin: 0
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    color: '#94a3b8'
  },
  searchInput: {
    padding: '9px 36px 9px 36px',
    borderRadius: 12,
    border: '1px solid #cbd5e1',
    fontSize: 12.5,
    width: 280,
    outline: 'none',
    color: '#0f172a',
    backgroundColor: '#ffffff'
  },
  clearBtn: {
    position: 'absolute',
    right: 10,
    background: '#f1f5f9',
    border: 'none',
    borderRadius: '50%',
    width: 18,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748b'
  },
  tableContainer: {
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13
  },
  thead: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0'
  },
  th: {
    padding: '14px 20px',
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '0.8px',
    textAlign: 'left',
    whiteSpace: 'nowrap'
  },
  tr: {
    borderBottom: '1px solid #f1f5f9'
  },
  td: {
    padding: '16px 20px',
    whiteSpace: 'nowrap'
  },
  tdMono: {
    fontFamily: 'monospace',
    fontWeight: '800',
    color: '#4f46e5'
  },
  emptyTd: {
    padding: 32,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700'
  },
  modeBadge: {
    fontSize: 11,
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: 20,
    border: '1px solid'
  },
  btnEditPricing: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    border: '1.5px solid #cbd5e1',
    borderRadius: 10,
    padding: '6px 14px',
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0f172a',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
  },
  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    padding: 20
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 540,
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
    overflow: 'hidden'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 28px 16px 28px',
    borderBottom: '1px solid #f1f5f9'
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 4px 0'
  },
  modalSub: {
    fontSize: 11.5,
    color: '#64748b',
    fontWeight: '600'
  },
  modalCloseBtn: {
    background: '#f1f5f9',
    border: 'none',
    borderRadius: '50%',
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748b'
  },
  modalBody: {
    padding: 28,
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  label: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '0.5px'
  },
  segmentedRow: {
    display: 'flex',
    gap: 10,
    marginTop: 6
  },
  segmentedBtn: {
    flex: 1,
    padding: '11px 14px',
    borderRadius: 12,
    fontSize: 12.5,
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.15s'
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 12,
    border: '1.5px solid #cbd5e1',
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    outline: 'none',
    marginTop: 6,
    boxSizing: 'border-box'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
    cursor: 'pointer',
    marginTop: 14
  },
  checkbox: {
    width: 16,
    height: 16,
    accentColor: '#3b82f6',
    cursor: 'pointer'
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: 12,
    padding: '12px 16px',
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '500',
    lineHeight: '1.4'
  },
  btnSaveModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'var(--primary-color)',
    color: '#0f172a',
    border: 'none',
    borderRadius: 14,
    padding: '14px 20px',
    fontSize: 13.5,
    fontWeight: '800',
    cursor: 'pointer',
    marginTop: 8,
    boxShadow: '0 4px 14px rgba(255, 212, 0, 0.3)'
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
    gap: 10,
    zIndex: 10000,
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)'
  },
  toastIcon: {
    color: '#10b981',
    fontSize: 18,
    fontWeight: 'bold'
  },
  toastText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#065f46'
  },
  toastCloseBtn: {
    background: 'none',
    border: 'none',
    fontSize: 16,
    color: '#64748b',
    cursor: 'pointer'
  }
};
