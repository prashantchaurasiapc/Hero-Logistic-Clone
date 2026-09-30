const fs = require('fs');

const path = 'd:/Kiaan project/Hero-Logistic/frontend/src/components/CompanyAdmin/Customers.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update the tabs array
content = content.replace(
  /\{\['Overview', 'Contacts', 'Billing Rules', 'Pricing', 'Transport Modules', 'Instructions', 'Documents', 'Activity', 'Financials'\]\.map\(tab => \(/g,
  "{['Overview', 'Contacts', 'Billing Rules', 'Documents', 'Activity', 'Financials'].map(tab => ("
);

// 2. We need to find the start of {activeDetailsTab === 'Billing Rules' && (
// and the end of {activeDetailsTab === 'Pricing' && ( ... )} block.

const billingRulesStart = content.indexOf("{activeDetailsTab === 'Billing Rules' && (");
const documentsStart = content.indexOf("{activeDetailsTab === 'Documents' && (");

if (billingRulesStart > -1 && documentsStart > -1) {
  const newBillingRulesUI = `{activeDetailsTab === 'Billing Rules' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Billing Rules</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Configure pricing rates and billing methods for {selectedCustomer?.name || 'this customer'}.</p>
              </div>
              <button onClick={() => setShowAddPricingRuleModal(true)} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                <Plus size={14} /> Add Pricing Rule
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs whitespace-nowrap min-w-[800px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                      <th className="py-4 px-6">CUSTOMER</th>
                      <th className="py-4 px-6">FROM</th>
                      <th className="py-4 px-6">TO</th>
                      <th className="py-4 px-6">METHOD</th>
                      <th className="py-4 px-6">RATE</th>
                      <th className="py-4 px-6">STATUS</th>
                      <th className="py-4 px-6 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {lanePricingRules.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-xs font-semibold text-slate-400 italic">
                          No billing rules configured yet for this customer. Click "+ Add Pricing Rule" above to add rules.
                        </td>
                      </tr>
                    ) : (
                      lanePricingRules.map(rule => (
                        <tr key={rule.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="py-4 px-6 font-bold text-slate-800">{selectedCustomer?.name || 'ABC Motors'}</td>
                          <td className="py-4 px-6 font-bold text-slate-800">{rule.from}</td>
                          <td className="py-4 px-6 font-bold text-slate-800">{rule.to}</td>
                          <td className="py-4 px-6">
                            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide border border-slate-200">
                              {rule.method || 'Per Load'}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-black text-emerald-600">\${parseFloat(rule.baseRate || 0).toFixed(2)}</td>
                          <td className="py-4 px-6">
                            <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 w-max border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Active
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setShowAddPricingRuleModal(true)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                                <Edit size={14} />
                              </button>
                              <button onClick={() => setLanePricingRules(prev => prev.filter(r => r.id !== rule.id))} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        `;

  content = content.substring(0, billingRulesStart) + newBillingRulesUI + content.substring(documentsStart);
  
  // also fix activeDetailsTab === 'Pricing' ? '6.5 - Customer Pricing' 
  content = content.replace("activeDetailsTab === 'Pricing' ? '6.5 - Customer Pricing' :", "");

  fs.writeFileSync(path, content, 'utf8');
  console.log("Successfully replaced UI");
} else {
  console.log("Could not find start indices");
}
