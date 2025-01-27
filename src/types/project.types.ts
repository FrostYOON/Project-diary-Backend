import { Document, Model, Types } from "mongoose";
import { IUser } from "./user.types";
export interface IProject extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  title: string;
  manager: string[];
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  author: Types.ObjectId | IUser;
}
