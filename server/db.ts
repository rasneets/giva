import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { log } from "./vite";

// Use DATABASE_URL from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined. Please make sure it's set in your environment variables.");
}

// Create neon serverless pool
const pool = new Pool({ connectionString });

// Initialize drizzle with the connection pool
export const db = drizzle(pool);

log("Database connection initialized", "db");
