require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

// Clear require cache for @prisma/client to ensure generated schema changes are loaded
Object.keys(require.cache).forEach((key) => {
  if (key.includes('@prisma')) {
    delete require.cache[key];
  }
});

let prisma;

try {
  const dbUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/hero-logistic';
  const urlObj = new URL(dbUrl);
  
  const adapter = new PrismaMariaDb({
    host: urlObj.hostname || 'localhost',
    port: Number(urlObj.port) || 3306,
    user: urlObj.username || 'root',
    password: urlObj.password || '',
    database: urlObj.pathname ? urlObj.pathname.replace(/^\//, '') : 'hero-logistic',
    connectionLimit: 20
  });

  prisma = new PrismaClient({ adapter });
} catch (err) {
  console.error('Failed to initialize PrismaMariaDb adapter:', err);
  prisma = new PrismaClient();
}

module.exports = prisma;
