const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'Dispatcher');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const components = [
  'CommandCenter', 'Loads', 'LoadInbox', 'TerminalWorkspace', 
  'FleetMonitor', 'FleetAssets', 'AssetInventory', 
  'RosterControl', 'CommunicationDepot', 'SystemSettings'
];

components.forEach(c => {
  const code = `import React from 'react';

export default function ${c}() {
  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto">
      <h1 className="text-2xl font-black text-slate-900 mb-4">${c.replace(/([A-Z])/g, ' $1').trim()}</h1>
      <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-sm">
        <p className="text-slate-500 font-medium">This is the Dispatcher ${c.replace(/([A-Z])/g, ' $1').trim()} module. Data integration pending.</p>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dir, `${c}.jsx`), code);
});

console.log('Successfully created all 10 Dispatcher components.');
