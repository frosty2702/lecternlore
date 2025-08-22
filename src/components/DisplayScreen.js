import React, { useState, useEffect } from 'react';
import './DisplayScreen.css';

const DisplayScreen = () => {
  const [teams, setTeams] = useState({});
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const loadTeamsData = () => {
    try {
      const savedTeams = localStorage.getItem('lecternlore-teams');
      
      if (savedTeams) {
        const teamsData = JSON.parse(savedTeams);
        setTeams(teamsData);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error loading teams data:', error);
    }
  };

  useEffect(() => {
    loadTeamsData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadTeamsData();
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'lecternlore-teams') {
        loadTeamsData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getActiveWeapons = (weapons) => {
    if (!weapons) return [];
    return Object.entries(weapons)
      .filter(([, isActive]) => isActive)
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

  if (!teams || Object.keys(teams).length === 0) {
    return (
      <div 
        className="display-screen"
        style={{
          backgroundImage: 'url(/mcbglectern.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="display-container">
          <div className="loading-message">
            <h1>Loading teams data...</h1>
            <p>Please create teams in the control panel</p>
            <button onClick={loadTeamsData} className="refresh-btn">
              🔄 Refresh Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="display-screen"
      style={{
        backgroundImage: 'url(/mcbglectern.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="display-container">
        {/* Header */}
        <div className="display-header">
          <h1 className="main-title">Lectern Lore</h1>
          <div className="update-info">
            <span className="update-text">
              Last Updated: {lastUpdate.toLocaleTimeString()}
            </span>
            <button onClick={loadTeamsData} className="refresh-btn-small">
              🔄
            </button>
          </div>
        </div>

        {/* All Teams Dashboard */}
        <div 
          className="teams-display-dashboard"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            padding: '20px 0',
            overflowY: 'auto',
            overflowX: 'hidden',
            width: '100%',
            alignItems: 'center'
          }}
        >
          {Object.entries(teams)
            .filter(([teamName, teamData]) => !teamData.hidden)
            .map(([teamName, teamData]) => (
            <div key={teamName} className="team-display-box">
              <div className="team-display-content">
                {/* Left Section: Team Name and Health */}
                <div className="team-left-section">
                  <div className="team-display-header">
                    <h2 className="team-display-title">{teamName}</h2>
                  </div>
                  
                  {/* Health Bar */}
                  <div className="health-display-section">
                    <div className="health-label">
                      <span className="health-icon">❤️</span>
                      <span className="health-text">Health: {teamData.health}/{teamData.maxHealth}</span>
                    </div>
                    <div className="health-bar-display">
                      <div className="health-bar-background">
                        <div 
                          className="health-bar-fill"
                          style={{ 
                            width: `${(teamData.health / teamData.maxHealth) * 100}%`,
                            backgroundColor: teamData.health > 50 ? '#4ade80' : teamData.health > 20 ? '#fbbf24' : '#ef4444'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section: Weapons and Resources */}
                <div className="team-right-section">
                  {/* Weapons Section */}
                  <div className="weapons-display-section">
                    <h3 className="section-title">⚔️ Weapons</h3>
                    <div className="weapons-display-grid">
                      {getActiveWeapons(teamData.weapons).length > 0 ? (
                        getActiveWeapons(teamData.weapons).map((weapon) => (
                          <div key={weapon} className="weapon-display-item">
                            <div className="weapon-icon">{getWeaponIcon(weapon)}</div>
                            <div className="weapon-name">{weapon.charAt(0).toUpperCase() + weapon.slice(1)}</div>
                          </div>
                        ))
                      ) : (
                        <div className="empty-weapons">
                          <div className="empty-slot">📦</div>
                          <div className="empty-text">No weapons equipped</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Resources Section */}
                  <div className="resources-display-section">
                    <h3 className="section-title">Resources</h3>
                    <div className="resources-display-grid">
                      <div className="resource-display-card">
                        <div className="resource-icon">🍎</div>
                        <div className="resource-info">
                          <div className="resource-name">Apple</div>
                          <div className="resource-count">{teamData.resources?.apple || 0}</div>
                        </div>
                      </div>
                      <div className="resource-display-card">
                        <div className="resource-icon">🥩</div>
                        <div className="resource-info">
                          <div className="resource-name">Cooked Steak</div>
                          <div className="resource-count">{teamData.resources?.cookedSteak || 0}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enchantments Section */}
                  <div className="enchantments-display-section">
                    <h3 className="section-title">Enchantments</h3>
                    <div className="enchantments-display-grid">
                      {(() => {
                        const activeEnchantments = [];
                        if (teamData.enchantments?.powerV) activeEnchantments.push({ name: 'Power V', icon: '⚡' });
                        if (teamData.enchantments?.flame) activeEnchantments.push({ name: 'Flame', icon: '🔥' });
                        if (teamData.enchantments?.punch) activeEnchantments.push({ name: 'Punch', icon: '💥' });
                        if (teamData.enchantments?.poison) activeEnchantments.push({ name: 'Poison', icon: '☠️' });
                        
                        if (activeEnchantments.length > 0) {
                          return activeEnchantments.map((enchantment) => (
                            <div key={enchantment.name} className="enchantment-display-item">
                              <div className="enchantment-icon">{enchantment.icon}</div>
                              <div className="enchantment-name">{enchantment.name}</div>
                            </div>
                          ));
                        } else {
                          return (
                            <div className="enchantments-placeholder">
                              <div className="placeholder-text">No active enchantments</div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayScreen;
