import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import './combat.scss';

interface CombatEntity {
  id: string;
  name: string;
  icon: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  level: number;
  class: string;
  isPlayer: boolean;
  status: string[];
  stats: {
    attack: number;
    defense: number;
    speed: number;
  };
}

interface CombatAction {
  id: string;
  name: string;
  icon: string;
  description: string;
  cost: number;
  type: 'attack' | 'skill' | 'item' | 'defend';
  damage?: number;
  healing?: number;
  effects?: string[];
  target: 'enemy' | 'self' | 'all';
}

interface CombatLog {
  id: string;
  message: string;
  type: 'action' | 'damage' | 'healing' | 'status' | 'system';
  timestamp: Date;
}

const MOCK_PLAYER: CombatEntity = {
  id: 'player',
  name: 'Hero',
  icon: '⚔️',
  health: 85,
  maxHealth: 100,
  mana: 40,
  maxMana: 50,
  level: 3,
  class: 'warrior',
  isPlayer: true,
  status: [],
  stats: { attack: 15, defense: 12, speed: 8 }
};

const MOCK_ENEMIES: CombatEntity[] = [
  {
    id: 'goblin',
    name: 'Goblin Warrior',
    icon: '👹',
    health: 60,
    maxHealth: 60,
    mana: 20,
    maxMana: 20,
    level: 2,
    class: 'monster',
    isPlayer: false,
    status: [],
    stats: { attack: 10, defense: 8, speed: 12 }
  }
];

const COMBAT_ACTIONS: CombatAction[] = [
  {
    id: 'basic-attack',
    name: 'Attack',
    icon: '⚔️',
    description: 'Basic weapon attack',
    cost: 0,
    type: 'attack',
    damage: 15,
    target: 'enemy'
  },
  {
    id: 'power-strike',
    name: 'Power Strike',
    icon: '💥',
    description: 'Powerful attack dealing extra damage',
    cost: 10,
    type: 'skill',
    damage: 25,
    target: 'enemy'
  },
  {
    id: 'heal',
    name: 'Heal',
    icon: '❤️',
    description: 'Restore health points',
    cost: 8,
    type: 'skill',
    healing: 20,
    target: 'self'
  },
  {
    id: 'defend',
    name: 'Defend',
    icon: '🛡️',
    description: 'Reduce incoming damage by 50%',
    cost: 0,
    type: 'defend',
    effects: ['defense_boost'],
    target: 'self'
  }
];

type CombatPhase = 'selecting' | 'animating' | 'enemy-turn' | 'victory' | 'defeat';

const CombatPage: React.FC = () => {
  const { combatId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [player, setPlayer] = useState<CombatEntity>(MOCK_PLAYER);
  const [enemies, setEnemies] = useState<CombatEntity[]>(MOCK_ENEMIES);
  const [selectedAction, setSelectedAction] = useState<CombatAction | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<CombatEntity | null>(null);
  const [combatPhase, setCombatPhase] = useState<CombatPhase>('selecting');
  const [combatLog, setCombatLog] = useState<CombatLog[]>([]);
  const [turn, setTurn] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize combat
    addToCombatLog('Combat begins! Defeat your enemies!', 'system');
  }, []);

  const addToCombatLog = (message: string, type: CombatLog['type']) => {
    const logEntry: CombatLog = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date()
    };
    setCombatLog(prev => [...prev.slice(-9), logEntry]); // Keep last 10 entries
  };

  const handleActionSelect = (action: CombatAction) => {
    if (combatPhase !== 'selecting') return;
    
    setSelectedAction(action);
    
    if (action.target === 'enemy') {
      // Need to select target
      setSelectedTarget(null);
    } else {
      // Self-targeting action
      setSelectedTarget(player);
    }
  };

  const handleTargetSelect = (target: CombatEntity) => {
    if (!selectedAction || combatPhase !== 'selecting') return;
    setSelectedTarget(target);
  };

  const executeAction = async () => {
    if (!selectedAction || !selectedTarget) return;
    
    setIsLoading(true);
    setCombatPhase('animating');
    
    try {
      // Check if player can afford the action
      if (selectedAction.cost > player.mana) {
        addToCombatLog('Not enough mana!', 'system');
        return;
      }
      
      // Execute player action
      await performAction(player, selectedAction, selectedTarget);
      
      // Check if combat is over
      if (enemies.every(e => e.health <= 0)) {
        setCombatPhase('victory');
        addToCombatLog('Victory! All enemies defeated!', 'system');
        return;
      }
      
      // Enemy turn
      setCombatPhase('enemy-turn');
      await performEnemyTurn();
      
      // Check if player is defeated
      if (player.health <= 0) {
        setCombatPhase('defeat');
        addToCombatLog('Defeat! You have fallen in combat!', 'system');
        return;
      }
      
      // Next turn
      setTurn(prev => prev + 1);
      setCombatPhase('selecting');
      
    } finally {
      setIsLoading(false);
      setSelectedAction(null);
      setSelectedTarget(null);
    }
  };

  const performAction = async (actor: CombatEntity, action: CombatAction, target: CombatEntity) => {
    // Simulate action delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Deduct mana cost
    if (actor.isPlayer) {
      setPlayer(prev => ({ ...prev, mana: Math.max(0, prev.mana - action.cost) }));
    }
    
    addToCombatLog(`${actor.name} uses ${action.name}!`, 'action');
    
    if (action.damage) {
      const damage = calculateDamage(actor, target, action.damage);
      
      if (target.isPlayer) {
        setPlayer(prev => ({ ...prev, health: Math.max(0, prev.health - damage) }));
      } else {
        setEnemies(prev => prev.map(e => 
          e.id === target.id ? { ...e, health: Math.max(0, e.health - damage) } : e
        ));
      }
      
      addToCombatLog(`${target.name} takes ${damage} damage!`, 'damage');
    }
    
    if (action.healing) {
      const healing = action.healing;
      
      if (target.isPlayer) {
        setPlayer(prev => ({ ...prev, health: Math.min(prev.maxHealth, prev.health + healing) }));
      } else {
        setEnemies(prev => prev.map(e => 
          e.id === target.id ? { ...e, health: Math.min(e.maxHealth, e.health + healing) } : e
        ));
      }
      
      addToCombatLog(`${target.name} recovers ${healing} health!`, 'healing');
    }
  };

  const performEnemyTurn = async () => {
    for (const enemy of enemies.filter(e => e.health > 0)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple AI: basic attack
      const basicAttack = COMBAT_ACTIONS.find(a => a.id === 'basic-attack')!;
      await performAction(enemy, basicAttack, player);
    }
  };

  const calculateDamage = (attacker: CombatEntity, target: CombatEntity, baseDamage: number): number => {
    const attackPower = attacker.stats.attack;
    const defense = target.stats.defense;
    const damage = Math.max(1, baseDamage + attackPower - defense + Math.random() * 5);
    return Math.floor(damage);
  };

  const getHealthPercentage = (entity: CombatEntity) => {
    return (entity.health / entity.maxHealth) * 100;
  };

  const getManaPercentage = (entity: CombatEntity) => {
    return (entity.mana / entity.maxMana) * 100;
  };

  const canUseAction = (action: CombatAction) => {
    return player.mana >= action.cost && combatPhase === 'selecting';
  };

  const handleCombatEnd = () => {
    navigate('/town');
  };

  return (
    <div className="combat-page background-sprite combat-arena">
      <div className="combat-header">
        <h1 className="heading-game-title">Combat Arena</h1>
        <div className="combat-info">
          <span className="turn-counter">Turn {turn}</span>
          <span className="phase-indicator">{combatPhase}</span>
        </div>
      </div>

      <div className="combat-battlefield">
        {/* Enemy Area */}
        <div className="enemies-area">
          <h3 className="area-title">Enemies</h3>
          <div className="entities-grid">
            {enemies.map(enemy => (
              <div
                key={enemy.id}
                className={`entity-card enemy ${
                  selectedTarget?.id === enemy.id ? 'selected' : ''
                } ${
                  enemy.health <= 0 ? 'defeated' : ''
                } ${
                  selectedAction?.target === 'enemy' && enemy.health > 0 ? 'targetable' : ''
                }`}
                onClick={() => selectedAction?.target === 'enemy' && enemy.health > 0 && handleTargetSelect(enemy)}
              >
                <div className="entity-portrait">{enemy.icon}</div>
                <div className="entity-info">
                  <h4 className="entity-name">{enemy.name}</h4>
                  <div className="entity-level">Lv. {enemy.level}</div>
                  <div className="health-bar">
                    <div 
                      className="health-fill"
                      style={{ width: `${getHealthPercentage(enemy)}%` }}
                    ></div>
                    <span className="health-text">{enemy.health}/{enemy.maxHealth}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Player Area */}
        <div className="player-area">
          <h3 className="area-title">Your Character</h3>
          <div className="entity-card player">
            <div className="entity-portrait">{player.icon}</div>
            <div className="entity-info">
              <h4 className="entity-name">{player.name}</h4>
              <div className="entity-level">Lv. {player.level}</div>
              <div className="health-bar">
                <div 
                  className={`health-fill ${
                    getHealthPercentage(player) <= 25 ? 'critical' : ''
                  }`}
                  style={{ width: `${getHealthPercentage(player)}%` }}
                ></div>
                <span className="health-text">{player.health}/{player.maxHealth}</span>
              </div>
              <div className="mana-bar">
                <div 
                  className="mana-fill"
                  style={{ width: `${getManaPercentage(player)}%` }}
                ></div>
                <span className="mana-text">{player.mana}/{player.maxMana}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="combat-interface">
        {/* Combat Actions */}
        <div className="actions-panel">
          <h3 className="panel-title">Actions</h3>
          <div className="actions-grid">
            {COMBAT_ACTIONS.map(action => (
              <button
                key={action.id}
                className={`action-btn ${
                  selectedAction?.id === action.id ? 'selected' : ''
                } ${
                  canUseAction(action) ? 'available' : 'unavailable'
                }`}
                onClick={() => handleActionSelect(action)}
                disabled={!canUseAction(action)}
              >
                <span className="action-icon">{action.icon}</span>
                <span className="action-name">{action.name}</span>
                {action.cost > 0 && (
                  <span className="action-cost">{action.cost} MP</span>
                )}
              </button>
            ))}
          </div>
          
          {selectedAction && (
            <div className="action-details">
              <h4>{selectedAction.name}</h4>
              <p>{selectedAction.description}</p>
              {selectedTarget && (
                <button
                  className="btn btn-primary execute-btn"
                  onClick={executeAction}
                  disabled={isLoading || combatPhase !== 'selecting'}
                >
                  {isLoading ? 'Executing...' : `Use on ${selectedTarget.name}`}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Combat Log */}
        <div className="log-panel">
          <h3 className="panel-title">Combat Log</h3>
          <div className="combat-log">
            {combatLog.map(entry => (
              <div key={entry.id} className={`log-entry log-${entry.type}`}>
                {entry.message}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Combat End Modal */}
      {(combatPhase === 'victory' || combatPhase === 'defeat') && (
        <div className="combat-end-overlay">
          <div className="combat-end-modal">
            <div className={`end-result ${combatPhase}`}>
              <h2>{combatPhase === 'victory' ? 'Victory!' : 'Defeat!'}</h2>
              <p>
                {combatPhase === 'victory' 
                  ? 'You have emerged victorious from combat!'
                  : 'You have been defeated in battle...'}
              </p>
              {combatPhase === 'victory' && (
                <div className="rewards">
                  <p>Rewards:</p>
                  <ul>
                    <li>+50 Experience</li>
                    <li>+25 Gold</li>
                    <li>Iron Sword (Common)</li>
                  </ul>
                </div>
              )}
            </div>
            <button className="btn btn-primary" onClick={handleCombatEnd}>
              Return to Town
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CombatPage;