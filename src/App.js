import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import ControlPanel from './components/ControlPanel';
import DisplayScreen from './components/DisplayScreen';
import './App.css';

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/control" element={<ControlPanel />} />
            <Route path="/display" element={<DisplayScreen />} />
            <Route path="/" element={<Navigate to="/control" replace />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;
