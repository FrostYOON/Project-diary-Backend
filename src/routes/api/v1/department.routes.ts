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

const router = express.Router();

router.get('/', getDepartmentController);
router.post('/', validateDepartmentData, createDepartmentController);
router.get('/:id', validateDepartmentId, getDepartmentByIdController);
router.put('/:id', [validateDepartmentId, validateDepartmentData], updateDepartmentController);
router.delete('/:id', validateDepartmentId, deleteDepartmentController);

export default router;