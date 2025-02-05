import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { IUser } from '../types/user.types';
import { AuthError } from '../types/error';

export class TokenService {
  generateToken(user: IUser): string {
    if (!process.env.JWT_SECRET) {
      throw new AuthError('JWT_SECRET is not defined');
    }
    
    return jwt.sign(
      { 
        id: user._id.toString(),
        email: user.email.toString(),
        name: user.name.toString(),
        role: user.role.toString(),
        departmentId: user.department?.toString()
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
  }

  setCookie(res: Response, token: string): void {
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000
    });
  }

  clearCookie(res: Response): void {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
  }
}

export const tokenService = new TokenService(); 