import express from 'express';
import { 
  getDepartmentController,
  createDepartmentController,
  getDepartmentByIdController,
  updateDepartmentController,
  deleteDepartmentController
} from '../../../controllers/department.controller';
import { 
  validateDepartmentId,
  validateDepartmentData 
} from '../../../validators/department.validator';
import { adminCheck } from '../../../middlewares/department.middleware';

const router = express.Router();

router.get('/', getDepartmentController);
router.post('/', [adminCheck, validateDepartmentData], createDepartmentController);
router.get('/:id', validateDepartmentId, getDepartmentByIdController);
router.put('/:id', [adminCheck, validateDepartmentId, validateDepartmentData], updateDepartmentController);
router.delete('/:id', [adminCheck, validateDepartmentId], deleteDepartmentController);

export default router;