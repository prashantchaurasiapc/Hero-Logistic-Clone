require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

let prisma;

try {
  const dbUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/hero-logistic';
  const urlObj = new URL(dbUrl);
  
  const host = (urlObj.hostname === 'localhost' || !urlObj.hostname) ? '127.0.0.1' : urlObj.hostname;
  const adapter = new PrismaMariaDb({
    host,
    port: Number(urlObj.port) || 3306,
    user: urlObj.username || 'root',
    password: urlObj.password !== undefined ? urlObj.password : 'root',
    database: urlObj.pathname ? urlObj.pathname.replace(/^\//, '') : 'hero-logistic',
    connectionLimit: 20,
    allowPublicKeyRetrieval: true
  });

  prisma = new PrismaClient({ adapter });
} catch (err) {
  console.error('Failed to initialize PrismaMariaDb adapter:', err);
  prisma = new PrismaClient();
}

module.exports = prisma;
