const fs = require('fs');
let file = fs.readFileSync('src/components/CompanyAdmin/AssetDetails.jsx', 'utf8');

// 1. Add state for activeCostTab
if (!file.includes('const [activeCostTab')) {
  file = file.replace(
    "const [activeMaintTab, setActiveMaintTab] = useState('Maintenance Schedule');",
    "const [activeMaintTab, setActiveMaintTab] = useState('Maintenance Schedule');\n  const [activeCostTab, setActiveCostTab] = useState('Cost Overview');"
  );
}

// 2. Replace the top part of Costs & Depreciation
const oldTop = \`      {activeTab === 'Costs & Depreciation' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col mb-8 overflow-hidden">
          


          {/* Tab Content Area */}
          <div className="flex flex-col xl:flex-row border-t border-slate-100">
            
            {/* Left Column (Table) */}
            <div className="flex-1 border-r border-slate-200 p-0 flex flex-col min-w-0">\`;

const newTop = \`      {activeTab === 'Costs & Depreciation' && (
        <div className="space-y-6">
          {/* Inner Navigation Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto custom-scrollbar">
            {['Cost Overview', 'All Costs & Expenses', 'Depreciation Schedule', 'Cost by Category', 'Cost by Branch / Location', 'Tax & Compliance'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveCostTab(tab)}
                className={\`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap \${activeCostTab === tab ? 'text-purple-700 border-purple-700' : 'text-slate-500 border-transparent hover:text-slate-800'}\`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            
            {/* Left Column (Table) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">\`;

file = file.replace(oldTop, newTop);

// 3. Replace the Right Column wrapper
const oldRight = \`            {/* Right Column (Sidebar Summaries) */}
            <div className="w-full xl:w-[320px] bg-white p-5 flex flex-col gap-6 shrink-0">\`;

const newRight = \`            {/* Right Column (Sidebar Summaries) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-6">\`;

file = file.replace(oldRight, newRight);

// 4. At the end of the Costs & Depreciation block, remove the extra closing divs that belonged to the old flex container.
// Right after the end of Right Column (line 2798-2801)
// We need to change:
/*
            </div>

          </div>
        </div>
      )}
*/
// To:
/*
            </div>
          </div>
*/
// (Since we still have the outer <div className="space-y-6"> and the inner <div className="grid..."> )

// Let's replace the developer notes block at the end (line 3213) to be appended at the end of the space-y-6 div,
// and remove the old developer notes block.

const oldDeveloperNotes = \`      {/* DEVELOPER NOTES (For Costs & Depreciation) */}
      {activeTab === 'Costs & Depreciation' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <div className="bg-purple-600 p-1.5 rounded text-white">
              <Code size={14} />
            </div>
            <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest">Developer Notes: Costs & Depreciation Module</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
            {/* Col 1 */}
            <div>
              <h4 className="text-[11px] font-black text-slate-800 mb-3 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200">1</div> 
                <span>PURPOSE</span>
              </h4>
              <ul className="space-y-2 text-[10px] font-medium text-slate-600 list-disc list-inside marker:text-slate-300">
                <li className="pl-1">Track all costs, expenses and depreciation.</li>
                <li className="pl-1">Support financial reporting and tax compliance.</li>
                <li className="pl-1">Provide clear visibility of asset profitability.</li>
              </ul>
            </div>
            
            {/* Col 2 */}
            <div>
              <h4 className="text-[11px] font-black text-slate-800 mb-3 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200">2</div> 
                <span>KEY FEATURES</span>
              </h4>
              <ul className="space-y-2 text-[10px] font-medium text-slate-600 list-disc list-inside marker:text-slate-300">
                <li className="pl-1">Record recurring and one-off costs.</li>
                <li className="pl-1">Depreciation calculation (straight line by default).</li>
                <li className="pl-1">Cost categorisation and trend analysis.</li>
                <li className="pl-1">Export reports for accounting integration.</li>
              </ul>
            </div>
            
            {/* Col 3 */}
            <div>
              <h4 className="text-[11px] font-black text-slate-800 mb-3 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200">3</div> 
                <span>AUTOMATION & ALERTS</span>
              </h4>
              <ul className="space-y-2 text-[10px] font-medium text-slate-600 list-disc list-inside marker:text-slate-300">
                <li className="pl-1">Auto-calculate depreciation based on rules.</li>
                <li className="pl-1">Alert for upcoming large expenses.</li>
                <li className="pl-1">Predict annual cost based on patterns.</li>
                <li className="pl-1">AI insights for cost optimisation (AI add-on).</li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-[11px] font-black text-slate-800 mb-3 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200">4</div> 
                <span>PERMISSIONS</span>
              </h4>
              <ul className="space-y-2 text-[10px] font-medium text-slate-600 list-disc list-inside marker:text-slate-300">
                <li className="pl-1">Super Admin: Full access.</li>
                <li className="pl-1">Admin/Manager: Create, edit, approve.</li>
                <li className="pl-1">Accounts: View financial data & export.</li>
                <li className="pl-1">Staff: View assigned asset costs.</li>
              </ul>
            </div>

            {/* Col 5 */}
            <div>
              <h4 className="text-[11px] font-black text-slate-800 mb-3 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200">5</div> 
                <span>DATA SOURCES</span>
              </h4>
              <ul className="space-y-2 text-[10px] font-medium text-slate-600 list-disc list-inside marker:text-slate-300">
                <li className="pl-1">Costs & Expenses module.</li>
                <li className="pl-1">Maintenance module.</li>
                <li className="pl-1">Fuel & Usage module.</li>
                <li className="pl-1">Invoices & Receipts (OCR).</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-slate-50 border-t border-slate-100 p-3 flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-500">All times shown in your local time (AEST)</span>
            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500">
              Data auto-refreshes every 5 minutes
              <RefreshCw size={10} className="text-slate-400" />
            </div>
          </div>
        </div>
      )}\`;

const newDeveloperNotes = \`          {/* DEVELOPER NOTES (For Costs & Depreciation) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
              <div className="bg-purple-600 p-1.5 rounded text-white">
                <Code size={14} />
              </div>
              <h3 className="text-[11px] font-black text-purple-700 uppercase tracking-widest">DEVELOPER NOTES - ASSET COSTS & DEPRECIATION</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
              {/* Col 1 */}
              <div>
                <h4 className="text-[11px] font-black text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200">1</div> 
                  <span>PURPOSE</span>
                </h4>
                <ul className="space-y-2 text-[10px] font-semibold text-slate-500 list-disc list-inside marker:text-slate-300">
                  <li className="pl-1">Track all costs, expenses and depreciation.</li>
                  <li className="pl-1">Support financial reporting and tax compliance.</li>
                  <li className="pl-1">Provide clear visibility of asset profitability.</li>
                </ul>
              </div>
              
              {/* Col 2 */}
              <div>
                <h4 className="text-[11px] font-black text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200">2</div> 
                  <span>KEY FEATURES</span>
                </h4>
                <ul className="space-y-2 text-[10px] font-semibold text-slate-500 list-disc list-inside marker:text-slate-300">
                  <li className="pl-1">Record recurring and one-off costs.</li>
                  <li className="pl-1">Depreciation calculation (straight line by default).</li>
                  <li className="pl-1">Cost categorisation and trend analysis.</li>
                  <li className="pl-1">Export reports for accounting integration.</li>
                </ul>
              </div>
              
              {/* Col 3 */}
              <div>
                <h4 className="text-[11px] font-black text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200">3</div> 
                  <span>AUTOMATION & ALERTS</span>
                </h4>
                <ul className="space-y-2 text-[10px] font-semibold text-slate-500 list-disc list-inside marker:text-slate-300">
                  <li className="pl-1">Auto-calculate depreciation based on rules.</li>
                  <li className="pl-1">Alert for upcoming large expenses.</li>
                  <li className="pl-1">Predict annual cost based on patterns.</li>
                  <li className="pl-1">AI insights for cost optimisation (AI add-on).</li>
                </ul>
              </div>

              {/* Col 4 */}
              <div>
                <h4 className="text-[11px] font-black text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200">4</div> 
                  <span>PERMISSIONS</span>
                </h4>
                <ul className="space-y-2 text-[10px] font-semibold text-slate-500 list-disc list-inside marker:text-slate-300">
                  <li className="pl-1">Super Admin: Full access.</li>
                  <li className="pl-1">Admin/Manager: Create, edit, approve.</li>
                  <li className="pl-1">Accounts: View financial data & export.</li>
                  <li className="pl-1">Staff: View assigned asset costs.</li>
                </ul>
              </div>

              {/* Col 5 */}
              <div>
                <h4 className="text-[11px] font-black text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200">5</div> 
                  <span>DATA SOURCES</span>
                </h4>
                <ul className="space-y-2 text-[10px] font-semibold text-slate-500 list-disc list-inside marker:text-slate-300">
                  <li className="pl-1">Costs & Expenses module.</li>
                  <li className="pl-1">Maintenance module.</li>
                  <li className="pl-1">Fuel & Usage module.</li>
                  <li className="pl-1">Invoices & Receipts (OCR).</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-slate-50/80 border-t border-slate-100 p-4 flex items-center justify-between">
              <span className="text-[9px] font-bold text-slate-500">All times shown in your local time (AEST)</span>
              <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500">
                Data auto-refreshes every 5 minutes
                <RefreshCw size={10} className="text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      )}\`;

// 5. Replace the end of the Costs block with the developer notes
const oldEnd = \`            </div>

          </div>
        </div>
      )}\`;

// If we can't find oldEnd because of trailing spaces, let's use regex
file = file.replace(
  /\\s*<\\/div>\\s*<\\/div>\\s*<\\/div>\\s*}\\)\\s*\\{\\/\\* OTHER TABS PLACEHOLDERS \\*\\/\\}/, 
  "\\n            </div>\\n          </div>\\n" + newDeveloperNotes + "\\n\\n      {/* OTHER TABS PLACEHOLDERS */}"
);

// 6. Delete the old Developer Notes at the bottom of the file
file = file.replace(oldDeveloperNotes, '');

fs.writeFileSync('src/components/CompanyAdmin/AssetDetails.jsx', file, 'utf8');
