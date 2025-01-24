import express from 'express';
import { signUpValidator } from '../../../validators/auth.validator';
import { signUpController } from '../../../controllers/auth.controller';

const router = express.Router();

router.get('/', )
router.post('/signup', signUpValidator, signUpController);

export default router;
