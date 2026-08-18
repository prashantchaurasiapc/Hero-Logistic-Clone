require('dotenv').config(); // Trigger nodemon restart for cleaned fallback entries
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

let prisma;

try {
  const dbUrl = process.env.DATABASE_URL || 'mysql://root:@127.0.0.1:3306/hero-logistic';
  const urlObj = new URL(dbUrl);
  
  const host = (urlObj.hostname === 'localhost' || !urlObj.hostname) ? '127.0.0.1' : urlObj.hostname;
  const port = Number(urlObj.port) || 3306;
  const user = urlObj.username || 'root';
  const password = urlObj.password ? decodeURIComponent(urlObj.password) : '';
  const database = urlObj.pathname ? urlObj.pathname.replace(/^\//, '') : 'hero-logistic';

  const adapter = new PrismaMariaDb({
    host,
    port,
    user,
<<<<<<< HEAD
    password: password || '',
    database,
    connectionLimit: 50,
    acquireTimeout: 20000,
    connectTimeout: 20000
  }, { useTextProtocol: true });
=======
    password,
    database,
    connectionLimit: 20,
    allowPublicKeyRetrieval: true,
    connectTimeout: 10000
  });
>>>>>>> 91967a4cc51d995fe329d743868334a7005e77e5

  prisma = new PrismaClient({ adapter });
} catch (err) {
  console.error('Failed to initialize PrismaMariaDb adapter, falling back to standard PrismaClient:', err);
  prisma = new PrismaClient();
}

module.exports = prisma;
