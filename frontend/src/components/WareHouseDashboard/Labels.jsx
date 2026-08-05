import React, { useState } from 'react';
import { Settings, X, Search, FileText, Printer, Eye, Download, Info, History } from 'lucide-react';

export default function Labels({
  logisticsMode,
  setLogisticsMode,
  onBarcodeSimulatorClick,
  onManualEntryClick,
  onExportStockClick,
  triggerToast
}) {
  const [density, setDensity] = useState('compact');
  const [colsMenuOpen, setColsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected rows
  const [selectedRows, setSelectedRows] = useState([]);

  // Preview modal state
  const [previewLabel, setPreviewLabel] = useState(null);

  // Details modal state
  const [detailsLabel, setDetailsLabel] = useState(null);

  // Column visibility
  const [visibleCols, setVisibleCols] = useState({
    labelId: true,
    barcode: true,
    vinItemNo: true,
    stockNo: true,
    customer: true,
    assetType: true,
    location: true,
    generated: true,
    printStatus: true,
    actions: true
  });

  // Mock Labels Data representing the rows from Image 13
  const [labels, setLabels] = useState([
    {
      id: 'LBL-100',
      barcode: 'VIN-7YV1HP82A81920',
      vin: 'VIN-7YV1HP82A81920',
      stockNo: 'STK-4401',
      customer: 'Toyota Australia',
      assetType: 'Vehicle',
      location: 'Bay 3',
      generated: '7/14/2026',
      status: 'PRINTED'
    },
    {
      id: 'LBL-101',
      barcode: 'VIN-3YV1HP52X81254',
      vin: 'VIN-3YV1HP52X81254',
      stockNo: 'STK-4402',
      customer: 'NSW Fleet Services',
      assetType: 'Vehicle',
      location: 'Holding Area B',
      generated: '7/14/2026',
      status: 'PENDING'
    },
    {
      id: 'LBL-102',
      barcode: 'VIN-5YV1HP12283951',
      vin: 'VIN-5YV1HP12283951',
      stockNo: 'STK-4403',
      customer: 'Express Auto',
      assetType: 'Vehicle',
      location: 'Bay 1',
      generated: '7/14/2026',
      status: 'FAILED'
    },
    {
      id: 'LBL-103',
      barcode: 'VIN-8ZV9HK21W92110',
      vin: 'VIN-8ZV9HK21W92110',
      stockNo: 'STK-4404',
      customer: 'Hertz Rental WA',
      assetType: 'Vehicle',
      location: 'Holding Area A',
      generated: '7/14/2026',
      status: 'REPRINTED'
    }
  ]);

  // Dynamic calculations for summary cards
  const totalLabels = labels.length;
  const printedCount = labels.filter(l => l.status === 'PRINTED').length;
  const pendingCount = labels.filter(l => l.status === 'PENDING').length;
  const failedCount = labels.filter(l => l.status === 'FAILED').length;
  const reprintedCount = labels.filter(l => l.status === 'REPRINTED').length;

  const handlePrint = (id) => {
    setLabels(labels.map(l => l.id === id ? { ...l, status: 'PRINTED' } : l));
    if (triggerToast) triggerToast(`Label ${id} spooled to Zebra queue successfully.`);
  };

  const handleReprint = (id) => {
    setLabels(labels.map(l => l.id === id ? { ...l, status: 'REPRINTED' } : l));
    if (triggerToast) triggerToast(`Reprint request sent for Label ${id}.`);
  };

  const handlePrintAllPending = () => {
    setLabels(labels.map(l => l.status === 'PENDING' ? { ...l, status: 'PRINTED' } : l));
    if (triggerToast) triggerToast('All pending tags processed into print spooler.');
  };

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(r => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleAllSelect = () => {
    if (selectedRows.length === labels.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(labels.map(l => l.id));
    }
  };

  const filteredLabels = labels.filter(l =>
    l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.stockNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPaddingClass = (mode) => {
    if (mode === 'compact') return 'py-1 px-4';
    if (mode === 'relaxed') return 'py-4 px-4';
    return 'py-2.5 px-4'; // default
  };

  return (
    <div className="space-y-6">
      {/* Header with Switcher & Operations */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 capitalize">Warehouse & Yard Workspace</h2>
          <p className="text-xs text-slate-500 font-medium">Manage stock allocations, print asset tags, and spot load lanes.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Logistics Toggle */}
          <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs font-bold">
            <button
              onClick={() => setLogisticsMode('car_carrying')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${logisticsMode === 'car_carrying' ? 'bg-[#FFD400] text-slate-955 font-extrabold shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Car Carrying Yard
            </button>
            <button
              onClick={() => setLogisticsMode('general_freight')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${logisticsMode === 'general_freight' ? 'bg-[#FFD400] text-slate-955 font-extrabold shadow-xs' : 'text-slate-500'}`}
            >
              General Freight
            </button>
          </div>

          <button
            onClick={onBarcodeSimulatorClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-xs select-none focus:outline-none"
          >
            <span>Barcode Simulator</span>
          </button>

          <button
            onClick={onManualEntryClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-xs select-none focus:outline-none"
          >
            <span>Manual Entry</span>
          </button>

          <button
            onClick={onExportStockClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black bg-gradient-to-r from-[#FFD400] to-[#FF9A00] text-slate-950 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-md select-none hover:shadow-lg focus:outline-none"
          >
            <span>Export Stock List</span>
          </button>
        </div>
      </div>

      {/* KPI 5-Card metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-left">
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Labels</span>
          <strong className="text-2xl font-black text-slate-900 block mt-1">{totalLabels}</strong>
          <span className="text-[10px] text-slate-400 font-medium block mt-1">Generated tags</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Printed Labels</span>
          <strong className="text-2xl font-black text-slate-900 block mt-1">{printedCount}</strong>
          <span className="text-[10px] text-slate-400 font-medium block mt-1">Successfully spooled</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pending Labels</span>
          <strong className="text-2xl font-black text-slate-900 block mt-1">{pendingCount}</strong>
          <span className="text-[10px] text-slate-400 font-medium block mt-1">In print queue</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Failed Labels</span>
          <strong className="text-2xl font-black text-slate-900 block mt-1">{failedCount}</strong>
          <span className="text-[10px] text-slate-400 font-medium block mt-1">Printer errors</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Reprinted Labels</span>
          <strong className="text-2xl font-black text-slate-900 block mt-1">{reprintedCount}</strong>
          <span className="text-[10px] text-slate-400 font-medium block mt-1">Duplicate tags</span>
        </div>
      </div>

      {/* Main Label Management Card Container */}
      <div className="glass rounded-2xl p-5 border border-slate-200 bg-white text-left space-y-4 shadow-xs">

        {/* Table top header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Label Management</h3>
            <p className="text-xs text-slate-400 mt-1">Manage and track generated asset barcode tags.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search label */}
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="Search VIN, Item No, Barcode, C..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl focus:border-[#f59e0b] focus:outline-none transition-all duration-200"
              />
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Search className="h-3.5 w-3.5" />
              </span>
            </div>

            <button
              onClick={handlePrintAllPending}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-[#FFD400] hover:bg-[#FF9A00] text-slate-955 text-xs font-black rounded-xl transition-all cursor-pointer shadow-xs select-none active:scale-[0.98]"
            >
              Print All Pending
            </button>
          </div>
        </div>

        {/* Table density and column filters control row */}
        <div className="flex justify-end items-center gap-3 relative">

          {/* Density selection */}
          <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-[9px] font-bold">
            {['COMPACT', 'DEFAULT', 'RELAXED'].map((mode) => {
              const isActive = density === mode.toLowerCase();
              return (
                <button
                  key={mode}
                  onClick={() => setDensity(mode.toLowerCase())}
                  className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer ${isActive ? 'bg-[#FFD400] text-slate-950 font-extrabold shadow-xs' : 'text-slate-500'}`}
                >
                  {mode}
                </button>
              );
            })}
          </div>

          {/* Columns button */}
          <button
            onClick={() => setColsMenuOpen(!colsMenuOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-655 font-bold text-[9px] uppercase rounded-xl cursor-pointer focus:outline-none animate-fade-in"
          >
            <Settings className="h-3.5 w-3.5 text-slate-400" />
            <span>Columns</span>
          </button>

          {/* Columns checkbox dropdown popover */}
          {colsMenuOpen && (
            <div className="absolute right-0 top-full mt-2 z-20 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 text-slate-800 animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Column Visibility</span>
                <button onClick={() => setColsMenuOpen(false)} className="text-slate-400">
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-1.5">
                {Object.keys(visibleCols).map((key) => (
                  <label key={key} className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold select-none capitalize">
                    <input
                      type="checkbox"
                      checked={visibleCols[key]}
                      onChange={() => setVisibleCols({ ...visibleCols, [key]: !visibleCols[key] })}
                      className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Labels Table */}
        <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === labels.length && labels.length > 0}
                    onChange={handleAllSelect}
                    className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                  />
                </th>
                {visibleCols.labelId && <th className="px-4 py-4 font-extrabold">Label ID</th>}
                {visibleCols.barcode && <th className="px-4 py-4 font-extrabold">Barcode / QR</th>}
                {visibleCols.vinItemNo && <th className="px-4 py-4 font-extrabold">VIN / Item No</th>}
                {visibleCols.stockNo && <th className="px-4 py-4 font-extrabold">Stock No</th>}
                {visibleCols.customer && <th className="px-4 py-4 font-extrabold">Customer</th>}
                {visibleCols.assetType && <th className="px-4 py-4 font-extrabold">Asset Type</th>}
                {visibleCols.location && <th className="px-4 py-4 font-extrabold">Location</th>}
                {visibleCols.generated && <th className="px-4 py-4 font-extrabold">Generated</th>}
                {visibleCols.printStatus && <th className="px-4 py-4 font-extrabold">Print Status</th>}
                {visibleCols.actions && <th className="px-4 py-4 font-extrabold text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredLabels.map((row) => {
                const isChecked = selectedRows.includes(row.id);
                return (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 text-center whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleRowSelect(row.id)}
                        className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                      />
                    </td>
                    {visibleCols.labelId && (
                      <td className={`font-semibold text-slate-900 whitespace-nowrap ${getPaddingClass(density)}`}>
                        {row.id}
                      </td>
                    )}
                    {visibleCols.barcode && (
                      <td className={`font-mono text-slate-500 whitespace-nowrap ${getPaddingClass(density)}`}>
                        {row.barcode}
                      </td>
                    )}
                    {visibleCols.vinItemNo && (
                      <td className={`font-mono text-[#f59e0b] font-bold whitespace-nowrap ${getPaddingClass(density)}`}>
                        {row.vin}
                      </td>
                    )}
                    {visibleCols.stockNo && (
                      <td className={`font-mono text-slate-655 font-semibold whitespace-nowrap ${getPaddingClass(density)}`}>
                        {row.stockNo}
                      </td>
                    )}
                    {visibleCols.customer && (
                      <td className={`font-semibold text-slate-800 whitespace-nowrap ${getPaddingClass(density)}`}>
                        {row.customer}
                      </td>
                    )}
                    {visibleCols.assetType && (
                      <td className={`text-slate-500 whitespace-nowrap ${getPaddingClass(density)}`}>
                        {row.assetType}
                      </td>
                    )}
                    {visibleCols.location && (
                      <td className={`whitespace-nowrap ${getPaddingClass(density)}`}>
                        <span className="inline-flex px-2 py-0.5 text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md">
                          {row.location}
                        </span>
                      </td>
                    )}
                    {visibleCols.generated && (
                      <td className={`text-slate-500 whitespace-nowrap ${getPaddingClass(density)}`}>
                        {row.generated}
                      </td>
                    )}
                    {visibleCols.printStatus && (
                      <td className={`whitespace-nowrap ${getPaddingClass(density)}`}>
                        <span className={`inline-flex px-2 py-0.5 text-[9px] font-black rounded-lg border uppercase ${row.status === 'PRINTED' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                            row.status === 'PENDING' ? 'bg-amber-50 text-amber-500 border-amber-250/50' :
                              row.status === 'FAILED' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                                'bg-slate-50 text-slate-500 border-slate-200' // Reprinted
                          }`}>
                          {row.status}
                        </span>
                      </td>
                    )}
                    {visibleCols.actions && (
                      <td className={`whitespace-nowrap ${getPaddingClass(density)}`}>
                        <div className="grid grid-cols-3 gap-1.5 w-72 mx-auto">
                          <button
                            onClick={() => handlePrint(row.id)}
                            className="inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition-all hover:scale-[1.02] cursor-pointer"
                          >
                            <Printer className="h-3 w-3 text-slate-400" />
                            <span>Print</span>
                          </button>

                          <button
                            onClick={() => handleReprint(row.id)}
                            className="inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-white hover:bg-slate-50 border border-[#f59e0b]/45 text-[#f59e0b] text-[10px] font-bold rounded-lg transition-all hover:scale-[1.02] cursor-pointer"
                          >
                            <span>Reprint</span>
                          </button>

                          <button
                            onClick={() => setPreviewLabel(row)}
                            className="inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-white hover:bg-slate-50 border border-[#f59e0b]/45 text-[#f59e0b] text-[10px] font-bold rounded-lg transition-all hover:scale-[1.02] cursor-pointer"
                          >
                            <Eye className="h-3 w-3 text-[#f59e0b]/80" />
                            <span>Preview</span>
                          </button>

                          <button
                            onClick={() => {
                              if (triggerToast) triggerToast(`Mock PDF tag document generated for ${row.id}`);
                            }}
                            className="inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-white hover:bg-slate-50 border border-[#f59e0b]/45 text-[#f59e0b] text-[10px] font-bold rounded-lg transition-all hover:scale-[1.02] cursor-pointer"
                          >
                            <Download className="h-3 w-3 text-[#f59e0b]/80" />
                            <span>PDF</span>
                          </button>

                          <button
                            onClick={() => setDetailsLabel(row)}
                            className="inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-white hover:bg-slate-50 border border-[#f59e0b]/45 text-[#f59e0b] text-[10px] font-bold rounded-lg transition-all hover:scale-[1.02] cursor-pointer"
                          >
                            <Info className="h-3 w-3 text-[#f59e0b]/80" />
                            <span>Details</span>
                          </button>

                          <button
                            onClick={() => {
                              if (triggerToast) triggerToast(`Audit log history fetched for label ${row.id}`);
                            }}
                            className="inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-white hover:bg-slate-50 border border-[#f59e0b]/45 text-[#f59e0b] text-[10px] font-bold rounded-lg transition-all hover:scale-[1.02] cursor-pointer"
                          >
                            <History className="h-3 w-3 text-[#f59e0b]/80" />
                            <span>History</span>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Zebra Label Barcode Preview Dialog Modal */}
      {previewLabel && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 text-left relative shadow-2xl animate-scale-up space-y-4">
            <button
              onClick={() => setPreviewLabel(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center pb-2 border-b border-slate-100">
              <strong className="text-sm font-black text-slate-900 uppercase tracking-wider">Zebra Barcode Preview</strong>
              <p className="text-[10px] text-slate-400 mt-0.5">Asset tag generated on {previewLabel.generated}</p>
            </div>

            {/* Mock Zebra Physical Barcode Sticker */}
            <div className="p-5 border-2 border-dashed border-slate-400 bg-amber-50/20 rounded-xl space-y-4 flex flex-col items-center">
              {/* Fake barcode lines */}
              <div className="w-full flex justify-between h-14 bg-white border border-slate-200 p-2.5 items-stretch">
                {[2, 4, 1, 3, 2, 5, 1, 4, 2, 3, 1, 5, 2, 4, 1, 2, 3, 1, 4, 2].map((w, idx) => (
                  <div key={idx} className="bg-slate-950 rounded-xs" style={{ width: `${w}px` }}></div>
                ))}
              </div>
              <strong className="text-xs font-mono tracking-[0.25em] text-slate-900">{previewLabel.barcode}</strong>

              <div className="w-full grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-slate-200/60 font-semibold text-slate-700">
                <div>
                  <span className="text-[8px] font-bold text-slate-400 block uppercase">Stock No</span>
                  <span>{previewLabel.stockNo}</span>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-slate-400 block uppercase">Location</span>
                  <span className="text-[#f59e0b] font-bold">{previewLabel.location}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[8px] font-bold text-slate-400 block uppercase">Customer Account</span>
                  <span className="truncate block">{previewLabel.customer}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                handlePrint(previewLabel.id);
                setPreviewLabel(null);
              }}
              className="w-full inline-flex items-center justify-center py-2.5 bg-[#FFD400] hover:bg-[#FF9A00] text-slate-955 font-black text-xs rounded-xl transition-all cursor-pointer"
            >
              <Printer className="h-4 w-4 mr-1.5" />
              <span>Print Sticker Tag</span>
            </button>
          </div>
        </div>
      )}

      {/* Details Dialog Modal */}
      {detailsLabel && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 text-left relative shadow-2xl animate-scale-up space-y-4">
            <button
              onClick={() => setDetailsLabel(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="pb-2 border-b border-slate-100">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Tag Details Specifications</span>
              <strong className="text-base font-black text-slate-900 block mt-0.5">{detailsLabel.id}</strong>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Barcode / QR</span>
                  <strong className="text-slate-800 font-mono block mt-0.5">{detailsLabel.barcode}</strong>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">VIN / SKU</span>
                  <strong className="text-slate-800 font-mono font-bold block mt-0.5">{detailsLabel.vin}</strong>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Stock Number</span>
                  <strong className="text-slate-800 font-extrabold block mt-0.5">{detailsLabel.stockNo}</strong>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Asset Type</span>
                  <strong className="text-slate-800 font-extrabold block mt-0.5">{detailsLabel.assetType}</strong>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Location Bay</span>
                  <strong className="text-[#f59e0b] font-bold font-mono block mt-0.5">{detailsLabel.location}</strong>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Generated Date</span>
                  <strong className="text-slate-800 font-extrabold block mt-0.5">{detailsLabel.generated}</strong>
                </div>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Customer Account</span>
                <strong className="text-slate-800 font-extrabold block mt-0.5">{detailsLabel.customer}</strong>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                onClick={() => setDetailsLabel(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Specifications
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
