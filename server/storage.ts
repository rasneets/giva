import { users, type User, type InsertUser, urls, type Url, type InsertUrl } from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { nanoid } from "nanoid";

// Update the IStorage interface to include URL shortener methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // URL shortener methods
  createShortUrl(longUrl: string, customAlias?: string): Promise<Url>;
  getUrlByShortCode(shortCode: string): Promise<Url | undefined>;
  incrementUrlClicks(shortCode: string): Promise<void>;
  getRecentUrls(limit?: number): Promise<Url[]>;
  isShortCodeAvailable(shortCode: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // URL shortener methods
  async createShortUrl(longUrl: string, customAlias?: string): Promise<Url> {
    // Generate short code, use custom alias if provided and available
    const shortCode = customAlias || this.generateShortCode();
    
    // Check if custom alias is available if specified
    if (customAlias) {
      const isAvailable = await this.isShortCodeAvailable(customAlias);
      if (!isAvailable) {
        throw new Error("Custom alias is already in use. Please choose a different one.");
      }
    }
    
    // Insert into database
    const [url] = await db
      .insert(urls)
      .values({
        shortCode,
        longUrl,
        customAlias: customAlias || null,
      })
      .returning();
    
    return url;
  }
  
  async getUrlByShortCode(shortCode: string): Promise<Url | undefined> {
    const [url] = await db
      .select()
      .from(urls)
      .where(eq(urls.shortCode, shortCode));
    
    return url;
  }
  
  async incrementUrlClicks(shortCode: string): Promise<void> {
    // First get the current URL record
    const [url] = await db
      .select()
      .from(urls)
      .where(eq(urls.shortCode, shortCode));
    
    if (url) {
      // Then increment the clicks count
      await db
        .update(urls)
        .set({ clicks: url.clicks + 1 })
        .where(eq(urls.shortCode, shortCode));
    }
  }
  
  async getRecentUrls(limit: number = 10): Promise<Url[]> {
    return db
      .select()
      .from(urls)
      .orderBy(urls.createdAt)
      .limit(limit);
  }
  
  async isShortCodeAvailable(shortCode: string): Promise<boolean> {
    const [existingUrl] = await db
      .select()
      .from(urls)
      .where(eq(urls.shortCode, shortCode));
    
    return !existingUrl;
  }
  
  // Helper method to generate random short code
  private generateShortCode(length: number = 6): string {
    return nanoid(length);
  }
}

// Use DatabaseStorage for production
export const storage = new DatabaseStorage();
