const fs = require('fs');

const file = 'src/components/CompanyAdmin/Customers.jsx';
let content = fs.readFileSync(file, 'utf8');

const temp = fs.readFileSync('temp_layout.jsx', 'utf8');

// The block starts with "  if (selectedCustomer) {"
// and ends right before "{activeDetailsTab === 'Contacts' && ("

const startStr = "  if (selectedCustomer) {";
const endStr = "        {activeDetailsTab === 'Contacts' && (";

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find start or end index.");
  console.log(startIndex, endIndex);
  process.exit(1);
}

// Add the endStr back since the temp file does not include it
const newContent = content.substring(0, startIndex) + temp + "\n        " + content.substring(endIndex);

fs.writeFileSync(file, newContent, 'utf8');
console.log("Successfully replaced the layout block.");
