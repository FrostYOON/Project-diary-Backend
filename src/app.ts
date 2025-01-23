import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import routes from './routes/api/v1/index';
// import { passportConfig } from './config/passport';

dotenv.config();

const app = express();

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

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((req, res, next) => {
  if (!req.cookies["token"]) {
    return next();
  }

  passport.authenticate("jwt", { session: false })(req, res, next);
});

// 라우트 설정
app.use('/api/v1', routes);

export default app;