import { Router } from 'express';
import {
  getTaskController,
  createTaskController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController
} from '../../../controllers/task.controller';
import { validateTaskData, validateTaskId } from '../../../validators/task.validator';

const router = Router();

router.get('/', getTaskController);
router.post('/', validateTaskData, createTaskController);
router.get('/:id', validateTaskId, getTaskByIdController);
router.put('/:id', validateTaskId, validateTaskData, updateTaskController);
router.delete('/:id', validateTaskId, deleteTaskController);

export default router;