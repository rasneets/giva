import mongoose, { Schema, Document } from 'mongoose';

// User interface
export interface IUser extends Document {
  username: string;
  password: string;
}

// URL interface
export interface IUrl extends Document {
  shortCode: string;
  longUrl: string;
  customAlias?: string;
  createdAt: Date;
  clicks: number;
}

// Define User Schema
const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Define URL Schema
const UrlSchema = new Schema<IUrl>({
  shortCode: { type: String, required: true, unique: true },
  longUrl: { type: String, required: true },
  customAlias: { type: String },
  createdAt: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 }
});

// Create models if they don't exist
export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const UrlModel = mongoose.models.Url || mongoose.model<IUrl>('Url', UrlSchema);