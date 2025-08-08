import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { gameService } from '@/services/gameService';
import { Character, DungeonInstance, CharacterInventory, Skill, CreateCharacterRequest } from '@/types';

interface GameState {
  currentCharacter: Character | null;
  characters: Character[];
  dungeonInstance: DungeonInstance | null;
  inventory: CharacterInventory[];
  skills: Skill[];
  loading: boolean;
  error: string | null;
}

const initialState: GameState = {
  currentCharacter: null,
  characters: [],
  dungeonInstance: null,
  inventory: [],
  skills: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchCharacters = createAsyncThunk(
  'game/fetchCharacters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await gameService.getCharacters();
      return response.characters;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch characters');
    }
  }
);

export const createCharacter = createAsyncThunk(
  'game/createCharacter',
  async (characterData: CreateCharacterRequest, { rejectWithValue }) => {
    try {
      const response = await gameService.createCharacter(characterData);
      return response.character;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create character');
    }
  }
);

export const selectCharacter = createAsyncThunk(
  'game/selectCharacter',
  async (characterId: string, { rejectWithValue }) => {
    try {
      const response = await gameService.getCharacter(characterId);
      return response.character;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to select character');
    }
  }
);

export const deleteCharacter = createAsyncThunk(
  'game/deleteCharacter',
  async (characterId: string, { rejectWithValue }) => {
    try {
      await gameService.deleteCharacter(characterId);
      return characterId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete character');
    }
  }
);

export const fetchDungeons = createAsyncThunk(
  'game/fetchDungeons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await gameService.getDungeons();
      return response.dungeons;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch dungeons');
    }
  }
);

export const enterDungeon = createAsyncThunk(
  'game/enterDungeon',
  async ({ dungeonId, characterId }: { dungeonId: string; characterId: string }, { rejectWithValue }) => {
    try {
      const response = await gameService.enterDungeon(dungeonId, characterId);
      return response.instance;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to enter dungeon');
    }
  }
);

export const leaveDungeon = createAsyncThunk(
  'game/leaveDungeon',
  async (instanceId: string, { rejectWithValue }) => {
    try {
      await gameService.leaveDungeon(instanceId);
      return instanceId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to leave dungeon');
    }
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCharacter: (state, action: PayloadAction<Character | null>) => {
      state.currentCharacter = action.payload;
    },
    updateDungeonInstance: (state, action: PayloadAction<DungeonInstance>) => {
      state.dungeonInstance = action.payload;
    },
    clearDungeonInstance: (state) => {
      state.dungeonInstance = null;
    },
    updateCharacterStats: (state, action: PayloadAction<{ characterId: string; stats: any }>) => {
      const { characterId, stats } = action.payload;
      
      // Update current character if it matches
      if (state.currentCharacter && state.currentCharacter.id === characterId) {
        state.currentCharacter.statsJson = { ...state.currentCharacter.statsJson, ...stats };
      }
      
      // Update in characters list
      const characterIndex = state.characters.findIndex(c => c.id === characterId);
      if (characterIndex !== -1) {
        state.characters[characterIndex].statsJson = { ...state.characters[characterIndex].statsJson, ...stats };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch characters
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = false;
        state.characters = action.payload;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create character
      .addCase(createCharacter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCharacter.fulfilled, (state, action) => {
        state.loading = false;
        state.characters.push(action.payload);
      })
      .addCase(createCharacter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Select character
      .addCase(selectCharacter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectCharacter.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCharacter = action.payload;
      })
      .addCase(selectCharacter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete character
      .addCase(deleteCharacter.fulfilled, (state, action) => {
        state.characters = state.characters.filter(c => c.id !== action.payload);
        if (state.currentCharacter && state.currentCharacter.id === action.payload) {
          state.currentCharacter = null;
        }
      })
      
      // Enter dungeon
      .addCase(enterDungeon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enterDungeon.fulfilled, (state, action) => {
        state.loading = false;
        state.dungeonInstance = action.payload;
      })
      .addCase(enterDungeon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Leave dungeon
      .addCase(leaveDungeon.fulfilled, (state) => {
        state.dungeonInstance = null;
      });
  },
});

export const { 
  clearError, 
  setCurrentCharacter, 
  updateDungeonInstance, 
  clearDungeonInstance,
  updateCharacterStats
} = gameSlice.actions;

export default gameSlice.reducer;