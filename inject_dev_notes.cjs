const fs = require('fs');
let file = fs.readFileSync('src/components/CompanyAdmin/AssetDetails.jsx', 'utf8');

// Ensure Code icon is imported
if (!file.includes(', Code }')) {
  file = file.replace(/} from 'lucide-react';/, ", Code } from 'lucide-react';");
}

const developerNotes = `
          {/* DEVELOPER NOTES */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-2">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
              <div className="bg-purple-600 p-1.5 rounded text-white">
                <Code size={14} />
              </div>
              <h3 className="text-[11px] font-black text-purple-700 uppercase tracking-widest">DEVELOPER NOTES - ASSET DOCUMENTS & COMPLIANCE</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
              {/* Col 1 */}
              <div>
                <h4 className="text-[11px] font-black text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200">1</div> 
                  <span>PURPOSE</span>
                </h4>
                <ul className="space-y-2 text-[10px] font-semibold text-slate-500 list-disc list-inside marker:text-slate-300">
                  <li className="pl-1">Central repository for all asset related documents.</li>
                  <li className="pl-1">Track compliance, certificates, expiry and alerts.</li>
                  <li className="pl-1">Ensure assets remain compliant and operational.</li>
                </ul>
              </div>
              
              {/* Col 2 */}
              <div>
                <h4 className="text-[11px] font-black text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200">2</div> 
                  <span>KEY FEATURES</span>
                </h4>
                <ul className="space-y-2 text-[10px] font-semibold text-slate-500 list-disc list-inside marker:text-slate-300">
                  <li className="pl-1">Upload, view, download and manage documents.</li>
                  <li className="pl-1">Categorised documents with expiry tracking.</li>
                  <li className="pl-1">Compliance status with alerts and notifications.</li>
                  <li className="pl-1">Filter by category, status and expiry.</li>
                </ul>
              </div>
              
              {/* Col 3 */}
              <div>
                <h4 className="text-[11px] font-black text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200">3</div> 
                  <span>AUTOMATION & ALERTS</span>
                </h4>
                <ul className="space-y-2 text-[10px] font-semibold text-slate-500 list-disc list-inside marker:text-slate-300">
                  <li className="pl-1">Auto-detect expiry from document (AI add-on).</li>
                  <li className="pl-1">Auto reminders before expiry.</li>
                  <li className="pl-1">Escalate overdue items.</li>
                  <li className="pl-1">Dashboard and notification alerts.</li>
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
                  <li className="pl-1">Admin/Manager: Create, edit, upload.</li>
                  <li className="pl-1">Dispatch/Warehouse: View relevant only.</li>
                  <li className="pl-1">Staff: View assigned asset documents.</li>
                </ul>
              </div>

              {/* Col 5 */}
              <div>
                <h4 className="text-[11px] font-black text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200">5</div> 
                  <span>DATA SOURCES</span>
                </h4>
                <ul className="space-y-2 text-[10px] font-semibold text-slate-500 list-disc list-inside marker:text-slate-300">
                  <li className="pl-1">Assets module.</li>
                  <li className="pl-1">Maintenance module.</li>
                  <li className="pl-1">Compliance module.</li>
                  <li className="pl-1">Documents & Activity logs.</li>
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
      )}

      {activeTab === 'Specifications' && (
`;

// Replace the end of the block
file = file.replace(
\`
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Specifications' && (\`,
\`
            </div>
          </div>\` + developerNotes);

fs.writeFileSync('src/components/CompanyAdmin/AssetDetails.jsx', file, 'utf8');
