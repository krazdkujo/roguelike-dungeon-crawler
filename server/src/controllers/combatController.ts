import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { asyncHandler, createError } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

// Start a new combat encounter
export const startCombat = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { instanceId, players, monsters } = req.body;
  
  if (!instanceId) {
    throw createError('Dungeon instance ID is required', 400);
  }
  
  // Verify the dungeon instance exists and user is part of it
  const dungeonInstance = await prisma.dungeonInstance.findUnique({
    where: { id: instanceId }
  });
  
  if (!dungeonInstance) {
    throw createError('Dungeon instance not found', 404);
  }
  
  const players_in_instance = dungeonInstance.playersJson as any[];
  const userInInstance = players_in_instance.some(p => p.userId === req.userId);
  
  if (!userInInstance) {
    throw createError('You are not part of this dungeon instance', 403);
  }
  
  // Create combat participants
  const participants = [
    ...(players || players_in_instance).map((player: any) => ({
      id: player.characterId,
      name: player.characterName,
      type: 'player',
      userId: player.userId,
      hp: player.characterStats?.hp || 100,
      maxHp: player.characterStats?.hp || 100,
      mp: player.characterStats?.mp || 50,
      maxMp: player.characterStats?.mp || 50,
      attack: player.characterStats?.attack || 15,
      defense: player.characterStats?.defense || 10,
      speed: player.characterStats?.speed || 12
    })),
    ...(monsters || []).map((monster: any, index: number) => ({
      id: `monster_${index}`,
      name: monster.name,
      type: 'monster',
      hp: monster.hp || 80,
      maxHp: monster.hp || 80,
      attack: monster.attack || 12,
      defense: monster.defense || 8,
      speed: monster.speed || 10
    }))
  ];
  
  // Generate turn order based on speed (highest first)
  const turnOrder = participants
    .sort((a, b) => b.speed - a.speed)
    .map(p => p.id);
  
  // Create combat instance
  const combat = await prisma.combatInstance.create({
    data: {
      instanceId,
      participantsJson: participants,
      turnOrder,
      currentTurn: turnOrder[0],
      state: 'active'
    }
  });
  
  res.status(201).json({
    message: 'Combat started successfully',
    combat: {
      id: combat.id,
      participants,
      turnOrder,
      currentTurn: combat.currentTurn,
      state: combat.state
    }
  });
});

// Get combat instance details
export const getCombat = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  
  const combat = await prisma.combatInstance.findUnique({
    where: { id },
    include: {
      instance: {
        select: {
          playersJson: true
        }
      }
    }
  });
  
  if (!combat) {
    throw createError('Combat instance not found', 404);
  }
  
  // Verify user is part of the dungeon instance
  const players = combat.instance.playersJson as any[];
  const userInInstance = players.some(p => p.userId === req.userId);
  
  if (!userInInstance) {
    throw createError('You are not part of this combat', 403);
  }
  
  res.json({
    combat: {
      id: combat.id,
      participants: combat.participantsJson,
      turnOrder: combat.turnOrder,
      currentTurn: combat.currentTurn,
      state: combat.state,
      createdAt: combat.createdAt,
      updatedAt: combat.updatedAt
    }
  });
});

// Validation for combat actions
export const combatActionValidation = [
  body('action')
    .isIn(['attack', 'skill', 'item', 'defend'])
    .withMessage('Invalid combat action'),
  body('target')
    .optional()
    .isString()
    .withMessage('Target must be a string')
];

// Perform a combat action
export const performCombatAction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError('Validation failed', 400);
  }
  
  const { id } = req.params;
  const { action, target, skillId, itemId } = req.body;
  
  const combat = await prisma.combatInstance.findUnique({
    where: { id },
    include: {
      instance: {
        select: {
          playersJson: true
        }
      }
    }
  });
  
  if (!combat) {
    throw createError('Combat instance not found', 404);
  }
  
  if (combat.state !== 'active') {
    throw createError('Combat is not active', 400);
  }
  
  // Verify user is part of the combat and it's their turn
  const players = combat.instance.playersJson as any[];
  const userPlayer = players.find(p => p.userId === req.userId);
  
  if (!userPlayer) {
    throw createError('You are not part of this combat', 403);
  }
  
  if (combat.currentTurn !== userPlayer.characterId) {
    throw createError('Not your turn', 400);
  }
  
  const participants = combat.participantsJson as any[];
  const turnOrder = combat.turnOrder as string[];
  
  // Find current participant
  const currentParticipant = participants.find(p => p.id === userPlayer.characterId);
  if (!currentParticipant) {
    throw createError('Participant not found', 404);
  }
  
  let actionResult: any = {
    action,
    actor: {
      id: currentParticipant.id,
      name: currentParticipant.name
    },
    timestamp: Date.now()
  };
  
  // Process the combat action
  switch (action) {
    case 'attack':
      if (!target) {
        throw createError('Target is required for attack action', 400);
      }
      
      const targetParticipant = participants.find(p => p.id === target);
      if (!targetParticipant) {
        throw createError('Target not found', 404);
      }
      
      // Calculate damage (simplified)
      const baseDamage = currentParticipant.attack || 15;
      const defense = targetParticipant.defense || 0;
      const damage = Math.max(1, Math.floor(baseDamage - defense / 2 + Math.random() * 5));
      
      // Apply damage
      targetParticipant.hp = Math.max(0, targetParticipant.hp - damage);
      
      actionResult = {
        ...actionResult,
        target: {
          id: target,
          name: targetParticipant.name
        },
        damage,
        message: `${currentParticipant.name} attacks ${targetParticipant.name} for ${damage} damage!`
      };
      
      // Check if target is defeated
      if (targetParticipant.hp <= 0) {
        actionResult.targetDefeated = true;
        actionResult.message += ` ${targetParticipant.name} is defeated!`;
      }
      break;
      
    case 'defend':
      currentParticipant.defending = true;
      actionResult = {
        ...actionResult,
        defending: true,
        message: `${currentParticipant.name} takes a defensive stance!`
      };
      break;
      
    case 'skill':
      // Simplified skill system
      if (!target) {
        throw createError('Target is required for skill action', 400);
      }
      
      const skillTarget = participants.find(p => p.id === target);
      if (!skillTarget) {
        throw createError('Target not found', 404);
      }
      
      // Check MP cost (simplified)
      const mpCost = 10;
      if (currentParticipant.mp < mpCost) {
        throw createError('Not enough MP for skill', 400);
      }
      
      currentParticipant.mp -= mpCost;
      
      const skillDamage = Math.floor((currentParticipant.attack || 15) * 1.5 + Math.random() * 10);
      skillTarget.hp = Math.max(0, skillTarget.hp - skillDamage);
      
      actionResult = {
        ...actionResult,
        target: {
          id: target,
          name: skillTarget.name
        },
        damage: skillDamage,
        mpUsed: mpCost,
        message: `${currentParticipant.name} uses a skill on ${skillTarget.name} for ${skillDamage} damage!`
      };
      break;
      
    default:
      actionResult = {
        ...actionResult,
        message: `${currentParticipant.name} performs ${action}`
      };
  }
  
  // Determine next turn
  const currentTurnIndex = turnOrder.findIndex(id => id === combat.currentTurn);
  let nextTurnIndex = (currentTurnIndex + 1) % turnOrder.length;
  let nextTurn = turnOrder[nextTurnIndex];
  
  // Skip defeated participants
  while (true) {
    const nextParticipant = participants.find(p => p.id === nextTurn);
    if (!nextParticipant || nextParticipant.hp > 0) {
      break;
    }
    nextTurnIndex = (nextTurnIndex + 1) % turnOrder.length;
    nextTurn = turnOrder[nextTurnIndex];
    
    // Prevent infinite loop if all are defeated (shouldn't happen in normal flow)
    if (nextTurnIndex === currentTurnIndex) {
      break;
    }
  }
  
  // Check win conditions
  const playersAlive = participants.filter(p => p.type === 'player' && p.hp > 0).length;
  const monstersAlive = participants.filter(p => p.type === 'monster' && p.hp > 0).length;
  
  let combatState = 'active';
  if (playersAlive === 0) {
    combatState = 'completed';
    actionResult.result = 'defeat';
    actionResult.message += ' The party has been defeated!';
  } else if (monstersAlive === 0) {
    combatState = 'completed';
    actionResult.result = 'victory';
    actionResult.message += ' Victory! All monsters defeated!';
  }
  
  // Update combat instance
  await prisma.combatInstance.update({
    where: { id },
    data: {
      participantsJson: participants,
      currentTurn: nextTurn,
      state: combatState
    }
  });
  
  actionResult.nextTurn = nextTurn;
  actionResult.combatState = combatState;
  actionResult.participants = participants;
  
  res.json({
    message: 'Combat action performed successfully',
    result: actionResult
  });
});