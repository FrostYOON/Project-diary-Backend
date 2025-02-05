import { Document, Types } from "mongoose";
import { IUser } from "./user.types";


export interface IProject extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  title: string;
  department: Types.ObjectId;
  description: string;
  startDate: Date;
  endDate: Date;
  members: Types.ObjectId[];
  status: '준비' | '진행중' | '완료' | '보류';
  createdAt: Date;
  updatedAt: Date;
  author: Types.ObjectId | IUser;
  progress: number; // 진행률 (0 ~ 100)
}
