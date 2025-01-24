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

const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
  passReqToCallback: true
} as StrategyOptionsWithRequest;


passport.use(
  new LocalStrategy(config, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, { message: '존재하지 않는 사용자입니다.' });
      }

      const isMatch = await bcrypt.compare(password, user.password || '');
      if (!isMatch) {
        return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(jwtConfig, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (!user) {
        return done(null, false, { message: '존재하지 않는 사용자입니다.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.use(
  new GoogleStrategy(googleConfig, async (req, accessToken, refreshToken, profile, done) => {
    try {
      const user = await authService.googleSignup(profile);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

export default passport;