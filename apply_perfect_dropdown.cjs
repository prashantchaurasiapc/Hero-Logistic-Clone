const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src', 'components', 'CompanyAdmin', 'CreateLoad.jsx');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Inject the state variable
const stateInjectionPoint = `  const [customerPricingRules, setCustomerPricingRules] = useState([]);`;
const stateInjectionReplacement = `  const [customerPricingRules, setCustomerPricingRules] = useState([]);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);`;

if (content.includes(stateInjectionPoint)) {
  content = content.replace(stateInjectionPoint, stateInjectionReplacement);
} else {
  console.log("Failed to inject state variable");
}

// 2. Add billedCustomerIds to formData
const formDataMatch = `    customer: '',
    loadType: 'General Freight',`;
const formDataReplacement = `    customer: '',
    billedCustomerIds: [],
    loadType: 'General Freight',`;

if (content.includes(formDataMatch)) {
  content = content.replace(formDataMatch, formDataReplacement);
} else {
  console.log("Failed to inject billedCustomerIds into formData");
}

// 3. Replace the Booking Customer field
const oldFieldRegex = /<div className="col-span-1">\s*<FieldLabel>Booking Customer \(Optional\)<\/FieldLabel>[\s\S]*?<p className="text-\[10\.5px\] font-bold text-emerald-500 mt-1\.5 leading-snug">\s*Auto-finds Pricing Rule\s*<\/p>\s*<\/div>/;

const newField = `<div className="col-span-1" onMouseLeave={() => setIsCustomerDropdownOpen(false)}>
              <FieldLabel>Booking Customer (Optional)</FieldLabel>
              <div className="relative">
                <div 
                  className={\`\${inputCls} min-h-[42px] flex flex-wrap items-center justify-between cursor-pointer pl-3 pr-8 py-1.5 bg-white border \${isCustomerDropdownOpen ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200'} rounded-xl hover:border-indigo-300 transition-all\`}
                  onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                >
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {formData.billedCustomerIds?.length > 0 ? (
                      formData.billedCustomerIds.slice(0, 2).map(id => {
                        const c = dbCustomers.find(cust => cust.id === id);
                        return (
                          <span key={id} className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-lg text-[10.5px] font-bold flex items-center gap-1.5 shadow-sm">
                            <span className="truncate max-w-[80px]">{c ? c.name : 'Unknown'}</span>
                            <X className="w-3 h-3 hover:text-indigo-900 bg-indigo-100/50 rounded-full cursor-pointer" onClick={(e) => {
                              e.stopPropagation();
                              const newBilled = formData.billedCustomerIds.filter(bid => bid !== id);
                              const newPrimary = newBilled.length > 0 ? newBilled[0] : '';
                              setFormData({ ...formData, billedCustomerIds: newBilled, customer: newPrimary });
                              setItems(prev => prev.map(item => ({ ...item, customer: item.customer || newPrimary })));
                            }} />
                          </span>
                        )
                      })
                    ) : (
                      <span className="text-slate-400 text-[11px] font-bold pl-5">Select Customers...</span>
                    )}
                    {formData.billedCustomerIds?.length > 2 && (
                      <span className="bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded-lg text-[10.5px] font-black">
                        +{formData.billedCustomerIds.length - 2} more
                      </span>
                    )}
                  </div>
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-400 pointer-events-none" />
                  <ChevronDown className={\`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-transform duration-200 \${isCustomerDropdownOpen ? 'rotate-180' : ''}\`} />
                </div>
                
                {isCustomerDropdownOpen && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl custom-scrollbar p-1.5 flex flex-col gap-0.5 animate-fadeIn">
                    {dbCustomers.map((c, idx) => {
                      const isChecked = (formData.billedCustomerIds || []).includes(c.id);
                      return (
                        <label 
                          key={c.id || idx} 
                          className={\`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors border border-transparent \${isChecked ? 'bg-indigo-50/80 border-indigo-100' : 'hover:bg-slate-50 hover:border-slate-100'}\`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={e => {
                              let newBilled = [...(formData.billedCustomerIds || [])];
                              if (e.target.checked) {
                                if (!newBilled.includes(c.id)) newBilled.push(c.id);
                              } else {
                                newBilled = newBilled.filter(id => id !== c.id);
                              }
                              const newPrimary = newBilled.length > 0 ? newBilled[0] : '';
                              setFormData({ ...formData, billedCustomerIds: newBilled, customer: newPrimary });
                              setItems(prev => prev.map(item => ({ ...item, customer: item.customer || newPrimary })));
                            }}
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer shadow-xs"
                          />
                          <div className="flex flex-col">
                            <span className={\`text-xs truncate \${isChecked ? 'font-black text-indigo-900' : 'font-bold text-slate-700'}\`}>
                              {c.name || \`Customer #\${idx + 1}\`}
                            </span>
                            {isChecked && <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">Selected</span>}
                          </div>
                        </label>
                      );
                    })}
                    {dbCustomers.length === 0 && (
                      <div className="text-[11px] font-bold text-slate-400 p-4 text-center">No customers found</div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-[10.5px] font-bold text-indigo-500 mt-1.5 leading-snug">
                Select one or multiple customers
              </p>
            </div>`;

if (oldFieldRegex.test(content)) {
  content = content.replace(oldFieldRegex, newField);
  console.log("Successfully replaced the field.");
} else {
  console.log("Failed to match the old field regex.");
}

fs.writeFileSync(targetFile, content);
console.log("Patch applied.");
