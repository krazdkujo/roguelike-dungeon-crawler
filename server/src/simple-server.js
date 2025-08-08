const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Basic API endpoints (v1)
app.get('/api/v1/status', (req, res) => {
  res.json({ 
    message: 'Roguelike API Server', 
    version: '1.0.0',
    timestamp: new Date().toISOString() 
  });
});

// Mock auth endpoints
app.post('/api/v1/auth/login', (req, res) => {
  res.json({ 
    success: true,
    accessToken: 'mock-jwt-access-token',
    refreshToken: 'mock-jwt-refresh-token',
    user: { 
      id: 1, 
      username: req.body.username || 'testuser',
      email: req.body.email || 'test@test.com' 
    },
    message: 'Login successful'
  });
});

app.post('/api/v1/auth/register', (req, res) => {
  res.json({ 
    success: true,
    accessToken: 'mock-jwt-access-token',
    refreshToken: 'mock-jwt-refresh-token',
    message: 'User registered successfully',
    user: { 
      id: 2, 
      username: req.body.username,
      email: req.body.email
    }
  });
});

app.get('/api/v1/auth/me', (req, res) => {
  res.json({
    user: {
      id: 1,
      username: 'testuser',
      email: 'test@test.com'
    }
  });
});

app.post('/api/v1/auth/refresh', (req, res) => {
  res.json({
    accessToken: 'mock-new-jwt-access-token',
    refreshToken: 'mock-new-jwt-refresh-token',
    user: {
      id: 1,
      username: 'testuser',
      email: 'test@test.com'
    },
    message: 'Token refreshed'
  });
});

app.post('/api/v1/auth/logout', (req, res) => {
  res.json({ 
    success: true,
    message: 'Logout successful' 
  });
});

// In-memory storage for mock data
let characters = [];
let characterIdCounter = 1;
let dungeonInstances = [];
let instanceIdCounter = 1;
let combatInstances = [];
let combatIdCounter = 1;
let inventories = {}; // characterId -> inventory object

// Items database
const ITEMS = {
  // Materials
  1: {
    id: '1',
    name: 'Iron Ore',
    type: 'material',
    rarity: 'common',
    description: 'Raw iron ore used for crafting weapons and armor',
    stackable: true,
    maxStack: 99,
    value: 5,
    icon: '⛏️'
  },
  2: {
    id: '2',
    name: 'Leather Scraps',
    type: 'material',
    rarity: 'common',
    description: 'Pieces of leather from defeated creatures',
    stackable: true,
    maxStack: 99,
    value: 3,
    icon: '🧶'
  },
  3: {
    id: '3',
    name: 'Wood Planks',
    type: 'material',
    rarity: 'common',
    description: 'Wooden planks suitable for crafting',
    stackable: true,
    maxStack: 99,
    value: 2,
    icon: '🪵'
  },
  // Equipment
  4: {
    id: '4',
    name: 'Iron Sword',
    type: 'weapon',
    rarity: 'common',
    description: 'A sturdy iron sword that increases attack power',
    stackable: false,
    equipSlot: 'weapon',
    statsJson: { attack: 15 },
    value: 50,
    icon: '⚔️'
  },
  5: {
    id: '5',
    name: 'Leather Armor',
    type: 'armor',
    rarity: 'common',
    description: 'Light leather armor that provides protection',
    stackable: false,
    equipSlot: 'armor',
    statsJson: { defense: 12, speed: -2 },
    value: 45,
    icon: '🛡️'
  },
  6: {
    id: '6',
    name: 'Wooden Shield',
    type: 'shield',
    rarity: 'common',
    description: 'A wooden shield for blocking attacks',
    stackable: false,
    equipSlot: 'shield',
    statsJson: { defense: 8, speed: -1 },
    value: 30,
    icon: '🛡️'
  }
};

// Crafting recipes
const RECIPES = {
  1: {
    id: '1',
    name: 'Iron Sword',
    description: 'Forge a sturdy iron sword',
    resultItemId: '4',
    materials: [
      { itemId: '1', quantity: 5 }, // Iron Ore
      { itemId: '3', quantity: 2 }  // Wood Planks
    ],
    craftingTime: 30,
    icon: '⚔️'
  },
  2: {
    id: '2',
    name: 'Leather Armor',
    description: 'Craft protective leather armor',
    resultItemId: '5',
    materials: [
      { itemId: '2', quantity: 8 } // Leather Scraps
    ],
    craftingTime: 45,
    icon: '🛡️'
  },
  3: {
    id: '3',
    name: 'Wooden Shield',
    description: 'Create a defensive wooden shield',
    resultItemId: '6',
    materials: [
      { itemId: '3', quantity: 6 }, // Wood Planks
      { itemId: '2', quantity: 2 }  // Leather Scraps
    ],
    craftingTime: 25,
    icon: '🛡️'
  }
};

// Helper functions for inventory management
function initializeInventory(characterId) {
  if (!inventories[characterId]) {
    inventories[characterId] = {
      characterId: characterId,
      items: [], // Array of { itemId, quantity, equipped, equipSlot }
      maxSlots: 50,
      equipment: {
        weapon: null,
        armor: null,
        shield: null
      }
    };
  }
  return inventories[characterId];
}

function addItemToInventory(characterId, itemId, quantity = 1) {
  const inventory = initializeInventory(characterId);
  const item = ITEMS[itemId];
  
  if (!item) {
    throw new Error('Item not found');
  }
  
  // Check if item is stackable and already exists
  if (item.stackable) {
    const existingItem = inventory.items.find(i => i.itemId === itemId);
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > item.maxStack) {
        throw new Error(`Cannot exceed max stack size of ${item.maxStack}`);
      }
      existingItem.quantity = newQuantity;
      return existingItem;
    }
  }
  
  // Check inventory space
  if (inventory.items.length >= inventory.maxSlots) {
    throw new Error('Inventory is full');
  }
  
  // Add new item
  const newInventoryItem = {
    itemId: itemId,
    quantity: quantity,
    equipped: false,
    equipSlot: null,
    addedAt: new Date().toISOString()
  };
  
  inventory.items.push(newInventoryItem);
  return newInventoryItem;
}

function calculateEffectiveStats(character) {
  const inventory = inventories[character.id];
  if (!inventory) return character.statsJson;
  
  let effectiveStats = { ...character.statsJson };
  
  // Apply equipment bonuses
  Object.values(inventory.equipment).forEach(equippedItemId => {
    if (equippedItemId) {
      const item = ITEMS[equippedItemId];
      if (item && item.statsJson) {
        Object.keys(item.statsJson).forEach(stat => {
          effectiveStats[stat] = (effectiveStats[stat] || 0) + item.statsJson[stat];
        });
      }
    }
  });
  
  return effectiveStats;
}

// Mock character endpoints
app.get('/api/v1/characters', (req, res) => {
  res.json({ 
    characters: characters.map(char => ({
      ...char,
      statsJson: char.statsJson || {
        hp: 100,
        mp: 50,
        attack: 10,
        defense: 8,
        speed: 6,
        luck: 5,
        currentHp: 100,
        currentMp: 50
      }
    }))
  });
});

app.get('/api/v1/characters/:id', (req, res) => {
  const character = characters.find(c => c.id === req.params.id);
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }
  
  const baseStats = character.statsJson || {
    hp: 100, mp: 50, attack: 10, defense: 8, speed: 6, luck: 5,
    currentHp: 100, currentMp: 50
  };
  
  const effectiveStats = calculateEffectiveStats(character);
  
  res.json({ 
    character: {
      ...character,
      statsJson: baseStats,
      effectiveStats: effectiveStats
    }
  });
});

app.post('/api/v1/characters', (req, res) => {
  const { name, class: characterClass, stats } = req.body;
  
  // Basic validation
  if (!name || !characterClass) {
    return res.status(400).json({ error: 'Name and class are required' });
  }
  
  const newCharacter = {
    id: characterIdCounter.toString(),
    userId: '1', // Mock user ID
    name: name,
    class: characterClass,
    level: 1,
    experience: 0,
    statsJson: stats ? {
      hp: (stats.vitality || 5) * 10,
      mp: (stats.intelligence || 5) * 8,
      attack: stats.strength || 5,
      defense: (stats.vitality || 5) * 1.2,
      speed: stats.dexterity || 5,
      luck: stats.luck || 5,
      currentHp: (stats.vitality || 5) * 10,
      currentMp: (stats.intelligence || 5) * 8
    } : {
      hp: 100,
      mp: 50,
      attack: 10,
      defense: 8,
      speed: 6,
      luck: 5,
      currentHp: 100,
      currentMp: 50
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  characters.push(newCharacter);
  characterIdCounter++;
  
  res.json({
    character: newCharacter,
    message: 'Character created successfully'
  });
});

app.put('/api/v1/characters/:id', (req, res) => {
  const characterIndex = characters.findIndex(c => c.id === req.params.id);
  if (characterIndex === -1) {
    return res.status(404).json({ error: 'Character not found' });
  }
  
  const updatedCharacter = {
    ...characters[characterIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  characters[characterIndex] = updatedCharacter;
  
  res.json({
    character: updatedCharacter,
    message: 'Character updated successfully'
  });
});

app.delete('/api/v1/characters/:id', (req, res) => {
  const characterIndex = characters.findIndex(c => c.id === req.params.id);
  if (characterIndex === -1) {
    return res.status(404).json({ error: 'Character not found' });
  }
  
  characters.splice(characterIndex, 1);
  res.json({ message: 'Character deleted successfully' });
});

// Character classes endpoint
app.get('/api/v1/characters/classes', (req, res) => {
  res.json({
    classes: [
      {
        id: '1',
        name: 'Warrior',
        baseStats: { strength: 8, intelligence: 3, dexterity: 5, vitality: 7 },
        description: 'Masters of melee combat with high strength and defense'
      },
      {
        id: '2',
        name: 'Mage',
        baseStats: { strength: 3, intelligence: 8, dexterity: 4, vitality: 5 },
        description: 'Wielders of magic with high intelligence and magical power'
      },
      {
        id: '3',
        name: 'Rogue',
        baseStats: { strength: 5, intelligence: 4, dexterity: 8, vitality: 6 },
        description: 'Swift and cunning fighters with high dexterity and stealth'
      }
    ]
  });
});

// Inventory management endpoints
app.get('/api/v1/characters/:id/inventory', (req, res) => {
  const character = characters.find(c => c.id === req.params.id);
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }
  
  const inventory = initializeInventory(req.params.id);
  
  // Enrich inventory items with full item data
  const enrichedItems = inventory.items.map(invItem => ({
    ...invItem,
    item: ITEMS[invItem.itemId]
  }));
  
  res.json({
    inventory: {
      ...inventory,
      items: enrichedItems
    }
  });
});

app.post('/api/v1/characters/:id/inventory', (req, res) => {
  const { itemId, quantity = 1 } = req.body;
  
  const character = characters.find(c => c.id === req.params.id);
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }
  
  try {
    const addedItem = addItemToInventory(req.params.id, itemId, quantity);
    res.json({
      item: addedItem,
      message: `Added ${quantity}x ${ITEMS[itemId].name} to inventory`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/v1/characters/:id/inventory/:itemId', (req, res) => {
  const { id: characterId, itemId } = req.params;
  const { quantity = 1 } = req.body;
  
  const character = characters.find(c => c.id === characterId);
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }
  
  const inventory = inventories[characterId];
  if (!inventory) {
    return res.status(404).json({ error: 'Inventory not found' });
  }
  
  const itemIndex = inventory.items.findIndex(i => i.itemId === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found in inventory' });
  }
  
  const inventoryItem = inventory.items[itemIndex];
  
  if (inventoryItem.quantity <= quantity) {
    // Remove item entirely
    inventory.items.splice(itemIndex, 1);
    res.json({ message: 'Item removed from inventory' });
  } else {
    // Reduce quantity
    inventoryItem.quantity -= quantity;
    res.json({ message: `Removed ${quantity}x ${ITEMS[itemId].name}` });
  }
});

app.post('/api/v1/characters/:id/equip/:itemId', (req, res) => {
  const { id: characterId, itemId } = req.params;
  
  const character = characters.find(c => c.id === characterId);
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }
  
  const inventory = initializeInventory(characterId);
  const inventoryItem = inventory.items.find(i => i.itemId === itemId);
  
  if (!inventoryItem) {
    return res.status(404).json({ error: 'Item not found in inventory' });
  }
  
  const item = ITEMS[itemId];
  if (!item.equipSlot) {
    return res.status(400).json({ error: 'Item is not equipable' });
  }
  
  // Unequip current item in that slot
  if (inventory.equipment[item.equipSlot]) {
    const currentItem = inventory.items.find(i => i.itemId === inventory.equipment[item.equipSlot]);
    if (currentItem) {
      currentItem.equipped = false;
      currentItem.equipSlot = null;
    }
  }
  
  // Equip new item
  inventory.equipment[item.equipSlot] = itemId;
  inventoryItem.equipped = true;
  inventoryItem.equipSlot = item.equipSlot;
  
  // Update character effective stats
  const effectiveStats = calculateEffectiveStats(character);
  
  res.json({
    message: `Equipped ${item.name}`,
    equipment: inventory.equipment,
    effectiveStats: effectiveStats
  });
});

app.post('/api/v1/characters/:id/unequip/:slot', (req, res) => {
  const { id: characterId, slot } = req.params;
  
  const character = characters.find(c => c.id === characterId);
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }
  
  const inventory = initializeInventory(characterId);
  const equippedItemId = inventory.equipment[slot];
  
  if (!equippedItemId) {
    return res.status(400).json({ error: 'No item equipped in that slot' });
  }
  
  // Unequip item
  const inventoryItem = inventory.items.find(i => i.itemId === equippedItemId);
  if (inventoryItem) {
    inventoryItem.equipped = false;
    inventoryItem.equipSlot = null;
  }
  
  inventory.equipment[slot] = null;
  
  // Update character effective stats
  const effectiveStats = calculateEffectiveStats(character);
  
  res.json({
    message: `Unequipped item from ${slot}`,
    equipment: inventory.equipment,
    effectiveStats: effectiveStats
  });
});

// Items and Recipes API endpoints
app.get('/api/v1/items', (req, res) => {
  const itemsList = Object.values(ITEMS).map(item => ({
    ...item,
    statsJson: item.statsJson || {}
  }));
  
  res.json({
    items: itemsList
  });
});

app.get('/api/v1/items/:id', (req, res) => {
  const item = ITEMS[req.params.id];
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  res.json({
    item: {
      ...item,
      statsJson: item.statsJson || {}
    }
  });
});

app.get('/api/v1/recipes', (req, res) => {
  const recipesList = Object.values(RECIPES).map(recipe => ({
    ...recipe,
    materials: recipe.materials.map(material => ({
      ...material,
      item: ITEMS[material.itemId]
    })),
    resultItem: ITEMS[recipe.resultItemId]
  }));
  
  res.json({
    recipes: recipesList
  });
});

app.get('/api/v1/recipes/:id', (req, res) => {
  const recipe = RECIPES[req.params.id];
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  
  const enrichedRecipe = {
    ...recipe,
    materials: recipe.materials.map(material => ({
      ...material,
      item: ITEMS[material.itemId]
    })),
    resultItem: ITEMS[recipe.resultItemId]
  };
  
  res.json({
    recipe: enrichedRecipe
  });
});

// Crafting endpoints
app.post('/api/v1/characters/:id/craft/:recipeId', (req, res) => {
  const { id: characterId, recipeId } = req.params;
  
  const character = characters.find(c => c.id === characterId);
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }
  
  const recipe = RECIPES[recipeId];
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  
  const inventory = initializeInventory(characterId);
  
  // Check if character has required materials
  for (const material of recipe.materials) {
    const inventoryItem = inventory.items.find(i => i.itemId === material.itemId);
    if (!inventoryItem || inventoryItem.quantity < material.quantity) {
      return res.status(400).json({ 
        error: `Insufficient materials: need ${material.quantity}x ${ITEMS[material.itemId].name}` 
      });
    }
  }
  
  try {
    // Remove materials from inventory
    for (const material of recipe.materials) {
      const inventoryItem = inventory.items.find(i => i.itemId === material.itemId);
      inventoryItem.quantity -= material.quantity;
      
      // Remove item if quantity is 0
      if (inventoryItem.quantity <= 0) {
        const itemIndex = inventory.items.findIndex(i => i.itemId === material.itemId);
        inventory.items.splice(itemIndex, 1);
      }
    }
    
    // Add crafted item to inventory
    const craftedItem = addItemToInventory(characterId, recipe.resultItemId, 1);
    
    res.json({
      message: `Successfully crafted ${ITEMS[recipe.resultItemId].name}!`,
      craftedItem: {
        ...craftedItem,
        item: ITEMS[recipe.resultItemId]
      },
      recipe: recipe
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Crafting failed: ' + error.message });
  }
});

// Mock dungeon endpoints
app.get('/api/v1/dungeons', (req, res) => {
  res.json({
    dungeons: [
      { 
        id: '1', 
        name: 'Goblin Cave', 
        difficulty: 1,
        maxPlayers: 4,
        layoutJson: { width: 10, height: 10, startRoom: { x: 0, y: 0 }, endRoom: { x: 9, y: 9 }, bossRoom: { x: 9, y: 9 } },
        createdAt: new Date().toISOString()
      },
      { 
        id: '2', 
        name: 'Dragon Lair', 
        difficulty: 5,
        maxPlayers: 8,
        layoutJson: { width: 20, height: 15, startRoom: { x: 0, y: 0 }, endRoom: { x: 19, y: 14 }, bossRoom: { x: 19, y: 14 } },
        createdAt: new Date().toISOString()
      }
    ]
  });
});

app.get('/api/v1/dungeons/:id', (req, res) => {
  const dungeons = [
    { 
      id: '1', 
      name: 'Goblin Cave', 
      difficulty: 1,
      maxPlayers: 4,
      layoutJson: { width: 10, height: 10, startRoom: { x: 0, y: 0 }, endRoom: { x: 9, y: 9 }, bossRoom: { x: 9, y: 9 } },
      createdAt: new Date().toISOString()
    },
    { 
      id: '2', 
      name: 'Dragon Lair', 
      difficulty: 5,
      maxPlayers: 8,
      layoutJson: { width: 20, height: 15, startRoom: { x: 0, y: 0 }, endRoom: { x: 19, y: 14 }, bossRoom: { x: 19, y: 14 } },
      createdAt: new Date().toISOString()
    }
  ];
  
  const dungeon = dungeons.find(d => d.id === req.params.id);
  if (!dungeon) {
    return res.status(404).json({ error: 'Dungeon not found' });
  }
  
  res.json({ dungeon });
});

app.post('/api/v1/dungeons/:id/enter', (req, res) => {
  const { characterId } = req.body;
  const dungeonId = req.params.id;
  
  if (!characterId) {
    return res.status(400).json({ error: 'Character ID is required' });
  }
  
  // Check if character exists
  const character = characters.find(c => c.id === characterId);
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }
  
  // Create new dungeon instance
  const newInstance = {
    id: instanceIdCounter.toString(),
    dungeonId: dungeonId,
    playersJson: [{
      userId: character.userId,
      characterId: character.id,
      characterName: character.name,
      characterClass: character.class,
      characterLevel: character.level,
      characterStats: character.statsJson,
      joinedAt: new Date().toISOString()
    }],
    state: 'active',
    currentRoom: 'start',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  dungeonInstances.push(newInstance);
  instanceIdCounter++;
  
  res.json({
    instance: newInstance,
    message: 'Successfully entered dungeon'
  });
});

app.get('/api/v1/dungeons/instances/:id', (req, res) => {
  const instance = dungeonInstances.find(i => i.id === req.params.id);
  if (!instance) {
    return res.status(404).json({ error: 'Dungeon instance not found' });
  }
  
  res.json({ instance });
});

app.post('/api/v1/dungeons/instances/:id/leave', (req, res) => {
  const instanceIndex = dungeonInstances.findIndex(i => i.id === req.params.id);
  if (instanceIndex === -1) {
    return res.status(404).json({ error: 'Dungeon instance not found' });
  }
  
  // Mark instance as abandoned or remove it
  dungeonInstances[instanceIndex].state = 'abandoned';
  dungeonInstances[instanceIndex].updatedAt = new Date().toISOString();
  
  res.json({ message: 'Successfully left dungeon' });
});

// Generate loot drops
function generateLoot(enemyType = 'goblin') {
  const loot = [];
  
  // Define drop chances based on enemy type
  const dropChances = {
    'Iron Ore': 0.4,      // 40% chance
    'Leather Scraps': 0.3, // 30% chance  
    'Wood Planks': 0.2     // 20% chance
  };
  
  Object.keys(dropChances).forEach(itemName => {
    if (Math.random() < dropChances[itemName]) {
      // Find item by name
      const item = Object.values(ITEMS).find(i => i.name === itemName);
      if (item) {
        let quantity = 1;
        
        // Vary quantity based on item type
        if (itemName === 'Iron Ore') {
          quantity = Math.floor(Math.random() * 3) + 1; // 1-3
        } else if (itemName === 'Leather Scraps') {
          quantity = Math.floor(Math.random() * 2) + 1; // 1-2
        } else {
          quantity = 1; // Wood Planks: just 1
        }
        
        loot.push({
          itemId: item.id,
          quantity: quantity,
          item: item
        });
      }
    }
  });
  
  return loot;
}

const awardLoot = (characterId, loot) => {
  const results = [];
  
  loot.forEach(drop => {
    try {
      addItemToInventory(characterId, drop.itemId, drop.quantity);
      const item = ITEMS[drop.itemId];
      results.push({
        success: true,
        itemName: item.name,
        quantity: drop.quantity,
        message: `Received ${drop.quantity} x ${item.name}`
      });
    } catch (error) {
      results.push({
        success: false,
        itemId: drop.itemId,
        quantity: drop.quantity,
        error: error.message
      });
    }
  });
  
  return results;
};

// Mock combat endpoints
app.post('/api/v1/combat/start', (req, res) => {
  const { characterId, dungeonInstanceId } = req.body;
  
  if (!characterId) {
    return res.status(400).json({ error: 'Character ID is required' });
  }
  
  const character = characters.find(c => c.id === characterId);
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }
  
  // Create mock combat instance
  const newCombat = {
    id: combatIdCounter.toString(),
    instanceId: dungeonInstanceId || null,
    participantsJson: [
      {
        id: character.id,
        userId: character.userId,
        characterId: character.id,
        name: character.name,
        type: 'player',
        stats: character.statsJson,
        currentHp: character.statsJson.currentHp,
        currentMp: character.statsJson.currentMp
      },
      {
        id: 'goblin-1',
        name: 'Goblin Warrior',
        type: 'monster',
        stats: { hp: 60, mp: 20, attack: 10, defense: 8, speed: 12 },
        currentHp: 60,
        currentMp: 20
      }
    ],
    turnOrder: [character.id, 'goblin-1'],
    currentTurn: character.id,
    state: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  combatInstances.push(newCombat);
  combatIdCounter++;
  
  res.json({
    combat: newCombat,
    message: 'Combat started'
  });
});

app.get('/api/v1/combat/:id', (req, res) => {
  const combat = combatInstances.find(c => c.id === req.params.id);
  if (!combat) {
    return res.status(404).json({ error: 'Combat not found' });
  }
  
  res.json({ combat });
});

app.post('/api/v1/combat/:id/action', (req, res) => {
  const { action, target, skillId, itemId } = req.body;
  const combatId = req.params.id;
  
  const combat = combatInstances.find(c => c.id === combatId);
  if (!combat) {
    return res.status(404).json({ error: 'Combat not found' });
  }
  
  // Find the player character
  const player = combat.participantsJson.find(p => p.type === 'player');
  const enemy = combat.participantsJson.find(p => p.type === 'monster');
  
  // Mock combat damage calculation
  const damage = action === 'attack' ? Math.floor(Math.random() * 20) + 10 : undefined;
  const healing = action === 'heal' ? Math.floor(Math.random() * 15) + 10 : undefined;
  
  // Check if combat ends (enemy defeated)
  let combatEnded = false;
  let lootResults = [];
  
  if (action === 'attack' && damage && enemy) {
    enemy.currentHp -= damage;
    if (enemy.currentHp <= 0) {
      combatEnded = true;
      combat.state = 'victory';
      
      // Generate and award loot
      const loot = generateLoot('goblin', player.characterLevel || 1);
      if (loot.length > 0) {
        lootResults = awardLoot(player.characterId, loot);
      }
    }
  }
  
  // Mock combat action result
  const actionResult = {
    action: action,
    actor: { name: player.name },
    target: target ? { id: target, name: enemy?.name || 'Enemy' } : undefined,
    damage: damage,
    healing: healing,
    message: `${player.name} uses ${action}!`,
    nextTurn: combatEnded ? null : 'goblin-1',
    turnOrder: combat.turnOrder,
    combatEnded: combatEnded,
    combatState: combat.state,
    loot: lootResults.length > 0 ? lootResults : undefined,
    timestamp: Date.now()
  };
  
  res.json(actionResult);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
  console.log(`⚡ Simple server ready for connections`);
});