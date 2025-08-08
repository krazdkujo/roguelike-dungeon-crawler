import { Router } from 'express';
import { 
  register, 
  login, 
  refresh, 
  logout, 
  me,
  registerValidation,
  loginValidation
} from '@/controllers/authController';
import { authenticateJWT } from '@/middleware/auth';

const router = Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh', refresh);

// Protected routes
router.post('/logout', authenticateJWT, logout);
router.get('/me', authenticateJWT, me);

export default router;