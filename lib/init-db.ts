import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export async function initializeDatabase() {
  try {
    // Check if admin user exists
    const adminUser = await prisma.user.findFirst({
      where: { role: "Admin" },
    });

    if (!adminUser) {
      // Create default admin user
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      await prisma.user.create({
        data: {
          username: "admin",
          password: hashedPassword,
          role: "Admin",
        },
      });

      console.log("Default admin user created: admin/admin123");
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}
