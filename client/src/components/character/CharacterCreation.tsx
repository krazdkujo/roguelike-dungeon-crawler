import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { createCharacter } from '@/stores/gameSlice';
import './character.scss';

interface CharacterCreationForm {
  name: string;
  class: 'warrior' | 'mage' | 'rogue';
  stats: {
    strength: number;
    intelligence: number;
    dexterity: number;
    vitality: number;
  };
}

const CHARACTER_CLASSES = {
  warrior: {
    name: 'Warrior',
    icon: 'warrior',
    description: 'Masters of melee combat with high strength and defense',
    baseStats: { strength: 8, intelligence: 3, dexterity: 5, vitality: 7 }
  },
  mage: {
    name: 'Mage',
    icon: 'mage',
    description: 'Wielders of magic with high intelligence and magical power',
    baseStats: { strength: 3, intelligence: 8, dexterity: 4, vitality: 5 }
  },
  rogue: {
    name: 'Rogue',
    icon: 'rogue',
    description: 'Swift and cunning fighters with high dexterity and stealth',
    baseStats: { strength: 5, intelligence: 4, dexterity: 8, vitality: 6 }
  }
};

const STAT_POINTS_TOTAL = 20;

const CharacterCreation: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availablePoints, setAvailablePoints] = useState(STAT_POINTS_TOTAL);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm<CharacterCreationForm>({
    defaultValues: {
      name: '',
      class: 'warrior',
      stats: CHARACTER_CLASSES.warrior.baseStats
    },
    mode: 'onChange'
  });

  const selectedClass = watch('class');
  const currentStats = watch('stats');

  useEffect(() => {
    // Update stats when class changes
    const baseStats = CHARACTER_CLASSES[selectedClass].baseStats;
    setValue('stats', baseStats);
    calculateAvailablePoints(baseStats);
  }, [selectedClass, setValue]);

  useEffect(() => {
    // Recalculate available points when stats change
    if (currentStats) {
      calculateAvailablePoints(currentStats);
    }
  }, [currentStats]);

  const calculateAvailablePoints = (stats: any) => {
    const totalUsed = Object.values(stats).reduce((sum: number, value: any) => sum + value, 0);
    const baseTotal = Object.values(CHARACTER_CLASSES[selectedClass].baseStats).reduce((sum, value) => sum + value, 0);
    setAvailablePoints(STAT_POINTS_TOTAL + baseTotal - totalUsed);
  };

  const handleStatChange = (statName: keyof CharacterCreationForm['stats'], value: number) => {
    const newStats = { ...currentStats, [statName]: value };
    setValue('stats', newStats);
  };

  const onSubmit = async (data: CharacterCreationForm) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create character via Redux action
      const resultAction = await dispatch(createCharacter({
        name: data.name,
        class: data.class,
        stats: data.stats
      }));

      // Check if creation was successful
      if (createCharacter.fulfilled.match(resultAction)) {
        // Navigate to character select
        navigate('/characters');
      } else {
        throw new Error(resultAction.payload as string || 'Failed to create character');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create character');
    } finally {
      setLoading(false);
    }
  };

  const getStatColor = (value: number, baseStat: number) => {
    if (value > baseStat) return 'stat-boosted';
    if (value < baseStat) return 'stat-reduced';
    return 'stat-normal';
  };

  return (
    <div className="character-creation">
      <div className="page-header">
        <h1 className="heading-game-title">Create New Character</h1>
        <p className="text-secondary">Choose your class and customize your adventurer</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="character-form">
        {error && (
          <div className="card-status status-error">
            <div className="nav-icon-sprite settings"></div>
            <div className="status-content">
              <div className="status-title">Creation Failed</div>
              <div className="status-message">{error}</div>
            </div>
          </div>
        )}

        <div className="form-section">
          <h3 className="heading-section">Character Details</h3>
          <div className="card">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Character Name <span className="required">*</span>
              </label>
              <input
                {...register('name', {
                  required: 'Character name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  maxLength: { value: 20, message: 'Name cannot exceed 20 characters' },
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message: 'Name can only contain letters and spaces'
                  }
                })}
                type="text"
                id="name"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter your character's name"
              />
              {errors.name && (
                <span className="field-error">{errors.name.message}</span>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="heading-section">Choose Your Class</h3>
          <div className="class-selector">
            {Object.entries(CHARACTER_CLASSES).map(([key, classInfo]) => (
              <div key={key} className={`class-option ${key}`}>
                <input
                  {...register('class', { required: 'Please select a class' })}
                  type="radio"
                  id={key}
                  value={key}
                />
                <label htmlFor={key} className="class-card">
                  <div className={`character-portrait large ${classInfo.icon}`}></div>
                  <h4 className="class-name">{classInfo.name}</h4>
                  <p className="class-description">{classInfo.description}</p>
                  <div className="class-base-stats">
                    <div className="stat-row">
                      <span>STR: {classInfo.baseStats.strength}</span>
                      <span>INT: {classInfo.baseStats.intelligence}</span>
                    </div>
                    <div className="stat-row">
                      <span>DEX: {classInfo.baseStats.dexterity}</span>
                      <span>VIT: {classInfo.baseStats.vitality}</span>
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3 className="heading-section">
            Customize Stats 
            <span className="stat-points-remaining">
              Points Remaining: <strong>{availablePoints}</strong>
            </span>
          </h3>
          <div className="card stats-customization">
            <div className="stats-grid">
              {Object.entries(currentStats || {}).map(([statName, value]) => {
                const baseStat = CHARACTER_CLASSES[selectedClass].baseStats[statName as keyof typeof CHARACTER_CLASSES.warrior.baseStats];
                const minValue = Math.max(1, baseStat - 3);
                const maxValue = Math.min(15, baseStat + availablePoints);
                
                return (
                  <div key={statName} className="stat-slider">
                    <div className="slider-label">
                      <span className="stat-name">{statName.toUpperCase()}</span>
                      <span className={`stat-value ${getStatColor(value, baseStat)}`}>
                        {value}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={minValue}
                      max={maxValue}
                      value={value}
                      onChange={(e) => handleStatChange(
                        statName as keyof CharacterCreationForm['stats'],
                        parseInt(e.target.value)
                      )}
                      className="stat-range"
                    />
                    <div className="stat-info">
                      <span className="stat-base">Base: {baseStat}</span>
                      <span className="stat-range-text">
                        ({minValue}-{maxValue})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="stat-descriptions">
              <div className="stat-desc">
                <strong>Strength:</strong> Increases physical damage and carrying capacity
              </div>
              <div className="stat-desc">
                <strong>Intelligence:</strong> Increases magical damage and mana pool
              </div>
              <div className="stat-desc">
                <strong>Dexterity:</strong> Increases accuracy, critical hit chance, and speed
              </div>
              <div className="stat-desc">
                <strong>Vitality:</strong> Increases health points and physical resistance
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="heading-section">Character Preview</h3>
          <div className="card-character character-preview">
            <div className={`character-portrait large ${CHARACTER_CLASSES[selectedClass].icon}`}></div>
            <div className={`character-class class-${selectedClass}`}>
              {CHARACTER_CLASSES[selectedClass].name}
            </div>
            <h4 className="character-name">
              {watch('name') || 'Unnamed Character'}
            </h4>
            <div className="character-stats">
              {Object.entries(currentStats || {}).map(([stat, value]) => (
                <div key={stat} className="stat">
                  <span className="stat-name">{stat.slice(0, 3)}</span>
                  <span className="stat-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/characters')}
            className="btn-sprite secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-sprite primary"
            disabled={loading || !isValid || availablePoints < 0}
          >
            {loading ? (
              <>
                <div className="loading-sprite"></div>
                Creating Character...
              </>
            ) : (
              'Create Character'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CharacterCreation;