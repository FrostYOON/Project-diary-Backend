import { Router } from 'express';
import { 
  getProjectListController, 
  getProjectByIdController,  // 추가 필요
  createProjectController, 
  updateProjectController, 
  deleteProjectController 
} from '../../../controllers/project.controller';
import { authenticateToken } from '../../../middlewares/auth.middleware';
import { validateProjectCreate, validateProjectUpdate } from '../../../validators/project.validator';

const router = Router();

// 프로젝트 목록 조회
router.get('/', authenticateToken, getProjectListController);

// 프로젝트 상세 조회 (추가 필요)
router.get('/:id', authenticateToken, getProjectByIdController);

// 프로젝트 생성
router.post('/', authenticateToken, validateProjectCreate, createProjectController);

// 프로젝트 수정
router.put('/:id', authenticateToken, validateProjectUpdate, updateProjectController);

// 프로젝트 삭제
router.delete('/:id', authenticateToken, deleteProjectController);

export default router;