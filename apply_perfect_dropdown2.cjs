const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src', 'components', 'CompanyAdmin', 'CreateLoad.jsx');
let content = fs.readFileSync(targetFile, 'utf8');

content = content.replace(
  "  const [formData, setFormData] = useState({\r\n    customer: '',\r\n    loadType: 'General Freight',",
  "  const [formData, setFormData] = useState({\r\n    customer: '',\r\n    billedCustomerIds: [],\r\n    loadType: 'General Freight',"
);

content = content.replace(
  "  const [formData, setFormData] = useState({\n    customer: '',\n    loadType: 'General Freight',",
  "  const [formData, setFormData] = useState({\n    customer: '',\n    billedCustomerIds: [],\n    loadType: 'General Freight',"
);

fs.writeFileSync(targetFile, content);
console.log("Applied billedCustomerIds to formData");
