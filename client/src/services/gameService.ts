import { apiClient } from './apiClient';
import { 
  Character, 
  CharacterClass, 
  CreateCharacterRequest, 
  Dungeon, 
  DungeonInstance 
} from '@/types';

class GameService {
  // Character management
  async getCharacters(): Promise<{ characters: Character[] }> {
    return await apiClient.get('/characters');
  }

  async getCharacter(characterId: string): Promise<{ character: Character }> {
    return await apiClient.get(`/characters/${characterId}`);
  }

  async createCharacter(characterData: CreateCharacterRequest): Promise<{
    character: Character;
    message: string;
  }> {
    return await apiClient.post('/characters', characterData);
  }

  async updateCharacter(characterId: string, updates: Partial<Character>): Promise<{
    character: Character;
    message: string;
  }> {
    return await apiClient.put(`/characters/${characterId}`, updates);
  }

  async deleteCharacter(characterId: string): Promise<{ message: string }> {
    return await apiClient.delete(`/characters/${characterId}`);
  }

  async getCharacterClasses(): Promise<{ classes: CharacterClass[] }> {
    return await apiClient.get('/characters/classes');
  }

  // Dungeon management
  async getDungeons(): Promise<{ dungeons: Dungeon[] }> {
    return await apiClient.get('/dungeons');
  }

  async getDungeon(dungeonId: string): Promise<{ dungeon: Dungeon }> {
    return await apiClient.get(`/dungeons/${dungeonId}`);
  }

  async enterDungeon(dungeonId: string, characterId: string): Promise<{
    instance: DungeonInstance;
    message: string;
  }> {
    return await apiClient.post(`/dungeons/${dungeonId}/enter`, {
      characterId,
    });
  }

  async getDungeonInstance(instanceId: string): Promise<{ instance: DungeonInstance }> {
    return await apiClient.get(`/dungeons/instances/${instanceId}`);
  }

  async leaveDungeon(instanceId: string): Promise<{ message: string }> {
    return await apiClient.post(`/dungeons/instances/${instanceId}/leave`);
  }

  // Game statistics and leaderboards (future implementation)
  async getLeaderboards(): Promise<any> {
    // TODO: Implement when leaderboard endpoints are ready
    return { players: [], guilds: [] };
  }

  async getPlayerStats(characterId: string): Promise<any> {
    // TODO: Implement character statistics
    return {};
  }

  // Utility methods
  calculateLevelFromExperience(experience: number): number {
    // Simple level calculation - can be made more complex
    return Math.floor(experience / 100) + 1;
  }

  calculateExperienceForNextLevel(currentLevel: number): number {
    return currentLevel * 100;
  }

  getClassColor(characterClass: string): string {
    const colors = {
      warrior: '#ff6b6b',  // Red
      mage: '#4ecdc4',     // Cyan  
      rogue: '#45b7d1',    // Blue
    };
    return colors[characterClass as keyof typeof colors] || '#888';
  }

  getRarityColor(rarity: string): string {
    const colors = {
      common: '#9e9e9e',     // Gray
      uncommon: '#4caf50',   // Green
      rare: '#2196f3',       // Blue
      epic: '#9c27b0',       // Purple
      legendary: '#ff9800',  // Orange
    };
    return colors[rarity as keyof typeof colors] || '#9e9e9e';
  }

  formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}

export const gameService = new GameService();