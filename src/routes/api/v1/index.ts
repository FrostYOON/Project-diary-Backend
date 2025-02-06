import express from "express";
import authRoutes from "./auth.routes";
import weatherRoutes from './weather.routes';
import projectRoutes from './project.routes';
import departmentRoutes from './department.routes';
import taskRoutes from './task.routes';
import userRoutes from './user.routes';
import notificationRoutes from './notification.routes';
import passport from 'passport';

const router = express.Router();

const authenticateJWT = passport.authenticate('jwt', { session: false });

// 라우트 설정
router.use('/auth', authRoutes);
router.use('/projects', authenticateJWT, projectRoutes);
router.use('/departments', authenticateJWT, departmentRoutes);
router.use('/tasks', authenticateJWT, taskRoutes);
router.use('/departments', authenticateJWT, departmentRoutes);
router.use('/weather', authenticateJWT, weatherRoutes);
router.use('/users', authenticateJWT, userRoutes);
router.use('/notifications', authenticateJWT, notificationRoutes);

export default router;