import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import {
  Strategy as GoogleStrategy,
  StrategyOptionsWithRequest,
} from "passport-google-oauth20";
import { Strategy as NaverStrategy, StrategyOption } from 'passport-naver';
import { User } from "../models";
import dotenv from "dotenv";
import { Request } from "express";
import { IUser } from "../types/user.types";
import { googleAuthService } from "../services/google-auth.service";
import { GoogleProfile } from "../types/auth.types";
import { naverAuthService } from "../services/naver-auth.service";
import { NaverProfile } from "../types/auth.types";
import bcrypt from "bcrypt";
dotenv.config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "fallback-secret",
};

// Google OAuth 설정
const googleConfig: StrategyOptionsWithRequest = {
  clientID: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  callbackURL: "http://localhost:3001/api/v1/auth/login/google/callback",
  passReqToCallback: true,
};

// Google 전략 설정
passport.use(
  new GoogleStrategy(
    googleConfig,
    async (req: Request, accessToken: string, refreshToken: string, profile, done) => {
      try {
        const result = await googleAuthService.handleGoogleAuth(profile as GoogleProfile);
        if (!result.data || !result.data.user) {
          return done(new Error("사용자 정보를 가져올 수 없습니다."), false);
        }
        
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

// Naver OAuth 설정
const naverConfig: StrategyOption = {
  clientID: process.env.NAVER_CLIENT_ID || "",
  clientSecret: process.env.NAVER_CLIENT_SECRET || "",
  callbackURL: process.env.NAVER_CALLBACK_URL || 'http://localhost:3001/api/v1/auth/login/naver/callback'
};

// Naver 전략 설정
passport.use(
  new NaverStrategy(
    naverConfig,
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        const naverProfile: NaverProfile = {
          id: profile._json.id,
          emails: [{ value: profile._json.email }],
          displayName: profile._json.nickname
        };

        const result = await naverAuthService.handleNaverAuth(naverProfile);
        
        if (!result.data || !result.data.user) {
          return done(new Error("사용자 정보를 가져올 수 없습니다."), false);
        }
        
        return done(null, {
          ...result.data.user,
          accessToken: result.data.accessToken
        });
      } catch (error) {
        console.error('Naver strategy error:', error);
        return done(error, false);
      }
    }
  )
);

// Local Strategy 설정
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email: string, password: string, done) => {
      try {
        const user = await User.findOne({ email, registerType: 'normal' });
        
        if (!user) {
          return done(null, false, { message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }

        const isMatch = await bcrypt.compare(password, user.password || '');
        if (!isMatch) {
          return done(null, false, { message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }

        return done(null, user);
      } catch (error) {
        console.error('Local strategy error:', error);
        return done(error);
      }
    }
  )
);

// JWT Strategy 설정
passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      console.error("JWT Strategy Error:", error);
      return done(error, false);
    }
  })
);

export default passport;
