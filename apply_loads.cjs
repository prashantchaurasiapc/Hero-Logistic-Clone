const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src', 'components', 'CompanyAdmin', 'Loads.jsx');
let content = fs.readFileSync(targetFile, 'utf8');

// Replace the Bill To Customer value in Generate Invoice modal
content = content.replace(
  "value={currentLoad?.customer?.name || (typeof currentLoad?.customer === 'string' ? currentLoad.customer : '') || 'General Customer'}",
  "value={currentLoad?.billedCustomers?.length > 1 ? `Multiple Customers (${currentLoad.billedCustomers.length})` : (currentLoad?.customer?.name || (typeof currentLoad?.customer === 'string' ? currentLoad.customer : '') || 'General Customer')}"
);

fs.writeFileSync(targetFile, content);
console.log("Successfully applied Loads.jsx patch.");
