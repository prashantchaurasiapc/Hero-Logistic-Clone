const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src', 'components', 'CompanyAdmin', 'CreateLoad.jsx');
let content = fs.readFileSync(targetFile, 'utf8');

// Replace the formData initial state
content = content.replace(
  "    loadType: 'Car Carrying',\n    loadRef: '',\n    customer: '',",
  "    loadType: 'Car Carrying',\n    loadRef: '',\n    customer: '',\n    billedCustomerIds: [],"
);

// Replace the Booking Customer field
const oldCustomerField = `            <div className="col-span-1">
              <FieldLabel>Booking Customer (Optional)</FieldLabel>
              <div className="relative">
                <select
                  value={formData.customer}
                  onChange={e => {
                    const newCust = e.target.value;
                    setFormData({ ...formData, customer: newCust });
                    setItems(prev => prev.map(item => ({
                      ...item,
                      customer: item.customer || newCust
                    })));
                  }}
                  className={\`\${selectCls} pl-8 font-normal\`}
                >
                  <option value="">Select Customer...</option>
                  {dbCustomers.map((c, idx) => (
                    <option key={c.id || idx} value={c.id}>{c.name || \`Customer #\${idx + 1}\`}</option>
                  ))}
                </select>
              </div>
              <p className="text-[10.5px] font-bold text-emerald-500 mt-1.5 leading-snug">
                Auto-finds Pricing Rule
              </p>
            </div>`;

const newCustomerField = `            <div className="col-span-1">
              <FieldLabel>Billed Customers (Optional)</FieldLabel>
              <div className="relative">
                <div className="flex flex-col gap-1 max-h-[88px] overflow-y-auto bg-white border border-slate-200 rounded-lg p-1.5 custom-scrollbar">
                  {dbCustomers.map((c, idx) => {
                    const isChecked = (formData.billedCustomerIds || []).includes(c.id) || (!formData.billedCustomerIds?.length && formData.customer === c.id);
                    return (
                      <label key={c.id || idx} className="flex items-center gap-2 text-[11px] text-slate-700 hover:bg-slate-50 p-1 rounded cursor-pointer leading-tight">
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
                            setItems(prev => prev.map(item => ({
                              ...item,
                              customer: item.customer || newPrimary
                            })));
                          }}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                        />
                        <span className="truncate">{c.name || \`Customer #\${idx + 1}\`}</span>
                      </label>
                    );
                  })}
                  {dbCustomers.length === 0 && (
                    <span className="text-[11px] text-slate-400 p-1">No customers</span>
                  )}
                </div>
              </div>
              <p className="text-[10.5px] font-bold text-emerald-500 mt-1.5 leading-snug">
                Select one or multiple customers
              </p>
            </div>`;

content = content.replace(oldCustomerField, newCustomerField);

fs.writeFileSync(targetFile, content);
console.log("Successfully applied frontend patch.");
