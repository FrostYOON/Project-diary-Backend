import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Strategy as GoogleStrategy, StrategyOptionsWithRequest } from 'passport-google-oauth20';
import { User } from '../models';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Request } from 'express';
import { authService } from '../services/auth.service';

dotenv.config();

const config = {
  usernameField: 'email',
  passwordField: 'password',
}

const jwtConfig: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req: Request) => {
      if (req?.cookies?.token) {
        return req.cookies.token;
      }
      return null;
    },
  ]),
  secretOrKey: process.env.JWT_SECRET || '',
};

