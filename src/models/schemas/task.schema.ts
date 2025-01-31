import { Schema } from "mongoose";
import { ITask, TASK_STATUS, TASK_TAGS, TASK_PRIORITY } from "../../types/task.types";

const TaskSchema: Schema<ITask> = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    required: true,
    enum: TASK_STATUS,
  },
  tag: { type: String, enum: TASK_TAGS, required: true },
  priority: { type: String, enum: TASK_PRIORITY, required: true },
  project: { type: Schema.Types.ObjectId, ref: "Project" },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default TaskSchema;
