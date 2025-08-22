import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import './ControlPanel.css';

const ControlPanel = () => {
  const { 
    teams, 
    updateHealth, 
    updateResource, 
    toggleWeapon,
    createNewTeam,
    toggleEnchantment,
    hideTeam,
    unhideTeam
  } = useGame();

  const [newTeamName, setNewTeamName] = useState('');
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [teamToHide, setTeamToHide] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'KANYE$') {
      setIsAuthenticated(true);
      setPasswordError('');
      setPassword('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleCreateTeam = () => {
    if (newTeamName.trim()) {
      createNewTeam(newTeamName.trim());
      setNewTeamName('');
      setIsCreatingTeam(false);
    }
  };

  const handleHideTeam = (teamName) => {
    setTeamToHide(teamName);
  };

  const confirmHideTeam = () => {
    if (teamToHide) {
      hideTeam(teamToHide);
      setTeamToHide(null);
    }
  };

  const cancelHideTeam = () => {
    setTeamToHide(null);
  };

  // Password protection screen
  if (!isAuthenticated) {
    return (
      <div 
        className="password-screen"
        style={{
          backgroundImage: 'url(/mcbglectern.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="password-container">
          <h1 className="password-title">Lectern Lore</h1>
          <h2 className="password-subtitle">Control Panel Access</h2>
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <div className="password-input-group">
              <label htmlFor="password" className="password-label">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="password-input"
                autoFocus
              />
            </div>
            {passwordError && (
              <div className="password-error">{passwordError}</div>
            )}
            <button type="submit" className="password-submit-btn">
              Access Control Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  const backgroundStyle = {
    backgroundImage: 'url(/mcbglectern.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    position: 'relative'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1
  };

  return (
    <div className="control-panel" style={backgroundStyle}>
      <div className="control-panel-overlay" style={overlayStyle}>
        <div className="control-header">
          <h1>Lectern Lore</h1>
          <div className="nav-links">
            <a href="/display" target="_blank" rel="noopener noreferrer">
              Display →
            </a>
            <button className="debug-btn">
              🐛 Debug
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="logout-btn"
              title="Logout"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Create New Team Section */}
        <div className="create-team-section">
          <button 
            onClick={() => setIsCreatingTeam(!isCreatingTeam)}
            className="create-team-btn"
          >
            {isCreatingTeam ? 'Cancel' : '➕ CREATE NEW TEAM'}
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

        {/* All Teams Horizontal Dashboard */}
        <div className="teams-horizontal-dashboard">
          {Object.entries(teams)
            .filter(([teamName, teamData]) => !teamData.hidden)
            .map(([teamName, teamData]) => (
            <div key={teamName} className="team-box">
              <div className="team-box-header">
                <h2 className="team-title">{teamName}</h2>
                <button 
                  onClick={() => handleHideTeam(teamName)}
                  className="hide-team-btn"
                  title="Hide/Eliminate Team"
                >
                  🚫
                </button>
              </div>

              <div className="team-box-content">
                {/* Health Section */}
                <div className="team-control-section">
                  <h3>❤️ Health ({teamData.health}/{teamData.maxHealth})</h3>
                  <div className="health-controls-compact">
                    <button onClick={() => updateHealth(teamName, -5)} className="health-btn decrease">-5</button>
                    <button onClick={() => updateHealth(teamName, -1)} className="health-btn decrease">-1</button>
                    <button onClick={() => updateHealth(teamName, 1)} className="health-btn increase">+1</button>
                    <button onClick={() => updateHealth(teamName, 5)} className="health-btn increase">+5</button>
                  </div>
                  <div className="health-bar-compact">
                    <div 
                      className="health-fill-compact"
                      style={{ width: `${(teamData.health / teamData.maxHealth) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Resources Section */}
                <div className="team-control-section">
                  <h3>📦 Resources</h3>
                  <div className="resources-compact">
                    <div className="resource-compact">
                      <span>🍎 {teamData.resources.apple}</span>
                      <div className="resource-buttons-compact">
                        <button onClick={() => updateResource(teamName, 'apple', -1)} className="resource-btn decrease">-</button>
                        <button onClick={() => updateResource(teamName, 'apple', 1)} className="resource-btn increase">+</button>
                      </div>
                    </div>
                    <div className="resource-compact">
                      <span>🥩 {teamData.resources.cookedSteak}</span>
                      <div className="resource-buttons-compact">
                        <button onClick={() => updateResource(teamName, 'cookedSteak', -1)} className="resource-btn decrease">-</button>
                        <button onClick={() => updateResource(teamName, 'cookedSteak', 1)} className="resource-btn increase">+</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weapons Section */}
                <div className="team-control-section">
                  <h3>⚔️ Weapons</h3>
                  <div className="weapons-compact">
                    <button 
                      onClick={() => toggleWeapon(teamName, 'arrows')}
                      className={`weapon-btn-compact ${teamData.weapons.arrows ? 'active' : ''}`}
                    >
                      🏹
                    </button>
                    <button 
                      onClick={() => toggleWeapon(teamName, 'shield')}
                      className={`weapon-btn-compact ${teamData.weapons.shield ? 'active' : ''}`}
                    >
                      🛡️
                    </button>
                    <button 
                      onClick={() => toggleWeapon(teamName, 'bow')}
                      className={`weapon-btn-compact ${teamData.weapons.bow ? 'active' : ''}`}
                    >
                      🏹
                    </button>
                  </div>
                </div>

                {/* Enchantments Section */}
                <div className="team-control-section">
                  <h3>✨ Enchantments</h3>
                  <div className="enchantments-compact">
                    <button 
                      onClick={() => toggleEnchantment(teamName, 'powerV')}
                      className={`enchantment-btn-compact ${teamData.enchantments?.powerV ? 'active' : ''}`}
                    >
                      ⚡ Power V
                    </button>
                    <button 
                      onClick={() => toggleEnchantment(teamName, 'flame')}
                      className={`enchantment-btn-compact ${teamData.enchantments?.flame ? 'active' : ''}`}
                    >
                      🔥 Flame
                    </button>
                    <button 
                      onClick={() => toggleEnchantment(teamName, 'punch')}
                      className={`enchantment-btn-compact ${teamData.enchantments?.punch ? 'active' : ''}`}
                    >
                      💥 Punch
                    </button>
                    <button 
                      onClick={() => toggleEnchantment(teamName, 'poison')}
                      className={`enchantment-btn-compact ${teamData.enchantments?.poison ? 'active' : ''}`}
                    >
                      ☠️ Poison
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hidden Teams Section */}
        {Object.entries(teams).filter(([teamName, teamData]) => teamData.hidden).length > 0 && (
          <div className="hidden-teams-section">
            <h2 className="hidden-teams-title">Hidden Teams</h2>
            <div className="hidden-teams-grid">
              {Object.entries(teams)
                .filter(([teamName, teamData]) => teamData.hidden)
                .map(([teamName, teamData]) => (
                <div key={teamName} className="hidden-team-item">
                  <span className="hidden-team-name">{teamName}</span>
                  <button 
                    onClick={() => unhideTeam(teamName)}
                    className="unhide-team-btn"
                    title="Unhide Team"
                  >
                    🔄 Unhide
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Hiding Team */}
      {teamToHide && (
        <div className="confirmation-dialog">
          <div className="dialog-content">
            <h2>Confirm Hide Team</h2>
            <p>Are you sure you want to hide the team "{teamToHide}"? Hidden teams won't appear on the display screen but can be unhidden later.</p>
            <div className="dialog-actions">
              <button onClick={confirmHideTeam} className="confirm-btn">Hide Team</button>
              <button onClick={cancelHideTeam} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
