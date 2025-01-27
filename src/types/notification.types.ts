import { Document } from "mongoose";

export interface INotification extends Document {
  title: string;
  content: string;
  status: string;
  createdAt: Date;
}