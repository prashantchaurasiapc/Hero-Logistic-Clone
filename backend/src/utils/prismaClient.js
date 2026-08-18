require('dotenv').config(); // Trigger nodemon restart for cleaned fallback entries
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

let prisma;

try {
  const dbUrl = process.env.DATABASE_URL || 'mysql://root:@127.0.0.1:3306/hero-logistic';
<<<<<<< HEAD
  const urlObj = new URL(dbUrl);
  
  const host = (urlObj.hostname === 'localhost' || !urlObj.hostname) ? '127.0.0.1' : urlObj.hostname;
  const port = Number(urlObj.port) || 3306;
  const user = urlObj.username || 'root';
  const password = urlObj.password ? decodeURIComponent(urlObj.password) : '';
  const database = urlObj.pathname ? urlObj.pathname.replace(/^\//, '') : 'hero-logistic';
=======
  let host = '127.0.0.1';
  let port = 3306;
  let user = 'root';
  let password = undefined;
  let database = 'hero-logistic';

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
>>>>>>> a11974143e328523b1e9500d17002fd6015a68b2

  const adapter = new PrismaMariaDb({
    host,
    port,
    user,
<<<<<<< HEAD
    password,
    database,
    connectionLimit: 20,
    allowPublicKeyRetrieval: true,
    connectTimeout: 10000
  });
=======
    password: password || '',
    database
  }, { useTextProtocol: true });
>>>>>>> a11974143e328523b1e9500d17002fd6015a68b2

  prisma = new PrismaClient({ adapter });
} catch (err) {
  console.error('Failed to initialize PrismaMariaDb adapter, falling back to standard PrismaClient:', err);
  prisma = new PrismaClient();
}

module.exports = prisma;
