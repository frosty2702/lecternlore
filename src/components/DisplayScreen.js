import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import './DisplayScreen.css';

const DisplayScreen = () => {
  const { currentTeam, teams } = useGame();
  const [gameState, setGameState] = useState(teams[currentTeam] || {});

  // Update gameState whenever currentTeam or teams change
  useEffect(() => {
    if (teams[currentTeam]) {
      setGameState(teams[currentTeam]);
    }
  }, [currentTeam, teams]);

  const getActiveWeapons = () => {
    if (!gameState.weapons) return [];
    return Object.entries(gameState.weapons)
      .filter(([weapon, isActive]) => isActive)
      .map(([weapon]) => weapon);
  };

  const getWeaponIcon = (weapon) => {
    const icons = {
      arrows: '🏹',
      shield: '🛡️',
      bow: '🏹'
    };
    return icons[weapon] || '⚔️';
  };

  // Safety check for gameState
  if (!gameState || !gameState.health) {
    return (
      <div className="display-screen">
        <div className="display-container">
          <div className="loading-message">
            <h1>Loading team data...</h1>
            <p>Please select a team in the control panel</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="display-screen">
      <div className="display-container">
        {/* Team Name Header */}
        <div className="team-header">
          <h1 className="team-name">{currentTeam}</h1>
          <div className="team-indicator">
            <span className="indicator-dot">🟢</span>
            <span className="indicator-text">Live Team Data</span>
          </div>
        </div>

        {/* Health Bar */}
        <div className="health-section">
          <div className="health-label">
            <span className="health-icon">❤️</span>
            <span className="health-text">Health: {gameState.health}/{gameState.maxHealth}</span>
          </div>
          <div className="health-bar">
            <div className="health-bar-background">
              <div 
                className="health-bar-fill"
                style={{ 
                  width: `${(gameState.health / gameState.maxHealth) * 100}%`,
                  backgroundColor: gameState.health > 50 ? '#4ade80' : gameState.health > 20 ? '#fbbf24' : '#ef4444'
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="main-content">
          {/* Inventory Section */}
          <div className="inventory-section">
            <h2 className="section-title">🎒 Inventory</h2>
            <div className="inventory-grid">
              {getActiveWeapons().length > 0 ? (
                getActiveWeapons().map((weapon, index) => (
                  <div key={weapon} className="inventory-item">
                    <div className="item-icon">{getWeaponIcon(weapon)}</div>
                    <div className="item-name">{weapon.charAt(0).toUpperCase() + weapon.slice(1)}</div>
                  </div>
                ))
              ) : (
                <div className="empty-inventory">
                  <div className="empty-slot">📦</div>
                  <div className="empty-text">No items equipped</div>
                </div>
              )}
            </div>
          </div>

          {/* Resources Section */}
          <div className="resources-section">
            <h2 className="section-title">📦 Resources</h2>
            <div className="resources-grid">
              <div className="resource-card">
                <div className="resource-icon">🍎</div>
                <div className="resource-info">
                  <div className="resource-name">Apple</div>
                  <div className="resource-count">{gameState.resources?.apple || 0}</div>
                </div>
              </div>
              <div className="resource-card">
                <div className="resource-icon">🥩</div>
                <div className="resource-info">
                  <div className="resource-name">Cooked Steak</div>
                  <div className="resource-count">{gameState.resources?.cookedSteak || 0}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enchantments Section */}
          <div className="enchantments-section">
            <h2 className="section-title">✨ Enchantments</h2>
            <div className="enchantments-placeholder">
              <div className="placeholder-text">No active enchantments</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="display-footer">
          <div className="status-indicator">
            <span className="status-dot">🟢</span>
            <span className="status-text">Live - {currentTeam}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayScreen;
