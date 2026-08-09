const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Load cases dynamically
const casesPath = path.join(__dirname, 'cases');
let cases = [];

function loadCases() {
  try {
    const caseFiles = fs.readdirSync(casesPath).filter(f => f.endsWith('.json'));
    cases = caseFiles.map(file => {
      const data = fs.readFileSync(path.join(casesPath, file), 'utf8');
      return JSON.parse(data);
    });
    console.log(`Loaded ${cases.length} cases.`);
  } catch (e) {
    console.error("Error loading cases:", e);
  }
}

loadCases();

app.get('/api/cases', (req, res) => {
  loadCases(); // Refresh if updated
  const caseSummaries = cases.map(c => ({
    id: c.id,
    title: c.title,
    summary: c.summary,
    genre: c.genre,
    difficulty: c.difficulty,
    playtime: c.playtime,
    themeColor: c.themeColor || '#38bdf8'
  }));
  res.json(caseSummaries);
});

app.get('/api/cases/:id', (req, res) => {
  const caseData = cases.find(c => c.id === req.params.id);
  if (caseData) res.json(caseData);
  else res.status(404).json({ error: "Case not found" });
});

// Socket.io room state management
const rooms = {};

function getDefaultState(caseData) {
  const startingLocations = caseData ? (caseData.startingLocations || [caseData.locations[0]?.id]) : ['crime-scene'];
  return {
    discoveredClues: [],
    unlockedLocations: startingLocations,
    notes: '',
    mechanicState: {},
    accusation: null,
    attemptsLeft: 3,
    solved: false,
    gameOver: false
  };
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomCode, caseId }) => {
    socket.join(roomCode);
    console.log(`User ${socket.id} joined room ${roomCode}`);

    const selectedCase = cases.find(c => c.id === caseId) || cases[0];

    if (!rooms[roomCode]) {
      rooms[roomCode] = {
        caseId: selectedCase ? selectedCase.id : 'dells-diner',
        players: [],
        state: getDefaultState(selectedCase)
      };
    }

    if (!rooms[roomCode].players.includes(socket.id)) {
      rooms[roomCode].players.push(socket.id);
    }

    // Send room metadata & full state
    socket.emit('room-init', {
      caseId: rooms[roomCode].caseId,
      state: rooms[roomCode].state,
      playersCount: rooms[roomCode].players.length
    });

    socket.to(roomCode).emit('player-joined', { playersCount: rooms[roomCode].players.length });
  });

  socket.on('select-case', ({ roomCode, caseId }) => {
    const selectedCase = cases.find(c => c.id === caseId);
    if (rooms[roomCode] && selectedCase) {
      rooms[roomCode].caseId = caseId;
      rooms[roomCode].state = getDefaultState(selectedCase);
      io.to(roomCode).emit('case-changed', {
        caseId,
        state: rooms[roomCode].state
      });
    }
  });

  socket.on('update-state', ({ roomCode, newState }) => {
    if (rooms[roomCode]) {
      rooms[roomCode].state = { ...rooms[roomCode].state, ...newState };
      socket.to(roomCode).emit('room-state', rooms[roomCode].state);
    }
  });

  socket.on('submit-accusation', ({ roomCode, suspectId, selectedClueIds }) => {
    if (!rooms[roomCode]) return;

    const currentCase = cases.find(c => c.id === rooms[roomCode].caseId);
    if (!currentCase || !currentCase.solution) return;

    const sol = currentCase.solution;
    const isCorrectKiller = suspectId === sol.killer;
    
    // Check if all required clues are presented
    const requiredMatch = sol.requiredClues.every(reqClue => selectedClueIds.includes(reqClue));
    const isCorrect = isCorrectKiller && requiredMatch;

    let newState = { ...rooms[roomCode].state };

    if (isCorrect) {
      newState.solved = true;
      newState.gameOver = true;
      newState.accusationResult = {
        success: true,
        explanation: sol.explanation,
        suspectName: currentCase.locations.flatMap(l => l.suspects).find(s => s.id === suspectId)?.name || suspectId
      };
    } else {
      newState.attemptsLeft = Math.max(0, newState.attemptsLeft - 1);
      if (newState.attemptsLeft === 0) {
        newState.gameOver = true;
        newState.accusationResult = {
          success: false,
          explanation: `Investigation failed. The actual killer was ${currentCase.locations.flatMap(l => l.suspects).find(s => s.id === sol.killer)?.name || sol.killer}. ${sol.explanation}`
        };
      } else {
        newState.accusationResult = {
          success: false,
          hint: `Inconclusive evidence or wrong suspect! You have ${newState.attemptsLeft} attempt(s) remaining.`
        };
      }
    }

    rooms[roomCode].state = newState;
    io.to(roomCode).emit('room-state', rooms[roomCode].state);
  });

  socket.on('reset-game', ({ roomCode }) => {
    if (rooms[roomCode]) {
      const selectedCase = cases.find(c => c.id === rooms[roomCode].caseId);
      rooms[roomCode].state = getDefaultState(selectedCase);
      io.to(roomCode).emit('room-state', rooms[roomCode].state);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const code in rooms) {
      rooms[code].players = rooms[code].players.filter(id => id !== socket.id);
      if (rooms[code].players.length === 0) {
        // keep room around briefly or cleanup
      } else {
        io.to(code).emit('player-left', { playersCount: rooms[code].players.length });
      }
    }
  });
});

// Serve static frontend build in production
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
