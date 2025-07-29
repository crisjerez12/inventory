import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function createDefaultAdmin() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (!existingAdmin) {
      const hashedPassword = await hashPassword('admin123');
      await prisma.user.create({
        data: {
          username: 'admin',
          password: hashedPassword,
          role: 'Admin',
        },
      });
      console.log('Default admin user created: username=admin, password=admin123');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(
  username: string,
  password: string,
  role: string = "Staff"
) {
  const hashedPassword = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });
    return {
      success: true,
      user: { id: user.id, username: user.username, role: user.role },
    };
  } catch (error) {
    return { success: false, error: "Username already exists" };
  }
}

export async function authenticateUser(username: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      return { success: false, error: "Invalid credentials" };
    }
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return { success: false, error: "Invalid credentials" };
    }

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  } catch (error) {
    return { success: false, error: "Authentication failed" };
  }
}
