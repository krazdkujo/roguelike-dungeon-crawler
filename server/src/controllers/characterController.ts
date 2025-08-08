import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { asyncHandler, createError } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

// Character class configurations
const CHARACTER_CLASSES = {
  warrior: {
    name: 'Warrior',
    baseStats: {
      hp: 120,
      mp: 30,
      attack: 18,
      defense: 16,
      speed: 8,
      luck: 10
    },
    description: 'A strong melee fighter with high HP and defense'
  },
  mage: {
    name: 'Mage',
    baseStats: {
      hp: 70,
      mp: 100,
      attack: 12,
      defense: 8,
      speed: 12,
      luck: 15
    },
    description: 'A magical spellcaster with high MP and magical abilities'
  },
  rogue: {
    name: 'Rogue',
    baseStats: {
      hp: 90,
      mp: 50,
      attack: 15,
      defense: 10,
      speed: 18,
      luck: 20
    },
    description: 'A fast and agile fighter with high speed and luck'
  }
};

// Validation rules
export const createCharacterValidation = [
  body('name')
    .isLength({ min: 2, max: 20 })
    .matches(/^[a-zA-Z0-9\s_-]+$/)
    .withMessage('Character name must be 2-20 characters and contain only letters, numbers, spaces, hyphens, and underscores'),
  body('class')
    .isIn(Object.keys(CHARACTER_CLASSES))
    .withMessage('Invalid character class')
];

// Get all characters for a user
export const getCharacters = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const characters = await prisma.character.findMany({
    where: { userId: req.userId },
    select: {
      id: true,
      name: true,
      class: true,
      level: true,
      experience: true,
      statsJson: true,
      createdAt: true,
      updatedAt: true
    },
    orderBy: { createdAt: 'desc' }
  });
  
  res.json({ characters });
});

// Get single character
export const getCharacter = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  
  const character = await prisma.character.findFirst({
    where: { 
      id,
      userId: req.userId 
    },
    include: {
      inventories: {
        include: { item: true }
      },
      skills: {
        include: { skill: true }
      }
    }
  });
  
  if (!character) {
    throw createError('Character not found', 404);
  }
  
  res.json({ character });
});

// Create new character
export const createCharacter = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError('Validation failed', 400);
  }
  
  const { name, class: characterClass } = req.body;
  
  // Check character limit per user
  const maxCharacters = parseInt(process.env.MAX_CHARACTERS_PER_USER || '5');
  const characterCount = await prisma.character.count({
    where: { userId: req.userId }
  });
  
  if (characterCount >= maxCharacters) {
    throw createError(`Maximum of ${maxCharacters} characters allowed per user`, 400);
  }
  
  // Check if character name is already taken by this user
  const existingCharacter = await prisma.character.findFirst({
    where: {
      userId: req.userId,
      name
    }
  });
  
  if (existingCharacter) {
    throw createError('You already have a character with this name', 409);
  }
  
  // Get class configuration
  const classConfig = CHARACTER_CLASSES[characterClass as keyof typeof CHARACTER_CLASSES];
  
  // Create character with base stats
  const character = await prisma.character.create({
    data: {
      userId: req.userId!,
      name,
      class: characterClass,
      level: 1,
      experience: 0,
      statsJson: {
        ...classConfig.baseStats,
        currentHp: classConfig.baseStats.hp,
        currentMp: classConfig.baseStats.mp
      }
    },
    select: {
      id: true,
      name: true,
      class: true,
      level: true,
      experience: true,
      statsJson: true,
      createdAt: true
    }
  });
  
  res.status(201).json({
    message: 'Character created successfully',
    character
  });
});

// Update character (level up, stat changes, etc.)
export const updateCharacter = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { statsJson } = req.body;
  
  // Verify character ownership
  const character = await prisma.character.findFirst({
    where: { 
      id,
      userId: req.userId 
    }
  });
  
  if (!character) {
    throw createError('Character not found', 404);
  }
  
  // Update character stats (typically called by game systems)
  const updatedCharacter = await prisma.character.update({
    where: { id },
    data: { statsJson },
    select: {
      id: true,
      name: true,
      class: true,
      level: true,
      experience: true,
      statsJson: true,
      updatedAt: true
    }
  });
  
  res.json({
    message: 'Character updated successfully',
    character: updatedCharacter
  });
});

// Delete character
export const deleteCharacter = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  
  // Verify character ownership
  const character = await prisma.character.findFirst({
    where: { 
      id,
      userId: req.userId 
    }
  });
  
  if (!character) {
    throw createError('Character not found', 404);
  }
  
  // Delete character (cascade will handle inventories and skills)
  await prisma.character.delete({
    where: { id }
  });
  
  res.json({ message: 'Character deleted successfully' });
});

// Get available character classes
export const getCharacterClasses = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const classes = Object.entries(CHARACTER_CLASSES).map(([key, config]) => ({
    id: key,
    name: config.name,
    baseStats: config.baseStats,
    description: config.description
  }));
  
  res.json({ classes });
});