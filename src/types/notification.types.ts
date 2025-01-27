import { Document, Types } from "mongoose";

export interface INotification extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  title: string;
  content: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}