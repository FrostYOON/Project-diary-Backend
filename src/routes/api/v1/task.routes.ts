import { Router } from 'express';
import passport from 'passport';
import {
  getTaskController,
  createTaskController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController
} from '../../../controllers/task.controller';
import { validateTaskData, validateTaskId } from '../../../validators/task.validator';

const router = Router();
const authenticateJWT = passport.authenticate('jwt', { session: false });

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateJWT);

router.get('/', getTaskController);
router.post('/', validateTaskData, createTaskController);
router.get('/:id', validateTaskId, getTaskByIdController);
router.put('/:id', validateTaskId, validateTaskData, updateTaskController);
router.delete('/:id', validateTaskId, deleteTaskController);

export default router;