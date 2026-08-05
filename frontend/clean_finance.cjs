const fs = require('fs');

let content = fs.readFileSync('src/components/CompanyAdmin/Finance.jsx', 'utf8');

// Replace 10.x prefixes from the <h1> headings
content = content.replace(/(<h1[^>]*>)\s*10\.\d\s+/g, '$1\n                    ');

const lines = content.split('\n');
const newLines = [];
let i = 0;

while (i < lines.length) {
  if (lines[i].includes('{/* Developer Notes Footer Box */}') || lines[i].includes('{/* DEVELOPER NOTES BOX */}')) {
    const indentMatch = lines[i].match(/^\s*/);
    const indent = indentMatch ? indentMatch[0] : '';
    let j = i + 1;
    let foundEnd = false;
    while (j < lines.length) {
      if (lines[j] === indent + '</div>') {
        i = j; // skip to the closing div
        foundEnd = true;
        break;
      }
      j++;
    }
    if (foundEnd) {
      i++; // Skip the closing div itself
      continue;
    }
  }
  newLines.push(lines[i]);
  i++;
}

fs.writeFileSync('src/components/CompanyAdmin/Finance.jsx', newLines.join('\n'));
