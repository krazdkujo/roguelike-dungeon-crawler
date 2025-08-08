import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { apiClient } from '@/services/apiClient';

interface DungeonInstance {
  id: string;
  dungeonId: string;
  playersJson: any[];
  state: string;
  currentRoom: string;
  createdAt: string;
  updatedAt: string;
}

const DungeonPage: React.FC = () => {
  const { instanceId } = useParams();
  const navigate = useNavigate();
  const { currentCharacter } = useAppSelector((state) => state.game);
  const [instance, setInstance] = useState<DungeonInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (instanceId) {
      loadDungeonInstance();
    }
  }, [instanceId]);

  const loadDungeonInstance = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/dungeons/instances/${instanceId}`);
      setInstance(response.instance);
    } catch (err: any) {
      setError(err.message || 'Failed to load dungeon');
    } finally {
      setLoading(false);
    }
  };

  const startCombat = async () => {
    try {
      if (!currentCharacter) {
        alert('No character selected!');
        return;
      }

      const response = await apiClient.post('/combat/start', {
        characterId: currentCharacter.id,
        dungeonInstanceId: instanceId
      });

      navigate(`/combat/${response.combat.id}`);
    } catch (err: any) {
      alert(`Failed to start combat: ${err.message}`);
    }
  };

  const leaveDungeon = async () => {
    try {
      await apiClient.post(`/dungeons/instances/${instanceId}/leave`);
      navigate('/town');
    } catch (err: any) {
      alert(`Failed to leave dungeon: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="dungeon-page">
        <div className="loading-spinner">
          <div className="pixel-spinner"></div>
          <p>Loading dungeon...</p>
        </div>
      </div>
    );
  }

  if (error || !instance) {
    return (
      <div className="dungeon-page">
        <div className="page-header">
          <h1>🏰 Dungeon Explorer</h1>
          <p className="text-error">{error || 'Dungeon not found'}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/town')}>
          Return to Town
        </button>
      </div>
    );
  }

  return (
    <div className="dungeon-page">
      <div className="page-header">
        <h1>🏰 Dungeon Explorer</h1>
        <p>Navigate through dangerous dungeons with your party</p>
      </div>

      <div className="dungeon-info panel">
        <h3>Dungeon Instance: {instance.id}</h3>
        <p>Current Room: {instance.currentRoom}</p>
        <p>State: {instance.state}</p>
        <p>Players in party: {instance.playersJson.length}</p>
        
        <div className="party-members">
          <h4>Party Members:</h4>
          {instance.playersJson.map((player: any, index: number) => (
            <div key={index} className="party-member">
              <span className={`character-class ${player.characterClass}`}>
                {player.characterName} (Lv.{player.characterLevel} {player.characterClass})
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="dungeon-actions panel">
        <h3>Available Actions</h3>
        <div className="action-grid">
          <button className="btn btn-danger" onClick={startCombat}>
            ⚔️ Enter Combat
          </button>
          <button className="btn btn-secondary" onClick={() => alert('Exploration coming soon!')}>
            🚪 Explore Room
          </button>
          <button className="btn btn-warning" onClick={() => alert('Treasure hunting coming soon!')}>
            💰 Search for Treasure
          </button>
          <button className="btn btn-secondary" onClick={leaveDungeon}>
            🚪 Leave Dungeon
          </button>
        </div>
      </div>

      <div className="dungeon-map panel">
        <h3>Dungeon Map</h3>
        <div className="map-placeholder">
          <p>🗺️ Dungeon map will be displayed here</p>
          <div className="simple-map">
            <div className="room current-room">📍 Current Room</div>
            <div className="room unexplored">❓ Unexplored</div>
            <div className="room boss-room">👹 Boss Room</div>
            <div className="room treasure">💰 Treasure</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DungeonPage;