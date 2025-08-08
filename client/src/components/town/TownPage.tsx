import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { gameService } from '@/services/gameService';
import { fetchDungeons } from '@/stores/gameSlice';
import { apiClient } from '@/services/apiClient';
import './town.scss';

interface NPC {
  id: string;
  name: string;
  role: string;
  icon: string;
  description: string;
  dialogue: string[];
  services?: string[];
}

interface Location {
  id: string;
  name: string;
  icon: string;
  description: string;
  available: boolean;
  requiresLevel?: number;
  action: string;
  route?: string;
}

const TOWN_NPCS: NPC[] = [
  {
    id: 'blacksmith',
    name: 'Master Gareth',
    role: 'Blacksmith',
    icon: '🔨',
    description: 'Forge and upgrade your weapons and armor',
    dialogue: [
      'Welcome to my forge, adventurer!',
      'I can craft the finest weapons and armor in the realm.',
      'Bring me materials and gold, and I\'ll make you equipment worthy of legends!'
    ],
    services: ['Craft Weapons', 'Upgrade Armor', 'Repair Equipment']
  },
  {
    id: 'alchemist',
    name: 'Sage Elara',
    role: 'Alchemist',
    icon: '⚗️',
    description: 'Brew potions and magical elixirs',
    dialogue: [
      'Ah, another soul seeking the power of alchemy...',
      'My potions can heal wounds, boost strength, and protect against magic.',
      'Choose wisely, for each brew contains ancient secrets.'
    ],
    services: ['Buy Potions', 'Brew Custom Elixirs', 'Learn Alchemy']
  },
  {
    id: 'trainer',
    name: 'Captain Marcus',
    role: 'Combat Trainer',
    icon: '🏋️',
    description: 'Train your combat skills and abilities',
    dialogue: [
      'Ready to improve your fighting prowess?',
      'Every great adventurer needs proper training.',
      'I\'ll teach you techniques that will keep you alive in the dungeons!'
    ],
    services: ['Skill Training', 'Combat Techniques', 'Stat Boost']
  },
  {
    id: 'merchant',
    name: 'Trader Finn',
    role: 'General Merchant',
    icon: '💰',
    description: 'Buy and sell general goods',
    dialogue: [
      'Come, come! Best prices in town!',
      'I have supplies for every adventuring need.',
      'Sell your loot here, or stock up for your next quest!'
    ],
    services: ['Buy Items', 'Sell Loot', 'Trade Goods']
  },
  {
    id: 'innkeeper',
    name: 'Molly Warmheart',
    role: 'Innkeeper',
    icon: '🏠',
    description: 'Rest and recover your strength',
    dialogue: [
      'Welcome to the Sleeping Dragon Inn!',
      'A warm bed and hot meal will restore your vigor.',
      'Stay the night and wake refreshed for your adventures!'
    ],
    services: ['Rest (Full Heal)', 'Hot Meal (+Stats)', 'Room Storage']
  },
  {
    id: 'guide',
    name: 'Explorer Kael',
    role: 'Dungeon Guide',
    icon: '🗺️',
    description: 'Information about dungeons and quests',
    dialogue: [
      'Seeking adventure in the deep places of the world?',
      'I know every dungeon, every secret passage.',
      'For the right price, I\'ll share what I know...'
    ],
    services: ['Dungeon Maps', 'Quest Information', 'Secret Locations']
  }
];

const TOWN_LOCATIONS: Location[] = [
  {
    id: 'dungeon-entrance',
    name: 'Dungeon Entrance',
    icon: '🚪',
    description: 'Enter procedurally generated dungeons for loot and experience',
    available: true,
    action: 'Enter Dungeon'
  },
  {
    id: 'arena',
    name: 'Combat Arena',
    icon: '⚔️',
    description: 'Test your skills against other players',
    available: true,
    requiresLevel: 3,
    action: 'Enter Arena'
  },
  {
    id: 'guild-hall',
    name: 'Guild Hall',
    icon: '🏛️',
    description: 'Join a guild and participate in group activities',
    available: false,
    requiresLevel: 5,
    action: 'Coming Soon',
  },
  {
    id: 'market-square',
    name: 'Market Square',
    icon: '🏪',
    description: 'Player marketplace for trading items',
    available: false,
    requiresLevel: 7,
    action: 'Coming Soon',
  }
];

const TownPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { currentCharacter } = useAppSelector((state) => state.game);
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [userStats, setUserStats] = useState({ level: 1, gold: 100, health: 100, mana: 50 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load user stats when component mounts
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      // This would normally fetch from the game service
      // For now, using mock data
      setUserStats({ level: 3, gold: 250, health: 85, mana: 40 });
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const handleNPCClick = (npc: NPC) => {
    setSelectedNPC(npc);
    setDialogueIndex(0);
  };

  const handleDialogueContinue = () => {
    if (selectedNPC && dialogueIndex < selectedNPC.dialogue.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    }
  };

  const handleServiceClick = (service: string) => {
    // This would normally interact with the backend
    console.log(`Using service: ${service} from ${selectedNPC?.name}`);
    // For now, just show an alert
    alert(`${service} feature coming soon!`);
  };

  const handleLocationClick = async (location: Location) => {
    if (!location.available) {
      alert(`${location.name} is not yet available!`);
      return;
    }

    if (!currentCharacter) {
      alert('You need to select a character first! Go to Characters page.');
      return;
    }

    if (location.requiresLevel && userStats.level < location.requiresLevel) {
      alert(`You need to be level ${location.requiresLevel} to access ${location.name}!`);
      return;
    }

    setIsLoading(true);
    
    try {
      if (location.id === 'dungeon-entrance') {
        // Enter Goblin Cave (dungeon ID 1)
        const response = await apiClient.post('/dungeons/1/enter', {
          characterId: currentCharacter.id
        });
        
        navigate(`/dungeon/${response.instance.id}`);
      } else if (location.id === 'arena') {
        // Start combat
        const response = await apiClient.post('/combat/start', {
          characterId: currentCharacter.id
        });
        
        navigate(`/combat/${response.combat.id}`);
      }
    } catch (error: any) {
      console.error(`Failed to access ${location.name}:`, error);
      alert(`Failed to access ${location.name}: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const closeNPCDialog = () => {
    setSelectedNPC(null);
    setDialogueIndex(0);
  };

  return (
    <div className="town-page">
      {/* Header with user stats */}
      <div className="town-header">
        <h1 className="heading-game-title">🏘️ Town Square</h1>
        <p className="text-secondary">Rest, resupply, and prepare for your next adventure</p>
        
        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-label">Level</span>
            <span className="stat-value">{userStats.level}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">💰</span>
            <span className="stat-label">Gold</span>
            <span className="stat-value">{userStats.gold}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">❤️</span>
            <span className="stat-label">HP</span>
            <span className="stat-value">{userStats.health}/100</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">💙</span>
            <span className="stat-label">MP</span>
            <span className="stat-value">{userStats.mana}/100</span>
          </div>
        </div>
      </div>

      <div className="town-layout">
        {/* NPCs Section */}
        <div className="town-section">
          <h2 className="heading-section">Town NPCs</h2>
          <div className="npcs-grid">
            {TOWN_NPCS.map((npc) => (
              <div
                key={npc.id}
                className="npc-card card"
                onClick={() => handleNPCClick(npc)}
              >
                <div className="npc-icon">{npc.icon}</div>
                <div className="npc-info">
                  <h3 className="npc-name">{npc.name}</h3>
                  <p className="npc-role text-class">{npc.role}</p>
                  <p className="npc-description">{npc.description}</p>
                </div>
                <div className="npc-services">
                  {npc.services?.slice(0, 2).map((service, index) => (
                    <span key={index} className="service-tag">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Locations Section */}
        <div className="town-section">
          <h2 className="heading-section">Locations</h2>
          <div className="locations-grid">
            {TOWN_LOCATIONS.map((location) => (
              <div
                key={location.id}
                className={`location-card card ${
                  location.available ? 'available' : 'unavailable'
                }`}
                onClick={() => handleLocationClick(location)}
              >
                <div className="location-icon">{location.icon}</div>
                <div className="location-info">
                  <h3 className="location-name">{location.name}</h3>
                  <p className="location-description">{location.description}</p>
                  {location.requiresLevel && (
                    <p className="location-requirement">
                      Requires Level {location.requiresLevel}
                    </p>
                  )}
                </div>
                <button
                  className={`btn ${
                    location.available ? 'btn-primary' : 'btn-secondary'
                  }`}
                  disabled={!location.available || isLoading}
                >
                  {isLoading ? 'Loading...' : location.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NPC Dialog Modal */}
      {selectedNPC && (
        <div className="dialog-overlay" onClick={closeNPCDialog}>
          <div className="dialog-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <div className="npc-portrait">{selectedNPC.icon}</div>
              <div className="npc-info">
                <h3 className="npc-name">{selectedNPC.name}</h3>
                <p className="npc-role">{selectedNPC.role}</p>
              </div>
              <button className="dialog-close" onClick={closeNPCDialog}>
                ❌
              </button>
            </div>
            
            <div className="dialog-content">
              <div className="text-dialog">
                <p>{selectedNPC.dialogue[dialogueIndex]}</p>
              </div>
              
              {dialogueIndex < selectedNPC.dialogue.length - 1 ? (
                <button
                  className="btn btn-primary"
                  onClick={handleDialogueContinue}
                >
                  Continue...
                </button>
              ) : (
                <div className="services-list">
                  <h4 className="services-title">Available Services:</h4>
                  <div className="services-grid">
                    {selectedNPC.services?.map((service, index) => (
                      <button
                        key={index}
                        className="btn btn-secondary service-btn"
                        onClick={() => handleServiceClick(service)}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TownPage;