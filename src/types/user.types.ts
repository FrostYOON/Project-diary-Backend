import { Document } from 'mongoose';

export type Department = "ceo" | "hr" | "sales" | "marketing" | "design" | "development" | "other";
export type AuthType = "normal" | "google";
export type UserRole = "user" | "manager" | "admin" | "superadmin";

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  phone?: string;
  birth?: Date;
  department: Department;
  register_type: AuthType;
  social_id?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
} 