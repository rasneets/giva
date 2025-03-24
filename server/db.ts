import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { log } from "./vite";

// Use DATABASE_URL from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined. Please make sure it's set in your environment variables.");
}

// Create neon HTTP connection - this avoids WebSocket issues
const sql = neon(connectionString, { 
  fetchOptions: {
    // Use HTTP instead of WebSockets
    preferWebSockets: false,
  }
});

// Initialize drizzle with the HTTP connection
export const db = drizzle(sql);

log("Database connection initialized with HTTP mode", "db");
