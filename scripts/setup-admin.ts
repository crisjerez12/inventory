import { initializeDatabase } from "@/lib/init-db";

async function setupAdmin() {
  console.log("Setting up admin user...");
  await initializeDatabase();
  console.log("Admin setup complete!");
}

setupAdmin().catch(console.error);
