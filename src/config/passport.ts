import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Strategy as GoogleStrategy, StrategyOptionsWithRequest } from 'passport-google-oauth20';
import { User } from '../models';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Request } from 'express';
import { authService } from '../services/auth.service';
import { IUser } from '../types/user.types';

dotenv.config();

const config = {
  usernameField: 'email',
  passwordField: 'password',
}

const jwtConfig: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    ExtractJwt.fromUrlQueryParameter('token'),
    (req) => req?.cookies?.accessToken || null,
  ]),
  secretOrKey: process.env.JWT_SECRET || 'fallback-secret',
};

// Google OAuth 설정
const googleConfig: StrategyOptionsWithRequest = {
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: 'http://localhost:3001/api/v1/auth/login/google/callback',
  passReqToCallback: true,
};

// Google 전략 설정
passport.use(
  new GoogleStrategy(
    googleConfig,
    async (req: Request, accessToken: string, refreshToken: string, profile, done) => {
      try {
        
        const result = await authService.googleSignup(profile);
        if (!result.data || !result.data.user) {
          return done(new Error('사용자 정보를 가져올 수 없습니다.'), false);
        }
        
        // user 객체에 accessToken 추가
        const userWithToken = {
          ...result.data.user,
          accessToken: result.data.accessToken
        } as unknown as IUser;
        
        return done(null, userWithToken);
      } catch (error) {
        console.error('Google strategy error:', error);
        return done(error, false);
      }
    }
  )
);

// Local Strategy 설정
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      
      if (!user || !user.password) {
        return done(null, false, { message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// JWT Strategy 설정
passport.use(new JwtStrategy(jwtConfig, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;

