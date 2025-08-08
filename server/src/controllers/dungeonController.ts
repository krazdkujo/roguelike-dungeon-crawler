import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler, createError } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

// Get all available dungeons
export const getDungeons = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const dungeons = await prisma.dungeon.findMany({
    select: {
      id: true,
      name: true,
      difficulty: true,
      maxPlayers: true,
      createdAt: true
    },
    orderBy: { difficulty: 'asc' }
  });
  
  res.json({ dungeons });
});

// Get single dungeon details
export const getDungeon = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  
  const dungeon = await prisma.dungeon.findUnique({
    where: { id },
    include: {
      rooms: {
        select: {
          id: true,
          positionX: true,
          positionY: true,
          type: true
        }
      },
      instances: {
        where: { state: { in: ['waiting', 'active'] } },
        select: {
          id: true,
          state: true,
          playersJson: true,
          createdAt: true
        }
      }
    }
  });
  
  if (!dungeon) {
    throw createError('Dungeon not found', 404);
  }
  
  res.json({ dungeon });
});

// Enter dungeon (join or create instance)
export const enterDungeon = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id: dungeonId } = req.params;
  const { characterId } = req.body;
  
  if (!characterId) {
    throw createError('Character ID is required', 400);
  }
  
  // Verify character ownership
  const character = await prisma.character.findFirst({
    where: { 
      id: characterId,
      userId: req.userId 
    },
    select: {
      id: true,
      name: true,
      class: true,
      level: true,
      statsJson: true
    }
  });
  
  if (!character) {
    throw createError('Character not found', 404);
  }
  
  // Verify dungeon exists
  const dungeon = await prisma.dungeon.findUnique({
    where: { id: dungeonId }
  });
  
  if (!dungeon) {
    throw createError('Dungeon not found', 404);
  }
  
  // Look for an existing waiting instance
  let instance = await prisma.dungeonInstance.findFirst({
    where: {
      dungeonId,
      state: 'waiting'
    }
  });
  
  if (instance) {
    // Join existing instance
    const players = instance.playersJson as any[];
    
    // Check if character is already in this instance
    const existingPlayer = players.find(p => p.characterId === characterId);
    if (existingPlayer) {
      return res.json({
        message: 'Already in this dungeon instance',
        instance: {
          id: instance.id,
          dungeonId,
          players,
          state: instance.state,
          currentRoom: instance.currentRoom
        }
      });
    }
    
    // Check if instance is full
    if (players.length >= dungeon.maxPlayers) {
      throw createError('Dungeon instance is full', 400);
    }
    
    // Add player to instance
    const updatedPlayers = [...players, {
      userId: req.userId,
      characterId: character.id,
      characterName: character.name,
      characterClass: character.class,
      characterLevel: character.level,
      characterStats: character.statsJson,
      joinedAt: new Date().toISOString()
    }];
    
    instance = await prisma.dungeonInstance.update({
      where: { id: instance.id },
      data: {
        playersJson: updatedPlayers,
        // If we reach max players, start the dungeon
        state: updatedPlayers.length >= dungeon.maxPlayers ? 'active' : 'waiting'
      }
    });
    
    res.json({
      message: 'Joined dungeon instance successfully',
      instance: {
        id: instance.id,
        dungeonId,
        players: updatedPlayers,
        state: instance.state,
        currentRoom: instance.currentRoom
      }
    });
  } else {
    // Create new instance
    const players = [{
      userId: req.userId,
      characterId: character.id,
      characterName: character.name,
      characterClass: character.class,
      characterLevel: character.level,
      characterStats: character.statsJson,
      joinedAt: new Date().toISOString()
    }];
    
    instance = await prisma.dungeonInstance.create({
      data: {
        dungeonId,
        playersJson: players,
        state: 'waiting'
      }
    });
    
    res.status(201).json({
      message: 'Created new dungeon instance',
      instance: {
        id: instance.id,
        dungeonId,
        players,
        state: instance.state,
        currentRoom: instance.currentRoom
      }
    });
  }
});

// Get dungeon instance details
export const getDungeonInstance = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  
  const instance = await prisma.dungeonInstance.findUnique({
    where: { id },
    include: {
      dungeon: {
        select: {
          id: true,
          name: true,
          difficulty: true,
          maxPlayers: true,
          layoutJson: true
        }
      },
      combatInstances: {
        where: { state: 'active' },
        select: {
          id: true,
          participantsJson: true,
          turnOrder: true,
          currentTurn: true,
          state: true
        }
      }
    }
  });
  
  if (!instance) {
    throw createError('Dungeon instance not found', 404);
  }
  
  // Verify user has a character in this instance
  const players = instance.playersJson as any[];
  const userInInstance = players.some(p => p.userId === req.userId);
  
  if (!userInInstance) {
    throw createError('You are not part of this dungeon instance', 403);
  }
  
  res.json({ instance });
});

// Leave dungeon instance
export const leaveDungeon = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  
  const instance = await prisma.dungeonInstance.findUnique({
    where: { id }
  });
  
  if (!instance) {
    throw createError('Dungeon instance not found', 404);
  }
  
  const players = instance.playersJson as any[];
  const updatedPlayers = players.filter(p => p.userId !== req.userId);
  
  if (updatedPlayers.length === players.length) {
    throw createError('You are not in this dungeon instance', 400);
  }
  
  if (updatedPlayers.length === 0) {
    // If no players left, mark instance as abandoned
    await prisma.dungeonInstance.update({
      where: { id },
      data: { state: 'abandoned' }
    });
  } else {
    // Update player list
    await prisma.dungeonInstance.update({
      where: { id },
      data: { playersJson: updatedPlayers }
    });
  }
  
  res.json({ message: 'Left dungeon instance successfully' });
});