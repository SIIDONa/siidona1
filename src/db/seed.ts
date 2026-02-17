import { db } from "./index";
import { users, categories } from "./schema";
import { hashPassword } from "@/lib/auth";

async function seed() {
  console.log("Seeding database...");

  // Create admin user
  const hashedPassword = await hashPassword("admin123");
  await db.insert(users).values({
    name: "Admin",
    email: "admin@siidona1.com",
    password: hashedPassword,
    role: "admin",
  });

  // Create categories
  const categoriesToAdd = [
    { name: "Electronics", slug: "electronics", description: "Phones, computers, and gadgets" },
    { name: "Vehicles", slug: "vehicles", description: "Cars, motorcycles, and bikes" },
    { name: "Real Estate", slug: "real-estate", description: "Houses, apartments, and land" },
    { name: "Furniture", slug: "furniture", description: "Home and office furniture" },
    { name: "Fashion", slug: "fashion", description: "Clothing, shoes, and accessories" },
    { name: "Services", slug: "services", description: "Professional and personal services" },
    { name: "Jobs", slug: "jobs", description: "Job listings and opportunities" },
    { name: "Other", slug: "other", description: "Miscellaneous items" },
  ];

  for (const category of categoriesToAdd) {
    await db.insert(categories).values(category);
  }

  console.log("Database seeded successfully!");
  console.log("Admin credentials:");
  console.log("Email: admin@siidona1.com");
  console.log("Password: admin123");
}

seed().catch(console.error);
