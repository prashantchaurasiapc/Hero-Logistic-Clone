require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

let prisma;

try {
  const dbUrl = process.env.DATABASE_URL || 'mysql://root:@127.0.0.1:3306/hero-logihero';
  let host = '127.0.0.1';
  let port = 3306;
  let user = 'root';
  let password = undefined;
  let database = 'hero-logihero';

  try {
    const urlObj = new URL(dbUrl);
    host = (urlObj.hostname === 'localhost' || !urlObj.hostname) ? '127.0.0.1' : urlObj.hostname;
    port = Number(urlObj.port) || 3306;
    user = urlObj.username || 'root';
    if (urlObj.password) password = urlObj.password;
    if (urlObj.pathname) database = urlObj.pathname.replace(/^\//, '');
  } catch (e) {
    // fallback to defaults
  }

  const adapter = new PrismaMariaDb({
    host,
    port,
    user,
    password: password || '',
    database
  }, { useTextProtocol: true });

  prisma = new PrismaClient({ adapter });
} catch (err) {
  console.error('Failed to initialize PrismaMariaDb adapter:', err);
  prisma = new PrismaClient();
}

module.exports = prisma;
