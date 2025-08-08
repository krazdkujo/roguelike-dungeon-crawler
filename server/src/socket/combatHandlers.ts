import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const handleCombatEvents = (socket: any, io: Server) => {
  
  // Join combat instance
  socket.on('join-combat', async (data: { combatId: string }) => {
    try {
      const { combatId } = data;
      
      if (!combatId) {
        return socket.emit('error', { message: 'Combat ID required' });
      }
      
      // Verify combat instance exists and user is a participant
      const combat = await prisma.combatInstance.findUnique({
        where: { id: combatId }
      });
      
      if (!combat) {
        return socket.emit('error', { message: 'Combat instance not found' });
      }
      
      const participants = combat.participantsJson as any[];
      const isParticipant = participants.some(p => p.userId === socket.userId);
      
      if (!isParticipant) {
        return socket.emit('error', { message: 'You are not a participant in this combat' });
      }
      
      // Join combat room
      socket.join(`combat:${combatId}`);
      
      // Send current combat state
      socket.emit('combat-state', {
        combatId: combat.id,
        participants,
        turnOrder: combat.turnOrder,
        currentTurn: combat.currentTurn,
        state: combat.state
      });
      
      console.log(`User ${socket.user?.username} joined combat ${combatId}`);
      
    } catch (error) {
      console.error('Error joining combat:', error);
      socket.emit('error', { message: 'Failed to join combat' });
    }
  });
  
  // Handle combat actions (attack, skill, item, etc.)
  socket.on('combat-action', async (data: { 
    combatId: string; 
    action: string; 
    target?: string; 
    skillId?: string; 
    itemId?: string 
  }) => {
    try {
      const { combatId, action, target, skillId, itemId } = data;
      
      if (!combatId || !action) {
        return socket.emit('error', { message: 'Combat ID and action required' });
      }
      
      // Get combat instance
      const combat = await prisma.combatInstance.findUnique({
        where: { id: combatId }
      });
      
      if (!combat || combat.state !== 'active') {
        return socket.emit('error', { message: 'Combat not active' });
      }
      
      // Check if it's the user's turn
      if (combat.currentTurn !== socket.userId) {
        return socket.emit('error', { message: 'Not your turn' });
      }
      
      // TODO: Implement combat action processing
      // For now, just broadcast the action and simulate results
      
      const actionResult = await processCombatAction({
        combatId,
        userId: socket.userId,
        action,
        target,
        skillId,
        itemId
      });
      
      // Broadcast combat update to all participants
      io.to(`combat:${combatId}`).emit('combat-update', actionResult);
      
      console.log(`User ${socket.user?.username} performed ${action} in combat ${combatId}`);
      
    } catch (error) {
      console.error('Error handling combat action:', error);
      socket.emit('error', { message: 'Combat action failed' });
    }
  });
  
  // Leave combat
  socket.on('leave-combat', (data: { combatId: string }) => {
    const { combatId } = data;
    
    if (!combatId) {
      return socket.emit('error', { message: 'Combat ID required' });
    }
    
    socket.leave(`combat:${combatId}`);
    console.log(`User ${socket.user?.username} left combat ${combatId}`);
  });
};

// Simplified combat action processing (placeholder)
async function processCombatAction(actionData: {
  combatId: string;
  userId: string;
  action: string;
  target?: string;
  skillId?: string;
  itemId?: string;
}) {
  const { combatId, userId, action, target } = actionData;
  
  // Get combat instance
  const combat = await prisma.combatInstance.findUnique({
    where: { id: combatId }
  });
  
  if (!combat) {
    throw new Error('Combat not found');
  }
  
  const participants = combat.participantsJson as any[];
  const turnOrder = combat.turnOrder as string[];
  
  // Find current participant
  const currentParticipant = participants.find(p => p.userId === userId);
  if (!currentParticipant) {
    throw new Error('Participant not found');
  }
  
  let actionResult: any = {
    action,
    actor: {
      userId,
      name: currentParticipant.characterName
    },
    timestamp: Date.now()
  };
  
  // Simulate different actions
  switch (action) {
    case 'attack':
      if (target) {
        const targetParticipant = participants.find(p => p.id === target);
        if (targetParticipant) {
          const damage = Math.floor(Math.random() * 20) + 10; // Random damage 10-30
          actionResult = {
            ...actionResult,
            target: {
              id: target,
              name: targetParticipant.name
            },
            damage,
            message: `${currentParticipant.characterName} attacks ${targetParticipant.name} for ${damage} damage!`
          };
        }
      }
      break;
      
    case 'skill':
      if (target) {
        const damage = Math.floor(Math.random() * 30) + 15; // Skill damage 15-45
        actionResult = {
          ...actionResult,
          target: { id: target },
          damage,
          skillUsed: true,
          message: `${currentParticipant.characterName} uses a skill for ${damage} damage!`
        };
      }
      break;
      
    case 'defend':
      actionResult = {
        ...actionResult,
        defending: true,
        message: `${currentParticipant.characterName} takes a defensive stance!`
      };
      break;
      
    default:
      actionResult = {
        ...actionResult,
        message: `${currentParticipant.characterName} performs ${action}`
      };
  }
  
  // Determine next turn
  const currentTurnIndex = turnOrder.findIndex(id => id === userId);
  const nextTurnIndex = (currentTurnIndex + 1) % turnOrder.length;
  const nextTurn = turnOrder[nextTurnIndex];
  
  // Update combat instance with new turn
  await prisma.combatInstance.update({
    where: { id: combatId },
    data: { currentTurn: nextTurn }
  });
  
  actionResult.nextTurn = nextTurn;
  actionResult.turnOrder = turnOrder;
  
  return actionResult;
}