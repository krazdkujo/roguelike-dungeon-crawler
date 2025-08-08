import { Router } from 'express';
import { 
  getCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  getCharacterClasses,
  createCharacterValidation
} from '@/controllers/characterController';
import { authenticateJWT } from '@/middleware/auth';

const router = Router();

// All character routes require authentication
router.use(authenticateJWT);

// Character class information (public to authenticated users)
router.get('/classes', getCharacterClasses);

// Character CRUD operations
router.get('/', getCharacters);
router.get('/:id', getCharacter);
router.post('/', createCharacterValidation, createCharacter);
router.put('/:id', updateCharacter);
router.delete('/:id', deleteCharacter);

export default router;