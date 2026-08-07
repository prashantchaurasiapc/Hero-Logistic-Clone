const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/hero-logistic';

const adapter = new PrismaMariaDb(dbUrl);

const prisma = new PrismaClient({ adapter });

module.exports = prisma;

