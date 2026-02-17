import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "./schema";

const client = createClient({
  url: "file:siidona1.db",
});

const db = drizzle(client, { schema });

await migrate(db, { migrationsFolder: "./src/db/migrations" });
console.log("Migrations completed!");
