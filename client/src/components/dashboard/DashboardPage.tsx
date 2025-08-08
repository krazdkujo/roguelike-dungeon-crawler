import React from 'react';
import { useAppSelector } from '@/stores/hooks';

const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { currentCharacter, characters } = useAppSelector((state) => state.game);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Welcome back, {user?.username}!</h1>
        <p>Ready for another adventure in the dungeons?</p>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <h3>🎮 Quick Actions</h3>
          <div className="quick-actions">
            {!currentCharacter ? (
              <p>Select or create a character to begin your adventure!</p>
            ) : (
              <p>Character "{currentCharacter.name}" is ready for action!</p>
            )}
          </div>
        </div>

        <div className="panel">
          <h3>📊 Your Characters ({characters.length})</h3>
          <div className="character-summary">
            {characters.length === 0 ? (
              <p>No characters created yet. Create your first adventurer!</p>
            ) : (
              <div className="character-list">
                {characters.map((character) => (
                  <div key={character.id} className="character-item">
                    <span className={`character-class ${character.class}`}>
                      {character.name}
                    </span>
                    <span className="character-level">Lv. {character.level}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="panel">
          <h3>🏰 Available Dungeons</h3>
          <p>Explore dangerous dungeons and claim their treasures!</p>
        </div>

        <div className="panel">
          <h3>📰 Latest News</h3>
          <div className="news-items">
            <div className="news-item">
              <span className="news-date">Today</span>
              <span className="news-text">Welcome to Roguelike Dungeon Crawler!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;