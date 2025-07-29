import { PrismaClient } from "@prisma/client";
import { inventoryData } from "../lib/inventory-data";

const prisma = new PrismaClient();

async function main() {
  // Create admin user if not exists
  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq/3/HK", // password: admin123
      role: "Admin",
    },
  });

  // Seed items from inventory data
  for (const item of inventoryData) {
    const createdItem = await prisma.item.create({
      data: {
        name: item.name,
        category: item.category,
        stock: item.stock,
      },
    });

    // Create initial history record
    await prisma.history.create({
      data: {
        itemId: createdItem.id,
        userId: adminUser.id,
        itemName: createdItem.name,
        category: createdItem.category,
        quantity: createdItem.stock,
        action: "create",
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
