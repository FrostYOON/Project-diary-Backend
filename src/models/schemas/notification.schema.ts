import { Schema } from "mongoose";
import { INotification } from "../../types/notification.types";

const NotificationSchema: Schema<INotification> = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default NotificationSchema;