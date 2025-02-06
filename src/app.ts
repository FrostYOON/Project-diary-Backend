import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
import routes from './routes/api/v1/index';
import './config/passport';  // Passport 설정 import
import { customLogger } from './middlewares/logger.middleware';

dotenv.config();

const app = express();

// 미들웨어 순서 중요
app.use(express.json());  // JSON 파싱
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(morgan('dev'));
app.use(customLogger);
app.use(passport.initialize());  // Passport 초기화

// 보안 미들웨어
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/v1', routes);

// 캐시 비활성화 미들웨어 추가
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100 // IP당 최대 요청 수
});
app.use('/api', limiter);

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
  },
  apis: [
    './src/docs/**/*.yaml',  // 모든 yaml 파일 포함
  ],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 에러 핸들링
app.use(errorHandler);

export default app;