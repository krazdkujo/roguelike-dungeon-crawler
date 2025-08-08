import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');
  
  // Create sample dungeons
  const beginner_dungeon = await prisma.dungeon.upsert({
    where: { id: 'dungeon_1' },
    update: {},
    create: {
      id: 'dungeon_1',
      name: 'Goblin Cave',
      difficulty: 1,
      maxPlayers: 4,
      layoutJson: {
        width: 5,
        height: 5,
        startRoom: { x: 0, y: 2 },
        endRoom: { x: 4, y: 2 },
        bossRoom: { x: 4, y: 2 }
      }
    }
  });
  
  const intermediate_dungeon = await prisma.dungeon.upsert({
    where: { id: 'dungeon_2' },
    update: {},
    create: {
      id: 'dungeon_2',
      name: 'Skeleton Crypt',
      difficulty: 3,
      maxPlayers: 4,
      layoutJson: {
        width: 7,
        height: 7,
        startRoom: { x: 0, y: 3 },
        endRoom: { x: 6, y: 3 },
        bossRoom: { x: 6, y: 3 }
      }
    }
  });
  
  const advanced_dungeon = await prisma.dungeon.upsert({
    where: { id: 'dungeon_3' },
    update: {},
    create: {
      id: 'dungeon_3',
      name: 'Dragon\'s Lair',
      difficulty: 5,
      maxPlayers: 4,
      layoutJson: {
        width: 10,
        height: 10,
        startRoom: { x: 0, y: 5 },
        endRoom: { x: 9, y: 5 },
        bossRoom: { x: 9, y: 5 }
      }
    }
  });
  
  // Create rooms for Goblin Cave
  await prisma.room.createMany({
    data: [
      { id: 'room_1_1', dungeonId: 'dungeon_1', positionX: 0, positionY: 2, type: 'entrance' },
      { id: 'room_1_2', dungeonId: 'dungeon_1', positionX: 1, positionY: 2, type: 'combat', monstersJson: [{ type: 'goblin', count: 2 }] },
      { id: 'room_1_3', dungeonId: 'dungeon_1', positionX: 2, positionY: 2, type: 'treasure' },
      { id: 'room_1_4', dungeonId: 'dungeon_1', positionX: 3, positionY: 2, type: 'combat', monstersJson: [{ type: 'goblin', count: 3 }] },
      { id: 'room_1_5', dungeonId: 'dungeon_1', positionX: 4, positionY: 2, type: 'boss', monstersJson: [{ type: 'goblin_king', count: 1 }] }
    ],
    skipDuplicates: true
  });
  
  // Create sample items
  const items = [
    {
      id: 'item_sword_basic',
      name: 'Iron Sword',
      type: 'weapon',
      rarity: 'common',
      statsJson: { attack: 15, durability: 100 },
      description: 'A sturdy iron sword suitable for beginners'
    },
    {
      id: 'item_staff_basic', 
      name: 'Wooden Staff',
      type: 'weapon',
      rarity: 'common',
      statsJson: { attack: 8, magic: 12, durability: 80 },
      description: 'A simple wooden staff that enhances magical abilities'
    },
    {
      id: 'item_dagger_basic',
      name: 'Steel Dagger', 
      type: 'weapon',
      rarity: 'common',
      statsJson: { attack: 12, speed: 5, durability: 90 },
      description: 'A quick and nimble steel dagger'
    },
    {
      id: 'item_armor_leather',
      name: 'Leather Armor',
      type: 'armor',
      rarity: 'common',
      statsJson: { defense: 8, durability: 120 },
      description: 'Basic leather armor providing modest protection'
    },
    {
      id: 'item_potion_health',
      name: 'Health Potion',
      type: 'consumable',
      rarity: 'common',
      statsJson: { healAmount: 50 },
      description: 'Restores 50 HP when consumed'
    },
    {
      id: 'item_potion_mana',
      name: 'Mana Potion',
      type: 'consumable', 
      rarity: 'common',
      statsJson: { manaAmount: 30 },
      description: 'Restores 30 MP when consumed'
    }
  ];
  
  for (const item of items) {
    await prisma.item.upsert({
      where: { id: item.id },
      update: {},
      create: item
    });
  }
  
  // Create sample skills
  const skills = [
    {
      id: 'skill_warrior_slash',
      name: 'Power Slash',
      class: 'warrior',
      levelRequired: 1,
      effectJson: { damage: 1.5, accuracy: 0.9, cost: 5 },
      description: 'A powerful sword attack that deals 150% normal damage'
    },
    {
      id: 'skill_warrior_block',
      name: 'Shield Block',
      class: 'warrior',
      levelRequired: 2,
      effectJson: { defenseBoost: 2.0, duration: 3, cost: 8 },
      description: 'Doubles defense for 3 turns'
    },
    {
      id: 'skill_mage_fireball',
      name: 'Fireball',
      class: 'mage',
      levelRequired: 1,
      effectJson: { damage: 1.8, element: 'fire', cost: 12 },
      description: 'Launches a fireball dealing fire damage'
    },
    {
      id: 'skill_mage_heal',
      name: 'Heal',
      class: 'mage', 
      levelRequired: 1,
      effectJson: { healAmount: 40, cost: 10 },
      description: 'Restores 40 HP to target ally'
    },
    {
      id: 'skill_rogue_backstab',
      name: 'Backstab',
      class: 'rogue',
      levelRequired: 1,
      effectJson: { damage: 2.0, critChance: 0.3, cost: 8 },
      description: 'Attack from behind with high critical hit chance'
    },
    {
      id: 'skill_rogue_stealth',
      name: 'Stealth',
      class: 'rogue',
      levelRequired: 2,
      effectJson: { evasionBoost: 0.5, duration: 2, cost: 6 },
      description: 'Increases evasion by 50% for 2 turns'
    }
  ];
  
  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { id: skill.id },
      update: {},
      create: skill
    });
  }
  
  console.log('✅ Database seeded successfully!');
  console.log(`Created ${items.length} items and ${skills.length} skills`);
  console.log(`Created 3 dungeons: ${beginner_dungeon.name}, ${intermediate_dungeon.name}, ${advanced_dungeon.name}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });