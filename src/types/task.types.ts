import { Document, Types } from "mongoose";

export interface ITask extends Document<Types.ObjectId> {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
  tag: string;
  project: Types.ObjectId;
  author: Types.ObjectId;
}