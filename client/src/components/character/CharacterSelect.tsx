import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { fetchCharacters, selectCharacter, deleteCharacter } from '@/stores/gameSlice';
import { Character } from '@/types';

const CharacterSelect: React.FC = () => {
  const dispatch = useAppDispatch();
  const { characters, currentCharacter, loading } = useAppSelector((state) => state.game);

  useEffect(() => {
    dispatch(fetchCharacters());
  }, [dispatch]);

  const handleSelectCharacter = async (character: Character) => {
    await dispatch(selectCharacter(character.id));
  };

  const handleDeleteCharacter = async (characterId: string) => {
    if (window.confirm('Are you sure you want to delete this character? This action cannot be undone.')) {
      await dispatch(deleteCharacter(characterId));
    }
  };

  if (loading) {
    return (
      <div className="character-select loading">
        <div className="loading-spinner">
          <div className="pixel-spinner"></div>
          <p>Loading characters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="character-select">
      <div className="page-header">
        <h1>Choose Your Adventurer</h1>
        <p>Select a character to begin your dungeon crawling adventure</p>
      </div>

      <div className="character-actions">
        <Link to="/characters/create" className="btn btn-primary">
          <span>⚔️</span>
          Create New Character
        </Link>
      </div>

      {characters.length === 0 ? (
        <div className="empty-state panel">
          <h3>🎭 No Characters Found</h3>
          <p>You haven't created any characters yet. Create your first adventurer to begin your journey!</p>
          <Link to="/characters/create" className="btn btn-primary">
            Create Your First Character
          </Link>
        </div>
      ) : (
        <div className="character-grid">
          {characters.map((character) => (
            <div 
              key={character.id} 
              className={`character-card panel ${currentCharacter?.id === character.id ? 'selected' : ''}`}
            >
              <div className="character-header">
                <h3 className="character-name">{character.name}</h3>
                <span className={`character-class-badge ${character.class}`}>
                  {character.class}
                </span>
              </div>

              <div className="character-stats">
                <div className="stat">
                  <span className="stat-label">Level</span>
                  <span className="stat-value">{character.level}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">XP</span>
                  <span className="stat-value">{character.experience}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">HP</span>
                  <span className="stat-value">{character.statsJson.hp}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">MP</span>
                  <span className="stat-value">{character.statsJson.mp}</span>
                </div>
              </div>

              <div className="character-actions">
                <button
                  onClick={() => handleSelectCharacter(character)}
                  className="btn btn-primary"
                  disabled={currentCharacter?.id === character.id}
                >
                  {currentCharacter?.id === character.id ? '✓ Selected' : 'Select'}
                </button>
                <button
                  onClick={() => handleDeleteCharacter(character.id)}
                  className="btn btn-danger"
                >
                  🗑️ Delete
                </button>
              </div>

              <div className="character-created">
                Created: {new Date(character.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterSelect;