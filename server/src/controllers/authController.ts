import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { asyncHandler, createError } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

// Validation rules
export const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('username')
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-20 characters and contain only letters, numbers, and underscores'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Generate JWT tokens
const generateTokens = (userId: string) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }
  
  const accessToken = jwt.sign(
    { userId }, 
    jwtSecret, 
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId, tokenId: uuidv4() }, 
    jwtSecret, 
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Register new user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError('Validation failed', 400);
  }
  
  const { email, username, password } = req.body;
  
  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });
  
  if (existingUser) {
    throw createError('User with this email or username already exists', 409);
  }
  
  // Hash password
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
  const passwordHash = await bcrypt.hash(password, saltRounds);
  
  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash
    },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true
    }
  });
  
  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);
  
  // Store refresh token
  const refreshTokenExpiry = new Date();
  refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7); // 7 days
  
  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      expiresAt: refreshTokenExpiry
    }
  });
  
  res.status(201).json({
    message: 'User registered successfully',
    user,
    accessToken,
    refreshToken
  });
});

// Login user
export const login = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError('Validation failed', 400);
  }
  
  const { email, password } = req.body;
  
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      username: true,
      passwordHash: true,
      createdAt: true
    }
  });
  
  if (!user) {
    throw createError('Invalid email or password', 401);
  }
  
  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw createError('Invalid email or password', 401);
  }
  
  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);
  
  // Store refresh token
  const refreshTokenExpiry = new Date();
  refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);
  
  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      expiresAt: refreshTokenExpiry
    }
  });
  
  // Remove password hash from response
  const { passwordHash, ...userResponse } = user;
  
  res.json({
    message: 'Login successful',
    user: userResponse,
    accessToken,
    refreshToken
  });
});

// Refresh access token
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    throw createError('Refresh token required', 401);
  }
  
  // Find session
  const session = await prisma.session.findUnique({
    where: { refreshToken },
    include: { user: { select: { id: true, email: true, username: true, createdAt: true } } }
  });
  
  if (!session) {
    throw createError('Invalid refresh token', 401);
  }
  
  // Check if token is expired
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    throw createError('Refresh token expired', 401);
  }
  
  // Generate new tokens
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(session.userId);
  
  // Update session with new refresh token
  const newRefreshTokenExpiry = new Date();
  newRefreshTokenExpiry.setDate(newRefreshTokenExpiry.getDate() + 7);
  
  await prisma.session.update({
    where: { id: session.id },
    data: {
      refreshToken: newRefreshToken,
      expiresAt: newRefreshTokenExpiry
    }
  });
  
  res.json({
    message: 'Token refreshed successfully',
    user: session.user,
    accessToken,
    refreshToken: newRefreshToken
  });
});

// Logout user
export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { refreshToken } = req.body;
  
  if (refreshToken) {
    // Delete specific session
    await prisma.session.deleteMany({
      where: {
        refreshToken,
        userId: req.userId
      }
    });
  } else if (req.userId) {
    // Delete all sessions for user
    await prisma.session.deleteMany({
      where: { userId: req.userId }
    });
  }
  
  res.json({ message: 'Logout successful' });
});

// Get current user info
export const me = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
      characters: {
        select: {
          id: true,
          name: true,
          class: true,
          level: true,
          createdAt: true
        }
      }
    }
  });
  
  if (!user) {
    throw createError('User not found', 404);
  }
  
  res.json({ user });
});