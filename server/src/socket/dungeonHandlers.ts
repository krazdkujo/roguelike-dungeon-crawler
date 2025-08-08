import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const handleDungeonEvents = (socket: any, io: Server) => {
  
  // Join dungeon instance room
  socket.on('join-dungeon', async (data: { instanceId: string }) => {
    try {
      const { instanceId } = data;
      
      if (!instanceId) {
        return socket.emit('error', { message: 'Instance ID required' });
      }
      
      // Verify user is part of this instance
      const instance = await prisma.dungeonInstance.findUnique({
        where: { id: instanceId }
      });
      
      if (!instance) {
        return socket.emit('error', { message: 'Dungeon instance not found' });
      }
      
      const players = instance.playersJson as any[];
      const isInInstance = players.some(p => p.userId === socket.userId);
      
      if (!isInInstance) {
        return socket.emit('error', { message: 'You are not part of this dungeon instance' });
      }
      
      // Join the dungeon room
      socket.join(`dungeon:${instanceId}`);
      
      // Notify other players
      socket.to(`dungeon:${instanceId}`).emit('player-joined', {
        userId: socket.userId,
        username: socket.user?.username
      });
      
      // Send current dungeon state to the joining player
      socket.emit('dungeon-state', {
        instance: {
          id: instance.id,
          dungeonId: instance.dungeonId,
          players,
          state: instance.state,
          currentRoom: instance.currentRoom
        }
      });
      
      console.log(`User ${socket.user?.username} joined dungeon instance ${instanceId}`);
      
    } catch (error) {
      console.error('Error joining dungeon:', error);
      socket.emit('error', { message: 'Failed to join dungeon' });
    }
  });
  
  // Leave dungeon instance room
  socket.on('leave-dungeon', (data: { instanceId: string }) => {
    const { instanceId } = data;
    
    if (!instanceId) {
      return socket.emit('error', { message: 'Instance ID required' });
    }
    
    socket.leave(`dungeon:${instanceId}`);
    
    // Notify other players
    socket.to(`dungeon:${instanceId}`).emit('player-left', {
      userId: socket.userId,
      username: socket.user?.username
    });
    
    console.log(`User ${socket.user?.username} left dungeon instance ${instanceId}`);
  });
  
  // Handle player movement within dungeon
  socket.on('move', async (data: { instanceId: string; direction: string }) => {
    try {
      const { instanceId, direction } = data;
      
      if (!instanceId || !direction) {
        return socket.emit('error', { message: 'Instance ID and direction required' });
      }
      
      // Get current instance
      const instance = await prisma.dungeonInstance.findUnique({
        where: { id: instanceId },
        include: { dungeon: true }
      });
      
      if (!instance) {
        return socket.emit('error', { message: 'Dungeon instance not found' });
      }
      
      // Verify user is in instance
      const players = instance.playersJson as any[];
      const playerIndex = players.findIndex(p => p.userId === socket.userId);
      
      if (playerIndex === -1) {
        return socket.emit('error', { message: 'You are not in this dungeon instance' });
      }
      
      // TODO: Implement movement logic based on dungeon layout
      // For now, just broadcast the movement attempt
      io.to(`dungeon:${instanceId}`).emit('player-moved', {
        userId: socket.userId,
        username: socket.user?.username,
        direction,
        timestamp: Date.now()
      });
      
      console.log(`User ${socket.user?.username} moved ${direction} in dungeon ${instanceId}`);
      
    } catch (error) {
      console.error('Error handling movement:', error);
      socket.emit('error', { message: 'Movement failed' });
    }
  });
  
  // Handle player actions (interact with objects, etc.)
  socket.on('dungeon-action', async (data: { instanceId: string; action: string; target?: string }) => {
    try {
      const { instanceId, action, target } = data;
      
      if (!instanceId || !action) {
        return socket.emit('error', { message: 'Instance ID and action required' });
      }
      
      // Broadcast action to all players in dungeon
      io.to(`dungeon:${instanceId}`).emit('player-action', {
        userId: socket.userId,
        username: socket.user?.username,
        action,
        target,
        timestamp: Date.now()
      });
      
      console.log(`User ${socket.user?.username} performed action ${action} in dungeon ${instanceId}`);
      
    } catch (error) {
      console.error('Error handling dungeon action:', error);
      socket.emit('error', { message: 'Action failed' });
    }
  });
};