import { IUser } from './user.types';

declare global {
  namespace Express {
    interface User {
      _id: IUser['_id'];
      email: IUser['email'];
      name: IUser['name'];
      role: IUser['role'];
      // ... 필요한 다른 필드들
    }
  }
}

export {};