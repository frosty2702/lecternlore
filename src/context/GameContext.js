import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// Load initial data from localStorage or use defaults
const loadInitialData = () => {
  try {
    const savedTeams = localStorage.getItem('lecternlore-teams');
    const savedCurrentTeam = localStorage.getItem('lecternlore-currentTeam');
    
    if (savedTeams && savedCurrentTeam) {
      return {
        teams: JSON.parse(savedTeams),
        currentTeam: savedCurrentTeam
      };
    }
  } catch (error) {
    console.log('No saved data found, using defaults');
  }

  // Default teams if no saved data
  return {
    teams: {
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
          powerV: false,
          flame: false,
          punch: false,
          poison: false
        },
        hidden: false
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
          powerV: false,
          flame: false,
          punch: false,
          poison: false
        },
        hidden: false
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
          powerV: false,
          flame: false,
          punch: false,
          poison: false
        },
        hidden: false
      },
      'Team Delta': {
        health: 100,
        maxHealth: 100,
        resources: {
          apple: 11,
          cookedSteak: 10
        },
        weapons: {
          arrows: false,
          shield: false,
          bow: false
        },
        enchantments: {
          powerV: false,
          flame: false,
          punch: false,
          poison: false
        },
        hidden: false
      }
    },
    currentTeam: 'Team Alpha'
  };
};

export const GameProvider = ({ children }) => {
  const initialData = loadInitialData();
  const [teams, setTeams] = useState(initialData.teams);
  const [currentTeam, setCurrentTeam] = useState(initialData.currentTeam);

  // Save to localStorage whenever teams or currentTeam changes
  useEffect(() => {
    localStorage.setItem('lecternlore-teams', JSON.stringify(teams));
    localStorage.setItem('lecternlore-currentTeam', currentTeam);
  }, [teams, currentTeam]);

  // Listen for storage changes (when other tabs update the data)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'lecternlore-teams') {
        try {
          const newTeams = JSON.parse(e.newValue);
          setTeams(newTeams);
        } catch (error) {
          console.error('Error parsing teams from storage:', error);
        }
      } else if (e.key === 'lecternlore-currentTeam') {
        setCurrentTeam(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getCurrentTeamData = () => teams[currentTeam] || {};

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
          enchantments: {
            powerV: false,
            flame: false,
            punch: false,
            poison: false
          },
          hidden: false
        }
      }));
      setCurrentTeam(teamName);
    }
  };

  const updateHealth = (teamName, amount) => {
    setTeams(prev => ({
      ...prev,
      [teamName]: {
        ...prev[teamName],
        health: Math.max(0, Math.min(prev[teamName].maxHealth, prev[teamName].health + amount))
      }
    }));
  };

  const updateResource = (teamName, resource, amount) => {
    setTeams(prev => ({
      ...prev,
      [teamName]: {
        ...prev[teamName],
        resources: {
          ...prev[teamName].resources,
          [resource]: Math.max(0, prev[teamName].resources[resource] + amount)
        }
      }
    }));
  };

  const toggleWeapon = (teamName, weapon) => {
    setTeams(prev => ({
      ...prev,
      [teamName]: {
        ...prev[teamName],
        weapons: {
          ...prev[teamName].weapons,
          [weapon]: !prev[teamName].weapons[weapon]
        }
      }
    }));
  };

  const toggleEnchantment = (teamName, enchantment) => {
    setTeams(prev => ({
      ...prev,
      [teamName]: {
        ...prev[teamName],
        enchantments: {
          ...prev[teamName].enchantments,
          [enchantment]: !prev[teamName].enchantments[enchantment]
        }
      }
    }));
  };

  const hideTeam = (teamName) => {
    setTeams(prev => ({
      ...prev,
      [teamName]: {
        ...prev[teamName],
        hidden: true
      }
    }));
    
    // If the hidden team was the current team, switch to another team
    if (currentTeam === teamName) {
      const visibleTeams = Object.keys(teams).filter(name => !teams[name].hidden);
      if (visibleTeams.length > 0) {
        setCurrentTeam(visibleTeams[0]);
      }
    }
  };

  const unhideTeam = (teamName) => {
    setTeams(prev => ({
      ...prev,
      [teamName]: {
        ...prev[teamName],
        hidden: false
      }
    }));
  };

  const resetAllTeams = () => {
    const defaultTeams = {
      'Team Alpha': {
        health: 100,
        maxHealth: 100,
        resources: { apple: 5, cookedSteak: 3 },
        weapons: { arrows: false, shield: false, bow: false },
        enchantments: { powerV: false, flame: false, punch: false, poison: false },
        hidden: false
      },
      'Team Beta': {
        health: 100,
        maxHealth: 100,
        resources: { apple: 5, cookedSteak: 3 },
        weapons: { arrows: false, shield: false, bow: false },
        enchantments: { powerV: false, flame: false, punch: false, poison: false },
        hidden: false
      },
      'Team Gamma': {
        health: 100,
        maxHealth: 100,
        resources: { apple: 5, cookedSteak: 3 },
        weapons: { arrows: false, shield: false, bow: false },
        enchantments: { powerV: false, flame: false, punch: false, poison: false },
        hidden: false
      },
      'Team Delta': {
        health: 100,
        maxHealth: 100,
        resources: { apple: 5, cookedSteak: 3 },
        weapons: { arrows: false, shield: false, bow: false },
        enchantments: { powerV: false, flame: false, punch: false, poison: false },
        hidden: false
      }
    };
    setTeams(defaultTeams);
    setCurrentTeam('Team Alpha');
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
    toggleWeapon,
    toggleEnchantment,
    resetAllTeams,
    hideTeam,
    unhideTeam
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

