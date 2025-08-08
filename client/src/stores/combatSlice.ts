import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CombatInstance, CombatActionResult } from '@/types';

interface CombatState {
  isInCombat: boolean;
  combatInstance: CombatInstance | null;
  actionHistory: CombatActionResult[];
  loading: boolean;
  error: string | null;
}

const initialState: CombatState = {
  isInCombat: false,
  combatInstance: null,
  actionHistory: [],
  loading: false,
  error: null,
};

const combatSlice = createSlice({
  name: 'combat',
  initialState,
  reducers: {
    setCombatInstance: (state, action: PayloadAction<CombatInstance>) => {
      state.combatInstance = action.payload;
      state.isInCombat = true;
      state.actionHistory = []; // Reset history for new combat
    },
    
    updateCombatState: (state, action: PayloadAction<Partial<CombatInstance>>) => {
      if (state.combatInstance) {
        state.combatInstance = { ...state.combatInstance, ...action.payload };
      }
    },
    
    addCombatAction: (state, action: PayloadAction<CombatActionResult>) => {
      state.actionHistory.push(action.payload);
      
      // Update turn order and current turn
      if (state.combatInstance) {
        state.combatInstance.currentTurn = action.payload.nextTurn;
        state.combatInstance.turnOrder = action.payload.turnOrder;
      }
      
      // Keep only last 50 actions to prevent memory bloat
      if (state.actionHistory.length > 50) {
        state.actionHistory = state.actionHistory.slice(-50);
      }
    },
    
    updateParticipantHealth: (state, action: PayloadAction<{ participantId: string; health: number; mana?: number }>) => {
      if (state.combatInstance) {
        const participant = state.combatInstance.participantsJson.find(p => p.id === action.payload.participantId);
        if (participant) {
          participant.currentHp = Math.max(0, action.payload.health);
          if (action.payload.mana !== undefined) {
            participant.currentMp = Math.max(0, action.payload.mana);
          }
        }
      }
    },
    
    endCombat: (state, action: PayloadAction<{ result: 'victory' | 'defeat' | 'fled'; rewards?: any }>) => {
      state.isInCombat = false;
      if (state.combatInstance) {
        state.combatInstance.state = 'completed';
      }
      
      // Add final combat result to history
      state.actionHistory.push({
        action: 'combat_end',
        actor: { name: 'System' },
        message: `Combat ended: ${action.payload.result}`,
        nextTurn: '',
        turnOrder: [],
        timestamp: Date.now()
      });
    },
    
    leaveCombat: (state) => {
      state.isInCombat = false;
      state.combatInstance = null;
      state.actionHistory = [];
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCombatInstance,
  updateCombatState,
  addCombatAction,
  updateParticipantHealth,
  endCombat,
  leaveCombat,
  setLoading,
  setError,
  clearError
} = combatSlice.actions;

export default combatSlice.reducer;