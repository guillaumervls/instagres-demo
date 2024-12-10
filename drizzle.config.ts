import assert from "assert";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

assert(process.env.DATABASE_URL, "DATABASE_URL is required");

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
