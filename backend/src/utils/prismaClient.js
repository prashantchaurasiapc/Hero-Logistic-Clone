const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/hero-logistic';

function parseDbUrl(urlStr) {
  try {
    const url = new URL(urlStr);
    return {
      host: url.hostname || 'localhost',
      port: url.port ? parseInt(url.port, 10) : 3306,
      user: url.username || 'root',
      password: url.password || '',
      database: url.pathname ? url.pathname.replace(/^\//, '') : 'hero-logistic',
    };
  } catch (err) {
    return { host: 'localhost', port: 3306, user: 'root', password: '', database: 'hero-logistic' };
  }
}

const poolConfig = parseDbUrl(dbUrl);
const pool = mariadb.createPool(poolConfig);
const adapter = new PrismaMariaDb(pool);

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ adapter });
  }
  prisma = global.prisma;
}

module.exports = prisma;
