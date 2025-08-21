import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [teams, setTeams] = useState({
    'Team Alpha': {
      health: 100,
      maxHealth: 100,
      resources: {
        apple: 5,
        cookedSteak: 3
      },
      weapons: {
        arrows: false,
        shield: false,
        bow: false
      },
      enchantments: {
        // Will be added when you provide the enchantment details
      }
    },
    'Team Beta': {
      health: 85,
      maxHealth: 100,
      resources: {
        apple: 2,
        cookedSteak: 7
      },
      weapons: {
        arrows: true,
        shield: false,
        bow: true
      },
      enchantments: {
        // Will be added when you provide the enchantment details
      }
    },
    'Team Gamma': {
      health: 95,
      maxHealth: 100,
      resources: {
        apple: 8,
        cookedSteak: 1
      },
      weapons: {
        arrows: false,
        shield: true,
        bow: false
      },
      enchantments: {
        // Will be added when you provide the enchantment details
      }
    }
  });

  const [currentTeam, setCurrentTeam] = useState('Team Alpha');

  const getCurrentTeamData = () => teams[currentTeam];

  const updateTeamName = (newName) => {
    if (newName && newName !== currentTeam) {
      setTeams(prev => {
        const newTeams = { ...prev };
        if (newTeams[currentTeam]) {
          newTeams[newName] = newTeams[currentTeam];
          delete newTeams[currentTeam];
          setCurrentTeam(newName);
        }
        return newTeams;
      });
    }
  };

  const createNewTeam = (teamName) => {
    if (teamName && !teams[teamName]) {
      setTeams(prev => ({
        ...prev,
        [teamName]: {
          health: 100,
          maxHealth: 100,
          resources: {
            apple: 0,
            cookedSteak: 0
          },
          weapons: {
            arrows: false,
            shield: false,
            bow: false
          },
          enchantments: {}
        }
      }));
      setCurrentTeam(teamName);
    }
  };

  const updateHealth = (amount) => {
    setTeams(prev => ({
      ...prev,
      [currentTeam]: {
        ...prev[currentTeam],
        health: Math.max(0, Math.min(prev[currentTeam].maxHealth, prev[currentTeam].health + amount))
      }
    }));
  };

  const updateResource = (resource, amount) => {
    setTeams(prev => ({
      ...prev,
      [currentTeam]: {
        ...prev[currentTeam],
        resources: {
          ...prev[currentTeam].resources,
          [resource]: Math.max(0, prev[currentTeam].resources[resource] + amount)
        }
      }
    }));
  };

  const toggleWeapon = (weapon) => {
    setTeams(prev => ({
      ...prev,
      [currentTeam]: {
        ...prev[currentTeam],
        weapons: {
          ...prev[currentTeam].weapons,
          [weapon]: !prev[currentTeam].weapons[weapon]
        }
      }
    }));
  };

  const value = {
    teams,
    currentTeam,
    gameState: getCurrentTeamData(),
    updateTeamName,
    createNewTeam,
    setCurrentTeam,
    updateHealth,
    updateResource,
    toggleWeapon
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
