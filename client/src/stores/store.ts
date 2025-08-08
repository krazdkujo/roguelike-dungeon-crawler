/**
 * Redux Store Configuration
 * 
 * Central state management for the Roguelike Dungeon Crawler.
 * Manages authentication, game state, combat, and UI states.
 */

import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import gameSlice from './gameSlice';
import combatSlice from './combatSlice';
import uiSlice from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    game: gameSlice,
    combat: combatSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;