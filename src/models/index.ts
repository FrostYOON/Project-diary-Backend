import mongoose from 'mongoose';
import UserSchema from './schemas/user.schema';
import { IUser, IUserEmailTaken } from '../types/user.types';

export const User = mongoose.model<IUser, IUserEmailTaken>('User', UserSchema);
