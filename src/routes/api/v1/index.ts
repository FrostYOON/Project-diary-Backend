import express from "express";
import authRoutes from "./auth.routes";
import weatherRoutes from './weather.routes';
import projectRoutes from './project.routes';
import departmentRoutes from './department.routes';
import taskRoutes from './task.routes';
import userRoutes from './user.routes';
import notificationRoutes from './notification.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/departments', departmentRoutes);
router.use('/tasks', taskRoutes);
router.use('/departments', departmentRoutes);
router.use('/tasks', taskRoutes);
router.use('/weather', weatherRoutes);
router.use('/users', userRoutes);
router.use('/notifications', notificationRoutes);

export default router;