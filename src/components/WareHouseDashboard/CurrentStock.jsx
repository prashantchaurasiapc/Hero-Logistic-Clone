import React, { useState } from 'react';
import { Settings, Download, Search, X } from 'lucide-react';

export default function CurrentStock({
  logisticsMode,
  carStock,
  freightStock,
  setSelectedCarId,
  setSelectedFreightId,
  onMoveClick,
  onToHoldingClick,
  onToLaneClick,
  onHistClick,
  onLabelClick,
  onMissingClick,
  handleExportStock
}) {
  const [density, setDensity] = useState('compact'); // compact (active), default, relaxed
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  // Column visibility state (VIN and Load Lane are checked by default as per UI screenshot)
  const [visibleColumns, setVisibleColumns] = useState({
    vin: true,
    regoMake: false,
    stockNo: false,
    customer: false,
    locationBay: false,
    loadLane: true,
    status: false
  });

  const getFilteredList = () => {
    if (logisticsMode === 'car_carrying') {
      return carStock.filter(c =>
        c.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.rego.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.stockNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.customer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      return freightStock.filter(f =>
        f.itemNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.aisleBin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.customer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  };

  const filteredStock = getFilteredList();

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(r => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleAllSelect = () => {
    if (selectedRows.length === filteredStock.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredStock.map(r => r.id));
    }
  };

  const getPaddingClass = () => {
    if (density === 'compact') return 'py-1.5 px-6';
    if (density === 'relaxed') return 'py-5 px-6';
    return 'py-3.5 px-6'; // default
  };

  // KPI calculations based on active mode
  const currentList = logisticsMode === 'car_carrying' ? carStock : freightStock;
  const totalStock = currentList.length;
  const availableStock = currentList.filter(x => x.status === 'Ready' || x.status === 'Stowed' || x.status === 'Inwarded').length;
  const inHoldingArea = currentList.filter(x => x.location?.includes('Holding') || x.aisleBin?.includes('Holding') || x.aisleBin?.includes('Zone')).length;
  const loadLanes = currentList.filter(x => (x.lane && x.lane !== 'Unassigned') || x.aisleBin?.includes('Lane')).length;
  const readyToDispatch = currentList.filter(x => x.status === 'Ready' || x.status === 'Staged').length;
  const missingItems = currentList.filter(x => x.status === 'Missing').length;

  const labelsMap = {
    vin: logisticsMode === 'car_carrying' ? 'VIN' : 'Item No',
    regoMake: logisticsMode === 'car_carrying' ? 'Rego / Make' : 'Weight / Dimensions',
    stockNo: logisticsMode === 'car_carrying' ? 'Stock No' : 'Pallets',
    customer: 'Customer',
    locationBay: logisticsMode === 'car_carrying' ? 'Location / Bay' : 'Aisle / Bin',
    loadLane: logisticsMode === 'car_carrying' ? 'Load Lane' : 'Zone',
    status: 'Status'
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-left relative overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Stock</span>
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{totalStock}</h4>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-3 truncate">Total units tracked</span>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-left relative overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Available Stock</span>
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{availableStock}</h4>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-3 truncate">Unassigned units</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-left relative overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">In Holding Area</span>
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{inHoldingArea}</h4>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-3 truncate">Units staged</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-left relative overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Load Lanes</span>
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{loadLanes}</h4>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-3 truncate">Units queued</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-left relative overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Ready to Dispatch</span>
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{readyToDispatch}</h4>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-3 truncate">Cleared to load</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-left relative overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Missing Items</span>
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{missingItems}</h4>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-3 truncate">Flagged incidents</span>
        </div>
      </div>

      {/* Main Stock Container */}
      <div className="glass rounded-2xl p-5 border border-slate-200 text-left space-y-4 bg-white shadow-xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Current Stock Inventory</h3>
            <p className="text-xs text-slate-450 mt-1">Comprehensive view of all independent assets and staging cargo.</p>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder={logisticsMode === 'car_carrying' ? "Search VIN, Rego, Customer..." : "Search Item No, Customer..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs rounded-xl focus:border-brand-600 focus:outline-none transition-all duration-200"
              />
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Search className="h-4 w-4" />
              </span>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-650 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <button
              onClick={handleExportStock}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-black bg-gradient-to-r from-[#FFD400] to-[#FF9A00] text-slate-950 rounded-xl hover:scale-[1.03] transition-all cursor-pointer shadow-xs focus:outline-none"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Stock List</span>
            </button>
          </div>
        </div>

        {/* Toggles and Column Popover Trigger Row */}
        <div className="flex flex-wrap justify-end items-center gap-3 relative">
          {/* Density Selector */}
          <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-[9px] font-bold">
            {['COMPACT', 'DEFAULT', 'RELAXED'].map((mode) => {
              const isActive = density === mode.toLowerCase();
              return (
                <button
                  key={mode}
                  onClick={() => setDensity(mode.toLowerCase())}
                  className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer ${isActive ? 'bg-[#FFD400] text-slate-955 font-extrabold shadow-xs' : 'text-slate-550 hover:text-slate-700'} whitespace-nowrap`}
                >
                  {mode}
                </button>
              );
            })}
          </div>

          {/* Columns button */}
          <button 
            onClick={() => setColumnsMenuOpen(!columnsMenuOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-655 font-bold text-[9px] uppercase rounded-xl transition-all cursor-pointer focus:outline-none whitespace-nowrap"
          >
            <Settings className="h-3.5 w-3.5 text-slate-400" />
            <span>Columns</span>
          </button>

          {/* Floating Column Visibility Popover Menu */}
          {columnsMenuOpen && (
            <div className="absolute right-0 top-full mt-2 z-20 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 animate-fade-in text-slate-800">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-550">Column Visibility</span>
                <button onClick={() => setColumnsMenuOpen(false)} className="text-slate-450 hover:text-slate-700">
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-1 max-h-56 overflow-y-auto">
                {Object.keys(visibleColumns).map((colKey) => (
                  <label 
                    key={colKey} 
                    className="flex items-center gap-2.5 py-1.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-700 text-xs font-semibold select-none transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns[colKey]}
                      onChange={() => setVisibleColumns({ ...visibleColumns, [colKey]: !visibleColumns[colKey] })}
                      className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <span>{labelsMap[colKey]}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Column Table */}
        <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              <tr>
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filteredStock.length && filteredStock.length > 0}
                    onChange={handleAllSelect}
                    className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                  />
                </th>
                {visibleColumns.vin && <th className="px-6 py-4 font-extrabold">{logisticsMode === 'car_carrying' ? 'VIN' : 'Item No'}</th>}
                {visibleColumns.regoMake && <th className="px-6 py-4 font-extrabold">{logisticsMode === 'car_carrying' ? 'Rego / Make' : 'Weight / Dimensions'}</th>}
                {visibleColumns.stockNo && <th className="px-6 py-4 font-extrabold">{logisticsMode === 'car_carrying' ? 'Stock No' : 'Pallets'}</th>}
                {visibleColumns.customer && <th className="px-6 py-4 font-extrabold">Customer</th>}
                {visibleColumns.locationBay && <th className="px-6 py-4 font-extrabold">{logisticsMode === 'car_carrying' ? 'Location / Bay' : 'Aisle / Bin'}</th>}
                {visibleColumns.loadLane && <th className="px-6 py-4 font-extrabold">{logisticsMode === 'car_carrying' ? 'Load Lane' : 'Zone'}</th>}
                {visibleColumns.status && <th className="px-6 py-4 font-extrabold">Status</th>}
                <th className="px-6 py-4 font-extrabold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredStock.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-slate-400 text-xs italic bg-white">
                    No stock records found matching filters.
                  </td>
                </tr>
              ) : (
                filteredStock.map((row) => {
                  const isChecked = selectedRows.includes(row.id);
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 text-center whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleRowSelect(row.id)}
                          className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                      </td>
                      {visibleColumns.vin && (
                        <td className={`font-mono text-slate-900 font-extrabold whitespace-nowrap ${getPaddingClass()}`}>
                          {logisticsMode === 'car_carrying' ? row.vin : row.itemNo}
                        </td>
                      )}
                      {visibleColumns.regoMake && (
                        <td className={`text-slate-655 font-semibold whitespace-nowrap ${getPaddingClass()}`}>
                          {logisticsMode === 'car_carrying' ? `${row.rego} | ${row.model}` : `${row.weight} | ${row.dimensions}`}
                        </td>
                      )}
                      {visibleColumns.stockNo && (
                        <td className={`text-slate-550 font-semibold whitespace-nowrap ${getPaddingClass()}`}>
                          {logisticsMode === 'car_carrying' ? row.stockNo : `${row.palletCount} Plts`}
                        </td>
                      )}
                      {visibleColumns.customer && (
                        <td className={`text-[#FF9A00] font-extrabold whitespace-nowrap ${getPaddingClass()}`}>
                          {row.customer}
                        </td>
                      )}
                      {visibleColumns.locationBay && (
                        <td className={`whitespace-nowrap ${getPaddingClass()}`}>
                          <span className="text-emerald-500 font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                            {logisticsMode === 'car_carrying' ? row.location : row.aisleBin}
                          </span>
                        </td>
                      )}
                      {visibleColumns.loadLane && (
                        <td className={`text-slate-505 font-medium whitespace-nowrap ${getPaddingClass()}`}>
                          {logisticsMode === 'car_carrying' ? row.lane : row.zone}
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td className={`whitespace-nowrap ${getPaddingClass()}`}>
                          <span className={`inline-flex px-2 py-1 text-[10px] font-bold rounded-lg border ${row.status === 'Missing' ? 'bg-rose-50 text-rose-700 border-rose-200/50' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                            {row.status}
                          </span>
                        </td>
                      )}
                      <td className={`whitespace-nowrap ${getPaddingClass()}`}>
                        <div className="flex gap-1.5 flex-wrap min-w-[280px]">
                          <button 
                            onClick={() => {
                              if (logisticsMode === 'car_carrying') setSelectedCarId(row.id);
                              else setSelectedFreightId(row.id);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-all hover:scale-[1.02] cursor-pointer"
                          >
                            View
                          </button>
                          
                          <button 
                            onClick={() => {
                              if (logisticsMode === 'car_carrying') setSelectedCarId(row.id);
                              else setSelectedFreightId(row.id);
                              onMoveClick();
                            }}
                            className="px-2.5 py-1 border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10 font-bold text-[11px] rounded-lg transition-all hover:scale-[1.02] cursor-pointer"
                          >
                            Move
                          </button>
                          
                          <button 
                            onClick={() => onToHoldingClick(row)}
                            className="px-2.5 py-1 border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10 font-bold text-[11px] rounded-lg transition-all hover:scale-[1.02] cursor-pointer"
                          >
                            To Holding
                          </button>
                          
                          <button 
                            onClick={() => onToLaneClick(row)}
                            className="px-2.5 py-1 border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10 font-bold text-[11px] rounded-lg transition-all hover:scale-[1.02] cursor-pointer"
                          >
                            To Lane
                          </button>
                          
                          <button 
                            onClick={() => {
                              if (logisticsMode === 'car_carrying') setSelectedCarId(row.id);
                              else setSelectedFreightId(row.id);
                              onHistClick();
                            }}
                            className="px-2.5 py-1 border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10 font-bold text-[11px] rounded-lg transition-all hover:scale-[1.02] cursor-pointer"
                          >
                            Hist
                          </button>
                          
                          <button 
                            onClick={() => onLabelClick(row)}
                            className="px-2.5 py-1 border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10 font-bold text-[11px] rounded-lg transition-all hover:scale-[1.02] cursor-pointer"
                          >
                            Label
                          </button>
                          
                          <button 
                            onClick={() => onMissingClick(row)}
                            className="px-2.5 py-1 border border-rose-250 text-rose-600 hover:bg-rose-50 font-bold text-[11px] rounded-lg transition-all hover:scale-[1.02] cursor-pointer"
                          >
                            Missing
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
