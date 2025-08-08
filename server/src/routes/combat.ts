import { Router } from 'express';
import { 
  startCombat,
  getCombat,
  performCombatAction
} from '@/controllers/combatController';
import { authenticateJWT } from '@/middleware/auth';

const router = Router();

// All combat routes require authentication
router.use(authenticateJWT);

// Combat routes
router.post('/start', startCombat);
router.get('/:id', getCombat);
router.post('/:id/action', performCombatAction);

export default router;