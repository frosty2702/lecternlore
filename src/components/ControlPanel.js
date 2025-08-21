import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import './ControlPanel.css';

const ControlPanel = () => {
  const { 
    teams, 
    currentTeam, 
    gameState, 
    updateTeamName, 
    createNewTeam, 
    setCurrentTeam, 
    updateHealth, 
    updateResource, 
    toggleWeapon 
  } = useGame();

  const [newTeamName, setNewTeamName] = useState('');
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const handleTeamNameChange = (e) => {
    updateTeamName(e.target.value);
  };

  const handleCreateTeam = () => {
    if (newTeamName.trim()) {
      createNewTeam(newTeamName.trim());
      setNewTeamName('');
      setIsCreatingTeam(false);
    }
  };

  const handleTeamSwitch = (e) => {
    setCurrentTeam(e.target.value);
  };

  return (
    <div className="control-panel">
      <div className="control-header">
        <h1>🎮 Control Panel</h1>
        <div className="nav-links">
          <a href="/display" target="_blank" rel="noopener noreferrer">
            Open Display Screen →
          </a>
          <button 
            onClick={() => setShowDebug(!showDebug)}
            className="debug-toggle-btn"
          >
            {showDebug ? '🔒 Hide Debug' : '🐛 Show Debug'}
          </button>
        </div>
      </div>

      {/* Debug Panel */}
      {showDebug && (
        <div className="debug-panel">
          <h3>🐛 Debug Information</h3>
          <div className="debug-content">
            <div className="debug-section">
              <strong>Current Team:</strong> {currentTeam}
            </div>
            <div className="debug-section">
              <strong>Available Teams:</strong> {Object.keys(teams).join(', ')}
            </div>
            <div className="debug-section">
              <strong>Current Team Data:</strong>
              <pre>{JSON.stringify(gameState, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Team Management Section */}
      <div className="team-management-section">
        <div className="team-selector">
          <h2>Select Team</h2>
          <select 
            value={currentTeam} 
            onChange={handleTeamSwitch}
            className="team-select-dropdown"
          >
            {Object.keys(teams).map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>

        <div className="team-name-section">
          <h2>Current Team: {currentTeam}</h2>
          <input
            type="text"
            value={currentTeam}
            onChange={handleTeamNameChange}
            className="team-name-input"
            placeholder="Rename team..."
          />
        </div>

        <div className="create-team-section">
          <button 
            onClick={() => setIsCreatingTeam(!isCreatingTeam)}
            className="create-team-btn"
          >
            {isCreatingTeam ? 'Cancel' : '➕ Create New Team'}
          </button>
          
          {isCreatingTeam && (
            <div className="create-team-form">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter new team name..."
                className="new-team-input"
              />
              <button 
                onClick={handleCreateTeam}
                className="confirm-create-btn"
                disabled={!newTeamName.trim()}
              >
                Create Team
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Layout for All Controls */}
      <div className="controls-row">
        {/* Health Section */}
        <div className="control-section">
          <h2>Health ({gameState.health}/{gameState.maxHealth})</h2>
          <div className="health-controls">
            <button onClick={() => updateHealth(-5)} className="health-btn decrease">
              -5 ❤️
            </button>
            <button onClick={() => updateHealth(-1)} className="health-btn decrease">
              -1 ❤️
            </button>
            <button onClick={() => updateHealth(1)} className="health-btn increase">
              +1 ❤️
            </button>
            <button onClick={() => updateHealth(5)} className="health-btn increase">
              +5 ❤️
            </button>
          </div>
          <div className="health-bar-preview">
            <div 
              className="health-fill"
              style={{ width: `${(gameState.health / gameState.maxHealth) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="control-section">
          <h2>Resources</h2>
          <div className="resource-controls">
            <div className="resource-item">
              <span>🍎 Apple: {gameState.resources.apple}</span>
              <div className="resource-buttons">
                <button onClick={() => updateResource('apple', -1)} className="resource-btn decrease">-</button>
                <button onClick={() => updateResource('apple', 1)} className="resource-btn increase">+</button>
              </div>
            </div>
            <div className="resource-item">
              <span>🥩 Cooked Steak: {gameState.resources.cookedSteak}</span>
              <div className="resource-buttons">
                <button onClick={() => updateResource('cookedSteak', -1)} className="resource-btn decrease">-</button>
                <button onClick={() => updateResource('cookedSteak', 1)} className="resource-btn increase">+</button>
              </div>
            </div>
          </div>
        </div>

        {/* Weapons Section */}
        <div className="control-section">
          <h2>Weapons & Items</h2>
          <div className="weapon-controls">
            <div className="weapon-item">
              <button 
                onClick={() => toggleWeapon('arrows')}
                className={`weapon-btn ${gameState.weapons.arrows ? 'active' : ''}`}
              >
                🏹 Arrows
              </button>
            </div>
            <div className="weapon-item">
              <button 
                onClick={() => toggleWeapon('shield')}
                className={`weapon-btn ${gameState.weapons.shield ? 'active' : ''}`}
              >
                🛡️ Shield
              </button>
            </div>
            <div className="weapon-item">
              <button 
                onClick={() => toggleWeapon('bow')}
                className={`weapon-btn ${gameState.weapons.bow ? 'active' : ''}`}
              >
                🏹 Bow
              </button>
            </div>
          </div>
        </div>

        {/* Enchantments Section */}
        <div className="control-section">
          <h2>Enchantments</h2>
          <div className="enchantment-note">
            <p>✨ Enchantment controls will be added here</p>
            <p><em>Waiting for enchantment specifications...</em></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
