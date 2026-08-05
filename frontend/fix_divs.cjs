// Fix all conditional blocks that are missing exactly ONE closing </div> before )}
// Pattern: The line before `)}` should match the expected closing structure

const fs = require('fs');
const filePath = 'src/components/CompanyAdmin/Finance.jsx';
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

let fixCount = 0;
let i = 0;

while (i < lines.length) {
  const trimmed = lines[i].trim();
  
  // Find lines that are just `)}` - closing a conditional JSX block
  if (trimmed === ')}') {
    // Find the matching opening block by tracking parens
    let parenDepth = 0;
    let openLine = -1;
    
    // The )} means we need to find the matching `{... && (` or similar
    for (let j = i - 1; j >= 0; j--) {
      const t = lines[j].trim();
      
      if (t === ')}') {
        parenDepth++;
      }
      
      // Check for opening patterns
      if ((t.match(/\{.*&&\s*\(\s*$/) || t.match(/\{.*\?\s*\(\s*$/)) && !t.startsWith('//')) {
        if (parenDepth === 0) {
          openLine = j;
          break;
        }
        parenDepth--;
      }
    }
    
    if (openLine === -1) { i++; continue; }
    
    // Count <div and </div> between openLine and i (exclusive of nested conditional blocks)
    let divOpens = 0;
    let divCloses = 0;
    
    for (let j = openLine; j <= i; j++) {
      const l = lines[j];
      // Count div opens (not self-closing, not in comments)
      const lineNoComments = l.replace(/\{\/\*.*?\*\/\}/g, '');
      const opens = (lineNoComments.match(/<div[\s>]/g) || []).length;
      const closes = (lineNoComments.match(/<\/div>/g) || []).length;
      divOpens += opens;
      divCloses += closes;
    }
    
    const missing = divOpens - divCloses;
    
    if (missing > 0) {
      // Determine the indent for the closing div
      // The )} line's indent tells us the base
      const closingIndent = lines[i].match(/^(\s*)/)[1];
      
      // Insert missing </div> tags before the )} line
      const inserts = [];
      // Determine indent based on what's above
      const prevLine = lines[i - 1];
      const prevIndent = prevLine.match(/^(\s*)/)[1];
      
      for (let k = 0; k < missing; k++) {
        // Use indent 2 more than the )} line for first, then reduce
        const indent = closingIndent + '  '.repeat(missing - k);
        inserts.push(indent + '</div>');
      }
      
      console.log(`Fix at line ${i + 1}: inserting ${missing} </div> before )}  (block opens at line ${openLine + 1}: ${lines[openLine].trim().substring(0, 60)})`);
      
      // Insert the lines
      lines.splice(i, 0, ...inserts);
      fixCount += missing;
      i += inserts.length + 1; // Skip past the inserted lines and the )} line
      continue;
    }
  }
  
  i++;
}

if (fixCount > 0) {
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log(`\nDone! Inserted ${fixCount} missing </div> tags.`);
  console.log(`File now has ${lines.length} lines.`);
} else {
  console.log('No fixes needed.');
}
