import React, { useState } from 'react';
import { Clock, Eye, Layers, ShieldCheck, Sparkles, Cpu, FlaskConical } from 'lucide-react';

export default function CaseMechanics({ caseData, gameState, onUpdateState, roomCode }) {
  const type = caseData.mechanicType;

  if (!type) return null;

  const mechanicState = gameState.mechanicState || {};

  return (
    <div className="animate-fade-in glass-panel flex flex-col gap-4 border-amber-500/30">
      <div className="flex items-center gap-2 border-b border-[rgba(148,163,184,0.15)] pb-3">
        <Sparkles size={18} className="text-amber-400" />
        <h3 className="text-base font-bold text-amber-400">
          Special Mechanic: {caseData.mechanicTitle || 'Case Intel'}
        </h3>
      </div>
      <p className="text-xs text-gray-400">{caseData.mechanicDescription}</p>

      {/* Case 1: Timeline Mechanic */}
      {type === 'timeline' && (
        <TimelineMechanic caseData={caseData} mechanicState={mechanicState} onUpdateState={onUpdateState} gameState={gameState} roomCode={roomCode} />
      )}

      {/* Case 2: Passages Mechanic */}
      {type === 'passages' && (
        <PassagesMechanic caseData={caseData} mechanicState={mechanicState} onUpdateState={onUpdateState} gameState={gameState} roomCode={roomCode} />
      )}

      {/* Case 3: Security Logs */}
      {type === 'securityLogs' && (
        <SecurityLogsMechanic caseData={caseData} mechanicState={mechanicState} onUpdateState={onUpdateState} gameState={gameState} roomCode={roomCode} />
      )}

      {/* Case 4: Deduction Board */}
      {type === 'deductionBoard' && (
        <DeductionBoardMechanic caseData={caseData} mechanicState={mechanicState} onUpdateState={onUpdateState} gameState={gameState} roomCode={roomCode} />
      )}

      {/* Case 5: Evidence Lab */}
      {type === 'evidenceLab' && (
        <EvidenceLabMechanic caseData={caseData} mechanicState={mechanicState} onUpdateState={onUpdateState} gameState={gameState} roomCode={roomCode} />
      )}

      {/* Case 6: Decryption Puzzles */}
      {type === 'decryptionPuzzles' && (
        <DecryptionPuzzlesMechanic caseData={caseData} mechanicState={mechanicState} onUpdateState={onUpdateState} gameState={gameState} roomCode={roomCode} />
      )}
    </div>
  );
}

/* 1. Timeline Mechanic */
function TimelineMechanic({ caseData, mechanicState, onUpdateState, gameState, roomCode }) {
  const timelineEntries = [
    { time: '10:30 PM', claim: 'Dot Callahan in Motel Office', fact: 'Confirmed empty by Rosie' },
    { time: '10:45 PM', claim: 'Sheriff Earl on Route 9', fact: 'Verified by County Officer Miller' },
    { time: '10:55 PM', claim: 'Walter departs Dell Diner', fact: 'Rosie eyewitness confirmation' },
    { time: '11:00 PM', claim: 'Murder occurs in Diner Alley', fact: 'Hot coffee mug matches timeframe' }
  ];

  return (
    <div className="flex flex-col gap-2">
      {timelineEntries.map((entry, idx) => (
        <div key={idx} className="p-2.5 rounded bg-[rgba(15,23,42,0.6)] border border-[rgba(148,163,184,0.15)] flex justify-between items-center text-xs">
          <span className="font-bold text-amber-400 flex items-center gap-1"><Clock size={12} /> {entry.time}</span>
          <span className="text-gray-300">{entry.claim}</span>
          <span className="text-emerald-400 font-medium">✓ {entry.fact}</span>
        </div>
      ))}
    </div>
  );
}

/* 2. Passages Mechanic */
function PassagesMechanic({ caseData, mechanicState, onUpdateState, gameState, roomCode }) {
  return (
    <div className="p-3 rounded bg-[rgba(15,23,42,0.6)] border border-purple-500/30 text-xs flex flex-col gap-2">
      <div className="font-bold text-purple-300">🗺️ Secret Passage Network Detected</div>
      <p className="text-gray-400">Bedroom Fireplace Hearth ➔ Revolving Portrait Hall ➔ Chapel Crypt Sub-Tunnels</p>
      <div className="text-emerald-400 font-semibold">✓ Passages Unlocked via Hearth Gargoyle Lever</div>
    </div>
  );
}

/* 3. Security Logs */
function SecurityLogsMechanic({ caseData, mechanicState, onUpdateState, gameState, roomCode }) {
  return (
    <div className="flex flex-col gap-2 text-xs">
      <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
        🎥 <strong>02:42 UTC - Command Bridge:</strong> Terminal-01 override depressurization issued by Commander Volkov.
      </div>
      <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
        🎥 <strong>02:35 UTC - Bio-Lab Cam #4:</strong> Commander Volkov recorded stealing Reyes bio-data drive.
      </div>
    </div>
  );
}

/* 4. Deduction Board */
function DeductionBoardMechanic({ caseData, mechanicState, onUpdateState, gameState, roomCode }) {
  return (
    <div className="p-3 rounded bg-[rgba(15,23,42,0.6)] border border-red-500/30 text-xs flex flex-col gap-2">
      <div className="font-bold text-red-400">♟️ Linked Connections</div>
      <div className="text-gray-300">Handler Ivan Krasnov ➔ Exclusive Thermos Access ➔ Moscow Thallium Ampoule</div>
      <div className="text-amber-400">Motive: Prevent political asylum defection to West.</div>
    </div>
  );
}

/* 5. Evidence Lab */
function EvidenceLabMechanic({ caseData, mechanicState, onUpdateState, gameState, roomCode }) {
  return (
    <div className="p-3 rounded bg-[rgba(15,23,42,0.6)] border border-emerald-500/30 text-xs flex flex-col gap-2">
      <div className="font-bold text-emerald-400 flex items-center gap-1"><FlaskConical size={14} /> Composite Analysis</div>
      <div className="text-gray-300">Raw Spillway Sample + Mass Spectrometer = 100x Benzene Toxicity Proof</div>
    </div>
  );
}

/* 6. Decryption Puzzles */
function DecryptionPuzzlesMechanic({ caseData, mechanicState, onUpdateState, gameState, roomCode }) {
  return (
    <div className="p-3 rounded bg-[rgba(15,23,42,0.6)] border border-pink-500/30 text-xs flex flex-col gap-2 font-mono">
      <div className="font-bold text-pink-400 flex items-center gap-1"><Cpu size={14} /> DECRYPTED SYNAPSE_PURGE.LOG</div>
      <div className="text-gray-300">PURGE_ORDER: DIRECTOR_LIANG ➔ DR_TANAKA [500,000 CREDITS]</div>
    </div>
  );
}
