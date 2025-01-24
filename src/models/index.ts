import mongoose from 'mongoose';
import { UserSchema } from './schemas/user.schema';
import { IUser } from '../types/user.types';

export const User = mongoose.model<IUser>('User', UserSchema);
