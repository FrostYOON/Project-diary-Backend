import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  phone?: string;
  birth?: Date;
  department: Department;
  register_type: AuthProvider;
  social_id?: string;
  role: UserRole;
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type Department = "ceo" | "hr" | "sales" | "marketing" | "design" | "development" | "other";
export type AuthProvider = "normal" | "google";
export type UserRole = "user" | "manager" | "admin" | "superadmin";

export const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  phone: { type: String },
  birth: { type: Date },
  department: {
    type: String,
    enum: ["ceo", "hr", "sales", "marketing", "design", "development", "other"],
    required: true,
    default: "other",
  },
  register_type: {
    type: String,
    enum: ["normal", "google"],
    required: true,
    default: "normal",
  },
  social_id: { type: String },
  role: {
    type: String,
    enum: ["user", "manager", "admin", "superadmin"],
    required: true,
    default: "user",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});