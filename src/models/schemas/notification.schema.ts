import { Schema } from "mongoose";
import { INotification } from "../../types/notification.types";

const NotificationSchema: Schema<INotification> = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  recipients: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }],
  readBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
}, {
  timestamps: true
});

export default NotificationSchema;