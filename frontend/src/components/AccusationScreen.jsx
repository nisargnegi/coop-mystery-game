import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, UserX } from 'lucide-react';

export default function AccusationScreen({ caseData, gameState, onSubmitAccusation }) {
  const [selectedSuspectId, setSelectedSuspectId] = useState('');
  const [selectedClueIds, setSelectedClueIds] = useState([]);

  // Extract all unique suspects from case locations
  const allSuspects = (caseData.locations || []).flatMap(l => l.suspects || []);
  const discoveredClueObjs = (caseData.clues || []).filter(c => (gameState.discoveredClues || []).includes(c.id));

  const toggleClueSelect = (clueId) => {
    if (selectedClueIds.includes(clueId)) {
      setSelectedClueIds(selectedClueIds.filter(id => id !== clueId));
    } else {
      if (selectedClueIds.length < 3) {
        setSelectedClueIds([...selectedClueIds, clueId]);
      }
    }
  };

  const handleAccuseSubmit = () => {
    if (selectedSuspectId && selectedClueIds.length === 3) {
      onSubmitAccusation(selectedSuspectId, selectedClueIds);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="glass-panel text-center border-red-500/30">
        <AlertTriangle size={48} className="mx-auto mb-3 text-red-500 animate-pulse" />
        <h2 className="text-2xl font-extrabold text-red-400 mb-1">Make Your Final Accusation</h2>
        <p className="text-xs text-gray-300">
          Review your evidence carefully with your partner. You have <span className="font-bold text-amber-400">{gameState.attemptsLeft ?? 3}</span> attempt(s) remaining.
        </p>
      </div>

      {gameState.accusationResult && !gameState.accusationResult.success && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-xs text-red-200">
          <strong>⚠️ Warning:</strong> {gameState.accusationResult.hint || gameState.accusationResult.explanation}
        </div>
      )}

      {/* Step 1: Select Suspect */}
      <div className="glass-panel">
        <h3 className="text-base font-bold mb-3 flex items-center gap-2 text-amber-400">
          1. Select the Prime Suspect
        </h3>
        <div className="grid grid-2 gap-3">
          {allSuspects.map((suspect) => {
            const isSelected = selectedSuspectId === suspect.id;
            return (
              <button
                key={suspect.id}
                onClick={() => setSelectedSuspectId(suspect.id)}
                className={`p-3 rounded-lg text-left border transition-all ${
                  isSelected 
                    ? 'bg-red-950/50 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                    : 'bg-[rgba(15,23,42,0.6)] border-[rgba(148,163,184,0.15)] text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="font-bold text-sm mb-0.5">{suspect.name}</div>
                <div className="text-xs text-gray-400">{suspect.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Select 3 Essential Evidence Pieces */}
      <div className="glass-panel">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-bold flex items-center gap-2 text-sky-400">
            2. Present 3 Supporting Clues ({selectedClueIds.length}/3)
          </h3>
          <span className="text-xs text-gray-400">Select exactly 3 pieces of proof</span>
        </div>

        <div className="grid grid-2 gap-3">
          {discoveredClueObjs.map((clue) => {
            const isSelected = selectedClueIds.includes(clue.id);
            return (
              <button
                key={clue.id}
                onClick={() => toggleClueSelect(clue.id)}
                className={`p-3 rounded-lg text-left border transition-all ${
                  isSelected 
                    ? 'bg-sky-950/50 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]' 
                    : 'bg-[rgba(15,23,42,0.6)] border-[rgba(148,163,184,0.15)] text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-xs">{clue.name}</span>
                  {isSelected && <CheckCircle2 size={14} className="text-sky-400" />}
                </div>
                <div className="text-[11px] text-gray-400 leading-tight">{clue.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        disabled={!selectedSuspectId || selectedClueIds.length !== 3}
        onClick={handleAccuseSubmit}
        className="btn btn-danger w-full py-4 text-lg font-bold uppercase tracking-wider"
        style={{
          opacity: (!selectedSuspectId || selectedClueIds.length !== 3) ? 0.4 : 1,
          cursor: (!selectedSuspectId || selectedClueIds.length !== 3) ? 'not-allowed' : 'pointer'
        }}
      >
        <ShieldAlert size={22} /> Execute Formal Accusation
      </button>
    </div>
  );
}
