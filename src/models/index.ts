import mongoose from 'mongoose';
import UserSchema from './schemas/user.schema';
import ProjectSchema from './schemas/project.schema';
import TaskSchema from './schemas/task.schema';
import DepartmentSchema from './schemas/department.schema';
import NotificationSchema from './schemas/notification.schema';
import { IUser } from '../types/user.types';
import { IUserEmailTaken } from '../types/auth.types';
import { IProject } from '../types/project.types';
import { ITask } from '../types/task.types';
import { IDepartment } from '../types/department.types';
import { INotification } from '../types/notification.types';

export const User = mongoose.model<IUser, IUserEmailTaken>('User', UserSchema);
export const Project = mongoose.model<IProject>('Project', ProjectSchema);
export const Task = mongoose.model<ITask>('Task', TaskSchema);
export const Department = mongoose.model<IDepartment>('Department', DepartmentSchema);
export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);