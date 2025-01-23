import mongoose from 'mongoose';
import { UserSchema, IUser } from './schemas/user.schema';

export const User = mongoose.model<IUser>('User', UserSchema);
