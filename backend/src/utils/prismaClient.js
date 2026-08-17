require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

let prisma;

try {
  const dbUrl = process.env.DATABASE_URL || 'mysql://root:@127.0.0.1:3306/hero-logistic';
  const adapter = new PrismaMariaDb(dbUrl, { useTextProtocol: true });
  prisma = new PrismaClient({ adapter });
} catch (err) {
  console.error('Failed to initialize PrismaMariaDb adapter:', err);
  prisma = new PrismaClient();
}

module.exports = prisma;
