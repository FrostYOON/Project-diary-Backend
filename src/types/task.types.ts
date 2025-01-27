import { Document, Types } from "mongoose";

export const TASK_STATUS = ['준비', '진행', '완료', '보류'];
export const TASK_TAGS = ['기획', '디자인', '개발', '마케팅', '기타'];
export type TaskStatus = typeof TASK_STATUS[number];
export type TaskTag = typeof TASK_TAGS[number];

export interface ITask extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: TaskStatus;
  tag: TaskTag;
  project: Types.ObjectId;
  author: Types.ObjectId;
}