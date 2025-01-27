import { Schema } from "mongoose";
import { ITask } from "../../types/task.types";

const TaskSchema: Schema<ITask> = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    required: true,
    enum: ["준비", "진행중", "완료", "보류"],
  },
  tag: { type: String },
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default TaskSchema;
