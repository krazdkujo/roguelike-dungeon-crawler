import { Router } from 'express';
import { 
  getDungeons,
  getDungeon,
  enterDungeon,
  getDungeonInstance,
  leaveDungeon
} from '@/controllers/dungeonController';
import { authenticateJWT } from '@/middleware/auth';

const router = Router();

// All dungeon routes require authentication
router.use(authenticateJWT);

// Dungeon routes
router.get('/', getDungeons);
router.get('/:id', getDungeon);
router.post('/:id/enter', enterDungeon);

// Instance routes
router.get('/instances/:id', getDungeonInstance);
router.post('/instances/:id/leave', leaveDungeon);

export default router;