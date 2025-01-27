import { Router } from 'express';
import { 
  getProjectListController, 
  getProjectByIdController,
  createProjectController, 
  updateProjectController, 
  deleteProjectController,
} from '../../../controllers/project.controller';
import { checkProjectExists, checkProjectPermission } from '../../../middlewares/project.middleware';

const router = Router();

// 프로젝트 목록 조회
router.get('/', checkProjectExists, getProjectListController);

// 프로젝트 상세 조회 (추가 필요)
router.get('/:id', checkProjectExists, getProjectByIdController);

// 프로젝트 생성
router.post('/', checkProjectPermission, createProjectController);

// 프로젝트 수정
router.put('/:id', checkProjectPermission,  updateProjectController);

// 프로젝트 삭제
router.delete('/:id', checkProjectPermission, deleteProjectController);

export default router;