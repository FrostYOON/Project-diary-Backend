import { Document, Types } from 'mongoose';

export interface IDepartment extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}