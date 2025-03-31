import { z } from "zod";

// URL schema for validation
export const urlFormSchema = z.object({
  longUrl: z.string().url(),
  customAlias: z.string().optional(),
});

// Types
export type UrlForm = z.infer<typeof urlFormSchema>;

// These types represent the MongoDB documents
export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Url {
  id: string;
  shortCode: string;
  longUrl: string;
  customAlias?: string | null;
  createdAt: Date;
  clicks: number;
}

export interface InsertUser {
  username: string;
  password: string;
}

export interface InsertUrl {
  longUrl: string;
  shortCode?: string;
  customAlias?: string;
}
