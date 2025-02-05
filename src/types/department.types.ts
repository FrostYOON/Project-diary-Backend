import { Document, Types } from 'mongoose';

export const DEPARTMENTS = ['ceo', 'hr', 'sales', 'marketing', 'design', 'development', 'other'];
export type DepartmentName = typeof DEPARTMENTS[number];

export interface IDepartment extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  name: DepartmentName;
  createdAt: Date;
  updatedAt: Date;
}