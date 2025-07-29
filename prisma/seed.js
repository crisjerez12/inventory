
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      role: 'Admin',
    },
  });

  // Create sample inventory items
  const items = [
    { name: 'Laptop', category: 'Electronics', quantity: 25, price: 999.99, location: 'Warehouse A' },
    { name: 'Office Chair', category: 'Furniture', quantity: 50, price: 199.99, location: 'Warehouse B' },
    { name: 'Printer Paper', category: 'Office Supplies', quantity: 200, price: 25.99, location: 'Storage Room' },
    { name: 'Wireless Mouse', category: 'Electronics', quantity: 75, price: 29.99, location: 'Warehouse A' },
    { name: 'Desk Lamp', category: 'Furniture', quantity: 30, price: 79.99, location: 'Warehouse B' },
  ];

  for (const item of items) {
    await prisma.inventoryItem.upsert({
      where: { name: item.name },
      update: {},
      create: item,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
