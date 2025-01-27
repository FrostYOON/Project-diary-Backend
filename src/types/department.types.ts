import { Document, Types } from "mongoose";

export const DEPARTMENTS = [
  'ceo',
  'hr',
  'sales',
  'marketing',
  'design',
  'development',
  'other'
] as const;

export type Department = typeof DEPARTMENTS[number];

export interface IDepartment extends Document<Types.ObjectId> {
  name: Department;
}