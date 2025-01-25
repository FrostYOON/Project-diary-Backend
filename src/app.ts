import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
import routes from './routes/api/v1/index';

dotenv.config();

const app = express();

// 보안 미들웨어
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100 // IP당 최대 요청 수
});
app.use('/api', limiter);

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(passport.initialize());

// Passport 설정
// passportConfig();

// 스웨거 설정
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '프로젝트 관리 API',
      version: '1.0.0',
      description: '프로젝트 및 작업 관리를 위한 API',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/docs/**/*.yaml'],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  if (!req.cookies["token"]) {
    return next();
  }

  passport.authenticate("jwt", { session: false })(req, res, next);
});

// 라우트 설정
app.use('/api/v1', routes);

// 에러 핸들링
app.use(errorHandler);

export default app;