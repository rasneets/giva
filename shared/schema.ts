import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Keep the users table as it's already defined
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Define the URL shortener table
export const urls = pgTable("urls", {
  id: serial("id").primaryKey(),
  shortCode: text("short_code").notNull().unique(),
  longUrl: text("long_url").notNull(),
  customAlias: text("custom_alias"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  clicks: integer("clicks").default(0).notNull(),
});

// Define Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertUrlSchema = createInsertSchema(urls).pick({
  longUrl: true,
  shortCode: true,
  customAlias: true,
});

export const urlFormSchema = z.object({
  longUrl: z.string().url(),
  customAlias: z.string().optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertUrl = z.infer<typeof insertUrlSchema>;
export type Url = typeof urls.$inferSelect;
export type UrlForm = z.infer<typeof urlFormSchema>;
