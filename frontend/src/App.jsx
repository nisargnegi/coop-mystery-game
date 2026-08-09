import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Search, Map, Key, Edit3, ShieldAlert, Grid, RefreshCw, Users, BookOpen } from 'lucide-react';

import CaseSelect from './components/CaseSelect';
import LocationView from './components/LocationView';
import EvidenceBoard from './components/EvidenceBoard';
import SharedNotebook from './components/SharedNotebook';
import AccusationScreen from './components/AccusationScreen';
import ResultsScreen from './components/ResultsScreen';
import CaseMechanics from './components/CaseMechanics';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || (import.meta.env.DEV ? 'http://localhost:3005' : window.location.origin);
const socket = io(SERVER_URL);

export default function App() {
  const [inRoom, setInRoom] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [caseId, setCaseId] = useState('dells-diner');
  const [caseData, setCaseData] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [activeTab, setActiveTab] = useState('cases'); // 'cases' | 'investigate' | 'evidence' | 'notes' | 'accuse'
  const [currentLocation, setCurrentLocation] = useState(null);
  const [playersCount, setPlayersCount] = useState(1);

  // Socket listener setup
  useEffect(() => {
    socket.on('room-init', ({ caseId: serverCaseId, state, playersCount }) => {
      setCaseId(serverCaseId);
      setGameState(state);
      setPlayersCount(playersCount);
    });

    socket.on('room-state', (state) => {
      setGameState(state);
    });

    socket.on('case-changed', ({ caseId: newCaseId, state }) => {
      setCaseId(newCaseId);
      setGameState(state);
      setActiveTab('investigate');
    });

    socket.on('player-joined', ({ playersCount }) => {
      setPlayersCount(playersCount);
    });

    socket.on('player-left', ({ playersCount }) => {
      setPlayersCount(playersCount);
    });

    return () => {
      socket.off('room-init');
      socket.off('room-state');
      socket.off('case-changed');
      socket.off('player-joined');
      socket.off('player-left');
    };
  }, []);

  // Fetch full case data when caseId changes
  useEffect(() => {
    if (inRoom && caseId) {
      fetch(`${SERVER_URL}/api/cases/${caseId}`)
        .then(res => res.json())
        .then(data => {
          setCaseData(data);
          if (data.locations && data.locations.length > 0) {
            setCurrentLocation(data.locations[0]);
          }
        })
        .catch(err => console.error("Error fetching case data:", err));
    }
  }, [inRoom, caseId]);

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomCode.trim()) {
      socket.emit('join-room', { roomCode: roomCode.toUpperCase(), caseId });
      setInRoom(true);
    }
  };

  const handleSelectCase = (newCaseId) => {
    socket.emit('select-case', { roomCode: roomCode.toUpperCase(), caseId: newCaseId });
  };

  const handleUnlockClue = (clueId, unlockLocationId) => {
    if (!gameState) return;

    let newClues = gameState.discoveredClues || [];
    if (!newClues.includes(clueId)) {
      newClues = [...newClues, clueId];
    }

    let newLocations = gameState.unlockedLocations || [];
    if (unlockLocationId && !newLocations.includes(unlockLocationId)) {
      newLocations = [...newLocations, unlockLocationId];
    }

    const newState = {
      ...gameState,
      discoveredClues: newClues,
      unlockedLocations: newLocations
    };

    setGameState(newState);
    socket.emit('update-state', { roomCode: roomCode.toUpperCase(), newState });
  };

  const handleNotesChange = (newNotes) => {
    const newState = { ...gameState, notes: newNotes };
    setGameState(newState);
    socket.emit('update-state', { roomCode: roomCode.toUpperCase(), newState });
  };

  const handleSubmitAccusation = (suspectId, selectedClueIds) => {
    socket.emit('submit-accusation', {
      roomCode: roomCode.toUpperCase(),
      suspectId,
      selectedClueIds
    });
  };

  const handleResetGame = () => {
    socket.emit('reset-game', { roomCode: roomCode.toUpperCase() });
  };

  // Join Screen
  if (!inRoom) {
    return (
      <div className="container flex flex-col justify-center items-center" style={{ minHeight: '100vh' }}>
        <div className="glass-panel text-center animate-fade-in" style={{ maxWidth: '420px', width: '100%' }}>
          <Search size={52} className="mb-3 mx-auto text-sky-400" />
          <h1 className="text-3xl font-extrabold mb-1 gradient-title">UNSOLVED</h1>
          <p className="text-xs text-gray-400 mb-6">Co-op Detective Investigation Experience</p>

          <form onSubmit={handleJoinRoom} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block text-left font-medium">Room Passcode</label>
              <input
                type="text"
                placeholder="Enter Code (e.g. SHERLOCK)"
                className="input-field text-center font-mono uppercase tracking-widest text-lg font-bold"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full py-3 text-base">
              Enter Detective Headquarters
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!caseData || !gameState) {
    return (
      <div className="container flex flex-col justify-center items-center h-screen text-gray-400">
        <RefreshCw size={32} className="animate-spin mb-3 text-sky-400" />
        <p>Synchronizing Case Archives...</p>
      </div>
    );
  }

  // Results Screen (Game Over or Solved)
  if (gameState.gameOver) {
    return (
      <div className="container">
        <ResultsScreen
          caseData={caseData}
          gameState={gameState}
          onResetGame={handleResetGame}
          onSelectDifferentCase={() => {
            handleResetGame();
            setActiveTab('cases');
          }}
        />
      </div>
    );
  }

  return (
    <div className="container">
      {/* Top Header */}
      <header className="glass-panel mb-4 flex flex-col md:flex-row justify-between items-center gap-3 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[rgba(56,189,248,0.1)] text-sky-400 border border-sky-500/20">
            <Search size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-0">{caseData.title}</h2>
            <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
              <span>Room: <strong className="text-sky-400 font-mono">{roomCode}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Users size={12} /> {playersCount} Investigator(s) Connected
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Header Tabs */}
        <div className="hidden md:flex gap-2">
          <button className={`btn btn-sm ${activeTab === 'cases' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('cases')}>
            <Grid size={16} /> Cases
          </button>
          <button className={`btn btn-sm ${activeTab === 'investigate' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('investigate')}>
            <Map size={16} /> Investigate
          </button>
          <button className={`btn btn-sm ${activeTab === 'evidence' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('evidence')}>
            <Key size={16} /> Evidence ({(gameState.discoveredClues || []).length})
          </button>
          <button className={`btn btn-sm ${activeTab === 'notes' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('notes')}>
            <Edit3 size={16} /> Notebook
          </button>
          <button className={`btn btn-sm ${activeTab === 'accuse' ? 'btn-danger' : 'btn-outline'}`} onClick={() => setActiveTab('accuse')}>
            <ShieldAlert size={16} /> Accuse
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      <main>
        {activeTab === 'cases' && (
          <CaseSelect
            serverUrl={SERVER_URL}
            activeCaseId={caseId}
            onSelectCase={handleSelectCase}
            roomCode={roomCode}
          />
        )}

        {activeTab === 'investigate' && (
          <div className="flex flex-col gap-4">
            <LocationView
              caseData={caseData}
              gameState={gameState}
              currentLocation={currentLocation}
              onSelectLocation={setCurrentLocation}
              onUnlockClue={handleUnlockClue}
            />

            <CaseMechanics
              caseData={caseData}
              gameState={gameState}
              onUpdateState={(newState) => {
                setGameState(newState);
                socket.emit('update-state', { roomCode: roomCode.toUpperCase(), newState });
              }}
              roomCode={roomCode}
            />
          </div>
        )}

        {activeTab === 'evidence' && (
          <EvidenceBoard caseData={caseData} gameState={gameState} />
        )}

        {activeTab === 'notes' && (
          <SharedNotebook notes={gameState.notes} onNotesChange={handleNotesChange} />
        )}

        {activeTab === 'accuse' && (
          <AccusationScreen
            caseData={caseData}
            gameState={gameState}
            onSubmitAccusation={handleSubmitAccusation}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-nav">
        <button className={`mobile-nav-btn ${activeTab === 'cases' ? 'active' : ''}`} onClick={() => setActiveTab('cases')}>
          <Grid size={20} /> Cases
        </button>
        <button className={`mobile-nav-btn ${activeTab === 'investigate' ? 'active' : ''}`} onClick={() => setActiveTab('investigate')}>
          <Map size={20} /> Explore
        </button>
        <button className={`mobile-nav-btn ${activeTab === 'evidence' ? 'active' : ''}`} onClick={() => setActiveTab('evidence')}>
          <Key size={20} /> Evidence
        </button>
        <button className={`mobile-nav-btn ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
          <Edit3 size={20} /> Notes
        </button>
        <button className={`mobile-nav-btn ${activeTab === 'accuse' ? 'active' : ''}`} onClick={() => setActiveTab('accuse')}>
          <ShieldAlert size={20} /> Accuse
        </button>
      </nav>
    </div>
  );
}
