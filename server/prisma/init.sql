-- Database initialization script for Roguelike Dungeon Crawler
-- This script runs when the PostgreSQL container starts

-- Create database if it doesn't exist (handled by Docker environment variables)
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- The actual schema will be created by Prisma migrations
-- This file can be extended with any additional database setup needed