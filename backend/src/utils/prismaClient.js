// Clear require cache for @prisma/client to ensure generated schema changes are loaded
Object.keys(require.cache).forEach((key) => {
  if (key.includes('@prisma')) {
    delete require.cache[key];
  }
});

const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

module.exports = prisma;
