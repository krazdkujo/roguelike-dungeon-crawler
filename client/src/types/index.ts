// API Response Types
export interface ApiResponse<T = any> {
  message?: string;
  error?: string;
  data?: T;
  timestamp?: string;
}

// User & Authentication Types
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

// Character Types
export interface CharacterStats {
  hp: number;
  mp: number;
  attack: number;
  defense: number;
  speed: number;
  luck: number;
  currentHp: number;
  currentMp: number;
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  class: 'warrior' | 'mage' | 'rogue';
  level: number;
  experience: number;
  statsJson: CharacterStats;
  createdAt: string;
  updatedAt?: string;
}

export interface CharacterClass {
  id: string;
  name: string;
  baseStats: CharacterStats;
  description: string;
}

export interface CreateCharacterRequest {
  name: string;
  class: 'warrior' | 'mage' | 'rogue';
  stats?: {
    strength: number;
    intelligence: number;
    dexterity: number;
    vitality: number;
  };
}

// Dungeon Types
export interface DungeonLayout {
  width: number;
  height: number;
  startRoom: { x: number; y: number };
  endRoom: { x: number; y: number };
  bossRoom: { x: number; y: number };
}

export interface Dungeon {
  id: string;
  name: string;
  difficulty: number;
  maxPlayers: number;
  layoutJson: DungeonLayout;
  createdAt: string;
}

export interface Room {
  id: string;
  dungeonId: string;
  positionX: number;
  positionY: number;
  type: 'entrance' | 'combat' | 'treasure' | 'boss' | 'exit';
  monstersJson?: any[];
}

export interface DungeonPlayer {
  userId: string;
  characterId: string;
  characterName: string;
  characterClass: string;
  characterLevel: number;
  characterStats: CharacterStats;
  joinedAt: string;
}

export interface DungeonInstance {
  id: string;
  dungeonId: string;
  playersJson: DungeonPlayer[];
  state: 'waiting' | 'active' | 'completed' | 'abandoned';
  currentRoom?: string;
  createdAt: string;
  updatedAt: string;
}

// Combat Types
export interface CombatParticipant {
  id: string;
  userId?: string;
  characterId?: string;
  name: string;
  type: 'player' | 'monster';
  stats: CharacterStats;
  currentHp: number;
  currentMp: number;
}

export interface CombatInstance {
  id: string;
  instanceId: string;
  participantsJson: CombatParticipant[];
  turnOrder: string[];
  currentTurn: string;
  state: 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface CombatAction {
  action: 'attack' | 'skill' | 'item' | 'defend' | 'flee';
  target?: string;
  skillId?: string;
  itemId?: string;
}

export interface CombatActionResult {
  action: string;
  actor: {
    userId?: string;
    name: string;
  };
  target?: {
    id: string;
    name?: string;
  };
  damage?: number;
  healing?: number;
  message: string;
  nextTurn: string;
  turnOrder: string[];
  timestamp: number;
}

// Item Types
export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'misc';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  statsJson: any;
  description: string;
}

export interface CharacterInventory {
  id: string;
  characterId: string;
  itemId: string;
  quantity: number;
  equipped: boolean;
  item: Item;
}

// Skill Types
export interface Skill {
  id: string;
  name: string;
  class: 'warrior' | 'mage' | 'rogue' | 'universal';
  levelRequired: number;
  effectJson: any;
  description: string;
}

// WebSocket Event Types
export interface SocketEvents {
  // Client to Server
  'join-dungeon': { instanceId: string };
  'leave-dungeon': { instanceId: string };
  'move': { instanceId: string; direction: string };
  'dungeon-action': { instanceId: string; action: string; target?: string };
  'join-combat': { combatId: string };
  'leave-combat': { combatId: string };
  'combat-action': CombatAction & { combatId: string };
  'ping': void;
  
  // Server to Client
  'dungeon-state': { instance: DungeonInstance };
  'player-joined': { userId: string; username: string };
  'player-left': { userId: string; username: string };
  'player-moved': { userId: string; username: string; direction: string; timestamp: number };
  'player-action': { userId: string; username: string; action: string; target?: string; timestamp: number };
  'combat-state': { combatId: string; participants: CombatParticipant[]; turnOrder: string[]; currentTurn: string; state: string };
  'combat-update': CombatActionResult;
  'pong': { timestamp: number };
  'error': { message: string };
}

// UI State Types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
}

export interface Modal {
  id: string;
  type: string;
  data?: any;
}

// Redux State Types
export interface RootState {
  auth: {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  };
  game: {
    currentCharacter: Character | null;
    characters: Character[];
    dungeonInstance: DungeonInstance | null;
    inventory: CharacterInventory[];
    skills: Skill[];
    loading: boolean;
    error: string | null;
  };
  combat: {
    isInCombat: boolean;
    combatInstance: CombatInstance | null;
    actionHistory: CombatActionResult[];
    loading: boolean;
    error: string | null;
  };
  ui: {
    notifications: Notification[];
    activeModal: Modal | null;
    loading: boolean;
    theme: 'light' | 'dark';
  };
}