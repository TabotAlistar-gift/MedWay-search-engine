const { PrismaClient } = require('@prisma/client');
try {
  console.log('Attempting to initialize PrismaClient...');
  const prisma = new PrismaClient();
  console.log('Success with default constructor');
} catch (e) {
  console.log('Failed with default constructor:', e.message);
}

try {
  console.log('Attempting with datasourceUrl...');
  const prisma = new PrismaClient({ datasourceUrl: 'file:./dev.db' });
  console.log('Success with datasourceUrl');
} catch (e) {
  console.log('Failed with datasourceUrl:', e.message);
}

try {
  console.log('Attempting with datasources...');
  const prisma = new PrismaClient({ datasources: { db: { url: 'file:./dev.db' } } });
  console.log('Success with datasources');
} catch (e) {
  console.log('Failed with datasources:', e.message);
}
