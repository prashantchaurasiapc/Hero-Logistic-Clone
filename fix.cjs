const fs = require('fs');
const file = 'src/components/SuperAdminDashboard/Companies.jsx';
let content = fs.readFileSync(file, 'utf8');

const cutoff = content.indexOf('{/* Broadcast Notification Modal */}');
const beginning = content.slice(0, cutoff);
const pd = fs.readFileSync('src/components/SuperAdminDashboard/PlatformDashboard.jsx', 'utf8');
const startIdx = pd.indexOf('{/* Tenant Workspace Inspector Drawer */}');
// Find where the showInspector block ends: `      )}\r\n    </div>` or `      )}\n    </div>`
let endIdx = pd.indexOf('      )}\n    </div>', startIdx);
if (endIdx === -1) {
  endIdx = pd.indexOf('      )}\r\n    </div>', startIdx);
}
// Include the `      )}` which is 8 characters long
const inspector = pd.substring(startIdx, endIdx + 8);

const newEnd = `      {/* Broadcast Notification Modal */}
      {showSendNotificationModal && selectedActionCompany && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[500px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Broadcast Notification to {selectedActionCompany.name}</h3>
              <button onClick={() => setShowSendNotificationModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">NOTIFICATION PAYLOAD MESSAGE</label>
                <textarea 
                  placeholder="Type announcement message..."
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-medium rounded-xl focus:outline-none text-slate-800 h-24 resize-none"
                ></textarea>
              </div>
              <button 
                onClick={() => {
                  showNotification(\`Broadcast message sent to \${selectedActionCompany.name}\`);
                  setShowSendNotificationModal(false);
                }}
                className="w-full bg-[#FFB020] hover:bg-[#FFC800] text-black font-extrabold text-[13px] py-4 rounded-xl transition-all cursor-pointer shadow-sm mt-2"
              >
                Broadcast Message
              </button>
            </div>
          </div>
        </div>
      )}

      `;
fs.writeFileSync(file, beginning + newEnd + inspector + '\n    </div>\n  );\n}\n', 'utf8');
console.log('Fixed file perfectly with the full inspector!');
