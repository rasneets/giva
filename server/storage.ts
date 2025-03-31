import { type User, type InsertUser, type Url } from "@shared/schema";
import { nanoid } from "nanoid";
import connectToDatabase from "./mongodb";
import { IUser, IUrl, UserModel, UrlModel } from "./models";

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
    await connectToDatabase();
    const user = await UserModel.findById(id).lean() as any;
    
    if (!user) return undefined;
    
    return {
      id: user._id.toString(),
      username: user.username,
      password: user.password
    } as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    await connectToDatabase();
    const user = await UserModel.findOne({ username }).lean() as any;
    
    if (!user) return undefined;
    
    return {
      id: user._id.toString(),
      username: user.username,
      password: user.password
    } as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    await connectToDatabase();
    const newUser = new UserModel({
      username: insertUser.username,
      password: insertUser.password
    });
    
    const savedUser = await newUser.save();
    
    return {
      id: savedUser._id.toString(),
      username: savedUser.username,
      password: savedUser.password
    } as User;
  }
  
  // URL shortener methods
  async createShortUrl(longUrl: string, customAlias?: string): Promise<Url> {
    try {
      console.log("Starting createShortUrl with longUrl:", longUrl, "customAlias:", customAlias);
      await connectToDatabase();
      console.log("Database connection established");
      
      // Generate short code, use custom alias if provided and available
      const shortCode = customAlias || this.generateShortCode();
      console.log("Generated shortCode:", shortCode);
      
      // Check if custom alias is available if specified
      if (customAlias) {
        console.log("Checking if custom alias is available");
        const isAvailable = await this.isShortCodeAvailable(customAlias);
        console.log("Custom alias available:", isAvailable);
        if (!isAvailable) {
          throw new Error("Custom alias is already in use. Please choose a different one.");
        }
      }
      
      // Insert into database
      console.log("Creating new URL document in MongoDB");
      const newUrl = new UrlModel({
        shortCode,
        longUrl,
        customAlias: customAlias || null,
        createdAt: new Date(),
        clicks: 0
      });
      
      console.log("Saving URL document to MongoDB");
      const savedUrl = await newUrl.save();
      console.log("URL saved successfully:", savedUrl);
      
      return {
        id: savedUrl._id.toString(),
        shortCode: savedUrl.shortCode,
        longUrl: savedUrl.longUrl,
        customAlias: savedUrl.customAlias,
        createdAt: savedUrl.createdAt,
        clicks: savedUrl.clicks
      } as Url;
    } catch (error) {
      console.error("Error in createShortUrl:", error);
      throw error;
    }
  }
  
  async getUrlByShortCode(shortCode: string): Promise<Url | undefined> {
    await connectToDatabase();
    const url = await UrlModel.findOne({ shortCode }).lean() as any;
    
    if (!url) return undefined;
    
    return {
      id: url._id.toString(),
      shortCode: url.shortCode,
      longUrl: url.longUrl,
      customAlias: url.customAlias,
      createdAt: url.createdAt,
      clicks: url.clicks
    } as Url;
  }
  
  async incrementUrlClicks(shortCode: string): Promise<void> {
    await connectToDatabase();
    await UrlModel.findOneAndUpdate(
      { shortCode },
      { $inc: { clicks: 1 } }
    );
  }
  
  async getRecentUrls(limit: number = 10): Promise<Url[]> {
    await connectToDatabase();
    const urls = await UrlModel.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean() as any[];
    
    return urls.map(url => ({
      id: url._id.toString(),
      shortCode: url.shortCode,
      longUrl: url.longUrl,
      customAlias: url.customAlias,
      createdAt: url.createdAt,
      clicks: url.clicks
    })) as Url[];
  }
  
  async isShortCodeAvailable(shortCode: string): Promise<boolean> {
    await connectToDatabase();
    const existingUrl = await UrlModel.findOne({ shortCode }).lean();
    return !existingUrl;
  }
  
  // Helper method to generate random short code
  private generateShortCode(length: number = 6): string {
    return nanoid(length);
  }
}

// Use DatabaseStorage for production
export const storage = new DatabaseStorage();
