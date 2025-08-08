import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { handleDungeonEvents } from './dungeonHandlers';
import { handleCombatEvents } from './combatHandlers';

const prisma = new PrismaClient();

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: any;
}

// WebSocket authentication middleware
const authenticateSocket = async (socket: any, next: Function) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication token required'));
    }
    
    if (!process.env.JWT_SECRET) {
      return next(new Error('JWT configuration error'));
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, username: true }
    });
    
    if (!user) {
      return next(new Error('User not found'));
    }
    
    socket.userId = decoded.userId;
    socket.user = user;
    
    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Invalid authentication token'));
  }
};

export const initializeSocketHandlers = (io: Server) => {
  // Apply authentication middleware
  io.use(authenticateSocket);
  
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.user?.username} connected via WebSocket`);
    
    // Join user to their personal room for notifications
    socket.join(`user:${socket.userId}`);
    
    // Handle connection events
    socket.on('disconnect', () => {
      console.log(`User ${socket.user?.username} disconnected`);
    });
    
    // Handle dungeon-related events
    handleDungeonEvents(socket, io);
    
    // Handle combat-related events
    handleCombatEvents(socket, io);
    
    // Handle general game events
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });
    
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.user?.username}:`, error);
    });
  });
  
  console.log('✨ WebSocket handlers initialized');
};