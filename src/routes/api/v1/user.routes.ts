import { Router } from 'express';
import passport from 'passport';
import { 
  createUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getMeController
} from '../../../controllers/user.controller';

const router = Router();
const authenticateJWT = passport.authenticate('jwt', { session: false });

router.get('/me', authenticateJWT, getMeController);

// CRUD 라우트
router.post('/', authenticateJWT, createUserController);
router.get('/', authenticateJWT, getAllUsersController);
router.get('/:id', authenticateJWT, getUserByIdController);
router.put('/:id', authenticateJWT, updateUserController);
router.delete('/:id', authenticateJWT, deleteUserController);

export default router;
