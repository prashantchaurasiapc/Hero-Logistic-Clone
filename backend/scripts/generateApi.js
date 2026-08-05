const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const controllersDir = path.join(__dirname, '..', 'src', 'controllers');
const routesDir = path.join(__dirname, '..', 'src', 'routes');

// Ensure directories exist
if (!fs.existsSync(controllersDir)) fs.mkdirSync(controllersDir, { recursive: true });
if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir, { recursive: true });

function parseModels() {
  const content = fs.readFileSync(schemaPath, 'utf8');
  const modelRegex = /^model\s+([A-Za-z0-9_]+)\s*\{/gm;
  const models = [];
  let match;
  while ((match = modelRegex.exec(content)) !== null) {
    models.push(match[1]);
  }
  return models;
}

function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function generateController(modelName) {
  const camelModel = toCamelCase(modelName);
  
  const content = `const prisma = require('../utils/prismaClient');

// Get all ${modelName}s
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.${camelModel}.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching ${modelName}s:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single ${modelName} by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.${camelModel}.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: '${modelName} not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching ${modelName}:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new ${modelName}
exports.create = async (req, res) => {
  try {
    const data = await prisma.${camelModel}.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating ${modelName}:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update ${modelName}
exports.update = async (req, res) => {
  try {
    const data = await prisma.${camelModel}.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating ${modelName}:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: '${modelName} not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete ${modelName}
exports.delete = async (req, res) => {
  try {
    await prisma.${camelModel}.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: '${modelName} deleted successfully' });
  } catch (error) {
    console.error('Error deleting ${modelName}:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: '${modelName} not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
`;

  const filepath = path.join(controllersDir, `${modelName}Controller.js`);
  fs.writeFileSync(filepath, content);
}

function generateRoute(modelName) {
  const kebabModel = toKebabCase(modelName);
  const controllerName = `${modelName}Controller`;
  
  const content = `const express = require('express');
const router = express.Router();
const ${controllerName} = require('../controllers/${controllerName}');

router.route('/')
  .get(${controllerName}.getAll)
  .post(${controllerName}.create);

router.route('/:id')
  .get(${controllerName}.getById)
  .put(${controllerName}.update)
  .delete(${controllerName}.delete);

module.exports = router;
`;

  const filepath = path.join(routesDir, `${modelName}Routes.js`);
  fs.writeFileSync(filepath, content);
}

function generateIndexRoute(models) {
  let imports = '';
  let mounts = '';
  
  models.forEach(model => {
    const kebabModel = toKebabCase(model);
    imports += `const ${model}Routes = require('./${model}Routes');\n`;
    mounts += `router.use('/${kebabModel}s', ${model}Routes);\n`;
  });
  
  const content = `const express = require('express');
const router = express.Router();

${imports}

${mounts}
module.exports = router;
`;

  const filepath = path.join(routesDir, 'index.js');
  fs.writeFileSync(filepath, content);
}

function main() {
  const models = parseModels();
  console.log(`Found ${models.length} models. Generating API files...`);
  
  models.forEach(model => {
    generateController(model);
    generateRoute(model);
  });
  
  generateIndexRoute(models);
  
  console.log('Successfully generated controllers and routes!');
}

main();
