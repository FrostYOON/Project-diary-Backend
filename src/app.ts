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
import path from 'path';
import fs from 'fs';

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
  exposedHeaders: ['Content-Type', 'Authorization'],
}));

// 이미지 파일에 대한 별도의 CORS 설정
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : 'http://localhost:5173');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

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

// uploads 디렉토리 경로 확인
const uploadsPath = path.join(__dirname, '../uploads');
console.log('Uploads directory path:', uploadsPath);

// uploads 디렉토리 존재 확인 및 생성
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('Created uploads directory');
}

// 정적 파일 제공 설정 (절대 경로 사용)
app.use('/uploads', express.static(uploadsPath));

// 디버깅을 위한 미들웨어
app.use('/uploads', (req, res, next) => {
  console.log('Requested file path:', path.join(uploadsPath, req.path));
  console.log('File exists:', fs.existsSync(path.join(uploadsPath, req.path)));
  next();
});

export default app;