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
    icon: 'sword',
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
    icon: 'potion-healing',
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
    icon: 'sword',
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
    icon: 'chest',
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
    icon: 'health',
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
    icon: 'experience',
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
    icon: 'sword',
    description: 'Test your skills against other players',
    available: true,
    requiresLevel: 3,
    action: 'Enter Arena'
  },
  {
    id: 'guild-hall',
    name: 'Guild Hall',
    icon: 'magic',
    description: 'Join a guild and participate in group activities',
    available: false,
    requiresLevel: 5,
    action: 'Coming Soon',
  },
  {
    id: 'market-square',
    name: 'Market Square',
    icon: 'chest',
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
    <div className="town-page background-sprite town">
      {/* SNES Header with user stats */}
      <div className="town-header">
        <h1 className="heading-snes-title">Town Square</h1>
        <p className="text-snes-secondary">Rest, resupply, and prepare for your next adventure</p>
        
        <div className="menu-snes user-stats">
          <div className="stat-snes">
            <div className="nav-icon-sprite experience"></div>
            <span className="text-snes-ui stat-label">LV</span>
            <span className="text-snes-stat stat-value">{userStats.level}</span>
          </div>
          <div className="stat-snes">
            <div className="item-sprite chest small"></div>
            <span className="text-snes-ui stat-label">GP</span>
            <span className="text-snes-stat stat-value">{userStats.gold}</span>
          </div>
          <div className="stat-snes">
            <div className="nav-icon-sprite health"></div>
            <span className="text-snes-ui stat-label">HP</span>
            <span className="text-snes-stat stat-hp stat-value">{userStats.health}/100</span>
          </div>
          <div className="stat-snes">
            <div className="nav-icon-sprite magic"></div>
            <span className="text-snes-ui stat-label">MP</span>
            <span className="text-snes-stat stat-mp stat-value">{userStats.mana}/100</span>
          </div>
        </div>
      </div>

      <div className="town-layout">
        {/* SNES NPCs Section */}
        <div className="town-section">
          <h2 className="heading-snes-section">Town NPCs</h2>
          <div className="menu-snes-grid menu-snes-grid-3">
            {TOWN_NPCS.map((npc) => (
              <div
                key={npc.id}
                className="menu-snes-character npc-card"
                onClick={() => handleNPCClick(npc)}
              >
                <div className={`nav-icon-sprite ${npc.icon}`}></div>
                <div className="npc-info">
                  <h3 className="heading-snes-card npc-name">{npc.name}</h3>
                  <p className="text-snes-class npc-role">{npc.role}</p>
                  <p className="text-snes-ui npc-description">{npc.description}</p>
                </div>
                <div className="npc-services">
                  {npc.services?.slice(0, 2).map((service, index) => (
                    <span key={index} className="text-snes-ui service-tag">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SNES Locations Section */}
        <div className="town-section">
          <h2 className="heading-snes-section">Locations</h2>
          <div className="menu-snes-grid menu-snes-grid-2">
            {TOWN_LOCATIONS.map((location) => (
              <div
                key={location.id}
                className={`menu-snes location-card ${
                  location.available ? 'available' : 'unavailable'
                }`}
                onClick={() => handleLocationClick(location)}
              >
                <div className={`nav-icon-sprite ${location.icon}`}></div>
                <div className="location-info">
                  <h3 className="heading-snes-card location-name">{location.name}</h3>
                  <p className="text-snes-ui location-description">{location.description}</p>
                  {location.requiresLevel && (
                    <p className="text-snes-warning location-requirement">
                      Requires Level {location.requiresLevel}
                    </p>
                  )}
                </div>
                <button
                  className={`btn-snes ${
                    location.available ? 'btn-snes-primary' : 'btn-snes-secondary'
                  }`}
                  disabled={!location.available || isLoading}
                >
                  {isLoading ? (
                    <span className="text-snes-loading">Loading</span>
                  ) : (
                    location.action
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SNES NPC Dialog */}
      {selectedNPC && (
        <div className="dialog-overlay" onClick={closeNPCDialog}>
          <div className="dialog-snes-choice" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header-snes">
              <div className={`nav-icon-sprite ${selectedNPC.icon}`}></div>
              <div className="npc-info-snes">
                <h3 className="heading-snes-dialog npc-name">{selectedNPC.name}</h3>
                <p className="text-snes-class npc-role">{selectedNPC.role}</p>
              </div>
              <button className="btn-snes btn-snes-danger dialog-close" onClick={closeNPCDialog}>
                Close
              </button>
            </div>
            
            <div className="dialog-content-snes">
              <div className="dialog-snes">
                <div className="dialog-text-snes">
                  <span className="speaker-snes">{selectedNPC.name}:</span>
                  <p>{selectedNPC.dialogue[dialogueIndex]}</p>
                </div>
                
                {dialogueIndex < selectedNPC.dialogue.length - 1 ? (
                  <div className="dialog-controls-snes">
                    <button
                      className="btn-snes btn-snes-primary"
                      onClick={handleDialogueContinue}
                    >
                      Continue
                    </button>
                    <span className="dialog-continue-snes">Press to continue</span>
                  </div>
                ) : (
                  <div className="services-list-snes">
                    <h4 className="heading-snes-dialog services-title">Available Services:</h4>
                    <div className="choices-list-snes">
                      {selectedNPC.services?.map((service, index) => (
                        <div
                          key={index}
                          className="choice-item-snes service-btn"
                          onClick={() => handleServiceClick(service)}
                        >
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TownPage;